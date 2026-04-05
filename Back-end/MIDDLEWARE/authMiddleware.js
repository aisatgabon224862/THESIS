import jwt from "jsonwebtoken";

const loginUser = (req, res, next) => {
  try {
    const authHeader = req.header.authorization;
    if (!authHeader)
      return res.status(400).json({ message: "no token provided" });
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = verify;
    next();
  } catch (error) {
    res.status(500).json({
      message: message.error,
    });
  }
};

export default loginUser;
