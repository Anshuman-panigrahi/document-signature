import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Upload() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [file, setFile] = useState(null);
  const [userName, setUserName] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user]);

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
    setUploading(true);

    try {
      const { data } = await API.post(
        "/api/documents/upload",
        formData
      );

      alert(data.message || "Document uploaded successfully!");
      setFile(null);
    } catch (error) {
      alert(error.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-[#0f172a]/60 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <span className="text-3xl">📤</span>
            <h1 className="text-2xl font-extrabold text-white mt-3">Upload Document</h1>
            <p className="text-slate-400 text-xs mt-1">
              Add PDF files to your library so they can be digitally signed.
            </p>
          </div>

          <form onSubmit={uploadHandler} className="space-y-6">
            {/* User Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Uploader's Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Custom File Uploader Layout */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Choose PDF File
              </label>
              <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl bg-slate-900/20 transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer group">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3 group-hover:bg-indigo-600/10 group-hover:text-indigo-400 transition-colors">
                  📄
                </div>
                
                {file ? (
                  <div>
                    <p className="text-indigo-400 font-bold text-sm truncate max-w-md">
                      {file.name}
                    </p>
                    <p className="text-slate-500 text-[10px] mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-300 font-medium text-sm">
                      Click to choose or drag & drop your PDF file
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      PDF files only, up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg text-white flex items-center justify-center gap-2 cursor-pointer ${
                uploading
                  ? "bg-slate-800 border border-slate-700 text-slate-500"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-indigo-500/10"
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
                  Uploading Document...
                </>
              ) : (
                "Upload Document"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Upload;