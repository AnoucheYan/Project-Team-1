const bcrypt = require("bcrypt");
const sendEmail = require("../helpers/sendEmail");
const Users = require("../models/user");

async function getMe(req, res, next) {
  try {
    const user = await Users.findOne(
      {
        email: req.user.email,
      },
      "_id userName country coins email"
    );

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function updateMe(req, res, next) {
  try {
    const user = await Users.findOne({ email: req.user.email });

    Object.keys(req.body).forEach((key) => {
      if (key) {
        if (req.body.email !== user.email) {
          user.isVerified = false;
          user.isUpdatedEmail = true;
        }
        user[key] = req.body[key];
      }
    });

    user.save();

    if (user.isUpdatedEmail) {
      sendEmail(req.body.email);
      res.status(201).json({
        message: "Please check your Email for account confirmation",
      });
    } else {
      res.status(200).json({ message: "User updated successfully" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function updatePassword(req, res, next) {
  const { password, newPassword } = req.body;
  try {
    const user = await Users.findOne({ email: req.user.email });
    const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordMatch) {
      throw new Error("Password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Users.updateOne(
      { email: req.user.email },
      { $set: { hashedPassword } }
    );
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function deleteMe(req, res, next) {
  try {
    await Users.deleteOne({ email: req.user.email });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  getMe,
  updateMe,
  deleteMe,
  updatePassword,
};
