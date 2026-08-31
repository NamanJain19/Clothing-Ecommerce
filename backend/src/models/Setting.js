const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'MONOLITH LUXURY OPERATIONS' },
    contactEmail: { type: String, default: 'concierge@monolith.luxury' },
    supportPhone: { type: String, default: '+91 98765 43210' },
    headquarters: { type: String, default: '42 Luxury Boulevard, Chanakyapuri, New Delhi, 110021, India' },
    gstin: { type: String, default: '27AABCM1234F1Z5' },
    currency: { type: String, default: 'INR (₹)' },

    // WhatsApp & Concierge
    whatsappEnabled: { type: Boolean, default: true },
    whatsappNumber: { type: String, default: '+919876543210' },
    whatsappAgentName: { type: String, default: 'Monolith VIP Concierge' },
    whatsappWelcomeMessage: { type: String, default: 'Namaste! I would like personal concierge assistance with my luxury order.' },

    // SMS Notifications
    smsEnabled: { type: Boolean, default: false },
    smsProvider: { type: String, default: 'Fast2SMS' },
    smsApiKey: { type: String, default: '' },
    orderPlacedSms: { type: Boolean, default: true },
    orderShippedSms: { type: Boolean, default: true },

    // Payments & Shipping
    razorpayEnabled: { type: Boolean, default: true },
    razorpayKeyId: { type: String, default: 'rzp_test_1DP5mmOlF5G5ag' },
    codEnabled: { type: Boolean, default: true },
    freeShippingThreshold: { type: Number, default: 5000 },
    standardShippingFee: { type: Number, default: 250 },
    gstPercentage: { type: Number, default: 18 },

    // Admin Profile
    adminName: { type: String, default: 'Store Administrator' },
    adminEmail: { type: String, default: 'admin@monolith.com' },
    adminAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
