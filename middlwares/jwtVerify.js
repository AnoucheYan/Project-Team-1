const jwt = require("jsonwebtoken");
const Users = require("../models/user");
require("dotenv").config();

async function verifyJwt(req, res, next) {
  const token = req.headers["x-access-token"];

  try {
    if (!token) {
      throw new Error("You must be logged in to access this resource");
    }

    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await Users.findOne({ email: decoded.email });

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = verifyJwt;
