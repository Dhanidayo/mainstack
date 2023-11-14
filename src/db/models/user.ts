import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import { validateUserInput } from "../../utils/validators";
import { hashPassword } from "../../utils/index";
import { User, UserInterfaceForStaticMethods } from "../interfaces/user";


const userSchema = new mongoose.Schema<User>(
  {
    username: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
    timestamps: true,
  }
);

const UserClass = class extends mongoose.Model<User> {
  // Static methods
  static async signup(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    if (!username || !email || !password) {
      throw new Error("All fields must be filled");
    }

    validateUserInput(username, email, password);

    const exists = await this.findOne({ email });

    if (exists) {
      throw new Error("Email has already been registered");
    }

    const salt = await bcrypt.genSalt(10);

    const hash = await hashPassword(password, salt);

    const user = await this.create({ username, email, password: hash });

    return user;
  }

  static async login(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error("All fields must be filled");
    }

    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Incorrect password");
    }

    return user;
  }
};

userSchema.loadClass(UserClass);

const UserModel = mongoose.model<User, UserInterfaceForStaticMethods>("User", userSchema);

export default UserModel;