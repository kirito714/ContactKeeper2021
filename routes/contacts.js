const express = require("express");
const router = express.Router();

//@route  Get api/users
//@desc   Get all user contacts/ that associate/w each user
//@access private
router.get("/", (req, res) => {
  res.send("Get All contacts");
});
//@route  Post api/users
//@desc   Add new contact
//@access private
router.post("/", (req, res) => {
  res.send("Add contact");
});
//@route  Put api/contacts/:id
//@desc   Update contact
//@access private
router.put("/:id", (req, res) => {
  res.send("Update contact");
});
//@route  Delete api/contacts/:id
//@desc   Delete contact
//@access private
router.delete("/:id", (req, res) => {
  res.send("Delete contact");
});

module.exports = router;
