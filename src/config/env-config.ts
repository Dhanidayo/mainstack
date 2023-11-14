import path from "path";
import * as dotenv from 'dotenv';

dotenv.config();

// load environment variables if in development or test mode
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, ".env") });
}
