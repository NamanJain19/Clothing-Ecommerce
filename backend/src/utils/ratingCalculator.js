const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');

/**
 * Recalculate average rating and review count for a product from approved reviews
 * @param {string|mongoose.Types.ObjectId} productId 
 */
const updateProductRating = async (productId) => {
  try {
    const stats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          isApproved: true
        }
      },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    let rating = 0;
    let reviewCount = 0;

    if (stats.length > 0) {
      rating = Math.round(stats[0].averageRating * 10) / 10;
      reviewCount = stats[0].reviewCount;
    }

    await Product.updateOne(
      { _id: productId },
      { rating, reviewCount }
    );

    return { rating, reviewCount };
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

module.exports = {
  updateProductRating
};
