const Question = require('../models/Question');

const getTopics = async (req, res) => {
  try {
    const topics = await Question.distinct('topic');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getQuestions = async (req, res) => {
  const { topic, difficulty } = req.query;

  try {
    console.log(`Fetching questions for topic: ${topic}, difficulty: ${difficulty}`);
    const questions = await Question.find({ topic, difficulty });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found' });
    }

    // Shuffle questions array
    const shuffledQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Also shuffle options for each question
    const formattedQuestions = shuffledQuestions.map(q => {
      const options = [...q.options];
      const correctIdx = options.indexOf(q.correctAnswer);
      
      // Shuffle options randomly
      const shuffledOptions = options.map((value) => ({ value, sort: Math.random() }))
                                    .sort((a, b) => a.sort - b.sort)
                                    .map(({ value }) => value);
      
      return {
        _id: q._id,
        text: q.text,
        options: shuffledOptions,
        difficulty: q.difficulty,
        topic: q.topic,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      };
    });

    res.json(formattedQuestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTopics, getQuestions };
