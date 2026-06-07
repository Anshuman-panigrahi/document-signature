const express = require("express");
const router = express.Router();

const {
  saveSignature,
  getSignatures,
} = require("../controllers/signatureController");

// Save Signature
router.post("/save", saveSignature);

// Get All Signatures
router.get("/all", getSignatures);

module.exports = router;