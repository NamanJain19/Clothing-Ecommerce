const Product = require('../../models/Product');
const Order = require('../../models/Order');
const User = require('../../models/User');
const Return = require('../../models/Return');

/**
 * @desc    Get comprehensive admin dashboard metrics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin / Manager / Staff)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      revenueResult,
      pendingOrders,
      lowStockProducts,
      totalReturns,
      refundResult,
      recentOrders,
      topProductsResult
    ] = await Promise.all([
      // Total Products (all)
      Product.countDocuments(),

      // Total Orders
      Order.countDocuments(),

      // Total Customers
      User.countDocuments({ role: 'customer' }),

      // Total Revenue (all non-cancelled orders)
      Order.aggregate([
        { $match: { orderStatus: { $nin: ['cancelled'] } } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
      ]),

      // Pending / In-progress Orders
      Order.countDocuments({ orderStatus: { $in: ['pending', 'confirmed', 'processing'] } }),

      // Low Stock Products (stock <= 5 and active)
      Product.countDocuments({ stock: { $lte: 5 }, isActive: true }),

      // Total Returns
      Return.countDocuments(),

      // Total Refunds
      Return.aggregate([
        { $match: { status: 'refunded' } },
        { $group: { _id: null, totalRefunds: { $sum: '$refundAmount' } } }
      ]),

      // Recent 5 Orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'firstName lastName email'),

      // Top 5 Selling Products
      Order.aggregate([
        { $match: { orderStatus: { $nin: ['cancelled'] } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$items.name' },
            image: { $first: '$items.image' },
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
      ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? Math.round(revenueResult[0].totalRevenue * 100) / 100 : 0;
    const totalRefunds = refundResult.length > 0 ? Math.round(refundResult[0].totalRefunds * 100) / 100 : 0;

    // Sales summary breakdown (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesSummary = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          orderStatus: { $nin: ['cancelled'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        pendingOrders,
        lowStockProducts,
        totalReturns,
        totalRefunds,
        recentOrders,
        topProducts: topProductsResult,
        salesSummary
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Sales Analytics
 * @route   GET /api/admin/analytics/sales
 * @access  Private (Admin / Manager)
 */
const getSalesAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;

    const matchQuery = { orderStatus: { $nin: ['cancelled'] } };
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const dateFormat = period === 'monthly' ? '%Y-%m' : '%Y-%m-%d';

    const salesData = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          totalSales: { $sum: '$total' },
          subtotal: { $sum: '$subtotal' },
          discount: { $sum: '$discount' },
          tax: { $sum: '$tax' },
          shipping: { $sum: '$shippingFee' },
          ordersCount: { $sum: 1 },
          averageOrderValue: { $avg: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: salesData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Order Analytics
 * @route   GET /api/admin/analytics/orders
 * @access  Private (Admin / Manager)
 */
const getOrderAnalytics = async (req, res, next) => {
  try {
    const [statusBreakdown, paymentBreakdown] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 },
            totalAmount: { $sum: '$total' }
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            totalAmount: { $sum: '$total' }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusBreakdown,
        paymentBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Customer Analytics
 * @route   GET /api/admin/analytics/customers
 * @access  Private (Admin / Manager)
 */
const getCustomerAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [customerGrowth, customerSpending] = await Promise.all([
      User.aggregate([
        { $match: { role: 'customer', createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            newCustomers: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $nin: ['cancelled'] } } },
        {
          $group: {
            _id: '$user',
            totalSpent: { $sum: '$total' },
            orderCount: { $sum: 1 }
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
            totalSpent: 1,
            orderCount: 1,
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
        customerGrowth,
        topCustomers: customerSpending
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Product Analytics
 * @route   GET /api/admin/analytics/products
 * @access  Private (Admin / Manager)
 */
const getProductAnalytics = async (req, res, next) => {
  try {
    const categorySales = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['cancelled'] } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productInfo.category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo._id',
          categoryName: { $first: '$categoryInfo.name' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        categorySales
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getSalesAnalytics,
  getOrderAnalytics,
  getCustomerAnalytics,
  getProductAnalytics
};
