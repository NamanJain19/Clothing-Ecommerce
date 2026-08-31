const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

/**
 * Validate a coupon code and calculate the discount amount server-side
 * @param {string} code - Coupon code
 * @param {string|mongoose.Types.ObjectId} [userId] - Authenticated user ID
 * @param {Array} [items] - Order/Cart items with product info
 * @param {number} subtotal - Subtotal amount
 * @returns {Promise<Object>}
 */
const validateAndCalculateCoupon = async (code, userId = null, items = [], subtotal = 0) => {
  if (!code || typeof code !== 'string' || !code.trim()) {
    return {
      isValid: false,
      message: 'Coupon code is required'
    };
  }

  const normalizedCode = code.trim().toUpperCase();
  const coupon = await Coupon.findOne({ code: normalizedCode });

  if (!coupon) {
    return {
      isValid: false,
      message: 'Invalid coupon code'
    };
  }

  // Check active status
  if (!coupon.isActive) {
    return {
      isValid: false,
      message: 'This coupon is currently inactive'
    };
  }

  const now = new Date();

  // Check start date
  if (coupon.startDate && now < new Date(coupon.startDate)) {
    return {
      isValid: false,
      message: 'This coupon is not active yet'
    };
  }

  // Check end date
  if (coupon.endDate && now > new Date(coupon.endDate)) {
    return {
      isValid: false,
      message: 'This coupon has expired'
    };
  }

  // Check total usage limit
  if (coupon.usageLimit && coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return {
      isValid: false,
      message: 'This coupon has reached its maximum usage limit'
    };
  }

  // Check per-user usage limit if user is authenticated
  if (userId && coupon.perUserLimit) {
    const userUsedCount = await Order.countDocuments({
      user: userId,
      'coupon.code': normalizedCode,
      orderStatus: { $ne: 'cancelled' }
    });

    if (userUsedCount >= coupon.perUserLimit) {
      return {
        isValid: false,
        message: `You have already used this coupon the maximum allowed number of times (${coupon.perUserLimit})`
      };
    }
  }

  // Determine eligible items and subtotal based on applicable products/categories/collections
  let eligibleSubtotal = subtotal;

  const hasProductRestrictions = coupon.applicableProducts && coupon.applicableProducts.length > 0;
  const hasCategoryRestrictions = coupon.applicableCategories && coupon.applicableCategories.length > 0;
  const hasCollectionRestrictions = coupon.applicableCollections && coupon.applicableCollections.length > 0;

  if ((hasProductRestrictions || hasCategoryRestrictions || hasCollectionRestrictions) && items && items.length > 0) {
    eligibleSubtotal = 0;

    for (const item of items) {
      let isEligible = false;
      const prodId = item.product?._id ? item.product._id.toString() : item.product?.toString();
      const catId = item.product?.category?._id ? item.product.category._id.toString() : item.product?.category?.toString();
      const colId = item.product?.collection?._id ? item.product.collection._id.toString() : item.product?.collection?.toString();

      if (hasProductRestrictions && coupon.applicableProducts.some(p => p.toString() === prodId)) {
        isEligible = true;
      }
      if (hasCategoryRestrictions && catId && coupon.applicableCategories.some(c => c.toString() === catId)) {
        isEligible = true;
      }
      if (hasCollectionRestrictions && colId && coupon.applicableCollections.some(c => c.toString() === colId)) {
        isEligible = true;
      }

      if (isEligible) {
        eligibleSubtotal += (item.price * item.quantity);
      }
    }

    if (eligibleSubtotal === 0) {
      return {
        isValid: false,
        message: 'This coupon is not applicable to any items in your cart'
      };
    }
  }

  // Check minimum order amount
  if (coupon.minimumOrderAmount && eligibleSubtotal < coupon.minimumOrderAmount) {
    return {
      isValid: false,
      message: `Minimum order amount of ₹${coupon.minimumOrderAmount} required to apply this coupon`
    };
  }

  // Calculate discount amount
  let discountAmount = 0;

  if (coupon.discountType === 'percentage') {
    discountAmount = (eligibleSubtotal * coupon.discountValue) / 100;
    if (coupon.maximumDiscount && coupon.maximumDiscount > 0 && discountAmount > coupon.maximumDiscount) {
      discountAmount = coupon.maximumDiscount;
    }
  } else if (coupon.discountType === 'fixed') {
    discountAmount = coupon.discountValue;
  }

  // Never allow discount to exceed eligible subtotal or overall subtotal
  discountAmount = Math.min(discountAmount, eligibleSubtotal, subtotal);
  discountAmount = Math.max(0, Math.round(discountAmount * 100) / 100);

  return {
    isValid: true,
    coupon,
    discountAmount,
    eligibleSubtotal
  };
};

module.exports = {
  validateAndCalculateCoupon
};
