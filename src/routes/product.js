const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProductDetails,
  deleteProduct,
  getProductsByName,
} = require("../controllers/product");
const requireAuth = require("../middlewares/auth");
const { validateQuery } = require("../middlewares/index");

const router = express.Router();

//require auth for all product routes
router.use(requireAuth);

const requireQuery = validateQuery(true);

router.post("/create", createProduct);
router.get("/all", getAllProducts);
router.get("/", requireQuery, getProductsByName);
router.get("/:productId", getProduct);
router.put("/:productId", updateProductDetails);
router.delete("/:productId", deleteProduct);

module.exports = router;
