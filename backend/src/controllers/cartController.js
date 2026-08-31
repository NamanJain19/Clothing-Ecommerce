const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Helper to build formatted cart response
 */
const formatCartResponse = (cart) => {
  const totals = cart.calculateTotals();
  return {
    _id: cart._id,
    user: cart.user,
    items: cart.items,
    subtotal: totals.subtotal,
    totalItems: totals.totalItems,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt
  };
};

/**
 * @desc    Get current user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice thumbnail images stock isActive variants'
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    res.status(200).json({
      success: true,
      cart: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a product or variant to cart
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, variantId, quantity = 1, size, color } = req.body;

    // Validate product ID
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    // Validate quantity
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Fetch product from database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Verify product is active
    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is currently unavailable'
      });
    }

    let itemPrice = product.price;
    let availableStock = product.stock;
    let itemSize = size ? size.trim() : '';
    let itemColor = color ? color.trim() : '';
    let validVariantId = null;

    // If variant ID provided, validate variant
    if (variantId) {
      if (!mongoose.Types.ObjectId.isValid(variantId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid variant ID'
        });
      }

      const variant = product.variants.id(variantId);
      if (!variant || variant.isActive === false) {
        return res.status(400).json({
          success: false,
          message: 'Selected product variant is not available'
        });
      }

      validVariantId = variant._id;
      availableStock = variant.stock;
      if (variant.price !== undefined && variant.price !== null) {
        itemPrice = variant.price;
      }
      if (!itemSize && variant.size) itemSize = variant.size;
      if (!itemColor && variant.color) itemColor = variant.color;
    }

    // Stock availability checks
    if (availableStock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    if (parsedQuantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${parsedQuantity}) exceeds available stock (${availableStock})`
      });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => {
      const isSameProduct = item.product.toString() === productId.toString();
      const isSameVariant = validVariantId
        ? item.variantId && item.variantId.toString() === validVariantId.toString()
        : !item.variantId && item.size === itemSize && item.color === itemColor;

      return isSameProduct && isSameVariant;
    });

    if (existingItemIndex > -1) {
      const newTotalQuantity = cart.items[existingItemIndex].quantity + parsedQuantity;

      if (newTotalQuantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Total quantity in cart (${newTotalQuantity}) would exceed available stock (${availableStock})`
        });
      }

      cart.items[existingItemIndex].quantity = newTotalQuantity;
      cart.items[existingItemIndex].price = itemPrice; // Sync verified price
    } else {
      cart.items.push({
        product: productId,
        variantId: validVariantId,
        quantity: parsedQuantity,
        price: itemPrice,
        size: itemSize,
        color: itemColor
      });
    }

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice thumbnail images stock isActive variants'
    });

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/items/:itemId
 * @access  Private
 */
const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart item ID'
      });
    }

    if (quantity === undefined || typeof quantity !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity number is required'
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // If quantity is 0 or negative, remove the item
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
      await cart.save();

      await cart.populate({
        path: 'items.product',
        select: 'name slug price compareAtPrice thumbnail images stock isActive variants'
      });

      return res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        cart: formatCartResponse(cart)
      });
    }

    const cartItem = cart.items[itemIndex];
    const product = await Product.findById(cartItem.product);

    if (!product || !product.isActive) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.status(400).json({
        success: false,
        message: 'Product is no longer available and was removed from your cart'
      });
    }

    let availableStock = product.stock;
    let currentPrice = product.price;

    if (cartItem.variantId) {
      const variant = product.variants.id(cartItem.variantId);
      if (!variant || variant.isActive === false) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
        return res.status(400).json({
          success: false,
          message: 'Selected variant is no longer available'
        });
      }
      availableStock = variant.stock;
      if (variant.price !== undefined && variant.price !== null) {
        currentPrice = variant.price;
      }
    }

    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${quantity}) exceeds available stock (${availableStock})`
      });
    }

    cartItem.quantity = quantity;
    cartItem.price = currentPrice;

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice thumbnail images stock isActive variants'
    });

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      cart: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove an item from cart
 * @route   DELETE /api/cart/items/:itemId
 * @access  Private
 */
const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart item ID'
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug price compareAtPrice thumbnail images stock isActive variants'
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    } else {
      cart.items = [];
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
