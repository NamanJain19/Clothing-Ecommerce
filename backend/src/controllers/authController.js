const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, avatar } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user (password is automatically hashed via pre-save hook)
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: password,
      phone: phone ? phone.trim() : '',
      avatar: avatar || ''
    });

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toSafeObject(),
      token: token
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Find user and explicitly select password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: user.toSafeObject(),
      token: token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user.toSafeObject ? req.user.toSafeObject() : req.user
  });
};

/**
 * @desc    Update customer profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, email, phone, avatar } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (email !== undefined && email.trim() !== '') {
      const targetEmail = email.trim().toLowerCase();
      if (targetEmail !== user.email) {
        const existing = await User.findOne({ email: targetEmail });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: 'This email address is already in use by another account.'
          });
        }
        user.email = targetEmail;
      }
    }
    if (phone !== undefined) user.phone = phone.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user has existing password, verify current password
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password'
        });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password'
        });
      }
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deactivate / Delete user account
 * @route   DELETE /api/auth/account
 * @access  Private
 */
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const crypto = require('crypto');
const { verifyFirebaseIdToken } = require('../utils/firebaseTokenVerifier');

/**
 * @desc    Authenticate with Firebase Google ID Token
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleLogin = async (req, res, next) => {
  try {
    const { idToken, email: clientEmail, name: clientName, avatar: clientAvatar } = req.body;
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID token is required',
      });
    }

    // Cryptographically verify the token server-side
    let decoded;
    try {
      decoded = await verifyFirebaseIdToken(idToken);
    } catch (verErr) {
      return res.status(401).json({
        success: false,
        message: `Google authentication failed: ${verErr.message}`,
      });
    }

    const uid = decoded.uid || decoded.sub || decoded.user_id || '';
    if (!uid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: Missing verified user identifier (UID)',
      });
    }

    // Extract verified email (fallback to clientEmail if verified claims allow)
    const email = (
      decoded.email ||
      decoded.firebase?.identities?.email?.[0] ||
      decoded.email_address ||
      clientEmail ||
      ''
    ).toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Unable to extract email from Google account',
      });
    }

    // Extract verified name and avatar
    const fullName = (decoded.name || clientName || email.split('@')[0] || '').trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const avatar = decoded.picture || clientAvatar || '';

    // Check if user already exists in MongoDB by googleId, firebaseUid, or email
    let user = await User.findOne({
      $or: [
        ...(uid ? [{ googleId: uid }, { firebaseUid: uid }] : []),
        { email },
      ],
    });

    if (!user) {
      // Create new customer account with secure random password placeholder
      const randomPassword = crypto.randomBytes(32).toString('hex') + 'Aa1!';
      user = await User.create({
        firstName,
        lastName,
        email,
        password: randomPassword,
        avatar,
        googleId: uid,
        firebaseUid: uid,
        role: 'customer',
        isEmailVerified: true,
      });
    } else {
      // Safely link Google identity to existing account without overwriting existing password or custom details
      let changed = false;
      if (uid && (!user.googleId || !user.firebaseUid)) {
        if (!user.googleId) user.googleId = uid;
        if (!user.firebaseUid) user.firebaseUid = uid;
        changed = true;
      }
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        changed = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Generate standard application JWT token
    const token = generateToken({
      userId: user._id,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      user: user.toSafeObject(),
      token,
    });
  } catch (error) {
    next(error);
  }
};

const PasswordResetToken = require('../models/PasswordResetToken');
const emailService = require('../services/emailService');

/**
 * @desc    Request password reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public (Rate limited)
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Look up user in database
    const user = await User.findOne({ email: normalizedEmail });

    if (user && user.isActive) {
      // 1. Invalidate any existing unused reset tokens for this user
      await PasswordResetToken.updateMany(
        { userId: user._id, used: false },
        { used: true, usedAt: new Date() }
      );

      // 2. Generate cryptographically secure random token (64 hex characters)
      const rawToken = crypto.randomBytes(32).toString('hex');

      // 3. Store SHA-256 hash of token in MongoDB (never store plaintext token)
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

      await PasswordResetToken.create({
        userId: user._id,
        email: user.email,
        tokenHash,
        expiresAt,
        used: false,
        ipAddress: req.ip || req.connection?.remoteAddress || '',
        userAgent: req.get('User-Agent') || '',
      });

      // 4. Send email via Resend
      await emailService.sendPasswordResetEmail(user, rawToken);
    }

    // Email Enumeration Protection: Always return identical generic success message
    res.status(200).json({
      success: true,
      message: 'If an account exists for this email address, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify if a password reset token is valid and not expired
 * @route   GET /api/auth/reset-password/verify
 * @access  Public
 */
const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Password reset token is missing',
      });
    }

    // Hash the incoming raw token to compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const resetDoc = await PasswordResetToken.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetDoc) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Password reset link is invalid or has expired. Please request a new link.',
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      email: resetDoc.email,
      message: 'Reset token is valid',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset user password using token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is required',
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    // Hash the incoming token
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    // Find the active, unused, non-expired token
    const resetDoc = await PasswordResetToken.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetDoc) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link is invalid or has expired. Please request a new link.',
      });
    }

    // Find the associated user
    const user = await User.findById(resetDoc.userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Associated user account not found',
      });
    }

    // Update password (bcrypt hash will be applied via user pre-save hook)
    user.password = newPassword;
    await user.save();

    // Mark token as used (single-use enforcement)
    resetDoc.used = true;
    resetDoc.usedAt = new Date();
    await resetDoc.save();

    // Invalidate any other tokens for this user
    await PasswordResetToken.updateMany(
      { userId: user._id, used: false },
      { used: true, usedAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'Password has been successfully reset. Please log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user / clear session
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = {
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
};

