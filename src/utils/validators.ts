import validator from "validator";
import Ajv from "ajv";

const ajv = new Ajv();

export const validateUserInput = async (
  username: string,
  email: string,
  password: string
) => {
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

export const validateUpdatedUserInput = async (
  username: string | undefined,
  email: string | undefined,
  password: string | undefined
) => {
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

export const createProductValidator = ajv.compile({
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

