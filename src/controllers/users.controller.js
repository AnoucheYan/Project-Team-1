const bcrypt = require("bcrypt");
const sendEmail = require("../helpers/sendEmail");
const Users = require("../models/user");
const Tickets = require("../models/ticket");
const Orders = require("../models/order");

async function getMe(req, res, next) {
  try {
    const user = await Users.findOne(
      {
        _id: req.user._id,
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
    const user = await Users.findOne({ _id: req.user._id });
    const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordMatch) {
      res.status(401).json({
        error: "Password is incorrect!!!",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Users.updateOne({ _id: req.user._id }, { $set: { hashedPassword } });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getShoppingCard(req, res, next) {
  try {
    const user = await Users.findOne(
      {
        _id: req.user._id,
      },
      { _id: 0, shoppingCard: 1 }
    );

    res.status(200).send(user.shoppingCard);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function clearShoppingCard(req, res, next) {
  try {
    await Users.updateOne(
      { _id: req.user._id },
      { $set: { shoppingCard: [] } }
    );

    res.status(200).json({ message: "Shopping card cleared" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function addTicketToShoppingCard(req, res, next) {
  try {
    const { ticketId } = req.params;

    const ticket = await Tickets.findOne(
      {
        _id: ticketId,
      },
      "_id name quantity countries owner"
    );

    const { countries, name, quantity, owner } = ticket;

    if (owner.valueOf() === req.user._id.valueOf()) {
      res.status(400).json({
        error: "You can't buy your own ticket",
      });
      return;
    }

    const { shoppingCard, country } = req.user;

    let hasAlreadyAdded = false;

    shoppingCard.forEach((item) => {
      if (item.ticketId === ticketId) {
        hasAlreadyAdded = true;
      }
    });

    if (hasAlreadyAdded) {
      res.status(400).json({
        error: "You have already added this ticket in your shoppingCard",
      });
      return;
    }

    if (!countries.includes(country)) {
      res
        .status(400)
        .json({ error: "This ticket wasn't made for your country" });
      return;
    }

    if (quantity <= 0) {
      res.status(400).json({ error: "Tickets are sold out" });
      return;
    }

    shoppingCard.push({ ticketId, name });

    await Users.updateOne({ _id: req.user._id }, { $set: { shoppingCard } });

    await Tickets.updateOne(
      { _id: ticketId },
      { $set: { quantity: quantity - 1 } }
    );

    res.status(200).json({
      message: "Ticket added to shopping card successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function deleteOneFromShoppingCard(req, res, next) {
  try {
    const { ticketId } = req.params;

    const ticket = await Tickets.findOne(
      {
        _id: ticketId,
      },
      "_id name quantity countries, owner"
    );

    const { quantity } = ticket;

    const { shoppingCard } = req.user;

    let deleted = false;

    shoppingCard.forEach((item) => {
      if (item.ticketId === ticketId) {
        shoppingCard.splice(shoppingCard.indexOf(item), 1);
        deleted = true;
      }
    });

    if (deleted) {
      await Tickets.updateOne(
        { _id: ticketId },
        { $set: { quantity: quantity + 1 } }
      );

      await Users.updateOne({ _id: req.user._id }, { $set: { shoppingCard } });
    }

    res.status(200).json({ shoppingCard });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function buyAllShoppingCard(req, res, next) {
  try {
    let { coins } = req.user;
    const { shoppingCard } = req.user;

    let amount = 0;
    const ticketIds = [];
    const soldOuts = [];

    shoppingCard.forEach((ticket) => {
      ticketIds.push(ticket.ticketId);
    });

    const tickets = await Tickets.find({ _id: { $in: ticketIds } });

    tickets.forEach((ticket) => {
      amount += ticket.price;
      if (ticket.quantity <= 0) {
        soldOuts.push(ticket.name);
      }
    });

    if (coins < amount) {
      res.status(400).json({
        error:
          "You don't have enough coins to buy all tickets in your shoppingCard",
      });
      return;
    }

    if (soldOuts.length > 0) {
      res.status(400).json({
        error: `Tickets ${soldOuts.join(
          ", "
        )} are sold out, please remove them from your shoppingCard`,
      });
      return;
    }

    tickets.forEach(async (currentTicket) => {
      const currentSeller = await Users.findOne({
        _id: currentTicket.owner,
      });

      const sellerCoins = currentSeller.coins + currentTicket.price;

      coins -= currentTicket.price;

      await Users.updateOne({ _id: req.user._id }, { $set: { coins } });

      await Users.updateOne(
        { _id: currentTicket.owner },
        { $set: { coins: sellerCoins } }
      );

      await Orders.create({
        buyer: req.user._id,
        ticket: currentTicket._id,
      });
    });

    res.status(200).json({ message: "Tickets were bought successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  getMe,
  updateMe,
  updatePassword,
  getShoppingCard,
  clearShoppingCard,
  addTicketToShoppingCard,
  deleteOneFromShoppingCard,
  buyAllShoppingCard,
};
