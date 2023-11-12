const mongoose = require("mongoose");

const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI;

const connectDB = async () => {
  try {
    mongoose.connect(MONGO_URI);

    const db = mongoose.connection;

    db.on("connected", () => {
      console.log("Connected to the DB");
    });

    db.on("error", (err) => {
      console.error("Error connecting to the DB:", err);
    });

    db.once("open", () => {
      console.log("DB Connection Open", MONGO_URI);
    });

    db.on("disconnected", () => {
      console.log("DB Connection Disconnected");
    });

    db.on("reconnected", () => {
      console.log("DB Connection Reconnected");
    });

    db.on("timeout", () => {
      console.log("DB Connection Timed out");
    });
  } catch (error) {
    console.error("Error connecting to the DB:", err);
  }
};

module.exports = connectDB;
