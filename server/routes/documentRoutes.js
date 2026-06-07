const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  uploadDocument,
  getDocuments,
} = require("../controllers/documentController");

router.post(
  "/upload",
  upload.single("document"),
  uploadDocument
);

router.get("/all", getDocuments);

router.get("/test", (req, res) => {
  res.json({
    message: "Document Route Working",
  });
});

module.exports = router;