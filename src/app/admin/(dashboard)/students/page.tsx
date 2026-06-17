"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { 
  GraduationCap, 
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
  Key,
  Eye,
  X
} from "lucide-react";

interface StudentRecord {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  student_id: string | null;
  temp_password: string | null;
  created_at: string;
  course_name?: string | null;
}

export default function StudentsAdminPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  
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

  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/foundation/admin/students`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students || []);
      } else {
        throw new Error(data.message || "Failed to load students.");
      }
    } catch (err: any) {
      setError("Failed to fetch student records. Verify the database and Next.js server are active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = async (id: number) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    const isDark = document.querySelector(".dark") !== null;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this student account? This cannot be undone.",
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
      const res = await fetch(`${apiUrl}/api/foundation/admin/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete student account.");
      }

      setStudents(prev => prev.filter(s => s.id !== id));
      showTemporarySuccess("Student account deleted successfully.");
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
    if (students.length === 0) return;
    const headers = Object.keys(students[0]).join(",");
    const rows = students.map(item => 
      Object.values(item).map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "flarelap_students_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showTemporarySuccess("Students directory exported to CSV!");
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

  const sortData = (data: StudentRecord[]) => {
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

      if (typeof valA === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.student_id && s.student_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedStudents = sortData(filteredStudents);
  const totalEntries = sortedStudents.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

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
                placeholder="Search students..."
                className="block w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2.5 transition text-slate-900 dark:text-white"
              />
            </div>

            {/* Reload button */}
            <button
              onClick={fetchStudents}
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
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-600"
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
              disabled={students.length === 0}
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
              <p className="text-xs text-slate-500 font-semibold">Loading registered student profiles...</p>
            </div>
          ) : paginatedStudents.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 p-5 text-center">
              <GraduationCap className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-black text-slate-900 dark:text-white mt-2">No students found</p>
              <p className="text-[11px] text-slate-400 font-semibold">
                {searchQuery ? "No accounts match your search query." : "There are currently no registered students in the database."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-955/40 border-b border-slate-100 dark:border-slate-850 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-4 px-6 select-none cursor-pointer hover:text-slate-600 dark:hover:text-white" onClick={() => handleSort("student_id")}>
                    <div className="flex items-center gap-1">
                      Student ID
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-4 px-5 select-none cursor-pointer hover:text-slate-600 dark:hover:text-white" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">
                      Full Name
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-4 px-5">Email Address</th>
                  <th className="py-4 px-5">Phone Number</th>
                  <th className="py-4 px-5">Initial Password</th>
                  <th className="py-4 px-5">Enrolled Course</th>
                  <th className="py-4 px-5 select-none cursor-pointer hover:text-slate-600 dark:hover:text-white" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center gap-1">
                      Registration Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {paginatedStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 text-slate-600 dark:text-slate-350 transition-colors">
                    
                    {/* Student ID */}
                    <td className="py-3.5 px-6 font-mono text-[10.5px] font-black tracking-wider text-emerald-700 dark:text-emerald-400 select-all">
                      <div className="flex items-center gap-1.5">
                        <Key className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {s.student_id || "STU-PENDING"}
                      </div>
                    </td>

                    {/* Full Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          {s.name.substring(0, 2).toUpperCase()}
                        </span>
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs">{s.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 text-[11px] select-all">
                        <Mail className="h-3 w-3 text-slate-400" />
                        {s.email}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-5 font-semibold text-slate-500 dark:text-slate-400">
                      {s.phone ? (
                        <span className="flex items-center gap-1 text-[11px] select-all">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {s.phone}
                        </span>
                      ) : (
                        <span className="text-slate-450 dark:text-slate-500 italic">-</span>
                      )}
                    </td>

                    {/* Temporary/Initial Password */}
                    <td className="py-3.5 px-5 font-mono text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                      {s.temp_password ? (
                        <span className="select-all bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700/50">
                          {s.temp_password}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">Hashed</span>
                      )}
                    </td>

                    {/* Enrolled Course */}
                    <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white text-xs">
                      {s.course_name || "None"}
                    </td>

                    {/* Date Time */}
                    <td className="py-3.5 px-5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {formatDate(s.created_at)}
                      </div>
                    </td>

                    {/* Deletion & Details Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="rounded-lg p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 active:scale-95 transition"
                          title="View Student Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          disabled={actionLoading === `del-${s.id}`}
                          className="rounded-lg p-2 text-slate-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 transition disabled:opacity-50"
                          title="Delete Student Account"
                        >
                          {actionLoading === `del-${s.id}` ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-650 border-t-transparent" />
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
              <span className="font-extrabold text-slate-900 dark:text-white">{totalEntries}</span> student accounts
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

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl relative space-y-5">
            <button 
              onClick={() => setSelectedStudent(null)} 
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Student Account Details</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Account ID: {selectedStudent.student_id || "STU-PENDING"}
              </p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800/80" />

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-455 dark:text-slate-500 font-bold">Full Name:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedStudent.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-455 dark:text-slate-500 font-bold">Email Address:</span>
                <span className="font-extrabold text-slate-900 dark:text-white select-all">{selectedStudent.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-455 dark:text-slate-500 font-bold">Phone Number:</span>
                <span className="font-extrabold text-slate-900 dark:text-white select-all">{selectedStudent.phone || "-"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-455 dark:text-slate-500 font-bold">Student ID / User ID:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-wider select-all">{selectedStudent.student_id || "-"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-455 dark:text-slate-500 font-bold">Initial/Temp Password:</span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono select-all">
                  {selectedStudent.temp_password || <span className="text-slate-450 dark:text-slate-650 italic font-sans font-medium">Hashed</span>}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-455 dark:text-slate-500 font-bold">Enrolled Course:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedStudent.course_name || "None"}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-455 dark:text-slate-500 font-bold">Registration Date:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{formatDate(selectedStudent.created_at)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
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
