const { Router } = require("express");
const verifyJwt = require("../middlwares/jwtVerify");
const ordersController = require("../controllers/orders.controller");

const router = Router();

/**
 * @swagger
 * components:
 *   tags:
 *    - name: Orders
 */

/**
 * @swagger
 * /orders/{ticketId}:
 *  post:
 *   tags: [Orders]
 *   description: Buy ticket
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
 *       description: Ticket id what user wants to buy
 *   responses:
 *     200:
 *       description: Ticket was bought successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     400:
 *       description: User can't buy his own tickets, tickets are sold out, ticket is not available in user's country or user doesn't have enough coins
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
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

router.post("/:ticketId", verifyJwt, ordersController.createOrder);

/**
 * @swagger
 * /orders/{orderId}:
 *  patch:
 *   tags: [Orders]
 *   description: Cancel order
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *       schema:
 *         type: string
 *       required: true
 *     - in: path
 *       name: orderId
 *       schema:
 *         type: string
 *       required: true
 *       description: Order id what user wants to cancel
 *   responses:
 *     200:
 *       description: Order was canceled successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     400:
 *       description: User can't cancel other user's order, order was already canceled, order is not cancelable, or cancel date is expired
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
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

router.patch("/:orderId", verifyJwt, ordersController.cancelOrder);

/**
 * @swagger
 * /orders:
 *  get:
 *   tags: [Orders]
 *   description: Get current user's orders
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *       schema:
 *         type: string
 *       required: true
 *     - in: query
 *       name: limit
 *       schema:
 *         type: integer
 *       required: false
 *       description: Orders count in one page
 *     - in: query
 *       name: page
 *       schema:
 *         type: integer
 *       required: false
 *       description: Page number to show
 *   responses:
 *     200:
 *       description: Got current user's order successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                ticket:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                    description:
 *                      type: string
 *                    price:
 *                      type: number
 *                    date:
 *                      type: string
 *                    canCancel:
 *                      type: boolean
 *                    cancelDate:
 *                      type: string
 *                canceled:
 *                  type: boolean
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

router.get("/", verifyJwt, ordersController.getOrders);

module.exports = router;
