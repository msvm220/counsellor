const prisma = require('../config/db');
const logger = require('../utils/logger');

exports.getQuestions = async (req, res) => {
  try {
    const questions = await prisma.assessmentQuestion.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' }
    });
    res.status(200).json({ status: 'success', data: questions });
  } catch (error) {
    logger.error('Get questions error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to fetch questions' });
  }
};

exports.submitAssessment = async (req, res) => {
  try {
    // Body validated by Zod middleware in routes
    const { answers } = req.body;
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!studentProfile) {
      return res.status(404).json({ status: 'fail', message: 'Student profile not found' });
    }

    // Calculate Clarity Score
    let totalScore = 0;
    const maxPossible = answers.length * 5;

    answers.forEach(a => {
      totalScore += parseInt(a.value);
    });

    const clarityScore = Math.round((totalScore / maxPossible) * 100);

    // Use transaction to save result and answers
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create AssessmentResult
      const assessmentResult = await tx.assessmentResult.create({
        data: {
          studentProfileId: studentProfile.id,
          clarityScore: clarityScore,
          isComplete: true,
          rawScores: { total: totalScore, max: maxPossible },
          personalityType: 'GENERALIST',
          strengthTags: ['Analytical', 'Goal-Oriented'],
        }
      });

      // 2. Create AssessmentAnswer entries
      const answerData = answers.map(a => ({
        assessmentResultId: assessmentResult.id,
        questionId: a.questionId,
        answerValue: String(a.value),
      }));

      await tx.assessmentAnswer.createMany({
        data: answerData
      });

      // 3. Update StudentProfile clarityScore
      await tx.studentProfile.update({
        where: { id: studentProfile.id },
        data: { clarityScore: clarityScore }
      });

      return assessmentResult;
    });

    logger.info('Assessment submitted', {
      userId: req.user.id,
      clarityScore,
      resultId: result.id,
      requestId: req.requestId,
    });

    res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('Submit assessment error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to submit assessment' });
  }
};

exports.getAssessmentStatus = async (req, res) => {
  try {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        assessmentResults: {
          where: { isComplete: true },
          orderBy: { completedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!studentProfile) {
      return res.status(404).json({ status: 'fail', message: 'Student profile not found' });
    }

    const hasTaken = studentProfile.assessmentResults.length > 0;
    const latestResult = hasTaken ? studentProfile.assessmentResults[0] : null;

    res.status(200).json({
      status: 'success',
      data: {
        hasTaken,
        latestResult
      }
    });
  } catch (error) {
    logger.error('Get assessment status error', { error: error.message, requestId: req.requestId });
    res.status(500).json({ status: 'error', message: 'Failed to fetch assessment status' });
  }
};
