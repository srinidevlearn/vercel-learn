const express = require("express");
const router = express.Router();
const Controller = require("../api/user.controller");

router.post("/login", (req, res, next) => Controller.AuthController.login(req, res, next));
router.post("/register", (req, res, next) => Controller.AuthController.register(req, res));
module.exports = router;
