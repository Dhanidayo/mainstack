import UserService from "../services/user";
import { Request, Response, NextFunction } from "express";

/**
 * @description gets the list of existing users
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await UserService.getUsers();

    res.status(200).json({
      message: "Users fetched successfully",
      totalNumberOfUsers: data?.length,
      data,
    });
  } catch (error: any) {
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
export const getAUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId: string = req.params.userId;

  try {
    const data = await UserService.getUserById(userId);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error: any) {
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
export const updateAUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.params.userId;

  try {
    const data = await UserService.updateUser(req.body, userId);

    res.status(200).json({ message: "User info updated successfully", data });
  } catch (error: any) {
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
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.params.userId;

  try {
    const response = await UserService.deleteUser(userId);

    res.status(200).json({ message: "User deleted successfully", response });
  } catch (error: any) {
    if (error.message === "No such user") {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};
