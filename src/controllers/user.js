const UserService = require("../services/user");

const getUsers = async (req, res, next) => {
  try {
    const users = await UserService.getUsers();

    return res.status(200).json({
      message: "Users fetched successfully",
      totalNumberOfUsers: users?.length,
      users,
    });
  } catch (error) {
    console.error(error);
    if (error.message === "No users found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    next(error);
  }
};

const getAUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await UserService.getUserById(userId);

    return res.status(200).json({
      message: "Success",
      user,
    });
  } catch (error) {
    console.error(error);
    if (error.message === "No user found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    next(error);
  }
};

const updateAUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const data = await UserService.updateUser(req.body, userId);
    console.log("Updated User", data);

    return res
      .status(200)
      .json({ message: "User info updated successfully", data });
  } catch (error) {
    console.error(error);
    if (error.message === "No user found") {
      res.status(404).json({ error: "Unknown User Id" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const response = await UserService.deleteUser(userId);

    return res
      .status(200)
      .json({ message: "User deleted successfully", response });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { getUsers, getAUser, updateAUser, deleteUser };
