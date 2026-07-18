import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Adminrouter from "./ROUTES/AdminRoutes.js";
import UserRoutes from "./ROUTES/UserRoutes.js";
import AttendanceRouter from "./ROUTES/AttendanceRoutes.js";
import detectionRoutes from "./ROUTES/detectionRoutes.js";
import ReportRoutes from "./ROUTES/ReportRoutes.js";

import { getMetalStatus } from "./serial.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hei");
});
app.use("/api/reports", ReportRoutes);
app.get("/api/metal-status", (req, res) => {
  res.json({
    status: getMetalStatus(),
  });
});

app.use("/api/detections", detectionRoutes);

app.use("/admin/create", Adminrouter);

app.use("/api/students", UserRoutes);

app.use("/attendance", AttendanceRouter);

mongoose
  .connect(process.env.Connection)

  .then(() => {
    console.log("connection succesfully");
  })

  .catch((error) => {
    console.log("connection failed", error);
  });

app.listen(PORT, () => {
  console.log(`app listening to ${PORT}`);
});
