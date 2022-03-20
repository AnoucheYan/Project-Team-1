const express = require('express');
const auth = require('../middlwares/jwtVerify');
const ticketRouter = express.Router();
const {create,deleteTicket, updateTicket, getTicket} = require('../controllers/ticket.controller');
  
/**
 * Аll routes start with '/ticket'
 **/

// create ticket
ticketRouter.post('/', auth, create);

//  get batch tickets
// ticketRouter.get('/', auth, ticketController.getBatch);

// get one ticket
ticketRouter.get('/:id', auth, getTicket);

// update ticket
ticketRouter.patch('/:id', auth, updateTicket);

// delete single ticket
ticketRouter.delete('/:id', auth, deleteTicket);



module.exports = ticketRouter;
