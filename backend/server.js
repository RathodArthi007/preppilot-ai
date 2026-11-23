require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const problemRoutes = require("./routes/problemRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/problems", problemRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/interviews", interviewRoutes);

app.get("/", (req, res) => {
  res.send("PrepPilot AI Backend is running!");
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "PrepPilot AI API is working!",
    database: mongoose.connection.readyState === 1
      ? "Connected"
      : "Disconnected"
  });
});

app.get("/api/planner/test", (req, res) => {
  res.json({
    success: true,
    message: "Planner routes are working!"
  });
});

const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.log("MongoDB Connection Error:", error.message);
  });