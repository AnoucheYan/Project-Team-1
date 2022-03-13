const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const router = Router();

router
  .post("/register", authController.register)
  .post("/login", authController.login)
  .get("/confirm/:token", authController.confirm)

module.exports = router;
