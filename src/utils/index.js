const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

  /**
   * 
   * @param {*} password 
   * @param {*} salt 
   * @returns a password hash
   */
  async hashPassword(password, salt) {
    try {
      const hash = await new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, (err, hashedPassword) => {
          if (err) {
            reject(new Error("Error hashing password"));
          } else {
            resolve(hashedPassword);
          }
        });
      });

      return hash;
    } catch (error) {
      throw new Error("Unexpected error during password hashing");
    }
  },
};
