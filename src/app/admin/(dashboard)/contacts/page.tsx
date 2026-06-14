"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { 
  MessageSquare, 
  Trash2, 
  RefreshCw, 
  Search, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  X,
  ChevronRight,
  Info,
  Download,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown
} from "lucide-react";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  post: string | null;
  created_at: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactSubmission | null>(null);
  
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

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/foundation/admin/contacts`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setContacts(data.contacts || []);
      } else {
        throw new Error(data.message || "Failed to load contacts.");
      }
    } catch (err: any) {
      setError("Failed to fetch contact submissions. Verify the database and Next.js server are active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDeleteContact = async (id: number) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    const isDark = document.querySelector(".dark") !== null;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this inquiry?",
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
    
    setActionLoading(`contact-${id}`);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/foundation/admin/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete submission.");
      }

      setContacts(prev => prev.filter(c => c.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      showTemporarySuccess("Contact submission deleted successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to delete submission.");
    } finally {
      setActionLoading(null);
    }
  };

  const showTemporarySuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleExport = () => {
    if (contacts.length === 0) return;
    const headers = Object.keys(contacts[0]).join(",");
    const rows = contacts.map(item => 
      Object.values(item).map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "flarelap_contacts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showTemporarySuccess("Data exported to CSV!");
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

  const sortData = (data: ContactSubmission[]) => {
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

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.post && c.post.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedContacts = sortData(filteredContacts);
  const totalEntries = sortedContacts.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  
  const paginatedContacts = sortedContacts.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="space-y-6">
      
      {/* Messages */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p className="font-semibold">{successMsg}</p>
        </div>
      )}

      {/* Main Table Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        
        {/* Table Controls */}
        <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-slate-800/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 font-bold text-slate-800 dark:text-white outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <button
              onClick={handleExport}
              disabled={totalEntries === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-white transition disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5 text-emerald-500" />
              Export CSV
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search name, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-emerald-600 dark:focus:border-emerald-500 py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none shadow-inner transition"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[350px]">
          {loading ? (
            <div className="flex h-72 flex-col items-center justify-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-xs font-semibold text-slate-500">Loading inquiry records...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center">
              <MessageSquare className="h-12 w-12 text-slate-700 mb-3" />
              <p className="text-sm font-bold text-slate-800 dark:text-white">No inquiry records found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4.5">#</th>
                  <th onClick={() => handleSort("name")} className="px-6 py-4.5 cursor-pointer hover:bg-slate-800/10">
                    <span className="flex items-center gap-1.5">Name <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th onClick={() => handleSort("email")} className="px-6 py-4.5 cursor-pointer hover:bg-slate-800/10">
                    <span className="flex items-center gap-1.5">Email Address <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-6 py-4.5">Subject Category</th>
                  <th className="px-6 py-4.5">Message Snippet</th>
                  <th onClick={() => handleSort("created_at")} className="px-6 py-4.5 cursor-pointer hover:bg-slate-800/10">
                    <span className="flex items-center gap-1.5">Received Date <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-6 py-4.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40 text-xs text-slate-700 dark:text-slate-300">
                {paginatedContacts.map((contact, index) => (
                  <tr key={contact.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition">
                    <td className="px-6 py-4.5 text-slate-500 font-bold">
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4.5 font-bold text-slate-900 dark:text-white">{contact.name}</td>
                    <td className="px-6 py-4.5 font-semibold text-slate-500 dark:text-slate-300">{contact.email}</td>
                    <td className="px-6 py-4.5">
                      {contact.post ? (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                          {contact.post}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 max-w-xs truncate">
                      <span onClick={() => setSelectedInquiry(contact)} className="cursor-pointer font-medium hover:text-emerald-500 transition">
                        {contact.message}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(contact.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setSelectedInquiry(contact)} className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-500 transition">
                          <Info className="h-4.5 w-4.5" />
                        </button>
                        <button onClick={() => handleDeleteContact(contact.id)} disabled={actionLoading === `contact-${contact.id}`} className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 transition">
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {totalEntries > 0 && (
          <div className="flex flex-col gap-4 items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 px-6 py-4 sm:flex-row text-xs text-slate-500 dark:text-slate-400">
            <div>
              Showing <span className="font-bold text-emerald-500">{Math.min(totalEntries, (currentPage - 1) * entriesPerPage + 1)}</span> to{" "}
              <span className="font-bold text-emerald-500">{Math.min(totalEntries, currentPage * entriesPerPage)}</span> of{" "}
              <span className="font-bold">{totalEntries}</span> entries
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="rounded-lg p-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 disabled:opacity-30 font-bold"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let targetPage = currentPage <= 3 ? idx + 1 : (currentPage >= totalPages - 2 ? totalPages - 4 + idx : currentPage - 2 + idx);
                if (targetPage < 1 || targetPage > totalPages) return null;
                const isActive = currentPage === targetPage;
                return (
                  <button
                    key={targetPage}
                    onClick={() => setCurrentPage(targetPage)}
                    className={`rounded-lg px-3 py-1.5 border font-extrabold ${
                      isActive ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {targetPage}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 disabled:opacity-30 font-bold"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="rounded-lg p-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Popup Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <MessageSquare className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Inquiry Details</h4>
                  <p className="text-[10px] text-slate-500">Sender details & message contents</p>
                </div>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Sender Name</label>
                <p className="text-sm font-bold mt-1 text-slate-900 dark:text-white">{selectedInquiry.name}</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Sender Email</label>
                <p className="text-sm mt-1 font-semibold text-emerald-500 dark:text-emerald-400">{selectedInquiry.email}</p>
              </div>

              {selectedInquiry.post && (
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Subject Category</label>
                  <div className="mt-1">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                      {selectedInquiry.post}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Message Contents</label>
                <p className="text-sm leading-relaxed p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 mt-1 select-text bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                  {selectedInquiry.message}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Submitted At</label>
                <p className="text-xs mt-1 font-medium text-slate-500">
                  {new Date(selectedInquiry.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-end gap-2.5">
              <button
                onClick={() => handleDeleteContact(selectedInquiry.id)}
                disabled={actionLoading === `contact-${selectedInquiry.id}`}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-50/50 dark:bg-red-500/5 px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 transition"
              >
                <Trash2 className="h-4 w-4" />
                Delete Submission
              </button>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
