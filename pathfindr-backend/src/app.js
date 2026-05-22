const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const logger = require('./utils/logger');
const requestId = require('./middleware/requestId');

const app = express();

// ── Trust proxy (required behind reverse proxy / load balancer) ──
app.set('trust proxy', 1);

// ── Request ID ──
app.use(requestId);

// ── Security Middleware ──
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.daily.co", "wss:", "ws:"],
      frameSrc: ["'self'", "https://*.daily.co", "https://api.razorpay.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow Daily.co iframe embedding
}));
app.use(hpp());    // Prevent HTTP Parameter Pollution

// ── Compression ──
app.use(compression());

// ── CORS Configuration ──
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server) in dev
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
};
app.use(cors(corsOptions));

// ── Body Parsers ──
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ── HTTP Request Logging ──
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      requestId: req.requestId,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });
  next();
});

// ── Rate Limiting ──
// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests from this IP, please try again after 15 minutes' },
});
app.use('/api/', apiLimiter);

// Stricter rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Only 10 login/signup attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many authentication attempts, please try again later' },
});

// ── Routes ──
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const chatRoutes = require('./routes/chatRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/resources', resourceRoutes);

// ── Health Checks ──
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/readyz', async (req, res) => {
  try {
    const prisma = require('./config/db');
    await prisma.$queryRawUnsafe('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// ── 404 Handler ──
app.use((req, res, next) => {
  res.status(404).json({ status: 'error', message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  // Log the full error internally
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
  });

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  // In production, never leak stack traces or internal error details
  const response = {
    status,
    message: err.isOperational ? err.message : 'Internal Server Error',
    requestId: req.requestId,
  };

  // In development, include stack trace for debugging
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.message = err.message;
  }

  res.status(statusCode).json(response);
});

module.exports = app;
