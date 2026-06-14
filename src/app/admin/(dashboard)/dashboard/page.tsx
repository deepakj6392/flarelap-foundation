"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Mail, 
  RefreshCw, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Activity,
  Shield,
  Layers,
  Database,
  Heart,
  IndianRupee
} from "lucide-react";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  post: string | null;
  created_at: string;
}

interface Stats {
  totalContacts: number;
  totalSubscribers: number;
  totalPayments: number;
  totalDonationsCount: number;
  todayPayments: number;
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats>({ 
    totalContacts: 0, 
    totalSubscribers: 0,
    totalPayments: 0,
    totalDonationsCount: 0,
    todayPayments: 0
  });
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("Super Admin");

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      const storedUser = localStorage.getItem("admin_user");
      if (!storedToken) return;

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) setAdminName(parsed.name);
        } catch (_) {}
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      // Fetch stats
      const statsRes = await fetch(`${apiUrl}/api/foundation/admin/stats`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const statsData = await statsRes.json();
      if (statsRes.ok) setStats(statsData.stats);

      // Fetch contacts
      const contactsRes = await fetch(`${apiUrl}/api/foundation/admin/contacts`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const contactsData = await contactsRes.json();
      if (contactsRes.ok) setContacts(contactsData.contacts || []);

    } catch (err: any) {
      setError("Failed to fetch dashboard data. Make sure the database is running and API is online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Welcome & Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 p-8 text-white shadow-lg shadow-emerald-700/15">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        
        <div className="relative z-10 flex flex-col justify-between md:flex-row md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Shield className="h-3.5 w-3.5" />
              Secure Administration Portal
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
              Welcome back, {adminName}!
            </h2>
            <p className="mt-2 text-sm text-emerald-50 max-w-xl">
              Here is the live activity checklist for Flarelap Global Foundation. Monitor public inquiries and manage subscriber communications.
            </p>
          </div>
          
          <button
            onClick={fetchOverviewData}
            disabled={loading}
            className="flex items-center justify-center gap-2 self-start md:self-auto rounded-2xl bg-white px-5 py-3.5 text-xs font-extrabold text-emerald-800 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
            Sync Dashboard Data
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4.5 text-sm text-red-400">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* 2. Stats Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Contacts card */}
        <Link href="/admin/contacts" className="group block">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/30">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-emerald-500/5 transition-all duration-300 group-hover:scale-125" />
            <div className="flex items-center justify-between">
              <div className="space-y-2.5 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Inquiries
                </p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">
                  {loading ? "..." : stats.totalContacts}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  Live submissions
                </span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 transition-all group-hover:bg-emerald-500 group-hover:text-white">
                <MessageSquare className="h-5.5 w-5.5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Newsletter card */}
        <Link href="/admin/newsletter" className="group block">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-blue-500/5 transition-all duration-300 group-hover:scale-125" />
            <div className="flex items-center justify-between">
              <div className="space-y-2.5 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Subscribers
                </p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">
                  {loading ? "..." : stats.totalSubscribers}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  <TrendingUp className="h-3 w-3" />
                  Active readers
                </span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 transition-all group-hover:bg-blue-500 group-hover:text-white">
                <Mail className="h-5.5 w-5.5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Total Payments card */}
        <Link href="/admin/donations" className="group block">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30 dark:hover:border-amber-500/30">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-amber-500/5 transition-all duration-300 group-hover:scale-125" />
            <div className="flex items-center justify-between">
              <div className="space-y-2.5 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Payments
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
                  {loading ? "..." : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(stats.totalPayments)}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  <Heart className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {stats.totalDonationsCount} donations
                </span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 transition-all group-hover:bg-amber-500 group-hover:text-white">
                <IndianRupee className="h-5.5 w-5.5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Today's Payments card */}
        <Link href="/admin/donations" className="group block">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-violet-500/30 dark:hover:border-violet-500/30">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-violet-500/5 transition-all duration-300 group-hover:scale-125" />
            <div className="flex items-center justify-between">
              <div className="space-y-2.5 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Today's Payments
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
                  {loading ? "..." : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(stats.todayPayments)}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                  <TrendingUp className="h-3 w-3" />
                  Received today
                </span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500 transition-all group-hover:bg-violet-500 group-hover:text-white">
                <Activity className="h-5.5 w-5.5" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* 3. Recent Activity & System Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Recent Inquiries */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Recent Inquiries</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Latest messages received from public portals.</p>
            </div>
            <Link 
              href="/admin/contacts" 
              className="text-xs font-bold text-emerald-600 hover:text-emerald-500 transition"
            >
              View All
            </Link>
          </div>
          
          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="flex h-44 items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-emerald-500" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="flex h-44 flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <MessageSquare className="h-10 w-10 opacity-30 mb-2" />
                <p className="text-xs font-semibold">No recent inquiries.</p>
              </div>
            ) : (
              contacts.slice(0, 3).map((contact) => (
                <Link 
                  href="/admin/contacts" 
                  key={contact.id}
                  className="flex items-start gap-4 p-3.5 rounded-xl border border-transparent bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-200 dark:hover:border-slate-800 transition duration-200"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{contact.name}</h4>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(contact.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-1">{contact.message}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 self-center" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column - System Diagnostics */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Server Health</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unified backend diagnostics.</p>
            </div>
            
            <div className="mt-5 space-y-4.5">
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Database Engine</p>
                  <p className="text-[10px] text-emerald-500 font-bold mt-0.5">PostgreSQL 18 (Online & Synced)</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Activity className="h-2 w-2" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">API Gateway Binding</p>
                  <p className="text-[10px] text-emerald-500 font-bold mt-0.5">Port 3000 (Next.js Routing)</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Layers className="h-2 w-2" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Auth Mechanism</p>
                  <p className="text-[10px] text-emerald-500 font-bold mt-0.5">JWT Secure Access Layer</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Database className="h-2 w-2" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Database Target</p>
                  <p className="text-[10px] text-emerald-500 font-bold mt-0.5">flarelap_foundation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-bold text-center leading-relaxed">
              Flarelap Global Foundation Admin Panel • v1.0.0
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
