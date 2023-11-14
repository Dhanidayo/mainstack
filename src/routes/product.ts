import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductDetails,
  deleteProduct,
  getProductsByName,
  getUsersProducts,
} from "../controllers/product";
import {requireAuth} from "../middlewares/auth";
import { validateQuery } from '../middlewares/index';

const router = express.Router();

router.use(requireAuth);

const requireQuery = validateQuery(true);

router.post("/create", createProduct);
router.get("/all", getAllProducts);
router.get("/user/all", getUsersProducts);
router.get("/", requireQuery, getProductsByName);
router.get("/:productId", getProductById);
router.put("/:productId", updateProductDetails);
router.delete("/:productId", deleteProduct);

export default router;
