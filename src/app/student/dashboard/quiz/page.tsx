"use client";

import { useEffect, useState } from "react";
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2, 
  X,
  AlertCircle,
  FileText,
  Award,
  Trophy,
  BookOpen,
  GraduationCap,
  Loader2
} from "lucide-react";
import Swal from "sweetalert2";
import { useDashboard } from "../layout";
import { MCQ_BANKS, MCQQuestion } from "../data";

export default function MockExamsPage() {
  const { student, isDark, saveActivity } = useDashboard();

  // Active exam states
  const [activeBundleSize, setActiveBundleSize] = useState<number | null>(null);
  const [bundleQuestions, setBundleQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [bundleAnswers, setBundleAnswers] = useState<Record<number, number>>({});
  const [bundleSubmitted, setBundleSubmitted] = useState<boolean>(false);
  const [bundleScore, setBundleScore] = useState<number>(0);

  // Dynamic database questions state
  const [dbQuestions, setDbQuestions] = useState<MCQQuestion[]>([]);
  const [dbLoading, setDbLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentMcqs = async () => {
      setDbLoading(true);
      setDbError(null);
      try {
        const token = localStorage.getItem("student_token");
        if (!token) {
          setDbError("Authentication token is missing. Please log in again.");
          setDbLoading(false);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/student/mcqs`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch mock exam questions.");
        }

        const data = await res.json();
        if (data.success) {
          setDbQuestions(data.mcqs || []);
        } else {
          throw new Error(data.message || "Failed to load questions.");
        }
      } catch (err: any) {
        console.error("Failed to load student MCQs:", err);
        setDbError(err.message || "An error occurred while loading mock exam questions.");
      } finally {
        setDbLoading(false);
      }
    };

    fetchStudentMcqs();
  }, []);

  if (!student) return null;

  const startExam = (size: number) => {
    const courseId = student ? Number(student.course_id) : 1;
    // Use dynamic database questions if available, otherwise fall back to static bank
    const baseQuestions = dbQuestions.length > 0 
      ? dbQuestions 
      : (MCQ_BANKS[courseId] || MCQ_BANKS[1] || []);
    
    if (baseQuestions.length === 0) {
      Swal.fire({
        title: "No Questions",
        text: "There are currently no mock questions available for your course.",
        icon: "info",
        confirmButtonColor: "#4f46e5"
      });
      return;
    }

    const list: MCQQuestion[] = [];
    for (let i = 0; i < size; i++) {
      const baseQ = baseQuestions[i % baseQuestions.length];
      list.push({
        id: i + 1,
        question: baseQ.question,
        options: [...baseQ.options],
        answer: baseQ.answer,
        hint: baseQ.hint || ""
      });
    }
    
    setActiveBundleSize(size);
    setBundleQuestions(list);
    setCurrentQuestionIndex(0);
    setBundleAnswers({});
    setBundleSubmitted(false);
    setBundleScore(0);

    saveActivity({
      id: Date.now(),
      type: "quiz",
      title: `Started ${size} MCQ Practice Exam Bundle`
    });
  };

  const handleSelectBundleOption = (optionIndex: number) => {
    if (bundleSubmitted) return;
    setBundleAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < bundleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBackQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateBundleScore = () => {
    let score = 0;
    bundleQuestions.forEach((q, idx) => {
      if (bundleAnswers[idx] === q.answer) {
        score++;
      }
    });

    setBundleScore(score);
    setBundleSubmitted(true);

    localStorage.setItem(`student_last_bundle_score_${student.student_id}`, score.toString());
    localStorage.setItem(`student_last_bundle_size_${student.student_id}`, bundleQuestions.length.toString());

    saveActivity({
      id: Date.now(),
      type: "quiz",
      title: `Completed ${bundleQuestions.length} MCQ Practice Exam - Scored ${score}/${bundleQuestions.length}`
    });

    Swal.fire({
      title: "Exam Completed!",
      text: `You scored ${score} out of ${bundleQuestions.length}!`,
      icon: score >= (bundleQuestions.length / 2) ? "success" : "info",
      confirmButtonColor: "#4f46e5"
    });
  };

  const handleSubmitBundleExam = () => {
    const answeredCount = Object.keys(bundleAnswers).length;
    if (answeredCount < bundleQuestions.length) {
      Swal.fire({
        title: "Incomplete Exam",
        text: `You have answered only ${answeredCount} of ${bundleQuestions.length} questions. Do you want to submit anyway?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, submit",
        cancelButtonText: "Keep working"
      }).then((result) => {
        if (result.isConfirmed) {
          calculateBundleScore();
        }
      });
    } else {
      calculateBundleScore();
    }
  };

  const resetBundleExam = () => {
    setActiveBundleSize(null);
    setBundleQuestions([]);
    setCurrentQuestionIndex(0);
    setBundleAnswers({});
    setBundleSubmitted(false);
    setBundleScore(0);
  };

  const textHeading = isDark ? "text-white" : "text-slate-900";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {activeBundleSize === null ? (
        // 1. Bundle Selection Screen
        <div className="space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className={`text-lg font-black ${textHeading}`}>Practice Mock Exams</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Select a practice bundle size below to test your knowledge. Questions are tailored specifically to your enrolled course.
            </p>
          </div>

          {dbLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-405 dark:text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-xs font-bold">Loading dynamic practice bundles...</p>
            </div>
          ) : dbError ? (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{dbError}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
              {[
                { 
                  title: `${student.course_name || "Course"} Previous Year Paper`, 
                  subtitle: "Past Year Papers", 
                  size: 20, 
                  time: "15 mins", 
                  desc: "Access previous year exams to check your base readiness level.",
                  icon: FileText
                },
                { 
                  title: `${student.course_name || "Course"} Prelims Tests`, 
                  subtitle: "20 Prelims in Exam Level + 5 Advanced Level Prelims Tests", 
                  size: 50, 
                  time: "40 mins", 
                  desc: "Comprehensive review of core prelim concepts under timed conditions.",
                  icon: Award
                },
                { 
                  title: `${student.course_name || "Course"} Mains Tests`, 
                  subtitle: "Attempt full syllabus Mains mock tests", 
                  size: 100, 
                  time: "90 mins", 
                  desc: "Full-length mock exam simulation with detailed review support.",
                  icon: Trophy
                },
                { 
                  title: `${student.course_name || "Course"} Sectional Speed Test`, 
                  subtitle: "Quick sectional practice for core topics", 
                  size: 250, 
                  time: "3 hours", 
                  desc: "Intensive marathon prep session covering multiple core chapters.",
                  icon: BookOpen
                },
                { 
                  title: `${student.course_name || "Course"} Ultimate Master Marathon`, 
                  subtitle: "Ultimate master practice marathon for advanced ranks", 
                  size: 500, 
                  time: "6 hours", 
                  desc: "Master level marathon practice sets designed for peak rank prep.",
                  icon: GraduationCap
                }
              ].map((bundle) => {
                const IconComponent = bundle.icon;
                return (
                  <div 
                    key={bundle.size}
                    className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-350 hover:shadow-lg hover:-translate-y-1 ${
                      isDark 
                        ? "border-slate-800 bg-slate-900/35 hover:border-emerald-500/40 hover:bg-slate-900/60" 
                        : "border-slate-200/80 bg-white hover:border-emerald-500/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Header Row: Icon & Titles */}
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <IconComponent className="h-5.5 w-5.5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className={`text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-450`}>
                            {bundle.subtitle}
                          </h4>
                          <h3 className={`text-sm font-black leading-snug tracking-tight ${textHeading}`}>
                            {bundle.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                          {bundle.desc}
                        </p>
                      </div>
                    </div>

                    {/* Footer Row: Attempt button and metadata badge */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => startExam(bundle.size)}
                        className="rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 text-xs font-black transition active:scale-[0.97] cursor-pointer shadow-md shadow-emerald-700/10 hover:shadow-emerald-700/20"
                      >
                        Attempt
                      </button>
                      <span className="text-[10px] text-slate-400 dark:text-slate-505 font-extrabold flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 px-2.5 py-1 rounded-md">
                        <Clock className="h-3.5 w-3.5 text-slate-350" />
                        {bundle.time} • {bundle.size} Qs
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : !bundleSubmitted ? (
        // 2. Active Exam Screen
        <div className="space-y-6 max-w-5xl">
          {/* Exam Header */}
          <div className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
            isDark ? "border-slate-800 bg-slate-900/20" : "border-slate-200 bg-white shadow-xs"
          }`}>
            <div>
              <h3 className={`text-sm font-black ${textHeading}`}>
                Active Exam: {activeBundleSize} MCQs Bundle
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Select your answers and click Next/Back to navigate. Submit when you are finished.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmitBundleExam}
                className="rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 text-xs font-black shadow-md shadow-emerald-700/10 transition active:scale-[0.98] cursor-pointer"
              >
                Submit Exam
              </button>
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Quit Exam?",
                    text: "Your current progress will be lost. Are you sure you want to exit?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#64748b",
                    confirmButtonText: "Yes, quit",
                    cancelButtonText: "Continue exam"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      resetBundleExam();
                    }
                  });
                }}
                className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                  isDark ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Exit Practice
              </button>
            </div>
          </div>

          {/* Question Navigation & Quick Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left 3 Cols: Active Question */}
            <div className="lg:col-span-3 space-y-6">
              <div className={`rounded-2xl border p-6 space-y-6 ${
                isDark ? "border-slate-800 bg-slate-900/30" : "border-slate-200 bg-white shadow-xs"
              }`}>
                {/* Progress Bar & Index */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span>Question {currentQuestionIndex + 1} of {bundleQuestions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / bundleQuestions.length) * 100)}% Progress</span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentQuestionIndex + 1) / bundleQuestions.length) * 100}%` }}
                  />
                </div>

                {/* Question Text */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-black text-emerald-600">
                      {currentQuestionIndex + 1}
                    </span>
                    <h4 className={`text-sm font-black leading-snug pt-0.5 ${textHeading}`}>
                      {bundleQuestions[currentQuestionIndex]?.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="grid gap-3 pl-10 pt-2">
                    {bundleQuestions[currentQuestionIndex]?.options.map((opt, optIndex) => {
                      const isSelected = bundleAnswers[currentQuestionIndex] === optIndex;
                      let optStyle = isDark
                        ? "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-emerald-500/30"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-650/40 shadow-xs";
                      
                      if (isSelected) {
                        optStyle = isDark
                          ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold"
                          : "border-emerald-600 bg-emerald-50/50 text-emerald-700 font-bold";
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          onClick={() => handleSelectBundleOption(optIndex)}
                          className={`w-full text-left rounded-xl border px-4.5 py-3.5 text-xs transition-all flex items-center justify-between outline-none cursor-pointer ${optStyle}`}
                        >
                          <span>{opt}</span>
                          {isSelected && (
                            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Back and Next navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleBackQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-1.5 rounded-xl border px-5 py-3 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                    isDark 
                      ? "border-slate-800 text-slate-400 hover:bg-slate-800" 
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                {currentQuestionIndex < bundleQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-3 text-xs font-bold transition cursor-pointer"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitBundleExam}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 text-xs font-black shadow-md transition active:scale-[0.98] cursor-pointer"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>

            {/* Right 1 Col: Quick Index Grid */}
            <div className={`rounded-2xl border p-4 flex flex-col justify-between space-y-4 max-h-[420px] ${
              isDark ? "border-slate-800 bg-slate-900/30" : "border-slate-200 bg-white shadow-xs"
            }`}>
              <div className="space-y-3">
                <h4 className={`text-xs font-black uppercase tracking-wider ${textHeading}`}>
                  Answer Grid
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Click on any box to quickly jump to that question.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-5 gap-1.5 py-1">
                {bundleQuestions.map((_, idx) => {
                  const isAnswered = bundleAnswers[idx] !== undefined;
                  const isActive = currentQuestionIndex === idx;
                  
                  let gridStyle = isDark
                    ? "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300";

                  if (isActive) {
                    gridStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-505 ring-1 ring-emerald-500 font-black";
                  } else if (isAnswered) {
                    gridStyle = isDark
                      ? "border-emerald-800/40 bg-emerald-950/20 text-emerald-400 font-bold"
                      : "border-emerald-100 bg-emerald-50 text-emerald-700 font-bold";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-7 w-full rounded-lg border text-[10px] flex items-center justify-center transition outline-none cursor-pointer ${gridStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Answered: {Object.keys(bundleAnswers).length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span>Remaining: {bundleQuestions.length - Object.keys(bundleAnswers).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 3. Results Screen
        <div className="space-y-6 max-w-4xl">
          {/* Score summary panel */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-xl">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold tracking-wider uppercase">
                  Practice Result Summary
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  You scored {bundleScore} / {bundleQuestions.length} Correct!
                </h2>
                <p className="text-xs sm:text-sm text-emerald-50 font-semibold max-w-xl">
                  Success Rate: {Math.round((bundleScore / bundleQuestions.length) * 100)}% | Enrolled Course: {student?.course_name || "Enrolled Course"}
                </p>
              </div>
              <div className="flex items-center gap-4 self-start md:self-auto">
                <button
                  onClick={resetBundleExam}
                  className="rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 px-6 py-3.5 text-xs font-black shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Try Another Bundle
                </button>
              </div>
            </div>
          </div>

          {/* Question details review list */}
          <div className="space-y-4">
            <h3 className={`text-base font-black ${textHeading} border-b border-slate-100 dark:border-slate-800 pb-3`}>
              Question Analysis & Answer Key
            </h3>

            <div className="space-y-5">
              {bundleQuestions.map((q, qIndex) => {
                const selectedOpt = bundleAnswers[qIndex];
                const isCorrect = selectedOpt === q.answer;

                return (
                  <div 
                    key={q.id} 
                    className={`rounded-2xl border p-5.5 space-y-4 shadow-xs transition ${
                      isDark 
                        ? "border-slate-800 bg-slate-900/30" 
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {/* Question text with Correct/Incorrect Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg bg-slate-500/10 border border-slate-500/20 text-[11px] font-black text-slate-550 dark:text-slate-400">
                          {qIndex + 1}
                        </span>
                        <h4 className={`text-sm font-black leading-snug pt-0.5 ${textHeading}`}>
                          {q.question}
                        </h4>
                      </div>

                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase border shrink-0 ${
                        isCorrect 
                          ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600" 
                          : "bg-red-500/10 border-red-500/25 text-red-500"
                      }`}>
                        {isCorrect ? "Correct ✓" : "Incorrect ✗"}
                      </span>
                    </div>

                    {/* Options Display */}
                    <div className="grid gap-2.5 ml-10">
                      {q.options.map((opt, optIdx) => {
                        let optStyle = isDark
                          ? "border-slate-850 bg-slate-900/20 text-slate-400"
                          : "border-slate-100 bg-slate-50/50 text-slate-500";

                        // Highlight correct option in emerald green
                        if (optIdx === q.answer) {
                          optStyle = isDark
                            ? "border-emerald-500 bg-emerald-950/35 text-emerald-400 font-bold ring-1 ring-emerald-500/20"
                            : "border-emerald-600 bg-emerald-50 text-emerald-805 font-bold ring-1 ring-emerald-600/20";
                        } 
                        // Highlight incorrect student selection in red
                        else if (selectedOpt === optIdx && !isCorrect) {
                          optStyle = isDark
                            ? "border-red-500 bg-red-950/20 text-red-400 font-bold ring-1 ring-red-500/20"
                            : "border-red-400 bg-red-50 text-red-800 font-bold ring-1 ring-red-500/20";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`w-full rounded-xl border px-4.5 py-3.5 text-xs flex items-center justify-between ${optStyle}`}
                          >
                            <span>{opt}</span>
                            {optIdx === q.answer && (
                              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                            )}
                            {selectedOpt === optIdx && !isCorrect && (
                              <X className="h-4.5 w-4.5 text-red-650 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Student choice feedback */}
                    <div className="ml-10 flex flex-col sm:flex-row gap-3 text-xs font-semibold">
                      <div className={`p-3.5 rounded-xl border flex items-start gap-2 flex-1 ${
                        isDark ? "bg-slate-900/60 border-slate-800 text-slate-405" : "bg-slate-50 border-slate-150 text-slate-600"
                      }`}>
                        <AlertCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p><strong>Explanation:</strong> {q.hint}</p>
                        </div>
                      </div>

                      <div className={`p-3.5 rounded-xl border flex items-center gap-2 shrink-0 ${
                        isCorrect 
                          ? (isDark ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-800")
                          : (isDark ? "bg-red-950/20 border-red-900/50 text-red-400" : "bg-red-50 border-red-100 text-red-800")
                      }`}>
                        <span className="font-bold">
                          Your Choice: {selectedOpt !== undefined ? `Option ${selectedOpt + 1}` : "Unanswered"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
