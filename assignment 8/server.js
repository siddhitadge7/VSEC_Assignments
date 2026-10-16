
const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = 5000;

// Middleware to read JSON request bodies
app.use(express.json());

// Basic welcome route
app.get("/", (req, res) => {
  res.send("Student Management API is running!");
});

// Student API routes
app.use("/api/students", studentRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// Connect to MongoDB, then start server
async function startServer() {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/studentDB"
    );

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
