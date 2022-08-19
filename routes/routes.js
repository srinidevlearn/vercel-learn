const express = require('express');
const usersRouter = require('./user');
const authRouter = require('./auth');

const router = express.Router();

router.use('/user',usersRouter);
router.use('/auth',authRouter);

console.log(router)
module.exports = router;