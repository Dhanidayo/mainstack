const UserService = require("../services/user");

/**
 * @description gets the list of existing users
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getUsers = async (req, res, next) => {
  try {
    const data = await UserService.getUsers();

    return res.status(200).json({
      message: "Users fetched successfully",
      totalNumberOfUsers: data?.length,
      data,
    });
  } catch (error) {
    if (error.message === "No users found") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * @description gets a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getAUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const data = await UserService.getUserById(userId);

    return res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    if (error.message === "No user found") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

/**
 * @description updates a user's details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const updateAUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const data = await UserService.updateUser(req.body, userId);

    return res
      .status(200)
      .json({ message: "User info updated successfully", data });
  } catch (error) {
    if (error.message === "No user found") {
      res.status(404).json({ error: "Unknown User Id" });
    } else {
      next(error);
    }
  }
};

/**
 * @description deletes a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const response = await UserService.deleteUser(userId);

    return res
      .status(200)
      .json({ message: "User deleted successfully", response });
  } catch (error) {
    if (error.message === "No such user") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

module.exports = { getUsers, getAUser, updateAUser, deleteUser };
