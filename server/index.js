import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";
import router from "./router.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use("/storage", express.static("storage"));

const PORT = 5000;

connectDB();

app.use("/un", router);

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
