const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      trim: true,
      uppercase: true
    },
    color: {
      type: String,
      trim: true,
      default: ''
    },
    size: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      min: [0, 'Variant price cannot be negative']
    },
    stock: {
      type: Number,
      min: [0, 'Variant stock cannot be negative'],
      default: 0
    },
    image: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    shortDescription: {
      type: String,
      trim: true,
      default: ''
    },
    brand: {
      type: String,
      trim: true,
      default: 'LUXE',
      index: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null,
      index: true
    },
    gender: {
      type: String,
      enum: {
        values: ['men', 'women', 'unisex', 'kids', 'all'],
        message: '{VALUE} is not a valid gender category'
      },
      default: 'unisex',
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
      index: true
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare at price cannot be negative'],
      default: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    sku: {
      type: String,
      required: [true, 'Product SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    images: {
      type: [String],
      default: []
    },
    thumbnail: {
      type: String,
      default: ''
    },
    colors: {
      type: [String],
      default: []
    },
    sizes: {
      type: [String],
      default: []
    },
    variants: {
      type: [variantSchema],
      default: []
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true
    },
    isSale: {
      type: Boolean,
      default: false,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      index: true
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    material: {
      type: String,
      trim: true,
      default: ''
    },
    careInstructions: {
      type: String,
      trim: true,
      default: ''
    },
    seoTitle: {
      type: String,
      trim: true,
      default: ''
    },
    seoDescription: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true
  }
);

// Compound text index for search
productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  tags: 'text',
  sku: 'text'
});

// Pre-save hook to calculate discount, format SKU/slug, and set default thumbnail
productSchema.pre('save', function (next) {
  // Normalize slug
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.slug || this.name);
  }

  // Normalize SKU
  if (this.sku) {
    this.sku = this.sku.trim().toUpperCase();
  }

  // Calculate discount percentage
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    this.discountPercentage = Math.round(
      ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100
    );
    this.isSale = true;
  } else {
    this.discountPercentage = 0;
  }

  // Set thumbnail from first image if empty
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }

  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
