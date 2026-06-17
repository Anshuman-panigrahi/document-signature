import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Audit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(
        "/api/audit/all"
      );
      setLogs(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-indigo-500 block"></span> System Audit Logs
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Tamper-evident system log tracking all digital document signature actions.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm">Loading audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl p-16 text-center bg-slate-900/10">
            <span className="text-4xl block mb-4">🛡️</span>
            <h3 className="text-lg font-bold text-white mb-1">No Audit Logs Found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              System events and signatures will appear here once signing processes are executed.
            </p>
          </div>
        ) : (
          <div className="bg-[#0f172a]/60 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Operator
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Document Signed
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                      Action
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right font-mono">
                      Log ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {logs.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-slate-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-xs text-slate-300">
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-200">
                        {log.userName}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300 font-medium truncate max-w-xs" title={log.documentName}>
                        {log.documentName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">
                          {log.action || "SIGNED"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[10px] text-slate-500 font-mono">
                        #{log._id.slice(-8)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Audit;