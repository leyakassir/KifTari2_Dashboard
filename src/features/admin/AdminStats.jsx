import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../../api/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString();
}

export default function AdminStats() {
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [municipalityStats, setMunicipalityStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setErrorMessage("");
        const [summaryRes, reportsRes, municipalitiesRes, statsRes] =
          await Promise.all([
            api.get("/reports/summary"),
            api.get("/reports/filter", { params: { sort: "newest" } }),
            api.get("/municipality"),
            api.get("/reports/admin/municipality-stats"),
          ]);

        setSummary(summaryRes.data?.systemStats || null);
        setReports(reportsRes.data?.results || []);
        setMunicipalities(municipalitiesRes.data?.municipalities || []);
        setMunicipalityStats(statsRes.data || []);
      } catch (err) {
        console.error(err);
        setErrorMessage(
          err.response?.data?.message || "Failed to load statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const municipalityMap = useMemo(() => {
    const map = new Map();
    municipalities.forEach((m) => {
      if (m?._id) {
        map.set(m._id, m.name);
      }
    });
    return map;
  }, [municipalities]);

  const recentReports = useMemo(() => reports.slice(0, 8), [reports]);

  const chartData = useMemo(() => {
    const totals = municipalityStats.reduce(
      (acc, stat) => {
        acc.pending += stat?.pending || 0;
        acc.inProgress += stat?.inProgress || 0;
        acc.resolved += stat?.resolved || 0;
        return acc;
      },
      { pending: 0, inProgress: 0, resolved: 0 }
    );

    return [
      { name: "Pending", value: totals.pending },
      { name: "In Progress", value: totals.inProgress },
      { name: "Resolved", value: totals.resolved },
    ];
  }, [municipalityStats]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 flex justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Total Reports</div>
          <div className="text-2xl font-semibold text-slate-900">
            {summary?.totalReports ?? 0}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Unresolved Reports</div>
          <div className="text-2xl font-semibold text-slate-900">
            {summary?.unresolvedReports ?? 0}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Total Users</div>
          <div className="text-2xl font-semibold text-slate-900">
            {summary?.totalUsers
              ? Object.values(summary.totalUsers).reduce(
                  (sum, value) => sum + value,
                  0
                )
              : 0}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="text-sm font-semibold text-slate-700 mb-4">
          Reports Distribution by Status
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#1e293b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="font-semibold text-slate-900">Recent Reports</div>
          <div className="text-xs text-slate-500">
            Read-only visibility for governance
          </div>
        </div>
        <div className="divide-y">
          {recentReports.map((report) => (
            <div key={report._id} className="px-6 py-4 text-sm">
              <div className="font-medium text-slate-900">
                {report.title || "Untitled report"}
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                <span>Status: {report.status || "N/A"}</span>
                <span>
                  Municipality:{" "}
                  {municipalityMap.get(report.municipalityId) || "N/A"}
                </span>
                <span>Created: {formatDate(report.createdAt)}</span>
              </div>
            </div>
          ))}
          {recentReports.length === 0 ? (
            <div className="px-6 py-4 text-sm text-slate-500">
              No reports available.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
