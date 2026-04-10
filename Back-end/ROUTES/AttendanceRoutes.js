import express from "express";
import {
  initializeStudents,
  barcodeScanner,
  getAttendance,
  getWeeklyAttendance,
  getAllAttendance,
} from "../CONTROLLERS/ScanApi.js";
const router = express.Router();

router.post("/api/scan", barcodeScanner);
router.get("/api/view", getAttendance);
router.get("/api/init", initializeStudents);
router.get("/api/weekly", getWeeklyAttendance);
router.get("/api/all", getAllAttendance);
export default router;
