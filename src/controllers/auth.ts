
import { Request, Response } from "express";
import UserModel from "../db/models/user";
import { createToken } from "../utils";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const user = await UserModel.signup(username, email, password);

    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { username, email, token, id: user._id },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { username: user.username, email, token, id: user._id },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
