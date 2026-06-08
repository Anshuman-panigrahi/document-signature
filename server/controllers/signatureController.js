const Signature = require("../models/Signature");

const saveSignature = async (req, res) => {
  try {
    const { signatureImage } = req.body;

    const signature = await Signature.create({
      signatureImage,
    });

    res.status(201).json({
      message: "Signature Saved Successfully",
      signature,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSignatures = async (req, res) => {
  try {
    const signatures = await Signature.find();
    res.status(200).json(signatures);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteSignature = async (req, res) => {
  try {
    const signature = await Signature.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Signature Deleted",
      signature,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveSignature,
  getSignatures,
  deleteSignature,
};