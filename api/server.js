require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 2005;
const cors = require("cors");

// Import routes
const phraseRoute = require("../routes/phrase");
// Allowed CORS origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://node-connector-gules.vercel.app/",
  "https://node-connector-b83l.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Test route hit");
  res.send("Hello world!");
});

app.use("/api", phraseRoute);

module.exports = app;
