const { Router } = require("express");
const verifyJwt = require("../middlwares/jwtVerify");
const usersController = require("../controllers/users.controller");
const userValidation = require("../middlwares/userValidation");

const router = Router();

/**
 * @swagger
 * components:
 *   tags:
 *    - name: Users
 */

/**
 * @swagger
 * /users/me:
 *  get:
 *   tags: [Users]
 *   description: Get user
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *       schema:
 *         type: string
 *       required: true
 *   responses:
 *     200:
 *       description: Getting user successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *              userName:
 *                type: string
 *              country:
 *                type: string
 *              coins:
 *                type: number
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

router.get("/me", verifyJwt, usersController.getMe);

/**
 * @swagger
 * /Users/me:
 *  patch:
 *   tags: [Users]
 *   description: Update information about user (email, userName, country)
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *       schema:
 *         type: string
 *       required: true
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            userName:
 *              type: string
 *            country:
 *              type: string
 *            email:
 *              type: string
 *   responses:
 *     200:
 *       description: User's information updated successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     201:
 *       description: Check email for new email confirmation if email was changed
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

router.patch(
  "/me",
  userValidation.userUpdateValidation,
  verifyJwt,
  usersController.updateMe
);

/**
 * @swagger
 * /Users/me/password:
 *  patch:
 *   tags: [Users]
 *   description: Change password of user
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *       schema:
 *         type: string
 *       required: true
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            password:
 *              type: string
 *            newPassword:
 *              type: string
 *   responses:
 *     200:
 *       description: Password updated successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     401:
 *       description: User not found or is not logged in or password is incorrect
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
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

router.patch(
  "/me/password",
  userValidation.updatePasswordValidation,
  verifyJwt,
  usersController.updatePassword
);

/**
 * @swagger
 * /users/me/shoppingCard:
 *  get:
 *   tags: [Users]
 *   description: Get user's shopping card
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *       schema:
 *         type: string
 *       required: true
 *   responses:
 *     200:
 *       description: Got user's shopping card successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: array
 *            items:
 *             type: object
 *             properties:
 *              _id:
 *               type: string
 *              name:
 *               type: string
 *              price:
 *               type: number
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

router.get("/me/shoppingCard", verifyJwt, usersController.getShoppingCard);

/**
 * @swagger
 * /users/me/shoppingCard:
 *  delete:
 *   tags: [Users]
 *   description: Clear user's shopping card
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *       schema:
 *         type: string
 *       required: true
 *   responses:
 *     200:
 *       description: Clear shoppingCard successfully
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

router.delete("/me/shoppingCard", verifyJwt, usersController.clearShoppingCard);

/**
 * @swagger
 * /users/me/shoppingCard/{ticketId}:
 *  patch:
 *   tags: [Users]
 *   description: Add ticket to user's shopping card
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
 *       description: Ticket id what will be added to user's shopping card
 *   responses:
 *     200:
 *       description: Ticket added to shopping card successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     400:
 *       description: User can't buy his own tickets, tickets are sold out, ticket is already added to shopping card or ticket is not available in user's country
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

router.patch(
  "/me/shoppingCard/:ticketId",
  verifyJwt,
  usersController.addTicketToShoppingCard
);

/**
 * @swagger
 * /users/me/shoppingCard/{ticketId}:
 *  delete:
 *   tags: [Users]
 *   description: Delete one ticket from user's shopping card
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
 *       description: Ticket id what will be deleted from user's shopping card
 *   responses:
 *     200:
 *       description: Deleted ticket successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: array
 *            items:
 *             type: object
 *             properties:
 *              _id:
 *               type: string
 *              name:
 *               type: string
 *              price:
 *               type: number
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

router.delete(
  "/me/shoppingCard/:ticketId",
  verifyJwt,
  usersController.deleteOneFromShoppingCard
);

/**
 * @swagger
 * /users/me/shoppingCard:
 *  patch:
 *   tags: [Users]
 *   description: Buy all tickets in shopping card
 *   parameters:
 *     - in: header
 *       name: x-access-token
 *       schema:
 *         type: string
 *       required: true
 *   responses:
 *     200:
 *       description: Tickets were bought successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     400:
 *       description: Tickets are sold out or user doesn't have enough coins to buy all tickets in shopping card
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

router.patch(
  "/me/shoppingCard",
  verifyJwt,
  usersController.buyAllShoppingCard
);

module.exports = router;
