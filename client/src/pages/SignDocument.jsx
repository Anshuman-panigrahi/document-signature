import { useEffect, useState } from "react";
import axios from "axios";
import { downloadSignedPdf } from "../services/pdfService";

function SignDocument() {
  const [documents, setDocuments] = useState([]);
  const [signatures, setSignatures] = useState([]);

  const [selectedPdf, setSelectedPdf] =
    useState("");

  const [selectedSignature, setSelectedSignature] =
    useState("");

  useEffect(() => {
    getDocuments();
    getSignatures();
  }, []);

  const getDocuments = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/documents/all"
      );

      setDocuments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSignatures = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/signature/all"
      );

      setSignatures(data);
    } catch (error) {
      console.log(error);
    }
  };

  const applySignature = async () => {
    try {
      if (!selectedPdf) {
        alert("Please Select PDF");
        return;
      }

      if (!selectedSignature) {
        alert("Please Select Signature");
        return;
      }

      const pdf = documents.find(
        (doc) => doc._id === selectedPdf
      );

      const signature = signatures.find(
        (sig) => sig._id === selectedSignature
      );

      await downloadSignedPdf(
        `http://localhost:5000/${pdf.filePath}`,
        signature.signatureImage
      );

      alert("Signed PDF Downloaded");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Sign PDF Document</h1>

      <br />

      <h3>Select PDF</h3>

      <select
        value={selectedPdf}
        onChange={(e) =>
          setSelectedPdf(e.target.value)
        }
      >
        <option value="">
          Select PDF
        </option>

        {documents.map((doc) => (
          <option
            key={doc._id}
            value={doc._id}
          >
            {doc.fileName}
          </option>
        ))}
      </select>

      <br />
      <br />

      <h3>Select Signature</h3>

      <select
        value={selectedSignature}
        onChange={(e) =>
          setSelectedSignature(
            e.target.value
          )
        }
      >
        <option value="">
          Select Signature
        </option>

        {signatures.map((sig) => (
          <option
            key={sig._id}
            value={sig._id}
          >
            Signature {sig._id.slice(-5)}
          </option>
        ))}
      </select>

      <br />
      <br />
      <br />

      <button onClick={applySignature}>
        Apply Signature
      </button>
    </div>
  );
}

export default SignDocument;