const { USER_MODEL } = require("../db/models");

class UserService {
  static async getUsers() {
    const users = await USER_MODEL.find().sort({ _id: -1 });

    if (users.length === 0) {
      throw new Error("No users found");
    }

    return users;
  }

  static async getUserById(id) {
    const user = await USER_MODEL.findOne({ _id: id });

    if (!user) {
      throw new Error("No user found");
    }
    return user;
  }

  static async updateUser(data, id) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new Error("Unknown User Id");
    }
    const updatedUser = await USER_MODEL.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    return updatedUser;
  }

  static async deleteUser(id) {
    const response = await USER_MODEL.deleteOne({ _id: id });
    console.log("Deleted", response);
    if (response.acknowledged === true) {
      return response;
    }
  }
}

module.exports = UserService;
