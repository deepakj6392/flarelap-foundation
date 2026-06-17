"use client";

import { useState } from "react";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useDashboard } from "../layout";

export default function SecuritySettingsPage() {
  const { student, isDark } = useDashboard();

  // Profile update states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  if (!student) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setProfileError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileError("New passwords do not match.");
      return;
    }

    setProfileLoading(true);
    try {
      const token = localStorage.getItem("student_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${apiUrl}/api/auth/student/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      setProfileSuccess("Your password has been changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An error occurred while changing password.";
      setProfileError(errMsg);
    } finally {
      setProfileLoading(false);
    }
  };

  const textHeading = isDark ? "text-white" : "text-slate-900";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl font-sans">
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className={`text-lg font-black ${textHeading}`}>Student Security Settings</h2>
        <p className="text-xs text-slate-505 dark:text-slate-400 font-semibold mt-1">Configure security credentials and update account profile.</p>
      </div>

      {profileError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-707 font-bold animate-in fade-in">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{profileError}</p>
        </div>
      )}

      {profileSuccess && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-707 font-bold animate-in fade-in">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <p>{profileSuccess}</p>
        </div>
      )}

      <div className={`rounded-2xl border p-6 shadow-xs space-y-6 ${
        isDark ? "border-slate-800 bg-slate-900/30" : "border-slate-200 bg-white"
      }`}>
        <h3 className="text-xs font-extrabold border-b pb-3 uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Update Account Password
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Current Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword1 ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 outline-none text-xs transition font-semibold ${
                  isDark
                    ? "border-slate-800 bg-slate-950 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    : "border-slate-200 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                }`}
                disabled={profileLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword1(p => !p)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword1 ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-405">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword2 ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 outline-none text-xs transition font-semibold ${
                    isDark
                      ? "border-slate-800 bg-slate-955 bg-slate-950 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      : "border-slate-200 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  }`}
                  disabled={profileLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(p => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword2 ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-605 dark:text-slate-400 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword2 ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 outline-none text-xs transition font-semibold ${
                    isDark
                      ? "border-slate-800 bg-slate-955 bg-slate-950 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      : "border-slate-200 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  }`}
                  disabled={profileLoading}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-705 bg-emerald-700 hover:bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/10 transition disabled:opacity-50 cursor-pointer"
            >
              {profileLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                  Saving changes...
                </>
              ) : (
                "Save New Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
