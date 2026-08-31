const Banner = require('../../models/Banner');
const WebsiteSection = require('../../models/WebsiteSection');
const Notification = require('../../models/Notification');
const Return = require('../../models/Return');
const Brand = require('../../models/Brand');
const SizeGuide = require('../../models/SizeGuide');
const GiftCard = require('../../models/GiftCard');
const mongoose = require('mongoose');

// ==================== BANNERS ====================
const getAdminBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    next(error);
  }
};

const getAdminBannerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

const createAdminBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, message: 'Banner created successfully', data: banner });
  } catch (error) {
    next(error);
  }
};

const updateAdminBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, message: 'Banner updated successfully', data: banner });
  } catch (error) {
    next(error);
  }
};

const deleteAdminBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== WEBSITE CONTENT ====================
const getAdminWebsiteContent = async (req, res, next) => {
  try {
    const sections = await WebsiteSection.find().sort({ sortOrder: 1 });
    res.status(200).json({ success: true, count: sections.length, data: sections });
  } catch (error) {
    next(error);
  }
};

const getAdminWebsiteSectionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const section = await WebsiteSection.findById(id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

const createAdminWebsiteSection = async (req, res, next) => {
  try {
    const section = await WebsiteSection.create(req.body);
    res.status(201).json({ success: true, message: 'Section created successfully', data: section });
  } catch (error) {
    next(error);
  }
};

const updateAdminWebsiteSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const section = await WebsiteSection.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    res.status(200).json({ success: true, message: 'Section updated successfully', data: section });
  } catch (error) {
    next(error);
  }
};

const deleteAdminWebsiteSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const section = await WebsiteSection.findByIdAndDelete(id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    res.status(200).json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== NOTIFICATIONS ====================
const getAdminNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
};

const markAdminNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.status(200).json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    next(error);
  }
};

const deleteAdminNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== RETURNS & EXCHANGES ====================
const getAdminReturns = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [returns, total] = await Promise.all([
      Return.find(query)
        .populate('user', 'firstName lastName email')
        .populate('order', 'orderNumber total')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Return.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: returns,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 }
    });
  } catch (error) {
    next(error);
  }
};

const getAdminReturnById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const returnDoc = await Return.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('order');
    if (!returnDoc) return res.status(404).json({ success: false, message: 'Return not found' });
    res.status(200).json({ success: true, data: returnDoc });
  } catch (error) {
    next(error);
  }
};

const updateAdminReturnStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, refundAmount, adminNotes } = req.body;
    const returnDoc = await Return.findById(id);
    if (!returnDoc) return res.status(404).json({ success: false, message: 'Return not found' });

    if (status) returnDoc.status = status;
    if (refundAmount !== undefined) returnDoc.refundAmount = refundAmount;
    if (adminNotes !== undefined) returnDoc.adminNotes = adminNotes;

    await returnDoc.save();
    res.status(200).json({ success: true, message: 'Return status updated successfully', data: returnDoc });
  } catch (error) {
    next(error);
  }
};

const approveAdminReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const returnDoc = await Return.findById(id);
    if (!returnDoc) return res.status(404).json({ success: false, message: 'Return not found' });

    returnDoc.status = 'approved';
    await returnDoc.save();
    res.status(200).json({ success: true, message: 'Return approved successfully', data: returnDoc });
  } catch (error) {
    next(error);
  }
};

const rejectAdminReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const returnDoc = await Return.findById(id);
    if (!returnDoc) return res.status(404).json({ success: false, message: 'Return not found' });

    returnDoc.status = 'rejected';
    if (reason) returnDoc.adminNotes = reason;
    await returnDoc.save();
    res.status(200).json({ success: true, message: 'Return rejected', data: returnDoc });
  } catch (error) {
    next(error);
  }
};

// ==================== BRANDS ====================
const getAdminBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: brands.length, data: brands });
  } catch (error) {
    next(error);
  }
};

const getAdminBrandById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
};

const createAdminBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ success: true, message: 'Brand created successfully', data: brand });
  } catch (error) {
    next(error);
  }
};

const updateAdminBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.status(200).json({ success: true, message: 'Brand updated successfully', data: brand });
  } catch (error) {
    next(error);
  }
};

const deleteAdminBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.status(200).json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== SIZE GUIDES ====================
const getAdminSizeGuides = async (req, res, next) => {
  try {
    const sizeGuides = await SizeGuide.find().populate('category', 'name').sort({ name: 1 });
    res.status(200).json({ success: true, count: sizeGuides.length, data: sizeGuides });
  } catch (error) {
    next(error);
  }
};

const getAdminSizeGuideById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sizeGuide = await SizeGuide.findById(id).populate('category', 'name');
    if (!sizeGuide) return res.status(404).json({ success: false, message: 'Size guide not found' });
    res.status(200).json({ success: true, data: sizeGuide });
  } catch (error) {
    next(error);
  }
};

const createAdminSizeGuide = async (req, res, next) => {
  try {
    const sizeGuide = await SizeGuide.create(req.body);
    res.status(201).json({ success: true, message: 'Size guide created successfully', data: sizeGuide });
  } catch (error) {
    next(error);
  }
};

const updateAdminSizeGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sizeGuide = await SizeGuide.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!sizeGuide) return res.status(404).json({ success: false, message: 'Size guide not found' });
    res.status(200).json({ success: true, message: 'Size guide updated successfully', data: sizeGuide });
  } catch (error) {
    next(error);
  }
};

const deleteAdminSizeGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sizeGuide = await SizeGuide.findByIdAndDelete(id);
    if (!sizeGuide) return res.status(404).json({ success: false, message: 'Size guide not found' });
    res.status(200).json({ success: true, message: 'Size guide deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== GIFT CARDS ====================
const getAdminGiftCards = async (req, res, next) => {
  try {
    const giftCards = await GiftCard.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: giftCards.length, data: giftCards });
  } catch (error) {
    next(error);
  }
};

const getAdminGiftCardById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const giftCard = await GiftCard.findById(id);
    if (!giftCard) return res.status(404).json({ success: false, message: 'Gift card not found' });
    res.status(200).json({ success: true, data: giftCard });
  } catch (error) {
    next(error);
  }
};

const createAdminGiftCard = async (req, res, next) => {
  try {
    const giftCard = await GiftCard.create(req.body);
    res.status(201).json({ success: true, message: 'Gift card created successfully', data: giftCard });
  } catch (error) {
    next(error);
  }
};

const updateAdminGiftCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const giftCard = await GiftCard.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!giftCard) return res.status(404).json({ success: false, message: 'Gift card not found' });
    res.status(200).json({ success: true, message: 'Gift card updated successfully', data: giftCard });
  } catch (error) {
    next(error);
  }
};

const deleteAdminGiftCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const giftCard = await GiftCard.findByIdAndDelete(id);
    if (!giftCard) return res.status(404).json({ success: false, message: 'Gift card not found' });
    res.status(200).json({ success: true, message: 'Gift card deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Banners
  getAdminBanners,
  getAdminBannerById,
  createAdminBanner,
  updateAdminBanner,
  deleteAdminBanner,
  // Website Content
  getAdminWebsiteContent,
  getAdminWebsiteSectionById,
  createAdminWebsiteSection,
  updateAdminWebsiteSection,
  deleteAdminWebsiteSection,
  // Notifications
  getAdminNotifications,
  markAdminNotificationRead,
  deleteAdminNotification,
  // Returns
  getAdminReturns,
  getAdminReturnById,
  updateAdminReturnStatus,
  approveAdminReturn,
  rejectAdminReturn,
  // Brands
  getAdminBrands,
  getAdminBrandById,
  createAdminBrand,
  updateAdminBrand,
  deleteAdminBrand,
  // Size Guides
  getAdminSizeGuides,
  getAdminSizeGuideById,
  createAdminSizeGuide,
  updateAdminSizeGuide,
  deleteAdminSizeGuide,
  // Gift Cards
  getAdminGiftCards,
  getAdminGiftCardById,
  createAdminGiftCard,
  updateAdminGiftCard,
  deleteAdminGiftCard
};
