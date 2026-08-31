const geminiService = require('../services/geminiService');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'development_jwt_secret_luxury_fashion_2026_key';

/**
 * Middleware: Optional Authentication
 * If token is present, extracts authenticated User. If not, continues as guest.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.userId) {
        const user = await User.findById(decoded.userId);
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
  } catch (err) {
    // Ignore invalid tokens for public queries
  }
  next();
};

/**
 * @desc    Chat with Real Gemini AI Stylist (Live Database Function Calling)
 * @route   POST /api/ai/chat
 * @access  Public (Optionally Authenticated)
 */
const handleChat = async (req, res, next) => {
  try {
    const { message, conversationId, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const result = await geminiService.chat({
      message: message.trim(),
      conversationId,
      history: Array.isArray(history) ? history : [],
      user: req.user || null,
    });

    res.status(200).json({
      success: true,
      text: result.text,
      response: result.response,
      products: result.products || [],
      conversationId: result.conversationId,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Streaming Chat with Gemini AI Stylist via Server-Sent Events (SSE)
 * @route   POST /api/ai/chat/stream
 * @access  Public (Optionally Authenticated)
 */
const handleChatStream = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    await geminiService.chatStream({
      message: message.trim(),
      conversationId,
      user: req.user || null,
      onChunk: (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
      },
      onComplete: (finalData) => {
        res.write(`data: ${JSON.stringify({ type: 'complete', ...finalData })}\n\n`);
        res.write('event: end\ndata: [DONE]\n\n');
        res.end();
      },
    });
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
  }
};

const visualSearchService = require('../services/visualSearchService');

/**
 * @desc    Visual Search / AI Lens with Multimodal Gemini Vision & Live MongoDB Matching
 * @route   POST /api/ai/visual-search
 * @access  Public (Optionally Authenticated)
 */
const handleVisualSearch = async (req, res, next) => {
  try {
    let imageBuffer = null;
    let mimeType = 'image/jpeg';

    // 1. Check if multipart/form-data file was uploaded
    if (req.file && req.file.buffer) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype || 'image/jpeg';
    } else if (req.body && req.body.imageBase64) {
      // 2. Base64 fallback support
      const match = req.body.imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        imageBuffer = Buffer.from(match[2], 'base64');
      } else {
        imageBuffer = Buffer.from(req.body.imageBase64, 'base64');
      }
    } else if (req.body && req.body.imageUrl) {
      // 3. Optional sample look image URL fetching support
      try {
        const fetchRes = await fetch(req.body.imageUrl);
        if (fetchRes.ok) {
          const arrayBuf = await fetchRes.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuf);
          mimeType = fetchRes.headers.get('content-type') || 'image/jpeg';
        }
      } catch (e) {
        console.warn('[Visual Search] Image URL fetch failed:', e.message);
      }
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid image file or base64 payload is required',
      });
    }

    // Validate MIME types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!allowedMimeTypes.includes(mimeType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported image format. Allowed formats: JPG, JPEG, PNG, WEBP',
      });
    }

    // Validate size (max 10MB)
    if (imageBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size exceeds maximum allowed limit (10MB)',
      });
    }

    const result = await visualSearchService.performVisualSearch(imageBuffer, mimeType);

    return res.status(200).json(result);
  } catch (error) {
    console.error('[Visual Search] Error:', error.message);
    const isRateLimit =
      error.status === 429 ||
      (error.message && error.message.includes('429')) ||
      (error.message && error.message.includes('Quota exceeded'));

    if (isRateLimit) {
      return res.status(429).json({
        success: false,
        message: 'AI Vision rate limit reached. Please retry in a few moments.',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to perform visual search analysis',
    });
  }
};

const virtualTryOnService = require('../services/virtualTryOnService');

/**
 * @desc    Virtual Try-On with Real IDM-VTON Neural Diffusion Engine
 * @route   POST /api/ai/virtual-try-on
 * @access  Public (Optionally Authenticated)
 */
const handleVirtualTryOn = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required for Virtual Try-On',
      });
    }

    let humanImage = null;

    // 1. Check if multipart/form-data file was uploaded
    if (req.file && req.file.buffer) {
      const mime = req.file.mimetype || 'image/jpeg';
      humanImage = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
    } else if (req.body && req.body.humanImageBase64) {
      humanImage = req.body.humanImageBase64;
    } else if (req.body && req.body.humanImageUrl) {
      humanImage = req.body.humanImageUrl;
    } else if (req.body && req.body.humanImage) {
      humanImage = req.body.humanImage;
    }

    if (!humanImage) {
      return res.status(400).json({
        success: false,
        message: 'A person photo (file upload, base64 or URL) is required',
      });
    }

    const result = await virtualTryOnService.performVirtualTryOn({
      humanImage,
      productId: productId.trim(),
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('[Virtual Try-On Controller] Error:', error.message);
    if (error.message && error.message.includes('quota') || error.message.includes('credit')) {
      return res.status(402).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Virtual Try-On process failed',
    });
  }
};

module.exports = {
  optionalAuth,
  handleChat,
  handleChatStream,
  handleVisualSearch,
  handleVirtualTryOn,
};
