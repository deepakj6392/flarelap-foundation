"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Phone, GraduationCap, CheckCircle2, AlertCircle, Loader2, Heart } from "lucide-react";
import Swal from "sweetalert2";

export default function StudentRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState<{ id: string, name: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/courses`);
        const data = await res.json();
        if (res.ok && data.courses && data.courses.length > 0) {
          setCourses(data.courses);
          setCourse(data.courses[0].id);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/student/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, course }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Account created successfully!");
      
      // Professional success alert
      await Swal.fire({
        title: "Registration Successful!",
        text: `Your unique Student ID and temporary password have been dispatched to ${email}.`,
        icon: "success",
        confirmButtonColor: "#4f46e5",
        background: "#ffffff",
        color: "#1e293b",
      });

      setName("");
      setEmail("");
      setPhone("");
      if (courses.length > 0) {
        setCourse(courses[0].id);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
      Swal.fire({
        title: "Error",
        text: err.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
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

      {/* Main card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Enrollment</h2>
          <p className="text-xs text-slate-500 font-semibold">Join our digital education hub and learn for free.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-bold">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 font-bold">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
              Full Name
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
                className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. deepak@gmail.com"
                className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                disabled={loading}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Phone className="h-4 w-4" />
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                disabled={loading}
              />
            </div>
          </div>

          {/* Primary Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
              Select Course Area
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <GraduationCap className="h-4 w-4" />
              </span>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-bold"
                disabled={loading || courses.length === 0}
              >
                {courses.length === 0 ? (
                  <option value="">Loading courses...</option>
                ) : (
                  courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] transition px-5 py-3 text-xs font-black text-white shadow-md shadow-emerald-700/10 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" />
                Registering Account...
              </>
            ) : (
              "Enroll & Get Login Credentials"
            )}
          </button>
        </form>

        {/* Footer text link */}
        <div className="text-center pt-2 border-t text-[11px] font-semibold text-slate-500 flex flex-col items-center gap-3">
          <div>
            Already registered?{" "}
            <Link href="/student/login" className="text-emerald-700 hover:text-emerald-650 hover:underline">
              Login As Student
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
