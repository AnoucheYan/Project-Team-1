const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Types.ObjectId,
    },
    ticket: {
      type: mongoose.Types.ObjectId,
      ref: "Ticket",
    },
    canceled: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "orders", timestamps: true }
);

const Orders = mongoose.model("Orders", OrderSchema);

module.exports = Orders;
