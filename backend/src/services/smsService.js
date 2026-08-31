const twilio = require('twilio');
const { normalizePhoneNumber, isValidPhoneNumber } = require('../utils/phoneUtils');
const Order = require('../models/Order');

/**
 * Official Real Twilio SMS Integration Service
 *
 * Implements:
 * 1. Server-side Twilio client authentication with backend-only credentials
 * 2. International E.164 phone normalization (+91 for India)
 * 3. Duplicate SMS protection for order lifecycle events
 * 4. Safe failure handling (Twilio failures never break or rollback orders)
 * 5. Twilio Verify OTP dispatch and verification
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_API_KEY_SID = process.env.TWILIO_API_KEY_SID || '';
const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || '';
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID || 'VA2215b9a0261fe4340a46deb095ed4d27';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3008';

let twilioClient = null;

const getTwilioClient = () => {
  if (twilioClient) return twilioClient;

  if (TWILIO_API_KEY_SID && TWILIO_API_KEY_SECRET && TWILIO_ACCOUNT_SID) {
    twilioClient = twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, { accountSid: TWILIO_ACCOUNT_SID });
  } else if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  return twilioClient;
};

/**
 * Helper: Record SMS notification attempt on MongoDB Order
 */
const recordOrderSms = async (orderId, event, phone, status, messageSid = '', errorMessage = '') => {
  if (!orderId) return;
  try {
    await Order.findByIdAndUpdate(orderId, {
      $push: {
        smsNotifications: {
          event,
          phone,
          messageSid,
          status,
          errorMessage,
          sentAt: new Date(),
        },
      },
    });
  } catch (err) {
    console.warn(`[SMS Service] Failed to record notification for order ${orderId}:`, err.message);
  }
};

const smsService = {
  getTwilioClient,

  /**
   * Send a transactional SMS via Twilio
   * @param {Object} options { to, message, event, orderId }
   * @returns {Promise<Object>} { success, messageSid, status, error }
   */
  sendSms: async ({ to, message, event = 'CUSTOM', orderId = null }) => {
    const normalizedPhone = normalizePhoneNumber(to);
    if (!normalizedPhone) {
      console.warn(`[SMS Service] Invalid phone number provided: ${to}`);
      if (orderId) await recordOrderSms(orderId, event, String(to), 'failed', '', 'Invalid phone number');
      return { success: false, reason: 'invalid_phone', error: 'Invalid phone number format' };
    }

    const client = getTwilioClient();
    if (!client) {
      console.warn('[SMS Service] Twilio credentials are not configured.');
      if (orderId) await recordOrderSms(orderId, event, normalizedPhone, 'failed', '', 'Twilio not configured');
      return { success: false, reason: 'unconfigured', error: 'Twilio client not initialized' };
    }

    try {
      const payload = {
        to: normalizedPhone,
        body: message,
      };

      if (TWILIO_MESSAGING_SERVICE_SID) {
        payload.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID;
      } else if (TWILIO_PHONE_NUMBER) {
        payload.from = TWILIO_PHONE_NUMBER;
      }

      console.log(`[SMS Service] Dispatching SMS (${event}) to ${normalizedPhone}...`);
      const result = await client.messages.create(payload);

      console.log(`[SMS Service] Twilio SMS accepted. SID: ${result.sid}, Status: ${result.status}`);
      if (orderId) {
        await recordOrderSms(orderId, event, normalizedPhone, 'sent', result.sid);
      }

      return {
        success: true,
        messageSid: result.sid,
        status: result.status,
      };
    } catch (err) {
      // Safe error logging: never log sensitive tokens or secrets
      console.error('[SMS Service Error]:', {
        code: err.code,
        status: err.status,
        message: err.message,
        event,
        to: normalizedPhone,
      });

      if (orderId) {
        await recordOrderSms(orderId, event, normalizedPhone, 'failed', '', err.message);
      }

      // Return failure safely without throwing to preserve order stability
      return {
        success: false,
        error: err.message,
        code: err.code,
      };
    }
  },

  /**
   * Order Confirmation SMS (with Duplicate Protection)
   */
  sendOrderConfirmationSms: async (order) => {
    if (!order || !order.shippingAddress?.phone) return { success: false, reason: 'missing_data' };

    // Duplicate Check: Check if ORDER_CONFIRMED was already sent for this order
    const freshOrder = await Order.findById(order._id).select('smsNotifications orderNumber');
    const alreadySent = (freshOrder?.smsNotifications || order.smsNotifications || []).some(
      (n) => n.event === 'ORDER_CONFIRMED'
    );
    if (alreadySent) {
      console.log(`[SMS Service] Order confirmation SMS already sent for ${order.orderNumber}. Skipping.`);
      return { success: true, reason: 'duplicate_prevented' };
    }

    const recipientPhone = order.shippingAddress.phone;
    const formattedAmount = (order.total || 0).toLocaleString('en-IN');
    const message = `MONOLITH: Your order ${order.orderNumber} has been confirmed. Total: ₹${formattedAmount}. Track status at ${FRONTEND_URL}/track-order`;

    return await smsService.sendSms({
      to: recipientPhone,
      message,
      event: 'ORDER_CONFIRMED',
      orderId: order._id,
    });
  },

  /**
   * Payment Confirmation SMS (Triggered only after verified Razorpay success)
   */
  sendPaymentConfirmationSms: async (order) => {
    if (!order || !order.shippingAddress?.phone) return { success: false, reason: 'missing_data' };

    const freshOrder = await Order.findById(order._id).select('smsNotifications orderNumber');
    const alreadySent = (freshOrder?.smsNotifications || order.smsNotifications || []).some(
      (n) => n.event === 'PAYMENT_CONFIRMED'
    );
    if (alreadySent) {
      return { success: true, reason: 'duplicate_prevented' };
    }

    const recipientPhone = order.shippingAddress.phone;
    const formattedAmount = (order.total || 0).toLocaleString('en-IN');
    const message = `MONOLITH: Payment of ₹${formattedAmount} for order ${order.orderNumber} is verified and confirmed. Your bespoke pieces are being prepared for dispatch.`;

    return await smsService.sendSms({
      to: recipientPhone,
      message,
      event: 'PAYMENT_CONFIRMED',
      orderId: order._id,
    });
  },

  /**
   * Shipping / Dispatched SMS (Triggered on confirmed Shiprocket in_transit status)
   */
  sendShippingUpdateSms: async (order, carrier = null, awbNumber = null) => {
    if (!order || !order.shippingAddress?.phone) return { success: false, reason: 'missing_data' };

    const freshOrder = await Order.findById(order._id).select('smsNotifications orderNumber');
    const alreadySent = (freshOrder?.smsNotifications || order.smsNotifications || []).some(
      (n) => n.event === 'SHIPMENT_SHIPPED'
    );
    if (alreadySent) {
      return { success: true, reason: 'duplicate_prevented' };
    }

    const recipientPhone = order.shippingAddress.phone;
    const finalCarrier = carrier || order.carrier || 'Blue Dart Express';
    const finalAwb = awbNumber || order.awbNumber || 'Assigned';
    const message = `MONOLITH: Order ${order.orderNumber} has been dispatched via ${finalCarrier}. AWB: ${finalAwb}. Track: ${FRONTEND_URL}/track-order`;

    return await smsService.sendSms({
      to: recipientPhone,
      message,
      event: 'SHIPMENT_SHIPPED',
      orderId: order._id,
    });
  },

  /**
   * Out for Delivery SMS (Triggered on confirmed Shiprocket out_for_delivery status)
   */
  sendOutForDeliverySms: async (order) => {
    if (!order || !order.shippingAddress?.phone) return { success: false, reason: 'missing_data' };

    const freshOrder = await Order.findById(order._id).select('smsNotifications orderNumber');
    const alreadySent = (freshOrder?.smsNotifications || order.smsNotifications || []).some(
      (n) => n.event === 'OUT_FOR_DELIVERY'
    );
    if (alreadySent) {
      return { success: true, reason: 'duplicate_prevented' };
    }

    const recipientPhone = order.shippingAddress.phone;
    const message = `MONOLITH: Order ${order.orderNumber} is out for delivery today. Please ensure someone is available at your destination address.`;

    return await smsService.sendSms({
      to: recipientPhone,
      message,
      event: 'OUT_FOR_DELIVERY',
      orderId: order._id,
    });
  },

  /**
   * Delivered Confirmation SMS (Triggered on confirmed Shiprocket delivered status)
   */
  sendDeliveryConfirmationSms: async (order) => {
    if (!order || !order.shippingAddress?.phone) return { success: false, reason: 'missing_data' };

    const freshOrder = await Order.findById(order._id).select('smsNotifications orderNumber');
    const alreadySent = (freshOrder?.smsNotifications || order.smsNotifications || []).some(
      (n) => n.event === 'ORDER_DELIVERED'
    );
    if (alreadySent) {
      return { success: true, reason: 'duplicate_prevented' };
    }

    const recipientPhone = order.shippingAddress.phone;
    const message = `MONOLITH: Order ${order.orderNumber} has been delivered successfully. Thank you for choosing MONOLITH Luxury Atelier.`;

    return await smsService.sendSms({
      to: recipientPhone,
      message,
      event: 'ORDER_DELIVERED',
      orderId: order._id,
    });
  },

  /**
   * Twilio Verify: Dispatch 6-digit OTP SMS
   */
  sendOtpSms: async (phone) => {
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone) {
      return { success: false, error: 'Invalid phone number format. Please provide a valid 10-digit number.' };
    }

    const client = getTwilioClient();
    if (!client) {
      return { success: false, error: 'Twilio SMS service not configured.' };
    }

    try {
      console.log(`[Twilio Verify] Requesting OTP verification for ${normalizedPhone}...`);
      const verification = await client.verify.v2
        .services(TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({
          to: normalizedPhone,
          channel: 'sms',
        });

      console.log(`[Twilio Verify] Verification initiated. Status: ${verification.status}, SID: ${verification.sid}`);
      return {
        success: true,
        status: verification.status,
        sid: verification.sid,
        to: normalizedPhone,
      };
    } catch (err) {
      console.error('[Twilio Verify Error]:', {
        code: err.code,
        status: err.status,
        message: err.message,
      });

      return {
        success: false,
        code: err.code,
        error: err.message,
      };
    }
  },

  /**
   * Twilio Verify: Check submitted OTP code
   */
  verifyOtpSms: async (phone, code) => {
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone || !code) {
      return { success: false, error: 'Phone number and verification code are required.' };
    }

    const client = getTwilioClient();
    if (!client) {
      return { success: false, error: 'Twilio SMS service not configured.' };
    }

    try {
      console.log(`[Twilio Verify] Checking OTP code for ${normalizedPhone}...`);
      const check = await client.verify.v2
        .services(TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
          to: normalizedPhone,
          code: String(code).trim(),
        });

      console.log(`[Twilio Verify] Check result: ${check.status}`);
      return {
        success: check.status === 'approved',
        status: check.status,
        valid: check.status === 'approved',
      };
    } catch (err) {
      console.error('[Twilio Verify Check Error]:', err.message);
      return {
        success: false,
        valid: false,
        error: err.message,
      };
    }
  },
};

module.exports = smsService;
