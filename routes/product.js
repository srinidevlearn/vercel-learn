const express = require('express');
const router = express.Router();
const Controller = require("../api/product.controller");


// router.get("/:id", (req, res, next) => ProductController.getProductById(req, res));
// router.get("/get/all", (req, res, next) => ProductController.getAllProducts(req, res));
router.get("/get/categories", (req, res, next) => Controller.ProductController.getProductCategories(req, res));
router.get("/get", (req, res, next) => Controller.ProductController.getProducts(req, res));



router.post("/new", (req, res, next) => Controller.ProductController.addNewProduct(req, res, next));
router.put("/update", (req, res, next) => Controller.ProductController.updateProduct(req, res));

module.exports = router;

