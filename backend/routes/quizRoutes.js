const express = require('express');
const router = express.Router();
const { getTopics, getQuestions } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.get('/topics', protect, getTopics);
router.get('/', protect, getQuestions);

module.exports = router;
