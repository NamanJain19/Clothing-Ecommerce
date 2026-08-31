/**
 * Lightweight in-memory rate limiting middleware for sensitive endpoints
 */
const rateLimitMap = new Map();

// Periodic cleanup of expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Factory to create rate limiter middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default 15 minutes)
 * @param {number} options.max - Max requests allowed per window per IP (default 100)
 * @param {string} options.message - Error message to return upon limit breach
 */
const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const max = options.max || 100;
  const message = options.message || 'Too many requests. Please try again later.';

  return (req, res, next) => {
    // In test environment, bypass rate limits
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown_ip';
    const key = `${req.baseUrl || ''}_${ip}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        message,
        retryAfter: retryAfterSeconds
      });
    }

    next();
  };
};

// Standard sensitive limiters
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 60, // 60 attempts per 15 mins
  message: 'Too many authentication attempts. Please try again later.'
});

const paymentLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 30, // 30 attempts per 5 mins
  message: 'Payment request limit reached. Please wait a few moments.'
});

const aiLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 100, // 100 AI queries per 5 mins
  message: 'AI Assistant query limit reached. Please pause for a moment before your next question.'
});

module.exports = {
  createRateLimiter,
  authLimiter,
  paymentLimiter,
  aiLimiter,
};
