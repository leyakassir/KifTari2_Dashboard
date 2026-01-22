import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= STAT CARD ================= */
function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800/60 p-5 shadow-sm flex items-center gap-4">
      <div className="h-12 w-12 rounded-lg bg-slate-900/60 flex items-center justify-center text-slate-300">
        <Icon size={22} />
      </div>

      <div>
        <div className="text-sm text-slate-400">{title}</div>
        <div className="text-2xl font-semibold text-slate-100">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function EmployerStats() {
  const [stats, setStats] = useState(null);
  const [municipalityName, setMunicipalityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/reports/summary");
        setStats(res.data.stats);
        setMunicipalityName(res.data.municipalityName || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-slate-900/60 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="text-red-500 bg-slate-900/50 border border-red-200 rounded-xl p-6">
        {error}
      </div>
    );
  }

  const total = stats?.totalReports ?? 0;
  const pending = stats?.pending ?? 0;
  const inProgress = stats?.inProgress ?? 0;
  const resolved = stats?.resolved ?? 0;

  const chartData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved },
  ];

  return (
    <div className="space-y-8">
      {/* ===== HEADER WITH MUNICIPALITY NAME ===== */}
      <div>
        <h1 className="text-xl font-semibold text-slate-100">
          Statistics
        </h1>

        <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
          <MapPin size={16} />
          <span>
            {municipalityName
              ? `${municipalityName} Municipality`
              : "Assigned Municipality"}
          </span>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Reports" value={total} icon={FileText} />
        <StatCard title="Pending" value={pending} icon={Clock} />
        <StatCard title="In Progress" value={inProgress} icon={AlertCircle} />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle} />
      </div>

      {/* ===== CHART ===== */}
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">
          Reports Distribution by Status
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#1e293b"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
