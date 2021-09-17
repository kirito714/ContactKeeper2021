const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get the token form the Header
  const token = req.header("x-auth-token");
  // check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // variable to verify the token and get the jwt Secret
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // pull out decoded.user and set it to a variable req.user
    // so we have access to this inside the route.
    req.user = decoded.user;
    // call next()
    next();
  } catch (err) {
    res.status(401).json({ msg: "token is not valid" });
  }
};
