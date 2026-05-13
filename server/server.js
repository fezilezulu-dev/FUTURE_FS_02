const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");
const bcrypt = require("bcrypt");

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// create admin
const createAdminUser = async () => {
  const existingUser = await User.findOne({ email: "admin@gmail.com" });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      email: "admin@gmail.com",
      password: hashedPassword,
    });

    console.log("Admin user created: admin@gmail.com / 123456");
  }
};

createAdminUser();

// routes (ONLY AFTER app is created)
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.get("/", (req, res) => {
  res.send("Mini CRM API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});