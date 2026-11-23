
const mongoose = require("mongoose");

const mistakeSchema = new mongoose.Schema({
  problem: { type: String, required: true },
  type: { type: String, required: true },
  wrong: { type: String, required: true },
  correct: { type: String, required: true },
  revised: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Mistake", mistakeSchema);
