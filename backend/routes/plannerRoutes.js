
const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const Mistake = require("../models/Mistake");

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ _id: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/tasks", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/mistakes", async (req, res) => {
  try {
    const mistakes = await Mistake.find().sort({ _id: -1 });
    res.json(mistakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/mistakes", async (req, res) => {
  try {
    const mistake = await Mistake.create(req.body);
    res.status(201).json(mistake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/mistakes/:id", async (req, res) => {
  try {
    const mistake = await Mistake.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!mistake) return res.status(404).json({ message: "Mistake not found" });
    res.json(mistake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
