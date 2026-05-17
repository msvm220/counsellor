const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, submitAssessmentSchema } = require('../utils/validators');

// All assessment routes are for logged-in students
router.use(authenticate);
router.use(authorize('STUDENT'));

router.get('/questions', assessmentController.getQuestions);
router.post('/submit', validate(submitAssessmentSchema), assessmentController.submitAssessment);
router.get('/status', assessmentController.getAssessmentStatus);

module.exports = router;
