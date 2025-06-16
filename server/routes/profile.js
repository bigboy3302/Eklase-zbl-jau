const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

// Failu augšupielādes konfigurācija
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/avatars"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, "")}`),
});
const upload = multer({ storage });

// ✅ GET - profila dati
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT id, username, birth_year, avatar FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return res.status(500).send("DB kļūda");
    res.json(result[0]);
  });
});

// ✅ PUT - atjauno datus
router.put("/:id", upload.single("avatar"), (req, res) => {
  const userId = req.params.id;
  const { birth_year, password } = req.body;
  let updateQuery = "UPDATE users SET birth_year = ?, password = ?" + (req.file ? ", avatar = ?" : "") + " WHERE id = ?";
  const params = req.file
    ? [birth_year, password, `/avatars/${req.file.filename}`, userId]
    : [birth_year, password, userId];

  db.query(updateQuery, params, (err) => {
    if (err) return res.status(500).send("Kļūda saglabājot");
    res.send("Dati atjaunoti!");
  });
});

module.exports = router;
