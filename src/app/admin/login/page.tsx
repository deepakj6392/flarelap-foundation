"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  CheckCircle2,
  LockKeyhole
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  
  // Views: login, forgot (request OTP), reset (verify and set new password), tfa (2-step login verification)
  const [view, setView] = useState<"login" | "forgot" | "reset" | "tfa">("login");
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [tfaCode, setTfaCode] = useState("");
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Sign In handler (Step 1)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      // Check if TFA is required
      if (data.tfa_required) {
        setSuccess(data.message || "TFA code generated and emailed.");
        setTfaCode(""); // Clear old input
        setTimeout(() => {
          setSuccess(null);
          setView("tfa");
        }, 1500);
        return;
      }

      // Standard Login Success (TFA Disabled)
      localStorage.setItem("admin_token", data.access_token || data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 2. TFA Sign In Verification (Step 2)
  const handleTfaVerifyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!tfaCode || tfaCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, otp: tfaCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "TFA validation failed.");
      }

      // Authentication Complete
      setSuccess("Verification successful. Redirecting...");
      localStorage.setItem("admin_token", data.access_token || data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Request Reset Password OTP handler
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!resetEmail) {
      setError("Please enter your registered email address.");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to request OTP code.");
      }

      setSuccess(data.message);
      setTimeout(() => {
        setSuccess(null);
        setView("reset");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Reset Password handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otp || !newPassword || !confirmPassword) {
      setError("Please fill in all verification and password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: resetEmail, 
          otp: otp.trim(), 
          newPassword 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess(data.message);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      
      setPassword("");
      setEmail(resetEmail);

      setTimeout(() => {
        setSuccess(null);
        setView("login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-900 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 -left-40 h-96 w-96 rounded-full bg-emerald-700/10 blur-3xl" />
      <div className="absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-blue-700/10 blur-3xl" />

      {/* Floating Card Container */}
      <div className="relative w-full max-w-md space-y-7 rounded-2xl border border-slate-800 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-xl transition duration-500 hover:border-slate-700/50 sm:p-10">
        
        {/* Go Back Link */}
        {view === "login" && (
          <div className="absolute top-6 left-6">
            <Link
              href="/"
              className="group flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-emerald-400"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>
        )}

        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center pt-4">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950">
              <Image
                src="/logo.png"
                alt="Flarelap Global Foundation logo"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-contain"
                priority
              />
            </div>
          </div>
          
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {view === "login" && "Admin Portal"}
            {view === "forgot" && "Forgot Password"}
            {view === "reset" && "Verify Reset Code"}
            {view === "tfa" && "TFA Authentication"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {view === "login" && "Sign in as Super Admin to manage the foundation"}
            {view === "forgot" && "Verify your identity using email OTP"}
            {view === "reset" && "Set a secure new password for your account"}
            {view === "tfa" && "Verify the code dispatched to your Gmail account"}
          </p>
        </div>

        {/* Alert Error Message */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-xs text-red-400 animate-in fade-in duration-200">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Alert Success Message */}
        {success && (
          <div className="flex items-center gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-4 text-xs text-emerald-400 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            <p className="font-semibold">{success}</p>
          </div>
        )}

        {/* ==================== VIEW 1: SIGN IN ==================== */}
        {view === "login" && (
          <form className="space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-10.5 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:bg-slate-900/80 focus:ring-1 focus:ring-emerald-500"
                    placeholder="flarelap.org@gmail.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccess(null);
                      setResetEmail(email || "flarelap.org@gmail.com");
                      setView("forgot");
                    }}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-10.5 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:bg-slate-900/80 focus:ring-1 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-emerald-400 transition"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        )}

        {/* ==================== VIEW 2: FORGOT PASSWORD ==================== */}
        {view === "forgot" && (
          <form className="space-y-6" onSubmit={handleRequestOtp}>
            <div className="space-y-4">
              <div>
                <label htmlFor="resetEmail" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Registered Email Address
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    id="resetEmail"
                    name="resetEmail"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="block w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-10.5 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:bg-slate-900/80 focus:ring-1 focus:ring-emerald-500"
                    placeholder="flarelap.org@gmail.com"
                  />
                </div>
                <p className="mt-2 text-[10.5px] text-slate-500 leading-relaxed">
                  We will transmit a 6-digit verification code to this inbox if registered as Super Admin.
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Request OTP Code"
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setView("login");
                }}
                className="group inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ==================== VIEW 3: VERIFY & RESET ==================== */}
        {view === "reset" && (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              {/* OTP Code Input */}
              <div>
                <label htmlFor="otp" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Verification OTP Code
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="block w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-10.5 pr-4 text-sm font-extrabold tracking-[0.25em] text-emerald-400 placeholder-slate-600 outline-none transition focus:border-emerald-500 focus:bg-slate-900/80 focus:ring-1 focus:ring-emerald-500 text-center"
                    placeholder="000000"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  New Password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-10.5 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:bg-slate-900/80 focus:ring-1 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-emerald-400 transition"
                  >
                    {showNewPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-10.5 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:bg-slate-900/80 focus:ring-1 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-emerald-400 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password & Sign In"
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setView("forgot");
                }}
                className="group inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
                Resend OTP / Back
              </button>
            </div>
          </form>
        )}

        {/* ==================== VIEW 4: TFA LOGIN VERIFICATION ==================== */}
        {view === "tfa" && (
          <form className="space-y-6" onSubmit={handleTfaVerifyLogin}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <LockKeyhole className="h-6 w-6 animate-pulse" />
                </div>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                  We have dispatched a 6-digit verification code to <strong>{email}</strong>. Please enter the code below to complete sign-in.
                </p>
              </div>

              <div>
                <label htmlFor="tfaCode" className="block text-xs font-bold uppercase tracking-wider text-slate-300 text-center">
                  TFA Code
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                  </div>
                  <input
                    id="tfaCode"
                    name="tfaCode"
                    type="text"
                    required
                    maxLength={6}
                    value={tfaCode}
                    onChange={(e) => setTfaCode(e.target.value.replace(/\D/g, ""))}
                    className="block w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-10.5 pr-4 text-sm font-extrabold tracking-[0.25em] text-emerald-400 placeholder-slate-600 outline-none transition focus:border-emerald-500 focus:bg-slate-900/80 focus:ring-1 focus:ring-emerald-500 text-center"
                    placeholder="000000"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying OTP...
                  </>
                ) : (
                  "Verify & Log In"
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setView("login");
                }}
                className="group inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
                Cancel & Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
