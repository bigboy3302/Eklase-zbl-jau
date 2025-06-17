require("dotenv").config(); // .env tiek ielādēts
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db"); // db ir mysql2 connection pool
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// === REGISTER ===
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Obligāti jāievada username un password" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, 'student')",
      [username, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Neizdevās reģistrēt lietotāju" });
        res.status(201).json({ message: "Reģistrācija veiksmīga" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Servera kļūda" });
  }
});
// === LOGIN ===
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Nepieciešams lietotājvārds un parole." });
  }

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) {
      console.error("DB select error:", err);
      return res.status(500).json({ error: "Kļūda pieslēdzoties." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Nepareizs lietotājvārds vai parole." });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: "Nepareizs lietotājvārds vai parole." });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

      res.json({
        message: "Veiksmīga pieteikšanās",
        token,
        user: { id: user.id, username: user.username, role: user.role },
      });
    });
  });
});

module.exports = router;
