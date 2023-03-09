const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { Op, QueryTypes } = require("sequelize");
const { check, validationResult } = require("express-validator");

// Auth middleware
const studentauth = require("../middleware/studentauth");
const adminauth = require("../middleware/adminauth");

// Bring Model
const Attendance = require("../models/Attendance");
const sequelize = require("../config/db");

// @route /addsession
// @desc    Add Session
// @access  Public

router.post("/addattendance/:sessionid", studentauth, async (req, res) => {
  try {
    let attendance = await Attendance.findOne({
      where: {
        [Op.and]: {
          sessionId: req.params.sessionid,
          studentId: req.student.id,
        },
      },
    });

    if (attendance) {
      return res.status(401).json({ msg: "Attendance Already Marked...!" });
    }

    attendance = new Attendance({
      sessionId: req.params.sessionid,
      studentId: req.student.id,
    });

    await attendance.save();
    res.send({ msg: "Attendance marked" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/attendancebysession/:id", adminauth, async (req, res) => {
  try {
    let attendance = await sequelize.query(
      "SELECT student.name, student.email, student.department,student.contact, team.name FROM student, attendance, team where student.id  = attendance.studentId  and team.id = student.teamId and attendance.sessionId = ?",
      {
        replacements: [req.params.id],
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
