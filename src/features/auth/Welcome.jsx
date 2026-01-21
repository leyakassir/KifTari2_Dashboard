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
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="h-full w-full bg-[linear-gradient(120deg,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-xs uppercase tracking-[0.32em] text-emerald-100/80">
              KIFTARI2 GOVERNANCE
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl md:text-5xl">
                Road safety management for municipalities
              </h1>
              <p className="text-base text-slate-300 sm:text-lg">
                View reported road issues, manage field operators, and track
                the status of every street issue through a single, centralized
                dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-emerald-300"
              >
                Continue to login
              </Link>
              <div className="rounded-full border border-slate-700/70 px-6 py-3 text-xs uppercase tracking-[0.28em] text-slate-400">
                Designed for municipal teams and local authorities
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-300">
                Real-time visibility into municipal road operations
              </div>
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-300">
                Secure access for authorized users only
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="KifTari2 logo"
                  className="h-16 w-16 rounded-2xl bg-white p-2 shadow-lg"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    Municipal Operations View
                  </p>
                  <p className="text-xs text-slate-400">
                    Live status and reporting overview
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-100/80">
                Active
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-950/70 p-4">
              <Lottie
                animationData={maintenanceAnimation}
                loop
                className="h-64 w-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.3em] text-slate-500">
          <span>Reports</span>
          <span>Operators</span>
          <span>Municipalities</span>
          <span>Street Conditions</span>
        </div>
      </div>
    </div>
  );
}
