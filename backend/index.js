require("dotenv").config();
const { registerRouter, loginRouter } = require("./Routes/auth");
const {
  createTask,
  fetchTask,
  fetchTasks,
  updateTask,
  deleteTask,
  createTeamTask,
} = require("./Routes/tasks");
const {
  createTeam,
  fetchUserTeams,
  InviteUser,
  fetchTeamDetails,
  deleteTeam,
} = require("./Routes/teamRoutes");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const PORT = process.env.PORT || 5010;
const app = express();
const rareLimit = require("express-rate-limit");
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// Basic rate limit
const limiter = rareLimit.rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// MongoDB connextion
// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Task-Manager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// routes
app.use("/", registerRouter);
app.use("/", loginRouter);
app.use("/", createTask);
app.use("/", fetchTask);
app.use("/", fetchTasks);
app.use("/", updateTask);
app.use("/", deleteTask);
app.use("/", createTeamTask);
app.use("/", createTeam);
app.use("/", fetchTeamDetails);
app.use("/", fetchUserTeams);
app.use("/", InviteUser);
app.use("/", deleteTeam);

// Add this after all your routes:

//Start the express app
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
