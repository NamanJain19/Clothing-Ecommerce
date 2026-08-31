const mongoose = require('mongoose');

/**
 * Health check controller
 * @route GET /api/health
 */
const getHealthStatus = (req, res) => {
  const port = parseInt(process.env.PORT || 3011, 10);
  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'API is running',
    database: isDbConnected ? 'connected' : 'disconnected',
    port: port
  });
};

module.exports = {
  getHealthStatus
};
