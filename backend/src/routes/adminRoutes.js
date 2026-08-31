const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/authMiddleware');

// Existing controllers
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionController');
const {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');

// Admin specialized controllers
const {
  getDashboardStats,
  getSalesAnalytics,
  getOrderAnalytics,
  getCustomerAnalytics,
  getProductAnalytics
} = require('../controllers/admin/adminDashboardController');
const {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
} = require('../controllers/admin/adminProductController');
const {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  createAdminShipment,
  refreshAdminShipmentTracking,
  getAdminOrderInvoice,
  getAdminOrderInvoicePDF
} = require('../controllers/admin/adminOrderController');
const {
  getAdminCustomers,
  getAdminCustomerById,
  updateAdminCustomerStatus
} = require('../controllers/admin/adminCustomerController');
const {
  getInventory,
  getLowStockProducts,
  updateInventoryStock
} = require('../controllers/admin/adminInventoryController');
const {
  getAdminReviews,
  getAdminReviewById,
  approveAdminReview,
  rejectAdminReview,
  deleteAdminReview
} = require('../controllers/admin/adminReviewController');
const {
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
} = require('../controllers/admin/adminContentController');
const {
  getSalesReport,
  getOrdersReport,
  getCustomersReport,
  getInventoryReport,
  getReturnsReport
} = require('../controllers/admin/adminReportController');

// Apply JWT authentication to ALL Admin routes
router.use(authenticate);

// 1. Admin Auth Me
router.get('/me', requireRole('admin', 'manager', 'staff'), (req, res) => {
  const user = req.user.toObject ? req.user.toObject() : req.user;
  delete user.password;
  delete user.__v;
  res.status(200).json({
    success: true,
    data: user
  });
});

// 2. Admin Dashboard & Analytics
router.get('/dashboard', requireRole('admin', 'manager', 'staff'), getDashboardStats);
router.get('/analytics/sales', requireRole('admin', 'manager'), getSalesAnalytics);
router.get('/analytics/orders', requireRole('admin', 'manager'), getOrderAnalytics);
router.get('/analytics/customers', requireRole('admin', 'manager'), getCustomerAnalytics);
router.get('/analytics/products', requireRole('admin', 'manager'), getProductAnalytics);

// 3. Products Management
router.route('/products')
  .get(requireRole('admin', 'manager', 'staff'), getAdminProducts)
  .post(requireRole('admin', 'manager'), createAdminProduct);

router.route('/products/:id')
  .get(requireRole('admin', 'manager', 'staff'), getAdminProductById)
  .put(requireRole('admin', 'manager'), updateAdminProduct)
  .delete(requireRole('admin'), deleteAdminProduct);

// 4. Categories Management
router.route('/categories')
  .get(requireRole('admin', 'manager', 'staff'), getCategories)
  .post(requireRole('admin', 'manager'), createCategory);

router.route('/categories/:id')
  .get(requireRole('admin', 'manager', 'staff'), getCategoryById)
  .put(requireRole('admin', 'manager'), updateCategory)
  .delete(requireRole('admin', 'manager'), deleteCategory);

// 5. Collections Management
router.route('/collections')
  .get(requireRole('admin', 'manager', 'staff'), getCollections)
  .post(requireRole('admin', 'manager'), createCollection);

router.route('/collections/:id')
  .get(requireRole('admin', 'manager', 'staff'), getCollectionById)
  .put(requireRole('admin', 'manager'), updateCollection)
  .delete(requireRole('admin', 'manager'), deleteCollection);

// 6. Orders Management
router.get('/orders', requireRole('admin', 'manager', 'staff'), getAdminOrders);
router.get('/orders/:id/invoice/download', requireRole('admin', 'manager', 'staff'), getAdminOrderInvoicePDF);
router.get('/orders/:id/invoice', requireRole('admin', 'manager', 'staff'), getAdminOrderInvoice);
router.get('/orders/:id', requireRole('admin', 'manager', 'staff'), getAdminOrderById);
router.post('/orders/:id/shipment', requireRole('admin', 'manager', 'staff'), createAdminShipment);
router.post('/orders/:id/tracking/refresh', requireRole('admin', 'manager', 'staff'), refreshAdminShipmentTracking);
router.patch('/orders/:id/status', requireRole('admin', 'manager', 'staff'), updateAdminOrderStatus);
router.patch('/orders/:id/cancel', requireRole('admin', 'manager', 'staff'), (req, res, next) => {
  req.body.status = 'cancelled';
  updateAdminOrderStatus(req, res, next);
});

// 7. Customers Management
router.get('/customers', requireRole('admin', 'manager', 'staff'), getAdminCustomers);
router.get('/customers/:id', requireRole('admin', 'manager', 'staff'), getAdminCustomerById);
router.patch('/customers/:id/status', requireRole('admin', 'manager'), updateAdminCustomerStatus);

// 8. Inventory Management
router.get('/inventory', requireRole('admin', 'manager', 'staff'), getInventory);
router.get('/inventory/low-stock', requireRole('admin', 'manager', 'staff'), getLowStockProducts);
router.patch('/inventory/:productId', requireRole('admin', 'manager', 'staff'), updateInventoryStock);

// 9. Coupons Management
router.route('/coupons')
  .get(requireRole('admin', 'manager'), getCoupons)
  .post(requireRole('admin', 'manager'), createCoupon);

router.route('/coupons/:id')
  .get(requireRole('admin', 'manager'), getCouponById)
  .put(requireRole('admin', 'manager'), updateCoupon)
  .delete(requireRole('admin'), deleteCoupon);

// 10. Reviews Moderation
router.get('/reviews', requireRole('admin', 'manager', 'staff'), getAdminReviews);
router.get('/reviews/:id', requireRole('admin', 'manager', 'staff'), getAdminReviewById);
router.patch('/reviews/:id/approve', requireRole('admin', 'manager', 'staff'), approveAdminReview);
router.patch('/reviews/:id/reject', requireRole('admin', 'manager', 'staff'), rejectAdminReview);
router.delete('/reviews/:id', requireRole('admin', 'manager', 'staff'), deleteAdminReview);

// 11. Banners Management
router.route('/banners')
  .get(requireRole('admin', 'manager'), getAdminBanners)
  .post(requireRole('admin', 'manager'), createAdminBanner);

router.route('/banners/:id')
  .get(requireRole('admin', 'manager'), getAdminBannerById)
  .put(requireRole('admin', 'manager'), updateAdminBanner)
  .delete(requireRole('admin'), deleteAdminBanner);

// 12. Website Content Management
router.route('/website-content')
  .get(requireRole('admin', 'manager'), getAdminWebsiteContent)
  .post(requireRole('admin', 'manager'), createAdminWebsiteSection);

router.route('/website-content/:id')
  .get(requireRole('admin', 'manager'), getAdminWebsiteSectionById)
  .put(requireRole('admin', 'manager'), updateAdminWebsiteSection)
  .delete(requireRole('admin'), deleteAdminWebsiteSection);

// 13. Notifications Management
router.get('/notifications', requireRole('admin', 'manager', 'staff'), getAdminNotifications);
router.patch('/notifications/:id/read', requireRole('admin', 'manager', 'staff'), markAdminNotificationRead);
router.delete('/notifications/:id', requireRole('admin', 'manager', 'staff'), deleteAdminNotification);

// 14. Returns & Exchanges
router.get('/returns', requireRole('admin', 'manager', 'staff'), getAdminReturns);
router.get('/returns/:id', requireRole('admin', 'manager', 'staff'), getAdminReturnById);
router.patch('/returns/:id/status', requireRole('admin', 'manager', 'staff'), updateAdminReturnStatus);
router.patch('/returns/:id/approve', requireRole('admin', 'manager', 'staff'), approveAdminReturn);
router.patch('/returns/:id/reject', requireRole('admin', 'manager', 'staff'), rejectAdminReturn);

// 15. Brands Management
router.route('/brands')
  .get(requireRole('admin', 'manager'), getAdminBrands)
  .post(requireRole('admin', 'manager'), createAdminBrand);

router.route('/brands/:id')
  .get(requireRole('admin', 'manager'), getAdminBrandById)
  .put(requireRole('admin', 'manager'), updateAdminBrand)
  .delete(requireRole('admin'), deleteAdminBrand);

// 16. Size Guides Management
router.route('/size-guides')
  .get(requireRole('admin', 'manager'), getAdminSizeGuides)
  .post(requireRole('admin', 'manager'), createAdminSizeGuide);

router.route('/size-guides/:id')
  .get(requireRole('admin', 'manager'), getAdminSizeGuideById)
  .put(requireRole('admin', 'manager'), updateAdminSizeGuide)
  .delete(requireRole('admin'), deleteAdminSizeGuide);

// 17. Gift Cards Management
router.route('/gift-cards')
  .get(requireRole('admin', 'manager'), getAdminGiftCards)
  .post(requireRole('admin', 'manager'), createAdminGiftCard);

router.route('/gift-cards/:id')
  .get(requireRole('admin', 'manager'), getAdminGiftCardById)
  .put(requireRole('admin', 'manager'), updateAdminGiftCard)
  .delete(requireRole('admin'), deleteAdminGiftCard);

// 18. Reports
router.get('/reports/sales', requireRole('admin', 'manager'), getSalesReport);
router.get('/reports/orders', requireRole('admin', 'manager'), getOrdersReport);
router.get('/reports/customers', requireRole('admin', 'manager'), getCustomersReport);
router.get('/reports/inventory', requireRole('admin', 'manager'), getInventoryReport);
router.get('/reports/returns', requireRole('admin', 'manager'), getReturnsReport);

// 19. Store Settings & Password Updates (Database Persisted)
const {
  getStoreSettings,
  updateStoreSettings,
  changeAdminPassword
} = require('../controllers/admin/adminSettingsController');

// 20. Cloudinary Image Storage & Uploads
const {
  uploadMiddleware,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage
} = require('../controllers/admin/adminUploadController');

router.post(
  '/upload',
  requireRole('admin', 'manager'),
  uploadMiddleware.single('file'),
  uploadSingleImage
);

router.post(
  '/upload/multiple',
  requireRole('admin', 'manager'),
  uploadMiddleware.array('files', 10),
  uploadMultipleImages
);

router.post('/upload/delete', requireRole('admin', 'manager'), deleteImage);
router.delete('/upload', requireRole('admin', 'manager'), deleteImage);
router.delete('/upload/:publicId', requireRole('admin', 'manager'), deleteImage);

module.exports = router;
