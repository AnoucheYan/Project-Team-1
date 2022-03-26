const express = require('express');
const auth = require('../middlwares/jwtVerify');
const commentController=require('../controllers/comment.controller');
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


/**
 * @swagger
 * /tickets/{ticketId}/comment:
 *  put:
 *   tags: [Tickets]
 *   description: Comment ticket
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *       schema:
 *         type: string
 *       required: true
 *     - in: path
 *       name: ticketId
 *       schema:
 *         type: string
 *       required: true
 *       description: Ticket id what user wants to comment
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            newComment:
 *              type: string
 *   responses:
 *     200:
 *       description: Comment added successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     401:
 *       description: User not found or is not logged in
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 */

ticketRouter.put('/:ticketId/comment', auth, commentController.commentTicket);

/**
 * @swagger
 * /tickets/{ticketId}/comment:
 *  get:
 *   tags: [Tickets]
 *   description: Get comments of ticket
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *       schema:
 *         type: string
 *       required: true
 *     - in: path
 *       name: ticketId
 *       schema:
 *         type: string
 *       required: true
 *       description: Ticket id that comments user wants to get
 *   responses:
 *     200:
 *       description: Comment added successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                userName:
 *                  type: string
 *                comment:
 *                  type: string
 *     401:
 *       description: User not found or is not logged in
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 */

ticketRouter.get('/:ticketId/comment', auth, commentController.getComments);

module.exports = ticketRouter;
