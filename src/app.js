import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
 
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);



app.use(express.json({ limit: "15kb" })); // json accepted
app.use(express.urlencoded({ extended, limit: "15kb" })); // URL theke data recive
app.use(express.static("public"));
app.use(cookieParser());

export { app };
