const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db"); // db ir mysql2 connection pool
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// === REGISTER ===
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Nepieciešams lietotājvārds un parole." });
  }

  db.query("SELECT id FROM users WHERE username = ?", [username], (err, results) => {
    if (err) {
      console.error("DB select error:", err);
      return res.status(500).json({ error: "Kļūda datubāzē." });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "Lietotājvārds jau aizņemts." });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Hashing error:", err);
        return res.status(500).json({ error: "Kļūda šifrējot paroli." });
      }

      db.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashedPassword, "student"],
        (err, result) => {
          if (err) {
            console.error("DB insert error:", err);
            return res.status(500).json({ error: "Kļūda reģistrējot lietotāju." });
          }

          res.status(201).json({ message: "Reģistrācija veiksmīga", userId: result.insertId });
        }
      );
    });
  });
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
