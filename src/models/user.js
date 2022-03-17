const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    coins: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isUpdatedEmail: {
      type: Boolean,
      default: false,
    },
    shoppingCart: {
      type: Array,
    },
    orders: {
      type: Array,
    },
  },
  { collection: "users", timestamps: true }
);

UserSchema.index({ email: 1 });

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
