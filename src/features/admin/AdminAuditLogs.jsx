import { Fragment, useEffect, useState } from "react";
import { Loader2, RefreshCcw, Info } from "lucide-react";
import api from "../../api/api";

function formatDateTime(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
}

function formatMetadata(metadata, action) {
  if (!metadata) {
    return `No additional details recorded for ${action || "this action"}.`;
  }

  const lines = [];

  if (action === "user.role_updated") {
    const name =
      metadata.name || metadata.email || "Unknown user";
    lines.push(
      `Role change: ${name} (${metadata.email || "no email"})`
    );
    lines.push(
      `From: ${metadata.oldRole || "N/A"} → To: ${
        metadata.newRole || "N/A"
      }`
    );
  }

  if (action === "user.deactivated" || action === "user.activated") {
    const name =
      metadata.name || metadata.email || "Unknown user";
    lines.push(
      `${action === "user.activated" ? "Activated" : "Deactivated"}: ${name}`
    );
    if (metadata.email) {
      lines.push(`Email: ${metadata.email}`);
    }
  }

  if (action === "user.municipality_updated") {
    const name =
      metadata.name || metadata.email || "Unknown user";
    lines.push(`User: ${name}`);
    lines.push(
      `Municipality: ${metadata.municipalityName || metadata.municipalityId || "N/A"}`
    );
  }

  if (
    action === "municipality.activated" ||
    action === "municipality.deactivated"
  ) {
    lines.push(
      `${action === "municipality.activated" ? "Activated" : "Deactivated"}: ${
        metadata.name || "Unknown municipality"
      }`
    );
  }

  if (action === "municipality.employer_assigned") {
    lines.push(
      `Municipality: ${metadata.municipalityName || "Unknown"}`
    );
    lines.push(
      `Employer: ${metadata.employerName || "N/A"}${
        metadata.employerEmail ? ` (${metadata.employerEmail})` : ""
      }`
    );
  }

  if (action === "municipality.coordinates_updated") {
    lines.push(`Municipality: ${metadata.name || "Unknown"}`);
    lines.push(
      `Coordinates: ${metadata.centerLat ?? "N/A"}, ${metadata.centerLng ?? "N/A"} | Radius: ${metadata.radiusKm ?? "N/A"} km`
    );
  }

  if (action === "municipality.created") {
    lines.push(`Municipality: ${metadata.name || "Unknown"}`);
    lines.push(
      `Coordinates: ${metadata.centerLat ?? "N/A"}, ${metadata.centerLng ?? "N/A"} | Radius: ${metadata.radiusKm ?? "N/A"} km`
    );
  }

  if (!lines.length) {
    if (metadata.name || metadata.email) {
      lines.push(
        `User: ${metadata.name || "N/A"}${metadata.email ? ` (${metadata.email})` : ""}`
      );
    }
    if (metadata.municipalityName) {
      lines.push(`Municipality: ${metadata.municipalityName}`);
    }
  }

  if (!lines.length) {
    return `No additional details recorded for ${action || "this action"}.`;
  }
  return lines.join("\n");
}

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openId, setOpenId] = useState(null);

  const fetchLogs = async () => {
    try {
      setErrorMessage("");
      setLoading(true);
      const res = await api.get("/auth/admin/audit-logs");
      setLogs(res.data?.logs || []);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Failed to load audit logs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 flex justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-900">Audit Logs</div>
          <div className="text-xs text-slate-500">
            Read-only governance activity history
          </div>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 text-sm px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
        >
          <RefreshCcw size={14} />
          Refresh
        </button>
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
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Actor</th>
                <th className="px-6 py-3">Target</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log) => (
                <Fragment key={log._id}>
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-600">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {log.actorId
                        ? `${log.actorId.firstName || ""} ${log.actorId.lastName || ""}`.trim()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {log.targetType || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <button
                        onClick={() =>
                          setOpenId((prev) =>
                            prev === log._id ? null : log._id
                          )
                        }
                        className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        <Info size={14} />
                        {openId === log._id ? "Hide Details" : "View Details"}
                      </button>
                    </td>
                  </tr>
                  {openId === log._id ? (
                    <tr className="bg-slate-50">
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-sm text-slate-600"
                      >
                        <pre className="whitespace-pre-wrap font-sans">
                          {formatMetadata(log.metadata, log.action)}
                        </pre>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
