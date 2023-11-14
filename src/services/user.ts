import { User } from "../db/interfaces/user";
import UserModel from "../db/models/user";
import { validateUpdatedUserInput } from "../utils/validators";

class UserService {
  /**
   *
   * @returns a list of all users
   */
  static async getUsers(): Promise<User[]> {
    const users = await UserModel.find().sort({ _id: -1 });

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
  static async getUserById(id: string): Promise<User | null> {
    const user = await UserModel.findOne({ _id: id });

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
  static async updateUser(
    data: Partial<User>,
    id: string
  ): Promise<User | null> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new Error("Unknown User Id");
    }

    const { username, email, password } = data;

    if (!username && !email && !password) {
      return user;
    }

    const updatedFields: Partial<User> = {};

    if (username !== undefined && username !== "") {
      updatedFields.username = username;
    }

    if (email !== undefined && email !== "") {
      updatedFields.email = email;
    }

    if (password !== undefined && password !== "") {
      updatedFields.password = password;
    }

    // Validate updated user input
    await validateUpdatedUserInput(
      updatedFields.username,
      updatedFields.email,
      updatedFields.password
    );

    const updatedUser = await UserModel.findOneAndUpdate(
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
  static async deleteUser(id: string): Promise<any | null> {
    const response = await UserModel.deleteOne({ _id: id });

    if (response.acknowledged && response.deletedCount === 0) {
      throw new Error("No such user");
    }

    return response.deletedCount === 1 ? response : null;
  }
}

export default UserService;
