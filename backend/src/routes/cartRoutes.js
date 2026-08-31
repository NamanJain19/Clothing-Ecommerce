const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');

// All cart routes are protected
router.use(authenticate);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/items/:itemId')
  .put(updateCartItem)
  .delete(removeCartItem);

module.exports = router;
