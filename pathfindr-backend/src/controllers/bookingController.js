const prisma = require('../config/db');
const crypto = require('crypto');
const axios = require('axios');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

// NOTE: Razorpay is intentionally disabled for the free-tier launch.
// To enable payments, add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env
// and re-enable the Razorpay initialization and verifyPayment flow.

exports.createBooking = async (req, res) => {
  try {
    // Body validated by Zod middleware in routes
    const { counselorProfileId, scheduledAt, sessionType, amountInr } = req.body;

    // Validate counselor exists
    const counselor = await prisma.counselorProfile.findUnique({
      where: { id: counselorProfileId },
    });
    if (!counselor) {
      return res.status(404).json({ status: 'fail', message: 'Counselor not found' });
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
    });
    if (!studentProfile) {
      return res.status(404).json({ status: 'fail', message: 'Student profile not found' });
    }

    // Validate scheduled time is in the future
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({ status: 'fail', message: 'Scheduled time must be in the future' });
    }

    // 1. Create the booking in DB (Status: CONFIRMED instantly for free tier)
    const booking = await prisma.booking.create({
      data: {
        studentId: req.user.id,
        studentProfileId: studentProfile.id,
        counselorProfileId,
        scheduledAt: scheduledDate,
        sessionType: sessionType || 'STUDENT_SESSION',
        amountInr: 0,
        status: 'CONFIRMED',
      },
    });

    // 2. Create Daily.co Room Instantly
    let videoUrl = null;
    if (process.env.DAILY_API_KEY) {
      try {
        const roomName = `session-${booking.id.slice(-8)}-${Date.now()}`;
        const dailyRes = await axios.post(
          'https://api.daily.co/v1/rooms',
          {
            name: roomName,
            privacy: 'public',
            properties: {
              enable_chat: true,
              enable_knocking: false,
              exp: Math.floor(new Date(booking.scheduledAt).getTime() / 1000) + 3600 * 2,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );

        if (dailyRes.data && dailyRes.data.url) {
          videoUrl = dailyRes.data.url;
          
          // Update booking with the Daily URL
          await prisma.booking.update({
            where: { id: booking.id },
            data: { videoRoomUrl: videoUrl }
          });
        }
      } catch (dailyError) {
        logger.error('Daily.co room creation failed', {
          error: dailyError.response?.data || dailyError.message,
          bookingId: booking.id,
          requestId: req.requestId,
        });
      }
    }

    logger.info('Free Booking created and confirmed', { bookingId: booking.id, requestId: req.requestId });

    res.status(201).json({
      status: 'success',
      data: {
        booking: { ...booking, videoRoomUrl: videoUrl },
      },
    });
  } catch (error) {
    logger.error('Create booking error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to create booking' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    // Body validated by Zod middleware in routes
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ status: 'fail', message: 'Booking not found' });
    }

    if (booking.studentId !== req.user.id) {
      return res.status(403).json({ status: 'fail', message: 'Not authorized to verify this booking' });
    }

    if (booking.status === 'CONFIRMED') {
      return res.status(400).json({ status: 'fail', message: 'Booking is already confirmed' });
    }

    // ── Real Razorpay Signature Verification ──
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isVerified = expectedSignature === razorpay_signature;

    if (!isVerified) {
      logger.warn('Payment signature verification failed', {
        bookingId,
        orderId: razorpay_order_id,
        requestId: req.requestId,
      });

      // Update payment status to FAILED
      await prisma.payment.update({
        where: { bookingId },
        data: { status: 'FAILED' },
      });

      return res.status(400).json({ status: 'fail', message: 'Payment verification failed. Signature mismatch.' });
    }

    // Signature verified — update Payment
    await prisma.payment.update({
      where: { bookingId },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'PAID',
      },
    });

    // Create Daily.co Room
    let videoUrl = null;

    if (process.env.DAILY_API_KEY) {
      try {
        const roomName = `session-${bookingId.slice(-8)}-${Date.now()}`;
        const dailyRes = await axios.post(
          'https://api.daily.co/v1/rooms',
          {
            name: roomName,
            privacy: 'public',
            properties: {
              enable_chat: true,
              enable_knocking: false,
              exp: Math.floor(new Date(booking.scheduledAt).getTime() / 1000) + 3600 * 2,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10s timeout
          }
        );

        if (dailyRes.data && dailyRes.data.url) {
          videoUrl = dailyRes.data.url;
        }
      } catch (dailyError) {
        logger.error('Daily.co room creation failed', {
          error: dailyError.response?.data || dailyError.message,
          bookingId,
          requestId: req.requestId,
        });
        // Non-fatal — booking still proceeds, video URL can be set later
      }
    }

    // Update Booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        videoRoomUrl: videoUrl,
      },
    });

    logger.info('Payment verified and booking confirmed', {
      bookingId,
      paymentId: razorpay_payment_id,
      requestId: req.requestId,
    });

    res.status(200).json({
      status: 'success',
      message: 'Payment verified and booking confirmed',
      data: updatedBooking,
    });
  } catch (error) {
    logger.error('Payment verification error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Payment verification failed' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { studentId: req.user.id },
      include: {
        counselorProfile: {
          include: {
            user: {
              select: { name: true, avatarUrl: true },
            },
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: bookings });
  } catch (error) {
    logger.error('Get bookings error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to fetch bookings' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        counselorProfile: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ status: 'fail', message: 'Booking not found' });
    }

    // Only the student or counselor of this booking can view it
    const counselorProfile = await prisma.counselorProfile.findUnique({
      where: { id: booking.counselorProfileId },
      select: { userId: true },
    });
    const counselorUserId = counselorProfile?.userId;

    if (booking.studentId !== req.user.id && counselorUserId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'fail', message: 'Not authorized' });
    }

    res.status(200).json({ status: 'success', data: booking });
  } catch (error) {
    logger.error('Get booking by ID error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to fetch booking' });
  }
};
