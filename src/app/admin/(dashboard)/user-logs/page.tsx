"use client";

import { useEffect, useState } from "react";
import { 
  History, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  UserCheck, 
  Loader2, 
  AlertCircle,
  Filter,
  ArrowUpDown,
  Calendar,
  LogIn,
  LogOut
} from "lucide-react";

interface UserLogItem {
  id: number;
  userId: number | null;
  userDisplayId: string;
  userName: string;
  email: string;
  role: string;
  action: string;
  ipAddress: string | null;
  createdAt: string;
}

interface StatsData {
  totalLogs: number;
  adminLogs: number;
  studentLogs: number;
  todayLogins: number;
}

export default function UserLogsPage() {
  const [logs, setLogs] = useState<UserLogItem[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalLogs: 0,
    adminLogs: 0,
    studentLogs: 0,
    todayLogins: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");

  useEffect(() => {
    fetchLogs();
  }, [roleFilter, actionFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const queryParams = new URLSearchParams({
        query: searchQuery,
        role: roleFilter,
        action: actionFilter
      });

      const res = await fetch(`${apiUrl}/api/admin/user-logs?${queryParams.toString()}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load user logs.");
      }

      setLogs(data.logs || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching user logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      {/* Header section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <History className="h-6 w-6 text-emerald-500 shrink-0" />
            User Login & Activity Logs
          </h2>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">
            Realtime session audit logs for Admin and Student dashboard access.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-500" : ""}`} />
          Refresh Logs
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Activity Logs</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalLogs}</h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <History className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Admin Logins</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.adminLogs}</h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Student Logins</p>
            <h3 className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">{stats.studentLogs}</h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today's Logins</p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.todayLogins}</h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by User ID, Name, or Email..."
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-emerald-600 outline-none text-xs pl-10 pr-4 py-2.5 transition text-slate-900 dark:text-white"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-bold text-slate-500 dark:text-slate-400">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent font-extrabold text-slate-800 dark:text-white outline-none cursor-pointer"
            >
              <option value="ALL" className="dark:bg-slate-900">All Roles</option>
              <option value="ADMIN" className="dark:bg-slate-900">Admin Only</option>
              <option value="STUDENT" className="dark:bg-slate-900">Student Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-bold text-slate-500 dark:text-slate-400">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-transparent font-extrabold text-slate-800 dark:text-white outline-none cursor-pointer"
            >
              <option value="ALL" className="dark:bg-slate-900">All Actions</option>
              <option value="LOGIN" className="dark:bg-slate-900">LOGIN Only</option>
              <option value="LOGOUT" className="dark:bg-slate-900">LOGOUT Only</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/5 dark:bg-red-500/10 p-4 text-xs text-red-600 dark:text-red-400 font-bold">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Data Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-xs text-slate-500 font-semibold">Loading user activity logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center gap-2 p-6 text-center">
            <History className="h-10 w-10 text-slate-300 dark:text-slate-700" />
            <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 mt-1">No Activity Logs Found</h3>
            <p className="text-xs text-slate-400 max-w-sm">No user login/logout records match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Log #</th>
                  <th className="px-5 py-3.5">User Role</th>
                  <th className="px-5 py-3.5">User ID</th>
                  <th className="px-5 py-3.5">User Name</th>
                  <th className="px-5 py-3.5">Email Address</th>
                  <th className="px-5 py-3.5">Action</th>
                  <th className="px-5 py-3.5">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
                {logs.map((log) => {
                  const isAdmin = log.role.toUpperCase() === "ADMIN";
                  const isLogin = log.action.toUpperCase() === "LOGIN";

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition">
                      <td className="px-5 py-4 font-mono font-bold text-slate-400 text-[11px]">
                        #{log.id}
                      </td>

                      <td className="px-5 py-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="h-3 w-3" />
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-black text-sky-600 dark:text-sky-400">
                            <GraduationCap className="h-3 w-3" />
                            STUDENT
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                        {log.userDisplayId}
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                        {log.userName}
                      </td>

                      <td className="px-5 py-4 text-slate-550 dark:text-slate-400 font-semibold">
                        {log.email}
                      </td>

                      <td className="px-5 py-4">
                        {isLogin ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                            <LogIn className="h-3 w-3" />
                            LOGIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                            <LogOut className="h-3 w-3" />
                            LOGOUT
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-600 dark:text-slate-350 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(log.createdAt)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
