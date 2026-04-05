import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Adminrouter from "./ROUTES/AdminRoutes.js";
import UserRoutes from "./ROUTES/UserRoutes.js";
import AttendanceRouter from "./ROUTES/AttendanceRoutes.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hei");
  console.log("someone visited");
});

app.use("/admin/create", Adminrouter);
app.use("/api/students", UserRoutes);
app.use("/attendance", AttendanceRouter);

mongoose
  .connect(process.env.Connection)
  .then(() => console.log("connection succesfully"))
  .catch(() => console.log("connection failed"));

app.listen(PORT, () => {
  console.log(`app listening to ${PORT}`);
});
