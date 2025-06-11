const express = require("express");
const router = express.Router();
const db = require("../db");


// 📥 Iegūt visus skolēnus
router.get("/", (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Kļūda iegūstot skolēnus" });
    res.json(results);
  });
});

// ➕ Pievienot skolēnu
router.post("/add", (req, res) => {
  const { first_name, last_name } = req.body;
  if (!first_name || !last_name) {
    return res.status(400).json({ message: "Nepieciešams vārds un uzvārds" });
  }

  const sql = "INSERT INTO students (first_name, last_name) VALUES (?, ?)";
  db.query(sql, [first_name, last_name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: "Skolēns pievienots!", id: result.insertId });
  });
});

module.exports = router;
