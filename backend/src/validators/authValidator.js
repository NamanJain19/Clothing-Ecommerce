/**
 * Email regex validation
 */
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  return emailRegex.test(String(email).trim());
};

/**
 * Validate registration request body
 */
const validateRegister = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
    return res.status(400).json({
      success: false,
      message: 'First name is required'
    });
  }

  if (!lastName || typeof lastName !== 'string' || !lastName.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Last name is required'
    });
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Password is required'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  next();
};

/**
 * Validate login request body
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Password is required'
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  isValidEmail
};
