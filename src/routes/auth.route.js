const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const {userRegValidation} = require("../middlwares/userValidation");

const router = Router();

/**
 * @swagger
 * components:
 *   tags:
 *    - name: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *   tags: [Authentication]
 *   description: Registration of new user
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            password:
 *              type: string
 *            country:
 *              type: string
 *   responses:
 *     201:
 *       description: Check email for account confirmation
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     400:
 *       description: Email, firstName, lastName, country and password are required
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *     401:
 *       description: Invalid username or password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *     409:
 *       description: Such email already exists
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

router.post("/register", userRegValidation, authController.register);

/**
 * @swagger
 * /auth/confirm/{token}:
 *  get:
 *   tags: [Authentication]
 *   description: Verification
 *   parameters:
 *     - in: path
 *       name: token
 *   responses:
 *     200:
 *       description: Account verification by email
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 */

router.get("/confirm/:token", authController.confirm);

/**
 * @swagger
 * /auth/login:
 *  post:
 *   tags: [Authentication]
 *   description: Login user
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *   responses:
 *     200:
 *       description: Login successfully
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *              message:
 *                type: string
 *     201:
 *       description: Account verification type information
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     400:
 *       description: Email and password are required
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *     401:
 *       description: Invalid email or password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 */

router.post("/login", authController.login);

module.exports = router;
