
const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/Student");

const router = express.Router();

// CREATE: Add a new student
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();

    res.status(201).json({
      message: "Student created successfully",
      student: savedStudent
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: "Error creating student"
    });
  }
});

// READ: Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching students"
    });
  }
});

// READ: Get one student by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching student"
    });
  }
});

// UPDATE: Update student by ID
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    res.status(400).json({
      message: error.message
    });
  }
});

// DELETE: Delete student by ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const student = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      student
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting student"
    });
  }
});

module.exports = router;
