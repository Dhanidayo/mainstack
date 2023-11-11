const ProductService = require("../services/product");
const { createProductValidator } = require("../utils/validators");

/**
 * @description creates a new product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const createProduct = async (req, res, next) => {
  try {
    const isReqValid = createProductValidator(req.body);
    const errors = createProductValidator.errors;

    if (!isReqValid) {
      return res.status(400).json({
        error: true,
        message: "invalid or missing required fields",
        errors: errors,
      });
    }

    //assign userId to new product
    const userId = req.user._id;
    req.body.userId = userId;

    const data = await ProductService.createProduct(req.body);

    return res.status(201).json({
      error: false,
      message: "Product created successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ error: "Validation error", details: error.message });
    } else if (
      error.message ===
      "Product already exists. Update stock count on product details."
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    next(error);
  }
};

/**
 * @description gets the list of existing products
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getAllProducts = async (req, res, next) => {
  try {
    const data = await ProductService.getProducts();

    return res.status(200).json({
      message: "All Products fetched successfully",
      totalNumberOfProducts: data?.length,
      data,
    });
  } catch (error) {
    console.error(error);
    if (error.message === "No products found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    next(error);
  }
};

/**
 * @description gets a list of products created by a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getUsersProducts = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const data = await ProductService.getUsersProducts(userId);

    return res.status(200).json({
      message: "Success",
      totalNumberOfProducts: data?.length,
      data,
    });
  } catch (error) {
    console.error(error);
    if (error.message === "No products found for user") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    next(error);
  }
};

/**
 * @description gets a product by the given Id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getProductById = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const data = await ProductService.getProductById(productId);

    return res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    console.error(error);
    if (error.message === "No product found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    next(error);
  }
};

/**
 * @description gets a product or list of products by a given name
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getProductsByName = async (req, res, next) => {
  const productName = req.query.name;

  try {
    const data = await ProductService.getProductsByName(productName);

    return res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    console.error(error);
    if (error.message === "No product(s) match the given name") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    next(error);
  }
};

/**
 * @description updates a product details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const updateProductDetails = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const data = await ProductService.updateProductDetails(productId, req.body);
    console.log("Updated Product", data);

    return res
      .status(200)
      .json({ message: "Product details updated successfully", data });
  } catch (error) {
    console.error(error);
    if (error.message === "Unknown product Id") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    next(error);
  }
};

/**
 * @description deletes a product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const response = await ProductService.deleteProduct(productId);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.message === "No such product") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getUsersProducts,
  getProductById,
  getProductsByName,
  updateProductDetails,
  deleteProduct,
};
