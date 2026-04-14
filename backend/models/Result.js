const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  incorrectCount: { type: Number, required: true },
  isPassed: { type: Boolean, required: true },
  answers: [{
    questionText: String,
    chosenAnswer: String,
    correctAnswer: String,
    explanation: String,
    isCorrect: Boolean
  }]
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
