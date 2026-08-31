const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  optionalAuth,
  handleChat,
  handleChatStream,
  handleVisualSearch,
  handleVirtualTryOn,
} = require('../controllers/aiController');
const { aiLimiter } = require('../middleware/rateLimiter');

// Configure multer for in-memory temporary buffer processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type. Allowed: JPG, PNG, WEBP, GIF'), false);
    }
  },
});

// POST /api/ai/chat
router.post('/chat', aiLimiter, optionalAuth, handleChat);

// POST /api/ai/chat/stream (SSE Streaming)
router.post('/chat/stream', aiLimiter, optionalAuth, handleChatStream);

// POST /api/ai/visual-search (Multimodal AI Lens)
router.post(
  '/visual-search',
  aiLimiter,
  optionalAuth,
  upload.single('image'),
  handleVisualSearch
);

// POST /api/ai/virtual-try-on (Real Replicate IDM-VTON)
router.post(
  '/virtual-try-on',
  aiLimiter,
  optionalAuth,
  upload.single('image'),
  handleVirtualTryOn
);

module.exports = router;
