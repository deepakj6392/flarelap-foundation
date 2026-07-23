"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  LockKeyhole,
  Phone,
  MapPin,
  Globe,
  Link as LinkIcon,
  X,
  Upload,
  Image as ImageIcon
} from "lucide-react";

export default function ProfilePage() {
  // Tab state
  const [activeTab, setActiveTab] = useState("branding");

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Security state
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  
  // Site settings state
  const [sitePhone, setSitePhone] = useState("");
  const [siteEmail, setSiteEmail] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [xLink, setXLink] = useState("");
  const [youtube, setYoutube] = useState("");
  const [logoUrl, setLogoUrl] = useState<string>("/logo.png");
  const [logoError, setLogoError] = useState<string | null>(null);

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [tfaLoading, setTfaLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Fetch current user status and site configurations on load
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await fetchProfileStatus();
      await fetchSiteSettings();
      setLoading(false);
    };
    initData();
  }, []);

  const fetchProfileStatus = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/profile/status`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load profile details.");
      }
      setName(data.user.name);
      setEmail(data.user.email);
      setTfaEnabled(data.user.tfa_enabled);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve profile data.");
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/site-settings`);
      const data = await res.json();
      if (res.ok && data.setting) {
        setSitePhone(data.setting.phone);
        setSiteEmail(data.setting.email);
        setSiteLocation(data.setting.location);
        setSiteAddress(data.setting.address);
        setFacebook(data.setting.facebook);
        setInstagram(data.setting.instagram);
        setXLink(data.setting.xLink);
        setYoutube(data.setting.youtube);
        if (data.setting.logoUrl) {
          setLogoUrl(data.setting.logoUrl);
        }
      }
    } catch (err: any) {
      console.error("Error loading site settings:", err);
    }
  };

  const handleLogoUpload = (file: File) => {
    setLogoError(null);
    const maxSizeBytes = 3 * 1024 * 1024; // 3MB limit
    if (file.size > maxSizeBytes) {
      setLogoError(`Logo file size exceeds 3MB limit! (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
    };
    reader.onerror = () => {
      setLogoError("Failed to read logo image file.");
    };
    reader.readAsDataURL(file);
  };

  // Handle Profile Details update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email) {
      setError("Name and Email address are required fields.");
      return;
    }

    if (password) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    }

    setProfileSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/profile/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          ...(password ? { password } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save profile changes.");
      }

      setSuccess("Profile details saved successfully.");
      setPassword("");
      setConfirmPassword("");
      
      // Update local storage representation
      localStorage.setItem("admin_user", JSON.stringify(data.user));
    } catch (err: any) {
      setError(err.message || "An error occurred while saving profile changes.");
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Site Settings update
  const handleUpdateSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSettingsSaving(true);

    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/site-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: sitePhone,
          email: siteEmail,
          location: siteLocation,
          address: siteAddress,
          facebook,
          instagram,
          xLink,
          youtube,
          logoUrl
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save site configurations.");
      }

      setSuccess("Site settings and Logo updated successfully.");
    } catch (err: any) {
      setError(err.message || "An error occurred while saving site configurations.");
    } finally {
      setSettingsSaving(false);
    }
  };

  // TFA 1. Send OTP request
  const handleRequestTfa = async () => {
    setTfaLoading(true);
    setError(null);
    setModalError(null);
    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/tfa/request`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to dispatch TFA verification code.");
      }

      setOtp("");
      setOtpModalOpen(true);
    } catch (err: any) {
      setError(err.message || "An error occurred while initializing TFA request.");
    } finally {
      setTfaLoading(false);
    }
  };

  // TFA 2. Enable TFA with OTP verification
  const handleVerifyAndEnableTfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!otp || otp.length !== 6) {
      setModalError("Please enter a valid 6-digit OTP code.");
      return;
    }

    setTfaLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/tfa/enable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Verification code failed.");
      }

      setTfaEnabled(true);
      setOtpModalOpen(false);
      setSuccess("Two-Factor Authentication (TFA) has been enabled.");
    } catch (err: any) {
      setModalError(err.message || "Failed to verify TFA code.");
    } finally {
      setTfaLoading(false);
    }
  };

  // TFA 3. Disable TFA
  const handleDisableTfa = async () => {
    const isDark = document.querySelector(".dark") !== null;
    const result = await Swal.fire({
      title: "Disable TFA?",
      text: "Are you sure you want to disable Two-Factor Authentication (TFA)? This will decrease your account security.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, disable it",
      cancelButtonText: "No, keep it enabled",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#1e293b",
    });

    if (!result.isConfirmed) {
      return;
    }

    setTfaLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/tfa/disable`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to disable TFA.");
      }

      setTfaEnabled(false);
      setSuccess("Two-Factor Authentication (TFA) has been disabled.");
    } catch (err: any) {
      setError(err.message || "An error occurred while disabling TFA.");
    } finally {
      setTfaLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-xs text-slate-500 font-semibold">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Update Profile & Settings</h2>
        <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">Configure profile details and manage live site configurations.</p>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => { setActiveTab("branding"); setError(null); setSuccess(null); }}
          className={`flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold transition border-b-2 outline-none whitespace-nowrap ${
            activeTab === "branding"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          Site Logo & Branding
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("security"); setError(null); setSuccess(null); }}
          className={`flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold transition border-b-2 outline-none whitespace-nowrap ${
            activeTab === "security"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <LockKeyhole className="h-4 w-4" />
          Account Security
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("contact"); setError(null); setSuccess(null); }}
          className={`flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold transition border-b-2 outline-none whitespace-nowrap ${
            activeTab === "contact"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <MapPin className="h-4 w-4" />
          Contact & Location Info
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("social"); setError(null); setSuccess(null); }}
          className={`flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold transition border-b-2 outline-none whitespace-nowrap ${
            activeTab === "social"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <Globe className="h-4 w-4" />
          Social Networks Info
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/5 dark:bg-red-500/10 p-4 text-xs text-red-600 dark:text-red-400 font-bold">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === "branding" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <ImageIcon className="h-4.5 w-4.5 text-emerald-500" />
            Website Brand Logo & Site Branding
          </h3>

          <form onSubmit={handleUpdateSiteSettings} className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-6">
              {/* Logo Preview */}
              <div className="relative h-28 w-28 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-white dark:bg-slate-900 flex items-center justify-center p-2 shrink-0 shadow-sm overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Website Brand Logo" className="h-full w-full object-contain" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-slate-400" />
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Upload Dynamic Site Logo (Max 3MB)
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Upload your official website brand logo (PNG/JPG). Updating logo here dynamically updates it across Header, Footer, Admin Console, and Student Learning Portal.
                </p>

                <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start pt-1">
                  <label className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition shadow-sm">
                    <Upload className="h-4 w-4" />
                    Choose New Logo Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleLogoUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  {logoUrl && logoUrl !== "/logo.png" && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl("/logo.png")}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold underline cursor-pointer"
                    >
                      Reset to Default Logo
                    </button>
                  )}
                </div>
                {logoError && <p className="text-xs text-red-500 font-bold mt-1">{logoError}</p>}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={settingsSaving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition px-6 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50 cursor-pointer border-none"
              >
                {settingsSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Logo...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Save Logo & Branding Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "security" && (
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          {/* Account Form */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-emerald-500" />
              Account Information
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800/80 my-4" />

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Change Password (Optional)</h4>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1">Leave these fields blank if you do not wish to update your password.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      New Password
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 pr-9 py-2.5 transition text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 pr-9 py-2.5 transition text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(p => !p)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition px-5 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50"
                >
                  {profileSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* TFA Status Manager */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <LockKeyhole className="h-4.5 w-4.5 text-emerald-500" />
                Two-Factor Authentication
              </h3>

              <div className="mt-5 space-y-4">
                <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed font-medium">
                  TFA introduces an additional layer of security by requiring a unique 6-digit email validation code during login attempts.
                </p>

                <div className="flex items-center gap-2.5 mt-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-355">Status:</span>
                  {tfaEnabled ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Enabled (Highly Secure)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1 text-[10px] font-bold text-yellow-600 dark:text-yellow-400">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Disabled (Vulnerable)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8">
              {tfaEnabled ? (
                <button
                  type="button"
                  onClick={handleDisableTfa}
                  disabled={tfaLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-800/80 bg-red-50/50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10 transition px-4 py-3 text-xs font-bold text-red-600 dark:text-red-500"
                >
                  {tfaLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Disable TFA Security"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestTfa}
                  disabled={tfaLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition px-4 py-3 text-xs font-bold text-white shadow-md"
                >
                  {tfaLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Enable Two-Factor Security"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <MapPin className="h-4.5 w-4.5 text-emerald-500" />
            Contact & Head Office Location Details
          </h3>

          <form onSubmit={handleUpdateSiteSettings} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Support Email Address
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={siteEmail}
                    onChange={(e) => setSiteEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Support Phone Number
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={sitePhone}
                    onChange={(e) => setSitePhone(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Head Office Location (e.g. Country/State)
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Globe className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={siteLocation}
                    onChange={(e) => setSiteLocation(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Physical Head Office Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute top-3 left-3 text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <textarea
                  required
                  rows={3}
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={settingsSaving}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition px-5 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50"
              >
                {settingsSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "social" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Globe className="h-4.5 w-4.5 text-emerald-500" />
            Social Media Networks URLs
          </h3>

          <form onSubmit={handleUpdateSiteSettings} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Facebook Link
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Instagram Link
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Twitter / X Link
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    value={xLink}
                    onChange={(e) => setXLink(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  YouTube Link
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={settingsSaving}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition px-5 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50"
              >
                {settingsSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TFA Setup OTP Code Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl relative">
            <button 
              onClick={() => setOtpModalOpen(false)} 
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center pt-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-4">Confirm TFA Activation</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                We have transmitted a 6-digit confirmation code to <strong>{email}</strong>. Please enter the OTP to enable TFA.
              </p>
            </div>

            {modalError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/5 dark:bg-red-500/10 p-3 text-[11px] text-red-600 dark:text-red-400 font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{modalError}</p>
              </div>
            )}

            <form onSubmit={handleVerifyAndEnableTfa} className="mt-5 space-y-4">
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 text-center text-lg font-extrabold tracking-[0.3em] placeholder-slate-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={tfaLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50 transition"
                >
                  {tfaLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Verify & Enable"
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
