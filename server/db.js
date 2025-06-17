const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "grade_viewer",
});

db.connect((err) => {
  if (err) {
    console.error("DB savienojuma kļūda:", err);
    process.exit(1);
  }
  console.log("✅ Savienojums ar DB izveidots");
});

module.exports = db;
