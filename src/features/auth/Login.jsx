import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrafficIcon from "@mui/icons-material/Traffic";

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
            <TrafficIcon sx={{ fontSize: 24, color: "#0f172a" }} />
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900">
              KifTari2
            </div>
            <p className="text-xs text-slate-500">Municipal Dashboard</p>
          </div>
        </div>

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="name@municipality.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-6 py-3 rounded-xl hover:bg-primarySoft disabled:opacity-50"
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
              className="text-xs text-primary hover:text-primarySoft"
            >
              Forgot password
            </button>
          </div>

        {forgotOpen ? (
          <div className="mt-5 border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Reset Password
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Enter your email and we will send a reset link.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              />
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-700 disabled:opacity-50"
              >
                {forgotLoading ? "Sending..." : "Send Reset Email"}
              </button>
            </form>
            {forgotMessage ? (
              <div className="text-xs text-slate-600 mt-3">
                {forgotMessage}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
