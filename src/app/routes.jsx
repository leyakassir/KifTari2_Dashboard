import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../features/auth/Login";
import Welcome from "../features/auth/Welcome";

// Layout
import EmployerLayout from "../features/employer/EmployerLayout";
import AdminLayout from "../features/admin/AdminLayout";

// Employer pages
import EmployerDashboard from "../features/employer/EmployerDashboard";
import EmployerReports from "../features/employer/EmployerReports";
import EmployerReportDetails from "../features/employer/EmployerReportDetails";
import EmployerOperators from "../features/employer/EmployerOperators";
import EmployerStats from "../features/employer/EmployerStats";
import EmployerProfile from "../features/employer/EmployerProfile";

// Admin pages
import AdminDashboard from "../features/admin/AdminDashboard";
import AdminStats from "../features/admin/AdminStats";
import AdminUsers from "../features/admin/AdminUsers";
import AdminEmployers from "../features/admin/AdminEmployers";
import AdminMunicipalities from "../features/admin/AdminMunicipalities";
import AdminAuditLogs from "../features/admin/AdminAuditLogs";
import AdminProfile from "../features/admin/AdminProfile";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />

      {/* EMPLOYER (PROTECTED) */}
      <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
        <Route path="/employer" element={<EmployerLayout />}>
          <Route index element={<EmployerDashboard />} />
          <Route path="dashboard" element={<EmployerDashboard />} />
          <Route path="reports" element={<EmployerReports />} />
          <Route path="reports/:id" element={<EmployerReportDetails />} />
          <Route path="operators" element={<EmployerOperators />} />
          <Route path="stats" element={<EmployerStats />} />
          <Route path="profile" element={<EmployerProfile />} />
        </Route>
      </Route>

      {/* ADMIN (PROTECTED) */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="stats" element={<AdminStats />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="employers" element={<AdminEmployers />} />
          <Route path="municipalities" element={<AdminMunicipalities />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}
