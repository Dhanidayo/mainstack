require("./config");
const express = require("express");
const connectDB = require("./config/db-config");
const apiv1Routes = require("./routes/index");

const app = express();

const configureApp = () => {
  //middleware
  app.use(express.json());
  app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
  });

  //routes
  app.use("/api/v1", apiv1Routes);

  app.use((err, req, res, next) => {
    if (err) {
      res.status(500).json({
        status: err.status,
        message: err.message,
      });
    }
  });

  app.get("/", (req, res) => {
    res.send(
      "Welcome to Sarah Adebesin's Backend Engineer Test for MainStack."
    );
  });

  return app;
};

module.exports = configureApp;