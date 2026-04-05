import StudentSchema from "../SCHEMA/StudentSchema.js";

const RegisterStudent = async (req, res) => {
  try {
    const { name, address, contact, email, studentID, yearLevel, Status } =
      req.body;

    const registered = await StudentSchema.create({
      name,
      address,
      contact,
      email,
      studentID,
      yearLevel,
      Status,
    });
    res.status(200).json({ message: "Registered Succeed", registered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const ViewStudents = async (req, res) => {
  try {
    const data = await StudentSchema.find({});
    if (data.length === 0) {
      return res.status(400).json({ message: "no students found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await StudentSchema.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!data) {
      res.status(404).json({ message: "student not found" });
    }
    res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export { RegisterStudent, ViewStudents, updateStudent };
