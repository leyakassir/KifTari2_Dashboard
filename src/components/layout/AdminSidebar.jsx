import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  BarChart3,
  FileText,
  User,
  Menu,
  ChevronLeft,
  LogOut,
} from "lucide-react";

import TrafficIcon from "@mui/icons-material/Traffic";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/stats", label: "Statistics", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/employers", label: "Employers", icon: ShieldCheck },
  { to: "/admin/municipalities", label: "Municipalities", icon: Building2 },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
  { to: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminSidebar({ collapsed, setCollapsed, onLogout }) {
  return (
    <aside
      className={[
        "h-screen sticky top-0 z-30",
        "border-r border-slate-200 bg-white",
        "transition-all duration-200",
        collapsed ? "w-[96px]" : "w-[280px]",
      ].join(" ")}
    >
      {/* ===== BRAND ===== */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <TrafficIcon sx={{ fontSize: 26, color: "#0f172a" }} />

          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">
                KifTari2
              </div>
              <div className="text-xs text-slate-500">Super Admin</div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="p-2">
        <div className="text-xs font-semibold text-slate-400 px-3 pt-3 pb-2">
          {!collapsed ? "Administration" : " "}
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
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-primaryLight hover:text-primary",
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
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-slate-200 bg-white">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
