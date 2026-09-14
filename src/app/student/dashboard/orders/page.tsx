"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  ArrowRight, 
  Loader2, 
  Search,
  BookOpen,
  Award,
  RefreshCw
} from "lucide-react";
import { useDashboard } from "../layout";

interface PurchaseRecord {
  id: number;
  courseId: number;
  amount: string | number;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  expiresAt: string;
  daysLeft: number;
  isExpired: boolean;
  isActive: boolean;
  course?: {
    id: number;
    name: string;
    premium: boolean;
    categoryId?: number | null;
    category?: { id: number; name: string } | null;
  } | null;
}

export default function StudentOrdersPage() {
  const { student, isDark } = useDashboard();
  const router = useRouter();

  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudentOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("student_token") || localStorage.getItem("admin_token") || localStorage.getItem("token");
      if (!token) {
        router.push("/student/login");
        return;
      }

      const res = await fetch("/api/student/purchases", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        setPurchases(data.purchases || []);
      } else {
        throw new Error(data.message || "Failed to load order history.");
      }
    } catch (err: any) {
      console.error("Failed to load student orders:", err);
      setError("Could not retrieve purchase history. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentOrders();
  }, []);

  const formatDateWithTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }) + " • " + d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  const filteredPurchases = purchases.filter((p) => {
    const courseName = p.course?.name || "Mock Test Pass";
    const categoryName = p.course?.category?.name || "";
    const txnId = p.transactionId || "";
    const query = searchQuery.toLowerCase();
    return courseName.toLowerCase().includes(query) ||
           categoryName.toLowerCase().includes(query) ||
           txnId.toLowerCase().includes(query);
  });

  const activeCount = purchases.filter(p => p.isActive).length;
  const expiredCount = purchases.filter(p => p.isExpired).length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Passes & Billing
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {purchases.length} Total Orders
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            My Orders & Course Passes History
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Track all your purchased exam course passes, payment timestamps, transaction IDs, and 30-day validity status.
          </p>
        </div>

        <button
          onClick={() => router.push("/student/dashboard/test-series")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-md transition cursor-pointer shrink-0"
        >
          <Award className="h-4 w-4" /> Explore & Buy Passes
        </button>
      </div>

      {/* Overview Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Purchases</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{purchases.length} Passes</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Course Passes</p>
            <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{activeCount} Unlocked</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 font-black">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Expired Plans</p>
            <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{expiredCount} Expired</h3>
          </div>
        </div>
      </div>

      {/* Search & Orders List Panel */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
        
        {/* Search bar & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course name or transaction ref..."
              className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          <button
            onClick={fetchStudentOrders}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} /> Refresh Orders
          </button>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-xs font-bold">Loading order records...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-xs font-semibold text-red-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <CreditCard className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700" />
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">No Orders Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery ? `No purchases match "${searchQuery}".` : "You haven't purchased any course passes yet. Unlock exam series to start practicing."}
            </p>
            <button
              onClick={() => router.push("/student/dashboard/test-series")}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-md transition cursor-pointer"
            >
              Explore Course Passes (₹59+)
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Subcourse Plan</th>
                    <th className="py-3.5 px-4 text-center">Amount Paid</th>
                    <th className="py-3.5 px-4">Transaction Ref</th>
                    <th className="py-3.5 px-4">Purchase Date & Time</th>
                    <th className="py-3.5 px-4">Valid Until (Expiry)</th>
                    <th className="py-3.5 px-4 text-center">Plan Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                  {filteredPurchases.map((p) => {
                    const courseName = p.course?.name || "Mock Test Pass";
                    const categoryName = p.course?.category?.name || "Exam Series";
                    const amountVal = p.amount ? parseFloat(p.amount.toString()).toFixed(2) : "59.00";

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-emerald-600 shrink-0" />
                            <div>
                              <div className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
                                {courseName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                                {categoryName}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="font-black text-emerald-700 dark:text-emerald-400 text-xs bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            ₹{amountVal}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-mono text-[10.5px] font-bold text-slate-600 dark:text-slate-400 select-all">
                          {p.transactionId || "Online Order"}
                        </td>

                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {formatDateWithTime(p.createdAt)}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {formatDateWithTime(p.expiresAt)}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          {p.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Active ({p.daysLeft}d left)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50">
                              <Clock className="h-3 w-3 text-rose-600" /> Expired
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => router.push(`/student/dashboard/test-series?course=${p.courseId}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer border-none"
                          >
                            Mock Tests <ArrowRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
