import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  name: String,
  studentId: String,
  faceDescriptor: [Number],
});
