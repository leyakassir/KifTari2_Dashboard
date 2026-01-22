import {
  ShieldCheck,
  Users,
  Building2,
  FileText,
  AlertTriangle,
} from "lucide-react";

function ActionCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 hover:shadow-sm transition">
      <div className="flex items-center gap-3 mb-2">
        <Icon size={18} className="text-emerald-300" />
        <div className="font-medium text-slate-100">{title}</div>
      </div>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="text-emerald-300" size={20} />
          <h2 className="text-lg font-semibold text-slate-100">
            Super Admin Governance
          </h2>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
          This console provides system-wide oversight for KifTari2. Monitor
          municipalities, manage users safely, and keep governance controls
          consistent across the platform.
        </p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-emerald-300" />
          <h3 className="font-semibold text-slate-100">Governance Rules</h3>
        </div>

        <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
          <li>Users can be deactivated, not deleted.</li>
          <li>Municipalities stay auditable even when inactive.</li>
          <li>Admin insights are read-only for safe oversight.</li>
          <li>Assignments remain under employer control.</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-slate-100 mb-4">Quick Access</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard
            icon={Users}
            title="User Audit"
            desc="Review users by role and activate/deactivate accounts."
          />
          <ActionCard
            icon={Building2}
            title="Municipalities"
            desc="Review health metrics and manage municipality status."
          />
          <ActionCard
            icon={FileText}
            title="Statistics"
            desc="System-level statistics and read-only report visibility."
          />
          <ActionCard
            icon={ShieldCheck}
            title="Employers"
            desc="Create and monitor employer accounts with status control."
          />
        </div>
      </div>
    </div>
  );
}
