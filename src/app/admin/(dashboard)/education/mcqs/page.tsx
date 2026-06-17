"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { 
  HelpCircle, 
  Trash2, 
  RefreshCw, 
  Search, 
  Plus, 
  X, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  BookOpen,
  Code,
  Database,
  Calculator,
  Activity,
  List,
  Grid,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from "lucide-react";

interface CourseRecord {
  id: number;
  name: string;
  active: boolean;
}

interface MCQRecord {
  id: number;
  courseId: number;
  course: {
    name: string;
  };
  question: string;
  options: string[];
  answer: number;
  hint: string;
  createdAt: string;
}

const getCourseIcon = (name: string) => {
  const lowercase = name.toLowerCase();
  if (lowercase.includes("web") || lowercase.includes("development") || lowercase.includes("html") || lowercase.includes("css")) {
    return Code;
  }
  if (lowercase.includes("computer") || lowercase.includes("science") || lowercase.includes("cs")) {
    return Database;
  }
  if (lowercase.includes("english") || lowercase.includes("grammar")) {
    return BookOpen;
  }
  if (lowercase.includes("math") || lowercase.includes("algebra") || lowercase.includes("calculator")) {
    return Calculator;
  }
  if (lowercase.includes("neet") || lowercase.includes("medical") || lowercase.includes("prep")) {
    return Activity;
  }
  return GraduationCap;
};

const getCourseCardStyle = (name: string, isActive: boolean) => {
  const lowercase = name.toLowerCase();
  if (lowercase.includes("web")) {
    return isActive 
      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 dark:bg-emerald-500/5 ring-1 ring-emerald-500 shadow-sm"
      : "border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10";
  }
  if (lowercase.includes("computer")) {
    return isActive
      ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400 dark:bg-blue-500/5 ring-1 ring-blue-500 shadow-sm"
      : "border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-500/40 hover:bg-blue-50/20 dark:hover:bg-blue-950/10";
  }
  if (lowercase.includes("english")) {
    return isActive
      ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 dark:bg-amber-500/5 ring-1 ring-amber-500 shadow-sm"
      : "border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-amber-500/40 hover:bg-amber-50/20 dark:hover:bg-amber-950/10";
  }
  if (lowercase.includes("math")) {
    return isActive
      ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400 dark:bg-purple-500/5 ring-1 ring-purple-500 shadow-sm"
      : "border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-500/40 hover:bg-purple-50/20 dark:hover:bg-purple-950/10";
  }
  if (lowercase.includes("neet")) {
    return isActive
      ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-450 dark:bg-rose-500/5 ring-1 ring-rose-500 shadow-sm"
      : "border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-rose-500/40 hover:bg-rose-50/20 dark:hover:bg-rose-950/10";
  }
  return isActive
    ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 dark:bg-indigo-500/5 ring-1 ring-indigo-500 shadow-sm"
    : "border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10";
};

const getAllCoursesCardStyle = (isActive: boolean) => {
  return isActive
    ? "border-slate-900 bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 dark:border-slate-50 ring-1 ring-slate-900 dark:ring-white shadow-sm"
    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-750 dark:text-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50";
};

export default function MCQsAdminPage() {
  const [mcqs, setMcqs] = useState<MCQRecord[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Upgraded layout states
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedFilterCourseId, setSelectedFilterCourseId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Bulk CSV Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCourseId, setUploadCourseId] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Modal/Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState("0");
  const [hintText, setHintText] = useState("");

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/courses`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || []);
        if (data.courses && data.courses.length > 0) {
          setSelectedCourseId(data.courses[0].id.toString());
          setUploadCourseId(data.courses[0].id.toString());
        }
      }
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchMcqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/mcqs`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMcqs(data.mcqs || []);
      } else {
        throw new Error(data.message || "Failed to load MCQ questions.");
      }
    } catch (err: any) {
      setError("Failed to fetch MCQ questions. Verify database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchMcqs();
  }, []);

  const openAddModal = () => {
    setQuestionText("");
    setOption1("");
    setOption2("");
    setOption3("");
    setOption4("");
    setCorrectAnswerIndex("0");
    setHintText("");
    if (courses.length > 0) {
      setSelectedCourseId(courses[0].id.toString());
    }
    setError(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleSaveMcq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !questionText || !option1 || !option2 || !option3 || !option4) {
      setError("Please fill in the course, question, and all four option fields.");
      return;
    }

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading("create");
    setError(null);
    setSuccessMsg(null);

    const optionsArray = [option1.trim(), option2.trim(), option3.trim(), option4.trim()];

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/mcqs`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}` 
        },
        body: JSON.stringify({
          courseId: selectedCourseId,
          question: questionText,
          options: optionsArray,
          answer: correctAnswerIndex,
          hint: hintText
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("MCQ question added successfully!");
        setIsModalOpen(false);
        fetchMcqs();
      } else {
        throw new Error(data.message || "Failed to create question.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save MCQ question.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setUploadError(null);
    setParsedQuestions([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          throw new Error("Empty CSV file.");
        }

        const lines = text.split(/\r?\n/);
        if (lines.length < 2) {
          throw new Error("CSV file must have a header row and at least one question row.");
        }

        const parseCSVLine = (line: string) => {
          const result = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const questionsTemp: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const cols = parseCSVLine(line);
          if (cols.length < 5) {
            continue;
          }

          const question = cols[0];
          const option1 = cols[1];
          const option2 = cols[2];
          const option3 = cols[3] || "";
          const option4 = cols[4] || "";
          let correctOption = cols[5] ? parseInt(cols[5], 10) : NaN;
          const hint = cols[6] || "";

          if (!question || !option1 || !option2) {
            continue;
          }

          let finalAnswerIdx = 0;
          if (!isNaN(correctOption)) {
            if (correctOption >= 1 && correctOption <= 4) {
              finalAnswerIdx = correctOption - 1;
            } else if (correctOption >= 0 && correctOption <= 3) {
              finalAnswerIdx = correctOption;
            }
          }

          questionsTemp.push({
            question,
            options: [option1, option2, option3, option4].filter(opt => opt !== ""),
            answer: finalAnswerIdx,
            hint
          });
        }

        if (questionsTemp.length === 0) {
          throw new Error("No valid question rows were successfully parsed.");
        }

        setParsedQuestions(questionsTemp);
      } catch (err: any) {
        setUploadError(err.message || "Failed to parse CSV file.");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveBulkMcqs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadCourseId || parsedQuestions.length === 0) {
      setUploadError("Please select a target course and load a valid CSV file.");
      return;
    }

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading("bulk-create");
    setUploadError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/mcqs/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify({
          courseId: uploadCourseId,
          questions: parsedQuestions
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Successfully imported ${data.count} questions!`);
        setIsUploadModalOpen(false);
        setParsedQuestions([]);
        setCsvFile(null);
        fetchMcqs();
      } else {
        throw new Error(data.message || "Failed to import questions.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to save CSV questions.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteMcq = async (id: number) => {
    const isDark = document.querySelector(".dark") !== null;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this MCQ question from the database?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#64748b",
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#1e293b",
    });

    if (!result.isConfirmed) return;

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(`delete-${id}`);
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/admin/mcqs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("MCQ question deleted successfully.");
        setMcqs(prev => prev.filter(q => q.id !== id));
      } else {
        throw new Error(data.message || "Failed to delete question.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete question.");
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to delete question.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Count mcqs grouped by course
  const courseCounts: Record<number, number> = {};
  mcqs.forEach(q => {
    courseCounts[q.courseId] = (courseCounts[q.courseId] || 0) + 1;
  });

  // Filter mcqs by active course card selection
  const courseFilteredMcqs = mcqs.filter(q => {
    if (!selectedFilterCourseId) return true;
    return q.courseId === parseInt(selectedFilterCourseId, 10);
  });

  // Filter mcqs by search query
  const filteredMcqs = courseFilteredMcqs.filter(
    q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination math
  const totalItems = filteredMcqs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedMcqs = filteredMcqs.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* Header section with Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">MCQ Questions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage multiple-choice questions for foundation education programs.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60 active:scale-[0.98] transition-all px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Upload CSV Sheet
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create MCQ Question
          </button>
        </div>
      </div>

      {/* Course Bundle Summary Cards (Fuzzy-matching course counts) */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Course Practice Bundles</h3>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {/* All Courses Card */}
          <button
            onClick={() => {
              setSelectedFilterCourseId("");
              setCurrentPage(1);
            }}
            className={`rounded-2xl border p-4 text-left transition-all cursor-pointer duration-300 flex flex-col justify-between h-28 ${getAllCoursesCardStyle(selectedFilterCourseId === "")}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <List className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Total MCQ Sets</p>
              <h4 className="text-sm font-black mt-0.5">{mcqs.length} Questions</h4>
            </div>
          </button>

          {/* Course cards dynamically loaded */}
          {courses.map(c => {
            const count = courseCounts[c.id] || 0;
            const IconComponent = getCourseIcon(c.name);
            const isActive = selectedFilterCourseId === c.id.toString();
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedFilterCourseId(c.id.toString());
                  setCurrentPage(1);
                }}
                className={`rounded-2xl border p-4 text-left transition-all cursor-pointer duration-300 flex flex-col justify-between h-28 ${getCourseCardStyle(c.name, isActive)}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100/80 dark:bg-slate-800/85">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold truncate max-w-full" title={c.name}>{c.name}</p>
                  <h4 className="text-sm font-black mt-0.5">{count} Questions</h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Search, Layout Swapper, and Questions Area */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>{filteredMcqs.length} MCQ Questions Available</span>
            {loading && <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-400" />}
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* View switcher toggles */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-slate-400 hover:text-slate-650"
                }`}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("card")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "card"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-slate-400 hover:text-slate-650"
                }`}
                title="Card View"
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>

            <div className="relative w-full max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search MCQs by question..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-2 pl-10 pr-4 text-xs outline-none focus:border-emerald-600 transition font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
            <p className="text-xs font-bold">Loading MCQ questions...</p>
          </div>
        ) : filteredMcqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center text-slate-400 dark:text-slate-500">
            <HelpCircle className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No MCQ Questions Found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm font-medium">
              {searchQuery ? "No questions match your search query." : "Create or upload questions to populate this practice bundle."}
            </p>
          </div>
        ) : viewMode === "table" ? (
          // TABLE LAYOUT VIEW
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Question</th>
                  <th className="px-6 py-4">Options</th>
                  <th className="px-6 py-4">Correct Answer</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-350">
                {paginatedMcqs.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-950/10">
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {q.course.name}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 max-w-xs md:max-w-sm truncate" title={q.question}>
                      {q.question}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="space-y-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <p className={q.answer === 0 ? "font-bold text-emerald-600" : ""}>1. {q.options[0]}</p>
                        <p className={q.answer === 1 ? "font-bold text-emerald-600" : ""}>2. {q.options[1]}</p>
                        <p className={q.answer === 2 ? "font-bold text-emerald-600" : ""}>3. {q.options[2]}</p>
                        <p className={q.answer === 3 ? "font-bold text-emerald-600" : ""}>4. {q.options[3]}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-455 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Option {q.answer + 1}
                      </span>
                      {q.hint && (
                        <p className="text-[9px] text-slate-400 mt-1 max-w-[120px] truncate" title={q.hint}>
                          Hint: {q.hint}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteMcq(q.id)}
                        disabled={actionLoading === `delete-${q.id}`}
                        className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer"
                        title="Delete Question"
                      >
                        {actionLoading === `delete-${q.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // CARD LAYOUT VIEW
          <div className="grid gap-6 sm:grid-cols-2 p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850">
            {paginatedMcqs.map((q) => (
              <div 
                key={q.id}
                className="rounded-2xl border p-5.5 space-y-4 transition-all duration-300 hover:shadow-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header: Course Badge & Delete Button */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      {q.course.name}
                    </span>
                    <button
                      onClick={() => handleDeleteMcq(q.id)}
                      disabled={actionLoading === `delete-${q.id}`}
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer"
                      title="Delete Question"
                    >
                      {actionLoading === `delete-${q.id}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Question #{q.id}</p>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isCorrect = q.answer === optIndex;
                      return (
                        <div
                          key={optIndex}
                          className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between ${
                            isCorrect
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                              : "bg-slate-50/55 dark:bg-slate-950/20 border-slate-150 dark:border-slate-850 text-slate-650 dark:text-slate-350"
                          }`}
                        >
                          <span className="truncate max-w-[85%]">{optIndex + 1}. {opt}</span>
                          {isCorrect && (
                            <span className="text-[9px] uppercase font-black bg-emerald-500/25 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-450">
                              Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hint/Explanation Footer */}
                {q.hint && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs text-slate-500 dark:text-slate-400 flex gap-2 mt-2">
                    <HelpCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <span className="font-bold">Explanation / Hint:</span>
                      <p className="mt-0.5 leading-relaxed">{q.hint}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && filteredMcqs.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-850 dark:text-slate-200">{totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}</span> to{" "}
              <span className="font-bold text-slate-850 dark:text-slate-200">
                {Math.min(safeCurrentPage * pageSize, totalItems)}
              </span>{" "}
              of <span className="font-bold text-slate-850 dark:text-slate-200">{totalItems}</span> questions
            </div>

            <div className="flex items-center gap-4.5 self-center sm:self-auto">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-slate-400">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value, 10));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1 outline-none text-xs text-slate-700 dark:text-slate-300"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={safeCurrentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 1)
                    .map((p, idx, arr) => {
                      const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                      return (
                        <div key={p} className="flex items-center gap-1">
                          {showEllipsis && <span className="text-slate-450 px-1 text-xs">...</span>}
                          <button
                            type="button"
                            onClick={() => setCurrentPage(p)}
                            className={`h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              safeCurrentPage === p
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                                : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={safeCurrentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Creation Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                Add New MCQ Question
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-605 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveMcq} className="space-y-4">
              
              {/* Select Enrolled Course */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-2">
                  Select Enrolled Course
                </label>
                {coursesLoading ? (
                  <div className="flex items-center gap-2 text-xs text-slate-405">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading dynamic courses...
                  </div>
                ) : (
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 outline-none text-xs font-semibold focus:border-emerald-600 transition"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-2">
                  Question Text
                </label>
                <textarea
                  required
                  placeholder="e.g. Which of the following tags is semantic HTML5?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={2}
                  className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 outline-none text-xs font-semibold focus:border-emerald-600 transition"
                />
              </div>

              {/* MCQ Options Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5">
                    Option 1
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter first option"
                    value={option1}
                    onChange={(e) => setOption1(e.target.value)}
                    className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 outline-none text-xs font-semibold focus:border-emerald-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5">
                    Option 2
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter second option"
                    value={option2}
                    onChange={(e) => setOption2(e.target.value)}
                    className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 outline-none text-xs font-semibold focus:border-emerald-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5">
                    Option 3
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter third option"
                    value={option3}
                    onChange={(e) => setOption3(e.target.value)}
                    className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 outline-none text-xs font-semibold focus:border-emerald-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5">
                    Option 4
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter fourth option"
                    value={option4}
                    onChange={(e) => setOption4(e.target.value)}
                    className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 outline-none text-xs font-semibold focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              {/* Correct Answer Dropdown */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-2">
                  Select Correct Option
                </label>
                <select
                  value={correctAnswerIndex}
                  onChange={(e) => setCorrectAnswerIndex(e.target.value)}
                  className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 outline-none text-xs font-semibold focus:border-emerald-600 transition"
                >
                  <option value="0">Option 1 is correct</option>
                  <option value="1">Option 2 is correct</option>
                  <option value="2">Option 3 is correct</option>
                  <option value="3">Option 4 is correct</option>
                </select>
              </div>

              {/* Hint (Optional) */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-2">
                  Hint / Explanation (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HTML5 semantic tags define content structure explicitly."
                  value={hintText}
                  onChange={(e) => setHintText(e.target.value)}
                  className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 outline-none text-xs font-semibold focus:border-emerald-600 transition"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-350 bg-white dark:bg-slate-950 hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "create"}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/10 transition disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading === "create" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving question...
                    </>
                  ) : (
                    <>
                      Create MCQ Question
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Batch Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                Upload MCQ Questions Sheet (CSV)
              </h3>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setParsedQuestions([]);
                  setCsvFile(null);
                  setUploadError(null);
                }}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {uploadError && (
              <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{uploadError}</p>
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleSaveBulkMcqs} className="space-y-4">
              
              {/* Select Target Course */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-2">
                  Select Target Course for Import
                </label>
                <select
                  value={uploadCourseId}
                  onChange={(e) => setUploadCourseId(e.target.value)}
                  className="block w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 outline-none text-xs font-semibold focus:border-emerald-600 transition"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Template Guidelines */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 p-4 space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-455 dark:text-slate-500">Expected CSV Template Columns</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Make sure your CSV has a header row. Columns must be placed in the following order:
                </p>
                <div className="bg-slate-100 dark:bg-slate-955 rounded-lg p-2.5 font-mono text-[10px] text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
                  Question, Option 1, Option 2, Option 3, Option 4, Correct Option (1-4), Hint
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed">
                  * Note: Correct option must be an integer from 1 to 4. Explanation/Hint column is optional.
                </p>
              </div>

              {/* File Upload Zone */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-2">
                  Choose CSV File
                </label>
                <div className="relative border-2 border-dashed border-slate-250 dark:border-slate-800 rounded-2xl hover:border-emerald-500/60 transition-all p-6 text-center cursor-pointer bg-slate-50/20 dark:bg-slate-950/5">
                  <input
                    type="file"
                    accept=".csv"
                    required
                    onChange={handleCSVUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1.5 flex flex-col items-center">
                    <FileSpreadsheet className="h-8 w-8 text-slate-450" />
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-350">
                      {csvFile ? csvFile.name : "Click or drag & drop questions template .csv file"}
                    </div>
                    {csvFile && (
                      <p className="text-[9px] text-emerald-600 font-extrabold uppercase">
                        {(csvFile.size / 1024).toFixed(2)} KB
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Parsed Preview List */}
              {parsedQuestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500">
                    Preview Parsed Questions ({parsedQuestions.length} items found)
                  </h4>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-950">
                    {parsedQuestions.slice(0, 10).map((q, idx) => (
                      <div key={idx} className="p-3 text-[11px] font-semibold space-y-1">
                        <p className="text-slate-805 dark:text-slate-300">
                          <span className="text-slate-400">Q{idx + 1}:</span> {q.question}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Options: {q.options.length} | Correct Answer: Option {q.answer + 1}
                        </p>
                      </div>
                    ))}
                    {parsedQuestions.length > 10 && (
                      <div className="p-2.5 text-[10px] text-center text-slate-405 font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                        + {parsedQuestions.length - 10} more questions parsed
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setParsedQuestions([]);
                    setCsvFile(null);
                    setUploadError(null);
                  }}
                  className="rounded-xl border border-slate-350 bg-white dark:bg-slate-955 hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "bulk-create" || parsedQuestions.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/10 transition disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading === "bulk-create" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Uploading questions...
                    </>
                  ) : (
                    <>
                      Import MCQ Questions
                    </>
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

