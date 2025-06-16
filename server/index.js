const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

// Viduslānis (middleware)
app.use(cors());
app.use(express.json());

// MySQL pieslēgums
const db = require("./db");
const profileRoutes = require("./routes/profile");
app.use("/profile", profileRoutes);
app.use("/avatars", express.static("uploads/avatars"));

// Importē un lieto maršrutus
const gradesRoute = require("./routes/grades");
app.use("/grades", gradesRoute);

// (Nepieciešams arī students, users utt. maršrutiem)
const studentsRoute = require("./routes/students");
app.use("/students", studentsRoute);

const authRoute = require("./routes/auth");
app.use("/auth", authRoute);

// Saknes maršruts
app.get("/", (req, res) => {
  res.send("✅ Serveris darbojas!");
});

// Startē serveri
app.listen(port, () => {
  console.log(`🚀 Serveris darbojas: http://localhost:${port}`);
});
