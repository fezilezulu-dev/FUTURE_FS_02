const express = require("express");
const router = express.Router();

const {
  loginUser,
  createAdmin,
} = require("../controllers/authController");

router.post("/login", loginUser);
router.post("/create-admin", createAdmin);

module.exports = router;