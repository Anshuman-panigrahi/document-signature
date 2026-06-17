import { useEffect, useState } from "react";
import API from "../services/api";
import { downloadSignedPdf } from "../services/pdfService";
import Navbar from "../components/Navbar";

function SignDocument() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [documents, setDocuments] = useState([]);
  const [signatures, setSignatures] = useState([]);

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedSignature, setSelectedSignature] = useState(null);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    getDocuments();
    getSignatures();
  }, []);

  const getDocuments = async () => {
    try {
      const { data } = await API.get(
        "/api/documents/all"
      );
      setDocuments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSignatures = async () => {
    try {
      const { data } = await API.get(
        "/api/signature/all"
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

      setSigning(true);
      // Normalize backslashes from Windows paths stored in MongoDB
      const normalizedPath = selectedPdf.filePath.replace(/\\/g, "/");
      const pdfUrl = `${API.defaults.baseURL}/${normalizedPath}`;

      await downloadSignedPdf(
        pdfUrl,
        selectedSignature.signatureImage
      );

      const auditorName = user?.name || "Anshuman Panigrahi";

      await API.post(
        "/api/audit/create",
        {
          userName: auditorName,
          documentName: selectedPdf.fileName,
        }
      );

      alert("Signed PDF Downloaded and Audit Saved Successfully!");
    } catch (error) {
      console.log(error);
      alert("Error Signing PDF");
    } finally {
      setSigning(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-indigo-500 block"></span> Sign PDF Document
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Choose a PDF document and one of your saved signatures to digitally seal it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0f172a]/60 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Select PDF Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  1. Select PDF Document
                </label>
                <select
                  onChange={(e) =>
                    setSelectedPdf(
                      documents.find((doc) => doc._id === e.target.value) || null
                    )
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer"
                >
                  <option value="">-- Choose a document --</option>
                  {documents.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.fileName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Signature Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  2. Select Saved Signature
                </label>
                <select
                  onChange={(e) =>
                    setSelectedSignature(
                      signatures.find((sig) => sig._id === e.target.value) || null
                    )
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer"
                >
                  <option value="">-- Choose a signature --</option>
                  {signatures.map((sig) => (
                    <option key={sig._id} value={sig._id}>
                      Signature #{sig._id.slice(-6)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Button */}
              <button
                onClick={applySignature}
                disabled={signing}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg text-white flex items-center justify-center gap-2 cursor-pointer ${
                  signing
                    ? "bg-slate-800 border border-slate-700 text-slate-500"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-indigo-500/10"
                }`}
              >
                {signing ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
                    Generating Signed Document...
                  </>
                ) : (
                  "Apply Signature & Download PDF"
                )}
              </button>
            </div>
          </div>

          {/* Preview Side */}
          <div className="space-y-6">
            <div className="bg-[#0f172a]/60 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                  Signing Summary
                </h3>

                {/* Selected PDF Info */}
                <div className="mb-6">
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                    Selected Document
                  </span>
                  {selectedPdf ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div className="overflow-hidden">
                        <p className="text-slate-300 font-bold text-xs truncate">
                          {selectedPdf.fileName}
                        </p>
                        <p className="text-slate-500 text-[10px]">
                          Uploaded: {new Date(selectedPdf.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs italic">No document selected</p>
                  )}
                </div>

                {/* Selected Signature Info */}
                <div className="mb-6">
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                    Selected Signature
                  </span>
                  {selectedSignature ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center">
                      <div className="bg-slate-50 rounded-lg p-2 max-h-[80px] w-full flex items-center justify-center overflow-hidden">
                        <img
                          src={selectedSignature.signatureImage}
                          alt="Signature Preview"
                          className="max-h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2 font-mono">
                        ID: #{selectedSignature._id.slice(-6)}
                      </span>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs italic">No signature selected</p>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              {selectedPdf && selectedSignature ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3.5 text-center text-xs font-semibold animate-pulse">
                  ✓ Ready to sign and export
                </div>
              ) : (
                <div className="bg-slate-900/40 border border-slate-850 text-slate-400 rounded-xl p-3.5 text-center text-xs">
                  Pending selection details...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignDocument;