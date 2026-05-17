const prisma = require('../config/db');
const logger = require('../utils/logger');

module.exports = (io, socket) => {
  // Join a specific booking room
  socket.on('join_chat', async ({ bookingId }) => {
    if (!bookingId || typeof bookingId !== 'string') {
      socket.emit('error', { message: 'Invalid booking ID' });
      return;
    }

    try {
      // Verify the user is part of this booking
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          counselorProfile: { select: { userId: true } },
        },
      });

      if (!booking) {
        socket.emit('error', { message: 'Booking not found' });
        return;
      }

      const isStudent = booking.studentId === socket.userId;
      const isCounselor = booking.counselorProfile?.userId === socket.userId;

      if (!isStudent && !isCounselor) {
        socket.emit('error', { message: 'Not authorized to join this chat' });
        return;
      }

      socket.join(bookingId);
      logger.info('User joined chat room', { socketId: socket.id, userId: socket.userId, bookingId });
    } catch (error) {
      logger.error('Error joining chat', { error: error.message, socketId: socket.id });
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    const { bookingId, content } = data;

    if (!bookingId || !content || typeof content !== 'string') {
      socket.emit('error', { message: 'Invalid message data' });
      return;
    }

    // Enforce message length limit
    if (content.length > 5000) {
      socket.emit('error', { message: 'Message too long (max 5000 characters)' });
      return;
    }

    try {
      // Use the authenticated userId from socket, not from client payload
      const message = await prisma.message.create({
        data: {
          bookingId,
          senderId: socket.userId,
          content: content.trim(),
          isRead: false,
        },
      });

      // Broadcast to room
      io.to(bookingId).emit('new_message', message);
    } catch (error) {
      logger.error('Error saving message', { error: error.message, socketId: socket.id });
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing event
  socket.on('typing', ({ bookingId, userName }) => {
    if (bookingId) {
      socket.to(bookingId).emit('user_typing', { userName });
    }
  });

  // Handle seen event
  socket.on('message_seen', async ({ bookingId }) => {
    if (!bookingId) return;

    try {
      await prisma.message.updateMany({
        where: {
          bookingId,
          senderId: { not: socket.userId },
          isRead: false,
        },
        data: { isRead: true },
      });
      io.to(bookingId).emit('messages_marked_seen', { bookingId });
    } catch (error) {
      logger.error('Error marking messages as seen', { error: error.message, socketId: socket.id });
    }
  });

  socket.on('leave_chat', ({ bookingId }) => {
    if (bookingId) {
      socket.leave(bookingId);
      logger.info('User left chat room', { socketId: socket.id, userId: socket.userId, bookingId });
    }
  });
};
