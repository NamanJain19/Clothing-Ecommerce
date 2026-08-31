const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token
 * @param {Object} payload - Data to embed in the token (e.g. { userId, role })
 * @param {string} [expiresIn] - Optional custom expiry duration
 * @returns {string} - Signed JWT string
 */
const generateToken = (payload, expiresIn) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const expiry = expiresIn || process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, {
    expiresIn: expiry
  });
};

/**
 * Verify a JWT token
 * @param {string} token - The JWT string to verify
 * @returns {Object} - Decoded payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
