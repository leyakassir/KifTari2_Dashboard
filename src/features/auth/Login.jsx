import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const API_BASE = "https://kiftari2-backend.onrender.com/api";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "employer") {
        navigate("/employer");
      } else if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotMessage("Please enter your email.");
      return;
    }

    try {
      setForgotLoading(true);
      setForgotMessage("");
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }
      setForgotMessage(
        data.message || "If the email exists, a reset link has been sent."
      );
    } catch (err) {
      setForgotMessage(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="h-full w-full bg-[linear-gradient(120deg,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
      </div>

      <div
        className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center"
        style={{ fontFamily: "'Source Sans 3', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <img
            src="/logo.png"
            alt="KifTari2 logo"
            className="h-24 w-24 rounded-[24px] bg-white p-3 shadow-2xl sm:h-28 sm:w-28"
          />
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.32em] text-emerald-100/80">
              KIFTARI2 GOVERNANCE
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
              Municipal dashboard login
            </h1>
            <p className="text-sm text-slate-300">
              Sign in to review reports, manage operators, and track municipal
              street conditions.
            </p>
          </div>
        </div>

        <div className="mt-10 w-full rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur">
          {error ? (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Email
              </label>
              <input
                type="email"
                placeholder="name@municipality.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Password
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={() => {
                setForgotOpen((prev) => !prev);
                setForgotMessage("");
              }}
              className="text-xs text-emerald-200 hover:text-emerald-100"
            >
              Forgot password
            </button>
          </div>

          {forgotOpen ? (
            <div className="mt-5 rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
              <div className="mb-2 text-xs font-semibold text-slate-200">
                Reset Password
              </div>
              <p className="mb-3 text-xs text-slate-400">
                Enter your email and we will send a reset link.
              </p>
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full rounded-2xl bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Email"}
                </button>
              </form>
              {forgotMessage ? (
                <div className="mt-3 text-xs text-slate-300">
                  {forgotMessage}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
