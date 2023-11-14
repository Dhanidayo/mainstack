import { Document, Model } from "mongoose";

export interface User extends Document {
  username: string;
  password: string;
  email: string;
}

export interface UserInterfaceForStaticMethods extends Model<User> {
  signup(username: string, email: string, password: string): Promise<User>;
  login(email: string, password: string): Promise<User>;
}
