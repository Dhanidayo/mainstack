const Ajv = require("ajv");
const ajv = new Ajv();

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
  required: [
    "name",
    "description",
    "brand",
    "price",
    "category",
    "stock",
  ],
  additionalProperties: false,
});

module.exports = { createProductValidator };
