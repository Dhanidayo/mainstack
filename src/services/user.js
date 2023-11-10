const User = require("../db/models/user");

class UserService {
  static async getUsers() {
    const users = await User.find().sort({ _id: -1 });

    if (users.length === 0) {
      throw new Error("No users found");
    }

    return users;
  }

  static async getUserById(id) {
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw Error("No user found");
    }
    return user;
  }

  static async updateUser(data, id) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new Error("Unknown User Id");
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    return updatedUser;
  }

  static async deleteUser(id) {
    const response = await User.deleteOne({ _id: id });
    console.log("Deleted", response);
    if (response.acknowledged === true) {
      return response;
    }
  }
}

module.exports = UserService;
