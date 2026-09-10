"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Trash2, 
  Loader2, 
  HelpCircle, 
  FileText,
  Clock,
  Check,
  AlertTriangle,
  FileCheck,
  Lock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";

interface CourseRecord {
  id: number;
  name: string;
  active: boolean;
  premium?: boolean;
  price?: number;
  category?: {
    name: string;
  };
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
}

interface MCQRecord {
  id: number;
  courseId: number;
}

interface ParsedQuestionRow {
  rowIndex: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answerRaw: string;
  answerIndex: number; // 0-indexed
  hint: string;
  isValid: boolean;
  errorMsg?: string;
}

export default function ImportMCQPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data states
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [testSeriesList, setTestSeriesList] = useState<TestSeriesRecord[]>([]);
  const [mcqCountMap, setMcqCountMap] = useState<Record<string, number>>({});
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  // Test Access Pricing state (Paid vs Free)
  const [testAccessType, setTestAccessType] = useState<"paid" | "free">("paid");

  // Associated Test Series Pagination & Search states
  const [testSeriesPage, setTestSeriesPage] = useState<number>(1);
  const [testSeriesRowsPerPage, setTestSeriesRowsPerPage] = useState<number>(5);
  const [testSeriesSearch, setTestSeriesSearch] = useState<string>("");

  // UI / Loading states
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Parsed File states
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedQuestionRow[]>([]);
  const [previewFilter, setPreviewFilter] = useState<"all" | "valid" | "invalid">("all");

  // Fetch courses, test series, and existing MCQs
  const fetchData = async () => {
    setLoadingInitial(true);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const headers = { Authorization: `Bearer ${storedToken}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

      const [coursesRes, testSeriesRes, mcqsRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/courses`, { headers }),
        fetch(`${apiUrl}/api/admin/test-series`, { headers }),
        fetch(`${apiUrl}/api/admin/mcqs?countOnly=true`, { headers })
      ]);

      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data.courses || []);
        if (data.courses && data.courses.length > 0 && !selectedCourseId) {
          const firstCourse = data.courses[0];
          setSelectedCourseId(firstCourse.id.toString());
          setTestAccessType(firstCourse.premium ? "paid" : "free");
        }
      }

      if (testSeriesRes.ok) {
        const data = await testSeriesRes.json();
        setTestSeriesList(data.testSeries || []);
      }

      if (mcqsRes.ok) {
        const data = await mcqsRes.json();
        setMcqCountMap(data.countMap || {});
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update testAccessType & reset pagination when selectedCourseId changes
  useEffect(() => {
    if (selectedCourseId && courses.length > 0) {
      const c = courses.find((course) => course.id.toString() === selectedCourseId);
      if (c) {
        setTestAccessType(c.premium ? "paid" : "free");
      }
    }
    setTestSeriesPage(1);
    setTestSeriesSearch("");
  }, [selectedCourseId, courses]);

  // Filtered Test Series for Selected Course
  const selectedCourse = courses.find((c) => c.id.toString() === selectedCourseId);
  const courseTestSeries = testSeriesList.filter((t) => t.courseId.toString() === selectedCourseId);
  const existingQuestionCount = mcqCountMap[selectedCourseId] || 0;

  // Filtered & Paginated Test Series for Associated Table
  const filteredCourseTestSeries = courseTestSeries.filter((t) =>
    t.name.toLowerCase().includes(testSeriesSearch.toLowerCase()) ||
    t.type.toLowerCase().includes(testSeriesSearch.toLowerCase())
  );

  const totalTsPages = Math.ceil(filteredCourseTestSeries.length / testSeriesRowsPerPage) || 1;
  const currentTsPage = Math.min(testSeriesPage, totalTsPages);

  const paginatedCourseTestSeries = filteredCourseTestSeries.slice(
    (currentTsPage - 1) * testSeriesRowsPerPage,
    currentTsPage * testSeriesRowsPerPage
  );

  // Updating single test series access state (Paid vs Free)
  const [updatingTestId, setUpdatingTestId] = useState<number | null>(null);

  const handleToggleTestAccess = async (testId: number, isFree: boolean) => {
    setUpdatingTestId(testId);

    // Optimistic UI state update
    setTestSeriesList((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, isFree } : t))
    );

    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/admin/test-series/${testId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify({ isFree })
      });

      if (!res.ok) {
        throw new Error("Failed to update test series access.");
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Test set to ${isFree ? "Free Access" : "Paid (Premium)"}`,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true
      });
    } catch (err: any) {
      console.error("Single test access update error:", err);
      // Revert state on error
      setTestSeriesList((prev) =>
        prev.map((t) => (t.id === testId ? { ...t, isFree: !isFree } : t))
      );
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.message || "Failed to update test access state.",
        confirmButtonColor: "#10b981"
      });
    } finally {
      setUpdatingTestId(null);
    }
  };

  // Bulk update all test series access state for current course
  const handleSetAllTestsAccess = async (isFree: boolean) => {
    if (!selectedCourseId || courseTestSeries.length === 0) return;

    const accessLabel = isFree ? "Free Access" : "Paid (Premium)";
    const confirmRes = await Swal.fire({
      title: `Set All ${courseTestSeries.length} Tests to ${accessLabel}?`,
      html: `All associated mock tests for <b>${selectedCourse?.name}</b> will be updated to <b>${accessLabel}</b> in the database.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, Set All to ${accessLabel}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981"
    });

    if (!confirmRes.isConfirmed) return;

    // Optimistically update all test series in UI
    setTestSeriesList((prev) =>
      prev.map((t) => (t.courseId.toString() === selectedCourseId ? { ...t, isFree } : t))
    );

    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

      // Send PUT requests for all test series
      const updates = courseTestSeries.map((t) =>
        fetch(`${apiUrl}/api/admin/test-series/${t.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`
          },
          body: JSON.stringify({ isFree })
        })
      );

      await Promise.all(updates);

      // Also update Course premium status
      await fetch(`${apiUrl}/api/admin/courses/${selectedCourseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify({ premium: !isFree })
      });

      setTestAccessType(isFree ? "free" : "paid");

      Swal.fire({
        icon: "success",
        title: "All Tests Updated!",
        text: `Successfully updated all ${courseTestSeries.length} tests to ${accessLabel}.`,
        confirmButtonColor: "#10b981"
      });
    } catch (err: any) {
      console.error("Bulk access update error:", err);
      fetchData(); // Reload data on error
    }
  };

  // Download Sample Excel Template
  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        "Question": "What does HTML stand for?",
        "Option A": "Hyper Text Markup Language",
        "Option B": "High Tech Modern Language",
        "Option C": "Hyper Transfer Method Language",
        "Option D": "Home Tool Markup Language",
        "Correct Answer": "1",
        "Hint": "It is the standard markup language for documents designed to be displayed in a web browser."
      },
      {
        "Question": "Which SQL command is used to retrieve data from a database table?",
        "Option A": "UPDATE",
        "Option B": "INSERT",
        "Option C": "SELECT",
        "Option D": "DELETE",
        "Correct Answer": "C",
        "Hint": "It forms the core of database queries."
      },
      {
        "Question": "What is the capital of France?",
        "Option A": "Berlin",
        "Option B": "Madrid",
        "Option C": "Paris",
        "Option D": "Rome",
        "Correct Answer": "Paris",
        "Hint": "Known as the City of Light."
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    
    // Set column widths for nice viewing
    worksheet["!cols"] = [
      { wch: 45 }, // Question
      { wch: 30 }, // Option A
      { wch: 30 }, // Option B
      { wch: 30 }, // Option C
      { wch: 30 }, // Option D
      { wch: 18 }, // Correct Answer
      { wch: 50 }  // Hint
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MCQ_Full_Mock_Test");
    
    const courseName = selectedCourse ? selectedCourse.name.replace(/[^a-zA-Z0-9]/g, "_") : "Course";
    XLSX.writeFile(workbook, `MCQ_Import_Template_${courseName}.xlsx`);
  };

  // Helper to parse Correct Answer from row
  const parseCorrectAnswerIndex = (
    rawAns: any, 
    opt1: string, 
    opt2: string, 
    opt3: string, 
    opt4: string
  ): number => {
    if (rawAns === undefined || rawAns === null) return -1;
    const strAns = String(rawAns).trim();
    if (!strAns) return -1;

    // Check numbers: "1", "2", "3", "4" -> 0, 1, 2, 3
    if (/^[1-4]$/.test(strAns)) {
      return parseInt(strAns, 10) - 1;
    }
    // Check 0-indexed numbers: "0", "1", "2", "3" if specified directly
    if (/^[0-3]$/.test(strAns) && !/^[1-4]$/.test(strAns)) {
      return parseInt(strAns, 10);
    }

    // Check Letters: "A", "B", "C", "D" or "a", "b", "c", "d"
    const upper = strAns.toUpperCase();
    if (upper === "A" || upper === "OPTION A" || upper === "OPTION 1") return 0;
    if (upper === "B" || upper === "OPTION B" || upper === "OPTION 2") return 1;
    if (upper === "C" || upper === "OPTION C" || upper === "OPTION 3") return 2;
    if (upper === "D" || upper === "OPTION D" || upper === "OPTION 4") return 3;

    // Check exact text match with options
    const options = [opt1, opt2, opt3, opt4];
    const matchIdx = options.findIndex((opt) => opt.toLowerCase() === strAns.toLowerCase());
    if (matchIdx !== -1) return matchIdx;

    return -1;
  };

  // Process and Parse File Content
  const processFile = (file: File) => {
    if (!file) return;

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExt || "")) {
      Swal.fire({
        icon: "error",
        title: "Unsupported File Format",
        text: "Please upload a valid Excel (.xlsx, .xls) or CSV file.",
        confirmButtonColor: "#10b981"
      });
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (rawJson.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "Empty Spreadsheet",
            text: "The uploaded file does not contain any data rows.",
            confirmButtonColor: "#10b981"
          });
          setParsedRows([]);
          return;
        }

        // Map and validate each row
        const rows: ParsedQuestionRow[] = rawJson.map((row, idx) => {
          // Normalize header key search
          const getKey = (possibleKeys: string[]): string => {
            const keys = Object.keys(row);
            for (const pk of possibleKeys) {
              const foundKey = keys.find(k => k.trim().toLowerCase() === pk.toLowerCase());
              if (foundKey) return String(row[foundKey] || "").trim();
            }
            return "";
          };

          const questionText = getKey(["question", "question text", "qs", "q"]);
          const option1 = getKey(["option a", "option1", "option 1", "a", "opt1"]);
          const option2 = getKey(["option b", "option2", "option 2", "b", "opt2"]);
          const option3 = getKey(["option c", "option3", "option 3", "c", "opt3"]);
          const option4 = getKey(["option d", "option4", "option 4", "d", "opt4"]);
          const rawAnswer = getKey(["correct answer", "answer", "correct_option", "correct", "ans"]);
          const hint = getKey(["hint", "explanation", "solution"]);

          const answerIndex = parseCorrectAnswerIndex(rawAnswer, option1, option2, option3, option4);

          let errorMsg = "";
          if (!questionText) {
            errorMsg = "Question text is missing.";
          } else if (!option1 || !option2) {
            errorMsg = "At least Option A and Option B are required.";
          } else if (answerIndex < 0 || answerIndex > 3) {
            errorMsg = `Invalid Correct Answer "${rawAnswer}". Must be 1-4, A-D, or match option text.`;
          }

          return {
            rowIndex: idx + 2, // 1-indexed plus header row
            question: questionText,
            option1,
            option2,
            option3,
            option4,
            answerRaw: rawAnswer,
            answerIndex,
            hint,
            isValid: !errorMsg,
            errorMsg
          };
        });

        setParsedRows(rows);
      } catch (err: any) {
        console.error("Error reading file:", err);
        Swal.fire({
          icon: "error",
          title: "File Parse Error",
          text: err.message || "Failed to read the Excel file. Please ensure it is a valid format.",
          confirmButtonColor: "#10b981"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    setFileName(null);
    setParsedRows([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Parsed Questions to DB
  const handleBulkInsert = async () => {
    if (!selectedCourseId) {
      Swal.fire({
        icon: "warning",
        title: "No Course Selected",
        text: "Please select a Course before importing questions.",
        confirmButtonColor: "#10b981"
      });
      return;
    }

    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Valid Questions",
        text: "There are no valid question rows to upload. Please fix errors in your file.",
        confirmButtonColor: "#10b981"
      });
      return;
    }

    const confirmRes = await Swal.fire({
      title: `Insert ${validRows.length} Questions?`,
      html: `You are about to insert <b>${validRows.length} MCQ Questions</b> into course <b>${selectedCourse?.name || "Selected Course"}</b>.<br/><span class="text-xs text-slate-600 dark:text-slate-400 mt-2 block font-semibold">Test Access Pricing: <b class="${testAccessType === "paid" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}">${testAccessType === "paid" ? "💳 Paid (Premium Test)" : "🎁 Free Access"}</b></span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Insert Now",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981"
    });

    if (!confirmRes.isConfirmed) return;

    setIsUploading(true);

    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) {
        throw new Error("Admin authorization token not found. Please log in again.");
      }

      const questionsPayload = validRows.map((r) => {
        const opts = [r.option1, r.option2];
        if (r.option3) opts.push(r.option3);
        if (r.option4) opts.push(r.option4);

        return {
          question: r.question,
          options: opts,
          answer: r.answerIndex,
          hint: r.hint || ""
        };
      });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/admin/mcqs/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify({
          courseId: selectedCourseId,
          questions: questionsPayload,
          isPaid: testAccessType === "paid"
        })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Import Successful!",
          text: data.message || `Successfully added ${data.count || validRows.length} questions to ${selectedCourse?.name}!`,
          confirmButtonColor: "#10b981"
        });

        // Reset file upload & refresh question count
        handleClearFile();
        fetchData();
      } else {
        throw new Error(data.message || "Failed to insert questions into database.");
      }
    } catch (err: any) {
      console.error("Bulk upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "An error occurred while uploading questions.",
        confirmButtonColor: "#10b981"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Filter parsed rows for preview table
  const filteredPreviewRows = parsedRows.filter((r) => {
    if (previewFilter === "valid") return r.isValid;
    if (previewFilter === "invalid") return !r.isValid;
    return true;
  });

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/admin/education/mcqs" className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to MCQs
            </Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-200">Import MCQ Questions</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            Import Question MCQ (Full Mock Test)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload Excel (.xlsx, .xls) or CSV spreadsheet to insert questions in bulk for Full Mock Test courses.
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 active:scale-[0.98] transition-all px-4 py-2.5 text-xs font-bold shadow-xs cursor-pointer"
        >
          <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Download Sample Template (.xlsx)
        </button>
      </div>

      {/* Grid Layout: Left Controls, Right File Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step 1: Course & Mock Test Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs">
                1
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Select Course & Mock Test
              </h3>
            </div>

            {loadingInitial ? (
              <div className="flex items-center justify-center py-6 gap-2 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                Loading courses...
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:outline-none transition"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id.toString()}>
                        {c.name} {c.category ? `(${c.category.name})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Paid vs Free Mock Test Option Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mock Test Pricing / Access Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Paid Option */}
                    <button
                      type="button"
                      onClick={() => setTestAccessType("paid")}
                      className={`flex flex-col p-3 rounded-xl border transition-all text-left cursor-pointer ${
                        testAccessType === "paid"
                          ? "border-amber-500/60 bg-amber-500/10 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-300">
                          <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                          Paid (Premium)
                        </span>
                        {testAccessType === "paid" && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                        Requires student purchase / premium subscription
                      </p>
                    </button>

                    {/* Free Option */}
                    <button
                      type="button"
                      onClick={() => setTestAccessType("free")}
                      className={`flex flex-col p-3 rounded-xl border transition-all text-left cursor-pointer ${
                        testAccessType === "free"
                          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-300">
                          <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          Free Access
                        </span>
                        {testAccessType === "free" && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                        Free for all registered students without payment
                      </p>
                    </button>
                  </div>
                </div>

                {/* Selected Course Summary Card */}
                {selectedCourse && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Course Summary
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          testAccessType === "paid" 
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" 
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                        }`}>
                          {testAccessType === "paid" ? <Lock className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                          {testAccessType === "paid" ? "Paid (Premium)" : "Free Access"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <Check className="h-3 w-3" /> Active
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {selectedCourse.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-white dark:bg-slate-950 p-2.5 border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 font-bold">Existing MCQs</p>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">
                          {existingQuestionCount} Questions
                        </p>
                      </div>
                      <div className="rounded-lg bg-white dark:bg-slate-950 p-2.5 border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 font-bold">Test Series</p>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">
                          {courseTestSeries.length} Full Mock Test(s)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* End Step 1 Course Controls */}
              </div>
            )}
          </div>

          {/* Quick Guide Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-emerald-600" /> Excel Format Instructions
            </h4>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 pl-4 list-disc">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Question:</strong> Full text of the MCQ question.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Option A to Option D:</strong> Options 1, 2, 3, 4. (Options A & B required).
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Correct Answer:</strong> Enter <span className="px-1 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-mono text-[10px]">1, 2, 3, 4</span> or <span className="px-1 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-mono text-[10px]">A, B, C, D</span>.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Hint:</strong> Optional explanation or reference for students.
              </li>
            </ul>
          </div>
        </div>

        {/* Step 2 & 3: File Upload & Live Preview Table */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* File Upload Box */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs">
                  2
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Upload Excel (.xlsx / .csv) File
                </h3>
              </div>

              {fileName && (
                <button
                  onClick={handleClearFile}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear File
                </button>
              )}
            </div>

            {/* Dropzone Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition cursor-pointer ${
                dragActive
                  ? "border-emerald-500 bg-emerald-500/10"
                  : fileName
                  ? "border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10"
                  : "border-slate-300 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-950/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 shadow-xs">
                {fileName ? <FileCheck className="h-7 w-7" /> : <UploadCloud className="h-7 w-7" />}
              </div>

              {fileName ? (
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Selected File</p>
                  <h4 className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {fileName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Click or drag another file to replace
                  </p>
                </div>
              ) : (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Click to select file or drag & drop here
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv) format
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Parsed Preview Section */}
          {parsedRows.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4 animate-in fade-in duration-300">
              
              {/* Header and Summary Counters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs">
                      3
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Live Parsed Questions Preview ({parsedRows.length})
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review and verify questions before finalizing upload into database.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleBulkInsert}
                  disabled={isUploading || validCount === 0}
                  className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-black text-white shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
                    isUploading || validCount === 0
                      ? "bg-slate-400 dark:bg-slate-800 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading Questions...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Upload {validCount} Question(s) to DB
                    </>
                  )}
                </button>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                  <button
                    onClick={() => setPreviewFilter("all")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      previewFilter === "all"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    All ({parsedRows.length})
                  </button>
                  <button
                    onClick={() => setPreviewFilter("valid")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      previewFilter === "valid"
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Valid ({validCount})
                  </button>
                  <button
                    onClick={() => setPreviewFilter("invalid")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      previewFilter === "invalid"
                        ? "bg-red-500 text-white shadow-xs"
                        : "text-red-600 dark:text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" /> Invalid ({invalidCount})
                  </button>
                </div>

                {invalidCount > 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {invalidCount} row(s) contain validation errors and will be skipped during insert.
                  </p>
                )}
              </div>

              {/* Table List */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-[500px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 z-10">
                    <tr>
                      <th className="p-3 w-12 text-center">Row</th>
                      <th className="p-3 w-20">Status</th>
                      <th className="p-3 min-w-[220px]">Question</th>
                      <th className="p-3 min-w-[200px]">Options (A - D)</th>
                      <th className="p-3 w-32">Correct Answer</th>
                      <th className="p-3 min-w-[150px]">Hint / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                    {filteredPreviewRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                          No matching questions found for current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredPreviewRows.map((row) => (
                        <tr key={row.rowIndex} className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition ${!row.isValid ? "bg-red-500/5" : ""}`}>
                          <td className="p-3 text-center font-mono font-bold text-slate-400">
                            #{row.rowIndex}
                          </td>
                          <td className="p-3">
                            {row.isValid ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="h-3 w-3" /> Valid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400 border border-red-500/20" title={row.errorMsg}>
                                <AlertCircle className="h-3 w-3" /> Invalid
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                            <p className="line-clamp-2">{row.question || <span className="italic text-red-400">(Empty Question)</span>}</p>
                            {!row.isValid && row.errorMsg && (
                              <p className="text-[10px] text-red-500 font-bold mt-1">
                                ⚠️ {row.errorMsg}
                              </p>
                            )}
                          </td>
                          <td className="p-3 space-y-1">
                            <div className={`text-[11px] px-2 py-0.5 rounded ${row.answerIndex === 0 ? "bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" : "text-slate-600 dark:text-slate-400"}`}>
                              A: {row.option1 || "-"}
                            </div>
                            <div className={`text-[11px] px-2 py-0.5 rounded ${row.answerIndex === 1 ? "bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" : "text-slate-600 dark:text-slate-400"}`}>
                              B: {row.option2 || "-"}
                            </div>
                            {row.option3 && (
                              <div className={`text-[11px] px-2 py-0.5 rounded ${row.answerIndex === 2 ? "bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" : "text-slate-600 dark:text-slate-400"}`}>
                                C: {row.option3}
                              </div>
                            )}
                            {row.option4 && (
                              <div className={`text-[11px] px-2 py-0.5 rounded ${row.answerIndex === 3 ? "bg-emerald-500/15 font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" : "text-slate-600 dark:text-slate-400"}`}>
                                D: {row.option4}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {row.answerIndex >= 0 ? (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                Option {String.fromCharCode(65 + row.answerIndex)} ({row.answerIndex + 1})
                              </span>
                            ) : (
                              <span className="text-red-500 font-bold">{row.answerRaw || "Missing"}</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">
                            {row.hint ? <span className="line-clamp-2">{row.hint}</span> : <span className="text-slate-400 italic">None</span>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Full Width Associated Mock Tests Data Table */}
      {courseTestSeries.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4 animate-in fade-in duration-300">
          
          {/* Table Header with Search & Batch Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Associated Mock Tests ({filteredCourseTestSeries.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full mock tests, subject drills, and practice series linked with <strong className="text-slate-800 dark:text-slate-200">{selectedCourse?.name}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Batch Action Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1.5 uppercase">Batch Access:</span>
                <button
                  type="button"
                  onClick={() => handleSetAllTestsAccess(false)}
                  className="px-2.5 py-1 text-[10px] font-black rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 active:scale-95 transition cursor-pointer flex items-center gap-1"
                >
                  <Lock className="h-3 w-3" /> Make All Paid
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAllTestsAccess(true)}
                  className="px-2.5 py-1 text-[10px] font-black rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Make All Free
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={testSeriesSearch}
                  onChange={(e) => {
                    setTestSeriesSearch(e.target.value);
                    setTestSeriesPage(1);
                  }}
                  placeholder="Filter tests..."
                  className="w-full sm:w-56 pl-9 pr-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none transition shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Full Width Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Test Series Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Questions</th>
                    <th className="py-3 px-4 text-center">Duration</th>
                    <th className="py-3 px-4 text-center">Total Marks</th>
                    <th className="py-3 px-4 text-right">Access State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {paginatedCourseTestSeries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400 font-semibold text-xs">
                        No mock tests found matching search filter "{testSeriesSearch}".
                      </td>
                    </tr>
                  ) : (
                    paginatedCourseTestSeries.map((t, idx) => {
                      const globalIndex = (currentTsPage - 1) * testSeriesRowsPerPage + idx + 1;
                      const isFreeAccess = t.isFree;

                      return (
                        <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition">
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                            #{globalIndex}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                            {t.name}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                              t.type.toLowerCase().includes("full") 
                                ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                                : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-black text-slate-700 dark:text-slate-300">
                            {t.qs} Qs
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-emerald-600" /> {t.duration} min
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                            {t.marks} Marks
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end">
                              <select
                                value={isFreeAccess ? "free" : "paid"}
                                onChange={(e) => handleToggleTestAccess(t.id, e.target.value === "free")}
                                disabled={updatingTestId === t.id}
                                className={`px-3 py-1 text-[11px] font-extrabold rounded-full border outline-none transition cursor-pointer shadow-2xs ${
                                  isFreeAccess
                                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25"
                                    : "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40 hover:bg-amber-500/25"
                                } ${updatingTestId === t.id ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                <option value="paid" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold">
                                  🔒 Paid (Premium)
                                </option>
                                <option value="free" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold">
                                  🎁 Free Access
                                </option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
              <div>
                Showing <span className="font-extrabold text-slate-900 dark:text-slate-100">{Math.min((currentTsPage - 1) * testSeriesRowsPerPage + 1, filteredCourseTestSeries.length)}</span> to <span className="font-extrabold text-slate-900 dark:text-slate-100">{Math.min(currentTsPage * testSeriesRowsPerPage, filteredCourseTestSeries.length)}</span> of <span className="font-extrabold text-slate-900 dark:text-slate-100">{filteredCourseTestSeries.length}</span> tests (Page {currentTsPage} of {totalTsPages})
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">Show</span>
                  <select
                    value={testSeriesRowsPerPage}
                    onChange={(e) => {
                      setTestSeriesRowsPerPage(Number(e.target.value));
                      setTestSeriesPage(1);
                    }}
                    className="px-2 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value={5}>5 tests</option>
                    <option value={10}>10 tests</option>
                    <option value={20}>20 tests</option>
                    <option value={50}>50 tests</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTestSeriesPage((p) => Math.max(1, p - 1))}
                    disabled={currentTsPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestSeriesPage((p) => Math.min(totalTsPages, p + 1))}
                    disabled={currentTsPage >= totalTsPages}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
