/**
 * Configurable order pricing settings
 */
const ORDER_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 1999, // Free standard shipping on orders above ₹1,999
  DEFAULT_SHIPPING_FEE: 99,      // Standard shipping fee
  EXPRESS_SHIPPING_FEE: 250,     // Express courier shipping fee
  TAX_RATE: 0.05                 // 5% standard tax included
};

/**
 * Generate a unique human-readable order number
 * Format: ORD-YYYYMMDD-XXXXXX
 */
const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
};

/**
 * Generate a unique courier tracking number
 * Format: MNL-TRK-YYYYMMDD-XXXXXX
 */
const generateTrackingNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MNL-TRK-${dateStr}-${randomStr}`;
};

/**
 * Generate a unique official invoice number
 * Format: INV-YYYYMMDD-XXXXXX
 */
const generateInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${dateStr}-${randomStr}`;
};

/**
 * Add business days to a given date (skips Sundays)
 * @param {Date} startDate 
 * @param {number} days 
 * @returns {Date}
 */
const addBusinessDays = (startDate, days) => {
  const result = new Date(startDate);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    // Skip Sunday (0)
    if (result.getDay() !== 0) {
      added++;
    }
  }
  return result;
};

/**
 * Format date range nicely (e.g., "Sep 4 – Sep 6, 2026")
 * @param {Date} minDate 
 * @param {Date} maxDate 
 * @returns {string}
 */
const formatDeliveryDateRange = (minDate, maxDate) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const minM = months[minDate.getMonth()];
  const minD = minDate.getDate();
  const maxM = months[maxDate.getMonth()];
  const maxD = maxDate.getDate();
  const year = maxDate.getFullYear();

  if (minM === maxM) {
    return `${minM} ${minD} – ${maxD}, ${year}`;
  }
  return `${minM} ${minD} – ${maxM} ${maxD}, ${year}`;
};

/**
 * Calculate deterministic server-side estimated delivery dates
 * Order Date + Processing Time + Shipping Transit Time = Estimated Delivery
 * @param {Date|string|number} orderDate 
 * @param {'standard'|'express'} shippingMethod 
 * @returns {Object}
 */
const calculateDeliveryDates = (orderDate = new Date(), shippingMethod = 'standard') => {
  const baseDate = new Date(orderDate);
  const isValidDate = !isNaN(baseDate.getTime());
  const dateToUse = isValidDate ? baseDate : new Date();

  // Processing: 1 business day for atelier preparation & quality check
  // Standard transit: 3 to 5 business days
  // Express transit: 1 to 2 business days
  let minDays = 4; // 1 processing + 3 transit
  let maxDays = 6; // 1 processing + 5 transit
  let transitLabel = '3-5 Business Days';

  if (shippingMethod === 'express') {
    minDays = 2; // 1 processing + 1 transit
    maxDays = 3; // 1 processing + 2 transit
    transitLabel = '1-2 Business Days';
  }

  const minDate = addBusinessDays(dateToUse, minDays);
  const maxDate = addBusinessDays(dateToUse, maxDays);
  const formattedRange = formatDeliveryDateRange(minDate, maxDate);
  const estimatedDelivery = `${formattedRange} (${transitLabel})`;

  return {
    estimatedDeliveryDate: maxDate,
    estimatedDeliveryMinDate: minDate,
    estimatedDeliveryMaxDate: maxDate,
    estimatedDelivery,
    formattedRange,
    transitLabel,
    shippingMethod
  };
};

/**
 * Estimated delivery window
 */
const getEstimatedDelivery = (shippingMethod = 'standard', orderDate = new Date()) => {
  const info = calculateDeliveryDates(orderDate, shippingMethod);
  return info.estimatedDelivery;
};

/**
 * Calculate order pricing breakdown
 * @param {number} subtotal 
 * @param {number} discount 
 * @param {string} shippingMethod ('standard' | 'express')
 * @param {Date} orderDate
 * @returns {Object}
 */
const calculateOrderPricing = (subtotal, discount = 0, shippingMethod = 'standard', orderDate = new Date()) => {
  const finalDiscount = Math.max(0, Number(discount) || 0);
  const discountedSubtotal = Math.max(0, subtotal - finalDiscount);

  let shippingFee = 0;
  if (shippingMethod === 'express') {
    shippingFee = ORDER_CONFIG.EXPRESS_SHIPPING_FEE;
  } else {
    if (discountedSubtotal > 0 && discountedSubtotal < ORDER_CONFIG.FREE_SHIPPING_THRESHOLD) {
      shippingFee = ORDER_CONFIG.DEFAULT_SHIPPING_FEE;
    }
  }

  // Tax is calculated on discounted goods
  const tax = Math.round(discountedSubtotal * ORDER_CONFIG.TAX_RATE * 100) / 100;
  const total = Math.round((discountedSubtotal + shippingFee + tax) * 100) / 100;
  const deliveryInfo = calculateDeliveryDates(orderDate, shippingMethod);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: finalDiscount,
    shippingFee,
    tax,
    total,
    shippingMethod,
    estimatedDelivery: deliveryInfo.estimatedDelivery,
    estimatedDeliveryDate: deliveryInfo.estimatedDeliveryDate,
    estimatedDeliveryMinDate: deliveryInfo.estimatedDeliveryMinDate,
    estimatedDeliveryMaxDate: deliveryInfo.estimatedDeliveryMaxDate
  };
};

/**
 * Generate tracking timeline based on current order status
 */
const getOrderTimeline = (currentStatus, createdAt, updatedAt) => {
  const allStages = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'packed', label: 'Packed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  if (currentStatus === 'cancelled') {
    return [
      { status: 'Order Placed', completed: true, timestamp: createdAt },
      { status: 'Cancelled', completed: true, timestamp: updatedAt, isCancelled: true }
    ];
  }

  if (currentStatus === 'returned' || currentStatus === 'refunded') {
    return [
      ...allStages.map(stage => ({ status: stage.label, completed: true, timestamp: createdAt })),
      { status: currentStatus === 'returned' ? 'Returned' : 'Refunded', completed: true, timestamp: updatedAt }
    ];
  }

  const currentIndex = allStages.findIndex(s => s.key === currentStatus);

  return allStages.map((stage, idx) => {
    const isCompleted = idx <= (currentIndex !== -1 ? currentIndex : 0);
    const isCurrent = idx === currentIndex;

    return {
      status: stage.label,
      completed: isCompleted,
      current: isCurrent,
      timestamp: isCurrent ? updatedAt : (isCompleted ? createdAt : null)
    };
  });
};

module.exports = {
  ORDER_CONFIG,
  generateOrderNumber,
  generateTrackingNumber,
  generateInvoiceNumber,
  getEstimatedDelivery,
  calculateOrderPricing,
  calculateDeliveryDates,
  addBusinessDays,
  getOrderTimeline
};
