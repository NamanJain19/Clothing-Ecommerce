const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const {
  generateOrderNumber,
  generateTrackingNumber,
  generateInvoiceNumber,
  getEstimatedDelivery,
  calculateOrderPricing,
  calculateDeliveryDates,
  getOrderTimeline
} = require('../utils/orderPricing');
const { validateAndCalculateCoupon } = require('../utils/couponValidator');
const { generateInvoicePDF } = require('../services/invoiceService');
const courierService = require('../services/courierService');
const smsService = require('../services/smsService');
const emailService = require('../services/emailService');

/**
 * Format order details response with timeline and delivery data
 */
const formatOrderResponse = (order) => {
  const orderObj = order.toObject ? order.toObject() : order;
  const deliveryInfo = calculateDeliveryDates(orderObj.createdAt || new Date(), orderObj.shippingMethod || 'standard');
  const carrier = orderObj.carrier || (orderObj.shippingMethod === 'express' ? 'Blue Dart Express (Air Priority)' : 'Delhivery Luxury Logistics');
  const awb = orderObj.awbNumber || orderObj.trackingNumber || `MNL-TRK-${orderObj.orderNumber?.replace('ORD-', '')}`;
  const trackingUrl = orderObj.trackingUrl || courierService.getCarrierTrackingUrl(carrier, awb);

  return {
    ...orderObj,
    shippingMethod: orderObj.shippingMethod || 'standard',
    estimatedDeliveryDate: orderObj.estimatedDeliveryDate || deliveryInfo.estimatedDeliveryDate,
    estimatedDeliveryMinDate: orderObj.estimatedDeliveryMinDate || deliveryInfo.estimatedDeliveryMinDate,
    estimatedDeliveryMaxDate: orderObj.estimatedDeliveryMaxDate || deliveryInfo.estimatedDeliveryMaxDate,
    estimatedDelivery: orderObj.estimatedDelivery || deliveryInfo.estimatedDelivery,
    trackingNumber: awb,
    awbNumber: awb,
    shipmentId: orderObj.shipmentId || null,
    carrier,
    carrierService: orderObj.carrierService || 'White-Glove Courier',
    trackingUrl,
    shipmentStatus: orderObj.shipmentStatus || 'pending',
    trackingHistory: orderObj.trackingHistory || [],
    courierLatitude: orderObj.courierLatitude || null,
    courierLongitude: orderObj.courierLongitude || null,
    courierLocationUpdated: orderObj.courierLocationUpdated || null,
    invoiceNumber: orderObj.invoiceNumber || `INV-${orderObj.orderNumber?.replace('ORD-', '')}`,
    timeline: getOrderTimeline(orderObj.orderStatus, orderObj.createdAt, orderObj.updatedAt)
  };
};

/**
 * @desc    Calculate shipping options & fees
 * @route   POST /api/orders/calculate-shipping
 * @access  Private
 */
const calculateShipping = async (req, res, next) => {
  try {
    const { subtotal = 0, shippingMethod = 'standard' } = req.body;
    const numSubtotal = Math.max(0, Number(subtotal) || 0);

    const standardPricing = calculateOrderPricing(numSubtotal, 0, 'standard');
    const expressPricing = calculateOrderPricing(numSubtotal, 0, 'express');

    res.status(200).json({
      success: true,
      data: {
        subtotal: numSubtotal,
        selectedMethod: shippingMethod,
        options: [
          {
            id: 'standard',
            name: 'Standard White-Glove Delivery',
            fee: standardPricing.shippingFee,
            estimatedDelivery: standardPricing.estimatedDelivery,
            estimatedDeliveryDate: standardPricing.estimatedDeliveryDate,
            estimatedDeliveryMinDate: standardPricing.estimatedDeliveryMinDate,
            estimatedDeliveryMaxDate: standardPricing.estimatedDeliveryMaxDate,
            isFree: standardPricing.shippingFee === 0,
            freeThreshold: 1999
          },
          {
            id: 'express',
            name: 'Priority Express Atelier Dispatch',
            fee: expressPricing.shippingFee,
            estimatedDelivery: expressPricing.estimatedDelivery,
            estimatedDeliveryDate: expressPricing.estimatedDeliveryDate,
            estimatedDeliveryMinDate: expressPricing.estimatedDeliveryMinDate,
            estimatedDeliveryMaxDate: expressPricing.estimatedDeliveryMaxDate,
            isFree: false
          }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new order from the user's cart
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      shippingAddressId,
      billingAddressId,
      paymentMethod = 'cash_on_delivery',
      shippingMethod = 'standard',
      couponCode,
      notes
    } = req.body;

    // 1. Validate shipping address
    if (!shippingAddressId || !mongoose.Types.ObjectId.isValid(shippingAddressId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid shipping address ID is required'
      });
    }

    const shippingAddressDoc = await Address.findOne({
      _id: shippingAddressId,
      user: userId
    });

    if (!shippingAddressDoc) {
      return res.status(404).json({
        success: false,
        message: 'Shipping address not found or does not belong to you'
      });
    }

    // 2. Validate billing address (optional, defaults to shipping address)
    let billingAddressDoc = shippingAddressDoc;
    if (billingAddressId && billingAddressId !== shippingAddressId) {
      if (!mongoose.Types.ObjectId.isValid(billingAddressId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid billing address ID'
        });
      }
      billingAddressDoc = await Address.findOne({
        _id: billingAddressId,
        user: userId
      });
      if (!billingAddressDoc) {
        return res.status(404).json({
          success: false,
          message: 'Billing address not found or does not belong to you'
        });
      }
    }

    // 3. Validate payment method
    const allowedPaymentMethods = [
      'cash_on_delivery',
      'upi',
      'credit_debit_card',
      'net_banking',
      'account'
    ];
    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Allowed: ${allowedPaymentMethods.join(', ')}`
      });
    }

    // 4. Fetch user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Cannot create an order.'
      });
    }

    // 5. Build order items & validate live inventory
    let calculatedSubtotal = 0;
    const orderItems = [];
    const stockUpdates = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `A product in your cart is no longer available: ${item.name || 'Unknown item'}`
        });
      }

      // Check variant or main stock
      let availableStock = product.stock;
      let targetSku = product.sku || '';

      if (item.variantId) {
        const variant = product.variants?.id(item.variantId);
        if (!variant) {
          return res.status(400).json({
            success: false,
            message: `Selected variant for "${product.name}" is invalid`
          });
        }
        availableStock = variant.stock;
        targetSku = variant.sku || targetSku;
      }

      if (availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${availableStock}, Requested: ${item.quantity}`
        });
      }

      const itemPrice = item.price || product.price;
      const itemTotal = itemPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      orderItems.push({
        product: product._id,
        variantId: item.variantId || null,
        name: product.name,
        image: item.image || product.images?.[0] || product.thumbnail || '',
        sku: targetSku,
        size: item.size || 'M',
        color: item.color || 'Standard',
        quantity: item.quantity,
        price: itemPrice
      });

      stockUpdates.push({
        productId: product._id,
        variantId: item.variantId || null,
        quantity: item.quantity,
        type: item.variantId ? 'variant' : 'product'
      });
    }

    // 6. Validate Coupon if provided
    let calculatedDiscount = 0;
    let appliedCouponData = null;

    if (couponCode && couponCode.trim()) {
      const couponValidation = await validateAndCalculateCoupon(
        couponCode.trim(),
        userId,
        calculatedSubtotal
      );

      if (!couponValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: couponValidation.message
        });
      }

      calculatedDiscount = couponValidation.discountAmount;
      appliedCouponData = {
        code: couponValidation.coupon.code,
        discountAmount: calculatedDiscount
      };
    }

    // 7. Calculate pricing breakdown with shipping method
    const validShippingMethod = shippingMethod === 'express' ? 'express' : 'standard';
    const pricing = calculateOrderPricing(calculatedSubtotal, calculatedDiscount, validShippingMethod);

    // 8. Create Address Snapshots with coordinates
    const createAddressSnapshot = (doc) => ({
      fullName: doc.fullName,
      phone: doc.phone,
      addressLine1: doc.addressLine1,
      addressLine2: doc.addressLine2 || '',
      city: doc.city,
      state: doc.state,
      postalCode: doc.postalCode,
      country: doc.country || 'India',
      landmark: doc.landmark || '',
      addressType: doc.addressType || 'home',
      latitude: doc.latitude !== undefined && doc.latitude !== null ? Number(doc.latitude) : null,
      longitude: doc.longitude !== undefined && doc.longitude !== null ? Number(doc.longitude) : null,
      formattedAddress: doc.formattedAddress || ''
    });

    const shippingSnapshot = createAddressSnapshot(shippingAddressDoc);
    const billingSnapshot = createAddressSnapshot(billingAddressDoc);

    // 9. Determine initial statuses
    let initialOrderStatus = 'pending';
    let initialPaymentStatus = 'pending';

    if (paymentMethod === 'cash_on_delivery') {
      initialOrderStatus = 'confirmed';
      initialPaymentStatus = 'pending';
    }

    // 10. Generate unique identifiers and server-side delivery calculation
    const orderNumber = generateOrderNumber();
    const invoiceNumber = generateInvoiceNumber();
    const orderDate = new Date();
    const deliveryInfo = calculateDeliveryDates(orderDate, validShippingMethod);

    // Initialize Courier Shipment with Shiprocket provider
    let shipmentData = {
      shipmentId: null,
      awbNumber: '',
      carrier: validShippingMethod === 'express' ? 'Blue Dart Express (Air Priority)' : 'Delhivery Luxury Logistics',
      carrierService: validShippingMethod === 'express' ? 'Priority Express Air' : 'Standard White-Glove Surface',
      trackingUrl: '',
      shipmentStatus: 'manifested',
      trackingHistory: [],
    };

    try {
      shipmentData = await courierService.createShipment({
        orderNumber,
        createdAt: orderDate,
        items: orderItems,
        subtotal: pricing.subtotal,
        total: pricing.total,
        discount: pricing.discount,
        shippingFee: pricing.shippingFee,
        paymentMethod,
        shippingMethod: validShippingMethod,
        estimatedDeliveryDate: deliveryInfo.estimatedDeliveryDate,
        shippingAddress: shippingSnapshot,
        user: req.user
      });
    } catch (courierErr) {
      console.warn('Real-time Shiprocket dispatch notice:', courierErr.message);
    }

    const awbNumber = shipmentData.awbNumber || `SR-${orderNumber.replace('ORD-', '')}`;
    const trackingNumber = awbNumber;

    // 11. Create Order Document in MongoDB with persistent delivery estimate and courier metadata
    const order = await Order.create({
      orderNumber,
      user: userId,
      items: orderItems,
      shippingAddress: shippingSnapshot,
      billingAddress: billingSnapshot,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      shippingFee: pricing.shippingFee,
      tax: pricing.tax,
      total: pricing.total,
      shippingMethod: validShippingMethod,
      estimatedDelivery: deliveryInfo.estimatedDelivery,
      estimatedDeliveryDate: deliveryInfo.estimatedDeliveryDate,
      estimatedDeliveryMinDate: deliveryInfo.estimatedDeliveryMinDate,
      estimatedDeliveryMaxDate: deliveryInfo.estimatedDeliveryMaxDate,
      trackingNumber,
      awbNumber,
      shiprocketOrderId: shipmentData.shiprocketOrderId || null,
      shiprocketShipmentId: shipmentData.shiprocketShipmentId || null,
      shiprocketStatus: shipmentData.shiprocketStatus || '',
      courierCompanyId: shipmentData.courierCompanyId || null,
      shipmentId: shipmentData.shipmentId || null,
      carrier: shipmentData.carrier || '',
      courierName: shipmentData.courierName || shipmentData.carrier || '',
      carrierService: shipmentData.carrierService || 'Standard White-Glove Courier',
      trackingUrl: shipmentData.trackingUrl || '',
      shipmentStatus: shipmentData.shipmentStatus || 'manifested',
      trackingHistory: shipmentData.trackingHistory || [],
      courierLatitude: null,
      courierLongitude: null,
      invoiceNumber,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
      coupon: appliedCouponData,
      notes: notes ? notes.trim() : ''
    });

    // 12. Increment coupon usedCount if coupon applied
    if (appliedCouponData && appliedCouponData.code) {
      await Coupon.updateOne(
        { code: appliedCouponData.code },
        { $inc: { usedCount: 1 } }
      );
    }

    // 13. Deduct Stock safely
    for (const update of stockUpdates) {
      if (update.type === 'variant') {
        await Product.updateOne(
          { _id: update.productId, 'variants._id': update.variantId },
          {
            $inc: {
              'variants.$.stock': -update.quantity,
              stock: -update.quantity
            }
          }
        );
      } else {
        await Product.updateOne(
          { _id: update.productId },
          {
            $inc: {
              stock: -update.quantity
            }
          }
        );
      }
    }

    // 14. Clear user's cart
    cart.items = [];
    await cart.save();

    // 15. Transactional Notifications (COD orders confirmed immediately; online orders confirmed after Razorpay verification)
    if (order.paymentMethod === 'cash_on_delivery') {
      try {
        await smsService.sendOrderConfirmationSms(order);
      } catch (err) {
        console.warn(`[SMS Service Notice] COD Order confirmation SMS dispatch: ${err.message}`);
      }

      try {
        await emailService.sendOrderConfirmationEmail(order, req.user);
      } catch (err) {
        console.warn(`[Email Service Notice] COD Order confirmation email dispatch: ${err.message}`);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: formatOrderResponse(order)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get authenticated user's orders
 * @route   GET /api/orders
 * @access  Private
 */
const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: userId };
    if (status) {
      if (status === 'in_transit') {
        query.orderStatus = { $in: ['confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery'] };
      } else if (status === 'completed') {
        query.orderStatus = 'delivered';
      } else if (status === 'cancelled') {
        query.orderStatus = 'cancelled';
      } else {
        query.orderStatus = status;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders.map(formatOrderResponse),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complete order details by ID, orderNumber, or trackingNumber
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = {
      user: userId,
      $or: [
        ...(isMongoId ? [{ _id: id }] : []),
        { orderNumber: id },
        { trackingNumber: id }
      ]
    };

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: formatOrderResponse(order)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get official invoice details for an order
 * @desc    Get order invoice data (JSON) or generate & stream official PDF
 * @route   GET /api/orders/:id/invoice
 * @access  Private (Owner or Admin)
 */
const getOrderInvoice = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { id } = req.params;
    const { format } = req.query;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = {
      $or: [
        ...(isMongoId ? [{ _id: id }] : []),
        { orderNumber: id },
        { trackingNumber: id }
      ]
    };

    // If not admin/staff, enforce customer ownership
    if (!['admin', 'manager', 'staff'].includes(userRole)) {
      query.user = userId;
    }

    const order = await Order.findOne(query).populate('user', 'firstName lastName email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found or unauthorized access'
      });
    }

    // Ensure invoiceNumber is persistent
    if (!order.invoiceNumber) {
      order.invoiceNumber = generateInvoiceNumber();
      await order.save();
    }

    // If PDF format requested, stream PDF directly
    if (format === 'pdf' || req.headers.accept?.includes('application/pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="Invoice-${order.invoiceNumber}.pdf"`);
      return generateInvoicePDF(order, res);
    }

    const invoiceData = {
      invoiceNumber: order.invoiceNumber,
      invoiceDate: order.createdAt,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      atelier: {
        brandName: 'MONOLITH LUXURY ATELIER',
        legalEntity: 'Monolith Haute Horlogerie & Fashion Private Limited',
        address: 'Worli Sea Face Atelier, Flagship Horizon Tower 01',
        city: 'Mumbai, Maharashtra 400030, India',
        gstin: '27AABCM8923M1Z8',
        email: 'concierge@monolithluxury.com',
        phone: '+91 22 8923 0000',
        website: 'https://monolithluxury.com'
      },
      customer: {
        name: order.shippingAddress.fullName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
        email: order.user?.email || '',
        phone: order.shippingAddress.phone || order.user?.phone || '',
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress || order.shippingAddress
      },
      items: order.items.map(item => ({
        name: item.name,
        sku: item.sku || 'MNL-ATELIER',
        size: item.size || 'M',
        color: item.color || 'Standard',
        quantity: item.quantity,
        unitPrice: item.price,
        itemTotal: item.price * item.quantity
      })),
      pricing: {
        subtotal: order.subtotal,
        discount: order.discount || 0,
        shippingFee: order.shippingFee || 0,
        shippingMethod: order.shippingMethod || 'standard',
        tax: order.tax || 0,
        total: order.total,
        currency: 'INR',
        currencySymbol: '₹'
      },
      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus,
        razorpayOrderId: order.razorpayOrderId || null,
        razorpayPaymentId: order.razorpayPaymentId || null,
        isPaid: order.paymentStatus === 'paid'
      },
      fulfillment: {
        orderStatus: order.orderStatus,
        trackingNumber: order.trackingNumber || `MNL-TRK-${order.orderNumber.replace('ORD-', '')}`,
        carrier: 'Blue Dart Apex Express / White-Glove Atelier Courier'
      }
    };

    res.status(200).json({
      success: true,
      invoice: invoiceData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download official PDF invoice for order
 * @route   GET /api/orders/:id/invoice/download
 * @access  Private (Owner or Admin)
 */
const downloadOrderInvoicePDF = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { id } = req.params;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = {
      $or: [
        ...(isMongoId ? [{ _id: id }] : []),
        { orderNumber: id },
        { trackingNumber: id }
      ]
    };

    // If not admin/staff, enforce customer ownership
    if (!['admin', 'manager', 'staff'].includes(userRole)) {
      query.user = userId;
    }

    const order = await Order.findOne(query).populate('user', 'firstName lastName email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found or unauthorized access'
      });
    }

    // Ensure invoiceNumber is persistent
    if (!order.invoiceNumber) {
      order.invoiceNumber = generateInvoiceNumber();
      await order.save();
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Invoice-${order.invoiceNumber}.pdf"`);
    return generateInvoicePDF(order, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel an eligible order
 * @route   PATCH /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { reason } = req.body;

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = {
      user: userId,
      $or: [
        ...(isMongoId ? [{ _id: id }] : []),
        { orderNumber: id }
      ]
    };

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const uncancelableStatuses = [
      'shipped',
      'out_for_delivery',
      'delivered',
      'returned',
      'refunded',
      'cancelled'
    ];

    if (uncancelableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus.replace('_', ' ')}`
      });
    }

    order.orderStatus = 'cancelled';
    order.paymentStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason ? reason.trim() : 'Cancelled by customer';

    await order.save();

    // Restore stock
    for (const item of order.items) {
      if (item.variantId) {
        await Product.updateOne(
          { _id: item.product, 'variants._id': item.variantId },
          {
            $inc: {
              'variants.$.stock': item.quantity,
              stock: item.quantity
            }
          }
        );
      } else {
        await Product.updateOne(
          { _id: item.product },
          {
            $inc: {
              stock: item.quantity
            }
          }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: formatOrderResponse(order)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tracking details for a specific order / AWB
 * @route   GET /api/orders/:id/track
 * @access  Private (Authenticated User Ownership Verified)
 */
const getTrackOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.$or = [{ orderNumber: id }, { awbNumber: id }, { trackingNumber: id }, { shipmentId: id }];
    }

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order matching tracking reference not found',
      });
    }

    // Privacy & Authorization Enforcement: Customer A cannot view Customer B's shipment
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to track this shipment',
      });
    }

    // Fetch live tracking from courier provider
    const liveTracking = await courierService.trackShipment(order.awbNumber || order.trackingNumber, order);

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        shipmentId: order.shipmentId || liveTracking.shipmentId,
        awbNumber: order.awbNumber || order.trackingNumber,
        carrier: order.carrier || liveTracking.carrier,
        carrierService: order.carrierService || liveTracking.carrierService,
        trackingUrl: order.trackingUrl || liveTracking.trackingUrl,
        shipmentStatus: order.shipmentStatus || liveTracking.shipmentStatus,
        orderStatus: order.orderStatus,
        estimatedDelivery: order.estimatedDelivery,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        trackingHistory: order.trackingHistory?.length ? order.trackingHistory : liveTracking.trackingHistory,
        shippingAddress: order.shippingAddress,
        courierLatitude: order.courierLatitude, // real GPS only if provided
        courierLongitude: order.courierLongitude,
        courierLocationUpdated: order.courierLocationUpdated,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  calculateShipping,
  getMyOrders,
  getOrderById,
  getTrackOrder,
  getOrderInvoice,
  downloadOrderInvoicePDF,
  cancelOrder
};
