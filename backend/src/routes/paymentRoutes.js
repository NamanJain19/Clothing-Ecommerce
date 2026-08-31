const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus
} = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');
const { paymentLimiter } = require('../middleware/rateLimiter');

// All payment routes require customer authentication
router.use(authenticate);

router.post('/create-order', paymentLimiter, createPaymentOrder);
router.post('/verify', paymentLimiter, verifyPayment);
router.get('/:orderId', getPaymentStatus);

module.exports = router;
