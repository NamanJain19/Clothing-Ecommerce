const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    reason: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: true }
);

const returnSchema = new mongoose.Schema(
  {
    returnNumber: {
      type: String,
      required: [true, 'Return number is required'],
      unique: true,
      index: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order reference is required'],
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    items: {
      type: [returnItemSchema],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'At least one item is required for a return request'
      }
    },
    type: {
      type: String,
      enum: ['return', 'exchange'],
      default: 'return'
    },
    status: {
      type: String,
      enum: [
        'requested',
        'approved',
        'pickup_scheduled',
        'received',
        'inspected',
        'refund_pending',
        'refunded',
        'exchange_processing',
        'completed',
        'rejected'
      ],
      default: 'requested',
      index: true
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    customerNotes: {
      type: String,
      trim: true,
      default: ''
    },
    adminNotes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Return = mongoose.model('Return', returnSchema);

module.exports = Return;
