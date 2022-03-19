const express = require('express');
const auth = require('../middlwares/jwtVerify');
const ticketRouter = express.Router();
const ticketController = require('../controllers/ticket.controller');
  
/**
 * Аll routes start with '/ticket'
 **/

// create ticket
ticketRouter.ticket('/', auth, ticketController.create);

// get one ticket
ticketRouter.ticket('/:id', auth, ticketController.getSingle);

// get batch tickets
ticketRouter.ticket('/', auth, ticketController.getBatch);

// update ticket
ticketRouter.patch('/:id', auth, ticketController.update);

// delete batch tickets
ticketRouter.delete('/', auth, ticketController.deleteBatch);

// delete single ticket
ticketRouter.delete('/:id', auth, ticketController.delete);



module.exports = ticketRouter;
