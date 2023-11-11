const jwt = require("jsonwebtoken");

module.exports = {
  /**
   * @description creates a tokem
   * @param {*} _id
   * @returns token
   */
  createToken(_id) {
    return jwt.sign({ _id }, process.env.SECRET_PASS, { expiresIn: "3d" });
  },

  /**
   *
   * @returns 5-digit unique random numbers
   */
  generateUniqueID() {
    return Math.floor(Math.random() * 99999 + 10000);
  },

  /**
   *
   * @param {*} value
   * @returns a string or array of strings in lowercase
   */
  formatStringsToLowerCase(value) {
    if (typeof value === "string") {
      return value.toLowerCase();
    } else if (Array.isArray(value)) {
      return value.map((item) => item.toLowerCase());
    }
    return value;
  },
};
