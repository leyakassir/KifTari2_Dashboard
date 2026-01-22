import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Eye,
  Clock,
  CheckCircle,
  UserPlus,
  RefreshCcw,
  Download,
} from "lucide-react";
import api from "../../api/api";
import AssignOperatorModal from "./AssignOperatorModal";

/* ================= STATUS BADGE ================= */
function StatusBadge({ status }) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize";

  if (status === "resolved") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        <CheckCircle size={12} />
        Resolved
      </span>
    );
  }

  if (status === "assigned" || status === "in_progress") {
    return (
      <span className={`${base} bg-blue-100 text-blue-700`}>
        <Clock size={12} />
        In Progress
      </span>
    );
  }

  return (
    <span className={`${base} bg-yellow-100 text-yellow-800`}>
      <Clock size={12} />
      Pending
    </span>
  );
}

function operatorName(op) {
  if (!op) return "Not assigned";
  if (typeof op === "object") {
    return `${op.firstName || ""} ${op.lastName || ""}`.trim();
  }
  return "Assigned";
}

/* ================= CSV EXPORT ================= */
function exportCSV(reports) {
  const headers = ["Title", "Status", "Priority", "Operator", "Created"];
  const rows = reports.map((r) => [
    r.title,
    r.status,
    r.aiPriority,
    operatorName(r.assignedOperatorId),
    new Date(r.createdAt).toLocaleDateString(),
  ]);

  const csv =
    headers.join(",") +
    "\n" +
    rows.map((r) => r.map((x) => `"${x}"`).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "reports.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function EmployerReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [prioritySort, setPrioritySort] = useState("none");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  /* ================= FETCH REPORTS ================= */
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports/employer");
        setReports(res.data.reports || []);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  /* ================= AFTER ASSIGN / CHANGE ================= */
  const handleAssigned = (reportId, operator) => {
    setReports((prev) =>
      prev.map((r) =>
        r._id === reportId
          ? {
              ...r,
              status: "in_progress",
              assignedOperatorId: operator,
            }
          : r
      )
    );
  };

  /* ================= FILTER + SORT ================= */
  const filteredReports = useMemo(() => {
    let data = [...reports];

    if (statusFilter !== "all") {
      data = data.filter((r) => r.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      data = data.filter((r) => r.aiPriority === priorityFilter);
    }

    if (search) {
      data = data.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (prioritySort !== "none") {
      const order = { high: 3, medium: 2, low: 1 };
      data.sort((a, b) =>
        prioritySort === "high-low"
          ? order[b.aiPriority] - order[a.aiPriority]
          : order[a.aiPriority] - order[b.aiPriority]
      );
    }

    return data;
  }, [reports, statusFilter, priorityFilter, prioritySort, search]);

  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl h-40 animate-pulse" />
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">
          Reports Management
        </h2>
        <p className="text-sm text-slate-400">
          Reports in your municipality
        </p>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="px-3 py-2 border rounded-lg text-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={prioritySort}
          onChange={(e) => setPrioritySort(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="none">No Priority Sort</option>
          <option value="high-low">High → Low</option>
          <option value="low-high">Low → High</option>
        </select>

        <button
          onClick={() => exportCSV(filteredReports)}
          className="ml-auto px-4 py-2 border rounded-lg flex items-center gap-2 text-sm"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* ================= TABLE (RESPONSIVE ONLY) ================= */}
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <FileText size={18} />
          <h3 className="font-semibold">Incoming Reports</h3>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No reports found.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-slate-900/60 border-b">
                <tr className="text-left text-slate-400">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Operator</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredReports.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-900/60">
                    <td className="px-6 py-4 font-medium">{r.title}</td>

                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {operatorName(r.assignedOperatorId)}
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/employer/reports/${r._id}`)
                          }
                          className="px-3 py-2 border rounded-lg hover:bg-slate-900/40"
                        >
                          <Eye size={16} />
                        </button>

                        {r.status === "pending" && (
                          <button
                            onClick={() => setSelectedReport(r)}
                            className="px-3 py-2 bg-emerald-400 text-white rounded-lg flex items-center gap-1"
                          >
                            <UserPlus size={14} />
                            Assign
                          </button>
                        )}

                        {["assigned", "in_progress"].includes(r.status) && (
                          <button
                            onClick={() => setSelectedReport(r)}
                            className="px-3 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-1"
                          >
                            <RefreshCcw size={14} />
                            Change
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedReport && (
        <AssignOperatorModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onAssigned={handleAssigned}
        />
      )}
    </div>
  );
}
