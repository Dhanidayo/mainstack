require("./config");
import express, { Request, Response, NextFunction } from 'express';
import apiv1Routes from "./routes/index";

const app = express();

const configureApp = () => {
  //middleware
  app.use(express.json());
  app.use((req, _res, next) => {
    console.log(req.path, req.method);
    next();
  });

  //routes
  app.use("/api/v1", apiv1Routes);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err) {
      res.status(500).json({
        status: err.status,
        message: err.message,
      });
    }
  });

  app.get("/", (_req, res) => {
    res.send(
      "Welcome to Sarah Adebesin's Backend Engineer Test for MainStack."
    );
  });

  return app;
};

export default configureApp;