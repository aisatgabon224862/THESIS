import express from "express";
const route = express.Router();
import enrollFace from "../CONTROLLERS/enrollFace.js";
import {
  RegisterStudent,
  ViewStudents,
  updateStudent,
} from "../CONTROLLERS/RegistrationControllers.js";

route.post("/register", RegisterStudent);
route.get("/view", ViewStudents);
route.put("/update/:id", updateStudent);
route.post("/enroll-face", enrollFace);

export default route;
