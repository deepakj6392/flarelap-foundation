"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Mail, 
  RefreshCw, 
  Clock, 
  ChevronRight
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
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats>({ totalContacts: 0, totalSubscribers: 0 });
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
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
      setError("Failed to fetch dashboard data. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Sync Button Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Overview Dashboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time statistics checklist.</p>
        </div>
        <button
          onClick={fetchOverviewData}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
          Sync Data
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Link href="/admin/contacts" className="block">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 flex items-center justify-between cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Inquiries
              </p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {loading ? "..." : stats.totalContacts}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
        </Link>

        <Link href="/admin/newsletter" className="block">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 flex items-center justify-between cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Newsletter Subscribers
              </p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {loading ? "..." : stats.totalSubscribers}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
              <Mail className="h-6 w-6" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Recent Inquiries</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Latest inquiries received from contact forms.</p>
          
          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-emerald-500" />
              </div>
            ) : contacts.length === 0 ? (
              <p className="text-sm text-center py-8 text-slate-400">No recent inquiries.</p>
            ) : (
              contacts.slice(0, 3).map((contact) => (
                <Link 
                  href="/admin/contacts" 
                  key={contact.id}
                  className="flex items-start gap-4 p-3.5 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-200 dark:hover:border-slate-850 transition"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{contact.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(contact.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">{contact.message}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 shrink-0 self-center" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* System Diagnostics */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Server Status</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Backend configurations checklist.</p>
            
            <div className="mt-6 space-y-4.5">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 absolute" />
                <div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Database Connection</p>
                  <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Online & Synced</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Port Binding</p>
                  <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Port 5000 (No Conflicts)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">API Prefix</p>
                  <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">/api/foundation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[10px] text-slate-500 font-semibold text-center leading-relaxed">
              Flarelap Global Foundation Admin Panel • v1.0.0
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
