import { useEffect, useState } from "react";
import axios from "axios";

function Viewer() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getDocuments();
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

  return (
    <div>
      <h1>All Documents</h1>

      {documents.length === 0 ? (
        <p>No Documents Found</p>
      ) : (
        documents.map((doc) => (
          <div key={doc._id}>
            <h3>{doc.fileName}</h3>

            <a
              href={`http://localhost:5000/${doc.filePath}`}
              target="_blank"
              rel="noreferrer"
            >
              View PDF
            </a>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Viewer;