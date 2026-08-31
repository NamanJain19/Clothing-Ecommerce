const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

/**
 * @desc    Get current user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: 'products',
      select: 'name slug price compareAtPrice discountPercentage thumbnail images rating reviewCount stock isActive brand category',
      populate: {
        path: 'category',
        select: 'name slug'
      }
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      data: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a product to wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private
 */
const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is currently unavailable'
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    // Check if product is already in wishlist
    const alreadyExists = wishlist.products.some(
      p => p.toString() === productId.toString()
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: 'Product is already in your wishlist'
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    await wishlist.populate({
      path: 'products',
      select: 'name slug price compareAtPrice discountPercentage thumbnail images rating reviewCount stock isActive brand category',
      populate: {
        path: 'category',
        select: 'name slug'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      count: wishlist.products.length,
      data: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove a product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    const initialLength = wishlist.products.length;
    wishlist.products = wishlist.products.filter(
      p => p.toString() !== productId.toString()
    );

    if (wishlist.products.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    await wishlist.save();

    await wishlist.populate({
      path: 'products',
      select: 'name slug price compareAtPrice discountPercentage thumbnail images rating reviewCount stock isActive brand category',
      populate: {
        path: 'category',
        select: 'name slug'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      count: wishlist.products.length,
      data: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear entire wishlist
 * @route   DELETE /api/wishlist
 * @access  Private
 */
const clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    } else {
      wishlist.products = [];
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      count: 0,
      data: []
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
};
