const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const apiRoutes = require('./src/routes');
const notFoundHandler = require('./src/middleware/notFoundHandler');
const errorHandler = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3011;

// Connect to MongoDB
connectDB();

// Security HTTP headers
app.use(helmet());

// Allowed origins for CORS
const envAllowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [];

const allowedOrigins = [
  'http://localhost:3008',
  'http://localhost:3009',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  ...envAllowedOrigins
].filter(Boolean);

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// HTTP request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount all API routes under /api
app.use('/api', apiRoutes);

// Root route redirect/info
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Luxury Fashion E-Commerce Backend Service',
    healthCheck: '/api/health'
  });
});

// 404 Route Handler
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n[FATAL] Port ${PORT} is already in use.`);
    console.error(`Make sure no other instance of server.js is running.\n`);
    process.exit(1);
  } else {
    console.error(`Server error:`, error);
  }
});

// Graceful Shutdown on process termination & nodemon restart
const gracefulShutdown = (signal) => {
  console.log(`\n[${signal}] Gracefully closing HTTP server on port ${PORT}...`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed. Port released.');
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 0) {
        mongoose.connection.close(false).then(() => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        }).catch(() => process.exit(0));
      } else {
        process.exit(0);
      }
    });

    // Force close after 3 seconds if connections linger
    setTimeout(() => {
      console.error('Forcing shutdown after timeout.');
      process.exit(1);
    }, 3000).unref();
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.once('SIGUSR2', () => {
  if (server) {
    server.close(() => {
      process.kill(process.pid, 'SIGUSR2');
    });
  } else {
    process.kill(process.pid, 'SIGUSR2');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
