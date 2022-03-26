const express = require('express');
const auth = require('../middlwares/jwtVerify');
const commentController=require('../controllers/comment.controller');
const ticketRouter = express.Router();
const {create,deleteTicket, updateTicket, getTicket, getBatch, likeTicket} = require('../controllers/ticket.controller');
const {
  ticketCreteValidation,
  ticketUpdateValidation,
} = require('../middlwares/ticketValidation')
  

/**
 * @swagger
 * components:
 *   tags:
 *    - name: Tickets
 */

/**
 * @swagger
 * /tickets:
 *  post:
 *   tags: [Tickets]
 *   description: Creating new ticket
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            description:
 *              type: string
 *            price:
 *              type: number
 *            quantity:
 *              type: number
 *            likeCount:
 *              type: number
 *            countries:
 *              type: array
 *              items:
 *                type: string
 *            date:
 *              type: string
 *              example: "2022-03-26"
 *              format: date
 *            canCancel:
 *              type: boolean
 *            cancelDate:
 *              type: string
 *              example: "2022-03-26"
 *              format: date
 * 
 *   responses:
 *     201:
 *       description: Ticket was created successfully!
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     400:
 *       description: name, description, price, quantity,countries,date,canCancel and cancelDate are required
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string     
 *     422:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 */

// create ticket
ticketRouter.post('/', auth, ticketCreteValidation, create);

/**
 * @swagger
 * /tickets:
 *  get:
 *   tags: [Tickets]
 *   description: Get tickets
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *     - in: query
 *       name: skip
 *       schema:
 *         type: integer
 *       required: false
 *       description: Page number to show
 *     - in: query
 *       name: price
 *       schema:
 *         type: integer
 *       required: false
 *       description: Sort by price
 *     - in: query
 *       name: date
 *       schema:
 *         type: integer
 *       required: false
 *       description: Sort by date
 *     - in: query
 *       name: date_lte
 *       schema:
 *         type: string
 *         example: "2022-03-26"
 *         format: date
 *       required: false
 *       description: Filter by date
 *     - in: query
 *       name: date_gte
 *       schema:
 *         type: string
 *         example: "2022-03-26"
 *         format: date
 *       required: false
 *       description: Filter by date
 *     - in: query
 *       name: cancelDate_lte
 *       schema:
 *         type: string
 *         example: "2022-03-26"
 *         format: date
 *       required: false
 *       description: Filter by cancelDate
 *     - in: query
 *       name: cancelDate_gte
 *       schema:
 *         type: string
 *         example: "2022-03-26"
 *         format: date
 *       required: false
 *       description: Filter by cancelDate
 *   responses:
 * 
 *     200:
 *       description: Getting tickets successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                price:
 *                  type: number
 *                quantity:
 *                  type: number
 *                likeCount:
 *                  type: number
 *                countries:
 *                  type: array
 *                items:
 *                  type: string
 *                date:
 *                  type: string
 *                  example: "2022-03-26"
 *                  format: date
 *                canCancel:
 *                  type: boolean
 *                cancelDate:
 *                  type: string
 *                  example: "2022-03-26"
 *                  format: date
 *                like:
 *                  type: array
 *                  items:
 *                    type: string
 *                comment:
 *                  type: array
 *                  items:
 *                    type: string          
 *                
 *              
 *     401:
 *       description: Ticket not found 
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 */

//  get batch tickets
ticketRouter.get('/', auth, getBatch);

/**
 * @swagger
 * /tickets/{id}:
 *  get:
 *   tags: [Tickets]
 *   description: Get one ticket
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *     - in: path
 *       name: id
 *   responses:
 *     200:
 *       description: Getting ticket successfully!
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              price:
 *                type: number
 *              quantity:
 *                type: number
 *              likeCount:
 *                type: number
 *              countries:
 *                type: array
 *                items:
 *                  type: string
 *              date:
 *                type: string
 *                example: "2022-03-26"
 *                format: date
 *              canCancel:
 *                type: boolean
 *              cancelDate:
 *                type: string
 *                example: "2022-03-26"
 *                format: date
 *              like:
 *                type: array
 *                items:
 *                  type: string
 *              comment:
 *                type: array
 *                items:
 *                  type: string
 *              
 *     401:
 *       description: Ticket not found 
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 */

// get one ticket
ticketRouter.get('/:id', auth, getTicket);

/**
 * @swagger
 * /tickets/{id}:
 *  patch:
 *   tags: [Tickets]
 *   description: Updating ticket
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *     - in: path
 *       name: id
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            description:
 *              type: string
 *            price:
 *              type: number
 *            quantity:
 *              type: number
 *            likeCount:
 *              type: number
 *            countries:
 *              type: array
 *              items:
 *                type: string
 *            date:
 *              type: string
 *              example: "2022-03-26"
 *              format: date
 *            canCancel:
 *              type: boolean
 *            cancelDate:
 *              type: string
 *              example: "2022-03-26"
 *              format: date
 *            like:
 *              type: array
 *              items:
 *                type: string
 *            comment:
 *              type: array
 *              items:
 *                type: string
 * 
 * 
 *   responses:
 *     201:
 *       description: Your ticket was successfully edited!
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     400:
 *       description: name, description, price, quantity, likeCount, countries,date,canCancel and cancelDate are required
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string     
 *     422:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 */

// update ticket
ticketRouter.patch('/:id', auth, ticketUpdateValidation, updateTicket);

/**
 * @swagger
 * /tickets/{id}:
 *  delete:
 *   tags: [Tickets]
 *   description: Deleting ticket
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *     - in: path
 *       name: id
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *           _id:
 *             type: string
 * 
 *   responses:
 *     200:
 *       description: Ticket was deleted!
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     401:
 *       description: Ticket not found 
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 */

// delete single ticket
ticketRouter.delete('/:id', auth, deleteTicket);

/**
 * @swagger
 * /tickets/{id}/_like:
 *  post:
 *   tags: [Tickets]
 *   description: Like/dislike ticket
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *     - in: path
 *       name: id
 *   responses:
 *     200:
 *       description: You liked/disiked this ticket!!
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *              
 *     400:
 *       description: You can't like this ticket 
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *     
 *     401:
 *       description: Ticket not found 
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 */

// like ticket
ticketRouter.post('/:id/_like', auth, likeTicket);

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
