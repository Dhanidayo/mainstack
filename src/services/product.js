const { PRODUCT_MODEL } = require("../db/models");
const { generateUniqueID, formatStringsToLowerCase } = require("../utils");

class ProductService {
  static async createProduct(reqBody) {
    const { name, description, brand, price, stock, imageUrl } = reqBody;

    const productExists = PRODUCT_MODEL.find({ name, brand });

    if (productExists.length > 0) {
      throw new Error(
        "Product already exists. Update stock count on product details."
      );
    }

    const uniqueID = generateUniqueID();
    const productId = `PRD${uniqueID}`;

    //format category value to lowercase
    let category = formatStringsToLowerCase(reqBody.category);

    const product = await PRODUCT_MODEL.create({
      name,
      description,
      brand,
      productId,
      price,
      category,
      stock,
      imageUrl,
    });

    return product;
  }

  static async getProducts() {
    const products = await PRODUCT_MODEL.find().sort({ _id: -1 });

    if (products.length === 0) {
      throw new Error("No products found");
    }

    return products;
  }

  static async getProductById(id) {
    const product = await PRODUCT_MODEL.findOne({ productId: id });

    if (!product) {
      throw new Error("No product found");
    }
    return product;
  }

  static async getProductsByName(name) {
    const response = await PRODUCT_MODEL.find({ name }).sort({ _id: -1 });

    if (!response) {
      throw new Error("No product(s) match the given name");
    }
    return response;
  }

  static async updateProductDetails(id, data) {
    const product = await this.getProductById(id);

    if (!product) {
      throw new Error("Unknown product Id");
    }
    const updatedProduct = await PRODUCT_MODEL.findOneAndUpdate(
      { productId: id },
      { $set: data },
      { new: true }
    );

    return updatedProduct;
  }

  static async deleteProduct(id) {
    const response = await PRODUCT_MODEL.findOneAndDelete({ productId: id });

    if (!response) {
      throw new Error("No such product");
    }

    return response;
  }
}

module.exports = ProductService;
