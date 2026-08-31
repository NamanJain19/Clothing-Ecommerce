const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Coupon = require('../../models/Coupon');
const { getOrderTimeline, generateInvoiceNumber, calculateDeliveryDates } = require('../../utils/orderPricing');
const { generateInvoicePDF } = require('../../services/invoiceService');
const courierService = require('../../services/courierService');
const smsService = require('../../services/smsService');
const mongoose = require('mongoose');

/**
 * Format order details with timeline and persistent delivery dates
 */
const formatAdminOrderResponse = (order) => {
  const orderObj = order.toObject ? order.toObject() : order;
  const deliveryInfo = calculateDeliveryDates(orderObj.createdAt || new Date(), orderObj.shippingMethod || 'standard');
  const carrier = orderObj.carrier || (orderObj.shippingMethod === 'express' ? 'Blue Dart Express (Air Priority)' : 'Delhivery Luxury Logistics');
  const awb = orderObj.awbNumber || orderObj.trackingNumber || `MNL-TRK-${orderObj.orderNumber?.replace('ORD-', '')}`;
  const trackingUrl = orderObj.trackingUrl || courierService.getCarrierTrackingUrl(carrier, awb);

  return {
    ...orderObj,
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
    timeline: getOrderTimeline(orderObj.orderStatus, orderObj.createdAt, orderObj.updatedAt)
  };
};

/**
 * @desc    Get all orders for admin
 * @route   GET /api/admin/orders
 * @access  Private (Admin / Manager / Staff)
 */
const getAdminOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      paymentMethod,
      paymentStatus,
      startDate,
      endDate,
      sort
    } = req.query;

    const query = {};

    if (status) query.orderStatus = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'shippingAddress.fullName': searchRegex },
        { 'shippingAddress.phone': searchRegex },
        { 'shippingAddress.city': searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'total_desc') sortOption = { total: -1 };
    else if (sort === 'total_asc') sortOption = { total: 1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'firstName lastName email phone')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      data: orders.map(formatAdminOrderResponse),
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
 * @desc    Get single order details for admin
 * @route   GET /api/admin/orders/:id
 * @access  Private (Admin / Manager / Staff)
 */
const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }

    const order = await Order.findOne(query).populate('user', 'firstName lastName email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: formatAdminOrderResponse(order)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/admin/orders/:id/status
 * @access  Private (Admin / Manager / Staff)
 */
const updateAdminOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const validStatuses = [
      'pending',
      'confirmed',
      'processing',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'returned',
      'refunded'
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Valid statuses: ${validStatuses.join(', ')}`
      });
    }

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Handle cancellation status transition
    if (status === 'cancelled' && order.orderStatus !== 'cancelled') {
      order.orderStatus = 'cancelled';
      order.paymentStatus = 'cancelled';
      order.cancelledAt = new Date();
      order.cancellationReason = notes || 'Cancelled by admin';

      // Restore stock
      for (const item of order.items) {
        if (item.variantId) {
          await Product.updateOne(
            { _id: item.product, 'variants._id': item.variantId },
            { $inc: { 'variants.$.stock': item.quantity, stock: item.quantity } }
          );
        } else {
          await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } }
          );
        }
      }

      if (order.coupon && order.coupon.code) {
        await Coupon.updateOne(
          { code: order.coupon.code, usedCount: { $gt: 0 } },
          { $inc: { usedCount: -1 } }
        );
      }
    } else {
      if (status) order.orderStatus = status;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (notes) order.notes = notes;

      // If delivered and payment was COD, mark paymentStatus as paid
      if (status === 'delivered' && order.paymentMethod === 'cash_on_delivery' && order.paymentStatus === 'pending') {
        order.paymentStatus = 'paid';
      }
    }

    await order.save();

    // Trigger Real Shipping SMS Notifications based on verified status
    if (status === 'shipped' || order.orderStatus === 'shipped') {
      smsService.sendShippingUpdateSms(order, order.carrier, order.awbNumber).catch((err) => {
        console.warn(`[SMS Service Notice] Shipping update SMS dispatch: ${err.message}`);
      });
    } else if (status === 'out_for_delivery' || order.orderStatus === 'out_for_delivery') {
      smsService.sendOutForDeliverySms(order).catch((err) => {
        console.warn(`[SMS Service Notice] Out for delivery SMS dispatch: ${err.message}`);
      });
    } else if (status === 'delivered' || order.orderStatus === 'delivered') {
      smsService.sendDeliveryConfirmationSms(order).catch((err) => {
        console.warn(`[SMS Service Notice] Delivery confirmation SMS dispatch: ${err.message}`);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: formatAdminOrderResponse(order)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order invoice JSON for admin
 * @route   GET /api/admin/orders/:id/invoice
 * @access  Private (Admin / Manager / Staff)
 */
const getAdminOrderInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { format } = req.query;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }

    const order = await Order.findOne(query).populate('user', 'firstName lastName email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!order.invoiceNumber) {
      order.invoiceNumber = generateInvoiceNumber();
      await order.save();
    }

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
 * @desc    Download official PDF invoice for admin
 * @route   GET /api/admin/orders/:id/invoice/download
 * @access  Private (Admin / Manager / Staff)
 */
const getAdminOrderInvoicePDF = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }

    const order = await Order.findOne(query).populate('user', 'firstName lastName email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

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
 * @desc    Generate courier shipment for an order
 * @route   POST /api/admin/orders/:id/shipment
 * @access  Private (Admin / Manager / Staff)
 */
const createAdminShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { carrier, service } = req.body;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }

    const order = await Order.findOne(query).populate('user', 'firstName lastName email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Call courier service
    const shipmentData = await courierService.createShipment(order, { carrier, service });

    order.shipmentId = shipmentData.shipmentId;
    order.awbNumber = shipmentData.awbNumber;
    order.trackingNumber = shipmentData.awbNumber;
    order.carrier = shipmentData.carrier;
    order.carrierService = shipmentData.carrierService;
    order.trackingUrl = shipmentData.trackingUrl;
    order.shipmentStatus = 'manifested';
    if (order.orderStatus === 'pending' || order.orderStatus === 'confirmed') {
      order.orderStatus = 'processing';
    }

    if (!order.trackingHistory || order.trackingHistory.length === 0) {
      order.trackingHistory = shipmentData.trackingHistory;
    } else {
      order.trackingHistory.push(shipmentData.trackingHistory[0]);
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Courier shipment generated successfully',
      data: formatAdminOrderResponse(order),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh live courier tracking from provider
 * @route   POST /api/admin/orders/:id/tracking/refresh
 * @access  Private (Admin / Manager / Staff)
 */
const refreshAdminShipmentTracking = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }

    const order = await Order.findOne(query).populate('user', 'firstName lastName email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const awb = order.awbNumber || order.trackingNumber;
    if (!awb) {
      return res.status(400).json({
        success: false,
        message: 'No AWB / tracking number found for this order. Please generate shipment first.',
      });
    }

    const trackingData = await courierService.trackShipment(awb, order);

    res.status(200).json({
      success: true,
      message: 'Tracking details refreshed from courier provider',
      data: {
        order: formatAdminOrderResponse(order),
        liveTracking: trackingData,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  createAdminShipment,
  refreshAdminShipmentTracking,
  getAdminOrderInvoice,
  getAdminOrderInvoicePDF
};
