const express = require("express");
const router = express.Router();
const db = require("../db");

// Iegūt visus skolēnus
router.get("/", (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Kļūda iegūstot skolēnus" });
    res.json(results);
  });
});

// Pievienot skolēnu ar paroli un avatar URL (nav obligāti)
router.post("/add", (req, res) => {
  const { first_name, last_name, password, avatar_url } = req.body;
  if (!first_name || !last_name || !password) {
    return res.status(400).json({ message: "Nepieciešams vārds, uzvārds un parole" });
  }

  const sqlAddStudent = "INSERT INTO students (first_name, last_name, avatar_url) VALUES (?, ?, ?)";
  db.query(sqlAddStudent, [first_name, last_name, avatar_url || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const studentId = result.insertId;

    // Izveido user kontu skolēnam
    const sqlAddUser = "INSERT INTO users (username, password, role, student_id) VALUES (?, ?, 'student', ?)";
    db.query(sqlAddUser, [first_name.toLowerCase(), password, studentId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Skolēns un lietotājs pievienots!", id: studentId });
    });
  });
});

// Dzēst skolēnu
router.delete("/:id", (req, res) => {
  const studentId = req.params.id;
  const sqlDelUser = "DELETE FROM users WHERE student_id = ?";
  db.query(sqlDelUser, [studentId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const sqlDelStudent = "DELETE FROM students WHERE id = ?";
    db.query(sqlDelStudent, [studentId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Skolēns izdzēsts" });
    });
  });
});

// Rediģēt skolēnu
router.put("/:id", (req, res) => {
  const studentId = req.params.id;
  const { first_name, last_name, avatar_url } = req.body;

  const sql = "UPDATE students SET first_name = ?, last_name = ?, avatar_url = ? WHERE id = ?";
  db.query(sql, [first_name, last_name, avatar_url || null, studentId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Skolēns atjaunināts" });
  });
});

// Pievienot atzīmi skolēnam
router.post("/:id/grades", (req, res) => {
  const studentId = req.params.id;
  const { subject, grade } = req.body;

  if (!subject || !grade) {
    return res.status(400).json({ message: "Nepieciešams priekšmets un atzīme" });
  }

  const sql = "INSERT INTO grades (student_id, subject, grade) VALUES (?, ?, ?)";
  db.query(sql, [studentId, subject, grade], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Atzīme pievienota" });
  });
});

module.exports = router;
