const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword
} = require('../controllers/authController');
const { sendOtp, verifyOtp } = require('../controllers/otpController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/google', authLimiter, googleLogin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.get('/reset-password/verify', verifyResetToken);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/logout', logout);

// Phone OTP verification via Twilio Verify
router.post('/otp/send', authLimiter, sendOtp);
router.post('/otp/verify', authLimiter, verifyOtp);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, authLimiter, changePassword);
router.delete('/account', authenticate, deleteAccount);

module.exports = router;
