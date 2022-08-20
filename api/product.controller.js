const RESPONSE_STATUS = require("../util/res.constant");
const {
  failedResponse,
  successResponse,
  toObjectId,
} = require("../util/response.helper");
const { filterBasedOnProjectionKeys } = require("../util/util");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const productModel = {
  name: { type: String },
  image: { type: String },
  description: { type: String },
  isAvailable: { type: Boolean, default: false },
  category: { type: String },
  manufacturer: { type: String },
  price: { type: Number },
};

let ProductSchema = new Schema(productModel, {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret["id"] = ret._id;
      delete ret._id;
    },
  },
});

var Product = mongoose.model("products", ProductSchema);

const productResposeModifier = (item) => {
  let {
    _id,
    name,
    image,
    description,
    isAvailable,
    category,
    manufacturer,
    price,
  } = item;
  let id = _id.toString();
  return {
    id,
    name,
    image,
    description,
    isAvailable,
    category,
    manufacturer,
    price,
  };
};

const addNewProduct = async (req, res, next) => {
  try {
    let { body } = req;
    let { name, image, category, price } = body;
    if (!name) throw new Error("Product name is mandatory");
    if (!image) throw new Error("Product image url is mandatory");
    if (!category) throw new Error("Product category is mandatory");
    if (!price) throw new Error("Product price is mandatory");
    await Product.create(body);
    return successResponse(res, "Product added Successfully");
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};
const updateProduct = async (req, res, next) => {
  try {
    let { body } = req;
    let { id } = body;
    if (!id) throw new Error("Product id is mandatory");
    let temp = await Product.findById(id).then((res) =>
      res ? res.toJSON() : null
    );
    if (!temp) throw new Error("Product is not available");
    let query = { _id: toObjectId(id) };
    delete body.id;
    let updates = { ...body };
    await Product.updateOne(query, updates);
    return successResponse(res, "product having id as " + id + "got updated");
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

const getProductCategories = async (req, res, next) => {
  let data = await Product.find().distinct("category");
  return successResponse(res, data);
};

const getAllProductsByCategory = async (req, res, next) => {
  let { query } = req;
  let { category, sort } = query;
  let data = await Product.find({ category })
    .lean()
    .then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        return res.map(productResposeModifier);
      }
      return null;
    });
  return successResponse(res, data);
};

const getAllProductsByPriceSort = async (req, res, next) => {
  try {
    let { query } = req;
    let { sort } = query;
    let sortingBy = ["ASC", "DESC"];
    if (!sortingBy.includes(sort))
      throw new Error("Sort flag must be either ASC or DESC");
    let data = await Product.find()
      .sort({ price: sort === "ASC" ? 1 : -1 })
      .lean()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          return res.map(productResposeModifier);
        }
        return null;
      });
    return successResponse(res, data);
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

const getAllProductsByCategoryAndSort = async (req, res, next) => {
  try {
    let { query } = req;
    let { category, sort } = query;
    let sortingBy = ["ASC", "DESC"];
    if (!sortingBy.includes(sort))
      throw new Error("Sort flag must be either ASC or DESC");
    let data = await Product.find({ category })
      .sort({
        price: sort === "ASC" ? 1 : -1,
      })
      .lean()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          return res.map(productResposeModifier);
        }
        return null;
      });
    return successResponse(res, data);
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

const getAllProducts = async (req, res, next) => {
  let data = await Product.find()
    .lean()
    .then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        return res.map(productResposeModifier);
      }
      return null;
    });
  return successResponse(res, data);
};

const deleteProductById = async (req, res, next) => {};
const getProductByIds = async (
  ids = [],
  projections = [],
  returnAsArray = true
) => {
  let collectAllProductId = ids.map((i) => toObjectId(i));
  let data = await Product.find({
    _id: {
      $in: collectAllProductId,
    },
  })
    .lean()
    .then((products) => {
      let temp = {};
      if (products && Array.isArray(products) && products.length > 0) {
        for (let product of products) {
          let id = product._id.toString();
          temp[id] = {
            id,
            ...filterBasedOnProjectionKeys(projections, product),
          };
        }
      }
      return returnAsArray ? Object.values(temp) : temp;
    });
  return data;
};

const getProducts = async (req, res, next) => {

    if (req.query.category && req.query.sort)
      return getAllProductsByCategoryAndSort(req, res);
    if (req.query.category) return getAllProductsByCategory(req, res);
    if (req.query.sort) return getAllProductsByPriceSort(req, res);
    if (req.query.all) return getAllProducts(req,res)
    if(req.query.id) return getProductById(req,res)
  
};

const getProductById = async(req,res,next) =>{
  try {
    let { query } = req;
    let { id } = query;
    let data = await Product.findById(id).lean().then(product=>productResposeModifier(product))
    return successResponse(res, data);
  }catch(e){
    failedResponse(res,e.toString())
  }
}

const ProductController = {
  addNewProduct,
  updateProduct,
  getAllProducts,
  getProducts,
  getProductCategories,
  deleteProductById,
  getProductByIds,
};

module.exports = ProductController;

module.exports = {ProductController,Product};

