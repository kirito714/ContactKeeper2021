const express = require("express");
const router = express.Router();
// where not hashing the password here were using it to compare/validate
// the plain text pass
const bcrypt = require("bcryptjs");
// JWT three parts Header&tokenType/Payload/VerifySignature
const jwt = require("jsonwebtoken");
// for the secret
const config = require("config");
// brings in the middleware auth
const auth = require("../middleware/auth");
// middleWare Validator to check isEmail ect.
const { validationResult, check } = require("express-validator");

const User = require("../models/User");

//@route  GET api/Auth
//@desc   Get Logged in USer
//@access Private
router.get("/", auth, async (req, res) => {
  try {
    // variable that returns a promise to find the user by the ID
    // Id is found by the req token object "req.user.id"
    // .select to minus the password even tho its encrypted we dont want to return that.
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  POST api/Auth
//@desc   Auth user & get token
//@access public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // take out the email and password from req.body
    const { email, password } = req.body;
    try {
      // findOne returns a promise to find user
      let user = await User.findOne({ email });
      // if no user return status 400 and msg saying invalid credentials
      if (!user) {
        return res.status(400).json({ msg: "invalid Credentials" });
      }
      // variable isMatch to use bcrypt.compare to compare the plain text pass to the hash pass
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "invalid Credentials" });
      }
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
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
