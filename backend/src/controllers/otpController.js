const smsService = require('../services/smsService');
const { normalizePhoneNumber } = require('../utils/phoneUtils');

/**
 * @desc    Request phone verification OTP via Twilio Verify
 * @route   POST /api/auth/otp/send
 * @access  Public (Rate limited)
 */
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Please provide a valid 10-digit number.',
      });
    }

    const result = await smsService.sendOtpSms(normalizedPhone);

    if (!result.success) {
      return res.status(result.code === 21608 ? 403 : 400).json({
        success: false,
        message: result.error || 'Failed to dispatch verification OTP',
        code: result.code,
      });
    }

    res.status(200).json({
      success: true,
      message: `Verification code sent to ${normalizedPhone}`,
      data: {
        to: result.to,
        status: result.status,
        sid: result.sid,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify submitted phone OTP code via Twilio Verify
 * @route   POST /api/auth/otp/verify
 * @access  Public (Rate limited)
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and verification code are required',
      });
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format',
      });
    }

    const result = await smsService.verifyOtpSms(normalizedPhone, code);

    if (!result.success || !result.valid) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: result.error || 'Invalid or expired verification code',
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      message: 'Phone number successfully verified',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
