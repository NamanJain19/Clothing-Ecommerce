const express = require('express');
const router = express.Router();
const {
  getCustomerNotifications,
  markCustomerNotificationRead,
  markAllCustomerNotificationsRead,
  deleteCustomerNotification
} = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

// All customer notification routes are protected
router.use(authenticate);

router.get('/', getCustomerNotifications);
router.patch('/read-all', markAllCustomerNotificationsRead);
router.patch('/:id/read', markCustomerNotificationRead);
router.delete('/:id', deleteCustomerNotification);

module.exports = router;
