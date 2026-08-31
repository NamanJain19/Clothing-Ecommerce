const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { validateAndCalculateCoupon } = require('../utils/couponValidator');

/**
 * @desc    Get all coupons
 * @route   GET /api/coupons
 * @access  Public (Admin in future)
 */
const getCoupons = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    const coupons = await Coupon.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single coupon by ID or code
 * @route   GET /api/coupons/:id
 * @access  Public
 */
const getCouponById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let coupon;
    if (mongoose.Types.ObjectId.isValid(id)) {
      coupon = await Coupon.findById(id);
    } else {
      coupon = await Coupon.findOne({ code: id.toUpperCase() });
    }

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new coupon
 * @route   POST /api/coupons
 * @access  Public (Admin in future)
 */
const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      perUserLimit,
      startDate,
      endDate,
      isActive,
      applicableProducts,
      applicableCategories,
      applicableCollections
    } = req.body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    if (discountValue === undefined || typeof discountValue !== 'number' || discountValue < 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid non-negative discount value is required'
      });
    }

    const normalizedCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: normalizedCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Coupon with this code already exists'
      });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      description: description ? description.trim() : '',
      discountType: discountType || 'percentage',
      discountValue,
      minimumOrderAmount: minimumOrderAmount || 0,
      maximumDiscount: maximumDiscount || null,
      usageLimit: usageLimit || null,
      perUserLimit: perUserLimit || 1,
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: isActive !== undefined ? isActive : true,
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      applicableCollections: applicableCollections || []
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Coupon with this code already exists'
      });
    }
    next(error);
  }
};

/**
 * @desc    Update coupon
 * @route   PUT /api/coupons/:id
 * @access  Public (Admin in future)
 */
const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID format'
      });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      perUserLimit,
      startDate,
      endDate,
      isActive,
      applicableProducts,
      applicableCategories,
      applicableCollections
    } = req.body;

    if (code) coupon.code = code.trim().toUpperCase();
    if (description !== undefined) coupon.description = description.trim();
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minimumOrderAmount !== undefined) coupon.minimumOrderAmount = minimumOrderAmount;
    if (maximumDiscount !== undefined) coupon.maximumDiscount = maximumDiscount;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (perUserLimit !== undefined) coupon.perUserLimit = perUserLimit;
    if (startDate !== undefined) coupon.startDate = startDate;
    if (endDate !== undefined) coupon.endDate = endDate;
    if (isActive !== undefined) coupon.isActive = isActive;
    if (applicableProducts !== undefined) coupon.applicableProducts = applicableProducts;
    if (applicableCategories !== undefined) coupon.applicableCategories = applicableCategories;
    if (applicableCollections !== undefined) coupon.applicableCollections = applicableCollections;

    await coupon.save();

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Coupon with this code already exists'
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete coupon
 * @route   DELETE /api/coupons/:id
 * @access  Public (Admin in future)
 */
const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID format'
      });
    }

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Validate a coupon against cart / subtotal
 * @route   POST /api/coupons/validate
 * @access  Public / Authenticated
 */
const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal, cartItems } = req.body;
    const userId = req.user ? req.user._id : null;

    let itemsToVerify = cartItems || [];
    let calculatedSubtotal = Number(subtotal) || 0;

    // If subtotal wasn't provided or user is authenticated without payload, pull from user's cart
    if ((!calculatedSubtotal || itemsToVerify.length === 0) && userId) {
      const cart = await Cart.findOne({ user: userId });
      if (cart && cart.items.length > 0) {
        itemsToVerify = cart.items;
        calculatedSubtotal = cart.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      }
    }

    const validation = await validateAndCalculateCoupon(
      code,
      userId,
      itemsToVerify,
      calculatedSubtotal
    );

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon is valid',
      data: {
        code: validation.coupon.code,
        description: validation.coupon.description,
        discountType: validation.coupon.discountType,
        discountValue: validation.coupon.discountValue,
        discountAmount: validation.discountAmount,
        minimumOrderAmount: validation.coupon.minimumOrderAmount,
        maximumDiscount: validation.coupon.maximumDiscount,
        eligibleSubtotal: validation.eligibleSubtotal
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
};
