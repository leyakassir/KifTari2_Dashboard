import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import AdminSidebar from "../../components/layout/AdminSidebar";
import Topbar from "../../components/layout/Topbar";

function getPageMeta(pathname) {
  if (pathname.includes("/admin/dashboard")) {
    return {
      title: "Admin Dashboard",
      subtitle: "System-wide overview and governance controls",
    };
  }

  if (pathname.includes("/admin/users")) {
    return {
      title: "Users",
      subtitle: "Audit users and manage activation status",
    };
  }

  if (pathname.includes("/admin/employers")) {
    return {
      title: "Employers",
      subtitle: "Employer roster and municipal assignments",
    };
  }

  if (pathname.includes("/admin/municipalities")) {
    return {
      title: "Municipalities",
      subtitle: "Manage municipalities and health metrics",
    };
  }

  return {
    title: "Super Admin Portal",
    subtitle: "KifTari2 governance dashboard",
  };
}

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { title, subtitle } = useMemo(
    () => getPageMeta(location.pathname),
    [location.pathname]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />

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
