let  env = require("dotenv");
env = env.config();
const jwt = require("jsonwebtoken");
const { failedResponse, failedAuthResponse } = require("./util/response.helper");
const jwtSecretKey = env.parsed.SECRETKEY
const sendJwtToken = (data) =>
  jwt.sign(data, jwtSecretKey, { expiresIn: "1h" });
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, jwtSecretKey, (err, user) => {
      if (err) {
        return failedResponse(res,err.toString());
      }
    //   if(user.exp > Date.now()){
    //     return failedAuthResponse(res,{message:'Token expired'})
    //   }

      let expires = user.exp*1000;
      if((expires-Date.now())<=1){
        return failedAuthResponse(res,{message:'Token expired'})
      }
    
      req.user = JSON.stringify(user);
      next();
    });
  } else {
    return failedAuthResponse(res,{message:'Token is missing'})
  }
};
module.exports = { sendJwtToken,jwtSecretKey,authenticateJWT};
