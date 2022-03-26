const Users = require("../models/user");
const Tickets = require("../models/ticket");
const Orders = require("../models/order");

async function createOrder(req, res, next) {
  try {
    const { ticketId } = req.params;

    const ticket = await Tickets.findOne(
      {
        _id: ticketId,
      },
      "price quantity countries owner"
    );

    const { price, quantity, countries, owner } = ticket;

    const seller = await Users.findOne(
      {
        _id: owner,
      },
      "coins"
    );

    const buyer = req.user;

    if (!countries.includes(buyer.country)) {
      res
        .status(400)
        .json({ error: "This ticket wasn't made for your country" });
      return;
    }

    if (quantity <= 0) {
      res.status(400).json({ error: "Tickets are sold out" });
      return;
    }

    if (buyer.coins < price) {
      res.status(400).json({
        error: "You don't have enough coins",
      });
      return;
    }

    await Users.updateOne(
      { _id: buyer._id },
      { $set: { coins: buyer.coins - price } }
    );

    await Users.updateOne(
      { _id: owner._id },
      { $set: { coins: seller.coins + price } }
    );

    await Tickets.updateOne(
      { _id: ticketId },
      { $set: { quantity: quantity - 1 } }
    );

    await Orders.create({
      buyer: buyer._id,
      ticket: ticketId,
    });

    res.status(200).json({
      message: "Order was created successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const buyer = req.user;

    const order = await Orders.findOne({
      _id: req.params.orderId,
    });

    if (order.buyer.valueOf() !== buyer._id.valueOf()) {
      res.status(400).json({
        error: "You can't cancel other user's order",
      });
      return;
    }

    if (order.canceled) {
      res.status(400).json({
        error: "Order was already canceled",
      });
      return;
    }

    const ticket = await Tickets.findOne({ _id: order.ticket });

    if (!ticket.canCancel) {
      res.status(400).json({
        error: "You can't cancel this order",
      });
      return;
    }

    if (ticket.cancelDate < Date.now()) {
      res.status(400).json({
        error: "You can't cancel this order because cancel date is expired",
      });
      return;
    }

    const seller = await Users.findOne({ _id: ticket.owner });

    await Users.updateOne(
      { _id: seller._id },
      { $set: { coins: seller.coins - ticket.price } }
    );

    await Users.updateOne(
      { _id: buyer._id },
      { $set: { coins: buyer.coins + ticket.price } }
    );

    await Tickets.updateOne(
      { _id: ticket._id },
      { $set: { quantity: ticket.quantity + 1 } }
    );

    await Orders.updateOne({ _id: order._id }, { $set: { canceled: true } });
    
    res.status(200).json({
      message: "Order was canceled successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await Orders.find(
      {
        buyer: req.user._id,
      },
      "ticket canceled"
    )
      .populate("ticket", "name description price date canCancel cancelDate")
      .skip((req.query.page - 1) * req.query.limit)
      .limit(req.query.limit);

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  createOrder,
  cancelOrder,
  getOrders,
};
