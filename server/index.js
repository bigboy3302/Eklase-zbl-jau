const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const studentRoutes = require("./routes/students");
const authRoutes = require("./routes/auth");

// Middleware (pats svarīgākais vispirms)
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Maršruti
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);

// Server start
app.listen(3001, () => {
  console.log("Serveris darbojas uz porta 3001");
});
