"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { 
  CreditCard,
  Trash2, 
  RefreshCw, 
  Search, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Download,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Phone,
  Mail,
  User,
  GraduationCap,
  Eye,
  X,
  BookOpen
} from "lucide-react";

interface PurchaseRecord {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  student_id: string | null;
  course_id: number;
  course_name: string;
  amount: string | number;
  status: string;
  payment_method: string;
  transaction_id: string | null;
  created_at: string;
}

export default function StudentPaymentsAdminPage() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  
  // Data Table controls
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Loading & Messages
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Detail state
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord | null>(null);

  const fetchPurchases = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/foundation/admin/purchases`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPurchases(data.purchases || []);
      } else {
        throw new Error(data.message || "Failed to load purchase records.");
      }
    } catch (err: any) {
      setError("Failed to fetch student payment records. Verify database and API are online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleDeletePurchase = async (id: number) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    const isDark = document.querySelector(".dark") !== null;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this payment record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#1e293b",
    });

    if (!result.isConfirmed) return;
    
    setActionLoading(`del-${id}`);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/foundation/admin/purchases/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete payment record.");
      }

      setPurchases(prev => prev.filter(p => p.id !== id));
      showTemporarySuccess("Payment record deleted successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to delete record.");
    } finally {
      setActionLoading(null);
    }
  };

  const showTemporarySuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleExport = () => {
    if (purchases.length === 0) return;
    const headers = Object.keys(purchases[0]).join(",");
    const rows = purchases.map(item => 
      Object.values(item).map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "flarelap_student_payments_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showTemporarySuccess("Student payments data exported to CSV!");
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const sortData = (data: PurchaseRecord[]) => {
    return [...data].sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (sortField === "created_at") {
        return sortOrder === "asc" 
          ? new Date(valA).getTime() - new Date(valB).getTime()
          : new Date(valB).getTime() - new Date(valA).getTime();
      }

      if (sortField === "amount") {
        return sortOrder === "asc"
          ? parseFloat(valA) - parseFloat(valB)
          : parseFloat(valB) - parseFloat(valA);
      }

      if (typeof valA === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  };

  const filteredPurchases = purchases.filter((p) =>
    p.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.student_id && p.student_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.transaction_id && p.transaction_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.payment_method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPurchases = sortData(filteredPurchases);
  const totalEntries = sortedPurchases.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  
  const paginatedPurchases = sortedPurchases.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const formatAmount = (amt: string | number) => {
    const num = parseFloat(String(amt));
    if (isNaN(num)) return "₹0.00";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(num);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Messages */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-600 dark:text-red-400 font-bold">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Main Table Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by student, email, plan, txn..."
                className="block w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
              />
            </div>

            {/* Reload button */}
            <button
              onClick={fetchPurchases}
              disabled={loading}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4.5 w-4.5 ${loading ? "animate-spin text-emerald-500" : ""}`} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Show Entries Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-600"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={purchases.length === 0}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold shadow-xs active:scale-[0.98] transition disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Datatable View */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-xs text-slate-500 font-semibold">Loading student payment records...</p>
            </div>
          ) : paginatedPurchases.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 p-5 text-center">
              <CreditCard className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-black text-slate-900 dark:text-white mt-2">No student plan payments found</p>
              <p className="text-[11px] text-slate-400 font-semibold">
                {searchQuery ? "No payment entries match your search criteria." : "There are currently no student payments recorded."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-4 px-6 select-none cursor-pointer hover:text-slate-600 dark:hover:text-white" onClick={() => handleSort("user_name")}>
                    <div className="flex items-center gap-1">
                      Student Info
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-4 px-5 select-none cursor-pointer hover:text-slate-600 dark:hover:text-white" onClick={() => handleSort("course_name")}>
                    <div className="flex items-center gap-1">
                      Purchased Plan / Series
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-4 px-5 select-none cursor-pointer hover:text-slate-600 dark:hover:text-white" onClick={() => handleSort("amount")}>
                    <div className="flex items-center gap-1">
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-4 px-5 select-none cursor-pointer hover:text-slate-600 dark:hover:text-white" onClick={() => handleSort("payment_method")}>
                    <div className="flex items-center gap-1">
                      Method
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-4 px-5">Transaction ID</th>
                  <th className="py-4 px-5 select-none cursor-pointer hover:text-slate-600 dark:hover:text-white" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center gap-1">
                      Date & Time
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {paginatedPurchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 text-slate-600 dark:text-slate-350 transition-colors">
                    
                    {/* Student Info */}
                    <td className="py-3.5 px-6">
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white text-xs">{p.user_name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold flex items-center gap-1">
                          <Mail className="h-3 w-3 shrink-0" />
                          {p.user_email}
                        </p>
                        {p.student_id && (
                          <p className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                            ID: {p.student_id}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Course / Plan */}
                    <td className="py-3.5 px-5 font-extrabold text-slate-900 dark:text-white text-xs max-w-[220px] truncate" title={p.course_name}>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{p.course_name}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-5">
                      <span className="font-black text-slate-900 dark:text-white text-xs bg-emerald-500/10 dark:bg-emerald-400/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                        {formatAmount(p.amount)}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50">
                        {p.payment_method}
                      </span>
                    </td>

                    {/* Transaction ID */}
                    <td className="py-3.5 px-5 font-mono text-[10px] font-bold tracking-wider select-all text-slate-700 dark:text-slate-300">
                      {p.transaction_id || (
                        <span className="text-slate-400 italic font-sans font-medium">No Ref</span>
                      )}
                    </td>

                    {/* Date Time */}
                    <td className="py-3.5 px-5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {formatDate(p.created_at)}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPurchase(p)}
                          className="rounded-lg p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 active:scale-95 transition"
                          title="View Payment Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePurchase(p.id)}
                          disabled={actionLoading === `del-${p.id}`}
                          className="rounded-lg p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 transition disabled:opacity-50"
                          title="Delete Record"
                        >
                          {actionLoading === `del-${p.id}` ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Datatable Footer / Pagination Panel */}
        {!loading && totalEntries > 0 && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <p>
              Showing <span className="font-extrabold text-slate-900 dark:text-white">{Math.min(totalEntries, (currentPage - 1) * entriesPerPage + 1)}</span> to{" "}
              <span className="font-extrabold text-slate-900 dark:text-white">{Math.min(totalEntries, currentPage * entriesPerPage)}</span> of{" "}
              <span className="font-extrabold text-slate-900 dark:text-white">{totalEntries}</span> payment records
            </p>

            {/* Pagination Buttons */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 p-2 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 transition"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 transition"
                >
                  Prev
                </button>
                
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pg = index + 1;
                  return (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-black transition-all ${
                        currentPage === pg
                          ? "bg-emerald-600 text-white"
                          : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 transition"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 p-2 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 transition"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Detail View */}
      {selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl relative space-y-5">
            <button 
              onClick={() => setSelectedPurchase(null)} 
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500">
                <CreditCard className="h-7 w-7" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Student Plan Payment Details</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Transaction Ref: {selectedPurchase.transaction_id || "N/A"}
              </p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800/80" />

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Student Name:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedPurchase.user_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Student Email:</span>
                <span className="font-extrabold text-slate-900 dark:text-white select-all">{selectedPurchase.user_email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Student Phone:</span>
                <span className="font-extrabold text-slate-900 dark:text-white select-all">{selectedPurchase.user_phone || "-"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Student ID:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono select-all">{selectedPurchase.student_id || "-"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Purchased Plan / Series:</span>
                <span className="font-extrabold text-slate-900 dark:text-white max-w-[200px] text-right">{selectedPurchase.course_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Payment Amount:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{formatAmount(selectedPurchase.amount)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Payment Gateway / Method:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedPurchase.payment_method}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Payment Status:</span>
                <span className="font-black text-emerald-500 uppercase">{selectedPurchase.status}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400 font-bold">Date & Time:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{formatDate(selectedPurchase.created_at)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPurchase(null)}
                className="rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-bold shadow-xs active:scale-[0.98] transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
