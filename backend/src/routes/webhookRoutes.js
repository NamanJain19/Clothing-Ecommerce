const express = require('express');
const router = express.Router();
const { handleShippingWebhook } = require('../controllers/webhookController');

// Courier & Shiprocket shipping webhook routes (HMAC verified in controller)
router.post('/shipping', handleShippingWebhook);
router.post('/shiprocket', handleShippingWebhook);

module.exports = router;
