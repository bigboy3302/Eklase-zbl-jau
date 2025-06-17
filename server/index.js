const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const gradesRoutes = require("./routes/grades");  // Šis vajadzīgs
const db = require("./db");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/grades", gradesRoutes);   // Pievieno šeit

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
