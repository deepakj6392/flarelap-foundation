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
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginId || !password) {
      setError("Please enter your User ID or Email and Password.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
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

      router.push("/student/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in.");
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
          <p className="text-xs text-slate-500 font-semibold">Sign in to access courses and mcq practice tests.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-bold">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* User ID / Email */}
          <div>
            <label className="block text-xs font-bold text-slate-555 uppercase tracking-wider mb-2">
              Student ID or Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Key className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter Student ID (e.g., DEE-4912) or Email"
                className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-555 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                className="block w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-650"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] transition px-5 py-3 text-xs font-black text-white shadow-md shadow-emerald-700/10 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              "Sign In to Learning Portal"
            )}
          </button>
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
