const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    documentName: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      default: "SIGNED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Audit",
  auditSchema
);