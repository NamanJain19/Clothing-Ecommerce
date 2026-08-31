const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} = require('../controllers/couponController');
const { optionalAuth } = require('../middleware/authMiddleware');

// Validate coupon endpoint (must be before /:id)
router.post('/validate', optionalAuth, validateCoupon);

// CRUD routes
router.route('/')
  .get(getCoupons)
  .post(createCoupon);

router.route('/:id')
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
