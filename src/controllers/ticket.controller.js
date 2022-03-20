const errorConfig = require('../config/error.config');
const ObjectId = require('mongoose').Types.ObjectId;
const ticketSchema = require('../models/ticket');

class TicketController {

    create = async (req, res, next) => {
        try {
            const ticketData = {
                owner: ObjectId(res.locals.userId),
                ...req.body,
            }

            const ticket = await ticketSchema.create(ticketData);
            res.json(ticket);
        } catch (err) {
            next(err)
        }
    }

    getSingle = async (req, res, next) => {
        try {
            const ticket = await ticketSchema.findOne({
                _id: req.params.id,
                owner: res.locals.userId
            });
            if (!ticket) throw errorConfig.ticketNotFound;
            res.json(ticket.toObject());
        } catch (err) {
            next(err)
        }
    }

    update = async (req, res, next) => {
        try {
            const ticket = await ticketSchema.findOne({
                _id: req.params.id,
                owner: res.locals.userId
            });
            if (!ticket) throw errorConfig.ticketNotFound;

            const { name, description, date, price, quantity, status, cancelDate, countries } = req.body;
            name && (ticket.name = name);
            description && (ticket.description = description);
            date && (ticket.date = date);
            status && (ticket.status = status);
            price && (ticket.price = price);
            quantity && (ticket.quantity = quantity);
            cancelDate && (ticket.cancelDate = cancelDate);
            countries && (ticket.countries = countries)



            await ticket.save();
            res.json(ticket.toObject());
        } catch (err) {
            next(err)
        }
    }


    delete = async (req, res, next) => {
        try {
            const ticket = await ticketSchema.findOneAndDelete({
                _id: req.params.id,
                owner: res.locals.userId
            });

            if (!ticket) throw errorConfig.ticketNotFound;
            res.json({ success: true });
        } catch (err) {
            next(err)
        }
    }

    deleteBatch = async (req, res, next) => {
        try {
            const result = await ticketSchema.remove({
                _id: {
                    $in: (req.body.tickets).map(ObjectId)
                }
            });
            if (result.deletedCount === 0) throw errorConfig.nothingToRemove;
            res.json({ success: true });
        } catch (err) {
            next(err);
        }
    }

    getBatch = async (req, res, next) => {
        try {
            const { userId } = res.locals,
                { query } = req;

            const dbQuery = {
                owner: userId
            };

            const { status } = query;
            if (status && /^active$|^cancel$/ig.test(status)) {
                dbQuery.status = status;
            }
            
            const sort = {};
            if (query.sort) {
                switch (query.sort) {
                     case 'like_count_the_most':
                        sort.count = 1;
                        break;
                    case 'like_count_at_least':
                        sort.count = -1;
                        break;
                    case 'creation_date_oldest':
                        sort.created_at = 1;
                        break;
                    case 'creation_date_newest':
                        sort.created_at = -1;
                        break;
                    case 'price_lowest':
                        sort.price = 1;
                        break;
                    case 'price_highest':
                        sort.price = -1;
                }
            }

            const tickets = await ticketSchema.find(dbQuery).sort(sort).exec();
            if (!tickets) throw errorConfig.ticketNotFound;

            res.json(tickets);
        }
        catch (err) {
            next(err)
        }
    }

}

module.exports = new TicketController();
