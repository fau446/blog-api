require("dotenv").config();
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.create_user = [
  body("username", "Your username cannot be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Your password cannot be empty!")
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      admin: false,
    });

    await user.save();
    res.status(200).json({
      message: "Created user",
    });
  }),
];

// login
exports.login = [
  passport.authenticate("local", {
    session: false,
    failureRedirect: "/login-failure",
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // if login successful, generate jwt.
    jwt.sign({}, process.env.SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
      res.status(200).json({
        token,
      });
    });
  }),
];

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      message: "Log out Successful!",
    });
  });
};
