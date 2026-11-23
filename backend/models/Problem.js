
const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true
  },
  solved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);
