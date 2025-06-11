require("dotenv").config(); // load .env
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Routes
const studentRoutes = require("./students");
const authRoutes = require("./auth");

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);

// Start server
app.listen(3001, () => {
  console.log("Serveris darbojas uz porta 3001");
});
