const Order = require('../models/Order');
const courierService = require('../services/courierService');
const smsService = require('../services/smsService');

/**
 * @desc    Receive and process real-time courier shipping webhook events
 * @route   POST /api/webhooks/shipping
 * @access  Public (Protected via HMAC Signature / Secret Verification)
 */
const handleShippingWebhook = async (req, res, next) => {
  try {
    const signature =
      req.headers['x-courier-signature'] ||
      req.headers['x-shiprocket-signature'] ||
      req.headers['x-signature'] ||
      req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
      '';

    // 1. Verify Webhook Signature / Secret
    const isSignatureValid = courierService.verifyWebhookSignature(
      req.body,
      signature
    );

    if (!isSignatureValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or missing courier webhook signature',
      });
    }

    // 2. Parse & Normalize Webhook Payload
    const updateData = courierService.parseWebhookPayload(req.body);
    if (!updateData || (!updateData.awbNumber && !updateData.shipmentId && !updateData.orderNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook payload: Missing AWB, Shipment ID, or Order Number',
      });
    }

    // 3. Find MongoDB Order by AWB, shipmentId, or orderNumber
    const query = {
      $or: [
        ...(updateData.awbNumber ? [{ awbNumber: updateData.awbNumber }, { trackingNumber: updateData.awbNumber }] : []),
        ...(updateData.shipmentId ? [{ shipmentId: updateData.shipmentId }] : []),
        ...(updateData.orderNumber ? [{ orderNumber: updateData.orderNumber }] : []),
      ],
    };

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order matching courier shipment reference not found',
      });
    }

    // 4. Update Shipment Status
    if (updateData.shipmentStatus) {
      order.shipmentStatus = updateData.shipmentStatus;
    }

    if (updateData.carrier && !order.carrier) {
      order.carrier = updateData.carrier;
    }

    if (updateData.awbNumber && !order.awbNumber) {
      order.awbNumber = updateData.awbNumber;
      order.trackingNumber = updateData.awbNumber;
      order.trackingUrl = courierService.getCarrierTrackingUrl(order.carrier || updateData.carrier, updateData.awbNumber);
    }

    // 5. Update GPS coordinates ONLY if real GPS data was provided in webhook
    if (typeof updateData.courierLatitude === 'number' && typeof updateData.courierLongitude === 'number') {
      order.courierLatitude = updateData.courierLatitude;
      order.courierLongitude = updateData.courierLongitude;
      order.courierLocationUpdated = new Date();
    }

    // 6. Append tracking history milestone without duplicate entries
    const newEvent = {
      status: updateData.shipmentStatus || 'in_transit',
      activity: updateData.activity || `Status updated to ${updateData.rawStatus}`,
      location: updateData.location || '',
      timestamp: updateData.timestamp || new Date(),
      rawStatus: updateData.rawStatus || '',
    };

    const isDuplicate = order.trackingHistory.some(
      (ev) =>
        ev.status === newEvent.status &&
        ev.activity === newEvent.activity &&
        Math.abs(new Date(ev.timestamp).getTime() - new Date(newEvent.timestamp).getTime()) < 5000
    );

    if (!isDuplicate) {
      order.trackingHistory.push(newEvent);
    }

    // 7. Update orderStatus where appropriate
    const mappedOrderStatus = courierService.mapShipmentToOrderStatus(updateData.shipmentStatus);
    if (mappedOrderStatus && order.orderStatus !== 'cancelled') {
      order.orderStatus = mappedOrderStatus;

      // If delivered and payment was COD, automatically mark payment as paid
      if (mappedOrderStatus === 'delivered' && order.paymentMethod === 'cash_on_delivery' && order.paymentStatus === 'pending') {
        order.paymentStatus = 'paid';
      }
    }

    await order.save();

    // 8. Trigger Real Shipping SMS Notifications based on verified courier status
    try {
      if (order.shipmentStatus === 'in_transit' || order.orderStatus === 'shipped') {
        await smsService.sendShippingUpdateSms(order, order.carrier, order.awbNumber);
      } else if (order.shipmentStatus === 'out_for_delivery' || order.orderStatus === 'out_for_delivery') {
        await smsService.sendOutForDeliverySms(order);
      } else if (order.shipmentStatus === 'delivered' || order.orderStatus === 'delivered') {
        await smsService.sendDeliveryConfirmationSms(order);
      }
    } catch (err) {
      console.warn(`[SMS Service Notice] Shipping SMS dispatch error: ${err.message}`);
    }

    res.status(200).json({
      success: true,
      message: 'Courier webhook tracking event processed successfully',
      data: {
        orderNumber: order.orderNumber,
        awbNumber: order.awbNumber,
        shipmentStatus: order.shipmentStatus,
        orderStatus: order.orderStatus,
        latestEvent: newEvent,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleShippingWebhook,
};
