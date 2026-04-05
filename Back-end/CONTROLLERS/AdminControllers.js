import Admin from "../SCHEMA/Admin.js";
import bcrypt from "bcrypt";
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const find = await Admin.findOne({ email });
    if (find) return res.status(404).json({ message: "email already exist" });
    const hash = await bcrypt.hash(password, 10);
    const saved = await Admin.create({
      email,
      password: hash,
    });
    res.status(200).json({ message: "account succesfully created", email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default createAdmin;
