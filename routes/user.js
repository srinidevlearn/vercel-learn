const express = require('express');
const router = express.Router();
/* GET user operation. */
// router.get("/:id", (req, res, next) => UserController.getUser(req, res));
router.get("/get/all", (req, res, next) => UserController.getAllUsers(req, res));


// /* POST user operation. */
// router.post("/new", (req, res, next) => UserController.createUserDetail(req, res, next));
// router.put("/update", (req, res, next) => UserController.updateUserDetail(req, res));
// router.post("/queryByIds",(req, res, next) => UserController.getUsersById(req, res));


router.use('/user', usersRouter);
module.exports = router;

