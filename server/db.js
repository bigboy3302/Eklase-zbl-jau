const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // vai cits lietotājs
  password: "root", // parole, ja ir
  database: "grade_viewer" // aizvieto ar savu datubāzes nosaukumu
});

db.connect((err) => {
  if (err) {
    console.error("❌ Kļūda pieslēdzoties DB:", err);
  } else {
    console.log("🟢 Savienojums ar MySQL izdevās!");
  }
});

module.exports = db;
