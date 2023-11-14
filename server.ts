import configureApp from "./src/app";
import connectDB from "./src/config/db-config";
import { Express } from "express";
import { Server } from "http";

const port: number = parseInt(process.env.PORT || "9030", 10);

let server: Server;

export const startServer = async (): Promise<{ app: Express; server: Server }> => {
  try {
    const app = configureApp();

    await connectDB();

    server = app.listen(port, "0.0.0.0", () => {
      console.log("Server connected on PORT:", port);
    });

    return { app, server };
  } catch (error) {
    throw new Error(`Error starting server: ${error}`);
  }
};

export const closeServer = async (server: Server | undefined): Promise<void> => {
  if (server) {
    server.close();
  }
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error("Error during server startup", err);
    process.exit(1);
  });
}
