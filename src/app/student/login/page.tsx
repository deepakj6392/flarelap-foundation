"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, Key } from "lucide-react";
import Swal from "sweetalert2";

export default function StudentLoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendOtp = async (e: React.MouseEvent) => {
    if (!loginId) {
      setError("Please enter your Email Address.");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/student/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }
      setOtpSent(true);
      setSuccess(`OTP sent successfully! For local testing, code is ${data.otp}`);
      
      Swal.fire({
        title: "OTP Dispatched!",
        text: `We have sent a verification code to your email. (Use test code: ${data.otp})`,
        icon: "success",
        confirmButtonColor: "#047857"
      });
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginId || !otp) {
      setError("Please enter both Login ID and OTP.");
      return;
    }
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/student/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid OTP verification.");
      }

      // Save token and info
      localStorage.setItem("student_token", data.token);
      localStorage.setItem("student_user", JSON.stringify(data.user));

      // Show temporary toast success
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: "Authenticated successfully"
      });

      // Smart redirect
      const params = new URLSearchParams(window.location.search);
      const queryRedirect = params.get("redirect");
      if (queryRedirect) {
        router.push(queryRedirect);
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eefdf4_45%,#fffbeb_100%)] flex flex-col items-center justify-center p-5 font-sans">
      
      {/* Brand logo header */}
      <Link href="/" className="flex items-center gap-2 mb-6">
        <Image
          src="/logo.png"
          alt="Flarelap logo"
          width={44}
          height={44}
          className="h-10 w-10 rounded-full object-contain"
        />
        <div>
          <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">Flarelap</h1>
          <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest mt-0.5">Learning Portal</p>
        </div>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Login</h2>
          <p className="text-xs text-slate-500 font-semibold">Sign in securely using Email OTP.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-bold">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-805 font-bold">
            <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* User ID / Email */}
          <div>
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="Enter your email address"
                  className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                  disabled={loading || otpSent}
                />
              </div>
              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition active:scale-[0.98] border-none shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* OTP Code Entry */}
          {otpSent && (
            <div className="space-y-1.5 animate-in fade-in duration-300">
              <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
                Enter 6-Digit OTP Code
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Key className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP (e.g. 000000)"
                  className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold font-mono"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Sign In Button */}
          {otpSent && (
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] transition px-5 py-3 text-xs font-black text-white shadow-md shadow-emerald-700/10 disabled:opacity-50 cursor-pointer border-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" />
                  Verifying OTP...
                </>
              ) : (
                "Verify & Sign In"
              )}
            </button>
          )}
        </form>

        {/* Footer links */}
        <div className="text-center pt-2 border-t text-[11px] font-semibold text-slate-500 flex flex-col items-center gap-3">
          <div>
            New student?{" "}
            <Link href="/student/register" className="text-emerald-700 hover:text-emerald-650 hover:underline">
              Register & Get ID
            </Link>
          </div>
          <Link 
            href="/" 
            className="text-slate-500 hover:text-emerald-700 hover:underline text-[10.5px] font-bold"
          >
            &#8592; Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
