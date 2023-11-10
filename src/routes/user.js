const express = require("express");
const {
  getAUser,
  updateAUser,
  deleteUser,
  getUsers,
} = require("../controllers/user");
const requireAuth = require("../middlewares/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getUsers);
router.get("/:userId", getAUser);
router.put("/:userId", updateAUser);
router.delete("/:userId", deleteUser);

module.exports = router;
