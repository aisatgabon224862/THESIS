import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: String,
    Status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },
  },
  { timestamps: true },
);

const attendance = mongoose.model("Attendance", attendanceSchema);
export default attendance;
