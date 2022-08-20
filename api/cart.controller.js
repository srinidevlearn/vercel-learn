const RESPONSE_STATUS = require("../util/res.constant");
const {
  failedResponse,
  successResponse,
  toObjectId,
} = require("../util/response.helper");
const UserCon = require("./user.controller");
const ProductCon = require("./product.controller");
const { getProductByIds } = ProductCon.ProductController;
const User = UserCon.User;
const Products = ProductCon.Product;

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity can not be less then 1."],
      max: [5, "Quantity can not be greater than 5."],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        ret["id"] = ret._id;
        delete ret._id;
      },
    },
  }
);

var Cart = mongoose.model("carts", CartSchema);
addNewItemToCart = async (req, res) => {
  try {
    let { body } = req;
    let { userId, productId, quantity } = body;
    if (!userId) throw new Error("User Id is mandatory");
    let userDoc = await User.findById(userId).lean();
    if (!userDoc) throw new Error("Invalid user Id is supplied");
    if (!productId) throw new Error("Product Id is mandatory");
    let productDoc = await Products.findById(productId).lean();
    if (!productDoc) throw new Error("Invalid product Id is supplied");
    if (!quantity) throw new Error("Quantity is mandatory");
    if (quantity < 1) throw new Error("Quantity can not be less then 1");
    if (quantity > 5) throw new Error("Quantity can not be greater then 5");
    isAlreadyItemInCart = await Cart.find({ userId, productId })
      .lean()
      .then((res) =>
        res && Array.isArray(res) && res.length > 0 ? res : null
      );
    if (isAlreadyItemInCart) {
      let cartId = isAlreadyItemInCart[0]["_id"].toString();
      await Cart.findByIdAndUpdate(cartId, { quantity });
      return successResponse(res, "Updated the cart Item");
    }
    // throw new Error('Already cart item is there please update quantity')
    await Cart.create({ ...body });
    return successResponse(res, "Added to cart Successfully");
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};
getCartItems = async (filter) => {
  let collectAllProductId;
  let collectAllProductsAvailable;
  if (filter) filter = { ...filter };
  else filter = {};
  let cartItems = await Cart.find(filter).sort({ createdAt: "asc" }).lean();
  if (cartItems) {
    collectAllProductId = [...new Set(cartItems.map((i) => i.productId))];
    collectAllProductsAvailable = await getProductByIds(
      collectAllProductId,
      ["name", "price", "description", "image"],
      false
    );
    return cartItems.map((cartItem) => {
      let id = cartItem._id.toString();
      let { productId, quantity, created_at, updated_at, userId } = cartItem;
      let temp = {
        quantity,
        created_at,
        updated_at,
        userId,
        product: null,
        id,
      };
      temp["product"] = collectAllProductsAvailable[productId];
      return temp;
    });
  }
};

getAllCartItems = async (req, res) => {
  let cartItems = await getCartItems();
  return successResponse(res, cartItems);
};

getUserCartItems = async (req, res) => {
  try {
    let { userId } = req.params;
    if (!userId) throw new Error("UserId is mandatory");
    let cartItems = await getCartItems({ userId }).then((res) =>
      res.map((i) => {
        delete i["userId"];
        return i;
      })
    );
    return successResponse(res, cartItems);
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

updateCartItem = async (req, res) => {
  try {
    let { body } = req;
    let { cartId, quantity } = body;
    if (!cartId) throw new Error("Cart id is mandatory");
    await Cart.findByIdAndUpdate(cartId, { quantity });
    return successResponse(res, "Updated the cart Item");
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

deleteCartItem = async (req, res) => {
  try {
    let { cartId } = req.params;
    if (!cartId) throw new Error("Cart id is mandatory");
    await Cart.findByIdAndDelete(cartId);
    return successResponse(res, "Deleted the cart Item");
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

const CartController = {
  addNewItemToCart,
  getAllCartItems,
  getUserCartItems,
  updateCartItem,
  deleteCartItem,
};

module.exports = { CartController, Cart };
