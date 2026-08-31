const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { updateProductRating } = require('../utils/ratingCalculator');

/**
 * @desc    Get all approved reviews for a product
 * @route   GET /api/products/:productId/reviews
 * @access  Public
 */
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating, sort } = req.query;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const query = {
      product: productId,
      isApproved: true
    };

    if (rating && !isNaN(Number(rating))) {
      query.rating = Number(rating);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'rating_desc') sortOption = { rating: -1, createdAt: -1 };
    else if (sort === 'rating_asc') sortOption = { rating: 1, createdAt: -1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Fetch approved reviews, total matching count, and all approved stats for distribution
    const [reviews, total, allApprovedReviews] = await Promise.all([
      Review.find(query)
        .populate('user', 'firstName lastName avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments(query),
      Review.find({ product: productId, isApproved: true }).select('rating')
    ]);

    // Calculate rating distribution & average
    const totalApprovedCount = allApprovedReviews.length;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let ratingSum = 0;

    allApprovedReviews.forEach(r => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
      ratingSum += r.rating;
    });

    const averageRating = totalApprovedCount > 0
      ? Math.round((ratingSum / totalApprovedCount) * 10) / 10
      : 0;

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      reviews,
      averageRating,
      reviewCount: totalApprovedCount,
      ratingDistribution: distribution,
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
 * @desc    Create a verified review for a product
 * @route   POST /api/products/:productId/reviews
 * @access  Private
 */
const createProductReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { rating, title, comment, images, orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Review title is required'
      });
    }

    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Review comment is required'
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find eligible delivered order containing this product
    let targetOrder;

    if (orderId) {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format'
        });
      }

      targetOrder = await Order.findOne({
        _id: orderId,
        user: userId,
        'items.product': productId
      });

      if (!targetOrder) {
        return res.status(400).json({
          success: false,
          message: 'You have not purchased this product in the specified order'
        });
      }

      if (targetOrder.orderStatus !== 'delivered') {
        return res.status(400).json({
          success: false,
          message: `You can only review this product after your order is delivered. Current status: ${targetOrder.orderStatus}`
        });
      }
    } else {
      // Find any delivered order by user containing this product
      targetOrder = await Order.findOne({
        user: userId,
        'items.product': productId,
        orderStatus: 'delivered'
      }).sort({ createdAt: -1 });

      if (!targetOrder) {
        // Check if order exists but not delivered yet
        const pendingOrder = await Order.findOne({
          user: userId,
          'items.product': productId
        }).sort({ createdAt: -1 });

        if (pendingOrder) {
          return res.status(400).json({
            success: false,
            message: `You can only review this product after your order is delivered. Current status: ${pendingOrder.orderStatus}`
          });
        }

        return res.status(400).json({
          success: false,
          message: 'You can only review products you have purchased and received.'
        });
      }
    }

    // Check duplicate review for user + product + order
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
      order: targetOrder._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product for this order.'
      });
    }

    // Create review
    const review = await Review.create({
      product: productId,
      user: userId,
      order: targetOrder._id,
      rating: numericRating,
      title: title.trim(),
      comment: comment.trim(),
      images: images || [],
      isVerifiedPurchase: true,
      isApproved: false // Moderation required by default
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and is pending approval',
      data: review
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product for this order.'
      });
    }
    next(error);
  }
};

/**
 * @desc    Approve or moderate a review
 * @route   PATCH /api/reviews/:id/approve
 * @access  Public / Admin
 */
const approveReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved = true } = req.body;

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

    review.isApproved = isApproved;
    await review.save();

    // Recalculate product rating
    const ratingStats = await updateProductRating(review.product);

    res.status(200).json({
      success: true,
      message: isApproved ? 'Review approved successfully' : 'Review unapproved successfully',
      data: review,
      productRating: ratingStats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
const updateReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { rating, title, comment, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID format'
      });
    }

    const review = await Review.findOne({ _id: id, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or does not belong to you'
      });
    }

    if (rating !== undefined) {
      const numRating = Number(rating);
      if (!numRating || numRating < 1 || numRating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be an integer between 1 and 5'
        });
      }
      review.rating = numRating;
    }

    if (title) review.title = title.trim();
    if (comment) review.comment = comment.trim();
    if (images !== undefined) review.images = images;

    await review.save();

    // Recalculate product rating if review was approved
    if (review.isApproved) {
      await updateProductRating(review.product);
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
const deleteReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID format'
      });
    }

    const review = await Review.findOne({ _id: id, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or does not belong to you'
      });
    }

    const productId = review.product;
    await Review.deleteOne({ _id: id });

    // Recalculate product rating
    await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createProductReview,
  approveReview,
  updateReview,
  deleteReview
};
