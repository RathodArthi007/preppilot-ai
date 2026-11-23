
const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");

router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find().sort({ _id: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const problem = await Problem.create({
      title: req.body.title || req.body.name,
      topic: req.body.topic,
      difficulty: req.body.difficulty,
      solved: req.body.solved || false
    });
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
