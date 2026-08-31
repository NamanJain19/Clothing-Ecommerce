const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    sku: {
      type: String,
      trim: true,
      default: ''
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
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price cannot be negative']
    }
  },
  { _id: true }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    landmark: { type: String, default: '' },
    addressType: { type: String, default: 'home' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    formattedAddress: { type: String, default: '' }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'Order must contain at least one item'
      }
    },
    shippingAddress: {
      type: addressSnapshotSchema,
      required: [true, 'Shipping address is required']
    },
    billingAddress: {
      type: addressSnapshotSchema,
      required: [true, 'Billing address is required']
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: [0, 'Shipping fee cannot be negative']
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative']
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['cash_on_delivery', 'upi', 'credit_debit_card', 'net_banking', 'account'],
        message: '{VALUE} is not a valid payment method'
      },
      default: 'cash_on_delivery'
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
        message: '{VALUE} is not a valid payment status'
      },
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: {
        values: [
          'pending',
          'confirmed',
          'processing',
          'packed',
          'shipped',
          'out_for_delivery',
          'delivered',
          'cancelled',
          'returned',
          'refunded'
        ],
        message: '{VALUE} is not a valid order status'
      },
      default: 'pending'
    },
    coupon: {
      code: { type: String, default: null },
      discountAmount: { type: Number, default: 0 }
    },
    shippingMethod: {
      type: String,
      enum: ['standard', 'express'],
      default: 'standard'
    },
    estimatedDeliveryDate: {
      type: Date,
      default: null
    },
    estimatedDeliveryMinDate: {
      type: Date,
      default: null
    },
    estimatedDeliveryMaxDate: {
      type: Date,
      default: null
    },
    estimatedDelivery: {
      type: String,
      default: ''
    },
    trackingNumber: {
      type: String,
      default: '',
      index: true
    },
    // Real Courier & Shipment Tracking Integration (Shiprocket)
    shiprocketOrderId: {
      type: Number,
      default: null,
      index: true
    },
    shiprocketShipmentId: {
      type: Number,
      default: null,
      index: true
    },
    shiprocketStatus: {
      type: String,
      default: ''
    },
    courierCompanyId: {
      type: Number,
      default: null
    },
    shipmentId: {
      type: String,
      default: null,
      index: true
    },
    awbNumber: {
      type: String,
      default: '',
      index: true
    },
    carrier: {
      type: String,
      default: ''
    },
    courierName: {
      type: String,
      default: ''
    },
    carrierService: {
      type: String,
      default: ''
    },
    trackingUrl: {
      type: String,
      default: ''
    },
    shipmentStatus: {
      type: String,
      enum: [
        'pending',
        'manifested',
        'pickup_scheduled',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'rto',
        'cancelled',
        'exception'
      ],
      default: 'pending',
      index: true
    },
    courierLatitude: {
      type: Number,
      default: null
    },
    courierLongitude: {
      type: Number,
      default: null
    },
    courierLocationUpdated: {
      type: Date,
      default: null
    },
    courierEtd: {
      type: Date,
      default: null
    },
    trackingHistory: [
      {
        status: { type: String, required: true },
        activity: { type: String, required: true },
        location: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
        rawStatus: { type: String, default: '' }
      }
    ],
    invoiceNumber: {
      type: String,
      default: '',
      index: true
    },
    razorpayOrderId: {
      type: String,
      default: null,
      index: true
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      index: true
    },
    smsNotifications: [
      {
        event: {
          type: String,
          required: true
        },
        messageSid: { type: String, default: '' },
        phone: { type: String, default: '' },
        sentAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['sent', 'failed', 'queued'], default: 'sent' },
        errorMessage: { type: String, default: '' }
      }
    ],
    notes: {
      type: String,
      default: ''
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    cancellationReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
