import { Request, Response, NextFunction } from "express";

export const validateQuery = (isRequired: boolean) => {
  return function (req: Request, res: Response, next: NextFunction) {
    if (isRequired && Object.keys(req.query).length === 0) {
      return res.status(400).json({ error: "Query parameter is required!" });
    }

    const allowedQueries = ["name"];

    const queryParams = Object.keys(req.query);

    const invalidQueries = queryParams.filter(
      (query) => !allowedQueries.includes(query)
    );

    if (invalidQueries.length > 0) {
      return res.status(400).json({
        error: `Invalid query parameter(s): ${invalidQueries.join(", ")}`,
      });
    }
    next();
  };
};
