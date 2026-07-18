import express from "express";

import {
  initializeStudents,
  barcodeScanner,
  getAttendance,
  getWeeklyAttendance,
  getAllAttendance,
  getAttendanceReport,
} from "../CONTROLLERS/ScanApi.js";

const router = express.Router();

router.post("/api/scan", barcodeScanner);

router.get("/api/view", getAttendance);

router.get("/api/init", initializeStudents);

router.get("/api/weekly", getWeeklyAttendance);

router.get("/api/all", getAllAttendance);

router.get("/api/report-summary", getAttendanceReport);

export default router;
