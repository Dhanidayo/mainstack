const express = require("express");
const { registerUser, login } = require("../controllers/auth");

const router = express.Router();

router.use('/register', registerUser);
router.use('/login', login);

module.exports = router;
