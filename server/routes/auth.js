const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // <- pārliecinies, ka tiek ielādēts .env

const router = express.Router();

const ADMIN_CODE = process.env.ADMIN_CODE || "default_admin_code";
const TEACHER_CODE = process.env.TEACHER_CODE || "default_teacher_code";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// === REGISTER ===
router.post("/register", async (req, res) => {
  const { username, password, role, code } = req.body;

  if (!username || !password || !role || !code) {
    return res.status(400).json({ error: "Nepilnīgi dati reģistrācijai." });
  }

  if (role === "admin" && code !== ADMIN_CODE) {
    return res.status(403).json({ error: "Nepareizs administrators kods." });
  }

  if (role === "teacher" && code !== TEACHER_CODE) {
    return res.status(403).json({ error: "Nepareizs skolotāja kods." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );

    res.status(201).json({ message: "Lietotājs reģistrēts", userId: result.insertId });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Kļūda reģistrējot lietotāju." });
  }
});

// === LOGIN ===
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Nepareizs lietotājvārds vai parole." });
    }

    const user = rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Nepareizs lietotājvārds vai parole." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Veiksmīga pieteikšanās",
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Kļūda pieslēdzoties." });
  }
});

module.exports = router;
