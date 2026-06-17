import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [stats, setStats] = useState({ documents: 0, signatures: 0, audits: 0 });

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
      return;
    }

    // Load stats
    const fetchStats = async () => {
      try {
        const [docsRes, sigsRes, auditRes] = await Promise.all([
          API.get("/api/documents/all"),
          API.get("/api/signature/all"),
          API.get("/api/audit/all"),
        ]);
        setStats({
          documents: docsRes.data.length,
          signatures: sigsRes.data.length,
          audits: auditRes.data.length,
        });
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      }
    };
    fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl border border-slate-800 p-8 md:p-10 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <span className="px-3 py-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20 uppercase tracking-wider">
              Control Panel
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user.name}</span>!
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base max-w-xl">
              Access your digital documents, manage secure signatures, and review verified system logs all from one place.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0f172a]/60 backdrop-blur border border-slate-800/80 rounded-xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/40 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Total Documents</span>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                📄
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white">{stats.documents}</h2>
            <p className="text-slate-400 text-xs mt-2">PDF documents uploaded</p>
          </div>

          <div className="bg-[#0f172a]/60 backdrop-blur border border-slate-800/80 rounded-xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/40 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Saved Signatures</span>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                ✍️
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white">{stats.signatures}</h2>
            <p className="text-slate-400 text-xs mt-2">Drawn signatures stored</p>
          </div>

          <div className="bg-[#0f172a]/60 backdrop-blur border border-slate-800/80 rounded-xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-indigo-500/40 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Audit Records</span>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                🛡️
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white">{stats.audits}</h2>
            <p className="text-slate-400 text-xs mt-2">Recorded actions in log</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-indigo-500 block"></span> Quick Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/upload" className="group bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/40 hover:border-indigo-500/35 transition-all shadow-md">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform">
                📤
              </div>
              <h4 className="text-base font-bold text-white mb-1">Upload Document</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Add a new PDF document to the database to prepare it for signing.</p>
            </Link>

            <Link to="/sign-document" className="group bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/40 hover:border-indigo-500/35 transition-all shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform">
                🖋️
              </div>
              <h4 className="text-base font-bold text-white mb-1">Sign PDF</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Overlay your saved signature onto any PDF document and download it.</p>
            </Link>

            <Link to="/signature" className="group bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/40 hover:border-indigo-500/35 transition-all shadow-md">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform">
                ✏️
              </div>
              <h4 className="text-base font-bold text-white mb-1">Create Signature</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Draw and save a secure digital signature directly on a canvas.</p>
            </Link>

            <Link to="/audit" className="group bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:bg-slate-800/40 hover:border-indigo-500/35 transition-all shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform">
                📋
              </div>
              <h4 className="text-base font-bold text-white mb-1">Audit Logs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Review the security logs tracking all document sign actions.</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;