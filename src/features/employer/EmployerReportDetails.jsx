import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  User,
  Building2,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import api from "../../api/api";

export default function EmployerReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/reports/${id}`);
        setReport(res.data.report);
      } catch (err) {
        console.error(err);
        setError("Failed to load report details.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading report…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!report) return null;

  /* ================= HELPERS ================= */

  const fullName = (user) =>
    user ? `${user.firstName} ${user.lastName}` : "Not assigned";

  const municipalityName = report.municipalityId?.name || "Unknown";

  const mapUrl =
    report.latitude && report.longitude
      ? `https://www.google.com/maps?q=${report.latitude},${report.longitude}&z=16&output=embed`
      : null;

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-8">
      {/* ===== TOP BAR ===== */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/employer/reports")}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Reports
        </button>

        <span
          className={`px-4 py-1 rounded-full text-sm font-medium capitalize
            ${
              report.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : report.status === "in_progress"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
        >
          {report.status}
        </span>
      </div>

      {/* ===== TITLE ===== */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {report.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Created on {new Date(report.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* ===== DESCRIPTION ===== */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <p className="text-slate-700 leading-relaxed">
          {report.description}
        </p>
      </div>

      {/* ===== ASSIGNMENT INFO ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <InfoItem
          icon={<Building2 size={18} />}
          label="Municipality"
          value={municipalityName}
        />
        <InfoItem
          icon={<ShieldCheck size={18} />}
          label="Employer"
          value={fullName(report.assignedEmployerId)}
        />
        <InfoItem
          icon={<User size={18} />}
          label="Field Operator"
          value={fullName(report.assignedOperatorId)}
        />
      </div>

      {/* ===== AI CLASSIFICATION ===== */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          AI Classification
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AiItem label="Category" value={report.aiCategory} />
          <AiItem label="Severity" value={report.aiSeverity} />
          <AiItem label="Priority" value={report.aiPriority} />
          <AiItem label="Confidence" value={report.aiConfidence} />
        </div>
      </div>

      {/* ===== MAP ===== */}
      {mapUrl && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-slate-600" />
            <h3 className="text-base font-semibold text-slate-900">
              Location
            </h3>
          </div>

          <iframe
            title="map"
            src={mapUrl}
            className="w-full h-72 rounded-lg border"
            loading="lazy"
          />
        </div>
      )}

      {/* ===== IMAGES ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {report.photoUrl && (
          <ImageCard title="Citizen Image" src={report.photoUrl} />
        )}

        {report.streetImageUrl && (
          <ImageCard
            title="Resolution Proof"
            src={report.streetImageUrl}
          />
        )}
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function InfoItem({ icon, label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 font-medium text-slate-900">{value}</p>
    </div>
  );
}

function AiItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium text-slate-900">{value}</p>
    </div>
  );
}

function ImageCard({ title, src }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-sm font-medium text-slate-600 mb-2">
        {title}
      </p>
      <img
        src={src}
        alt={title}
        className="w-full h-64 object-cover rounded-lg"
      />
    </div>
  );
}
