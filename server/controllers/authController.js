const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
};

// CREATE ADMIN
const createAdmin = async (req, res) => {
  const existing = await User.findOne({ email: "admin@gmail.com" });

  if (existing) {
    return res.json({ message: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash("123456", 10);

  await User.create({
    email: "admin@gmail.com",
    password: hashedPassword,
  });

  res.json({ message: "Admin created" });
};

module.exports = {
  loginUser,
  createAdmin,
};