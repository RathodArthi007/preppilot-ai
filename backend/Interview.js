const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answeredQuestions: {
    type: Number,
    required: true
  },
  averageScore: {
    type: Number,
    required: true
  },
  questionHistory: [
    {
      question: String,
      score: Number
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Interview", interviewSchema);