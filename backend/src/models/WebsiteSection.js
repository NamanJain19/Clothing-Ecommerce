const mongoose = require('mongoose');

const websiteSectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: [true, 'Section name is required'],
      trim: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      trim: true,
      default: ''
    },
    subtitle: {
      type: String,
      trim: true,
      default: ''
    },
    content: {
      type: String,
      trim: true,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    links: [
      {
        label: { type: String, trim: true },
        url: { type: String, trim: true }
      }
    ],
    sortOrder: {
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

const WebsiteSection = mongoose.model('WebsiteSection', websiteSectionSchema);

module.exports = WebsiteSection;
