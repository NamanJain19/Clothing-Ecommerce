const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Gift card code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Gift card name is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    remainingBalance: {
      type: Number,
      required: [true, 'Remaining balance is required'],
      min: [0, 'Balance cannot be negative']
    },
    expiryDate: {
      type: Date,
      default: null
    },
    recipient: {
      name: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, lowercase: true, default: '' }
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    usageLimit: {
      type: Number,
      default: 1
    },
    usedCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

giftCardSchema.pre('save', function (next) {
  if (this.code) {
    this.code = this.code.trim().toUpperCase();
  }
  if (this.isNew && (this.remainingBalance === undefined || this.remainingBalance === null)) {
    this.remainingBalance = this.amount;
  }
  next();
});

const GiftCard = mongoose.model('GiftCard', giftCardSchema);

module.exports = GiftCard;
