import dotenv from "dotenv";
import ConnectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

ConnectDB();








/*
import { express } from "express";
const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    app.on("Error", (error) => {
      console.log(error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on Port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Database Connection Error", error);
    throw err;
  }
})();
*/
