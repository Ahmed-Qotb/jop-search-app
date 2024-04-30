import express from "express";
import { connectDB } from "./db/connection.js";
import dotenv from "dotenv";
import userRouter from "./src/modules/User/User.routers.js";
import companeyRouter from "./src/modules/Company/Company.routers.js";
import jopRouter from "./src/modules/Job/Job.routers.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
// ? parse
app.use(express.json());

app.listen(port, () =>
  console.log(`Jop search app listening at http://localhost:${port}`)
);

// ? db connection
await connectDB();

// ! apis

// ? componey apis
app.use("/companey", companeyRouter);

// ? jop apis
app.use("/jop", jopRouter);

// ? user apis
app.use("/user", userRouter);

// ? global error handler
app.use((error, req, res, next) => {
  return res.json({
    succes: false,
    message: error.message,
    stack: error.stack,
  });
});

// ? not found page handler
app.all("*", (req, res, next) => {
  return res.json({ success: false, message: "page not found" });
});
