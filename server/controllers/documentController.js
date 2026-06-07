const Document = require("../models/Document");

const uploadDocument = async (req, res) => {
  try {
    const document = await Document.create({
      fileName: req.file.originalname,
      filePath: req.file.path.replace(/\\/g, "/"),
      uploadedBy: req.body.userName,
    });

    res.status(201).json({
      message: "Document Uploaded Successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
};