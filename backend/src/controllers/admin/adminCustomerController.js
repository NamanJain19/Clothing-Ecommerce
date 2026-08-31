const User = require('../../models/User');
const Order = require('../../models/Order');
const Address = require('../../models/Address');
const mongoose = require('mongoose');

/**
 * @desc    Get all customers with aggregated order statistics
 * @route   GET /api/admin/customers
 * @access  Private (Admin / Manager / Staff)
 */
const getAdminCustomers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      isActive,
      sort
    } = req.query;

    const query = { role: 'customer' };

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'name_asc') sortOption = { firstName: 1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
      User.find(query)
        .select('-password -__v')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query)
    ]);

    // Aggregate orders count and total spent for these customers
    const customerIds = customers.map(c => c._id);
    const orderStats = await Order.aggregate([
      { $match: { user: { $in: customerIds }, orderStatus: { $nin: ['cancelled'] } } },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$total' }
        }
      }
    ]);

    const statsMap = {};
    orderStats.forEach(s => {
      statsMap[s._id.toString()] = {
        orderCount: s.orderCount,
        totalSpent: Math.round(s.totalSpent * 100) / 100
      };
    });

    const customersWithMetrics = customers.map(c => {
      const cObj = c.toObject();
      const stats = statsMap[c._id.toString()] || { orderCount: 0, totalSpent: 0 };
      return {
        ...cObj,
        orderCount: stats.orderCount,
        totalSpent: stats.totalSpent
      };
    });

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      data: customersWithMetrics,
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
 * @desc    Get customer details by ID
 * @route   GET /api/admin/customers/:id
 * @access  Private (Admin / Manager / Staff)
 */
const getAdminCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID format'
      });
    }

    const customer = await User.findById(id).select('-password -__v');
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Fetch customer's addresses and orders
    const [addresses, orders] = await Promise.all([
      Address.find({ user: id }).sort({ isDefault: -1 }),
      Order.find({ user: id }).sort({ createdAt: -1 })
    ]);

    const totalSpent = orders
      .filter(o => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    res.status(200).json({
      success: true,
      data: {
        customer,
        addresses,
        orders,
        orderCount: orders.length,
        totalSpent: Math.round(totalSpent * 100) / 100
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update customer status
 * @route   PATCH /api/admin/customers/:id/status
 * @access  Private (Admin / Manager)
 */
const updateAdminCustomerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID format'
      });
    }

    const customer = await User.findById(id).select('-password -__v');
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Role safety: only admin can promote to staff/manager/admin
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only superadmins can change user roles'
      });
    }

    if (isActive !== undefined) customer.isActive = isActive;
    if (role) customer.role = role;

    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Customer status updated successfully',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminCustomers,
  getAdminCustomerById,
  updateAdminCustomerStatus
};
