const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
