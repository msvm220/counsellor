const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, createBookingSchema, verifyPaymentSchema } = require('../utils/validators');

router.use(authenticate);

router.post('/create', authorize('STUDENT'), validate(createBookingSchema), bookingController.createBooking);
router.post('/verify', authorize('STUDENT'), validate(verifyPaymentSchema), bookingController.verifyPayment);
router.get('/my-bookings', bookingController.getMyBookings);
router.get('/:id', bookingController.getBookingById);

module.exports = router;
