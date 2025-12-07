/**
 * ServUp Backend Server
 * Main entry point for the Express.js API
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Validate environment variables before starting
const { validateEnv } = require('./config/envValidator');
validateEnv();

// Import routes (v1 API)
const v1Routes = require('./routes/v1');

// Import database
const { testConnection } = require('./models');

// Import utilities
const logger = require('./utils/logger');
const { securityHeaders, requestIdMiddleware } = require('./middleware/security');
const { apiLimiter } = require('./middleware/rateLimiter');
const { sanitizeRequestBody } = require('./utils/inputSanitizer');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware (must be first)
app.use(securityHeaders);
app.use(requestIdMiddleware);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : (process.env.NODE_ENV === 'production' 
      ? [] 
      : ['http://localhost:5173', 'http://localhost:5174']);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.length === 0) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Input sanitization (after body parsing)
app.use(sanitizeRequestBody);

// General rate limiting
app.use('/api', apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    requestId: req.id,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check endpoint (not versioned, before API routes)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'ServUp API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API Routes with versioning
// Default to v1 for backwards compatibility
app.use('/api', v1Routes);
app.use('/api/v1', v1Routes);

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Log error
  logger.error('Error occurred', {
    requestId: req.id,
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Don't leak error details in production
  const message = isDevelopment 
    ? err.message || 'Internal server error'
    : 'An internal error occurred. Please try again later.';
  
  res.status(err.status || 500).json({
    status: 'error',
    message,
    ...(isDevelopment && { 
      stack: err.stack,
      details: err.toString()
    }),
    ...(req.id && { requestId: req.id })
  });
});

// Start server
app.listen(PORT, async () => {
    logger.info('========================================');
    logger.info(`🚀 ServUp Backend Server`);
    logger.info(`📍 Running on: http://localhost:${PORT}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info('========================================');
    
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    logger.info('========================================');
    logger.info('✅ Server is ready to accept requests!');
    logger.info('========================================');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    process.exit(1);
});

module.exports = app;

