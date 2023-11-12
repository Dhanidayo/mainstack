const configureApp = require("./src/app");
const connectDB = require("./src/config/db-config");

const port = process.env.PORT;

let server;

const startServer = async () => {
  const app = configureApp();

  await connectDB();

  server = app.listen(port, "0.0.0.0", () => {
    console.log("Server connected on PORT:", port);
  });

  return { app, server };
};

const closeServer = async (server) => {
  if (server) {
    await server.close();
  } else {
    console.error("Server is not defined.");
  }
};

if (require.main === module) {
  startServer(port)
    .then(({ app, server }) => {
      console.log(`Server is running on port ${port}`);
    })
    .catch((error) => {
      console.error("Error starting the server:", error);
      process.exit(1);
    });
}

module.exports = { startServer, closeServer };
