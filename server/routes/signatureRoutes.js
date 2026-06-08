const express = require("express");
const router = express.Router();

const {
  saveSignature,
  getSignatures,
  deleteSignature,
} = require("../controllers/signatureController");

// Save Signature
router.post("/save", saveSignature);

// Get All Signatures
router.get("/all", getSignatures);

// Delete Signature
router.delete("/delete/:id", deleteSignature);

module.exports = router;