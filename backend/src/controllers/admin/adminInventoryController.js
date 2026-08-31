const Product = require('../../models/Product');
const mongoose = require('mongoose');

/**
 * @desc    Get inventory overview
 * @route   GET /api/admin/inventory
 * @access  Private (Admin / Manager / Staff)
 */
const getInventory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, lowStockOnly } = req.query;

    const query = { isActive: true };

    if (lowStockOnly === 'true') {
      query.stock = { $lte: 5 };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { brand: searchRegex }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .select('name sku price stock variants thumbnail images category brand')
        .populate('category', 'name')
        .sort({ stock: 1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get low stock products
 * @route   GET /api/admin/inventory/low-stock
 * @access  Private (Admin / Manager / Staff)
 */
const getLowStockProducts = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold, 10) || 5;

    const products = await Product.find({
      stock: { $lte: threshold },
      isActive: true
    })
      .select('name sku price stock variants thumbnail brand category')
      .populate('category', 'name')
      .sort({ stock: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      threshold,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product or variant inventory stock
 * @route   PATCH /api/admin/inventory/:productId
 * @access  Private (Admin / Manager / Staff)
 */
const updateInventoryStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { stock, variantId, variantStock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update variant stock if variantId provided
    if (variantId) {
      if (!mongoose.Types.ObjectId.isValid(variantId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid variant ID format'
        });
      }

      const variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: 'Variant not found on this product'
        });
      }

      const newVariantStock = Number(variantStock !== undefined ? variantStock : stock);
      if (isNaN(newVariantStock) || newVariantStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Variant stock cannot be negative'
        });
      }

      variant.stock = newVariantStock;

      // Recalculate total product stock as sum of variants if product has variants
      product.stock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    } else {
      if (stock === undefined || typeof stock !== 'number' || stock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid non-negative stock number is required'
        });
      }
      product.stock = stock;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Inventory updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  getLowStockProducts,
  updateInventoryStock
};
