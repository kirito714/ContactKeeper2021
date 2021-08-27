const express = require("express");
const router = express.Router();
// middleWare Validator to check isEmail ect.
const { body, validationResult, check } = require("express-validator");

const User = require("../models/User");

//@route  Post api/users
//@desc   Register a user
//@access Public
router.post(
  "/",
  [
    // use Express Validator to check name
    check("name", "Please add name").not().isEmpty(),
    // check email
    check("email", "Please include a valid email").isEmail(),
    // check to make sure password is more then 6 characters long
    check(
      "password",
      "Please enter a email with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("passed");
  }
);

module.exports = router;
