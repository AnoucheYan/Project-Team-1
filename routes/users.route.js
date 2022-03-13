const { Router } = require("express");
const verifyJwt = require("../middlwares/jwtVerify");
const usersController = require("../controllers/users.controller");

const router = Router();

router.get("/me", verifyJwt, usersController.getMe);
router.patch("/me", verifyJwt, usersController.updateMe);
router.patch("/me/password", verifyJwt, usersController.updatePassword);
router.delete("/me", verifyJwt, usersController.deleteMe);

module.exports = router;
