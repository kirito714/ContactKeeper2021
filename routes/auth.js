const express = require("express");
const router = express.Router();

//@route  GET api/Auth
//@desc   Get Logged in USer
//@access Private
router.get("/", (req, res) => {
  res.send("Get logged in user");
});

//@route  POST api/Auth
//@desc   Auth user & get token
//@access public
router.post("/", (req, res) => {
  res.send("Log in User");
});

module.exports = router;
