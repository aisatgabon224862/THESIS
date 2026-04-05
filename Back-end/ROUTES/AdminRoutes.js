import express from "express";
import createAdmin from "../CONTROLLERS/AdminControllers.js";
import loginUser from "../CONTROLLERS/AdminLogin.js";
const router = express.Router();

router.post("/createloginuser", createAdmin);
router.post("/authloginuser", loginUser);

export default router;
