const express = require('express');
const usersRouter = require('./user');
const router = express.Router();

router.use('/user',usersRouter);
console.log(router)
module.exports = router;