import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

/**
 * UI-only helper to map route → page title
 */
function getPageMeta(pathname) {
  if (pathname.includes("/employer/dashboard")) {
    return {
      title: "Dashboard",
      subtitle: "Overview of reports and operations",
    };
  }

  if (pathname.includes("/employer/reports")) {
    return {
      title: "Reports",
      subtitle: "Manage and track incoming reports",
    };
  }

  if (pathname.includes("/employer/operators")) {
    return {
      title: "Field Operators",
      subtitle: "Create and manage field operators",
    };
  }

  if (pathname.includes("/employer/stats")) {
    return {
      title: "Statistics",
      subtitle: "Simple counts and summaries",
    };
  }

  if (pathname.includes("/employer/profile")) {
    return {
      title: "Profile",
      subtitle: "Manage your account and verification",
    };
  }

  return {
    title: "Employer Portal",
    subtitle: "KifTari2 Municipality Dashboard",
  };
}

export default function EmployerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { title, subtitle } = useMemo(
    () => getPageMeta(location.pathname),
    [location.pathname]
  );

  // ⚠️ Keep logout logic EXACTLY as-is (UI only)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
