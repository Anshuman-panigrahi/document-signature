import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function SignatureViewer() {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignatures();
  }, []);

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/api/signature/all"
      );
      setSignatures(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSignature = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/signature/delete/${id}`
      );

      fetchSignatures();

      alert("Signature Deleted Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete signature");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 rounded bg-indigo-500 block"></span> Saved Signatures
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Manage your collection of drawn digital signatures ready for use on documents.
            </p>
          </div>
          <Link
            to="/signature"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-indigo-600/15 cursor-pointer"
          >
            <span>+</span> Draw New Signature
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm">Loading signatures...</p>
          </div>
        ) : signatures.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl p-16 text-center bg-slate-900/10">
            <span className="text-4xl block mb-4">✍️</span>
            <h3 className="text-lg font-bold text-white mb-1">No Signatures Stored</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">
              You haven't drawn or saved any signatures yet. Create a signature first to sign documents.
            </p>
            <Link
              to="/signature"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              Draw Signature
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {signatures.map((sig) => (
              <div
                key={sig._id}
                className="bg-[#0f172a]/60 backdrop-blur border border-slate-850 rounded-xl p-5 hover:border-indigo-500/40 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: #{sig._id.slice(-6)}
                    </span>
                    <span className="text-[9px] text-indigo-400 font-semibold uppercase bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>

                  {/* Draw container - white bg to make transparency visible */}
                  <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-center border border-slate-200 aspect-[5/2] mb-4 overflow-hidden shadow-inner group-hover:scale-[1.01] transition-transform">
                    <img
                      src={sig.signatureImage}
                      alt="Digital Signature"
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between gap-3 text-slate-500 text-[10px]">
                    <span>Saved: {new Date(sig.createdAt).toLocaleDateString()}</span>
                    <Link
                      to="/sign-document"
                      className="px-3 py-1 rounded bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/20 transition-all cursor-pointer text-xs"
                    >
                      Use to Sign
                    </Link>
                  </div>
                  
                  <button
                    onClick={() => deleteSignature(sig._id)}
                    className="w-full py-1.5 rounded bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs font-semibold text-center transition-all cursor-pointer"
                  >
                    Delete Signature
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SignatureViewer;