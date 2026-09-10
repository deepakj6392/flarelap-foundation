"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  Save,
  GraduationCap
} from "lucide-react";
import { useDashboard } from "../layout";
import Swal from "sweetalert2";

export default function StudentProfilePage() {
  const { student, isDark } = useDashboard();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Read query params for initial tab
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "security") {
        setActiveTab("security");
      }
    }
  }, []);

  // Personal Profile state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [secMsg, setSecMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch full student profile details on mount
  useEffect(() => {
    const fetchLatestProfile = async () => {
      const token = localStorage.getItem("student_token");
      if (!token) return;

      setFetchingProfile(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/auth/student/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setName(data.user.name || "");
          setPhone(data.user.phone || "");
          setAddress(data.user.address || "");
          
          // Update local storage copy
          localStorage.setItem("student_user", JSON.stringify(data.user));
        } else if (student) {
          setName(student.name || "");
          setPhone(student.phone || "");
          setAddress(student.address || "");
        }
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
        if (student) {
          setName(student.name || "");
          setPhone(student.phone || "");
          setAddress(student.address || "");
        }
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchLatestProfile();
  }, [student]);

  if (!student) return null;

  // Handle Save Personal Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (!name || name.trim() === "") {
      setProfileMsg({ type: "error", text: "Full Name is required." });
      return;
    }

    setSavingProfile(true);
    try {
      const token = localStorage.getItem("student_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

      const res = await fetch(`${apiUrl}/api/auth/student/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setProfileMsg({ type: "success", text: "Your profile details have been saved successfully!" });
      
      if (data.user) {
        localStorage.setItem("student_user", JSON.stringify(data.user));
      }

      Swal.fire({
        title: "Profile Updated!",
        text: "Your personal details have been updated and synced with the admin records.",
        icon: "success",
        confirmButtonColor: "#047857",
        timer: 2500
      });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "An error occurred while saving profile." });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Save Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecMsg({ type: "error", text: "Please fill in all password fields." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setSavingPassword(true);
    try {
      const token = localStorage.getItem("student_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      
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

      setSecMsg({ type: "success", text: "Your account password has been changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Swal.fire({
        title: "Password Changed!",
        text: "Your security credentials have been updated.",
        icon: "success",
        confirmButtonColor: "#047857"
      });
    } catch (err: any) {
      setSecMsg({ type: "error", text: err.message || "An error occurred while updating password." });
    } finally {
      setSavingPassword(false);
    }
  };

  const textHeading = isDark ? "text-white" : "text-slate-900";
  const bgCard = isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white shadow-xs";
  const inputStyle = `block w-full rounded-xl border pl-10 pr-4 py-2.5 outline-none text-xs transition font-semibold ${
    isDark
      ? "border-slate-800 bg-slate-950 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      : "border-slate-200 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
  }`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl font-sans">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-black ${textHeading}`}>My Account & Profile Settings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Manage your personal profile details and account security credentials.
          </p>
        </div>

        {/* Tab Navigation Switches */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Security Settings</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PERSONAL PROFILE */}
      {activeTab === "profile" && (
        <div className="space-y-6">

          {profileMsg && (
            <div className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs font-bold animate-in fade-in ${
              profileMsg.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40"
                : "border-red-200 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/40"
            }`}>
              {profileMsg.type === "success" ? <CheckCircle2 className="h-4.5 w-4.5 shrink-0" /> : <AlertCircle className="h-4.5 w-4.5 shrink-0" />}
              <p>{profileMsg.text}</p>
            </div>
          )}

          <div className={`rounded-2xl border p-6 sm:p-8 ${bgCard} space-y-6`}>
            
            {/* Header info card */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 font-black text-lg">
                  {student.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className={`text-sm font-black ${textHeading}`}>{student.name}</h3>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                    Student ID: {student.student_id}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <h3 className="text-xs font-extrabold border-b pb-3 uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Personal Information
              </h3>

              {fetchingProfile ? (
                <div className="flex items-center justify-center py-10 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-400">Loading student details...</span>
                </div>
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Deepak Kumar"
                          className={inputStyle}
                          disabled={savingProfile}
                        />
                      </div>
                    </div>

                    {/* Email Address (Read-only) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Email Address <span className="text-[10px] text-slate-400 font-normal">(Registered Login ID)</span>
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Mail className="h-4 w-4" />
                        </span>
                        <input
                          type="email"
                          disabled
                          value={student.email}
                          className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 font-semibold cursor-not-allowed select-all"
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Phone className="h-4 w-4" />
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className={inputStyle}
                          disabled={savingProfile}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Full Address
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute top-3 left-0 flex items-center pl-3.5 text-slate-400">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your street address, village/city, district, state & pincode"
                        className={`block w-full rounded-xl border pl-10 pr-4 py-2.5 outline-none text-xs transition font-semibold ${
                          isDark
                            ? "border-slate-800 bg-slate-950 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            : "border-slate-200 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                        }`}
                        disabled={savingProfile}
                      />
                    </div>
                  </div>

                  {/* Submit Action */}
                  <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] transition px-6 py-3 text-xs font-black text-white shadow-md shadow-emerald-700/10 cursor-pointer disabled:opacity-50"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving Profile...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Profile Details
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY SETTINGS */}
      {activeTab === "security" && (
        <div className="space-y-6">

          {secMsg && (
            <div className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs font-bold animate-in fade-in ${
              secMsg.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40"
                : "border-red-200 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/40"
            }`}>
              {secMsg.type === "success" ? <CheckCircle2 className="h-4.5 w-4.5 shrink-0" /> : <AlertCircle className="h-4.5 w-4.5 shrink-0" />}
              <p>{secMsg.text}</p>
            </div>
          )}

          <div className={`rounded-2xl border p-6 sm:p-8 ${bgCard} space-y-6`}>
            <h3 className="text-xs font-extrabold border-b pb-3 uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Update Account Password
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
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
                    className={inputStyle}
                    disabled={savingPassword}
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
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPassword2 ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 6 chars)"
                      className={inputStyle}
                      disabled={savingPassword}
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
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
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
                      className={inputStyle}
                      disabled={savingPassword}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] transition px-6 py-3 text-xs font-black text-white shadow-md shadow-emerald-700/10 cursor-pointer disabled:opacity-50"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Save New Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
