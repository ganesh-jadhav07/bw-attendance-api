const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { Op } = require("sequelize");
const { check, validationResult } = require("express-validator");

// Auth Middleware
const adminauth = require("../middleware/adminauth");

// Bring Model
const Admin = require("../models/Admin");

// @route /admin
// @desc    Add Admin
// @access  Public

router.post(
  "/addadmin",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter valid email").isEmail(),
    check("contact", "Please enter valid contact no").isLength({
      min: 10,
      max: 10,
    }),
    check("password", "Password is required").not().isEmpty(),
  ],
  adminauth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, contact, password } = req.body;

    try {
      // see if admin exists
      let admin = await Admin.findOne({
        where: {
          [Op.or]: {
            Email: email,
            Contact: contact,
          },
        },
      });

      if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Admin Already exists" }] });
      }

      admin = new Admin({
        Name: name,
        Email: email,
        Contact: contact,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      admin.Password = await bcrypt.hash(password, salt);
      await admin.save();

      res.send({ msg: "Admin Added Successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/adminauth
// @desc    Authenticate Admin & get token
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
      // See if admin exists
      let admin = await Admin.findOne({ where: { Email: email } });

      if (!admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, admin.Password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // return json webtoken
      const payload = {
        admin: {
          id: admin.id,
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
