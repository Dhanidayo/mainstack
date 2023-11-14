import express from 'express';
import {
  getAUser,
  updateAUser,
  deleteUser,
  getUsers,
} from "../controllers/user";
import { requireAuth } from '../middlewares/auth';

const router = express.Router();

router.use(requireAuth);

router.get("/", getUsers);
router.get("/:userId", getAUser);
router.put("/:userId", updateAUser);
router.delete("/:userId", deleteUser);

export default router;
