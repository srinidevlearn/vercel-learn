const express = require('express');
const usersRouter = require('./user');
const authRouter = require('./auth');
const productRouter = require('./product');


const router = express.Router();

router.use('/user',usersRouter);
router.use('/auth',authRouter);
router.use('/product',productRouter);


console.log(router)
module.exports = router;