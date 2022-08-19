const RESPONSE_STATUS = require("./res.constant");
const mongoose = require("mongoose");
const toObjectId = (id) => mongoose.Types.ObjectId(id);
const isTruthyValues = (data) => (data ? true : false);

const successResponse = (res, data) =>
  res.status(RESPONSE_STATUS.SUCCESS).send({ status: "success", data });
const failedResponse = (res, error) =>
  res.status(RESPONSE_STATUS.NOTFOUND).send({ status: "Failed", error });
  const failedAuthResponse = (res, error) =>
  res.status(RESPONSE_STATUS.UNAUTHORIZED).send({ status: "Failed", error });
module.exports = {
  successResponse,
  failedResponse,
  toObjectId,
  isTruthyValues,
  failedAuthResponse
};
