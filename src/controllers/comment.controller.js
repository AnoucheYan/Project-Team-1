const Tickets = require("../models/ticket");

async function commentTicket(req, res, next) {
  try {
    const { ticketId } = req.params;
    const { newComment } = req.body;
    const { userName } = req.user;

    const ticket = await Tickets.findOne({
      _id: ticketId,
    });

    const { comment } = ticket;

    comment.push({
      maker: userName,
      comment: newComment,
    });

    await Tickets.updateOne({ _id: ticketId }, { $set: { comment } });

    res.status(200).json({
      message: "Comment added successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getComments(req, res, next) {
  try {
    const { ticketId } = req.params;

    const ticket = await Tickets.findOne({
      _id: ticketId,
    });

    const { comment } = ticket;

    res.status(200).json({
      comment,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  commentTicket,
  getComments,
};
