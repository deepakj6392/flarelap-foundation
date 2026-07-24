"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Briefcase,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
  ShieldCheck
} from "lucide-react";

interface Designation {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

export default function AdminDesignationsPage() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [submitting, setSubmitting] = useState(false);

  const fetchDesignations = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/designations", {
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setDesignations(data.designations || []);
      } else {
        throw new Error(data.message || "Failed to fetch designations.");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching designations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const resetForm = () => {
    setTitle("");
    setStatus("ACTIVE");
    setIsEditMode(false);
    setEditId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (d: Designation) => {
    resetForm();
    setIsEditMode(true);
    setEditId(d.id);
    setTitle(d.title);
    setStatus(d.status || "ACTIVE");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      Swal.fire("Required", "Designation title is required.", "warning");
      return;
    }

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setSubmitting(true);
    try {
      const url = isEditMode ? `/api/admin/designations/${editId}` : "/api/admin/designations";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ title: title.trim(), status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save designation.");
      }

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Updated!" : "Added!",
        text: data.message || "Designation saved successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      resetForm();
      fetchDesignations();
    } catch (err: any) {
      Swal.fire("Error", err.message || "Something went wrong.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, itemTitle: string) => {
    const isDark = typeof document !== "undefined" && document.querySelector(".dark") !== null;

    const result = await Swal.fire({
      title: "Delete Designation?",
      text: `Are you sure you want to remove '${itemTitle}'? Volunteers with this designation will fall back to Volunteer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#1e293b",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800",
      },
    });

    if (!result.isConfirmed) return;

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    try {
      const res = await fetch(`/api/admin/designations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete designation.");
      }

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Designation removed successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      fetchDesignations();
    } catch (err: any) {
      Swal.fire("Error", err.message || "Failed to delete.", "error");
    }
  };

  const handleToggleStatus = async (d: Designation) => {
    const newStatus = d.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    try {
      const res = await fetch(`/api/admin/designations/${d.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setDesignations((prev) =>
          prev.map((item) => (item.id === d.id ? { ...item, status: newStatus } : item))
        );
        Swal.fire({
          icon: "success",
          title: "Status Updated!",
          text: `Designation '${d.title}' is now ${newStatus}.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Failed to update status.");
      }
    } catch (err: any) {
      Swal.fire("Error", err.message || "Could not update status.", "error");
    }
  };

  // Filtered List
  const filteredDesignations = designations.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = designations.length;
  const activeCount = designations.filter((d) => d.status === "ACTIVE").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Member Designations Management
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Add, edit, or manage member & volunteer official roles used on ID Cards, Certificates, & Directory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDesignations}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-500" : ""}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/20 transition transform active:scale-95 cursor-pointer border-none"
          >
            <Plus className="h-4 w-4" />
            Add New Designation
          </button>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Roles</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Tag className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Active Roles</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">System Integrated</span>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
              Auto-syncs with ID Card & Certificate
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search designation title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label className="text-xs font-bold text-slate-500 shrink-0">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-xs font-bold">Loading designation records...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-red-500 space-y-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-xs font-bold">{error}</p>
            <button
              onClick={fetchDesignations}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold underline cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : filteredDesignations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-3">
            <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-700" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Designations Found</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              {searchQuery ? "Try adjusting your search filter." : "Click 'Add New Designation' above to add one."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4"># ID</th>
                  <th className="py-3.5 px-4">Designation Title</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredDesignations.map((d) => {
                  const createdDateStr = new Date(d.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      {/* ID */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-slate-400">#{d.id}</span>
                      </td>

                      {/* Title */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {d.title}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(d)}
                          title="Click to toggle status (ACTIVE / INACTIVE)"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border transition cursor-pointer active:scale-95 ${
                            d.status === "ACTIVE"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60 hover:bg-emerald-100"
                              : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/70 dark:border-amber-800/60 hover:bg-amber-100"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${d.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                          {d.status || "ACTIVE"}
                        </button>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 font-semibold text-slate-500">{createdDateStr}</td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(d)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition cursor-pointer"
                            title="Edit Designation"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(d.id, d.title)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition cursor-pointer"
                            title="Delete Designation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isEditMode ? "Edit Designation Role" : "Add New Designation Role"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Designation Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Managing Director, Executive Officer, General Secretary..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-600/20 transition transform active:scale-95 cursor-pointer border-none disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isEditMode ? "Update Designation" : "Save Designation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
