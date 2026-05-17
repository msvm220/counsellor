const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Authentication required' });
    }

    // Verify token — no fallback secret in production
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
    }
    if (!user.isActive) {
      return res.status(401).json({ status: 'fail', message: 'User account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ status: 'fail', message: 'Token expired, please login again' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
    logger.error('Auth middleware error', { error: error.message, requestId: req.requestId });
    res.status(401).json({ status: 'fail', message: 'Authentication failed' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized access attempt', {
        userId: req.user.id,
        role: req.user.role,
        requiredRoles: roles,
        url: req.originalUrl,
        requestId: req.requestId,
      });
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
