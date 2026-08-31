const mongoose = require('mongoose');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const {
  createRazorpayOrder,
  verifyPaymentSignature,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET
} = require('../services/razorpayService');
const smsService = require('../services/smsService');
const emailService = require('../services/emailService');

/**
 * @desc    Create Razorpay Order for an existing pending backend Order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
const createPaymentOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid order ID is required'
      });
    }

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or does not belong to you'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This order has already been paid for'
      });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot process payment for a cancelled order'
      });
    }

    if (order.paymentMethod === 'cash_on_delivery') {
      return res.status(400).json({
        success: false,
        message: 'Cash on Delivery orders do not require online payment'
      });
    }

    // Amount in Paise (1 INR = 100 Paise)
    const amountInPaise = Math.round(order.total * 100);

    // Create server-side Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amountInPaise,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        customerEmail: req.user.email
      }
    });

    // Store the server-created Razorpay order ID in our Order document
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: razorpayOrder.keyId
      },
      // Aliased top-level fields for compatibility
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: razorpayOrder.keyId,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Razorpay payment signature and mark order as paid
 * @route   POST /api/payments/verify
 * @access  Private
 */
const verifyPayment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid order ID is required'
      });
    }

    if (!razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment credentials (razorpay_payment_id, razorpay_signature)'
      });
    }

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or does not belong to you'
      });
    }

    // Retrieve server-stored Razorpay order ID (source of truth)
    const serverRazorpayOrderId = order.razorpayOrderId || razorpay_order_id;
    if (!serverRazorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: 'No server-side Razorpay order found for this transaction'
      });
    }

    // Idempotency check: verify if this payment ID was already processed
    const existingPayment = await Payment.findOne({
      razorpayPaymentId: razorpay_payment_id
    });

    if (existingPayment && order.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified and processed',
        order,
        payment: existingPayment
      });
    }

    // Verify cryptographic HMAC-SHA256 signature
    const isValidSignature = verifyPaymentSignature({
      razorpayOrderId: serverRazorpayOrderId,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    if (!isValidSignature) {
      order.paymentStatus = 'failed';
      await order.save();

      // Record failed payment attempt
      await Payment.create({
        order: order._id,
        user: userId,
        razorpayOrderId: serverRazorpayOrderId,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: order.total,
        currency: 'INR',
        paymentMethod: order.paymentMethod || 'upi',
        status: 'failed',
        notes: { failureReason: 'Invalid HMAC signature' }
      }).catch(() => {});

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid cryptographic signature'
      });
    }

    // Create verified Payment record in database
    const paymentDoc = await Payment.create({
      order: order._id,
      user: userId,
      razorpayOrderId: serverRazorpayOrderId,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: order.total,
      currency: 'INR',
      paymentMethod: order.paymentMethod || 'upi',
      status: 'paid'
    });

    // Mark order as paid and confirmed
    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    if (order.orderStatus === 'pending') {
      order.orderStatus = 'confirmed';
    }
    await order.save();

    // Trigger Payment Confirmation & Order Confirmation notifications safely
    try {
      await smsService.sendPaymentConfirmationSms(order);
    } catch (err) {
      console.warn(`[SMS Service Notice] Payment confirmation SMS dispatch: ${err.message}`);
    }

    try {
      await smsService.sendOrderConfirmationSms(order);
    } catch (err) {
      console.warn(`[SMS Service Notice] Order confirmation SMS dispatch: ${err.message}`);
    }

    try {
      await emailService.sendOrderConfirmationEmail(order, req.user);
    } catch (err) {
      console.warn(`[Email Service Notice] Order confirmation email dispatch: ${err.message}`);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      order,
      payment: paymentDoc
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get payment status of an order
 * @route   GET /api/payments/:orderId
 * @access  Private
 */
const getPaymentStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findOne({ _id: orderId, user: userId }).select(
      'orderNumber paymentMethod paymentStatus orderStatus total razorpayOrderId razorpayPaymentId'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const payment = await Payment.findOne({ order: order._id });

    res.status(200).json({
      success: true,
      data: {
        order,
        payment
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET
};
