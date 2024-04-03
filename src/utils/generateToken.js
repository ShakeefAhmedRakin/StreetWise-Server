const jwt = require("jsonwebtoken");
const config = require("../config/default");

const generateToken = (uid) => {
  return jwt.sign(uid, config.ACCESS_TOKEN, {
    expiresIn: "1h",
  });
};

module.exports = generateToken;
