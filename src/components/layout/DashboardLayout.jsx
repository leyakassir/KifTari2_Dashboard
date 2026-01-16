import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ title, children }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="dashboard">
      <Sidebar collapsed={collapsed} />

      <div className="dashboard-content">
        <Topbar
          title={title}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
