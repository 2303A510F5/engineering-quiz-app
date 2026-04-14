const Result = require('../models/Result');

const submitResult = async (req, res) => {
  const { topic, difficulty, score, totalQuestions, correctCount, incorrectCount, answers } = req.body;
  const isPassed = (score / totalQuestions) >= 0.5; // pass threshold 50%

  try {
    const result = new Result({
      user: req.user._id,
      topic,
      difficulty,
      score,
      totalQuestions,
      correctCount,
      incorrectCount,
      isPassed,
      answers
    });

    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id }).sort({ createdAt: -1 });

    const summary = {
      totalQuizzes: results.length,
      passedQuizzes: results.filter(r => r.isPassed).length,
      failedQuizzes: results.filter(r => !r.isPassed).length,
      averageScore: results.length > 0
        ? results.reduce((acc, r) => acc + r.score, 0) / results.length
        : 0,
      recentScores: results.slice(0, 5).reverse().map(r => r.score),
      recentDates: results.slice(0, 5).reverse().map(r => r.createdAt),
      history: results
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { submitResult, getAnalytics };
