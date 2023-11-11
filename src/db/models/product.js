const mongoose = require("mongoose");
const stringSimilarity = require("string-similarity");

const categoryEnum = [
  "electronics",
  "gadgets",
  "clothing",
  "books",
  "cosmetics",
  "skincare",
  "other",
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      validate: {
        validator: async function (value) {
          const lowerCaseValue = value.toLowerCase();
          const matches = stringSimilarity.findBestMatch(
            lowerCaseValue,
            categoryEnum
          );

          const similarityThreshold = 0.8;

          if (matches.bestMatch.rating >= similarityThreshold) {
            this.category = matches.bestMatch.target;
          } else {
            this.category = "other";
          }
        },
      },
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

productSchema.pre("save", async function (next) {
  try {
    await this.validate();
    next();
  } catch (error) {
    next(error);
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
