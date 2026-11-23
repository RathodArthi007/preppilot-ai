const express = require("express");
const router = express.Router();

const Interview = require("../models/Interview");

router.get("/", async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ date: -1 });

    res.json({
      success: true,
      interviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const interview = new Interview({
      topic: req.body.topic,
      difficulty: req.body.difficulty,
      totalQuestions: req.body.totalQuestions,
      answeredQuestions: req.body.answeredQuestions,
      averageScore: req.body.averageScore,
      questionHistory: req.body.questionHistory
    });

    const savedInterview = await interview.save();

    res.status(201).json({
      success: true,
      message: "Interview saved successfully!",
      interview: savedInterview
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;