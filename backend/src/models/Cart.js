const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required']
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price cannot be negative']
    },
    size: {
      type: String,
      trim: true,
      default: ''
    },
    color: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true
    },
    items: {
      type: [cartItemSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Method to calculate cart totals (subtotal and total items)
cartSchema.methods.calculateTotals = function () {
  const subtotal = this.items.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  const totalItems = this.items.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalItems
  };
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
