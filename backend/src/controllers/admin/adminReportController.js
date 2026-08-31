const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/User');
const Return = require('../../models/Return');

/**
 * @desc    Get Sales Report
 * @route   GET /api/admin/reports/sales
 * @access  Private (Admin / Manager)
 */
const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;

    const match = { orderStatus: { $nin: ['cancelled'] } };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    let dateFormat = '%Y-%m-%d';
    if (period === 'monthly') dateFormat = '%Y-%m';
    else if (period === 'yearly') dateFormat = '%Y';

    const [breakdown, totals] = await Promise.all([
      Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
            ordersCount: { $sum: 1 },
            subtotal: { $sum: '$subtotal' },
            discount: { $sum: '$discount' },
            shippingFee: { $sum: '$shippingFee' },
            tax: { $sum: '$tax' },
            totalRevenue: { $sum: '$total' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSubtotal: { $sum: '$subtotal' },
            totalDiscount: { $sum: '$discount' },
            totalShippingFee: { $sum: '$shippingFee' },
            totalTax: { $sum: '$tax' },
            netRevenue: { $sum: '$total' }
          }
        }
      ])
    ]);

    const summary = totals.length > 0 ? totals[0] : {
      totalOrders: 0,
      totalSubtotal: 0,
      totalDiscount: 0,
      totalShippingFee: 0,
      totalTax: 0,
      netRevenue: 0
    };

    res.status(200).json({
      success: true,
      data: {
        summary,
        breakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Orders Report
 * @route   GET /api/admin/reports/orders
 * @access  Private (Admin / Manager)
 */
const getOrdersReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const [statusStats, paymentStats, totals] = await Promise.all([
      Order.aggregate([
        { $match: match },
        { $group: { _id: '$orderStatus', count: { $sum: 1 }, totalAmount: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: match },
        { $group: { _id: '$paymentMethod', count: { $sum: 1 }, totalAmount: { $sum: '$total' } } }
      ]),
      Order.countDocuments(match)
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders: totals,
        statusStats,
        paymentStats
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Customers Report
 * @route   GET /api/admin/reports/customers
 * @access  Private (Admin / Manager)
 */
const getCustomersReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const match = { role: 'customer' };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const [totalCustomers, activeCustomers, topSpenders] = await Promise.all([
      User.countDocuments(match),
      User.countDocuments({ ...match, isActive: true }),
      Order.aggregate([
        { $match: { orderStatus: { $nin: ['cancelled'] } } },
        {
          $group: {
            _id: '$user',
            orderCount: { $sum: 1 },
            totalSpent: { $sum: '$total' }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            orderCount: 1,
            totalSpent: 1,
            'user.firstName': 1,
            'user.lastName': 1,
            'user.email': 1
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        topSpenders
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Inventory Report
 * @route   GET /api/admin/reports/inventory
 * @access  Private (Admin / Manager)
 */
const getInventoryReport = async (req, res, next) => {
  try {
    const [
      totalProducts,
      outOfStockCount,
      lowStockCount,
      valuationResult
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: 0, isActive: true }),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 }, isActive: true }),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalStockQuantity: { $sum: '$stock' },
            totalStockValuation: { $sum: { $multiply: ['$price', '$stock'] } }
          }
        }
      ])
    ]);

    const valuation = valuationResult.length > 0 ? valuationResult[0] : {
      totalStockQuantity: 0,
      totalStockValuation: 0
    };

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        outOfStockCount,
        lowStockCount,
        totalStockQuantity: valuation.totalStockQuantity,
        totalStockValuation: Math.round(valuation.totalStockValuation * 100) / 100
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Returns Report
 * @route   GET /api/admin/reports/returns
 * @access  Private (Admin / Manager)
 */
const getReturnsReport = async (req, res, next) => {
  try {
    const [totalReturns, statusBreakdown, refundsResult] = await Promise.all([
      Return.countDocuments(),
      Return.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, totalRefund: { $sum: '$refundAmount' } } }
      ]),
      Return.aggregate([
        { $match: { status: 'refunded' } },
        { $group: { _id: null, totalRefundedAmount: { $sum: '$refundAmount' } } }
      ])
    ]);

    const totalRefunded = refundsResult.length > 0 ? refundsResult[0].totalRefundedAmount : 0;

    res.status(200).json({
      success: true,
      data: {
        totalReturns,
        totalRefundedAmount: Math.round(totalRefunded * 100) / 100,
        statusBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalesReport,
  getOrdersReport,
  getCustomersReport,
  getInventoryReport,
  getReturnsReport
};
