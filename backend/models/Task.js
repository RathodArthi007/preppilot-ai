
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: String, default: "" },
  priority: { type: String, default: "Medium" },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
