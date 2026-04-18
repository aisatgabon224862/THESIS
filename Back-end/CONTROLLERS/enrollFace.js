import StudentSchema from "../SCHEMA/StudentSchema.js";

const enrollFace = async (req, res) => {
  try {
    const { studentID, descriptor } = req.body;
    if (!studentID || !descriptor) {
      return res.status(400).json({ message: "Missing Data" });
    }
    const student = await StudentSchema.findOne({ studentID });
    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
    }
    student.faceDescriptor = descriptor;
    await student.save();
    res.status(201).json({ message: "Student successfully enrolled" });
  } catch (error) {
    res.statuts(500).json({ message: error.message });
  }
};

export default enrollFace;
