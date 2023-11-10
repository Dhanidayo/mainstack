require('./src/config');
const express = require("express");
const connectDB = require("./src/config/db-config");
const apiv1Routes = require("./src/routes/index");

const app = express();

const port = process.env.PORT;

//middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use('/api/v1', apiv1Routes);

app.get("/", (req, res) => {
  res.send("Welcome to Sarah Adebesin's Backend Engineer Test for MainStack.");
});

connectDB().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log("Server connected on PORT:", port);
  });
});
