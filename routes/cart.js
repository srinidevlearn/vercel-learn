const express = require("express");
const router = express.Router();
const Controller = require("../api/cart.controller");

router.post("/addToCart", (req, res, next) => Controller.CartController.addNewItemToCart(req, res, next));
router.get("/get/all", (req, res, next) => Controller.CartController.getAllCartItems(req, res, next));
router.get("/getUserCart/:userId", (req, res, next) => Controller.CartController.getUserCartItems(req, res, next));

router.put("/update", (req, res, next) => Controller.CartController.updateCartItem(req, res, next));
router.delete("/delete/:cartId", (req, res, next) => Controller.CartController.deleteCartItem(req, res, next));

module.exports = router;
