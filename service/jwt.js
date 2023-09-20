const jwt = require("jsonwebtoken");

const generateAccessToken = (user) =>
  jwt.sign({ user }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE
  });

const generateRefreshToken = (user) =>
  jwt.sign({ user }, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE
  });

const verifyToken = (token, secret) => jwt.verify(token, secret);
module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
