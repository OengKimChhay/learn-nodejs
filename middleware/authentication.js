const jwt = require("jsonwebtoken");
const { generateAccessToken ,verifyToken} = require("../service/jwt");
const UserModel = require("../models/UserModel");

const authentication = (req, res, next) => {
  const accessToken = req?.headers?.authorization?.split(" ")[1];
  const refreshToken = req?.cookies?.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.sendStatus(401);
  }

  try {
      const decoded = verifyToken(accessToken, process.env.JWT_SECRET_TOKEN);
      req.user = decoded.user;
      next();
  } catch (error) {
    try{
      const decoded = verifyToken(refreshToken,process.env.JWT_SECRET_REFRESH_TOKEN);
      userExist = UserModel.findById(decoded.user._id);
      if(!userExist) return res.sendStatus(403);

      const accessToken = generateAccessToken(decoded.user);
      res.header('Authorization', accessToken)
      next();
    }catch(error){
      return res.sendStatus(401);
    }
  }
};

module.exports = authentication;
