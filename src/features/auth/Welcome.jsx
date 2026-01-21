import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-1/4 right-[-10%] h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* Animated grid */}
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.2)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-slate-100">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[32px] bg-emerald-400/10 blur-2xl animate-pulse" />
              <img
                src="/logo.png"
                alt="KifTari2 logo"
                className="relative h-24 w-24 rounded-2xl bg-white/90 p-3 shadow-lg"
              />
            </div>

            <div className="space-y-3">
              <p
                className="text-xs uppercase tracking-[0.35em] text-emerald-200/80"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                KifTari2 Governance
              </p>
              <h1
                className="text-3xl font-semibold text-slate-50 sm:text-4xl md:text-5xl"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Practical road safety oversight for municipalities
              </h1>
              <p
                className="text-base text-slate-300 sm:text-lg"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Review reports, manage field operators, and track street
                conditions. Access your dashboard below.
              </p>
            </div>

            <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/login"
                className="group inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-emerald-300"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Go to login
                <span className="ml-2 text-base transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <div className="rounded-full border border-slate-700/70 px-6 py-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                Used by municipal teams
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Operational view for municipal staff
          </div>
          <span>Secure access begins at login</span>
        </div>
      </div>
    </div>
  );
}
