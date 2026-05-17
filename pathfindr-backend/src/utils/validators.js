const { z } = require('zod');

// Auth validators
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['STUDENT', 'COUNSELOR', 'PARENT']).optional().default('STUDENT'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Booking validators
const createBookingSchema = z.object({
  counselorProfileId: z.string().min(1, 'Counselor profile ID is required'),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  sessionType: z.enum(['STUDENT_SESSION', 'PARENT_SESSION', 'BUNDLE_SESSION']).optional().default('STUDENT_SESSION'),
  amountInr: z.number().min(0, 'Amount must be zero or positive').int('Amount must be an integer'),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
  razorpay_signature: z.string().min(1, 'Razorpay signature is required'),
  bookingId: z.string().min(1, 'Booking ID is required'),
});

// Assessment validators
const submitAssessmentSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      value: z.union([z.string(), z.number()]),
    })
  ).min(1, 'At least one answer is required'),
});

// Chat validators
const sendMessageSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  content: z.string().min(1, 'Message content is required').max(5000, 'Message too long'),
});

/**
 * Express middleware factory for Zod validation.
 * Validates req.body against the provided schema.
 */
const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    req.body = validated; // Replace body with parsed/coerced values
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};

module.exports = {
  signupSchema,
  loginSchema,
  createBookingSchema,
  verifyPaymentSchema,
  submitAssessmentSchema,
  sendMessageSchema,
  validate,
};
