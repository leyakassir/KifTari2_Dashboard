import { useCallback, useEffect, useMemo, useState } from "react";
import { User, Trash2, Loader2, Plus } from "lucide-react";
import api from "../../api/api";

export default function EmployerOperators() {
  const [operators, setOperators] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  /* ================= CREATE FORM STATE ================= */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const normalizeOperator = useCallback((raw) => {
    if (!raw) return null;
    const name = raw.name || "";
    const [firstFromName, lastFromName] = name.split(" ");

    return {
      // Backend sometimes returns different shapes; normalize to a safe operator model.
      _id: raw._id || raw.id || raw.userId || raw.operatorId || null,
      firstName: raw.firstName || firstFromName || "",
      lastName: raw.lastName || lastFromName || "",
      email: raw.email || "",
    };
  }, []);

  const extractAssignedOperatorId = useCallback((report) => {
    // Defensive extraction in case assignedOperatorId is serialized differently.
    const value =
      report?.assignedOperatorId ||
      report?.assignedOperator?._id ||
      report?.assignedOperator?.id ||
      report?.assignedOperatorId?._id ||
      report?.assignedOperatorId?.id;
    return value ? String(value) : null;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setErrorMessage("");
      const [opsRes, reportsRes] = await Promise.all([
        api.get("/auth/employer/operators"),
        api.get("/reports/filter"),
      ]);

      const normalizedOperators = (opsRes.data?.operators || [])
        .map(normalizeOperator)
        .filter(Boolean);

      setOperators(normalizedOperators);
      // Backend may return reports under different keys; normalize to avoid zero counts.
      setReports(reportsRes.data?.reports || reportsRes.data?.results || []);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load operators data");
    } finally {
      setLoading(false);
    }
  }, [normalizeOperator]);

  /* ================= FETCH OPERATORS + REPORTS ================= */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= COUNT REPORTS PER OPERATOR ================= */
  const operatorUsage = useMemo(() => {
    const map = {};
    reports.forEach((r) => {
      // IMPORTANT: assignedOperatorId is STRING (normalize defensively).
      const key = extractAssignedOperatorId(r);
      if (key) {
        map[key] = (map[key] || 0) + 1;
      }
    });
    return map;
  }, [reports, extractAssignedOperatorId]);

  /* ================= CREATE OPERATOR ================= */
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setCreating(true);

      const res = await api.post("/auth/employer/register-operator", {
        firstName,
        lastName,
        email,
        password,
      });

      // Normalize backend response so the UI never crashes on unexpected shapes.
      const raw = res.data?.operator || res.data?.user || res.data;
      const newOperator = normalizeOperator(raw);

      if (newOperator && newOperator._id) {
        setOperators((prev) => [newOperator, ...prev]);
      } else {
        // Fallback to a full refresh if the response doesn't include a usable operator.
        await fetchData();
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create field operator");
    } finally {
      setCreating(false);
    }
  };

  /* ================= DELETE OPERATOR ================= */
  const handleDelete = async (operatorId) => {
    if (!operatorId) return;
    const assignedCount = operatorUsage[String(operatorId)] || 0;

    // Frontend guard (backend also enforces)
    if (assignedCount > 0) {
      alert("This operator has assigned reports and cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this field operator?\n\nThis action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(operatorId);

      // Backend contract uses /auth for this resource.
      await api.delete(`/auth/employer/operators/${operatorId}`);

      setOperators((prev) =>
        prev.filter((op) => op._id !== operatorId)
      );
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to delete field operator"
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-8 flex justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ================= CREATE FORM ================= */}
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={18} />
          <h3 className="font-semibold text-lg">Create Field Operator</h3>
        </div>

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Temporary Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <div className="md:col-span-2">
            <button
              disabled={creating}
              className="bg-emerald-400 text-white px-6 py-2 rounded-lg hover:bg-emerald-300 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Operator"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= OPERATORS LIST ================= */}
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <User size={18} />
          <h3 className="font-semibold">Operators List</h3>
        </div>

        {errorMessage ? (
          <div className="px-6 py-4 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <table className="w-full text-sm">
          <thead className="bg-slate-900/60 border-b">
            <tr className="text-left text-slate-400">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Assigned Reports</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {operators.map((op, index) => {
              const opId = op?._id || op?.id || null;
              const assignedCount = opId
                ? operatorUsage[String(opId)] || 0
                : 0;
              const canDelete = opId && assignedCount === 0;
              const rowKey = opId || op?.email || `operator-${index}`;

              return (
                <tr key={rowKey} className="hover:bg-slate-900/60">
                  <td className="px-6 py-4 font-medium">
                    {(op?.firstName || "N/A") + " " + (op?.lastName || "")}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {op?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {assignedCount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <div className="flex flex-col items-end">
                        <button
                          onClick={() => handleDelete(opId)}
                          disabled={!canDelete || deletingId === opId}
                          className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-1 disabled:opacity-50"
                          title={
                            assignedCount > 0
                              ? "This operator has assigned reports"
                              : "Delete operator"
                          }
                        >
                          <Trash2 size={16} />
                          {deletingId === opId ? "Deleting..." : "Delete"}
                        </button>
                        {/* Clarify why delete is disabled when reports are assigned */}
                        {assignedCount > 0 ? (
                          <span className="mt-1 text-xs text-slate-400">
                            You cant delete an operator with assigned reports.
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
