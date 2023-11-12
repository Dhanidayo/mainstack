const { USER_MODEL } = require("../db/models");
const { createToken } = require("../utils");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await USER_MODEL.signup(username, email, password);

    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { username, email, token, id: user._id },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await USER_MODEL.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { username: user.username, email, token, id: user._id },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registerUser, login };
