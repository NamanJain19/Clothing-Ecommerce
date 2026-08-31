const Setting = require('../../models/Setting');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get store settings
// @route   GET /api/admin/settings
// @access  Private (Admin / Manager)
exports.getStoreSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }
    return res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

// @desc    Update store settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateStoreSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create(req.body);
    } else {
      Object.assign(setting, req.body);
      await setting.save();
    }
    return res.status(200).json({
      success: true,
      data: setting,
      message: 'Store settings updated in database successfully',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private (Admin)
exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user?._id;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    // Find admin user including password field
    const adminUser = await User.findById(adminId).select('+password');
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
      });
    }

    // If currentPassword is provided, verify it
    if (currentPassword) {
      const isMatch = await adminUser.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }
    }

    // Update password
    adminUser.password = newPassword;
    await adminUser.save();

    return res.status(200).json({
      success: true,
      message: 'Admin password successfully updated in MongoDB database',
    });
  } catch (error) {
    console.error('Error changing admin password:', error);
    return res.status(500).json({ success: false, message: 'Server error changing password' });
  }
};
