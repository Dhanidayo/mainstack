import { Request, Response, NextFunction } from "express";
import CustomRequest from "../db/interfaces/customRequest";
import ProductService from "../services/product";
import { createProductValidator } from "../utils/validators";
import Product from "../db/interfaces/product";

/**
 * @description creates a new product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const createProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isReqValid = createProductValidator(req.body);
    const errors = createProductValidator.errors;

    if (!isReqValid) {
      res.status(400).json({
        error: true,
        message: "invalid or missing required fields",
        errors: errors,
      });
    }

    // Assign userId to new product
    const userId: string = req.user._id;
    req.body.userId = userId;

    const data = await ProductService.createProduct(req.body);

    res.status(201).json({
      error: false,
      message: "Product created successfully",
      data,
    });
  } catch (error: any) {
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
      next(error);
    }
  }
};

/**
 * @description gets the list of existing products
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await ProductService.getProducts();

    res.status(200).json({
      message: "All Products fetched successfully",
      totalNumberOfProducts: data?.length,
      data,
    });
  } catch (error: any) {
    if (error.message === "No products found") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * @description gets a list of products created by a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const getUsersProducts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId: string = req.user._id;

  try {
    const data = await ProductService.getUsersProducts(userId);

    res.status(200).json({
      message: "Success",
      totalNumberOfProducts: data?.length,
      data,
    });
  } catch (error: any) {
    if (error.message === "No products found for user") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * @description gets a product by the given Id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const productId: string = req.params.productId;

  try {
    const data = await ProductService.getProductById(productId);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error: any) {
    if (error.message === "No product found") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * @description gets a product or list of products by a given name
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const getProductsByName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const productName: string | undefined = req.query.name as string | undefined;

  try {
    const data = await ProductService.getProductsByName(productName);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error: any) {
    if (error.message === "No product(s) match the given name") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * @description updates a product details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const updateProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const productId: string = req.params.productId;

  try {
    const data = await ProductService.updateProductDetails(
      productId,
      (req.body as Partial<Product>) || {}
    );

    res
      .status(200)
      .json({ message: "Product details updated successfully", data });
  } catch (error: any) {
    if (error.message === "Unknown product Id") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * @description deletes a product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const productId: string = req.params.productId;

  try {
    await ProductService.deleteProduct(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    if (error.message === "No such product") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};
