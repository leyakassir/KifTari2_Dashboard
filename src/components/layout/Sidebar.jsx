import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  User,
  Menu,
  ChevronLeft,
  LogOut,
} from "lucide-react";

import TrafficIcon from "@mui/icons-material/Traffic";

const navItems = [
  { to: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employer/reports", label: "Reports", icon: FileText },
  { to: "/employer/operators", label: "Operators", icon: Users },
  { to: "/employer/stats", label: "Statistics", icon: BarChart3 },
  { to: "/employer/profile", label: "Profile", icon: User },
];

export default function Sidebar({ collapsed, setCollapsed, onLogout }) {
  return (
    <aside
      className={[
        "h-screen sticky top-0 z-30",
        "border-r border-slate-800/60 bg-slate-900/70",
        "transition-all duration-200",
        collapsed ? "w-[96px]" : "w-[280px]",
      ].join(" ")}
    >
      {/* ===== BRAND ===== */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          {/* REAL STREET SIGN ICON */}
          <TrafficIcon sx={{ fontSize: 26, color: "#e2e8f0" }} />

          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-100">
                KifTari2
              </div>
              <div className="text-xs text-slate-400">
                Employer Portal
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="h-9 w-9 rounded-lg hover:bg-slate-900/40 flex items-center justify-center"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="p-2">
        <div className="text-xs font-semibold text-slate-400 px-3 pt-3 pb-2">
          {!collapsed ? "Navigation" : " "}
        </div>

        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-4 px-3 py-3 rounded-lg",
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "bg-emerald-400/20 text-emerald-100"
                        : "text-slate-300 hover:bg-slate-900/60 hover:text-slate-100",
                    ].join(" ")
                  }
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center justify-center"
                  >
                    <Icon size={20} />
                  </motion.div>

                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ===== LOGOUT ===== */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-slate-800/60 bg-slate-900/70">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900/40"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
