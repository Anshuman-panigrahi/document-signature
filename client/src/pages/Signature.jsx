import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";

function Signature() {
  const sigRef = useRef();

  const clearSignature = () => {
    sigRef.current.clear();
  };

  const saveSignature = async () => {
    const signatureImage =
      sigRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/signature/save",
        {
          signatureImage,
        }
      );

      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Create Signature</h1>

      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          width: 500,
          height: 200,
          className: "sigCanvas",
        }}
      />

      <br />
      <br />

      <button
        onClick={clearSignature}
        style={{ marginRight: "10px" }}
      >
        Clear
      </button>

      <button onClick={saveSignature}>
        Save Signature
      </button>
    </div>
  );
}

export default Signature;