const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { Op } = require("sequelize");
const { check, validationResult } = require("express-validator");

// Bring Model
const Student = require("../models/Student");
const adminauth = require("../middleware/adminauth");

// @route POST /student/addstudent
// @desc    Add Student
// @access  Protected

router.post(
  "/addstudent",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter valid email").isEmail(),
    check("contact", "Please enter valid contact no").isLength({
      min: 10,
      max: 10,
    }),
    check("department", "Department is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ],
  adminauth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, contact, department, password } = req.body;

    try {
      // see if student exists
      let student = await Student.findOne({
        where: {
          [Op.or]: {
            Email: email,
            Contact: contact,
          },
        },
      });

      if (student) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Student Already exists" }] });
      }

      student = new Student({
        Name: name,
        Email: email,
        Contact: contact,
        Department: department,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      student.Password = await bcrypt.hash(password, salt);
      await student.save();

      res.send({ msg: "Student Added Successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route POST /student/login
// @desc    Authenticate Student & get token
// @access  Public

router.post(
  "/login",
  [
    check("email", "Please include valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if student exists
      let student = await Student.findOne({ where: { Email: email } });

      if (!student) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, student.Password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // return json webtoken
      const payload = {
        student: {
          id: student.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ payload, token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
