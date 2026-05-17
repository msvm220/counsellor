const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.signup = async (req, res, next) => {
  try {
    // Body already validated by Zod middleware in routes
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(409).json({ status: 'fail', message: 'User already exists with this email' });
    }

    // Hash password with higher cost factor for production
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRole = role || 'STUDENT';

    // Create user and profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: userRole,
        },
      });

      // Create profile based on role
      if (userRole === 'STUDENT') {
        await tx.studentProfile.create({
          data: { userId: newUser.id },
        });
      } else if (userRole === 'COUNSELOR') {
        await tx.counselorProfile.create({
          data: { userId: newUser.id },
        });
      } else if (userRole === 'PARENT') {
        await tx.parentProfile.create({
          data: { userId: newUser.id, childIds: [] },
        });
      }

      return newUser;
    });

    const token = generateToken(user.id);

    logger.info('User registered', { userId: user.id, role: user.role, requestId: req.requestId });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Signup error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Registration failed. Please try again.' });
  }
};

exports.login = async (req, res, next) => {
  try {
    // Body already validated by Zod middleware in routes
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      // Intentionally vague error to prevent user enumeration
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ status: 'fail', message: 'Account is deactivated. Contact support.' });
    }

    const token = generateToken(user.id);

    logger.info('User logged in', { userId: user.id, requestId: req.requestId });

    res.status(200).json({
      status: 'success',
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Login error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Login failed. Please try again.' });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    // req.user is set in authenticate middleware
    let profileData = null;

    if (req.user.role === 'STUDENT') {
      profileData = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    } else if (req.user.role === 'COUNSELOR') {
      profileData = await prisma.counselorProfile.findUnique({ where: { userId: req.user.id } });
    } else if (req.user.role === 'PARENT') {
      profileData = await prisma.parentProfile.findUnique({ where: { userId: req.user.id } });
    }

    res.status(200).json({
      status: 'success',
      data: {
        ...req.user,
        profile: profileData,
      },
    });
  } catch (error) {
    logger.error('GetMe error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to fetch profile' });
  }
};
