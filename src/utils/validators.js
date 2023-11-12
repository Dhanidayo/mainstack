const validator = require("validator");
const Ajv = require("ajv");
const ajv = new Ajv();

const validateUserInput = async (username, email, password) => {
  if (username.length <= 2) {
    throw new Error("Username is too short");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const validateUpdatedUserInput = async (username, email, password) => {
  if (username && username.length <= 2) {
    throw new Error("Username is too short");
  }

  if (email && !validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  if (password && !validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const createProductValidator = ajv.compile({
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    brand: { type: "string" },
    price: { type: "number" },
    category: { type: "string" },
    stock: { type: "number" },
    imageUrl: { type: "string" },
  },
  required: ["name", "description", "brand", "price", "category", "stock"],
  additionalProperties: false,
});

module.exports = {
  validateUserInput,
  validateUpdatedUserInput,
  createProductValidator,
};
