const Review = require('../../models/Review');
const { updateProductRating } = require('../../utils/ratingCalculator');
const mongoose = require('mongoose');

/**
 * @desc    Get all reviews for admin moderation
 * @route   GET /api/admin/reviews
 * @access  Private (Admin / Manager / Staff)
 */
const getAdminReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, rating, productId } = req.query;

    const query = {};

    if (status === 'approved') query.isApproved = true;
    else if (status === 'pending') query.isApproved = false;

    if (rating) query.rating = Number(rating);
    if (productId && mongoose.Types.ObjectId.isValid(productId)) query.product = productId;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('product', 'name sku thumbnail images')
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      data: reviews,
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
 * @desc    Get single review details
 * @route   GET /api/admin/reviews/:id
 * @access  Private (Admin / Manager / Staff)
 */
const getAdminReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID format'
      });
    }

    const review = await Review.findById(id)
      .populate('product', 'name sku thumbnail images price')
      .populate('user', 'firstName lastName email');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve review
 * @route   PATCH /api/admin/reviews/:id/approve
 * @access  Private (Admin / Manager / Staff)
 */
const approveAdminReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID format'
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isApproved = true;
    await review.save();

    const ratingStats = await updateProductRating(review.product);

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review,
      productRating: ratingStats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject review
 * @route   PATCH /api/admin/reviews/:id/reject
 * @access  Private (Admin / Manager / Staff)
 */
const rejectAdminReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID format'
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isApproved = false;
    await review.save();

    const ratingStats = await updateProductRating(review.product);

    res.status(200).json({
      success: true,
      message: 'Review rejected successfully',
      data: review,
      productRating: ratingStats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/admin/reviews/:id
 * @access  Private (Admin / Manager / Staff)
 */
const deleteAdminReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID format'
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(id);

    const ratingStats = await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      productRating: ratingStats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminReviews,
  getAdminReviewById,
  approveAdminReview,
  rejectAdminReview,
  deleteAdminReview
};
