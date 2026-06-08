import { NavLink } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
    }`;

  return (
    <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
            DS
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              Docu<span className="text-indigo-400">Sign</span>
            </span>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              Secure Signatures
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/upload" className={linkClass}>
            Upload PDF
          </NavLink>
          <NavLink to="/viewer" className={linkClass}>
            View PDFs
          </NavLink>
          <NavLink to="/signature" className={linkClass}>
            Create Signature
          </NavLink>
          <NavLink to="/signature-viewer" className={linkClass}>
            View Signatures
          </NavLink>
          <NavLink to="/sign-document" className={linkClass}>
            Sign Document
          </NavLink>
          <NavLink to="/audit" className={linkClass}>
            Audit Logs
          </NavLink>
        </div>

        {/* User profile & Log out */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-900/55 pl-3 pr-2 py-1.5 rounded-full border border-slate-800">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-semibold text-slate-300">
                  {user.name}
                </span>
                <span className="block text-[10px] text-slate-500">
                  {user.email}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-500/50 flex items-center justify-center font-bold text-indigo-400 text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logoutHandler}
                className="ml-2 px-3 py-1.5 rounded-full bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 text-xs font-medium border border-rose-500/20 transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all"
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;