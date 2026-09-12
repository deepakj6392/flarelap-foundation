"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  GraduationCap,
  Lock,
  Calendar,
  FileText,
  Layers,
  Pencil,
  Eye,
  Save,
  Check,
} from "lucide-react";

interface CategoryRecord {
  id: number;
  name: string;
}

interface CourseRecord {
  id: number;
  name: string;
  active: boolean;
  categoryId?: number | null;
  category?: {
    id?: number;
    name: string;
  } | null;
}

interface MCQRecord {
  id: number;
  courseId: number;
  testSeriesId?: number | null;
  course: {
    id?: number;
    name: string;
    categoryId?: number | null;
    category?: {
      id?: number;
      name: string;
    } | null;
  };
  question: string;
  options: string[];
  answer: number;
  hint: string;
  createdAt: string;
}

interface TestSeriesRecord {
  id: number;
  name: string;
  type: string;
  qs: number;
  marks: number;
  duration: number;
  isFree: boolean;
  active: boolean;
  courseId: number;
  course: {
    id?: number;
    name: string;
    categoryId?: number | null;
    category?: {
      id?: number;
      name: string;
    } | null;
  };
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
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [mcqs, setMcqs] = useState<MCQRecord[]>([]);
  const [testSeries, setTestSeries] = useState<TestSeriesRecord[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainTab, setMainTab] = useState<"tests" | "questions">("tests");

  // Filter dropdown states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubCourseId, setSelectedSubCourseId] = useState<string>("");

  // Upgraded layout states
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedFilterCourseId, setSelectedFilterCourseId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Test Series Modal / Form State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isTestEditMode, setIsTestEditMode] = useState(false);
  const [editTestId, setEditTestId] = useState<number | null>(null);
  const [testName, setTestName] = useState("");
  const [testType, setTestType] = useState("Full Mock");
  const [testQs, setTestQs] = useState<number>(50);
  const [testMarks, setTestMarks] = useState<number>(50);
  const [testDuration, setTestDuration] = useState<number>(60);
  const [testIsFree, setTestIsFree] = useState(true);
  const [testActive, setTestActive] = useState(true);
  const [testCourseId, setTestCourseId] = useState("");

  // View Test Questions Modal State
  const [isViewQuestionsModalOpen, setIsViewQuestionsModalOpen] = useState(false);
  const [viewingTestQuestions, setViewingTestQuestions] = useState<TestSeriesRecord | null>(null);
  const [viewQuestionsSearch, setViewQuestionsSearch] = useState("");

  // Question Edit Inline State
  const [editingMcqId, setEditingMcqId] = useState<number | null>(null);
  const [editQText, setEditQText] = useState("");
  const [editQOpt1, setEditQOpt1] = useState("");
  const [editQOpt2, setEditQOpt2] = useState("");
  const [editQOpt3, setEditQOpt3] = useState("");
  const [editQOpt4, setEditQOpt4] = useState("");
  const [editQAnswer, setEditQAnswer] = useState<number>(0);
  const [editQHint, setEditQHint] = useState("");

  const startEditingMcq = (q: MCQRecord) => {
    setEditingMcqId(q.id);
    setEditQText(q.question);
    setEditQOpt1(q.options[0] || "");
    setEditQOpt2(q.options[1] || "");
    setEditQOpt3(q.options[2] || "");
    setEditQOpt4(q.options[3] || "");
    setEditQAnswer(q.answer);
    setEditQHint(q.hint || "");
  };

  const cancelEditingMcq = () => {
    setEditingMcqId(null);
  };

  const handleUpdateMcq = async (qId: number) => {
    if (!editQText.trim() || !editQOpt1.trim() || !editQOpt2.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Question text and at least Option 1 and Option 2 are required.",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(`update-mcq-${qId}`);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const opts = [editQOpt1.trim(), editQOpt2.trim()];
      if (editQOpt3.trim()) opts.push(editQOpt3.trim());
      if (editQOpt4.trim()) opts.push(editQOpt4.trim());

      const res = await fetch(`${apiUrl}/api/admin/mcqs/${qId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          question: editQText.trim(),
          options: opts,
          answer: editQAnswer,
          hint: editQHint.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.question) {
        setMcqs((prev) =>
          prev.map((item) => (item.id === qId ? { ...item, ...data.question } : item))
        );
        setEditingMcqId(null);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Question Updated Successfully!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        throw new Error(data.message || "Failed to update question.");
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.message || "Failed to update MCQ question.",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openViewTestQuestionsModal = async (test: TestSeriesRecord) => {
    setViewingTestQuestions(test);
    setViewQuestionsSearch("");
    setEditingMcqId(null);
    setIsViewQuestionsModalOpen(true);

    try {
      const storedToken = localStorage.getItem("admin_token");
      if (storedToken) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/admin/mcqs?courseId=${test.courseId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.mcqs) {
            setMcqs((prev) => {
              const fetchedIds = new Set(data.mcqs.map((q: any) => q.id));
              const prevRemaining = prev.filter((q) => !fetchedIds.has(q.id));
              return [...data.mcqs, ...prevRemaining];
            });
          }
        }
      }
    } catch (err) {
      console.error("Failed to load questions for test series:", err);
    }
  };

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

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const fetchCategories = async () => {
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/admin/categories`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
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

  const fetchTestSeries = async () => {
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/admin/test-series`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTestSeries(data.testSeries || []);
      }
    } catch (err) {
      console.error("Failed to load test series:", err);
    }
  };

  const fetchMcqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
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
    fetchCategories();
    fetchTestSeries();
    fetchMcqs();
  }, []);

  const handleToggleTestActive = async (id: number, currentActive: boolean) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(`toggle-active-${id}`);
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/admin/test-series/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ active: !currentActive }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestSeries(prev => prev.map(t => t.id === id ? { ...t, active: !currentActive } : t));
        setSuccessMsg(`Test status updated to ${!currentActive ? 'Enabled' : 'Disabled'}.`);
      } else {
        throw new Error(data.message || "Failed to update test status.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to toggle test status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleTestPricing = async (id: number, currentIsFree: boolean) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(`toggle-free-${id}`);
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/admin/test-series/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ isFree: !currentIsFree }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestSeries(prev => prev.map(t => t.id === id ? { ...t, isFree: !currentIsFree } : t));
        setSuccessMsg(`Test access updated to ${!currentIsFree ? 'Free Access' : 'Paid / Premium'}.`);
      } else {
        throw new Error(data.message || "Failed to update test access.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to toggle test access.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTestSeries = async (id: number) => {
    const isDark = document.querySelector(".dark") !== null;
    const result = await Swal.fire({
      title: "Delete Test Series?",
      text: "Do you want to delete this test series entry from the database?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#1e293b",
    });

    if (!result.isConfirmed) return;

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(`delete-test-${id}`);
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/admin/test-series/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const data = await res.json();
      if (res.ok) {
        setTestSeries(prev => prev.filter(t => t.id !== id));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Mock Test Deleted Successfully!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        throw new Error(data.message || "Failed to delete test series.");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const openAddTestModal = () => {
    setIsTestEditMode(false);
    setEditTestId(null);
    setTestName("");
    setTestType("Full Mock");
    setTestQs(50);
    setTestMarks(50);
    setTestDuration(60);
    setTestIsFree(true);
    setTestActive(true);
    setTestCourseId(selectedSubCourseId || (courses[0]?.id?.toString() || ""));
    setIsTestModalOpen(true);
  };

  const openEditTestModal = (test: TestSeriesRecord) => {
    setIsTestEditMode(true);
    setEditTestId(test.id);
    setTestName(test.name);
    setTestType(test.type || "Full Mock");
    setTestQs(test.qs || 50);
    setTestMarks(test.marks || 50);
    setTestDuration(test.duration || 60);
    setTestIsFree(test.isFree !== false);
    setTestActive(test.active !== false);
    setTestCourseId(test.courseId.toString());
    setIsTestModalOpen(true);
  };

  const handleSaveTestSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName || !testCourseId) {
      setError("Please fill in test title and select a target sub course.");
      return;
    }

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    setActionLoading(isTestEditMode ? "edit-test" : "create-test");
    setError(null);
    setSuccessMsg(null);

    const payload = {
      name: testName.trim(),
      type: testType.trim(),
      qs: testQs,
      marks: testMarks,
      duration: testDuration,
      isFree: testIsFree,
      active: testActive,
      courseId: testCourseId,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      let res;
      if (isTestEditMode && editTestId) {
        res = await fetch(`${apiUrl}/api/admin/test-series/${editTestId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiUrl}/api/admin/test-series`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(isTestEditMode ? "Mock Test updated successfully!" : "Mock Test created successfully!");
        setIsTestModalOpen(false);
        fetchTestSeries();
      } else {
        throw new Error(data.message || "Failed to save test series.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save test series.");
    } finally {
      setActionLoading(null);
    }
  };

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/admin/mcqs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const data = await res.json();
      if (res.ok) {
        const deletedQ = mcqs.find(q => q.id === id);
        setMcqs(prev => prev.filter(q => q.id !== id));
        if (deletedQ) {
          setTestSeries(prev =>
            prev.map(t => {
              if (
                (deletedQ.testSeriesId && t.id === deletedQ.testSeriesId) ||
                (!deletedQ.testSeriesId && t.courseId === deletedQ.courseId)
              ) {
                const newQs = Math.max(0, t.qs - 1);
                return { ...t, qs: newQs, marks: newQs };
              }
              return t;
            })
          );
        }

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Question Deleted Successfully!",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
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

  // Sub-courses filtered by selected Main Course (Category)
  const filteredSubCourses = courses.filter((c) => {
    if (!selectedCategoryId) return true;
    const catId = c.categoryId ? c.categoryId.toString() : c.category?.id ? c.category.id.toString() : "";
    return catId === selectedCategoryId;
  });

  // Count mcqs and test series grouped by course
  const validTestIds = new Set(testSeries.map(t => t.id));
  const courseCounts: Record<number, number> = {};
  mcqs.forEach(q => {
    if (q.testSeriesId && validTestIds.has(q.testSeriesId)) {
      courseCounts[q.courseId] = (courseCounts[q.courseId] || 0) + 1;
    }
  });

  const courseTestCounts: Record<number, number> = {};
  testSeries.forEach(t => {
    courseTestCounts[t.courseId] = (courseTestCounts[t.courseId] || 0) + 1;
  });

  // Filter test series by selected Main Course (Category), Sub Course, or Search
  const filteredTestSeries = testSeries.filter(t => {
    if (selectedSubCourseId) {
      if (t.courseId !== parseInt(selectedSubCourseId, 10)) return false;
    } else if (selectedCategoryId) {
      const tCatId = t.course?.categoryId
        ? t.course.categoryId.toString()
        : t.course?.category?.id
        ? t.course.category.id.toString()
        : "";
      if (tCatId !== selectedCategoryId) return false;
    } else if (selectedFilterCourseId) {
      if (t.courseId !== parseInt(selectedFilterCourseId, 10)) return false;
    }

    if (searchQuery) {
      const qLower = searchQuery.toLowerCase();
      const nameMatch = t.name.toLowerCase().includes(qLower);
      const courseMatch = t.course.name.toLowerCase().includes(qLower);
      const catMatch = t.course.category?.name?.toLowerCase().includes(qLower);
      if (!nameMatch && !courseMatch && !catMatch) return false;
    }
    return true;
  });

  // Filter mcqs by active course/category selection
  const courseFilteredMcqs = mcqs.filter(q => {
    if (selectedSubCourseId) {
      return q.courseId === parseInt(selectedSubCourseId, 10);
    }
    if (selectedCategoryId) {
      const qCatId = q.course?.categoryId
        ? q.course.categoryId.toString()
        : q.course?.category?.id
        ? q.course.category.id.toString()
        : "";
      return qCatId === selectedCategoryId;
    }
    if (selectedFilterCourseId) {
      return q.courseId === parseInt(selectedFilterCourseId, 10);
    }
    return true;
  });

  // Filter mcqs by search query
  const filteredMcqs = courseFilteredMcqs.filter(
    q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination math for MCQs
  const totalItems = filteredMcqs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedMcqs = filteredMcqs.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  // Pagination math for Test Series
  const totalTestItems = filteredTestSeries.length;
  const totalTestPages = Math.ceil(totalTestItems / pageSize) || 1;
  const safeTestCurrentPage = Math.min(currentPage, totalTestPages);

  const paginatedTestSeries = filteredTestSeries.slice(
    (safeTestCurrentPage - 1) * pageSize,
    safeTestCurrentPage * pageSize
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">

      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-600" />
            Mock Test Series & MCQs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage mock tests (Mock Test 1, Mock Test 2, etc.) and multiple-choice questions per sub-course.
          </p>
        </div>

        <button
          onClick={openAddTestModal}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-bold transition shadow-md shadow-emerald-600/10 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" /> Create New Mock Test
        </button>
      </div>

      {/* 2-Tier Dependent Filter Bar: Main Course (Category) & Sub Course */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <GraduationCap className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Select Main Course & Sub Course Filter
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Main Course (Category) Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Main Course (Category)</span>
              <span className="text-[10px] text-slate-400 font-normal">Filters Sub Courses</span>
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                const catId = e.target.value;
                setSelectedCategoryId(catId);
                setSelectedSubCourseId("");
                setSelectedFilterCourseId("");
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:outline-none transition cursor-pointer"
            >
              <option value="">-- All Main Courses --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Course Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Sub Course
            </label>
            <select
              value={selectedSubCourseId}
              onChange={(e) => {
                const subId = e.target.value;
                setSelectedSubCourseId(subId);
                setSelectedFilterCourseId(subId);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:outline-none transition cursor-pointer"
            >
              <option value="">-- All Sub Courses --</option>
              {filteredSubCourses.length === 0 ? (
                <option value="" disabled>No sub-courses available</option>
              ) : (
                filteredSubCourses.map((c) => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.name} {c.category?.name ? `(${c.category.name})` : ""}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Course Bundle Summary Cards (Fuzzy-matching course counts) */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Course Practice Bundles</h3>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {/* All Courses Card */}
          <button
            onClick={() => {
              setSelectedCategoryId("");
              setSelectedSubCourseId("");
              setSelectedFilterCourseId("");
              setCurrentPage(1);
            }}
            className={`rounded-2xl border p-4 text-left transition-all cursor-pointer duration-300 flex flex-col justify-between h-28 ${getAllCoursesCardStyle(selectedFilterCourseId === "" && selectedCategoryId === "" && selectedSubCourseId === "")}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <List className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Total Practice Sets</p>
              <h4 className="text-sm font-black mt-0.5">{testSeries.length} Tests ({mcqs.length} Qs)</h4>
            </div>
          </button>

          {/* Course cards dynamically loaded */}
          {courses.map(c => {
            const count = courseCounts[c.id] || 0;
            const testCount = courseTestCounts[c.id] || 0;
            const IconComponent = getCourseIcon(c.name);
            const isActive = selectedSubCourseId === c.id.toString() || selectedFilterCourseId === c.id.toString();
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedSubCourseId(c.id.toString());
                  setSelectedFilterCourseId(c.id.toString());
                  if (c.categoryId) {
                    setSelectedCategoryId(c.categoryId.toString());
                  } else if (c.category?.id) {
                    setSelectedCategoryId(c.category.id.toString());
                  }
                  setCurrentPage(1);
                }}
                className={`rounded-2xl border p-4 text-left transition-all cursor-pointer duration-300 flex flex-col justify-between h-28 ${getCourseCardStyle(c.name, isActive)}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100/80 dark:bg-slate-800/85">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold truncate max-w-full" title={c.name}>{c.name}</p>
                  <h4 className="text-sm font-black mt-0.5">{testCount} Tests ({count} Qs)</h4>
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

      {/* Main Content Card with Tab Switcher & Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {/* Header with Main Tab Switcher & Search */}
        <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Main Tab Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMainTab("tests");
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mainTab === "tests"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Full Mock Tests ({filteredTestSeries.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMainTab("questions");
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mainTab === "questions"
                  ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>All MCQ Questions ({filteredMcqs.length})</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {mainTab === "questions" && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "table"
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
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "card"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-slate-400 hover:text-slate-650"
                    }`}
                  title="Card View"
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="relative w-full max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder={mainTab === "tests" ? "Search Mock Tests by title..." : "Search MCQs by question..."}
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

        {/* Content Area: Test Series Table vs MCQ Questions */}
        {mainTab === "tests" ? (
          // TEST SERIES TABLE VIEW
          loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-xs font-bold">Loading Test Series records...</p>
            </div>
          ) : filteredTestSeries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center text-slate-400 dark:text-slate-500">
              <HelpCircle className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Mock Tests Found</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm font-medium">
                {searchQuery ? "No mock tests match your search query." : "No mock test series uploaded for the selected course."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <th className="px-4 py-3.5">Test Series Title & Pattern</th>
                    <th className="px-4 py-3.5">Main Course & Sub Course</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Upload Date & Time</th>
                    <th className="px-4 py-3.5 text-center whitespace-nowrap">Status (Enable/Disable)</th>
                    <th className="px-4 py-3.5 text-center whitespace-nowrap">Access (Free/Paid)</th>
                    <th className="px-4 py-3.5 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  {paginatedTestSeries.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => openViewTestQuestionsModal(t)}
                      className="hover:bg-emerald-50/25 dark:hover:bg-emerald-950/15 transition cursor-pointer group"
                      title="Click row to view test questions & answers"
                    >
                      {/* Title & Details */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {t.name}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                              t.type === "Full Mock"
                                ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20"
                                : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                            }`}>
                              {t.type}
                            </span>
                          </div>
                          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 whitespace-nowrap">
                            <span>{t.qs} Questions</span>
                            <span>•</span>
                            <span>{t.marks} Marks</span>
                            <span>•</span>
                            <span>{t.duration} Mins</span>
                          </div>
                        </div>
                      </td>

                      {/* Main Course & Sub Course Badges */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          {t.course?.category?.name && (
                            <span className="text-[9px] font-black uppercase text-slate-400">
                              {t.course.category.name}
                            </span>
                          )}
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 w-fit">
                            {t.course.name}
                          </span>
                        </div>
                      </td>

                      {/* Upload Date & Time */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-bold">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{formatDateTime(t.createdAt)}</span>
                        </div>
                      </td>

                      {/* Status Toggle (Enable / Disable) */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTestActive(t.id, t.active);
                          }}
                          disabled={actionLoading === `toggle-active-${t.id}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wide transition-all cursor-pointer border shadow-2xs ${
                            t.active !== false
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700 hover:bg-slate-200"
                          }`}
                          title="Click to toggle Enable/Disable"
                        >
                          {actionLoading === `toggle-active-${t.id}` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <span className={`h-2 w-2 rounded-full ${t.active !== false ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                          )}
                          <span>{t.active !== false ? "Enabled" : "Disabled"}</span>
                        </button>
                      </td>

                      {/* Access Toggle (Free / Paid) */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTestPricing(t.id, t.isFree);
                          }}
                          disabled={actionLoading === `toggle-free-${t.id}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wide transition-all cursor-pointer border shadow-2xs ${
                            t.isFree
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                          }`}
                          title="Click to toggle Free/Paid"
                        >
                          {actionLoading === `toggle-free-${t.id}` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : t.isFree ? (
                            <>
                              <span className="text-[10px]">🟢</span>
                              <span>Free</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                              <span>Paid</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openViewTestQuestionsModal(t);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition cursor-pointer text-xs font-extrabold shadow-2xs"
                            title="View All Questions in this Test"
                          >
                            <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>View Qs</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditTestModal(t);
                            }}
                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition cursor-pointer"
                            title="Edit Mock Test"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTestSeries(t.id);
                            }}
                            disabled={actionLoading === `delete-test-${t.id}`}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer"
                            title="Delete Mock Test"
                          >
                            {actionLoading === `delete-test-${t.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
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
            </div>
          )
        ) : (
          // MCQ QUESTIONS VIEW
          loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-xs font-bold">Loading MCQ questions...</p>
            </div>
          ) : filteredMcqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center text-slate-400 dark:text-slate-500">
              <HelpCircle className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No MCQ Questions Found</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm font-medium">
                {searchQuery ? "No questions match your search query." : "No questions uploaded for this selected course."}
              </p>
            </div>
          ) : viewMode === "table" ? (
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
                        <div className="flex flex-col gap-0.5">
                          {q.course?.category?.name && (
                            <span className="text-[9px] font-extrabold uppercase text-slate-400">
                              {q.course.category.name}
                            </span>
                          )}
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 w-fit">
                            {q.course.name}
                          </span>
                        </div>
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
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              const matchedTest = testSeries.find(t => t.courseId === q.courseId) || {
                                id: 0,
                                name: q.course.name,
                                type: "Full Mock",
                                qs: courseCounts[q.courseId] || 1,
                                marks: courseCounts[q.courseId] || 1,
                                duration: 90,
                                isFree: true,
                                active: true,
                                courseId: q.courseId,
                                course: q.course,
                                createdAt: q.createdAt
                              };
                              setViewingTestQuestions(matchedTest as any);
                              startEditingMcq(q);
                              setIsViewQuestionsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition cursor-pointer"
                            title="Edit Question & Answers"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteMcq(q.id)}
                            disabled={actionLoading === `delete-${q.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer"
                            title="Delete Question"
                          >
                            {actionLoading === `delete-${q.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
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
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850">
              {paginatedMcqs.map((q) => (
                <div
                  key={q.id}
                  className="rounded-2xl border p-5.5 space-y-4 transition-all duration-300 hover:shadow-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 relative flex flex-col justify-between"
                >
                  <div className="space-y-4">
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
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Question #{q.id}</p>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        const isCorrect = q.answer === optIndex;
                        return (
                          <div
                            key={optIndex}
                            className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between ${isCorrect
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
          )
        )}

        {/* Pagination Controls */}
        {!loading && (mainTab === "tests" ? filteredTestSeries.length > 0 : filteredMcqs.length > 0) && (
          <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-850 dark:text-slate-200">
                {mainTab === "tests"
                  ? totalTestItems === 0 ? 0 : (safeTestCurrentPage - 1) * pageSize + 1
                  : totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-850 dark:text-slate-200">
                {mainTab === "tests"
                  ? Math.min(safeTestCurrentPage * pageSize, totalTestItems)
                  : Math.min(safeCurrentPage * pageSize, totalItems)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-850 dark:text-slate-200">
                {mainTab === "tests" ? totalTestItems : totalItems}
              </span>{" "}
              {mainTab === "tests" ? "test series" : "questions"}
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
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={mainTab === "tests" ? safeTestCurrentPage === 1 : safeCurrentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 px-2">
                  {mainTab === "tests" ? safeTestCurrentPage : safeCurrentPage} /{" "}
                  {mainTab === "tests" ? totalTestPages : totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, mainTab === "tests" ? totalTestPages : totalPages))}
                  disabled={mainTab === "tests" ? safeTestCurrentPage === totalTestPages : safeCurrentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Test Series Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl relative space-y-4 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsTestModalOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-black flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-600" />
              {isTestEditMode ? "Edit Mock Test Series" : "Create New Mock Test Series"}
            </h3>

            <hr className="border-slate-100 dark:border-slate-800" />

            <form onSubmit={handleSaveTestSeries} className="space-y-4 text-xs font-semibold">
              {/* Target Sub Course */}
              <div className="space-y-1.5">
                <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">
                  Target Sub Course
                </label>
                <select
                  required
                  value={testCourseId}
                  onChange={(e) => setTestCourseId(e.target.value)}
                  className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 transition text-slate-800 dark:text-slate-100 font-bold cursor-pointer"
                >
                  <option value="" disabled>Choose target sub course...</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id.toString()}>
                      {course.name} {course.category?.name ? `(${course.category.name})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Title */}
              <div className="space-y-1.5">
                <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">
                  Mock Test Title (e.g. Mock Test - 1, Mock Test - 2, Testing)
                </label>
                <input
                  required
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Mock Test - 1 or Full Length Mock Test 2"
                  className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 transition text-slate-900 dark:text-white font-bold"
                />
              </div>

              {/* Row: Type and Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Test Type</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 transition text-slate-800 dark:text-slate-100 font-bold cursor-pointer"
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
                    value={testIsFree ? "free" : "paid"}
                    onChange={(e) => setTestIsFree(e.target.value === "free")}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 transition text-slate-800 dark:text-slate-100 font-bold cursor-pointer"
                  >
                    <option value="free">Free Access</option>
                    <option value="paid">Paid (Locked)</option>
                  </select>
                </div>
              </div>

              {/* Row: Qs, Marks, Duration */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Questions Count</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={testQs}
                    onChange={(e) => setTestQs(parseInt(e.target.value, 10) || 0)}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 transition text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Total Marks</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={testMarks}
                    onChange={(e) => setTestMarks(parseInt(e.target.value, 10) || 0)}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 transition text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Duration (Mins)</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={testDuration}
                    onChange={(e) => setTestDuration(parseInt(e.target.value, 10) || 0)}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 transition text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="space-y-1.5">
                <label className="block text-slate-500 uppercase tracking-wider text-[10px] font-black">Status</label>
                <select
                  value={testActive ? "enabled" : "disabled"}
                  onChange={(e) => setTestActive(e.target.value === "enabled")}
                  className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-emerald-500 transition text-slate-800 dark:text-slate-100 font-bold cursor-pointer"
                >
                  <option value="enabled">Enabled (Visible to Students)</option>
                  <option value="disabled">Disabled (Hidden)</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-5 py-2.5 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "create-test" || actionLoading === "edit-test"}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 font-bold transition shadow-md shadow-emerald-600/10 cursor-pointer"
                >
                  {actionLoading === "create-test" || actionLoading === "edit-test" ? "Saving..." : isTestEditMode ? "Update Mock Test" : "Create Mock Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* View Test Questions Modal */}
      {isViewQuestionsModalOpen && viewingTestQuestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl relative space-y-5 text-slate-900 dark:text-white max-h-[90vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      {viewingTestQuestions.type}
                    </span>
                    {viewingTestQuestions.course?.category?.name && (
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">
                        {viewingTestQuestions.course.category.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    {viewingTestQuestions.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                    Course: <span className="text-slate-800 dark:text-slate-200">{viewingTestQuestions.course.name}</span> • {viewingTestQuestions.qs} Questions • {viewingTestQuestions.marks} Marks • {viewingTestQuestions.duration} Mins
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsViewQuestionsModalOpen(false);
                    setViewingTestQuestions(null);
                  }}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search Bar inside Modal */}
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter questions in this test by text..."
                  value={viewQuestionsSearch}
                  onChange={(e) => setViewQuestionsSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-2 pl-10 pr-4 text-xs font-semibold focus:border-emerald-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Questions Body List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 my-2 min-h-[300px] max-h-[55vh]">
              {(() => {
                // Include questions explicitly linked to this test series ID,
                // or questions belonging to this course (unassigned or general)
                const explicitTestQs = mcqs.filter(
                  (q) => q.testSeriesId === viewingTestQuestions.id
                );
                
                const testCourseQuestions = explicitTestQs.length > 0
                  ? explicitTestQs
                  : mcqs.filter(
                      (q) => q.courseId === viewingTestQuestions.courseId
                    );

                const filteredTestQs = testCourseQuestions.filter((q) =>
                  q.question.toLowerCase().includes(viewQuestionsSearch.toLowerCase()) ||
                  q.options.some((opt) => opt.toLowerCase().includes(viewQuestionsSearch.toLowerCase()))
                );

                if (testCourseQuestions.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                      <HelpCircle className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Questions Found</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">
                        No questions have been uploaded for test series <b>"{viewingTestQuestions.name}"</b> yet.
                      </p>
                    </div>
                  );
                }

                if (filteredTestQs.length === 0) {
                  return (
                    <div className="text-center py-12 text-xs font-bold text-slate-400">
                      No questions match filter "{viewQuestionsSearch}".
                    </div>
                  );
                }

                return filteredTestQs.map((q, idx) => {
                  const isEditingThis = editingMcqId === q.id;

                  if (isEditingThis) {
                    return (
                      <div
                        key={q.id}
                        className="rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-lg animate-in fade-in duration-200"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                          <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Editing Question #{idx + 1} (ID: #{q.id})
                          </span>
                          <button
                            onClick={cancelEditingMcq}
                            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <X className="h-4 w-4" /> Cancel
                          </button>
                        </div>

                        {/* Question Textarea */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                            Question Text
                          </label>
                          <textarea
                            value={editQText}
                            onChange={(e) => setEditQText(e.target.value)}
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs font-bold text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                          />
                        </div>

                        {/* 4 Options Grid with Correct Option Selector */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                            Options & Select Correct Answer
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { label: "Option A (1)", val: editQOpt1, setVal: setEditQOpt1, idx: 0 },
                              { label: "Option B (2)", val: editQOpt2, setVal: setEditQOpt2, idx: 1 },
                              { label: "Option C (3)", val: editQOpt3, setVal: setEditQOpt3, idx: 2 },
                              { label: "Option D (4)", val: editQOpt4, setVal: setEditQOpt4, idx: 3 },
                            ].map((optItem) => (
                              <div
                                key={optItem.idx}
                                className={`rounded-xl border p-2.5 space-y-1.5 transition ${
                                  editQAnswer === optItem.idx
                                    ? "border-emerald-500/60 bg-emerald-500/10"
                                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-slate-500">
                                    {optItem.label}
                                  </span>
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`correct_opt_${q.id}`}
                                      checked={editQAnswer === optItem.idx}
                                      onChange={() => setEditQAnswer(optItem.idx)}
                                      className="accent-emerald-600 cursor-pointer"
                                    />
                                    <span className={`text-[10px] font-black ${editQAnswer === optItem.idx ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                                      {editQAnswer === optItem.idx ? "✓ Correct Answer" : "Set Correct"}
                                    </span>
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  value={optItem.val}
                                  onChange={(e) => optItem.setVal(e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-emerald-500 outline-none"
                                  placeholder={`Enter ${optItem.label}...`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Explanation / Hint */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                            Explanation / Hint (Optional)
                          </label>
                          <input
                            type="text"
                            value={editQHint}
                            onChange={(e) => setEditQHint(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:border-emerald-500 outline-none"
                            placeholder="e.g. Explanation for why this option is correct..."
                          />
                        </div>

                        {/* Action Save / Cancel */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={cancelEditingMcq}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateMcq(q.id)}
                            disabled={actionLoading === `update-mcq-${q.id}`}
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
                          >
                            {actionLoading === `update-mcq-${q.id}` ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Saving Changes...
                              </>
                            ) : (
                              <>
                                <Save className="h-3.5 w-3.5" />
                                Save Question & Answer
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={q.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 space-y-3 transition hover:border-emerald-500/30"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Question #{idx + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditingMcq(q)}
                            className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition cursor-pointer flex items-center gap-1 text-[11px] font-black shadow-2xs"
                            title="Edit Question & Answers"
                          >
                            <Pencil className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Edit Question</span>
                          </button>

                          <button
                            onClick={() => handleDeleteMcq(q.id)}
                            disabled={actionLoading === `delete-${q.id}`}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer"
                            title="Delete Question"
                          >
                            {actionLoading === `delete-${q.id}` ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </h4>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIndex) => {
                          const isCorrect = q.answer === optIndex;
                          return (
                            <div
                              key={optIndex}
                              className={`rounded-xl border px-3 py-2 text-xs font-semibold flex items-center justify-between ${
                                isCorrect
                                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shadow-xs"
                                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <span className="truncate max-w-[80%]">
                                <b className="mr-1 text-slate-400">{String.fromCharCode(65 + optIndex)}.</b> {opt}
                              </span>
                              {isCorrect && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-wider shadow-2xs">
                                  <CheckCircle className="h-3 w-3" /> Correct
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Hint / Explanation */}
                      {q.hint && (
                        <div className="rounded-xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                          <HelpCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                          <div>
                            <span className="font-extrabold uppercase text-[10px]">Explanation / Hint:</span>
                            <p className="mt-0.5 text-xs font-medium leading-relaxed">{q.hint}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-bold text-slate-500">
              <span>
                Total {
                  (() => {
                    const explicitCount = mcqs.filter((q) => q.testSeriesId === viewingTestQuestions.id).length;
                    if (explicitCount > 0) return explicitCount;
                    return mcqs.filter((q) => q.courseId === viewingTestQuestions.courseId).length;
                  })()
                } questions loaded
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsViewQuestionsModalOpen(false);
                    setSelectedSubCourseId(viewingTestQuestions.courseId.toString());
                    setSelectedFilterCourseId(viewingTestQuestions.courseId.toString());
                    setMainTab("questions");
                  }}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition cursor-pointer"
                >
                  View in MCQ List Tab →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewQuestionsModalOpen(false);
                    setViewingTestQuestions(null);
                  }}
                  className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

