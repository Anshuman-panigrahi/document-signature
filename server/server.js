const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const signatureRoutes = require("./routes/signatureRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use("/api/auth", authRoutes);

app.use(
  "/api/documents",
  documentRoutes
);

app.use(
  "/api/signature",
  signatureRoutes
);

app.get("/", (req, res) => {
  res.send(
    "Document Signature API Running"
  );
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});