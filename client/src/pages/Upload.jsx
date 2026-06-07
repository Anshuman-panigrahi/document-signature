import { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [userName, setUserName] = useState("");

  const uploadHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    if (!userName.trim()) {
      alert("Please enter your name");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("userName", userName);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData
      );

      alert(data.message);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div>
      <h1>Upload Document</h1>

      <form onSubmit={uploadHandler}>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) =>
            setUserName(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <button type="submit">
          Upload
        </button>
      </form>
    </div>
  );
}

export default Upload;