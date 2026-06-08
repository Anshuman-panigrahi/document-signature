const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  uploadDocument,
  getDocuments,
  deleteDocument,
} = require("../controllers/documentController");

router.post(
  "/upload",
  upload.single("document"),
  uploadDocument
);

router.get("/all", getDocuments);

router.delete(
  "/delete/:id",
  deleteDocument
);

router.get("/test", (req, res) => {
  res.json({
    message: "Document Route Working",
  });
});

module.exports = router;