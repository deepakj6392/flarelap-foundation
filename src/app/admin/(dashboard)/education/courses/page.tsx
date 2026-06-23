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
  Plus, 
  Key,
  X,
  Pencil
} from "lucide-react";

interface CourseRecord {
  id: number;
  name: string;
  active: boolean;
  premium: boolean;
  price?: string | number;
  createdAt: string;
}

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCourseId, setEditCourseId] = useState<number | null>(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCoursePremium, setNewCoursePremium] = useState(false);
  const [newCoursePrice, setNewCoursePrice] = useState("299");

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/courses`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || []);
      } else {
        throw new Error(data.message || "Failed to load courses.");
      }
    } catch (err: any) {
      setError("Failed to fetch course records. Verify your network or database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName) return;

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(isEditMode ? "edit" : "create");
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      let res;
      if (isEditMode) {
        res = await fetch(`${apiUrl}/api/admin/courses/${editCourseId}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}` 
          },
          body: JSON.stringify({ name: newCourseName, premium: newCoursePremium, price: newCoursePrice }),
        });
      } else {
        res = await fetch(`${apiUrl}/api/admin/courses`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}` 
          },
          body: JSON.stringify({ name: newCourseName, premium: newCoursePremium, price: newCoursePrice }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save course.");
      }

      if (isEditMode) {
        setCourses(prev => prev.map(c => c.id === editCourseId ? data.course : c));
        showTemporarySuccess("Course updated successfully!");
      } else {
        setCourses(prev => [data.course, ...prev]);
        showTemporarySuccess("Course created successfully!");
      }
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditCourseId(null);
      setNewCourseName("");
      setNewCoursePremium(false);
    } catch (err: any) {
      setError(err.message || "Failed to save course.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(`toggle-${id}`);
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/courses/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}` 
        },
        body: JSON.stringify({ active: !currentStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to toggle status.");
      }

      setCourses(prev => prev.map(c => c.id === id ? { ...c, active: !currentStatus } : c));
      showTemporarySuccess(`Course "${id}" status changed successfully.`);
    } catch (err: any) {
      setError(err.message || "Failed to toggle status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePricing = async (id: number, currentPremium: boolean) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(`pricing-${id}`);
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/courses/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}` 
        },
        body: JSON.stringify({ premium: !currentPremium }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to toggle pricing.");
      }

      setCourses(prev => prev.map(c => c.id === id ? { ...c, premium: !currentPremium } : c));
      showTemporarySuccess(`Course "${id}" pricing changed successfully.`);
    } catch (err: any) {
      setError(err.message || "Failed to toggle pricing.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    const isDark = document.querySelector(".dark") !== null;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this course? This cannot be undone.`,
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
      const res = await fetch(`${apiUrl}/api/admin/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete course.");
      }

      setCourses(prev => prev.filter(c => c.id !== id));
      showTemporarySuccess("Course deleted successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to delete course.");
      Swal.fire({
        title: "Error Deleting Course",
        text: err.message || "Make sure no students are currently registered to this course.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (course: CourseRecord) => {
    setIsEditMode(true);
    setEditCourseId(course.id);
    setNewCourseName(course.name);
    setNewCoursePremium(course.premium || false);
    setNewCoursePrice(course.price !== undefined ? course.price.toString() : "299");
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditCourseId(null);
    setNewCourseName("");
    setNewCoursePremium(false);
    setNewCoursePrice("299");
    setIsModalOpen(true);
  };

  const showTemporarySuccess = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const filteredCourses = courses.filter((c) =>
    c.id.toString().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Manage Courses</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure study course listings dynamically visible during registration.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/10 cursor-pointer border-none outline-none"
        >
          <Plus className="h-4 w-4" />
          Add New Course
        </button>
      </div>

      {/* Message Banners */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-600 dark:text-red-400 font-bold">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 text-xs text-emerald-650 dark:text-emerald-400 font-bold">
          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Main Listing Panel */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        
        {/* Table controls */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-bold text-slate-550 dark:text-slate-400">
            {filteredCourses.length} Courses Available
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="block w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs px-9 py-2 transition text-slate-900 dark:text-white"
              />
            </div>

            {/* Reload button */}
            <button
              onClick={fetchCourses}
              disabled={loading}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-400 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4.5 w-4.5 ${loading ? "animate-spin text-emerald-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-xs text-slate-500 font-semibold">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 p-5 text-center">
              <GraduationCap className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-black text-slate-900 dark:text-white mt-2">No courses found</p>
              <p className="text-[11px] text-slate-450 font-semibold">
                {searchQuery ? "No courses match your search query." : "There are currently no courses in the database. Add your first course."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-955/40 border-b border-slate-100 dark:border-slate-850 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-4 px-6">Course ID</th>
                  <th className="py-4 px-5">Course Name</th>
                  <th className="py-4 px-5">Date Created</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Status Toggle</th>
                  <th className="py-4 px-5">Pricing</th>
                  <th className="py-4 px-5">Price (₹)</th>
                  <th className="py-4 px-5 text-center">Paid Toggle</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-slate-600 dark:text-slate-350 transition-colors">
                    
                    {/* Course ID */}
                    <td className="py-4 px-6 font-mono text-[10.5px] font-black tracking-wider text-emerald-700 dark:text-emerald-400 select-all">
                      <div className="flex items-center gap-1.5">
                        <Key className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {c.id}
                      </div>
                    </td>

                    {/* Course Name */}
                    <td className="py-4 px-5 font-extrabold text-slate-950 dark:text-white text-xs">
                      {c.name}
                    </td>

                    {/* Created At */}
                    <td className="py-4 px-5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {formatDate(c.createdAt)}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                        c.active
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-rose-105 text-rose-800 dark:bg-rose-955/40 dark:text-rose-400"
                      }`}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => handleToggleStatus(c.id, c.active)}
                        disabled={actionLoading === `toggle-${c.id}`}
                        className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none disabled:opacity-50 ${
                          c.active ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                        title={c.active ? "Click to Deactivate" : "Click to Activate"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            c.active ? "translate-x-4.5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Pricing Badge */}
                    <td className="py-4 px-5">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                        c.premium
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400"
                          : "bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-400"
                      }`}>
                        {c.premium ? "Paid" : "Free"}
                      </span>
                    </td>
 
                    {/* Course Price */}
                    <td className="py-4 px-5 font-black text-slate-800 dark:text-slate-200 text-xs">
                      {c.premium ? `₹${Number(c.price || 299).toFixed(0)}` : "FREE"}
                    </td>

                    {/* Paid Toggle Switch */}
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => handleTogglePricing(c.id, c.premium)}
                        disabled={actionLoading === `pricing-${c.id}`}
                        className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none disabled:opacity-50 ${
                          c.premium ? "bg-purple-650" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                        title={c.premium ? "Click to make Free" : "Click to make Paid"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            c.premium ? "translate-x-4.5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(c)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 active:scale-95 transition cursor-pointer"
                          title="Edit Course"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          disabled={actionLoading === `del-${c.id}`}
                          className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                          title="Delete Course"
                        >
                          {actionLoading === `del-${c.id}` ? (
                             <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-605 border-t-transparent" />
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
      </div>

      {/* Save Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/65 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl relative space-y-5">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                {isEditMode ? "Edit Course details" : "Create New Course"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                {isEditMode ? "Modify course name and premium details in the database." : "Configure a study area option for students to enroll in."}
              </p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800/80" />

            <form onSubmit={handleSaveCourse} className="space-y-4">
              {/* Course Name */}
              <div>
                <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Course Name (Display Label)
                </label>
                <input
                  type="text"
                  required
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="e.g. Web Development Basics"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 px-4 py-2.5 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 dark:text-white font-semibold"
                  disabled={actionLoading === "create" || actionLoading === "edit"}
                />
              </div>

              {/* Pricing Choice */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-955/40 border border-slate-200 dark:border-slate-850 p-3.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setNewCoursePremium(!newCoursePremium)}
                  className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none disabled:opacity-50 ${
                    newCoursePremium ? "bg-purple-650" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  disabled={actionLoading === "create" || actionLoading === "edit"}
                >
                  <span
                    className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      newCoursePremium ? "translate-x-4.5" : "translate-x-0"
                    }`}
                  />
                </button>
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-white">Premium Paid Course</span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Toggling on will lock advanced tests for this course as Premium.</span>
                </div>
              </div>
 
              {/* Premium price field */}
              {newCoursePremium && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Premium Pass Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(e.target.value)}
                    placeholder="e.g. 299"
                    className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 px-4 py-2.5 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 dark:text-white font-semibold"
                    disabled={actionLoading === "create" || actionLoading === "edit"}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 px-5 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition cursor-pointer"
                  disabled={actionLoading === "create" || actionLoading === "edit"}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-emerald-600/10 active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer border-none"
                  disabled={actionLoading === "create" || actionLoading === "edit"}
                >
                  {actionLoading === "create" || actionLoading === "edit" ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    isEditMode ? "Save Changes" : "Create Course"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
