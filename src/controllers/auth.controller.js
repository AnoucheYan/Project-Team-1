const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../helpers/sendEmail");
require("dotenv").config();
const Users = require("../models/user");

async function register(req, res) {
  try {
    const { email, password, firstName, lastName, country } = req.body;

    if (!email || !password || !firstName || !lastName || !country) {
      res.status(400).json({
        error: "email, firstName, lastName, country and password are required",
      });
    }

    const existingUser = await Users.findOne({ email });

    const emailExists = existingUser !== null;

    if (emailExists) {
      res.status(409).json({
        error: "email already exists!!!",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.create({
      email,
      userName: `${firstName} ${lastName}`,
      hashedPassword,
      country,
    });

    sendEmail(email);

    res
      .status(201)
      .json({ message: "Please check your Email for account confirmation" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

async function confirm(req, res) {
  try {
    const { token } = req.params;

    const decodedToken = await jwt.verify(
      token,
      process.env.VERIFICATION_TOKEN_SECRET
    );

    const isVerified = await Users.findOne({ _id: decodedToken._id });

    if (!isVerified.toObject().isVerified) {
      if (isVerified.toObject().isUpdatedEmail) {
        await Users.updateOne(
          { _id: decodedToken._id },
          { $set: { isVerified: true, isUpdatedEmail: false } }
        );
      } else {
        await Users.updateOne(
          { _id: decodedToken._id },
          { $set: { isVerified: true, coins: 1000 } }
        );
      }

      res.status(200).json({
        message: "your account is verified successfully!! Please login",
      });
    } else {
      res.status(200).json({
        message: "your account is already verified!! Please login",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: "email and password are required",
      });
      return;
    }

    const user = await Users.findOne({ email });

    if (!user) {
      res.status(401).json({
        error: "email is incorrect!!!",
      });
      return;
    }

    if (!user.toObject().isVerified) {
      res.status(201).json({
        message: "Please first verify your account by email!!!",
      });
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      res.status(401).json({
        error: "password is incorrect!!!",
      });
      return;
    }

    const token = await jwt.sign(
      { _id: user._id.valueOf() },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(200).json({
      message: "login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "something went wrong!!!",
    });
  }
}

module.exports = {
  register,
  login,
  confirm,
};
