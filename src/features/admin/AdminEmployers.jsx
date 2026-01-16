import { useEffect, useMemo, useState } from "react";
import { Loader2, UserCheck, UserX } from "lucide-react";
import api from "../../api/api";

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString();
}

export default function AdminEmployers() {
  const [employers, setEmployers] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    municipalityId: "",
  });

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setErrorMessage("");
        const [employersRes, municipalitiesRes] = await Promise.all([
          api.get("/auth/admin/users", { params: { role: "employer" } }),
          api.get("/municipality"),
        ]);
        setEmployers(employersRes.data?.users || []);
        setMunicipalities(municipalitiesRes.data?.municipalities || []);
      } catch (err) {
        console.error(err);
        setErrorMessage(
          err.response?.data?.message || "Failed to load employers"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  const counts = useMemo(() => {
    const total = employers.length;
    const active = employers.filter((u) => u.isActive !== false).length;
    return { total, active, inactive: total - active };
  }, [employers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.municipalityId
    ) {
      alert("All fields are required");
      return;
    }

    try {
      setCreating(true);
      await api.post("/auth/admin/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: "employer",
        municipalityId: form.municipalityId,
      });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        municipalityId: "",
      });
      const res = await api.get("/auth/admin/users", {
        params: { role: "employer" },
      });
      setEmployers(res.data?.users || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create employer");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (employer) => {
    if (!employer?._id) return;
    const nextActive = !employer.isActive;
    const confirmed = window.confirm(
      nextActive
        ? "Reactivate this employer account?"
        : "Deactivate this employer account?"
    );
    if (!confirmed) return;

    try {
      setUpdatingId(employer._id);
      await api.patch(`/auth/admin/users/${employer._id}/status`, {
        isActive: nextActive,
      });
      setEmployers((prev) =>
        prev.map((item) =>
          item._id === employer._id
            ? {
                ...item,
                isActive: nextActive,
                deactivatedAt: nextActive ? null : new Date().toISOString(),
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update employer");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 flex justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="font-semibold text-slate-900 mb-4">
          Create Employer
        </div>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
          />
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Temporary Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <select
            className="border rounded-lg px-4 py-2"
            value={form.municipalityId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                municipalityId: e.target.value,
              }))
            }
          >
            <option value="">Select Municipality</option>
            {municipalities.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
          <div className="md:col-span-2">
            <button
              disabled={creating}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primarySoft disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Employer"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Total Employers</div>
          <div className="text-2xl font-semibold text-slate-900">
            {counts.total}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Active</div>
          <div className="text-2xl font-semibold text-slate-900">
            {counts.active}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Deactivated</div>
          <div className="text-2xl font-semibold text-slate-900">
            {counts.inactive}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {errorMessage ? (
          <div className="px-6 py-4 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr className="text-left text-slate-600">
                <th className="px-6 py-3">Employer</th>
                <th className="px-6 py-3">Municipality</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Last Login</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employers.map((employer) => {
                const statusActive = employer.isActive !== false;
                return (
                  <tr key={employer._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {(employer.firstName || "N/A") +
                          " " +
                          (employer.lastName || "")}
                      </div>
                      <div className="text-xs text-slate-500">
                        {employer.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {employer.municipality?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={[
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                          statusActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700",
                        ].join(" ")}
                      >
                        {statusActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(employer.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(employer.lastLoginAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleToggleStatus(employer)}
                          disabled={updatingId === employer._id}
                          className={[
                            "px-3 py-2 rounded-lg border text-sm flex items-center gap-1",
                            statusActive
                              ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
                            updatingId === employer._id ? "opacity-60" : "",
                          ].join(" ")}
                          title={
                            statusActive
                              ? "Deactivate employer"
                              : "Reactivate employer"
                          }
                        >
                          {statusActive ? (
                            <UserX size={14} />
                          ) : (
                            <UserCheck size={14} />
                          )}
                          {updatingId === employer._id
                            ? "Updating..."
                            : statusActive
                            ? "Deactivate"
                            : "Reactivate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
