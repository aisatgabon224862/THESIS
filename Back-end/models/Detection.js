import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      default: "Unknown",
    },

    studentID: {
      type: String,
      default: "",
    },

    item: {
      type: String,
      default: "Metal Detected",
    },

    location: {
      type: String,
      default: "Entrance",
    },

    status: {
      type: String,
      enum: ["Detected", "Confiscated", "Resolved"],
      default: "Detected",
    },

    date: {
      type: String,
    },

    time: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Detection", detectionSchema);
