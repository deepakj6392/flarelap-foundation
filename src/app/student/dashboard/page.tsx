"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { siteConfig } from "@/constants/site";
import { 
  BookOpen, 
  HelpCircle, 
  User, 
  LogOut, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  Menu,
  Sun,
  Moon,
  LayoutDashboard,
  ShieldCheck,
  History,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Swal from "sweetalert2";

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  student_id: string;
  created_at: string;
}

interface StudyMaterial {
  id: number;
  subject: string;
  title: string;
  readTime: string;
  content: string;
}

interface Activity {
  id: number;
  type: "lesson" | "quiz" | "login";
  title: string;
  timestamp: string;
}

// Mock study topics
const STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 1,
    subject: "Web Development",
    title: "Introduction to HTML5 & Semantic Web",
    readTime: "8 mins read",
    content: "HTML5 is the latest version of Hypertext Markup Language, the code that describes web pages. It consists of semantic elements like <header>, <nav>, <main>, <section>, <article>, and <footer>. Using semantic tags improves SEO, document accessibility for screen readers, and layout readability for developer teams. In HTML5, you also have modern APIs like LocalStorage, SessionStorage, Canvas drawing, and Geolocation tags directly in the browser.",
  },
  {
    id: 2,
    subject: "Web Development",
    title: "CSS3 Flexbox and Layout Systems",
    readTime: "10 mins read",
    content: "CSS Flexible Box Layout (Flexbox) is a 1-dimensional layout model for arranging items in rows or columns. By setting display: flex on a parent element, it becomes a flex container. Children elements automatically become flex items. Flexbox allows items to grow to fill unused space or shrink to prevent overflow. Key properties include justify-content (aligns items along the main axis) and align-items (aligns items along the cross axis).",
  },
  {
    id: 3,
    subject: "Computer Science",
    title: "Introduction to Databases & SQL Keys",
    readTime: "12 mins read",
    content: "A database is an organized collection of data stored electronically. Relational databases store records in tables with rows and columns, structured by SQL (Structured Query Language). A primary key is a field that uniquely identifies each record in a table. A foreign key is a field that links records in two different tables. Normalization is the process of structuring a database to reduce data redundancy and improve data integrity.",
  },
  {
    id: 4,
    subject: "English Grammar",
    title: "Active vs. Passive Voice Rules",
    readTime: "6 mins read",
    content: "In active voice, the subject of the sentence performs the action (e.g., 'The student wrote the quiz'). In passive voice, the subject receives the action (e.g., 'The quiz was written by the student'). Use active voice for strong, direct writing, and passive voice when the performer of the action is unknown or when emphasizing the action itself rather than the actor.",
  }
];

// Mock MCQs
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlink and Text Managing Language",
      "Home Tool Markup Language"
    ],
    answer: 0,
    hint: "It is the standard markup language for creating web pages."
  },
  {
    id: 2,
    question: "Which HTML5 tag is used to specify a footer for a document or section?",
    options: [
      "<bottom>",
      "<section-footer>",
      "<footer>",
      "<foot>"
    ],
    answer: 2,
    hint: "It has the same name as the footer layout tag."
  },
  {
    id: 3,
    question: "Which CSS property is used to change the text color of an element?",
    options: [
      "font-color",
      "color",
      "text-color",
      "background-color"
    ],
    answer: 1,
    hint: "It is a single 5-letter word."
  },
  {
    id: 4,
    question: "Which SQL command is used to retrieve data from a database?",
    options: [
      "GET",
      "FETCH",
      "SELECT",
      "EXTRACT"
    ],
    answer: 2,
    hint: "It is used in queries like '_____ * FROM users'."
  },
  {
    id: 5,
    question: "Which of the following is passive voice?",
    options: [
      "She designed the website.",
      "The website was designed by her.",
      "They are designing websites.",
      "She designs websites."
    ],
    answer: 1,
    hint: "The receiver of the action (website) is the subject of the sentence."
  }
];

export default function StudentDashboardPage() {
  const router = useRouter();

  // Mounting state to prevent Next.js hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Initialize states directly from localStorage synchronously to avoid cascading renders
  const [student] = useState<StudentProfile | null>(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("student_user");
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<"overview" | "materials" | "quiz" | "profile">("overview");

  // UI structure control states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [studyPortalOpen, setStudyPortalOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(true);
  
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("student_theme");
      return (storedTheme === "dark" || storedTheme === "light") ? storedTheme : "light";
    }
    return "light";
  });

  // Study notes drawer state
  const [selectedNote, setSelectedNote] = useState<StudyMaterial | null>(null);

  // Persistent tracking state: read lesson IDs
  const [readLessons, setReadLessons] = useState<number[]>(() => {
    if (typeof window !== "undefined" && student) {
      const stored = localStorage.getItem(`student_read_lessons_${student.student_id}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Persistent quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number>(() => {
    if (typeof window !== "undefined" && student) {
      const stored = localStorage.getItem(`student_quiz_score_${student.student_id}`);
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(() => {
    if (typeof window !== "undefined" && student) {
      return localStorage.getItem(`student_quiz_submitted_${student.student_id}`) === "true";
    }
    return false;
  });

  // Persistent activities log
  const [activities, setActivities] = useState<Activity[]>(() => {
    if (typeof window !== "undefined" && student) {
      const stored = localStorage.getItem(`student_activities_${student.student_id}`);
      if (stored) return JSON.parse(stored);
      
      return [
        {
          id: 1,
          type: "login",
          title: "Logged in successfully to Scholar Console",
          timestamp: "Just now"
        }
      ];
    }
    return [];
  });

  // Profile update states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Set mounted state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Auth Guard
  useEffect(() => {
    if (mounted) {
      const token = localStorage.getItem("student_token");
      if (!token || !student) {
        localStorage.clear();
        router.push("/student/login");
      }
    }
  }, [router, student, mounted]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("student_theme", nextTheme);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/student/login");
  };

  // Activity logger helper
  const saveActivity = (newAct: Activity) => {
    setActivities(prev => {
      const updated = [newAct, ...prev].slice(0, 10); // keep last 10 logs
      localStorage.setItem(`student_activities_${student?.student_id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Study note read handler
  const handleMarkAsRead = (lessonId: number) => {
    if (!student) return;
    if (!readLessons.includes(lessonId)) {
      const updated = [...readLessons, lessonId];
      setReadLessons(updated);
      localStorage.setItem(`student_read_lessons_${student.student_id}`, JSON.stringify(updated));
      
      saveActivity({
        id: Date.now(),
        type: "lesson",
        title: `Read Lesson: ${STUDY_MATERIALS.find(m => m.id === lessonId)?.title || "Lesson"}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " | " + new Date().toLocaleDateString()
      });
    }
  };

  // Quiz helper handlers
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleCalculateScore = () => {
    if (!student) return;
    if (Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length) {
      Swal.fire({
        title: "Incomplete Quiz",
        text: "Please answer all multiple-choice questions before submitting.",
        icon: "warning",
        confirmButtonColor: "#047857"
      });
      return;
    }

    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (quizAnswers[q.id] === q.answer) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    localStorage.setItem(`student_quiz_score_${student.student_id}`, score.toString());
    localStorage.setItem(`student_quiz_submitted_${student.student_id}`, "true");

    saveActivity({
      id: Date.now(),
      type: "quiz",
      title: `Finished Mock Exam - Score ${score}/${QUIZ_QUESTIONS.length}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " | " + new Date().toLocaleDateString()
    });

    Swal.fire({
      title: "Quiz Completed!",
      text: `You scored ${score} out of ${QUIZ_QUESTIONS.length}!`,
      icon: score >= 4 ? "success" : "info",
      confirmButtonColor: "#047857"
    });
  };

  const handleResetQuiz = () => {
    if (!student) return;
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    localStorage.removeItem(`student_quiz_score_${student.student_id}`);
    localStorage.removeItem(`student_quiz_submitted_${student.student_id}`);

    saveActivity({
      id: Date.now(),
      type: "quiz",
      title: "Reset Interactive Mock Exam",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " | " + new Date().toLocaleDateString()
    });
  };

  // Profile password change handler
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setProfileError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setProfileError("New passwords do not match.");
      return;
    }

    setProfileLoading(true);
    try {
      const token = localStorage.getItem("student_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      
      const res = await fetch(`${apiUrl}/api/auth/student/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      setProfileSuccess("Your password has been changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An error occurred while changing password.";
      setProfileError(errMsg);
    } finally {
      setProfileLoading(false);
    }
  };

  // Return server/hydration-safe loading skeleton initially
  if (!mounted || !student) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 text-slate-800 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
          <p className="text-xs font-semibold text-slate-500">Loading Student Console...</p>
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";
  const bgMain = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800";
  const bgSidebar = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg";
  const textHeading = isDark ? "text-white" : "text-slate-900";
  const bgHeader = isDark ? "bg-slate-900/40 border-slate-800" : "bg-white/80 border-slate-200 shadow-xs";
  const bgHover = isDark ? "hover:bg-slate-800/60 hover:text-white" : "hover:bg-slate-100 hover:text-slate-900";

  const getTabBtnClass = (tab: "overview" | "materials" | "quiz" | "profile") => {
    const base = "flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-bold tracking-wide transition-all duration-200 outline-none cursor-pointer";
    if (activeTab === tab) {
      return isDark 
        ? `${base} bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 text-emerald-400 border border-emerald-800/40 shadow-sm shadow-emerald-950/20`
        : `${base} bg-emerald-50 text-emerald-700 border border-emerald-100/70 shadow-sm shadow-emerald-100/20`;
    }
    return `${base} text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:translate-x-1 ${bgHover}`;
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Scholar Console Overview";
      case "materials":
        return "Study Course Materials";
      case "quiz":
        return "Interactive Mock Exam";
      case "profile":
        return "Student Security Settings";
      default:
        return "Student Dashboard";
    }
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDark ? "dark" : ""} ${bgMain}`}>
      
      {/* 1. LEFT COLLAPSIBLE SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col justify-between border-r p-6 transition-all duration-300 ${bgSidebar} ${
          sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"
        } lg:static lg:translate-x-0 ${
          sidebarCollapsed ? "lg:w-0 lg:p-0 lg:border-r-0 lg:overflow-hidden lg:opacity-0" : "lg:w-72"
        }`}
      >
        <div className="space-y-8">
          {/* Logo Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 p-0.5 border border-emerald-500/30">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={38}
                  height={38}
                  className="h-8 w-8 rounded-full object-contain"
                />
              </div>
              <div>
                <h2 className={`text-sm font-black tracking-tight leading-none ${textHeading}`}>
                  Learning Portal
                </h2>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">
                  Student Console
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className={`rounded-lg p-1.5 border border-transparent transition lg:hidden ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-3" aria-label="Sidebar navigation">
            {/* Overview Link */}
            <button 
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }} 
              className={getTabBtnClass("overview")}
            >
              <LayoutDashboard className={`h-4.5 w-4.5 ${activeTab === 'overview' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>Overview</span>
            </button>

            {/* Study Portal Collapsible Menu */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/85">
              <button
                onClick={() => setStudyPortalOpen(prev => !prev)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-bold tracking-wide transition-all duration-200 outline-none text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
                  <span>Study Portal</span>
                </div>
                {studyPortalOpen ? (
                  <ChevronUp className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-550 dark:text-slate-400" />
                )}
              </button>
              
              {studyPortalOpen && (
                <div className="mt-1.5 ml-8 space-y-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
                  <button
                    onClick={() => { setActiveTab("materials"); setSidebarOpen(false); }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all duration-200 outline-none text-left cursor-pointer ${
                      activeTab === "materials"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    Study Materials
                  </button>
                  <button
                    onClick={() => { setActiveTab("quiz"); setSidebarOpen(false); }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all duration-200 outline-none text-left cursor-pointer ${
                      activeTab === "quiz"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    Practice Mock Exams
                  </button>
                </div>
              )}
            </div>

            {/* Account Settings Collapsible Menu */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/85">
              <button
                onClick={() => setAccountOpen(prev => !prev)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-bold tracking-wide transition-all duration-200 outline-none text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <User className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
                  <span>My Account</span>
                </div>
                {accountOpen ? (
                  <ChevronUp className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-550 dark:text-slate-400" />
                )}
              </button>
              
              {accountOpen && (
                <div className="mt-1.5 ml-8 space-y-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
                  <button
                    onClick={() => { setActiveTab("profile"); setSidebarOpen(false); }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all duration-200 outline-none text-left cursor-pointer ${
                      activeTab === "profile"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    Security Settings
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Sign Out Button */}
        <div className="pt-6">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-xs font-bold transition duration-200 cursor-pointer ${
              isDark 
                ? "border-red-900/40 bg-red-950/20 text-red-400 hover:bg-red-900/25"
                : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* 2. MAIN CORE CONTENT WRAPPER */}
      <div className="flex flex-1 flex-col min-w-0 font-sans">
        
        {/* Top Header Bar */}
        <header className={`sticky top-0 z-30 flex h-14 items-center justify-between px-6 py-2 backdrop-blur-md border-b transition ${bgHeader}`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(true);
                } else {
                  setSidebarCollapsed(prev => !prev);
                }
              }}
              className={`rounded-xl p-2 border transition cursor-pointer ${isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800/60' : 'border-slate-200 text-slate-600 hover:bg-slate-100 shadow-xs'}`}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className={`text-base sm:text-lg font-black capitalize tracking-tight ${textHeading}`}>
              {getPageTitle()}
            </h1>
          </div>

          {/* Header Controls and User Badge */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`rounded-xl border p-2 transition duration-200 cursor-pointer ${isDark ? 'border-slate-800 bg-slate-900 text-yellow-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 shadow-xs'}`}
            >
              {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Visual Divider */}
            <span className={`h-6 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

            {/* User Profile Badge */}
            <div className={`flex items-center gap-3 border rounded-xl pl-3 pr-4 py-1.5 shadow-sm max-w-[200px] sm:max-w-xs transition ${
              isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-400/5 border border-emerald-500/25 text-emerald-500 shadow-xs font-black text-sm">
                {student.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs font-black leading-none truncate ${textHeading}`}>
                    {student.name}
                  </p>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                </div>
                <p className="text-[9px] text-emerald-605 font-extrabold tracking-wider uppercase mt-1">
                  Active Scholar
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Child Pages Content */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {/* TAB 0: OVERVIEW HOME */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-300 font-sans">
              
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 text-white shadow-xl">
                {/* Decorative background blobs */}
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse" />
                      Scholar Console Active
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                      Welcome back, {student.name}!
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-50 font-semibold max-w-xl leading-relaxed">
                      Access your course guides, interactive mock practice tests, and study notes. Complete activities and review your performance below.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("materials")}
                    className="self-start md:self-auto shrink-0 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 px-6 py-3.5 text-xs font-black shadow-lg shadow-emerald-950/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    Explore Study Materials
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Metric 1: Study Progress */}
                <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
                  isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Course Materials
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <BookOpen className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className={`text-xl font-black ${textHeading}`}>
                      {readLessons.length} / {STUDY_MATERIALS.length}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Lessons completed</p>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${(readLessons.length / STUDY_MATERIALS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Metric 2: Exam Score */}
                <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
                  isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Mock Performance
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      <HelpCircle className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className={`text-xl font-black ${textHeading}`}>
                      {quizSubmitted ? `${quizScore} / ${QUIZ_QUESTIONS.length}` : "No attempts"}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                      {quizSubmitted ? `${Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}% Last Score` : "Test your skills now"}
                    </p>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                        style={{ width: quizSubmitted ? `${(quizScore / QUIZ_QUESTIONS.length) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Metric 3: Verified Scholar Status */}
                <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
                  isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Scholarship Status
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className={`text-sm font-black ${textHeading}`}>Active Scholar</h3>
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[9px] text-emerald-650 font-black">✓</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 select-all">
                      ID: {student.student_id}
                    </p>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-1">
                      Joined {new Date(student.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Metric 4: Next Milestone */}
                <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
                  isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Suggested Action
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className={`text-xs font-black ${textHeading} truncate`}>
                      {readLessons.length < STUDY_MATERIALS.length ? "Read Next Lesson" : (quizSubmitted ? "Update Credentials" : "Take Practice Exam")}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                      {readLessons.length < STUDY_MATERIALS.length ? "Complete study guide" : (quizSubmitted ? "Manage account credentials" : "Attempt aptitudes exam")}
                    </p>
                    <button
                      onClick={() => {
                        if (readLessons.length < STUDY_MATERIALS.length) {
                          setActiveTab("materials");
                        } else if (!quizSubmitted) {
                          setActiveTab("quiz");
                        } else {
                          setActiveTab("profile");
                        }
                      }}
                      className="text-[10.5px] font-black text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                    >
                      Go to Portal <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Panels Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Panel: Recent activity timeline logs */}
                <div className={`lg:col-span-2 rounded-2xl border p-6 ${
                  isDark ? "border-slate-800 bg-slate-900/30" : "border-slate-200 bg-white"
                }`}>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <History className="h-4.5 w-4.5 text-slate-400" />
                      <h3 className={`text-sm font-black ${textHeading}`}>Recent Console Activity</h3>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Last 10 events</span>
                  </div>

                  <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-6">
                    {activities.map((act) => (
                      <div key={act.id} className="relative group">
                        {/* Timeline dot */}
                        <div className="absolute -left-[20.5px] top-1.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-950 bg-emerald-500 group-hover:scale-110 transition-all" />
                        <div className="space-y-1">
                          <p className={`text-xs font-semibold ${textHeading}`}>{act.title}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold">{act.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel: Digital Student ID Card */}
                <div className={`rounded-2xl border p-6 flex flex-col justify-between text-center relative overflow-hidden ${
                  isDark ? "border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/40" : "border-slate-200 bg-gradient-to-b from-slate-50/80 to-white"
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Scholar Digital Pass</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">ACTIVE</span>
                    </div>
                    
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 font-black text-xl shadow-md">
                      {student.name.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <h3 className={`text-sm font-black ${textHeading}`}>{student.name}</h3>
                      <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold">{student.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-extrabold text-emerald-600 uppercase border border-emerald-500/20">
                        Verified Student
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-150 dark:border-slate-850 space-y-2 text-left text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                    <div className="flex justify-between">
                      <span>Card Holder ID:</span>
                      <span className="font-bold text-slate-600 dark:text-slate-300 select-all">{student.student_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Portal Security:</span>
                      <span className="font-bold text-slate-600 dark:text-slate-300">Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enrollment Date:</span>
                      <span className="font-bold text-slate-600 dark:text-slate-300">{new Date(student.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
          
          {/* TAB 1: STUDY MATERIALS */}
          {activeTab === "materials" && (
            <div className="space-y-6 animate-in fade-in duration-300 font-sans">
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <h2 className={`text-lg font-black ${textHeading}`}>Study Course Materials</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Read specialized study notes compiled by foundation mentors.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {STUDY_MATERIALS.map(note => (
                  <div 
                    key={note.id} 
                    onClick={() => setSelectedNote(note)}
                    className={`group border rounded-2xl p-5.5 flex flex-col justify-between transition duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                      isDark 
                        ? "border-slate-800 bg-slate-900/30 hover:border-emerald-500/30 hover:bg-slate-900/50" 
                        : "border-slate-200 bg-white hover:border-emerald-600/35"
                    }`}
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold text-emerald-600 uppercase tracking-wide">
                          {note.subject}
                        </span>
                        {readLessons.includes(note.id) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black text-emerald-600 uppercase border border-emerald-500/20">
                            Read ✓
                          </span>
                        )}
                      </div>
                      <h3 className={`text-sm font-black group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug ${textHeading}`}>
                        {note.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold line-clamp-3">
                        {note.content}
                      </p>
                    </div>

                    <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {note.readTime}
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                        Read Lesson <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MOCK EXAMS */}
          {activeTab === "quiz" && (
            <div className="space-y-6 animate-in fade-in duration-300 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
                <div>
                  <h2 className={`text-lg font-black ${textHeading}`}>Interactive Mock Exam</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Practice multiple-choice questions to validate your learning.</p>
                </div>
                {quizSubmitted && (
                  <div className="flex items-center gap-4 self-start sm:self-auto">
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
                      Score: {quizScore} / {QUIZ_QUESTIONS.length}
                    </span>
                    <button 
                      onClick={handleResetQuiz}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4.5 py-2.5 text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      Reset and Try Again
                    </button>
                  </div>
                )}
              </div>

              {/* Questions wrapper */}
              <div className="space-y-5 max-w-4xl">
                {QUIZ_QUESTIONS.map((q, qIndex) => {
                  const selectedOpt = quizAnswers[q.id];
                  const showCorrect = quizSubmitted;
                  
                  return (
                    <div key={q.id} className={`rounded-2xl border p-5 shadow-xs space-y-4 transition ${
                      isDark ? "border-slate-800 bg-slate-900/30" : "border-slate-200 bg-white"
                    }`}>
                      <div className="flex items-start gap-3.5">
                        <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-black text-emerald-600">
                          {qIndex + 1}
                        </span>
                        <h4 className={`text-sm font-black leading-snug pt-0.5 ${textHeading}`}>
                          {q.question}
                        </h4>
                      </div>

                      {/* Options Grid */}
                      <div className="grid gap-2.5 ml-10">
                        {q.options.map((opt, optIndex) => {
                          let optStyle = isDark
                            ? "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-emerald-500/30"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-650/40";
                          
                          if (selectedOpt === optIndex) {
                            optStyle = isDark
                              ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-bold"
                              : "border-emerald-600 bg-emerald-50/50 text-emerald-700 font-bold";
                          }
                          
                          // Styling overrides if submitted
                          if (showCorrect) {
                            if (optIndex === q.answer) {
                              optStyle = isDark
                                ? "border-emerald-500 bg-emerald-950/40 text-emerald-400 font-black ring-2 ring-emerald-500/20"
                                : "border-emerald-600 bg-emerald-100/50 text-emerald-800 font-black ring-2 ring-emerald-500/20";
                            } else if (selectedOpt === optIndex) {
                              optStyle = isDark
                                ? "border-red-500 bg-red-950/25 text-red-400 font-bold ring-2 ring-red-500/10"
                                : "border-red-300 bg-red-50 text-red-800 font-bold ring-2 ring-red-500/10";
                            } else {
                              optStyle = isDark
                                ? "border-slate-800 bg-slate-900/10 text-slate-600 opacity-50"
                                : "border-slate-150 bg-slate-50/40 text-slate-400 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleSelectOption(q.id, optIndex)}
                              disabled={quizSubmitted}
                              className={`w-full text-left rounded-xl border px-4.5 py-3.5 text-xs transition-all flex items-center justify-between outline-none cursor-pointer ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {showCorrect && optIndex === q.answer && (
                                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                              )}
                              {showCorrect && selectedOpt === optIndex && optIndex !== q.answer && (
                                <X className="h-4.5 w-4.5 text-red-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Hint / Explanation drawer after submit */}
                      {showCorrect && (
                        <div className={`ml-10 p-3.5 rounded-xl text-xs font-semibold border flex items-start gap-2 ${
                          isDark 
                            ? "bg-slate-900 border-slate-800/70 text-slate-400" 
                            : "bg-slate-50 border-slate-100 text-slate-600"
                        }`}>
                          <AlertCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          <p><strong>Explanation:</strong> {q.hint}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit panel */}
              {!quizSubmitted && (
                <div className="flex justify-start max-w-4xl pt-2 pl-10">
                  <button
                    onClick={handleCalculateScore}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-6 py-3.5 text-xs font-black text-white shadow-md shadow-emerald-700/10 transition active:scale-[0.98] cursor-pointer"
                  >
                    Finish Test & Submit Answers
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT PROFILE & PASSWORD */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl font-sans">
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <h2 className={`text-lg font-black ${textHeading}`}>Student Security Settings</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Configure security credentials and update account profile.</p>
              </div>

              {profileError && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-bold animate-in fade-in">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <p>{profileError}</p>
                </div>
              )}

              {profileSuccess && (
                <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 font-bold animate-in fade-in">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                  <p>{profileSuccess}</p>
                </div>
              )}

              <div className={`rounded-2xl border p-6 shadow-xs space-y-6 ${
                isDark ? "border-slate-800 bg-slate-900/30" : "border-slate-200 bg-white"
              }`}>
                <h3 className="text-xs font-extrabold border-b pb-3 uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Update Account Password
                </h3>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type={showPassword1 ? "text" : "password"}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 outline-none text-xs transition font-semibold ${
                          isDark
                            ? "border-slate-800 bg-slate-950 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            : "border-slate-200 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                        }`}
                        disabled={profileLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword1(p => !p)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-605 cursor-pointer"
                      >
                        {showPassword1 ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type={showPassword2 ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password (min 6 chars)"
                          className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 outline-none text-xs transition font-semibold ${
                            isDark
                              ? "border-slate-800 bg-slate-950 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              : "border-slate-200 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                          }`}
                          disabled={profileLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword2(p => !p)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword2 ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Lock className="h-4 w-4" />
                        </span>
                        <input
                          type={showPassword2 ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 outline-none text-xs transition font-semibold ${
                            isDark
                              ? "border-slate-800 bg-slate-950 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              : "border-slate-200 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                          }`}
                          disabled={profileLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/10 transition disabled:opacity-50 cursor-pointer"
                    >
                      {profileLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          Saving changes...
                        </>
                      ) : (
                        "Save New Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>

        {/* 4. FOOTER */}
        <footer className={`border-t py-6 text-center text-xs font-semibold text-slate-405 mt-auto transition ${
          isDark ? "bg-slate-950 border-slate-900" : "bg-white border-slate-200"
        }`}>
          <div className="max-w-7xl mx-auto px-6">
            © {new Date().getFullYear()} {siteConfig.name}. Empowering student minds globally.
          </div>
        </footer>
      </div>

      {/* 3. STUDY NOTE DETAIL DRAWER MODAL */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative space-y-4 ${
            isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
          }`}>
            <button 
              onClick={() => setSelectedNote(null)} 
              className={`absolute top-4 right-4 rounded-lg p-1.5 transition cursor-pointer ${
                isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 text-left">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold text-emerald-600 uppercase tracking-wide">
                {selectedNote.subject}
              </span>
              <h3 className={`text-sm font-black tracking-tight leading-snug ${textHeading}`}>
                {selectedNote.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-350" />
                {selectedNote.readTime}
              </p>
            </div>

            <hr className={isDark ? "border-slate-800" : "border-slate-100"} />

            <p className="text-xs text-slate-605 dark:text-slate-300 leading-relaxed font-semibold text-left select-text max-h-[300px] overflow-y-auto pr-2">
              {selectedNote.content}
            </p>

            <div className="pt-2 flex justify-between items-center">
              <div>
                {!readLessons.includes(selectedNote.id) ? (
                  <button
                    onClick={() => {
                      handleMarkAsRead(selectedNote.id);
                      Swal.fire({
                        title: "Lesson Completed!",
                        text: `"${selectedNote.title}" has been marked as read.`,
                        icon: "success",
                        confirmButtonColor: "#047857"
                      });
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold shadow-xs active:scale-[0.98] transition cursor-pointer"
                  >
                    Mark as Read ✓
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-605 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
                    Completed ✓
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs active:scale-[0.98] transition cursor-pointer ${
                  isDark ? "bg-slate-800 text-white hover:bg-slate-750" : "bg-slate-900 text-white hover:bg-slate-850"
                }`}
              >
                Close Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
