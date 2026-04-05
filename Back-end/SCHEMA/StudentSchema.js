import mongoose, { mongo } from "mongoose";

const StudentDesign = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    studentID: { type: String, required: true, unique: true },
    yearLevel: { type: String, required: true },
    Status: { type: String, default: "Active", enum: ["Active", "Not Active"] },
  },
  { timestamps: true },
);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentDesign);
