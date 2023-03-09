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
const Session = require("../models/Session");

// @route /session/addsession
// @desc    Add Session
// @access  Protected

router.post(
  "/addsession",
  [
    check("title", "Title is required").not().isEmpty(),
    check("host", "Host is required").not().isEmpty(),
    // check("startTime", "Start Time is required").not().isEmpty(),
    // check("endTime", "End Time is required").not().isEmpty(),
  ],
  adminauth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, host, description, date, startTime, endTime } = req.body;

    try {
      let session = new Session({
        Title: title,
        Host: host,
        Description: description,
        Date: date,
        startTime: startTime,
        endTime: endTime,
      });

      await session.save();

      res.status(201).send({ msg: "Session Added Successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route /session/getsessionbycode/:sessionCode
// @desc    Get Session by Session Code
// @access  Public

router.get("/getsessionbycode/:sessionCode", async (req, res) => {
  try {
    let session = await Session.findOne({
      where: {
        SessionCode: req.params.sessionCode,
      },
    });

    if (!session) {
      return res.status(400).json({ errors: [{ msg: "Session not found!" }] });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route /session/getsessionbyid/:id
// @desc    Get Session by Id
// @access  Public

router.get("/getsessionbyid/:id", async (req, res) => {
  try {
    let session = await Session.findByPk({
      where: {
        id: req.params.id,
      },
    });

    if (!session) {
      return res.status(400).json({ errors: [{ msg: "Session not found!" }] });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route /session
// @desc    List All Sessions
// @access  Public

router.get("/", async (req, res) => {
  try {
    let sessions = await Session.findAll();

    if (!sessions) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No Session Available" }] });
    }
    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
