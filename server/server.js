const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars FIRST before anything else
dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const signatureRoutes = require("./routes/signatureRoutes");
const auditRoutes = require("./routes/auditRoutes");

const app = express();

// CORS - explicitly allow Vercel frontend
app.use(
  cors({
    origin: [
      "https://document-signature-seven.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Health check - responds even if DB is down
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Document Signature API Running",
  });
});

app.use("/api/auth", authRoutes);

app.use(
  "/api/documents",
  documentRoutes
);

app.use(
  "/api/signature",
  signatureRoutes
);

app.use(
  "/api/audit",
  auditRoutes
);

const PORT = process.env.PORT || 5000;

// Start server FIRST, then connect to DB
// This prevents Render from marking the service as failed if DB is slow
const startServer = async () => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Connect to DB after server is listening
  try {
    await connectDB();
    console.log("==> Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    // Don't exit - keep server running so Render doesn't restart in a loop
    console.error("Server is running but database is not connected.");
    console.error("Requests requiring DB will fail until connection is restored.");
  }
};

startServer();