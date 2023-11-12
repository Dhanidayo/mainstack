const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductDetails,
  deleteProduct,
  getProductsByName,
  getUsersProducts,
} = require("../controllers/product");
const requireAuth = require("../middlewares/auth");
const { validateQuery } = require("../middlewares/index");

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

module.exports = router;
