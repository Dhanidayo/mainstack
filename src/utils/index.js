const jwt = require("jsonwebtoken");

module.exports = {
  createToken(_id) {
    return jwt.sign({ _id }, process.env.SECRET_PASS, { expiresIn: "3d" });
  },
};
