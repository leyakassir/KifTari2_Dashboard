import { useEffect, useState } from "react";
import { Loader2, User, MailCheck, Send } from "lucide-react";
import api from "../../api/api";

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString();
}

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifyInput, setVerifyInput] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const extractToken = (input) => {
    if (!input) return "";
    const trimmed = input.trim();
    if (trimmed.includes("token=")) {
      const tokenPart = trimmed.split("token=")[1] || "";
      return tokenPart.split("&")[0] || "";
    }
    return trimmed;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setErrorMessage("");
        const res = await api.get("/auth/me");
        const profile = res.data?.user || null;
        setUser(profile);
        setForm({
          firstName: profile?.firstName || "",
          lastName: profile?.lastName || "",
          email: profile?.email || "",
        });
      } catch (err) {
        console.error(err);
        setErrorMessage(
          err.response?.data?.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-8 flex justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <User className="text-emerald-300" size={20} />
          <h2 className="text-lg font-semibold text-slate-100">
            Admin Profile
          </h2>
        </div>

        {errorMessage ? (
          <div className="text-sm text-red-600">{errorMessage}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300 mt-4">
              <div>
                <div className="text-xs text-slate-400">Role</div>
                <div className="font-medium text-slate-100">
                  {user?.role || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Email Verified</div>
                <div className="font-medium text-slate-100">
                  {user?.emailVerified ? "Yes" : "No"}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Member Since</div>
                <div className="font-medium text-slate-100">
                  {formatDate(user?.createdAt)}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800/60 pt-6">
              <button
                onClick={() => setShowProfileForm((prev) => !prev)}
                className="px-4 py-2 rounded-lg border border-slate-800/60 text-slate-300 hover:bg-slate-900/60 text-sm"
              >
                {showProfileForm ? "Hide Update Profile" : "Update Profile"}
              </button>

              {showProfileForm ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      setSaving(true);
                      const res = await api.patch("/auth/profile", {
                        firstName: form.firstName.trim(),
                        lastName: form.lastName.trim(),
                        email: form.email.trim(),
                      });
                      const updated = res.data?.user || user;
                      setUser(updated);
                      setForm({
                        firstName: updated?.firstName || "",
                        lastName: updated?.lastName || "",
                        email: updated?.email || "",
                      });
                      alert(res.data?.message || "Profile updated");
                    } catch (err) {
                      console.error(err);
                      alert(
                        err.response?.data?.message ||
                          "Failed to update profile"
                      );
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                >
                  <input
                    className="border rounded-lg px-4 py-2"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                  <input
                    className="border rounded-lg px-4 py-2"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                  <input
                    className="border rounded-lg px-4 py-2"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                  <div className="md:col-span-2">
                    <button
                      disabled={saving}
                      className="bg-emerald-400 text-white px-6 py-2 rounded-lg hover:bg-emerald-300 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <div className="text-xs text-slate-400 mt-2">
                      Changing email will require verification.
                    </div>
                  </div>
                </form>
              ) : null}
            </div>

            <div className="mt-6 border-t border-slate-800/60 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MailCheck size={18} className="text-emerald-300" />
                <div className="font-semibold text-slate-100">
                  Email Verification
                </div>
              </div>

              <div className="text-sm text-slate-400 mb-4">
                Status:{" "}
                <span className="font-medium text-slate-100">
                  {user?.emailVerified ? "Verified" : "Not Verified"}
                </span>
              </div>

              <button
                onClick={() => setShowVerifyForm((prev) => !prev)}
                className="px-4 py-2 rounded-lg border border-slate-800/60 text-slate-300 hover:bg-slate-900/60 text-sm"
              >
                {showVerifyForm ? "Hide Verification" : "Verify Email"}
              </button>

              {showVerifyForm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input
                    className="border rounded-lg px-4 py-2"
                    placeholder="Paste verification link or token"
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const token = extractToken(verifyInput);
                        if (!token) {
                          alert("Please paste a verification token or link");
                          return;
                        }
                        setVerifying(true);
                        const url = `${api.defaults.baseURL}/auth/verify-email?token=${token}`;
                        window.open(url, "_blank", "noopener");
                        setTimeout(() => setVerifying(false), 500);
                      }}
                      className="px-4 py-2 rounded-lg border border-slate-800/60 text-slate-300 hover:bg-slate-900/60"
                      disabled={verifying}
                    >
                      {verifying ? "Opening..." : "Open Verify Link"}
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          setResending(true);
                          await api.post("/auth/resend-verification");
                          alert("Verification email sent");
                        } catch (err) {
                          console.error(err);
                          alert(
                            err.response?.data?.message ||
                              "Failed to resend verification email"
                          );
                        } finally {
                          setResending(false);
                        }
                      }}
                      className="px-4 py-2 rounded-lg border border-slate-800/60 text-slate-300 hover:bg-slate-900/60 flex items-center gap-2"
                      disabled={resending}
                    >
                      <Send size={14} />
                      {resending ? "Sending..." : "Resend Email"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-6 border-t border-slate-800/60 pt-6">
              <button
                onClick={() => setShowPasswordForm((prev) => !prev)}
                className="px-4 py-2 rounded-lg border border-slate-800/60 text-slate-300 hover:bg-slate-900/60 text-sm"
              >
                {showPasswordForm ? "Hide Password Form" : "Change Password"}
              </button>

              {showPasswordForm ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (
                      !passwordForm.currentPassword ||
                      !passwordForm.newPassword
                    ) {
                      alert("All password fields are required");
                      return;
                    }
                    if (
                      passwordForm.newPassword !==
                      passwordForm.confirmPassword
                    ) {
                      alert("New passwords do not match");
                      return;
                    }
                    try {
                      setPasswordSaving(true);
                      const res = await api.patch("/auth/change-password", {
                        currentPassword: passwordForm.currentPassword,
                        newPassword: passwordForm.newPassword,
                      });
                      alert(res.data?.message || "Password updated");
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    } catch (err) {
                      console.error(err);
                      alert(
                        err.response?.data?.message ||
                          "Failed to update password"
                      );
                    } finally {
                      setPasswordSaving(false);
                    }
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                >
                  <input
                    className="border rounded-lg px-4 py-2"
                    placeholder="Current Password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                  />
                  <input
                    className="border rounded-lg px-4 py-2"
                    placeholder="New Password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                  <input
                    className="border rounded-lg px-4 py-2"
                    placeholder="Confirm New Password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                  <div className="md:col-span-2">
                    <button
                      disabled={passwordSaving}
                      className="bg-emerald-400 text-white px-6 py-2 rounded-lg hover:bg-emerald-300 disabled:opacity-50"
                    >
                      {passwordSaving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
