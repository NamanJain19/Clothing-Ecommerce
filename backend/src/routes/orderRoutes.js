const express = require('express');
const router = express.Router();
const {
  createOrder,
  calculateShipping,
  getMyOrders,
  getOrderById,
  getTrackOrder,
  getOrderInvoice,
  downloadOrderInvoicePDF,
  cancelOrder
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');

// All order routes require authentication
router.use(authenticate);

router.post('/calculate-shipping', calculateShipping);

router.route('/')
  .get(getMyOrders)
  .post(createOrder);

router.get('/:id/track', getTrackOrder);
router.get('/:id/invoice/download', downloadOrderInvoicePDF);
router.get('/:id/invoice', getOrderInvoice);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

module.exports = router;
