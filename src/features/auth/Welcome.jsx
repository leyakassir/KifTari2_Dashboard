import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import maintenanceAnimation from "../../assets/maintenance.json";

export default function Welcome() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100"
      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute bottom-[-20%] right-10 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <img
                src="/logo.png"
                alt="KifTari2 logo"
                className="h-32 w-32 rounded-[30px] bg-white p-4 shadow-2xl sm:h-36 sm:w-36"
              />
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.32em] text-emerald-100/80">
                    KIFTARI2 GOVERNANCE
                  </p>
                  <p className="text-sm text-slate-300">
                    Official municipal operations system
                  </p>
                </div>
                <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                  Road safety management for municipalities
                </h1>
                <p className="text-base text-slate-300">
                  View reported road issues, manage field operators, and track
                  the status of every street issue through a single, centralized
                  dashboard.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300 whitespace-nowrap"
              >
                Continue to login
              </Link>
              <div className="rounded-2xl border border-slate-800/60 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">
                Designed for municipal teams and local authorities
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm text-slate-300">
                Real-time visibility into municipal road operations
              </div>
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 text-sm text-slate-300">
                Secure access for authorized users only
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/50 p-5 backdrop-blur">
            <div className="mb-4 text-xs uppercase tracking-[0.28em] text-slate-400">
              Operations snapshot
            </div>
            <div className="rounded-2xl bg-slate-950/60 p-4">
              <Lottie
                animationData={maintenanceAnimation}
                loop
                className="h-56 w-full opacity-90"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
