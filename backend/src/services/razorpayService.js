const crypto = require('crypto');
const Razorpay = require('razorpay');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_TW5IeYonvfA4DG';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'Sn06bzIDovwaeJwZUPH3Vg2i';

let razorpayInstance = null;

try {
  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
  }
} catch (error) {
  console.error('Failed to initialize Razorpay SDK instance:', error.message);
}

/**
 * Create a REAL server-side Razorpay Order in Test Mode
 * @param {Object} params
 * @param {number} params.amountInPaise
 * @param {string} params.currency
 * @param {string} params.receipt
 * @param {Object} params.notes
 */
const createRazorpayOrder = async ({ amountInPaise, currency = 'INR', receipt, notes = {} }) => {
  if (!razorpayInstance) {
    throw new Error('Razorpay SDK is not initialized. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
  }

  if (!amountInPaise || amountInPaise <= 0) {
    throw new Error('Invalid order amount for Razorpay transaction.');
  }

  // Create real Razorpay Test Order
  const order = await razorpayInstance.orders.create({
    amount: Math.round(amountInPaise),
    currency,
    receipt: receipt ? receipt.substring(0, 40) : `rcpt_${Date.now()}`,
    notes
  });

  return {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: RAZORPAY_KEY_ID
  };
};

/**
 * Verify Razorpay HMAC-SHA256 signature using timing-safe cryptographic comparison
 * @param {Object} params
 * @param {string} params.razorpayOrderId
 * @param {string} params.razorpayPaymentId
 * @param {string} params.razorpaySignature
 */
const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  if (!RAZORPAY_KEY_SECRET) {
    console.error('RAZORPAY_KEY_SECRET is missing during signature verification.');
    return false;
  }

  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(payload.toString())
    .digest('hex');

  try {
    const generatedBuffer = Buffer.from(generatedSignature, 'hex');
    const receivedBuffer = Buffer.from(razorpaySignature, 'hex');

    if (generatedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(generatedBuffer, receivedBuffer);
  } catch (err) {
    console.error('Error during signature comparison:', err);
    return false;
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET
};
