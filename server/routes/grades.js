const express = require("express");
const router = express.Router();
const db = require("../db"); // ceļš uz tavu MySQL savienojumu

// Pievienot atzīmi
router.post("/add", (req, res) => {
  const { student_id, subject, grade } = req.body;

  if (!student_id || !subject || !grade) {
    return res.status(400).json({ error: "Nepilnīgi dati" });
  }

  const sql = `
    INSERT INTO grades (student_id, subject, grade, date)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(sql, [student_id, subject, grade], (err, result) => {
    if (err) {
      console.error("Kļūda ievietojot atzīmi:", err);
      return res.status(500).json({ error: "Servera kļūda" });
    }
    res.status(200).json({ message: "Atzīme pievienota veiksmīgi" });
  });
});

module.exports = router;
