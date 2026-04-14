const express = require('express');
const router = express.Router();
const { submitResult, getAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.post('/result', protect, submitResult);
router.get('/', protect, getAnalytics);

module.exports = router;
