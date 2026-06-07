import { useEffect, useState } from "react";
import axios from "axios";

function SignatureViewer() {
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    fetchSignatures();
  }, []);

  const fetchSignatures = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/signature/all"
      );

      setSignatures(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Saved Signatures</h1>

      {signatures.map((sig) => (
        <div key={sig._id}>
          <img
            src={sig.signatureImage}
            alt="Signature"
            width="300"
          />

          <hr />
        </div>
      ))}
    </div>
  );
}

export default SignatureViewer;