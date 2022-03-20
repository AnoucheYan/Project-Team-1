const errorConfig = require('../config/error.config');
const ticketSchema = require('../models/ticket');



const create = async (req, res, next) => {
    try {
        const ticket = req.body;
        ticket.owner = req.user._id;
        await ticketSchema.create(ticket);
        res.send("Ticket was created successfully!");
    } catch (err) {
        console.log(err);
        next(err);
    }
};

const deleteTicket = async (req, res, next) => {
    try {
        const ticket = await ticketSchema.findOne({
            _id: req.params.id,
        });
        if (req.user._id.valueOf() === ticket.owner.valueOf()) {

            await ticketSchema.deleteOne({ _id: req.params.id });

        }
        if (!ticket) throw errorConfig.ticketNotFound;
        res.send("Ticket was deleted!");
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

const getTicket = async (req, res, next) => {
    try {
        const ticket = await ticketSchema.findOne({
            _id: req.params.id
        },
            "_id name description date price quantity cancelDate countries canCancel"
        );
        res.status(200).json(ticket);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

const updateTicket = async (req, res, next) => {
    try {
        const ticket = await ticketSchema.findOne({
            _id: req.params.id,
        });
        if (!ticket) throw errorConfig.ticketNotFound;

        if (req.user._id.valueOf() === ticket.owner.valueOf()) {
            const { name, description, date, price, quantity, cancelDate, countries } = req.body;

            ticket.name = name;
            ticket.description = description;
            ticket.date = date;
            ticket.price = price;
            ticket.quantity = quantity;
            ticket.cancelDate = cancelDate;
            ticket.countries = countries

            await ticket.save();
        }
        res.send("Your ticket was successfully edited!");
    } catch (err) {
        console.log(err);
        next(err);
    }
}


module.exports = { create, deleteTicket, updateTicket, getTicket }