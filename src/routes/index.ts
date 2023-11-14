import express from 'express';
import authRoutes from "./auth";
import userRoutes from "./user";
import productRoutes from "./product";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);

export default router;
