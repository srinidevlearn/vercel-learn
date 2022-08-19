const express = require('express');
const router = express.Router();
const Controller  = require("../api/user.controller");

/* GET user operation. */
router.get("/:id", (req, res, next) => Controller.UserController.getUser(req, res));

router.get("/get/all", (req, res, next) => Controller.UserController.getAllUsers(req,res));


/* POST user operation. */
router.post("/new", (req, res, next) => Controller.UserController.createUserDetail(req, res, next));
router.put("/update", (req, res, next) => Controller.UserController.updateUserDetail(req, res));
router.post("/queryByIds",(req, res, next) => Controller.UserController.getUsersById(req, res));


module.exports = router;

