const mongoose = require("mongoose");
const { failedResponse, successResponse,ObjectId } = require("../util/response.helper");
// const connectDatabase = async () => {
//   try {


    
//     await mongoose.connect(process.env.MONGODBURL || "mongodb://localhost:27017",{
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//         });

//     console.log("connected to database");
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };
// connectDatabase();

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

// UserSchema.methods.toJSON = function () {
//   var user = this;
//   var userObject = user.toObject();
//   return userObject;
// };

var User = mongoose.model("users", UserSchema);

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
const UserController = {
  getAllUsers
};

module.exports = {UserController,User};

