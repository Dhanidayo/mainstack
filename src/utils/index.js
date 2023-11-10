const jwt = require("jsonwebtoken");

module.exports = {
  createToken(_id) {
    return jwt.sign({ _id }, process.env.SECRET_PASS, { expiresIn: "3d" });
  },

  generateUniqueID() {
    return Math.floor(Math.random() * 99999 + 10000);
  },

  formatStringsToLowerCase(value) {
    if (typeof value === "string") {
      return value.toLowerCase();
    } else if (Array.isArray(value)) {
      return value.map((item) => item.toLowerCase());
    }
    return value;
  },
};
