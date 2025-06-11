const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "grade_viewer"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Kļūda pieslēdzoties datubāzei:", err.message);
  } else {
    console.log("✅ Pieslēgts MySQL datubāzei");
  }
});

module.exports = db;
