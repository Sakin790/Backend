import dotenv from "dotenv";
import ConnectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});

ConnectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server in running at PORT : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connecion Error!!!", "from root index file", err);
  });

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

