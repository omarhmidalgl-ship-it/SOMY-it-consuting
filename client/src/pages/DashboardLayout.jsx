import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: "📊" },
  { to: "/dashboard/projects", label: "Projects", icon: "📁" },
  { to: "/dashboard/tasks", label: "Tasks", icon: "✅" },
  { to: "/dashboard/team", label: "Team", icon: "👥" },
  { to: "/dashboard/leads", label: "Leads", icon: "🎯" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-somy-navy flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed h-full w-64 bg-somy-midnight border-r border-white/5 flex flex-col z-50 transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="SOMY" className="h-8 w-auto" />
          </NavLink>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-somy-accent/10 text-somy-accent-light"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: user?.avatarColor || "#6366f1" }}
            >
              {user?.name?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-somy-coral hover:bg-white/5 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-somy-navy/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <NavLink to="/" className="flex items-center">
            <img src="/logo.png" alt="SOMY" className="h-7 w-auto" />
          </NavLink>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
