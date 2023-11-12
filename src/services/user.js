const { USER_MODEL } = require("../db/models");
const { validateUpdatedUserInput } = require("../utils/validators");

class UserService {
  /**
   *
   * @returns a list of all users
   */
  static async getUsers() {
    const users = await USER_MODEL.find().sort({ _id: -1 });

    if (users.length === 0) {
      throw new Error("No users found");
    }

    return users;
  }

  /**
   *
   * @param {*} id
   * @returns a user object
   */
  static async getUserById(id) {
    const user = await USER_MODEL.findOne({ _id: id });

    if (!user) {
      throw new Error("No user found");
    }
    return user;
  }

  /**
   *
   * @param {*} data
   * @param {*} id
   * @returns an updated user
   */
  static async updateUser(data, id) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new Error("Unknown User Id");
    }

    const { username, email, password } = data;

    if (!username && !email && !password) {
      return user;
    }

    const updatedFields = {};

    if (username !== undefined && username !== "") {
      updatedFields.username = username;
    }

    if (email !== undefined && email !== "") {
      updatedFields.email = email;
    }

    if (password !== undefined && password !== "") {
      updatedFields.password = password;
    }

    await validateUpdatedUserInput(
      updatedFields.username,
      updatedFields.email,
      updatedFields.password
    );

    const updatedUser = await USER_MODEL.findOneAndUpdate(
      { _id: id },
      { $set: updatedFields },
      { new: true }
    );

    return updatedUser;
  }

  /**
   * @description deletes a user
   * @param {*} id
   * @returns
   */
  static async deleteUser(id) {
    const response = await USER_MODEL.deleteOne({ _id: id });

    if (response.acknowledged === true && response.deletedCount === 0) {
      throw new Error("No such user");
    }
    return response;
  }
}

module.exports = UserService;
