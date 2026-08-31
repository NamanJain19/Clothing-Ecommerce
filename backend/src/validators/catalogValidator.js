const mongoose = require('mongoose');

/**
 * Validate Category creation / update
 */
const validateCategory = (req, res, next) => {
  const { name } = req.body;

  if (req.method === 'POST') {
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
  }

  if (req.body.parentCategory && !mongoose.Types.ObjectId.isValid(req.body.parentCategory)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid parentCategory ID'
    });
  }

  next();
};

/**
 * Validate Collection creation / update
 */
const validateCollection = (req, res, next) => {
  const { name } = req.body;

  if (req.method === 'POST') {
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Collection name is required'
      });
    }
  }

  if (req.body.category && !mongoose.Types.ObjectId.isValid(req.body.category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category ID'
    });
  }

  next();
};

/**
 * Validate Product creation / update
 */
const validateProduct = (req, res, next) => {
  const {
    name,
    price,
    category,
    sku,
    stock,
    compareAtPrice,
    variants
  } = req.body;

  if (req.method === 'POST') {
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid non-negative product price is required'
      });
    }

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: 'A valid category ID is required'
      });
    }

    if (!sku || typeof sku !== 'string' || !sku.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product SKU is required'
      });
    }

    if (stock === undefined || stock === null || typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid non-negative stock quantity is required'
      });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Product price cannot be negative'
      });
    }

    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Product stock cannot be negative'
      });
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }
  }

  if (compareAtPrice !== undefined && compareAtPrice !== null && (typeof compareAtPrice !== 'number' || compareAtPrice < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Compare at price cannot be negative'
    });
  }

  if (variants && Array.isArray(variants)) {
    for (const v of variants) {
      if (v.price !== undefined && (typeof v.price !== 'number' || v.price < 0)) {
        return res.status(400).json({
          success: false,
          message: 'Variant price cannot be negative'
        });
      }
      if (v.stock !== undefined && (typeof v.stock !== 'number' || v.stock < 0)) {
        return res.status(400).json({
          success: false,
          message: 'Variant stock cannot be negative'
        });
      }
    }
  }

  next();
};

module.exports = {
  validateCategory,
  validateCollection,
  validateProduct
};
