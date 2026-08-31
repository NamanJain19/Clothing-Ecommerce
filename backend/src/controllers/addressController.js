const mongoose = require('mongoose');
const Address = require('../models/Address');

/**
 * @desc    Get all addresses of the authenticated user
 * @route   GET /api/addresses
 * @access  Private
 */
const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const addresses = await Address.find({ user: userId })
      .sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single address by ID
 * @route   GET /api/addresses/:id
 * @access  Private
 */
const getAddressById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address ID format'
      });
    }

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new address for the authenticated user
 * @route   POST /api/addresses
 * @access  Private
 */
const createAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      landmark,
      addressType,
      isDefault,
      latitude,
      longitude,
      formattedAddress
    } = req.body;

    // Validate required fields
    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required address fields (fullName, phone, addressLine1, city, state, postalCode)'
      });
    }

    const existingCount = await Address.countDocuments({ user: userId });
    let shouldBeDefault = isDefault === true || existingCount === 0;

    // If marked as default, unset other defaults
    if (shouldBeDefault && existingCount > 0) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const address = await Address.create({
      user: userId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2 ? addressLine2.trim() : '',
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country ? country.trim() : 'India',
      landmark: landmark ? landmark.trim() : '',
      addressType: addressType || 'home',
      isDefault: shouldBeDefault,
      latitude: latitude !== undefined && latitude !== null ? Number(latitude) : null,
      longitude: longitude !== undefined && longitude !== null ? Number(longitude) : null,
      formattedAddress: formattedAddress ? formattedAddress.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing address
 * @route   PUT /api/addresses/:id
 * @access  Private
 */
const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address ID format'
      });
    }

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      landmark,
      addressType,
      isDefault,
      latitude,
      longitude,
      formattedAddress
    } = req.body;

    if (isDefault === true) {
      await Address.updateMany({ user: userId, _id: { $ne: id } }, { isDefault: false });
      address.isDefault = true;
    } else if (isDefault === false && address.isDefault) {
      // Don't unset default if it's the only address
      const count = await Address.countDocuments({ user: userId });
      if (count > 1) {
        address.isDefault = false;
      }
    }

    if (fullName) address.fullName = fullName.trim();
    if (phone) address.phone = phone.trim();
    if (addressLine1) address.addressLine1 = addressLine1.trim();
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2.trim();
    if (city) address.city = city.trim();
    if (state) address.state = state.trim();
    if (postalCode) address.postalCode = postalCode.trim();
    if (country) address.country = country.trim();
    if (landmark !== undefined) address.landmark = landmark.trim();
    if (addressType) address.addressType = addressType;
    if (latitude !== undefined) address.latitude = latitude !== null ? Number(latitude) : null;
    if (longitude !== undefined) address.longitude = longitude !== null ? Number(longitude) : null;
    if (formattedAddress !== undefined) address.formattedAddress = formattedAddress.trim();

    await address.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an address
 * @route   DELETE /api/addresses/:id
 * @access  Private
 */
const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address ID format'
      });
    }

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const wasDefault = address.isDefault;
    await Address.deleteOne({ _id: id });

    // If the deleted address was default, make the newest remaining address default
    if (wasDefault) {
      const remaining = await Address.findOne({ user: userId }).sort({ createdAt: -1 });
      if (remaining) {
        remaining.isDefault = true;
        await remaining.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Set an address as default
 * @route   PATCH /api/addresses/:id/default
 * @access  Private
 */
const setDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address ID format'
      });
    }

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Unset all other addresses
    await Address.updateMany({ user: userId }, { isDefault: false });

    // Set target as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: 'Address set as default successfully',
      data: address
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
