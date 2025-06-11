const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔐 REGISTER
// 🔐 REGISTER
router.post("/register", async (req, res) => {
    const { username, password, role, code } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: "Nepilnīgi dati" });
    }
  
    // Atļaut pirmo skolotāju bez koda
    const checkSql = "SELECT COUNT(*) AS count FROM users WHERE role = 'teacher'";
    db.query(checkSql, async (err, result) => {
      if (err) return res.status(500).json({ error: "Servera kļūda" });
  
      const teacherCount = result[0].count;
      const validCode = "0002"; // ← šo aizvieto ar savu īsto kodu
  
      if (role === "teacher" && teacherCount > 0 && code !== validCode) {
        return res.status(403).json({ error: "Nepareizs reģistrācijas kods" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertSql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  
      db.query(insertSql, [username, hashedPassword, role], (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Lietotājvārds jau eksistē" });
          return res.status(500).json({ error: "Servera kļūda" });
        }
        res.json({ message: "Lietotājs reģistrēts!" });
      });
    });
  });
  
// 🔐 LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "DB kļūda" });
    if (results.length === 0) return res.status(401).json({ error: "Nepareizs lietotājvārds" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Nepareiza parole" });

    const token = jwt.sign({ id: user.id, role: user.role }, "slepenaatslega", { expiresIn: "1h" });
    res.json({ token, role: user.role });
  });
});

module.exports = router;
