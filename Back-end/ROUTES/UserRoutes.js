import express from "express";
const route = express.Router();
import {
  RegisterStudent,
  ViewStudents,
  updateStudent,
} from "../CONTROLLERS/RegistrationControllers.js";

route.post("/register", RegisterStudent);
route.get("/view", ViewStudents);
route.put("/update/:id", updateStudent);

export default route;
