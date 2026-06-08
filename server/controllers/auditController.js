const Audit = require("../models/Audit");

const getAuditLogs = async (req, res) => {
  try {
    const logs = await Audit.find().sort({
      createdAt: -1,
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createAuditLog = async (
  req,
  res
) => {
  try {
    const {
      userName,
      documentName,
    } = req.body;

    const log = await Audit.create({
      userName,
      documentName,
      action: "SIGNED",
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAuditLogs,
  createAuditLog,
};