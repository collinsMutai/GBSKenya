const express = require("express");

const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", requireAuth, getMe);

router.post("/logout", requireAuth, logout);

module.exports = router;
