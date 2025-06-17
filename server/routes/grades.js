const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/add", (req, res) => {
  const { student_id, subject, grade } = req.body;

  if (!student_id || !subject || !grade) {
    return res.status(400).json({ message: "Nepieciešami visi lauki" });
  }

  const sql = "INSERT INTO grades (student_id, subject, grade) VALUES (?, ?, ?)";
  db.query(sql, [student_id, subject, grade], (err, result) => {
    if (err) {
      console.error("❌ Kļūda pievienojot atzīmi:", err);
      return res.status(500).json({ message: "Servera kļūda" });
    }
    res.status(200).json({ message: "Atzīme pievienota" });
  });
});

module.exports = router;
