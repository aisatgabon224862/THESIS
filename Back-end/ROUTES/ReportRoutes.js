import express from "express";

import {
  generateSecurityPDF,
  generateSecurityExcel,
} from "../CONTROLLERS/ReportController.js";

const router = express.Router();

router.get("/security/pdf", generateSecurityPDF);

router.get("/security/excel", generateSecurityExcel);

export default router;
