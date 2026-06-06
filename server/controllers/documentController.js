const Document = require("../models/Document");

const uploadDocument = async (req, res) => {
  try {
    const newDocument = await Document.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: req.body.uploadedBy,
    });

    res.status(201).json({
      message: "File Uploaded Successfully",
      document: newDocument,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
};