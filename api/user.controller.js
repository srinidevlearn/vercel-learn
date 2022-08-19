const mongoose = require("mongoose");
const { failedResponse, successResponse,ObjectId } = require("../util/response.helper");


let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    name: {
      firstName: { type: String },
      lastName: { type: String },
    },
    email: { type: String },
    username: { type: String },
    password: { type: String },
    role: { type: Array },
    phone: { type: String },
    address: {
      city: { type: String },
      street: { type: String },
      zipcode: { type: String },
      landmark: { type: String },
    },
  },
  {
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

var User = mongoose.model("users", UserSchema);



const getUser = async (req, res) => {
  let { id } = req.params;
  try {
    const data = await User.findOne({ email: id })
    .then((res) => res.toJSON());
    if (!data) {
        
      throw new Error("A user with this email could not be found.");
    }
    return successResponse(res, data);
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

const getAllUsers = async (req, res) => {
  try {
    let data = await User.find({})
      .select("address name email phone username")
      .then((res) => {
        return res;
      });
    return successResponse(res, data);
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

const getUsersById = async (req, res) => {
  try {
    const data = await User.find({ $and: [{ email: req.body.emails }] })
      .select("-password")
      .select("address name email phone username")
      .then((res) => res.toJSON());
    return successResponse(res, data);
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

const updateUserDetail = async (req, res) => {
  let { body } = req;
  let { email } = body;
  try {
    let data = await User.findOne({ email });
    if (!data) {
      throw new Error("Email id is not available");
    } else {
      await User.create(body);
      let query = { email };
      let updates = { ...body };
      let doc = await User.updateOne(query, updates);
      return successResponse(res, doc);
    }
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

const deleteUserDetail = (req, res) => {
  return res.json({
    status: RESPONSE_STATUS.SUCCESS,
    message: "Delete By User Id",
  });
};
const createUserDetail = async (req, res, next) => {
  let { body } = req;
  try {
    let data = await User.findOne({ email: body.email });
    if (data) {
      throw new Error("User detail already available");
    } else {
      await User.create(body);
      let temp = User.findOne({ email: body.email }).then((res) => res);
      return successResponse(res, temp);
    }
  } catch (e) {
    return failedResponse(res, e.toString());
  }
};

const UserController = {
  getAllUsers,
  getUser,
  getUsersById,
  updateUserDetail,
  deleteUserDetail,
  createUserDetail,
};
module.exports = {UserController,User};

