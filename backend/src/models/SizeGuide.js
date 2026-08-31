const mongoose = require('mongoose');

const sizeGuideSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Size guide name is required'],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex', 'kids', 'all'],
      default: 'all',
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    measurements: [
      {
        size: { type: String, required: true },
        chest: { type: String, default: '' },
        waist: { type: String, default: '' },
        hips: { type: String, default: '' },
        length: { type: String, default: '' },
        shoulder: { type: String, default: '' },
        unit: { type: String, default: 'inches' }
      }
    ],
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

const SizeGuide = mongoose.model('SizeGuide', sizeGuideSchema);

module.exports = SizeGuide;
