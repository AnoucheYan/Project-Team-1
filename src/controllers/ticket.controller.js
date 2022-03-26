const errorConfig = require('../config/error.config');
const ticketSchema = require('../models/ticket');



const create = async (req, res, next) => {
    try {
        const ticket = req.body;
        ticket.owner = req.user._id;
        await ticketSchema.create(ticket);
        res.status(201).send("Ticket was created successfully!");
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
        res.status(200).send("Ticket was deleted!");
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
            "_id name description date price quantity cancelDate countries canCancel like comment likeCount"
        );
        if (!ticket) throw errorConfig.ticketNotFound;
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
        res.status(200).send("Your ticket was successfully edited!");
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

const getBatch = async (req, res, next) => {
    try {
        const { country } = req.user;
        const { query } = req;
        const { skip } = query;

        const availableTickets = { countries: { $all: [country] }} ;

console.log(availableTickets);
        if (query.date_lte || query.date_gte) {
            const dateQuery = {};
            query.date_lte && (dateQuery.$lte = new Date(query.date_lte));
            query.date_gte && (dateQuery.$gte = new Date(query.date_gte));
            availableTickets.date = dateQuery;
        }

        if (query.cancelDate_lte || query.cancelDate_gte) {
            const cancelDateQuery = {};
            query.cancelDate_lte && (cancelDateQuery.$lte = new Date(query.cancelDate_lte));
            query.cancelDate_gte && (cancelDateQuery.$gte = new Date(query.cancelDate_gte));
            availableTickets.cancelDate = cancelDateQuery;
        }

        const sort = {  };

        if (query.sort) {
            switch (query.sort) {
                case 'like_count_at_least':
                    sort.likeCount = 1;
                    break;
                case 'like_count_the_most':
                    sort.likeCount = -1;
                    break;
                case 'date_earlier':
                    sort.date = 1;
                    break;
                case 'date_later':
                    sort.date = -1;
                    break;
                case 'price_lowest':
                    sort.price = 1;
                    break;
                case 'price_highest':
                    sort.price = -1;
                    break;
                default:
                    sort.price = 1;
            }
        }

        const tickets = await ticketSchema.find(availableTickets, "_id name description date price quantity cancelDate countries canCancel like comment likeCount").limit(20).skip(skip).sort(sort);
        if (!tickets) throw errorConfig.ticketNotFound;
        res.status(200).send(tickets);
    }
    catch (err) {
        console.log(err);
        next(err)
    }
}

const likeTicket = async (req, res, next) => {
    try {

        const ticket = await ticketSchema.findOne({
            _id: req.params.id
        });

        if (!ticket) throw errorConfig.ticketNotFound;
        const { user } = req;

        const { owner } = ticket;
        if (user._id.valueOf() === owner.valueOf()) {
            res.status(400).send("You can't like/dislike your own ticket");
            return;
        }

        if (ticket.like.includes(user._id)) {
            ticket.like = ticket.like.filter((item) => item.valueOf() !== user._id.valueOf());
            ticket.likeCount = ticket.likeCount - 1;
        }
        else {
            ticket.like.push(user._id);
            ticket.likeCount = ticket.likeCount + 1;
        }

        await ticket.save();
        res.status(200).send("You liked/disliked this ticket!");
    }

    catch (err) {
        console.log(err);
        next(err)
    }
}

module.exports = { create, deleteTicket, updateTicket, getTicket, getBatch, likeTicket }