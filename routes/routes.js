const express = require('express');
const usersRouter = require('./user');
const authRouter = require('./auth');
const productRouter = require('./product');
const cartRouter = require('./cart');



const router = express.Router();

router.use('/user',usersRouter);
router.use('/auth',authRouter);
router.use('/product',productRouter);
router.use('/cart',cartRouter);


module.exports = router;