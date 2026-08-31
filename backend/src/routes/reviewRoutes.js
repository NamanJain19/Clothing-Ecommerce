const express = require('express');
const router = express.Router();
const {
  updateReview,
  deleteReview,
  approveReview
} = require('../controllers/reviewController');
const { authenticate } = require('../middleware/authMiddleware');

// Moderation route (public in dev / admin in future)
router.patch('/:id/approve', approveReview);

// User review management routes
router.route('/:id')
  .put(authenticate, updateReview)
  .delete(authenticate, deleteReview);

module.exports = router;
