"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Clock, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  X, 
  Maximize2, 
  Minimize2, 
  AlertCircle,
  FileText,
  User,
  ShieldAlert,
  Loader2,
  Copy,
  Check
} from "lucide-react";
import Swal from "sweetalert2";
import { translateTextToHindi, translateOptionToHindi } from "@/lib/translator";
import { generateUniqueQuestions } from "@/lib/questionGenerator";
import { getCourseSubjects } from "@/lib/testSeriesGenerator";


interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  hint: string;
}

interface TestDetails {
  id: number;
  name: string;
  type: string;
  qs: number;
  marks: number;
  duration: number;
}

function createPRNG(seed: number) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const getSwalTarget = (): HTMLElement | string => {
  if (typeof document === 'undefined') return "body";
  const fsEl = document.fullscreenElement;
  if (fsEl && fsEl !== document.documentElement) {
    return fsEl as HTMLElement;
  }
  return "body";
};

export default function CBTTestAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const testIdStr = params?.id as string;
  const courseIdStr = searchParams.get("course");

  // Authentication states
  const [studentToken, setStudentToken] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  // Loading & Error states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Test config details
  const [testDetails, setTestDetails] = useState<TestDetails | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);

  // CBT Player states
  const [isConsentScreen, setIsConsentScreen] = useState<boolean>(true);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });
  const [timeLeft, setTimeLeft] = useState<number>(0); // In seconds
  const [language, setLanguage] = useState<"English" | "Hindi">("English");

  // Local development copy mode
  const [isLocalhost, setIsLocalhost] = useState<boolean>(false);
  const [copiedQ, setCopiedQ] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDev = window.location.hostname === "localhost" || 
                    window.location.hostname === "127.0.0.1" || 
                    window.location.hostname.includes("192.168.") ||
                    process.env.NODE_ENV === "development";
      setIsLocalhost(isDev);
    }
  }, []);

  // Roll Number generator
  const [rollNo, setRollNo] = useState<string>("");

  useEffect(() => {
    // Read student auth session
    const token = localStorage.getItem("student_token");
    const userJson = localStorage.getItem("student_user");
    if (!token || !userJson) {
      router.push(`/student/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    setStudentToken(token);
    const parsedUser = JSON.parse(userJson);
    setStudentProfile(parsedUser);
    setRollNo(parsedUser.student_id || `919${Math.floor(10000000 + Math.random() * 90000000)}`);
  }, [router]);

  useEffect(() => {
    if (!studentToken || !testIdStr || !courseIdStr) return;

    const fetchTestData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch course details to retrieve the test series record
        const courseRes = await fetch(`/api/courses/${courseIdStr}`);
        if (!courseRes.ok) throw new Error("Failed to load course details.");
        const courseData = await courseRes.json();

        const courseTitle = courseData.course?.name || "Mock Test Series";
        setCourseName(courseTitle);

        const dbTests = courseData.course?.testSeries || [];
        let testItem = dbTests.find((t: any) => 
          t.id.toString() === testIdStr || 
          t.id.toString() === testIdStr.replace(/^fmt-/, "").replace(/^ch-/, "")
        );

        if (!testItem) {
          const numericId = parseInt(testIdStr.replace(/\D/g, ""), 10) || 1;
          const isFullMock = testIdStr.toLowerCase().includes("fmt") || testIdStr.toLowerCase().includes("full");
          
          testItem = {
            id: testIdStr,
            name: isFullMock 
              ? `${courseTitle} - Full Length Mock Test ${numericId}` 
              : `${courseTitle} - Practice Test ${numericId}`,
            type: isFullMock ? "FULL_LENGTH" : "CHAPTER_TEST",
            qs: 100,
            marks: 100,
            duration: 60
          };
        }

        const details: TestDetails = {
          id: testItem.id,
          name: testItem.name,
          type: testItem.type || "FULL_LENGTH",
          qs: testItem.qs || 100,
          marks: testItem.marks || 100,
          duration: testItem.duration || 60
        };
        setTestDetails(details);
        setTimeLeft(details.duration * 60);

        // Fetch course MCQs
        const mcqRes = await fetch(`/api/student/mcqs?courseId=${courseIdStr}&testId=${testIdStr}&testName=${encodeURIComponent(details.name)}`, {
          headers: { "Authorization": `Bearer ${studentToken}` }
        });
        if (!mcqRes.ok) throw new Error("Failed to load mock exam questions.");
        const mcqData = await mcqRes.json();
        
        if (mcqData.testQuestions && Array.isArray(mcqData.testQuestions) && mcqData.testQuestions.length > 0) {
          setQuestions(mcqData.testQuestions);
        } else {
          const dbMcqs: MCQQuestion[] = mcqData.courseMcqs || [];
          const uniqueQuestions = generateUniqueQuestions(courseTitle, details.name, details.qs, dbMcqs);
          setQuestions(uniqueQuestions);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred while loading exam data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [studentToken, testIdStr, courseIdStr]);

  // Countdown timer effect
  useEffect(() => {
    if (isConsentScreen || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          autoSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isConsentScreen, timeLeft]);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const startTest = () => {
    if (!isAgreed) {
      Swal.fire({
        title: "Agreement Required",
        text: "Please accept the declaration checkbox to begin.",
        icon: "warning",
        target: getSwalTarget()
      });
      return;
    }
    setIsConsentScreen(false);
    // Request full screen on start
    document.documentElement.requestFullscreen().catch(() => {});
  };

  // CBT scoring logic (+2 for correct, -0.5 for incorrect)
  const calculateResult = () => {
    let correct = 0;
    let wrong = 0;
    let answered = 0;

    questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected !== undefined) {
        answered++;
        if (selected === q.answer) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const score = (correct * 2) - (wrong * 0.5);

    return {
      score: Math.max(0, score), // Floor score at 0
      totalQs: questions.length,
      answered,
      correct,
      wrong,
      duration: (testDetails?.duration || 0) * 60 - timeLeft
    };
  };

  const autoSubmitTest = () => {
    Swal.fire({
      title: "Time Expired!",
      text: "Your mock test time has run out. Submitting your test automatically.",
      icon: "info",
      confirmButtonText: "View Scorecard",
      target: getSwalTarget()
    }).then(() => {
      submitTestResults();
    });
  };

  const confirmSubmitTest = () => {
    const results = calculateResult();
    const unanswered = questions.length - results.answered;

    Swal.fire({
      title: "Final Submit Mock Test?",
      html: `
        <div class="text-left text-xs font-sans space-y-2 mt-2">
          <p class="font-bold text-slate-700">Are you sure you want to finish and submit the test?</p>
          <div class="bg-slate-50 p-3 rounded-lg border space-y-1">
            <div>• Answered: <span class="font-bold text-emerald-600">${results.answered}</span></div>
            <div>• Unanswered: <span class="font-bold text-slate-550">${unanswered}</span></div>
            <div>• Reviewed: <span class="font-bold text-indigo-600">${Object.keys(markedForReview).length}</span></div>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Final Submit Test",
      cancelButtonText: "Keep Attempting",
      confirmButtonColor: "#047857",
      cancelButtonColor: "#6b7280",
      target: getSwalTarget()
    }).then((res) => {
      if (res.isConfirmed) {
        submitTestResults();
      }
    });
  };

  const submitTestResults = async () => {
    const finalCourseId = parseInt(courseIdStr || "", 10) || studentProfile?.course_id || studentProfile?.courseId;
    const finalTestId = testDetails?.id || parseInt(testIdStr || "", 10);

    if (!studentToken || !finalTestId || !finalCourseId) {
      Swal.fire({
        title: "Error",
        text: "Missing auth token or test/course context parameters.",
        icon: "error",
        target: getSwalTarget()
      });
      return;
    }
    setLoading(true);

    const stats = calculateResult();
    try {
      const res = await fetch("/api/student/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          testId: finalTestId,
          courseId: finalCourseId,
          score: stats.score,
          totalQs: stats.totalQs,
          answered: stats.answered,
          correct: stats.correct,
          wrong: stats.wrong,
          duration: stats.duration,
          userAnswers: JSON.stringify(answers),
          questionData: JSON.stringify(questions)
        })
      });

      if (res.ok) {
        // Exit fullscreen if active
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }

        Swal.fire({
          title: "Mock Test Submitted!",
          html: `
            <div class="text-left font-sans text-xs space-y-3">
              <p class="text-slate-600">Congratulations! You successfully submitted the test series.</p>
              <div class="bg-slate-50 p-4 rounded-xl border space-y-1.5 font-bold">
                <div class="flex justify-between"><span>Total Questions:</span> <span>${stats.totalQs}</span></div>
                <div class="flex justify-between text-emerald-700"><span>Correct Answers:</span> <span>${stats.correct} (+${stats.correct * 2} Marks)</span></div>
                <div class="flex justify-between text-rose-600"><span>Wrong Answers:</span> <span>${stats.wrong} (-${stats.wrong * 0.5} Marks)</span></div>
                <hr class="my-1.5"/>
                <div class="flex justify-between text-emerald-805 text-sm font-black"><span>Final Score:</span> <span>${stats.score} / ${stats.totalQs * 2}</span></div>
              </div>
            </div>
          `,
          icon: "success",
          confirmButtonText: "Go to Dashboard",
          confirmButtonColor: "#047857"
        }).then(() => {
          router.push("/student/dashboard");
        });
      } else {
        throw new Error("Failed to save attempt in database.");
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error Saving Results",
        text: err.message || "Failed to submit test.",
        icon: "error",
        target: getSwalTarget()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setVisited(prev => ({ ...prev, [nextIdx]: true }));
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setVisited(prev => ({ ...prev, [prevIdx]: true }));
    }
  };

  const handleSelectOption = (optIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optIdx }));
  };

  const handleReviewCurrentQuestion = () => {
    setMarkedForReview(prev => ({ ...prev, [currentIndex]: true }));
  };

  const clearResponse = () => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[currentIndex];
      return newAnswers;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyQuestion = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    const qText = language === "Hindi" ? translateTextToHindi(currentQ.question) : currentQ.question;
    const opts = currentQ.options.map((opt, i) => `${i + 1}. ${language === "Hindi" ? translateOptionToHindi(opt) : opt}`).join("\n");
    const fullText = `Question ${currentIndex + 1}:\n${qText}\n\nOptions:\n${opts}\n\nCorrect Answer: Option ${currentQ.answer + 1}\nExplanation / Hint: ${currentQ.hint || "N/A"}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText).then(() => {
        setCopiedQ(true);
        setTimeout(() => setCopiedQ(false), 2000);
      });
    }
  };

  // Section breakdown logic (MUST be declared before early returns)
  const sections = useMemo(() => {
    const courseTitle = courseName || testDetails?.name || "";
    const totalQuestions = questions.length || testDetails?.qs || 100;
    const subjects = getCourseSubjects(courseTitle);
    
    if (!subjects || subjects.length === 0) {
      return [{
        name: "General Paper",
        startIdx: 0,
        endIdx: totalQuestions - 1,
        totalQs: totalQuestions,
        marks: testDetails?.marks || 100
      }];
    }

    const rawSum = subjects.reduce((acc, s) => acc + s.qs, 0);
    let currentStart = 0;

    return subjects.map((sub, i) => {
      let count = sub.qs;
      if (rawSum !== totalQuestions && rawSum > 0) {
        count = Math.round((sub.qs / rawSum) * totalQuestions);
      }
      if (i === subjects.length - 1) {
        count = Math.max(1, totalQuestions - currentStart);
      }
      const startIdx = currentStart;
      const endIdx = Math.min(totalQuestions - 1, currentStart + count - 1);
      currentStart = endIdx + 1;

      return {
        name: sub.name,
        startIdx,
        endIdx,
        totalQs: Math.max(1, endIdx - startIdx + 1),
        marks: sub.marks
      };
    }).filter(sec => sec.totalQs > 0 && sec.startIdx <= sec.endIdx);
  }, [courseName, testDetails, questions.length]);

  const currentSection = useMemo(() => {
    return sections.find(sec => currentIndex >= sec.startIdx && currentIndex <= sec.endIdx) || sections[0];
  }, [sections, currentIndex]);

  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-xs font-bold text-slate-500">Initializing CBT Mock Exam simulator...</p>
      </div>
    );
  }

  if (error || !testDetails) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-center">
        <ShieldAlert className="h-16 w-16 text-rose-500 mb-4" />
        <h2 className="text-lg font-black text-slate-800">CBT Player Initialisation Error</h2>
        <p className="text-xs text-slate-550 max-w-md mt-2">{error || "Could not retrieve the mock test configuration details."}</p>
        <Link href="/education" className="mt-6 inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow">
          Back to Mock Tests
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || {
    id: 1,
    question: "Loading question...",
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: 0,
    hint: ""
  };
  const selectedOpt = answers[currentIndex];
  const isReviewed = !!markedForReview[currentIndex];

  // Helper values for question grid palette
  const answeredCount = Object.keys(answers).length;
  const reviewCount = Object.keys(markedForReview).filter(k => markedForReview[Number(k)]).length;
  const notAnsweredCount = questions.length - answeredCount;

  // Question palette indicator styles
  const getPaletteStyle = (idx: number) => {
    const isAns = answers[idx] !== undefined;
    const isRev = markedForReview[idx] === true;
    const isVis = visited[idx] === true;
    const isAct = currentIndex === idx;

    if (isAct) {
      return "border-emerald-500 bg-emerald-500/10 text-emerald-650 ring-1 ring-emerald-500 font-extrabold shadow-sm";
    }
    if (isRev) {
      return "bg-indigo-600 text-white border-indigo-600";
    }
    if (isAns) {
      return "bg-emerald-600 text-white border-emerald-600";
    }
    if (isVis) {
      return "bg-rose-600 text-white border-rose-600";
    }
    return "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500";
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white select-none flex flex-col font-sans">
      
      {/* 1. CONSENT / INSTRUCTION SCREEN */}
      {isConsentScreen ? (
        <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full p-6 sm:p-8 space-y-6">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <span className="inline-block text-[10px] font-black uppercase text-emerald-805 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                  CBT Candidate Instruction Portal
                </span>
                <h1 className="text-xl font-black text-slate-900 mt-1">{testDetails.name}</h1>
                <p className="text-xs text-slate-505 font-semibold mt-0.5">Please review the test pattern instructions before beginning.</p>
              </div>
              <button 
                onClick={() => router.back()} 
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 p-2.5 transition active:scale-[0.98] cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Test Pattern details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border p-4.5 rounded-2xl text-left text-xs font-semibold">
              <div className="space-y-1">
                <span className="block text-slate-400 font-extrabold text-[10px] uppercase">Exam Type</span>
                <span className="block text-slate-900 font-bold">{testDetails.type}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-slate-400 font-extrabold text-[10px] uppercase">Total Questions</span>
                <span className="block text-slate-900 font-bold">{testDetails.qs} MCQs</span>
              </div>
              <div className="space-y-1">
                <span className="block text-slate-400 font-extrabold text-[10px] uppercase">Maximum Marks</span>
                <span className="block text-slate-900 font-bold">{testDetails.marks} Marks</span>
              </div>
              <div className="space-y-1">
                <span className="block text-slate-400 font-extrabold text-[10px] uppercase">Duration</span>
                <span className="block text-slate-900 font-bold">{testDetails.duration} Minutes</span>
              </div>
            </div>

            {/* Subject / Section Breakdown Table */}
            {(() => {
              const subjects = getCourseSubjects(courseName || testDetails.name);
              const isFullMock = !testDetails.name.toLowerCase().includes("chapter");
              const marksPerQ = (testDetails.marks / (testDetails.qs || 1));
              const negMark = marksPerQ * 0.25;

              return (
                <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      Sectional Pattern & Question Distribution
                    </h3>
                    <span className="text-[10px] font-extrabold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                      {testDetails.qs} Questions • {testDetails.marks} Marks • {testDetails.duration} Min
                    </span>
                  </div>

                  <div className="overflow-hidden border border-slate-200 rounded-xl bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Subject / Section</th>
                          <th className="py-2.5 px-4 text-center">Questions</th>
                          <th className="py-2.5 px-4 text-center">Marks</th>
                          <th className="py-2.5 px-4 text-center">Marks Per Q</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {isFullMock && subjects.length > 0 ? (
                          subjects.map((sub, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                                <span className="h-5 w-5 rounded bg-emerald-50 text-emerald-700 font-black text-[10px] flex items-center justify-center shrink-0 border border-emerald-200/50">
                                  {idx + 1}
                                </span>
                                {sub.name}
                              </td>
                              <td className="py-2.5 px-4 text-center font-bold text-slate-800">{sub.qs}</td>
                              <td className="py-2.5 px-4 text-center font-bold text-emerald-600">{sub.marks}</td>
                              <td className="py-2.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                                +{(sub.marks / (sub.qs || 1)).toFixed(sub.marks % sub.qs === 0 ? 0 : 2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-4 font-bold text-slate-900">
                              {testDetails.name}
                            </td>
                            <td className="py-2.5 px-4 text-center font-bold text-slate-800">{testDetails.qs}</td>
                            <td className="py-2.5 px-4 text-center font-bold text-emerald-600">{testDetails.marks}</td>
                            <td className="py-2.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                              +{marksPerQ.toFixed(marksPerQ % 1 === 0 ? 0 : 2)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-slate-50/90 font-black text-slate-900 border-t border-slate-200 text-xs">
                        <tr>
                          <td className="py-2.5 px-4 font-extrabold text-slate-900">Total</td>
                          <td className="py-2.5 px-4 text-center text-slate-900">{testDetails.qs} Qs</td>
                          <td className="py-2.5 px-4 text-center text-emerald-700">{testDetails.marks} Marks</td>
                          <td className="py-2.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                            -{negMark.toFixed(negMark % 1 === 0 ? 0 : 2)} Wrong
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Rules Content */}
            <div className="bg-white border rounded-2xl p-5 space-y-4 text-xs font-semibold text-slate-600 leading-8 overflow-y-auto max-h-[360px] scrollbar-thin">
              <h3 className="text-sm font-black text-slate-900 border-b pb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-emerald-650" />
                General Examination Guidelines & Navigation:
              </h3>
              <p>1. The clock will be set at the server. The countdown timer at the top right of the screen displays remaining time available to complete the test.</p>
              <p>2. The Question Palette on the right side indicates status with color tags: Not Visited (Gray), Visited (Red), Answered (Green), Marked for Review (Purple).</p>
              <p>3. <strong>Scoring Scheme</strong>: Each correct question awards standard marks. Negative marking applies where specified.</p>
              <p>4. To select an option, click on the answer button. To change your response, click another option or click <strong>Clear Response</strong>.</p>
              <p>5. Click <strong>Save & Next</strong> to confirm your answer and proceed to the next question.</p>
            </div>
          </div>

          {/* Agreement Checkbox and Start CTA */}
          <div className="bg-slate-50 border p-5 rounded-2xl space-y-4">
            <label className="flex items-start gap-3 cursor-pointer text-left">
              <input 
                type="checkbox" 
                checked={isAgreed} 
                onChange={(e) => setIsAgreed(e.target.checked)} 
                className="mt-1 h-4 w-4 border rounded text-emerald-650 focus:ring-emerald-500 cursor-pointer"
              />
              <span className={`text-xs font-semibold ${isLocalhost ? "select-text" : "select-none"} leading-relaxed`}>
                I have read and understood all instructions. I declare that I am not in possession of any calculator, mobile, or reference material. I agree to begin the CBT mock test.
              </span>
            </label>

            <div className="flex justify-between items-center gap-4">
              <button 
                onClick={() => router.back()} 
                className="px-6 py-3 bg-transparent border hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs uppercase transition active:scale-[0.98] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={startTest}
                disabled={!isAgreed}
                className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white font-black rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] cursor-pointer border-none shadow-md shadow-emerald-700/10"
              >
                I am ready to begin
              </button>
            </div>
          </div>
        </div>
      ) : (
        
        // 2. CBT INTERACTIVE PLAYER VIEW
        <div className={`flex-1 flex flex-col justify-between ${isLocalhost ? "select-text" : "select-none"} h-screen overflow-hidden`}>
          
          {/* Top Header Bar */}
          <header className="border-b bg-white px-5 py-2.5 flex items-center justify-between shadow-2xs z-10 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-mono bg-emerald-700 text-white px-2.5 py-1 rounded-md text-[11px] font-black tracking-widest uppercase shadow-xs">
                CBT MOCK EXAM
              </span>
              <div>
                <span className="text-[13px] font-black text-slate-900 truncate max-w-xs md:max-w-md block">
                  {testDetails.name}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {courseName || "General Practice Test Series"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Candidate Quick info */}
              <div className="hidden sm:flex items-center gap-3 pr-2 border-r border-slate-200">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-xs">
                  {studentProfile?.name ? studentProfile.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                </div>
                <div className="text-left text-xs">
                  <span className="block font-bold text-slate-800 leading-none">{studentProfile?.name || "Candidate"}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Roll: {rollNo}</span>
                </div>
              </div>

              {/* Timer Countdown */}
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-4 py-1.5 text-rose-700">
                <Clock className="h-4.5 w-4.5 animate-pulse text-rose-650" />
                <span className="font-black font-mono text-[13px]">{formatTime(timeLeft)}</span>
              </div>

              <button 
                onClick={toggleFullscreen} 
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer border-none bg-transparent"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
              </button>
            </div>
          </header>

          {/* Sub Header Section Navigation Tabs */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-1.5 flex items-center justify-between gap-3 text-xs font-semibold shrink-0 overflow-x-auto">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Sections:</span>
              {sections.map((sec, sIdx) => {
                const isActiveSec = currentSection?.name === sec.name;
                const secAnswered = Object.keys(answers).filter(k => {
                  const num = Number(k);
                  return num >= sec.startIdx && num <= sec.endIdx;
                }).length;

                return (
                  <button
                    key={sIdx}
                    onClick={() => {
                      setCurrentIndex(sec.startIdx);
                      setVisited(prev => ({ ...prev, [sec.startIdx]: true }));
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer border ${
                      isActiveSec
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                        : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <span>{sec.name}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      isActiveSec ? "bg-emerald-800 text-emerald-100" : "bg-slate-100 text-slate-600"
                    }`}>
                      {secAnswered}/{sec.totalQs} Qs
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded text-[10px] uppercase shrink-0 border border-emerald-200">
              {currentSection?.name || "Active Section"}
            </span>
          </div>

          {/* Main Area Body Container */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT COLUMN: Question Details Area (80% width) */}
            <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 scrollbar-thin">
              
              {/* Question card */}
              <div className="space-y-6">
                
                {/* Header row: Index, Section & Language */}
                <div className="flex items-center justify-between border-b pb-3.5 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-650 font-black text-xs">
                      {currentIndex + 1}
                    </span>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Question No. {currentIndex + 1}</h3>
                      {currentSection && (
                        <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                          <span className="text-slate-400 font-semibold uppercase text-[10px]">Subject:</span>
                          <span className="font-extrabold">{currentSection.name}</span>
                          <span className="text-slate-400 font-medium">(Q{currentSection.startIdx + 1} - Q{currentSection.endIdx + 1} • {currentSection.totalQs} Questions)</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Copy Question Button (Local Development Mode) */}
                    {isLocalhost && (
                      <button
                        onClick={handleCopyQuestion}
                        className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition active:scale-[0.98] cursor-pointer shadow-2xs"
                        title="Click to copy question and options to clipboard"
                      >
                        {copiedQ ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-amber-700" />
                            <span>Copy Q (Local)</span>
                          </>
                        )}
                      </button>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-slate-505 font-bold">
                      <span>Select Language:</span>
                      <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-bold bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                    <span className="text-slate-400 font-bold text-xs hover:text-rose-500 transition cursor-pointer">Report</span>
                  </div>
                </div>

                {/* Question body text */}
                <div className={`space-y-5 text-sm font-semibold text-slate-800 leading-relaxed font-sans text-left ${isLocalhost ? "select-text" : "select-none"}`}>
                  <p className="font-black text-slate-955 text-base leading-snug">
                    {language === "Hindi" 
                      ? translateTextToHindi(currentQ.question)
                      : currentQ.question}
                  </p>
                  
                  {/* Option inputs */}
                  <div className="grid gap-3.5 max-w-2xl pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isChecked = selectedOpt === optIdx;
                      const isCorrect = optIdx === currentQ.answer;

                      let optionClass = "";
                      if (isReviewed) {
                        if (isCorrect) {
                          optionClass = "correct-option font-bold ring-1 ring-green-600/15";
                        } else {
                          optionClass = "incorrect-option ring-1 ring-red-500/15";
                        }
                      } else {
                        optionClass = isChecked
                           ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold ring-1 ring-emerald-600/15"
                           : "border-slate-200 hover:border-slate-350 bg-white text-slate-650";
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => !isReviewed && handleSelectOption(optIdx)}
                          disabled={isReviewed}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between outline-none ${
                            isReviewed ? "cursor-not-allowed" : "cursor-pointer"
                          } ${optionClass} ${isLocalhost ? "select-text" : "select-none"}`}
                        >
                          <span className={isLocalhost ? "select-text" : ""}>{optIdx + 1}. {language === "Hindi" ? translateOptionToHindi(opt) : opt}</span>
                          {isReviewed ? (
                            isCorrect ? (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white shrink-0">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </span>
                            ) : (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shrink-0">
                                <X className="h-3.5 w-3.5" />
                              </span>
                            )
                          ) : (
                            <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                              isChecked 
                                ? "border-emerald-600 text-emerald-600" 
                                : "border-slate-300"
                            }`}>
                              {isChecked && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Bottom footer button panel */}
              <div className="border-t pt-5 flex flex-wrap items-center justify-between gap-4 mt-8 shrink-0">
                <div className="flex gap-3">
                  <button 
                    onClick={handleReviewCurrentQuestion}
                    disabled={isReviewed}
                    className="px-5 py-3 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-750 font-bold rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Review
                  </button>
                  <button 
                    onClick={clearResponse}
                    disabled={isReviewed}
                    className="px-5 py-3 bg-white border hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] cursor-pointer"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleBack}
                    disabled={currentIndex === 0}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] cursor-pointer border-none"
                  >
                    Back
                  </button>
                  {currentIndex < questions.length - 1 ? (
                    <button 
                      onClick={handleNext}
                      className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] cursor-pointer border-none shadow-md shadow-emerald-700/10"
                    >
                      Save & Next
                    </button>
                  ) : (
                    <button 
                      onClick={confirmSubmitTest}
                      className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] cursor-pointer border-none shadow"
                    >
                      Final Submit Test
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Question Palette & Candidate Details (20% width) */}
            <div className="w-80 border-l border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between h-full overflow-hidden shrink-0 select-none">
              
              {/* Scrollable upper area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                
                {/* Candidate details card */}
                <div className="flex items-center gap-3 bg-white border p-3 rounded-xl">
                  <div className="h-11 w-11 rounded-lg bg-slate-100 border flex items-center justify-center text-slate-450 shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5 max-w-[170px]">
                    <h4 className="text-xs font-black text-slate-900 truncate leading-snug">
                      {studentProfile?.name || "Student"}
                    </h4>
                    <p className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100/50 px-2 py-0.5 rounded inline-block">
                      Candidate
                    </p>
                  </div>
                </div>

                {/* Grid palette details with Subjects */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Question Palette
                    </h4>
                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {questions.length} Questions
                    </span>
                  </div>

                  {/* Subject Sections Selector List */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Subjects & Question Distribution:
                    </div>
                    {sections.map((sec, sIdx) => {
                      const isCurrent = currentSection?.name === sec.name;
                      const secAnswered = Object.keys(answers).filter(k => {
                        const num = Number(k);
                        return num >= sec.startIdx && num <= sec.endIdx;
                      }).length;

                      return (
                        <button
                          key={sIdx}
                          onClick={() => {
                            setCurrentIndex(sec.startIdx);
                            setVisited(prev => ({ ...prev, [sec.startIdx]: true }));
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                            isCurrent
                              ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 ring-1 ring-emerald-500/20 shadow-xs"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div className="space-y-0.5 truncate pr-2">
                            <div className="text-[11px] font-black truncate">{sec.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold">
                              Q{sec.startIdx + 1} - Q{sec.endIdx + 1} ({sec.totalQs} Questions)
                            </div>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-md shrink-0 ${
                            isCurrent ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}>
                            {secAnswered}/{sec.totalQs}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Section Question Number Palette */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span className="truncate">{currentSection?.name}</span>
                      <span className="text-slate-400 font-mono text-[10px] shrink-0">
                        {currentSection?.totalQs} Qs
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                      {questions
                        .slice(currentSection?.startIdx ?? 0, (currentSection?.endIdx ?? questions.length - 1) + 1)
                        .map((_, relativeIdx) => {
                          const actualIdx = (currentSection?.startIdx ?? 0) + relativeIdx;
                          return (
                            <button
                              key={actualIdx}
                              onClick={() => {
                                setCurrentIndex(actualIdx);
                                setVisited(prev => ({ ...prev, [actualIdx]: true }));
                              }}
                              className={`h-8 w-full rounded-lg border text-xs font-black transition flex items-center justify-center cursor-pointer outline-none ${getPaletteStyle(actualIdx)}`}
                            >
                              {actualIdx + 1}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>

              </div>

              {/* Fixed bottom area */}
              <div className="mt-4 shrink-0 space-y-3">
                {/* Analysis scorecard summary box */}
                <div className="bg-white border rounded-xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between border-b pb-1">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-600 truncate">
                      {currentSection?.name || "Test Summary"}
                    </h4>
                    <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">
                      Active Section
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600 shrink-0" />
                        <span className="text-[11px]">Section Answered</span>
                      </div>
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {Object.keys(answers).filter(k => {
                          const n = Number(k);
                          return currentSection ? (n >= currentSection.startIdx && n <= currentSection.endIdx) : true;
                        }).length} / {currentSection?.totalQs || questions.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-xs bg-rose-600 shrink-0" />
                        <span className="text-[11px]">Section Remaining</span>
                      </div>
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {(currentSection?.totalQs || questions.length) - Object.keys(answers).filter(k => {
                          const n = Number(k);
                          return currentSection ? (n >= currentSection.startIdx && n <= currentSection.endIdx) : true;
                        }).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-xs bg-indigo-600 shrink-0" />
                        <span className="text-[11px]">Section Reviewed</span>
                      </div>
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {Object.keys(markedForReview).filter(k => {
                          const n = Number(k);
                          const inSec = currentSection ? (n >= currentSection.startIdx && n <= currentSection.endIdx) : true;
                          return inSec && markedForReview[n];
                        }).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Test Button */}
                <button 
                  onClick={confirmSubmitTest}
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] cursor-pointer border-none shadow-md shadow-rose-700/10 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  Final Submit Test
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
