import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../SCHEMA/Admin.js";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "invalid email or password" });
    const pass = await bcrypt.compare(password, user.password);
    if (!pass)
      return res.status(400).json({ message: "invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    res.status(200).json({ token });
  } catch (error) {}
};
export default loginUser;
