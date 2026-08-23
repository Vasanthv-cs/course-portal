const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');
const QuizResult = require('../models/QuizResult');

// GET /api/progress
router.get('/', protect, async (req, res) => {
  try {
    const progresses = await Progress.find({ userId: req.user._id });
    res.json({ success: true, data: progresses });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/progress/:courseId
router.get('/:courseId', protect, async (req, res) => {
  try {
    const p = await Progress.findOne({ userId: req.user._id, courseId: req.params.courseId });
    res.json({ success: true, data: p || { completedLessons: [], htmlQuizPassed: false, htmlQuizBestScore: 0, lastLessonId: '' } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/progress/:courseId
router.post('/:courseId', protect, async (req, res) => {
  try {
    const { completedLessons, htmlQuizPassed, htmlQuizBestScore, lastLessonId } = req.body;
    const p = await Progress.findOneAndUpdate(
      { userId: req.user._id, courseId: req.params.courseId },
      { completedLessons: completedLessons || [], htmlQuizPassed: !!htmlQuizPassed, htmlQuizBestScore: htmlQuizBestScore || 0, lastLessonId: lastLessonId || '', lastUpdated: Date.now() },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: p });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/progress/quiz/result
router.post('/quiz/result', protect, async (req, res) => {
  try {
    const { courseId, quizType, score, maxScore, passed, totalQuestions, correctAnswers } = req.body;
    const result = await QuizResult.create({ userId: req.user._id, courseId, quizType, score, maxScore, passed, totalQuestions, correctAnswers });
    if (passed && quizType === 'html-final') {
      await Progress.findOneAndUpdate(
        { userId: req.user._id, courseId },
        { htmlQuizPassed: true, htmlQuizBestScore: score },
        { upsert: true, new: true }
      );
      // Add notification to User
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          notifications: {
            title: 'Quiz Passed! 🎯',
            message: `You passed the HTML Final Quiz with a score of ${score}/${maxScore}! CSS unlocked.`,
            type: 'quiz'
          }
        }
      });
    }
    res.status(201).json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/progress/quiz/history
router.get('/quiz/history', protect, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id }).sort({ attemptedAt: -1 }).limit(20);
    res.json({ success: true, data: results });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
