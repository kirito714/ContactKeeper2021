const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// JWT three parts Header&tokenType/Payload/VerifySignature
const jwt = require("jsonwebtoken");
const config = require("config");
// middleWare Validator to check isEmail ect.
const { validationResult, check } = require("express-validator");

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructuring
    const { name, email, password } = req.body;
    try {
      // variable to find by email
      let user = await User.findOne({ email });
      // if to check if user exists
      if (user) {
        // if user exists then send status 400 and msg: User already exits
        return res.status(400).json({ msg: "User already exists" });
      }
      //creat new user
      user = new User({
        name,
        email,
        //plain text password. before bcrypt.hash
        password,
      });

      //variable salt that bcrypt.getSalt that returns a promise to encrypt a password. 10 is default
      const salt = bcrypt.genSaltSync(10);
      // user.password(plain text) and bcrypt.hash
      // hash takes in the password and salt to hash the password
      user.password = await bcrypt.hashSync(password, salt);

      // takes in promise await and saves user
      await user.save();
      // payload we want to send a obj of user.id in the token
      const payload = {
        user: {
          id: user.id,
        },
      };
      // sign w/payload, secrete from config/default.json
      jwt.sign(
        // payload
        payload,
        //get jwtSecrete
        config.get("jwtSecret"),
        // sets the time to expire
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
