import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth-context";

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const FloatingMenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  if (!auth?.isAuthenticated) return null;

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-2 px-4 bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-full shadow-2xl shadow-slate-900/10 scale-110 md:scale-125 transition-transform">
        {/* Dashboard Link */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`p-3 rounded-full transition-all ${
            isActive("/dashboard")
              ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
              : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
          }`}
          title="Dashboard"
        >
          <HomeIcon />
        </button>

        {/* Add Job Link */}
        <button
          onClick={() => navigate("/add-job")}
          className={`p-3 rounded-full transition-all ${
            isActive("/add-job")
              ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
              : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
          }`}
          title="Add Application"
        >
          <PlusIcon />
        </button>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-slate-200 mx-1" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          title="Sign Out"
        >
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
};

export default FloatingMenuBar;
