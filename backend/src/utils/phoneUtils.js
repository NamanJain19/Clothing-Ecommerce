/**
 * Phone number normalization & validation utilities for E-Commerce & SMS dispatch
 */

/**
 * Normalizes a phone number to standard international E.164 format (+91XXXXXXXXXX for India by default)
 * @param {string|number} phone Raw phone number input
 * @param {string} defaultCountryCode Default country calling code (e.g. '+91')
 * @returns {string|null} Normalized E.164 phone number, or null if invalid
 */
const normalizePhoneNumber = (phone, defaultCountryCode = '+91') => {
  if (!phone) return null;

  let cleaned = String(phone).trim().replace(/[^\d+]/g, '');
  if (!cleaned) return null;

  // If starts with +, clean internal multiple pluses
  if (cleaned.startsWith('+')) {
    cleaned = '+' + cleaned.replace(/\+/g, '');
  } else {
    // If leading 0 (domestic trunk prefix in India/UK), remove it
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.slice(1);
    }

    // If 10 digits (standard Indian mobile number e.g. 9876543210)
    if (/^[6-9]\d{9}$/.test(cleaned)) {
      cleaned = `${defaultCountryCode}${cleaned}`;
    } else if (/^91[6-9]\d{9}$/.test(cleaned)) {
      // 12 digits starting with 91
      cleaned = `+${cleaned}`;
    } else if (/^\d{10,14}$/.test(cleaned)) {
      cleaned = `${defaultCountryCode}${cleaned}`;
    }
  }

  // Final sanity check: E.164 regex (+ followed by 8 to 15 digits)
  if (/^\+[1-9]\d{7,14}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
};

/**
 * Checks if a phone number is valid
 * @param {string|number} phone Phone number to validate
 * @returns {boolean} True if valid E.164 number
 */
const isValidPhoneNumber = (phone) => {
  const normalized = normalizePhoneNumber(phone);
  return Boolean(normalized);
};

module.exports = {
  normalizePhoneNumber,
  isValidPhoneNumber,
};
