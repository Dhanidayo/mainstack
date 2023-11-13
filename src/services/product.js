const { PRODUCT_MODEL } = require("../db/models");
const { generateUniqueID, formatStringsToLowerCase } = require("../utils");

class ProductService {
  /**
   *
   * @param {*} reqBody
   * @returns a newly created product
   */
  static async createProduct(reqBody) {
    const { name, description, brand, price, stock, imageUrl, userId } =
      reqBody;

    const productExists = await PRODUCT_MODEL.find({ name, brand });

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
      userId,
    });

    return product;
  }

  /**
   *
   * @returns a list of all products
   */
  static async getProducts() {
    const products = await PRODUCT_MODEL.find().sort({ _id: -1 });

    if (products.length === 0) {
      throw new Error("No products found");
    }

    return products;
  }

  /**
   *
   * @param {*} userId
   * @returns a list of products created by a particular user
   */
  static async getUsersProducts(userId) {
    const products = await PRODUCT_MODEL.find({ userId }).sort({
      createdAt: -1,
    });

    if (products.length === 0) {
      throw new Error("No products found for user");
    }
    return products;
  }

  /**
   *
   * @param {*} id
   * @returns a product
   */
  static async getProductById(id) {
    const product = await PRODUCT_MODEL.findOne({ productId: id });

    if (!product) {
      throw new Error("No product found");
    }
    return product;
  }

  /**
   *
   * @param {*} name
   * @returns a product or list of products that match the given name
   */
  static async getProductsByName(name) {
    const response = await PRODUCT_MODEL.find({ name }).sort({ _id: -1 });

    if (!response || response.length === 0) {
      throw new Error("No product(s) match the given name");
    }
    return response;
  }

  /**
   *
   * @param {*} id
   * @param {*} data
   * @returns an updated product details
   */
  static async updateProductDetails(id, data) {
    const product = await this.getProductById(id);
  
    if (!product) {
      throw new Error("Unknown product Id");
    }
  
    if (!data || Object.keys(data).length === 0) {
      return product;
    }
  
    const fieldsToUpdate = ["name", "description", "brand", "price", "category", "stock", "imageUrl"];
    const updatedFields = {};
  
    fieldsToUpdate.forEach((field) => {
      updatedFields[field] = data[field] !== undefined && data[field] !== null && data[field] !== ""
        ? data[field]
        : product[field];
    });
  
    const updatedProduct = await PRODUCT_MODEL.findOneAndUpdate(
      { productId: id },
      { $set: updatedFields },
      { new: true }
    );
  
    return updatedProduct;
  }  

  /**
   * @description deletes a product
   * @param {*} id
   * @returns
   */
  static async deleteProduct(id) {
    const response = await PRODUCT_MODEL.findOneAndDelete({ productId: id });

    if (!response) {
      throw new Error("No such product");
    }

    return response;
  }
}

module.exports = ProductService;
