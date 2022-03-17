const { Router } = require("express");
const verifyJwt = require("../middlwares/jwtVerify");
const usersController = require("../controllers/users.controller");

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
 */

router.patch("/me", verifyJwt, usersController.updateMe);

/**
 * @swagger
 * /Users/me/password:
 *  patch:
 *   tags: [Users]
 *   description: Change password of user
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
 *       description: User not found or is not logged in
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 */

router.patch("/me/password", verifyJwt, usersController.updatePassword);

/**
 * @swagger
 * /users/me:
 *  delete:
 *   tags: [Users]
 *   description: Delete user
 *   responses:
 *     200:
 *       description: Delete user
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

router.delete("/me", verifyJwt, usersController.deleteMe);

module.exports = router;
