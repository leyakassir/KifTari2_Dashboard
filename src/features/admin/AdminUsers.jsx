import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  UserCheck,
  UserX,
  RefreshCcw,
  Edit2,
} from "lucide-react";
import api from "../../api/api";

const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "employer", label: "Employer" },
  { value: "field_operator", label: "Field Operator" },
  { value: "citizen", label: "Citizen" },
];

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString();
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editUserId, setEditUserId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editMunicipalityId, setEditMunicipalityId] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setErrorMessage("");
      setLoading(true);
      const res = await api.get("/auth/admin/users", {
        params: {
          ...(roleFilter ? { role: roleFilter } : {}),
          ...(query ? { q: query } : {}),
        },
      });
      setUsers(res.data?.users || []);
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  }, [roleFilter, query]);

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([
        fetchUsers(),
        api
          .get("/municipality")
          .then((res) =>
            setMunicipalities(res.data?.municipalities || [])
          )
          .catch(() => setMunicipalities([])),
      ]);
    };

    fetchAll();
  }, [fetchUsers]);

  const handleToggleStatus = async (user) => {
    if (!user?._id) return;
    const currentActive =
      user.isActive !== false && user.active !== false;
    const nextActive = !currentActive;
    const confirmed = window.confirm(
      nextActive
        ? "Reactivate this user account?"
        : "Deactivate this user account?"
    );
    if (!confirmed) return;

    try {
      setUpdatingId(user._id);
      await api.patch(`/auth/admin/users/${user._id}/status`, {
        isActive: nextActive,
      });
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to update user status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkUpdate = async (isActive) => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    const confirmed = window.confirm(
      isActive
        ? "Reactivate selected users?"
        : "Deactivate selected users?"
    );
    if (!confirmed) return;

    try {
      setUpdatingId("bulk");
      for (const id of ids) {
        await api.patch(`/auth/admin/users/${id}/status`, { isActive });
      }
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Bulk update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStartEdit = (user) => {
    setEditUserId(user._id);
    setEditRole(user.role || "");
    setEditMunicipalityId(user.municipality?._id || "");
  };

  const handleSaveEdit = async () => {
    if (!editUserId) return;

    try {
      setUpdatingId(editUserId);
      if (editRole) {
        await api.patch(`/auth/admin/users/${editUserId}/role`, {
          role: editRole,
        });
      }
      if (editMunicipalityId) {
        await api.patch(
          `/auth/admin/users/${editUserId}/municipality`,
          { municipalityId: editMunicipalityId }
        );
      }
      setEditUserId(null);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update user");
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive !== false).length;
    return {
      total,
      active,
      inactive: total - active,
    };
  }, [users]);

  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-8 flex justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Users</div>
          <div className="text-2xl font-semibold text-slate-100">
            {counts.total}
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4">
          <div className="text-xs text-slate-400">Active</div>
          <div className="text-2xl font-semibold text-slate-100">
            {counts.active}
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4">
          <div className="text-xs text-slate-400">Deactivated</div>
          <div className="text-2xl font-semibold text-slate-100">
            {counts.inactive}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="border border-slate-800/60 rounded-lg px-3 py-2 text-sm"
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-slate-800/60 rounded-lg px-3 py-2 text-sm"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 text-sm px-3 py-2 border border-slate-800/60 rounded-lg hover:bg-slate-900/60"
          >
            <RefreshCcw size={14} />
            Refresh
          </button>
          <button
            onClick={() => handleBulkUpdate(false)}
            disabled={!selectedIds.size || updatingId === "bulk"}
            className="text-sm px-3 py-2 border border-rose-200 text-rose-700 rounded-lg hover:bg-rose-50 disabled:opacity-50"
          >
            Deactivate Selected
          </button>
          <button
            onClick={() => handleBulkUpdate(true)}
            disabled={!selectedIds.size || updatingId === "bulk"}
            className="text-sm px-3 py-2 border border-emerald-400/40 text-emerald-200 rounded-lg hover:bg-emerald-400/20 disabled:opacity-50"
          >
            Reactivate Selected
          </button>
          {errorMessage ? (
            <div className="text-sm text-red-600">{errorMessage}</div>
          ) : null}
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/60 border-b">
              <tr className="text-left text-slate-400">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      users.length > 0 &&
                      selectedIds.size === users.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(
                          new Set(users.map((user) => user._id))
                        );
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Municipality</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Last Login</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => {
                const statusActive =
                  user.isActive !== false && user.active !== false;
                return (
                  <Fragment key={user._id}>
                    <tr className="hover:bg-slate-900/60">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(user._id)}
                          onChange={(e) => {
                            setSelectedIds((prev) => {
                              const next = new Set(prev);
                              if (e.target.checked) {
                                next.add(user._id);
                              } else {
                                next.delete(user._id);
                              }
                              return next;
                            });
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-100">
                          {(user.firstName || "N/A") +
                            " " +
                            (user.lastName || "")}
                        </div>
                        <div className="text-xs text-slate-400">
                          {user.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {user.role || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {user.municipality?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={[
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                            statusActive
                              ? "bg-emerald-400/20 text-emerald-100"
                              : "bg-rose-50 text-rose-700",
                          ].join(" ")}
                        >
                          {statusActive ? "Active" : "Deactivated"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {formatDate(user.lastLoginAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={updatingId === user._id}
                            className={[
                              "px-3 py-2 rounded-lg border text-sm flex items-center gap-1",
                              statusActive
                                ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                                : "border-emerald-400/40 text-emerald-200 hover:bg-emerald-400/20",
                              updatingId === user._id ? "opacity-60" : "",
                            ].join(" ")}
                            title={
                              statusActive
                                ? "Deactivate user"
                                : "Reactivate user"
                            }
                          >
                            {statusActive ? (
                              <UserX size={14} />
                            ) : (
                              <UserCheck size={14} />
                            )}
                            {updatingId === user._id
                              ? "Updating..."
                              : statusActive
                              ? "Deactivate"
                              : "Reactivate"}
                          </button>
                          <button
                            onClick={() => handleStartEdit(user)}
                            className="px-3 py-2 rounded-lg border border-slate-800/60 text-sm hover:bg-slate-900/60 flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                    {editUserId === user._id ? (
                      <tr className="bg-slate-900/60">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select
                              className="border rounded-lg px-4 py-2"
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                            >
                              <option value="">Select Role</option>
                              {ROLE_OPTIONS.filter((opt) => opt.value).map(
                                (opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                )
                              )}
                            </select>
                            <select
                              className="border rounded-lg px-4 py-2"
                              value={editMunicipalityId}
                              onChange={(e) =>
                                setEditMunicipalityId(e.target.value)
                              }
                            >
                              <option value="">Select Municipality</option>
                              {municipalities.map((m) => (
                                <option key={m._id} value={m._id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleSaveEdit}
                                disabled={updatingId === user._id}
                                className="bg-emerald-400 text-white px-4 py-2 rounded-lg hover:bg-emerald-300 disabled:opacity-50"
                              >
                                {updatingId === user._id
                                  ? "Saving..."
                                  : "Save"}
                              </button>
                              <button
                                onClick={() => setEditUserId(null)}
                                className="px-4 py-2 rounded-lg border border-slate-800/60 text-slate-300 hover:bg-slate-900/40"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
