import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Viewer() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocuments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/api/documents/all"
      );
      setDocuments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoc = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/documents/delete/${id}`
      );

      getDocuments();

      alert("Document Deleted");
    } catch (error) {
      console.log(error);
      alert("Failed to delete document");
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 rounded bg-indigo-500 block"></span> Document Vault
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Browse, view, and select uploaded PDF files to apply digital signatures.
            </p>
          </div>
          <Link
            to="/upload"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-indigo-600/15 cursor-pointer"
          >
            <span>+</span> Upload New PDF
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl p-16 text-center bg-slate-900/10">
            <span className="text-4xl block mb-4">📁</span>
            <h3 className="text-lg font-bold text-white mb-1">No Documents Found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">
              You haven't uploaded any PDF files yet. Get started by uploading your first document.
            </p>
            <Link
              to="/upload"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              Go to Upload
            </Link>
          </div>
        ) : (
          <>
            {/* Search Input Box */}
            <div className="mb-8 max-w-md">
              <input
                type="text"
                placeholder="Search PDF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0f172a]/60 backdrop-blur border border-slate-850 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm shadow-inner"
              />
            </div>

            {filteredDocs.length === 0 ? (
              <div className="border border-slate-850 rounded-2xl p-16 text-center bg-slate-900/10">
                <span className="text-3xl block mb-3">🔍</span>
                <h3 className="text-lg font-bold text-white mb-1">No Matches Found</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  We couldn't find any documents matching your search term: "{search}".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc._id}
                    className="bg-[#0f172a]/60 backdrop-blur border border-slate-850 rounded-xl p-5 hover:border-indigo-500/40 hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg">
                          📄
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          PDF
                        </span>
                      </div>
                      <h3 className="text-slate-200 font-bold text-sm tracking-tight mb-2 truncate group-hover:text-white transition-colors" title={doc.fileName}>
                        {doc.fileName}
                      </h3>
                      <p className="text-slate-500 text-[10px] mb-4">
                        Uploaded: {new Date(doc.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-3">
                        <a
                          href={`http://localhost:5000/${doc.filePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium text-center transition-all cursor-pointer"
                        >
                          View Document
                        </a>
                        <Link
                          to="/sign-document"
                          className="flex-1 py-2 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold text-center transition-all cursor-pointer"
                        >
                          Sign PDF
                        </Link>
                      </div>
                      
                      <button
                        onClick={() => deleteDoc(doc._id)}
                        className="w-full py-2 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs font-semibold text-center transition-all cursor-pointer"
                      >
                        Delete PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Viewer;