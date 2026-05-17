const prisma = require('../config/db');
const logger = require('../utils/logger');

exports.getAllCounselors = async (req, res) => {
  try {
    const counselors = await prisma.counselorProfile.findMany({
      where: { isApproved: true, isAvailable: true },
      include: {
        user: {
          select: { name: true, avatarUrl: true }
        }
      }
    });
    res.status(200).json({ status: 'success', data: counselors });
  } catch (error) {
    logger.error('Get all counselors error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to fetch counselors' });
  }
};

exports.getCounselorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: 'fail', message: 'Counselor ID is required' });
    }

    const counselor = await prisma.counselorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, avatarUrl: true }
        },
        reviews: true,
        availability: true
      }
    });

    if (!counselor) {
      return res.status(404).json({ status: 'fail', message: 'Counselor not found' });
    }

    res.status(200).json({ status: 'success', data: counselor });
  } catch (error) {
    logger.error('Get counselor by ID error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to fetch counselor' });
  }
};
