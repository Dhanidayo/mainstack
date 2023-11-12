const configureApp = require("./src/app");
const connectDB = require("./src/config/db-config");

const port = process.env.PORT;

let server;

const startServer = async () => {
  try {
    const app = configureApp();

    await connectDB();

    server = app.listen(port, "0.0.0.0", () => {
      console.log("Server connected on PORT:", port);
    });

    return { app, server };
  } catch (error) {
    throw new Error("Error starting server:", error);
  }
};

const closeServer = async (server) => {
  if (server) {
    await server.close();
  }
};

if (require.main === module) {
  startServer(port).catch((err) => {
    console.error("Error during server startup", err);
    process.exit(1);
  });
}

module.exports = { startServer, closeServer };
