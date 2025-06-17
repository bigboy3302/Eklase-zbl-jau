const db = require("../db"); // Tava MySQL konekcija (nemainās)

// === Ielasa lietotāja profilu pēc ID ===
function getProfile(req, res) {
  const userId = req.url.split("/").pop();

  db.query(
    "SELECT id, username, birth_year, avatar FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) {
        console.error("❌ DB kļūda:", err);
        res.writeHead(500);
        res.end("DB kļūda");
        return;
      }
      if (result.length === 0) {
        res.writeHead(404);
        res.end("Lietotājs nav atrasts");
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result[0]));
    }
  );
}

// === Atjauno profila datus (parole, dzimšanas gads, avatar URL) ===
function updateProfile(req, res) {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const userId = req.url.split("/").pop();
      const { birth_year, password, avatar } = JSON.parse(body);

      const fieldsToUpdate = [];
      const params = [];

      if (birth_year) {
        fieldsToUpdate.push("birth_year = ?");
        params.push(birth_year);
      }

      if (password) {
        fieldsToUpdate.push("password = ?");
        params.push(password);
      }

      if (avatar) {
        fieldsToUpdate.push("avatar = ?");
        params.push(avatar); // Tā ir URL adrese no frontend
      }

      if (fieldsToUpdate.length === 0) {
        res.writeHead(400);
        res.end("Nav datu ko atjaunot");
        return;
      }

      params.push(userId);
      const sql = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

      db.query(sql, params, err => {
        if (err) {
          console.error("❌ Kļūda saglabājot:", err);
          res.writeHead(500);
          res.end("Kļūda saglabājot");
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Profils atjaunots!" }));
        }
      });
    } catch (err) {
      console.error("❌ JSON kļūda:", err);
      res.writeHead(400);
      res.end("Nederīgs pieprasījums");
    }
  });
}

module.exports = {
  getProfile,
  updateProfile,
};
