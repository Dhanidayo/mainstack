import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../db/models/user";
import { MyJwtPayload } from "../db/interfaces/myJwtPayload";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: "Authorization token required" });
    return;
  }

  const token = (authorization as string).split(" ")[1];

  try {
    if (!process.env.SECRET_PASS) {
      throw new Error("SECRET_PASS is not defined in environment variables");
    }

    const { _id } = jwt.verify(
      token,
      process.env.SECRET_PASS
    ) as unknown as MyJwtPayload;

    req.user = await UserModel.findOne({ _id }).select("_id");

    if (!req.user) {
      res.status(401).json({
        error: "Unrecognized user. Please register/login to continue.",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

