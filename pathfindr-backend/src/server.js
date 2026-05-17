require('dotenv').config();
const http = require('http');
const jwt = require('jsonwebtoken');
const app = require('./app');
const { Server } = require('socket.io');
const logger = require('./utils/logger');

// ── Validate critical env vars at startup ──
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
const missing = requiredEnvVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  logger.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// ── Socket.io with authentication ──
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Socket.io authentication middleware — verify JWT before allowing connection
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    logger.warn('Socket.io auth failed', { error: err.message });
    return next(new Error('Invalid or expired token'));
  }
});

const registerChatHandler = require('./socket/chatHandler');

io.on('connection', (socket) => {
  logger.info('Socket connected', { socketId: socket.id, userId: socket.userId });

  // Register chat handlers
  registerChatHandler(io, socket);

  socket.on('disconnect', (reason) => {
    logger.info('Socket disconnected', { socketId: socket.id, userId: socket.userId, reason });
  });

  socket.on('error', (err) => {
    logger.error('Socket error', { socketId: socket.id, error: err.message });
  });
});

// ── Start server ──
server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// ── Graceful Shutdown ──
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      // Close Socket.io connections
      io.close();
      logger.info('Socket.io connections closed');

      // Disconnect Prisma
      const prisma = require('./config/db');
      await prisma.$disconnect();
      logger.info('Database connection closed');
    } catch (err) {
      logger.error('Error during shutdown', { error: err.message });
    }

    process.exit(0);
  });

  // Force exit after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ── Unhandled Rejection / Exception Handlers ──
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', { reason: reason?.message || reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception — shutting down', { error: error.message, stack: error.stack });
  process.exit(1);
});

module.exports = server;
