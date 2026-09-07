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
  resetPassword,
  uploadAvatar
} = require('../controllers/authController');
const { sendOtp, verifyOtp } = require('../controllers/otpController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const multer = require('multer');

// Configure Multer for Avatar uploads
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only valid image files (JPG, PNG, WEBP, GIF) are allowed for avatar upload.'), false);
    }
  },
});

// Public routes with rate limiting
router.post('/register', authLimiter, validateRegister, register);
router.post('/upload-avatar', authLimiter, avatarUpload.single('avatar'), uploadAvatar);
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
