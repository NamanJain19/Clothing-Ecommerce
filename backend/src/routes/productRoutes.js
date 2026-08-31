const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const {
  getProductReviews,
  createProductReview
} = require('../controllers/reviewController');
const { validateProduct } = require('../validators/catalogValidator');
const { authenticate } = require('../middleware/authMiddleware');

// Product collection routes
router.route('/')
  .get(getProducts)
  .post(validateProduct, createProduct);

// Product slug lookup route (must be before /:id)
router.get('/slug/:slug', getProductBySlug);

// Product reviews routes
router.route('/:productId/reviews')
  .get(getProductReviews)
  .post(authenticate, createProductReview);

// Single product by ID routes
router.route('/:id')
  .get(getProductById)
  .put(validateProduct, updateProduct)
  .delete(deleteProduct);

module.exports = router;
