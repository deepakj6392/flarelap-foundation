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

interface CategoryRecord {
  id: number;
  name: string;
}

interface CourseRecord {
  id: number;
  name: string;
  active: boolean;
  premium?: boolean;
  price?: number;
  categoryId?: number | null;
  category?: {
    id?: number;
    name: string;
  } | null;
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
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [testSeriesList, setTestSeriesList] = useState<TestSeriesRecord[]>([]);
  const [mcqCountMap, setMcqCountMap] = useState<Record<string, number>>({});

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [testSeriesName, setTestSeriesName] = useState<string>("");

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

  // Fetch categories, courses, test series, and existing MCQs
  const fetchData = async () => {
    setLoadingInitial(true);
    try {
      const storedToken = localStorage.getItem("admin_token");
      if (!storedToken) return;

      const headers = { Authorization: `Bearer ${storedToken}` };
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

      const [categoriesRes, coursesRes, testSeriesRes, mcqsRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/categories`, { headers }),
        fetch(`${apiUrl}/api/admin/courses`, { headers }),
        fetch(`${apiUrl}/api/admin/test-series`, { headers }),
        fetch(`${apiUrl}/api/admin/mcqs?countOnly=true`, { headers })
      ]);

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      }

      if (coursesRes.ok) {
        const data = await coursesRes.json();
        const loadedCourses: CourseRecord[] = data.courses || [];
        setCourses(loadedCourses);
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

  // Filtered Sub Courses based on Selected Main Course (Category)
  const filteredSubCourses = selectedCategoryId
    ? courses.filter((c) => {
      const catId = c.categoryId?.toString() || c.category?.id?.toString();
      return catId === selectedCategoryId;
    })
    : courses;

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
  // Download Sample Excel Template
  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        "Question Number": 1,
        "Question": "Who served as the Chief Guest at India's 77th Republic Day parade on January 26, 2026?",
        "Option A": "Olaf Scholz",
        "Option B": "Ursula von der Leyen",
        "Option C": "Giorgia Meloni",
        "Option D": "Emmanuel Macron",
        "Correct Answer": "B",
        "Hint": "French President Emmanuel Macron was the Chief Guest."
      },
      {
        "Question Number": 2,
        "Question": "Which state government launched the 'Mukhya Mantri Mahila Samriddhi Yojana' in January 2026?",
        "Option A": "Rajasthan",
        "Option B": "Uttar Pradesh",
        "Option C": "Maharashtra",
        "Option D": "Madhya Pradesh",
        "Correct Answer": "C",
        "Hint": "Launched to provide financial assistance to women entrepreneurs."
      },
      {
        "Question Number": 3,
        "Question": "What is the total financial outlay approved by Union Cabinet for Semicon India 2.0?",
        "Option A": "₹1,27,500 crore",
        "Option B": "₹1,50,000 crore",
        "Option C": "₹1,00,000 crore",
        "Option D": "₹76,000 crore",
        "Correct Answer": "A",
        "Hint": "Semicon India 2.0 program outlay."
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);

    // Set column widths for nice viewing
    worksheet["!cols"] = [
      { wch: 16 }, // Question Number
      { wch: 45 }, // Question
      { wch: 25 }, // Option A
      { wch: 25 }, // Option B
      { wch: 25 }, // Option C
      { wch: 25 }, // Option D
      { wch: 18 }, // Correct Answer
      { wch: 45 }  // Hint
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MCQ_Questions_Template");

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
    const origStr = String(rawAns).trim();
    if (!origStr) return -1;

    // Clean symbols like "(C)", "C.", "3.", "(3)", "C)", "3)", "Option C"
    const cleaned = origStr.replace(/^[\s\(\[\{]+|[\s\)\.\}\]]+$/g, "").trim().toUpperCase();

    // Direct Letter Matching
    if (["A", "OPTION A", "OPT A", "CHOICE A", "OPTION 1", "OPT 1", "CHOICE 1"].includes(cleaned)) return 0;
    if (["B", "OPTION B", "OPT B", "CHOICE B", "OPTION 2", "OPT 2", "CHOICE 2"].includes(cleaned)) return 1;
    if (["C", "OPTION C", "OPT C", "CHOICE C", "OPTION 3", "OPT 3", "CHOICE 3"].includes(cleaned)) return 2;
    if (["D", "OPTION D", "OPT D", "CHOICE D", "OPTION 4", "OPT 4", "CHOICE 4"].includes(cleaned)) return 3;

    // Direct Numeric Matching (handles "1", "2", "3", "4" and floats like "1.0", "2.0", "3.0", "4.0")
    const numVal = parseFloat(cleaned);
    if (!isNaN(numVal)) {
      if (numVal >= 1 && numVal <= 4) {
        return Math.round(numVal) - 1;
      }
      if (numVal >= 0 && numVal <= 3 && Number.isInteger(numVal)) {
        return Math.round(numVal);
      }
    }

    // Fallback: Check exact match with option values (case-insensitive)
    const options = [opt1, opt2, opt3, opt4];
    const matchIdx = options.findIndex((opt) => opt && opt.trim().toLowerCase() === origStr.toLowerCase());
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

        // 1. Force recalculate sheet range !ref so SheetJS never truncates rows early
        const keys = Object.keys(worksheet).filter((k) => !k.startsWith("!"));
        let maxRow = 0;
        for (const key of keys) {
          const match = key.match(/\d+/);
          if (match) {
            const rNum = parseInt(match[0], 10);
            if (rNum > maxRow) maxRow = rNum;
          }
        }
        if (maxRow > 0) {
          worksheet["!ref"] = `A1:Z${maxRow}`;
        }

        // 2. Parse 2D matrix (array of arrays) for 100% row capture
        const matrix: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

        if (!matrix || matrix.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "Empty Spreadsheet",
            text: "The uploaded file does not contain any data rows.",
            confirmButtonColor: "#10b981"
          });
          setParsedRows([]);
          return;
        }

        // 3. Dynamically find header row index (scanning first 10 rows)
        let headerRowIdx = 0;
        const qKeywords = ["question", "question text", "questions", "qs", "q", "item", "description", "title", "prompt"];
        const optAKeywords = ["option a", "optiona", "option 1", "option1", "opt a", "opta", "opt 1", "choice a", "choice 1"];

        for (let r = 0; r < Math.min(10, matrix.length); r++) {
          const rowStr = (matrix[r] || []).map((c) => String(c).toLowerCase().trim()).join(" ");
          const hasQ = qKeywords.some((kw) => rowStr.includes(kw));
          const hasOpt = optAKeywords.some((kw) => rowStr.includes(kw));
          if (hasQ || hasOpt) {
            headerRowIdx = r;
            break;
          }
        }

        const headerRow = matrix[headerRowIdx] || [];

        // Helper to find column index by header names
        const findColIndex = (keywords: string[], fallbackIdx: number, isQuestionCol: boolean = false): number => {
          for (const kw of keywords) {
            const idx = headerRow.findIndex((h) => String(h).trim().toLowerCase() === kw.toLowerCase());
            if (idx !== -1) return idx;
          }
          for (const kw of keywords) {
            const idx = headerRow.findIndex((h) => {
              const hStr = String(h).trim().toLowerCase();
              if (isQuestionCol && (hStr.includes("number") || hStr.includes("no") || hStr.includes("sr") || hStr.includes("s.no"))) {
                return false;
              }
              return hStr.includes(kw.toLowerCase());
            });
            if (idx !== -1) return idx;
          }
          return fallbackIdx;
        };

        const questionColIdx = findColIndex(["question text", "question", "questions", "qs", "description", "details"], 1, true);
        const optAColIdx = findColIndex(["option a", "optiona", "option 1", "option1", "opt a", "opta", "opt 1", "choice a", "choice 1"], 2);
        const optBColIdx = findColIndex(["option b", "optionb", "option 2", "option2", "opt b", "optb", "opt 2", "choice b", "choice 2"], 3);
        const optCColIdx = findColIndex(["option c", "optionc", "option 3", "option3", "opt c", "optc", "opt 3", "choice c", "choice 3"], 4);
        const optDColIdx = findColIndex(["option d", "optiond", "option 4", "option4", "opt d", "optd", "opt 4", "choice d", "choice 4"], 5);
        const ansColIdx = findColIndex(["correct answer", "correct_answer", "correctoption", "correct option", "correct_option", "answer", "ans", "right answer", "correct", "ans.", "correct ans", "key"], 6);
        const hintColIdx = findColIndex(["hint", "explanation", "solution", "notes"], 7);

        // 4. Process all data rows from headerRowIdx + 1 onwards
        const rows: ParsedQuestionRow[] = [];

        for (let r = headerRowIdx + 1; r < matrix.length; r++) {
          const rowData = matrix[r];
          if (!rowData || rowData.length === 0) continue;

          let questionText = String(rowData[questionColIdx] || "").trim();
          let option1 = String(rowData[optAColIdx] || "").trim();
          let option2 = String(rowData[optBColIdx] || "").trim();
          let option3 = String(rowData[optCColIdx] || "").trim();
          let option4 = String(rowData[optDColIdx] || "").trim();
          let rawAnswer = String(rowData[ansColIdx] || "").trim();
          let hint = String(rowData[hintColIdx] || "").trim();

          // Positional fallback if questionText or options are empty
          if (!questionText && rowData.length >= 6) {
            const col0Str = String(rowData[0] || "").trim();
            const col1Str = String(rowData[1] || "").trim();

            if (col0Str.length > 5 && isNaN(Number(col0Str))) {
              questionText = col0Str;
              option1 = String(rowData[1] || "").trim();
              option2 = String(rowData[2] || "").trim();
              option3 = String(rowData[3] || "").trim();
              option4 = String(rowData[4] || "").trim();
              rawAnswer = String(rowData[5] || "").trim();
              if (rowData[6]) hint = String(rowData[6] || "").trim();
            } else if (col1Str.length > 5) {
              questionText = col1Str;
              option1 = String(rowData[2] || "").trim();
              option2 = String(rowData[3] || "").trim();
              option3 = String(rowData[4] || "").trim();
              option4 = String(rowData[5] || "").trim();
              rawAnswer = String(rowData[6] || "").trim();
              if (rowData[7]) hint = String(rowData[7] || "").trim();
            }
          }

          // Skip completely empty rows
          if (!questionText && !option1 && !option2 && !rawAnswer) continue;

          const answerIndex = parseCorrectAnswerIndex(rawAnswer, option1, option2, option3, option4);

          let errorMsg = "";
          if (!questionText) {
            errorMsg = "Question text is missing.";
          } else if (!option1 || !option2) {
            errorMsg = "At least Option A and Option B are required.";
          } else if (answerIndex < 0 || answerIndex > 3) {
            errorMsg = `Invalid Correct Answer "${rawAnswer}". Must be 1-4, A-D, or match option text.`;
          }

          rows.push({
            rowIndex: r + 1,
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
          });
        }

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
          isPaid: testAccessType === "paid",
          testSeriesName: testSeriesName.trim()
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

      {/* Single Combined Full-Width Card: Course Selection & File Upload */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-sm">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Select Course & Upload Excel Spreadsheet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose target main course & sub-course, then drop your MCQ Excel/CSV file below
              </p>
            </div>
          </div>

          {fileName && (
            <button
              onClick={handleClearFile}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-1.5 rounded-lg transition cursor-pointer border border-red-200 dark:border-red-900/30"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear Selected File
            </button>
          )}
        </div>

        {/* 2-Column Interior Grid inside Full-Width Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column (5 Cols): Course Selection Form */}
          <div className="lg:col-span-5 space-y-4">
            {loadingInitial ? (
              <div className="flex items-center justify-center py-10 gap-2 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                Loading courses...
              </div>
            ) : (
              <>
                {/* Main Course / Category Selection */}
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
                      setSelectedCourseId(""); // Reset sub-course selection
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:outline-none transition cursor-pointer"
                  >
                    <option value="">-- Select Main Course --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Sub Course Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Sub Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:outline-none transition cursor-pointer"
                  >
                    <option value="">-- Select Sub Course --</option>
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

                {/* Test Series Name Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Test Series Name <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">e.g. Mock Test - 1</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mock Test - 1 or Full Length Mock Test 1"
                    value={testSeriesName}
                    onChange={(e) => setTestSeriesName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>

                {/* Paid vs Free Mock Test Option Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mock Test Pricing / Access Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={testAccessType}
                    onChange={(e) => setTestAccessType(e.target.value as "paid" | "free")}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:outline-none transition cursor-pointer"
                  >
                    <option value="free">Free Access </option>
                    <option value="paid">Paid Access </option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Right Column (7 Cols): File Upload Dropzone & Instructions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">

            {/* File Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer min-h-[220px] ${dragActive
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
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Selected File</p>
                  <h4 className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {fileName}
                  </h4>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {parsedRows.length} rows parsed
                    </span>
                    {invalidCount > 0 && (
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {invalidCount} invalid
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
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
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-black text-white shadow-lg transition-all active:scale-[0.98] cursor-pointer ${isUploading || validCount === 0
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
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${previewFilter === "all"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
              >
                All ({parsedRows.length})
              </button>
              <button
                onClick={() => setPreviewFilter("valid")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${previewFilter === "valid"
                    ? "bg-emerald-500 text-white shadow-xs"
                    : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                  }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Valid ({validCount})
              </button>
              <button
                onClick={() => setPreviewFilter("invalid")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${previewFilter === "invalid"
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
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${t.type.toLowerCase().includes("full")
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
                                className={`px-3 py-1 text-[11px] font-extrabold rounded-full border outline-none transition cursor-pointer shadow-2xs ${isFreeAccess
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
