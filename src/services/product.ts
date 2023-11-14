import Product from "../db/interfaces/product";
import { generateUniqueID, formatStringsToLowerCase } from "../utils";
import ProductModel from "../db/models/product";

class ProductService {
  /**
   *
   * @param {*} reqBody
   * @returns a newly created product
   */
  static async createProduct(reqBody: Product): Promise<Product> {
    const {
      name,
      description,
      brand,
      price,
      stock,
      imageUrl,
      userId,
      category,
    } = reqBody;

    const productExists = await ProductModel.find({ name, brand });

    if (productExists.length > 0) {
      throw new Error(
        "Product already exists. Update stock count on product details."
      );
    }

    const uniqueID = generateUniqueID();
    const productId = `PRD${uniqueID}`;

    // format category value to lowercase
    let formattedCategory = category
      ? formatStringsToLowerCase(category)
      : undefined;

    const product = await ProductModel.create({
      name,
      description,
      brand,
      productId,
      price,
      category: formattedCategory,
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
  static async getProducts(): Promise<Product[]> {
    const products = await ProductModel.find().sort({ _id: -1 });

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
  static async getUsersProducts(userId: string): Promise<Product[] | null> {
    const products = await ProductModel.find({ userId }).sort({
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
  static async getProductById(id: string): Promise<Product | null> {
    const product = await ProductModel.findOne({ productId: id });

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
  static async getProductsByName(name: string | undefined): Promise<Product | Product[]> {
    const response = await ProductModel.find({ name }).sort({ _id: -1 });

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
  static async updateProductDetails(
    id: string,
    data: Partial<Product>
  ): Promise<Product | null> {
    const product = await this.getProductById(id);

    if (!product) {
      throw new Error("Unknown product Id");
    }

    if (!data || Object.keys(data).length === 0) {
      return product;
    }

    const fieldsToUpdate: (keyof Product)[] = [
      "name",
      "description",
      "brand",
      "price",
      "category",
      "stock",
      "imageUrl",
    ];

    const updatedFields: Partial<Product> = {};

    fieldsToUpdate.forEach((field) => {
      updatedFields[field] =
        data[field] !== undefined && data[field] !== null && data[field] !== ""
          ? data[field]
          : product[field];
    });

    const updatedProduct = await ProductModel.findOneAndUpdate(
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
  static async deleteProduct(id: string): Promise<Product | null> {
    const response = await ProductModel.findOneAndDelete({ productId: id });

    if (!response) {
      throw new Error("No such product");
    }

    return response;
  }
}

export default ProductService;
