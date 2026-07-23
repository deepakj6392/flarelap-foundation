"use client";

import { useEffect, useState, useRef } from "react";
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
  Loader2
} from "lucide-react";
import Swal from "sweetalert2";
import { translateTextToHindi, translateOptionToHindi } from "@/lib/translator";


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

        const dbTests = courseData.course?.testSeries || [];
        let testItem = dbTests.find((t: any) => 
          t.id.toString() === testIdStr || 
          t.id.toString() === testIdStr.replace(/^fmt-/, "").replace(/^ch-/, "")
        );

        if (!testItem) {
          const numericId = parseInt(testIdStr.replace(/\D/g, ""), 10) || 1;
          const isFullMock = testIdStr.toLowerCase().includes("fmt") || testIdStr.toLowerCase().includes("full");
          const courseTitle = courseData.course?.name || "Mock Test Series";
          
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
        const mcqRes = await fetch(`/api/student/mcqs?courseId=${courseIdStr}`, {
          headers: { "Authorization": `Bearer ${studentToken}` }
        });
        if (!mcqRes.ok) throw new Error("Failed to load mock exam questions.");
        const mcqData = await mcqRes.json();
        const dbMcqs: MCQQuestion[] = mcqData.courseMcqs || [];

        // Dynamic fallbacks if course has no seeded MCQs
        const fallbackMcqs: MCQQuestion[] = [
          {
            id: 1,
            question: "Which keyword is used to declare a block-scoped variable in JavaScript?",
            options: ["var", "let", "const", "both let and const"],
            answer: 3,
            hint: "let and const were introduced in ES6 for block-scoping, unlike var which is function-scoped."
          },
          {
            id: 2,
            question: "Which of the following is not a valid CSS display property value?",
            options: ["block", "inline-flex", "grid", "float"],
            answer: 3,
            hint: "float is a positioning property, not a display property value."
          },
          {
            id: 3,
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Transfer Modulated Link", "Hyper Text Multi Line"],
            answer: 0,
            hint: "HTML stands for Hyper Text Markup Language."
          },
          {
            id: 4,
            question: "Which database system is natively object-relational and fully supported by Prisma?",
            options: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
            answer: 2,
            hint: "PostgreSQL is a powerful, open-source object-relational database system."
          },
          {
            id: 5,
            question: "Which React hook is used to handle side-effects in functional components?",
            options: ["useState", "useEffect", "useContext", "useReducer"],
            answer: 1,
            hint: "useEffect is standard for side-effects like fetching data, subscriptions, and DOM updates."
          }
        ];

        const baseQuestions = dbMcqs.length > 0 ? dbMcqs : fallbackMcqs;

        // Deterministically shuffle questions and options based on details.id (test ID)
        const seed = details.id || 12345;
        const rng = createPRNG(seed);

        // Shuffle base questions first
        const shuffledBase = [...baseQuestions];
        for (let i = shuffledBase.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          const temp = shuffledBase[i];
          shuffledBase[i] = shuffledBase[j];
          shuffledBase[j] = temp;
        }

        const paddedQuestions: MCQQuestion[] = [];
        for (let i = 0; i < details.qs; i++) {
          const baseQ = shuffledBase[i % shuffledBase.length];
          
          // Pair options with their original index to trace correct answer
          const mappedOpts = baseQ.options.map((opt, idx) => ({ opt, originalIdx: idx }));
          
          // Shuffle options using rng
          for (let j = mappedOpts.length - 1; j > 0; j--) {
            const k = Math.floor(rng() * (j + 1));
            const temp = mappedOpts[j];
            mappedOpts[j] = mappedOpts[k];
            mappedOpts[k] = temp;
          }

          const newOptions = mappedOpts.map(x => x.opt);
          const newAnswer = mappedOpts.findIndex(x => x.originalIdx === baseQ.answer);

          paddedQuestions.push({
            id: i + 1,
            question: baseQ.question,
            options: newOptions,
            answer: newAnswer >= 0 ? newAnswer : baseQ.answer,
            hint: baseQ.hint || ""
          });
        }
        setQuestions(paddedQuestions);
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
          duration: stats.duration
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

  const currentQ = questions[currentIndex];
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

            {/* Rules Content */}
            <div className="bg-white border rounded-2xl p-5 space-y-4 text-xs font-semibold text-slate-600 leading-8 overflow-y-auto max-h-[360px] scrollbar-thin">
              <h3 className="text-sm font-black text-slate-900 border-b pb-2">General Instructions:</h3>
              <p>1. The clock will be set at the server. The countdown timer at the top right of screen will display the remaining time available for you to complete the examination.</p>
              <p>2. The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</p>
              <div className="grid gap-2 sm:grid-cols-2 pl-4 py-2">
                <div className="flex items-center gap-2"><span className="h-4 w-4 rounded bg-slate-100 border flex items-center justify-center text-[8px] text-slate-450">1</span> Not visited yet</div>
                <div className="flex items-center gap-2"><span className="h-4 w-4 rounded bg-rose-600 text-white flex items-center justify-center text-[8px]">2</span> Visited but not answered</div>
                <div className="flex items-center gap-2"><span className="h-4 w-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[8px]">3</span> Answered question</div>
                <div className="flex items-center gap-2"><span className="h-4 w-4 rounded bg-indigo-600 text-white flex items-center justify-center text-[8px]">4</span> Marked for review</div>
              </div>
              <p>3. **Negative Marking Scheme**: Each correct response grants **+2.00 marks**. In accordance with standard guidelines, incorrect attempts will attract a penalty of **-0.50 marks** (-25% negative marking).</p>
              <p>4. To select your answer, click on the option radio button. To deselect, click **Clear Response**.</p>
              <p>5. Do not close the browser window or exit full-screen mode, or your attempt may be locked.</p>
            </div>

          </div>

          {/* Consent Checkbox and Start button */}
          <div className="border-t pt-5 flex flex-col gap-4">
            <label className="flex items-start gap-3 cursor-pointer text-slate-700">
              <input 
                type="checkbox" 
                checked={isAgreed} 
                onChange={(e) => setIsAgreed(e.target.checked)} 
                className="mt-1 h-4 w-4 border rounded text-emerald-650 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-semibold select-none leading-relaxed">
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
        <div className="flex-1 flex flex-col justify-between select-none h-screen overflow-hidden">
          
          {/* Top Header Bar */}
          <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs font-semibold shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="flex items-center gap-1">
                <Image src="/logo.png" alt="Logo" width={28} height={28} className="h-7 w-7 rounded-full object-contain" />
                <span className="font-black text-slate-800 text-sm tracking-tight">flarelap</span>
              </div>
              <div className="h-5 w-px bg-slate-200" />
              <h2 className="font-black text-slate-900 text-sm max-w-sm sm:max-w-md lg:max-w-xl truncate">
                {testDetails.name}
              </h2>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase">Roll Number</div>
                <div className="font-bold text-slate-900 mt-0.5">{rollNo}</div>
              </div>

              <div className="h-5 w-px bg-slate-200" />

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

          {/* Sub Header Links Banner */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-1.5 flex items-center justify-between text-[10px] font-black uppercase text-slate-500 tracking-wider shrink-0">
            <div className="flex gap-4">
              <span className="hover:text-emerald-700 transition cursor-pointer">Symbols</span>
              <span>•</span>
              <span className="hover:text-emerald-700 transition cursor-pointer">Instructions</span>
              <span>•</span>
              <span className="hover:text-emerald-700 transition cursor-pointer">Overall Test Summary</span>
            </div>
            <span className="bg-emerald-600 text-white font-extrabold px-3 py-0.5 rounded text-[9px]">PART A</span>
          </div>

          {/* Main Area Body Container */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* LEFT COLUMN: Question Details Area (80% width) */}
            <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 scrollbar-thin">
              
              {/* Question card */}
              <div className="space-y-6">
                
                {/* Header row: Index & Language */}
                <div className="flex items-center justify-between border-b pb-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-650 font-black text-xs">
                      {currentIndex + 1}
                    </span>
                    <h3 className="font-black text-slate-900 text-sm">Question No. {currentIndex + 1}</h3>
                  </div>

                  <div className="flex items-center gap-4">
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
                <div className="space-y-5 text-sm font-semibold text-slate-800 leading-relaxed font-sans text-left">
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
                          } ${optionClass}`}
                        >
                          <span>{optIdx + 1}. {language === "Hindi" ? translateOptionToHindi(opt) : opt}</span>
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
            <div className="w-72 border-l border-slate-200 bg-slate-50/50 p-4.5 flex flex-col justify-between h-full overflow-hidden shrink-0 select-none">
              
              {/* Scrollable upper area */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-thin">
                
                {/* Candidate details card */}
                <div className="flex items-center gap-3 bg-white border p-3 rounded-xl">
                  <div className="h-12 w-12 rounded-lg bg-slate-100 border flex items-center justify-center text-slate-450 shrink-0">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="space-y-0.5 max-w-[155px]">
                    <h4 className="text-xs font-black text-slate-900 truncate leading-snug">
                      {studentProfile?.name || "Student"}
                    </h4>
                    <p className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100/50 px-2 py-0.5 rounded inline-block">
                      Candidate
                    </p>
                  </div>
                </div>

                {/* Grid palette details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 border-b pb-1.5">
                    Question Palette
                  </h4>
                  <div className="grid grid-cols-4 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {questions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setVisited(prev => ({ ...prev, [idx]: true }));
                        }}
                        className={`h-8 w-full rounded-lg border text-xs font-black transition flex items-center justify-center cursor-pointer outline-none ${getPaletteStyle(idx)}`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Fixed bottom area */}
              <div className="mt-6 shrink-0 space-y-4">
                {/* Analysis scorecard summary box */}
                <div className="bg-white border rounded-xl p-3.5 space-y-3.5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 border-b pb-1.5 text-center">
                    PART-A Analysis
                  </h4>
                  <div className="space-y-2 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-emerald-600" />
                        <span>Answered</span>
                      </div>
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">{answeredCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-rose-600" />
                        <span>Not Answered</span>
                      </div>
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">{notAnsweredCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-indigo-600" />
                        <span>Reviewed</span>
                      </div>
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">{reviewCount}</span>
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
