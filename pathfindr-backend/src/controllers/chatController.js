const prisma = require('../config/db');
const logger = require('../utils/logger');

exports.getMessageHistory = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ status: 'fail', message: 'Booking ID is required' });
    }

    // Check if user is part of this booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return res.status(404).json({ status: 'fail', message: 'Booking not found' });
    }

    // Strict authorization check
    const isStudent = booking.studentId === req.user.id;

    const counselorProfile = await prisma.counselorProfile.findUnique({
      where: { id: booking.counselorProfileId },
      select: { userId: true }
    });

    const isCounselor = counselorProfile?.userId === req.user.id;

    if (!isStudent && !isCounselor && req.user.role !== 'ADMIN') {
      logger.warn('Unauthorized chat access attempt', {
        userId: req.user.id,
        bookingId,
        requestId: req.requestId,
      });
      return res.status(403).json({ status: 'fail', message: 'Not authorized to view this chat' });
    }

    const messages = await prisma.message.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { name: true, avatarUrl: true }
        }
      }
    });

    res.status(200).json({ status: 'success', data: messages });
  } catch (error) {
    logger.error('Get message history error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to fetch messages' });
  }
};
