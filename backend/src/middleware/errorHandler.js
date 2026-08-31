/**
 * Global Centralized Error Handling Middleware
 * Catch-all for unhandled synchronous and asynchronous errors
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  
  const response = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  // Only include stack trace in non-production environments
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
