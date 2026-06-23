"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { 
  FileText, 
  Trash2, 
  RefreshCw, 
  Search, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  X,
  Pencil,
  Lock,
  Layers,
  GraduationCap
} from "lucide-react";

interface CourseRecord {
  id: number;
  name: string;
}

interface TestSeriesRecord {
  id: number;
  name: string;
  type: string;
  qs: number;
  marks: number;
  duration: number;
  isFree: boolean;
  courseId: number;
  course: {
    name: string;
  };
  createdAt: string;
}

export default function TestSeriesAdminPage() {
  const [testSeries, setTestSeries] = useState<TestSeriesRecord[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("All");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTestId, setEditTestId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("Full Mock");
  const [qs, setQs] = useState<number>(100);
  const [marks, setMarks] = useState<number>(100);
  const [duration, setDuration] = useState<number>(90);
  const [isFree, setIsFree] = useState(false);
  const [courseId, setCourseId] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      // Fetch test series
      const testRes = await fetch(`${apiUrl}/api/admin/test-series`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const testData = await testRes.json();
      if (testRes.ok) {
        setTestSeries(testData.testSeries || []);
      } else {
        throw new Error(testData.message || "Failed to load test series.");
      }

      // Fetch courses for dropdown select list
      const courseRes = await fetch(`${apiUrl}/api/admin/courses`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const courseData = await courseRes.json();
      if (courseRes.ok) {
        setCourses(courseData.courses || []);
      }
    } catch (err: any) {
      setError("Failed to fetch records. Verify your network or database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !courseId) return;

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(isEditMode ? "edit" : "create");
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const payload = {
        name: name.trim(),
        type: type.trim(),
        qs,
        marks,
        duration,
        isFree,
        courseId
      };

      let res;
      if (isEditMode) {
        res = await fetch(`${apiUrl}/api/admin/test-series/${editTestId}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}` 
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiUrl}/api/admin/test-series`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}` 
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save test series.");
      }

      if (isEditMode) {
        setTestSeries(prev => prev.map(t => t.id === editTestId ? data.testSeries : t));
        showTemporarySuccess("Test series updated successfully!");
      } else {
        setTestSeries(prev => [data.testSeries, ...prev]);
        showTemporarySuccess("Test series created successfully!");
      }
      
      closeAndResetModal();
    } catch (err: any) {
      setError(err.message || "Failed to save test series.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePricing = async (id: number, currentFreeStatus: boolean) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(`pricing-${id}`);
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/test-series/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}` 
        },
        body: JSON.stringify({ isFree: !currentFreeStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to toggle pricing.");
      }

      setTestSeries(prev => prev.map(t => t.id === id ? { ...t, isFree: !currentFreeStatus } : t));
      showTemporarySuccess(`Test "${id}" pricing changed successfully.`);
    } catch (err: any) {
      setError(err.message || "Failed to toggle pricing.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTest = async (id: number) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this test series entry!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    setActionLoading(`delete-${id}`);
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/test-series/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete test series.");
      }

      setTestSeries(prev => prev.filter(t => t.id !== id));
      Swal.fire("Deleted!", "The test series entry has been deleted.", "success");
    } catch (err: any) {
      setError(err.message || "Failed to delete test series.");
    } finally {
      setActionLoading(null);
    }
  };

  const showTemporarySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setName("");
    setType("Full Mock");
    setQs(100);
    setMarks(100);
    setDuration(90);
    setIsFree(false);
    setCourseId(courses[0]?.id?.toString() || "");
    setIsModalOpen(true);
  };

  const openEditModal = (test: TestSeriesRecord) => {
    setIsEditMode(true);
    setEditTestId(test.id);
    setName(test.name);
    setType(test.type);
    setQs(test.qs);
    setMarks(test.marks);
    setDuration(test.duration);
    setIsFree(test.isFree);
    setCourseId(test.courseId.toString());
    setIsModalOpen(true);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditTestId(null);
    setName("");
    setType("Full Mock");
    setQs(100);
    setMarks(100);
    setDuration(90);
    setIsFree(false);
    setCourseId("");
  };

  const filteredTestSeries = testSeries.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourseFilter === "All" || test.courseId.toString() === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-600" />
            Manage Test Series
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Define dynamic mock exams, subject-specific drills, and unlock states for enrolled students.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-3 text-xs font-bold transition shadow-md shadow-emerald-950/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Test Series
        </button>
      </div>

      {/* Message Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 transition">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-800 transition">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-655" />
          {error}
        </div>
      )}

      {/* Filters and Search panel */}
      <div className="grid gap-4 sm:grid-cols-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mock test by name..."
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs transition text-slate-900 dark:text-white"
          />
        </div>
        {/* Course Filter */}
        <div>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs transition text-slate-700 dark:text-slate-350 cursor-pointer"
          >
            <option value="All">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-850 text-left text-xs font-semibold">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-450 uppercase tracking-wider text-[10px] font-black">
              <tr>
                <th className="px-6 py-4">Test Details</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Pattern (Qs/Marks/Mins)</th>
                <th className="px-6 py-4">Pricing</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                      <p className="text-xs font-bold text-slate-550">Loading test series records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTestSeries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <FileText className="mx-auto h-8 w-8 mb-2 text-slate-300" />
                    No test series matches the criteria. Click "Add Test Series" to create one.
                  </td>
                </tr>
              ) : (
                filteredTestSeries.map(test => (
                  <tr key={test.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900 dark:text-white">{test.name}</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">ID: {test.id}</div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate">
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 text-[10.5px] font-bold text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                        <GraduationCap className="h-3 w-3" />
                        {test.course.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        test.type === "Full Mock" 
                          ? "bg-purple-100 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400"
                          : test.type === "Subject Test" || test.type === "Chapter Test"
                            ? "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
                            : "bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400"
                      }`}>
                        {test.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-650 dark:text-slate-350">
                      <div className="font-bold">{test.qs} Qs | {test.marks} Marks</div>
                      <div className="text-[10px] font-semibold text-slate-450 mt-0.5">{test.duration} Mins</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        disabled={actionLoading === `pricing-${test.id}`}
                        onClick={() => handleTogglePricing(test.id, test.isFree)}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition border cursor-pointer ${
                          test.isFree 
                            ? "bg-emerald-50 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-805 text-emerald-800 dark:text-emerald-400"
                            : "bg-purple-50 dark:bg-purple-950/25 border-purple-200 dark:border-purple-805 text-purple-800 dark:text-purple-400"
                        }`}
                      >
                        {!test.isFree && <Lock className="h-2.5 w-2.5" />}
                        {test.isFree ? "Free" : "Premium"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(test)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          disabled={actionLoading === `delete-${test.id}`}
                          onClick={() => handleDeleteTest(test.id)}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal block edit / create */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl relative space-y-4 text-slate-900 dark:text-white">
            <button 
              onClick={closeAndResetModal} 
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-extrabold flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              {isEditMode ? "Edit Test Series Record" : "Add New Test Series Entry"}
            </h3>
            
            <hr className="border-slate-100 dark:border-slate-800" />

            <form onSubmit={handleSaveTest} className="space-y-4 text-xs font-semibold">
              {/* Course Selection */}
              <div className="space-y-1.5">
                <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Select Course</label>
                <select
                  required
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-700 dark:text-slate-350 cursor-pointer"
                >
                  <option value="" disabled>Choose target course...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>

              {/* Test Name */}
              <div className="space-y-1.5">
                <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Test Title</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Full Length Mock Test 1 or Subject Test: Algebra"
                  className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-905 dark:text-white"
                />
              </div>

              {/* Row: Type and isFree */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Test Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-700 dark:text-slate-350 cursor-pointer"
                  >
                    <option value="Full Mock">Full Mock</option>
                    <option value="Subject Test">Subject Test</option>
                    <option value="Chapter Test">Chapter Test</option>
                    <option value="PYP">PYP</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Pricing Access</label>
                  <select
                    value={isFree ? "free" : "paid"}
                    onChange={(e) => setIsFree(e.target.value === "free")}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-700 dark:text-slate-350 cursor-pointer"
                  >
                    <option value="free">Free Access</option>
                    <option value="paid">Premium (Paid Locked)</option>
                  </select>
                </div>
              </div>

              {/* Row: Qs, Marks, Mins */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Questions Count</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={qs}
                    onChange={(e) => setQs(parseInt(e.target.value, 10) || 0)}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-905 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Total Marks</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={marks}
                    onChange={(e) => setMarks(parseInt(e.target.value, 10) || 0)}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-905 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Duration (Mins)</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-905 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeAndResetModal}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "edit" || actionLoading === "create"}
                  className="rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 transition shadow-md shadow-emerald-950/10 cursor-pointer"
                >
                  {actionLoading === "edit" || actionLoading === "create" ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
