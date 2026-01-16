import {
  ClipboardCheck,
  Send,
  UserCog,
  CheckCircle,
  Info,
  HelpCircle,
  MapPin,
  FileText,
  Users,
  BarChart3,
} from "lucide-react";

/* ================= STEP ITEM ================= */
function Step({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <div className="font-medium text-slate-900">{title}</div>
        <div className="text-sm text-slate-600">{desc}</div>
      </div>
    </div>
  );
}

/* ================= ACTION CARD ================= */
function ActionCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition">
      <div className="flex items-center gap-3 mb-2">
        <Icon size={18} className="text-primary" />
        <div className="font-medium text-slate-900">{title}</div>
      </div>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  );
}

export default function EmployerDashboard() {
  return (
    <div className="space-y-10">
      {/* ================= MUNICIPALITY INFO ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="text-primary" size={20} />
          <h2 className="text-lg font-semibold text-slate-900">
            Municipality Dashboard
          </h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          This dashboard allows municipality employers to manage citizen reports,
          coordinate field operators, and ensure road and traffic issues are
          handled efficiently within their assigned area.
        </p>
      </div>

      {/* ================= WHAT THIS SYSTEM DOES ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-primary" />
          <h3 className="font-semibold text-slate-900">
            What This System Does
          </h3>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
          KifTari2 is a municipality reporting platform that connects citizens,
          employers, and field operators to streamline the reporting and
          resolution of road and traffic-related issues. The system ensures
          transparency, accountability, and proper documentation for every
          reported incident.
        </p>
      </div>

      {/* ================= REPORT LIFECYCLE ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardCheck size={18} className="text-primary" />
          <h3 className="font-semibold text-slate-900">
            Report Lifecycle
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Step
            icon={Send}
            title="Submitted by Citizen"
            desc="Citizens submit reports with location and description."
          />
          <Step
            icon={UserCog}
            title="Reviewed & Assigned"
            desc="Employer reviews reports and assigns them to operators."
          />
          <Step
            icon={FileText}
            title="Handled on Field"
            desc="Field operators visit the location and resolve the issue."
          />
          <Step
            icon={CheckCircle}
            title="Resolved & Verified"
            desc="Proof is uploaded and the report is marked resolved."
          />
        </div>
      </div>

      {/* ================= QUICK ACCESS ================= */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">
          Quick Access
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            icon={FileText}
            title="Manage Reports"
            desc="Review incoming reports and assign them to field operators."
          />
          <ActionCard
            icon={Users}
            title="Field Operators"
            desc="Create and manage operators working in your municipality."
          />
          <ActionCard
            icon={BarChart3}
            title="Statistics"
            desc="View summarized insights in the statistics section."
          />
        </div>
      </div>

      {/* ================= GUIDELINES & TIPS ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={18} className="text-primary" />
          <h3 className="font-semibold text-slate-900">
            Employer Guidelines
          </h3>
        </div>

        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
          <li>Review reports carefully before assigning them.</li>
          <li>Ensure operators upload proof images after resolution.</li>
          <li>Monitor report progress to avoid delays.</li>
          <li>Maintain clear communication with field operators.</li>
        </ul>
      </div>
    </div>
  );
}
