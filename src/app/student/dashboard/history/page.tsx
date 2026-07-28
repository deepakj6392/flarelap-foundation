"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  History, 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  Search, 
  RefreshCw, 
  BookOpen, 
  Eye, 
  X, 
  BarChart3, 
  AlertCircle,
  FileCheck,
  Check,
  Zap,
  Target
} from "lucide-react";
import Swal from "sweetalert2";

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  hint?: string;
}

interface TestAttemptRecord {
  id: number;
  userId: number;
  courseId: number;
  testId: number;
  score: string | number;
  totalQs: number;
  answered: number;
  correct: number;
  wrong: number;
  duration: number; // in seconds
  userAnswers: string | Record<number, number> | null;
  questionData: string | MCQQuestion[] | null;
  createdAt: string;
  test?: {
    name: string;
    type: string;
  };
  course?: {
    name: string;
  };
}

export default function StudentTestHistoryPage() {
  const [attempts, setAttempts] = useState<TestAttemptRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Review Modal / Stepper state
  const [activeAttempt, setActiveAttempt] = useState<TestAttemptRecord | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<MCQQuestion[]>([]);
  const [parsedAnswers, setParsedAnswers] = useState<Record<number, number>>({});
  
  // Stepper controls inside Review Modal
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [filterType, setFilterType] = useState<"ALL" | "WRONG" | "CORRECT" | "UNANSWERED">("ALL");

  const fetchAttempts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("student_token");
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/student/attempts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAttempts(data.attempts || []);
      } else {
        throw new Error(data.message || "Failed to load test history.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch test history. Check network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  const openReviewModal = (attempt: TestAttemptRecord) => {
    let qList: MCQQuestion[] = [];
    let aMap: Record<number, number> = {};

    try {
      if (typeof attempt.questionData === "string") {
        qList = JSON.parse(attempt.questionData);
      } else if (Array.isArray(attempt.questionData)) {
        qList = attempt.questionData;
      }
    } catch (e) {
      qList = [];
    }

    try {
      if (typeof attempt.userAnswers === "string") {
        aMap = JSON.parse(attempt.userAnswers);
      } else if (attempt.userAnswers && typeof attempt.userAnswers === "object") {
        aMap = attempt.userAnswers as Record<number, number>;
      }
    } catch (e) {
      aMap = {};
    }

    setActiveAttempt(attempt);
    setParsedQuestions(qList);
    setParsedAnswers(aMap);
    setCurrentQuestionIndex(0);
    setFilterType("ALL");
  };

  const closeReviewModal = () => {
    setActiveAttempt(null);
    setParsedQuestions([]);
    setParsedAnswers({});
    setCurrentQuestionIndex(0);
  };

  // Filter questions for the stepper
  const filteredQuestionIndices = parsedQuestions
    .map((q, idx) => {
      const userSelected = parsedAnswers[idx];
      const isAnswered = userSelected !== undefined && userSelected !== null;
      const isCorrect = isAnswered && userSelected === q.answer;
      const isWrong = isAnswered && userSelected !== q.answer;

      if (filterType === "WRONG" && !isWrong) return -1;
      if (filterType === "CORRECT" && !isCorrect) return -1;
      if (filterType === "UNANSWERED" && isAnswered) return -1;
      return idx;
    })
    .filter(idx => idx !== -1);

  // Compute summary stats across all attempts
  const totalAttempts = attempts.length;
  const totalQuestionsSolved = attempts.reduce((acc, curr) => acc + (curr.answered || 0), 0);
  const totalCorrect = attempts.reduce((acc, curr) => acc + (curr.correct || 0), 0);
  const totalWrong = attempts.reduce((acc, curr) => acc + (curr.wrong || 0), 0);
  const overallAccuracy = totalQuestionsSolved > 0 
    ? Math.round((totalCorrect / totalQuestionsSolved) * 100) 
    : 0;

  const filteredAttempts = attempts.filter(a => {
    const testName = a.test?.name || `Mock Test #${a.testId}`;
    const courseName = a.course?.name || "";
    return testName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           courseName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 p-8 text-white shadow-lg shadow-emerald-950/20">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold backdrop-blur-md">
              <History className="h-4 w-4" />
              Mock Exam Analytics & Solutions Review
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight">
              My Mock Test History & Performance
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100 max-w-2xl font-medium">
              Review your complete test attempts date-wise. Inspect wrong answers, analyze question solutions, and track your progress stepper by stepper.
            </p>
          </div>

          <button
            onClick={fetchAttempts}
            disabled={loading}
            className="flex items-center justify-center gap-2 self-start md:self-auto rounded-2xl bg-white px-5 py-3.5 text-xs font-extrabold text-emerald-900 shadow-md transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-700" : ""}`} />
            Sync History
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-bold text-red-500">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tests */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">Total Attempts</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{loading ? "..." : totalAttempts}</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">Completed Tests</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <FileCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Total Solved */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">Questions Solved</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{loading ? "..." : totalQuestionsSolved}</p>
            <p className="text-[10px] text-blue-600 font-bold mt-1">Total MCQs Answered</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        {/* Correct Answers */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">Correct Answers</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{loading ? "..." : totalCorrect}</p>
            <p className="text-[10px] text-rose-500 font-bold mt-1">{totalWrong} Wrong MCQs</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">Overall Accuracy</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{loading ? "..." : `${overallAccuracy}%`}</p>
            <p className="text-[10px] text-teal-600 font-bold mt-1">Success Percentage</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-500">
            <Target className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 3. Search & Date-wise Attempts List */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Date-wise Test Attempts</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click on any attempt card to open full question stepper solution review.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by test name or course..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-xs font-semibold text-slate-500">Loading your test attempt records...</p>
            </div>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center space-y-3">
            <History className="h-12 w-12 text-slate-300 dark:text-slate-700" />
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">No Mock Test Attempts Found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {searchQuery ? "No attempts match your search keyword." : "You haven't attempted any mock test series yet. Go to Practice Mock Exams to start!"}
              </p>
            </div>
            <Link
              href="/student/dashboard/quiz"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
            >
              <Zap className="h-4 w-4" />
              Attempt Mock Exam Now
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredAttempts.map((attempt) => {
              const testTitle = attempt.test?.name || `Mock Test Series #${attempt.testId}`;
              const courseTitle = attempt.course?.name || "General Course";
              const scoreNum = parseFloat(String(attempt.score || 0));
              const maxMarks = attempt.totalQs * 2;
              const accuracyPct = attempt.answered > 0 ? Math.round((attempt.correct / attempt.answered) * 100) : 0;

              return (
                <div 
                  key={attempt.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:border-emerald-500/40 transition duration-200 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Header line with date */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[10px] font-black text-slate-600 dark:text-slate-300">
                        <Clock className="h-3 w-3 text-emerald-500" />
                        {formatDate(attempt.createdAt)}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                        {attempt.test?.type || "Full Length Mock"}
                      </span>
                    </div>

                    {/* Test Title & Course */}
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2">{testTitle}</h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {courseTitle}
                      </p>
                    </div>

                    {/* Score & Metrics Box */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50/80 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 text-center">
                      <div>
                        <p className="text-[9.5px] font-bold uppercase text-slate-400">Score</p>
                        <p className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {scoreNum} <span className="text-[9.5px] font-normal text-slate-400">/ {maxMarks}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[9.5px] font-bold uppercase text-slate-400">Correct / Wrong</p>
                        <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-0.5">
                          <span className="text-emerald-600 font-bold">{attempt.correct}</span> / <span className="text-rose-500 font-bold">{attempt.wrong}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[9.5px] font-bold uppercase text-slate-400">Accuracy</p>
                        <p className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">
                          {accuracyPct}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openReviewModal(attempt)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white py-3 text-xs font-bold shadow-xs active:scale-[0.98] transition cursor-pointer"
                  >
                    <Eye className="h-4 w-4 text-emerald-400 dark:text-white" />
                    Review Complete Mock Test & Solutions
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. STEPPER REVIEW MODAL */}
      {activeAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            
            {/* Modal Top Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                    <FileCheck className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white max-w-md truncate">
                    {activeAttempt.test?.name || `Mock Test #${activeAttempt.testId}`}
                  </h3>
                </div>
                <p className="text-[10.5px] font-bold text-slate-400 mt-0.5">
                  Attempt Date: {formatDate(activeAttempt.createdAt)} • Duration: {formatDuration(activeAttempt.duration)}
                </p>
              </div>

              <button
                onClick={closeReviewModal}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Pills Bar */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mr-1">Filter View:</span>
              
              <button
                onClick={() => { setFilterType("ALL"); setCurrentQuestionIndex(0); }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "ALL" 
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                All Questions ({parsedQuestions.length})
              </button>

              <button
                onClick={() => { setFilterType("WRONG"); setCurrentQuestionIndex(0); }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "WRONG" 
                    ? "bg-rose-600 text-white font-black"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                }`}
              >
                Wrong Answers Only ({activeAttempt.wrong})
              </button>

              <button
                onClick={() => { setFilterType("CORRECT"); setCurrentQuestionIndex(0); }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "CORRECT" 
                    ? "bg-emerald-600 text-white font-black"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                }`}
              >
                Correct Answers ({activeAttempt.correct})
              </button>

              <button
                onClick={() => { setFilterType("UNANSWERED"); setCurrentQuestionIndex(0); }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "UNANSWERED" 
                    ? "bg-amber-600 text-white font-black"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                }`}
              >
                Unanswered ({parsedQuestions.length - (activeAttempt.answered || 0)})
              </button>
            </div>

            {/* Stepper Body Container */}
            {filteredQuestionIndices.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 opacity-40" />
                <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">No questions match the selected filter category.</p>
              </div>
            ) : (() => {
              const actualQIndex = filteredQuestionIndices[currentQuestionIndex] ?? 0;
              const q = parsedQuestions[actualQIndex];
              if (!q) return null;

              const userChoice = parsedAnswers[actualQIndex];
              const isAnswered = userChoice !== undefined && userChoice !== null;
              const isCorrect = isAnswered && userChoice === q.answer;
              const isWrong = isAnswered && userChoice !== q.answer;

              return (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Question Stepper Indicator & Palette Bar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Question {currentQuestionIndex + 1} of {filteredQuestionIndices.length} (Index #{actualQIndex + 1})
                      </span>

                      {/* Question Status Badge */}
                      {isCorrect && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-4 w-4" />
                          CORRECT (+2 Marks)
                        </span>
                      )}
                      {isWrong && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-black text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <XCircle className="h-4 w-4" />
                          INCORRECT (-0.5 Marks)
                        </span>
                      )}
                      {!isAnswered && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <HelpCircle className="h-4 w-4" />
                          UNANSWERED (0 Marks)
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / filteredQuestionIndices.length) * 100}%` }}
                      />
                    </div>

                    {/* Palette Quick Stepper Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {filteredQuestionIndices.map((qIdx, idx) => {
                        const sel = parsedAnswers[qIdx];
                        const ans = sel !== undefined && sel !== null;
                        const corr = ans && sel === parsedQuestions[qIdx].answer;
                        const wrg = ans && sel !== parsedQuestions[qIdx].answer;

                        let btnBg = "bg-slate-100 dark:bg-slate-800 text-slate-500";
                        if (corr) btnBg = "bg-emerald-600 text-white font-black";
                        else if (wrg) btnBg = "bg-rose-600 text-white font-black";
                        else if (!ans) btnBg = "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300";

                        const isActiveStep = idx === currentQuestionIndex;

                        return (
                          <button
                            key={qIdx}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`h-7 w-7 rounded-lg text-[10.5px] transition font-bold ${btnBg} ${
                              isActiveStep ? "ring-2 ring-emerald-500 scale-110 shadow-md" : "hover:opacity-80"
                            }`}
                          >
                            {qIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question Text Box */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-5 space-y-3">
                    <p className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                      Question #{actualQIndex + 1}
                    </p>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </h4>
                  </div>

                  {/* 4 Options Grid */}
                  <div className="space-y-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Answer Options:</p>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      {q.options.map((optText, optIdx) => {
                        const isCorrectOpt = optIdx === q.answer;
                        const isUserChosenOpt = userChoice === optIdx;

                        let cardStyle = "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300";
                        if (isCorrectOpt) {
                          cardStyle = "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-300 ring-1 ring-emerald-500 font-extrabold";
                        } else if (isUserChosenOpt && !isCorrectOpt) {
                          cardStyle = "border-rose-500 bg-rose-50/80 dark:bg-rose-950/30 text-rose-950 dark:text-rose-300 ring-1 ring-rose-500 font-extrabold";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`relative flex items-start gap-3 rounded-2xl border p-4 text-xs transition ${cardStyle}`}
                          >
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                              isCorrectOpt 
                                ? "bg-emerald-600 text-white" 
                                : isUserChosenOpt && !isCorrectOpt 
                                ? "bg-rose-600 text-white" 
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-xs leading-relaxed">{optText}</p>
                              
                              {isCorrectOpt && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                  <Check className="h-3 w-3" /> Correct Solution Answer
                                </span>
                              )}

                              {isUserChosenOpt && !isCorrectOpt && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 dark:text-rose-400 mt-1">
                                  <X className="h-3 w-3" /> Your Selected Option
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hint & Detailed Solution Box */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-xs">
                      <Zap className="h-4 w-4" />
                      Detailed Explanation & Solution Hint:
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {q.hint || `Option ${String.fromCharCode(65 + q.answer)} is the correct answer based on official curriculum guidelines and examination standards.`}
                    </p>
                  </div>

                </div>
              );
            })()}

            {/* Stepper Footer Controls */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Question
              </button>

              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
                {currentQuestionIndex + 1} / {filteredQuestionIndices.length}
              </span>

              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(filteredQuestionIndices.length - 1, prev + 1))}
                disabled={currentQuestionIndex === filteredQuestionIndices.length - 1}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-bold disabled:opacity-40 transition shadow-xs"
              >
                Next Question
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
