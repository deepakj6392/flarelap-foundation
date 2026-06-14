"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  User, 
  LogOut, 
  Award, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  BookMarked,
  Layers,
  ArrowRight
} from "lucide-react";
import Swal from "sweetalert2";

// Mock study topics
const STUDY_MATERIALS = [
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
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"materials" | "quiz" | "profile">("materials");

  // Study notes drawer state
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Profile update states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Auth Guard
  useEffect(() => {
    const token = localStorage.getItem("student_token");
    const userStr = localStorage.getItem("student_user");

    if (!token || !userStr) {
      router.push("/student/login");
      return;
    }

    try {
      setStudent(JSON.parse(userStr));
    } catch (_) {
      localStorage.clear();
      router.push("/student/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/student/login");
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

    Swal.fire({
      title: "Quiz Completed!",
      text: `You scored ${score} out of ${QUIZ_QUESTIONS.length}!`,
      icon: score >= 4 ? "success" : "info",
      confirmButtonColor: "#047857"
    });
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
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
    } catch (err: any) {
      setProfileError(err.message || "An error occurred while changing password.");
    } finally {
      setProfileLoading(false);
    }
  };

  if (!student) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
          <p className="text-xs font-semibold text-slate-500">Loading Student Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-6 bg-white border-b border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 p-0.5">
            <Image
              src="/logo.png"
              alt="Logo"
              width={34}
              height={34}
              className="h-7 w-7 rounded-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 leading-none">Learning Portal</h2>
            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Student Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="h-6 w-px bg-slate-200" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-red-650 hover:bg-red-100 px-3.5 py-2 text-xs font-bold transition duration-200 outline-none"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* 2. CORE LAYOUT CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-5 sm:p-6 lg:p-8 grid gap-6 md:grid-cols-[260px_1fr]">
        
        {/* Left column sidebar menus */}
        <div className="space-y-6">
          
          {/* Welcome User widget */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-lg">
              {student.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-none">{student.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-1.5 select-all">
                ID: {student.student_id || "STUDENT"}
              </p>
            </div>
            <div className="pt-2 border-t text-[10px] text-slate-450 font-bold flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" />
              Joined {new Date(student.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Navigation Tab buttons */}
          <nav className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("materials")}
              className={`flex items-center gap-3.5 w-full rounded-xl px-4 py-3 text-xs font-black tracking-wide transition ${
                activeTab === "materials" 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <BookOpen className="h-4.5 w-4.5" />
              Study Materials
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-3.5 w-full rounded-xl px-4 py-3 text-xs font-black tracking-wide transition ${
                activeTab === "quiz" 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <HelpCircle className="h-4.5 w-4.5" />
              Mock Practice Exams
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3.5 w-full rounded-xl px-4 py-3 text-xs font-black tracking-wide transition ${
                activeTab === "profile" 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User className="h-4.5 w-4.5" />
              Account Settings
            </button>
          </nav>
        </div>

        {/* Right column main panels */}
        <div className="space-y-6">
          
          {/* TAB 1: STUDY MATERIALS */}
          {activeTab === "materials" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Study Course Materials</h2>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Read specialized study notes compiled by foundation mentors.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {STUDY_MATERIALS.map(note => (
                  <div 
                    key={note.id} 
                    onClick={() => setSelectedNote(note)}
                    className="group border border-slate-200 bg-white rounded-2xl p-5 shadow-xs hover:border-emerald-600/35 transition cursor-pointer flex flex-col justify-between hover:shadow-sm"
                  >
                    <div className="space-y-3">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase">
                        {note.subject}
                      </span>
                      <h3 className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                        {note.title}
                      </h3>
                      <p className="text-[11px] text-slate-450 leading-relaxed font-semibold line-clamp-3">
                        {note.content}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-350" />
                        {note.readTime}
                      </span>
                      <span className="text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
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
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Interactive Mock Exam</h2>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Practice multiple-choice questions to validate your learning.</p>
                </div>
                {quizSubmitted && (
                  <button 
                    onClick={handleResetQuiz}
                    className="self-start sm:self-auto inline-flex items-center gap-1 rounded-xl bg-slate-900 text-white hover:bg-slate-850 px-4 py-2.5 text-xs font-bold shadow-xs transition"
                  >
                    Reset and Try Again
                  </button>
                )}
              </div>

              {/* Questions wrapper */}
              <div className="space-y-5">
                {QUIZ_QUESTIONS.map((q, qIndex) => {
                  const selectedOpt = quizAnswers[q.id];
                  const showCorrect = quizSubmitted;
                  
                  return (
                    <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-[11px] font-black text-emerald-700">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 leading-snug pt-0.5">
                          {q.question}
                        </h4>
                      </div>

                      {/* Options Grid */}
                      <div className="grid gap-2 ml-9">
                        {q.options.map((opt, optIndex) => {
                          let optStyle = "border-slate-200 bg-white text-slate-600 hover:border-emerald-600/40";
                          if (selectedOpt === optIndex) {
                            optStyle = "border-emerald-600 bg-emerald-50/50 text-emerald-700 font-bold";
                          }
                          
                          // Styling overrides if submitted
                          if (showCorrect) {
                            if (optIndex === q.answer) {
                              optStyle = "border-emerald-600 bg-emerald-100/50 text-emerald-800 font-black ring-2 ring-emerald-500/20";
                            } else if (selectedOpt === optIndex) {
                              optStyle = "border-red-300 bg-red-50 text-red-800 font-bold ring-2 ring-red-500/10";
                            } else {
                              optStyle = "border-slate-150 bg-slate-50/40 text-slate-400 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleSelectOption(q.id, optIndex)}
                              disabled={quizSubmitted}
                              className={`w-full text-left rounded-xl border px-4 py-3 text-xs transition-all flex items-center justify-between outline-none ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {showCorrect && optIndex === q.answer && (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                              )}
                              {showCorrect && selectedOpt === optIndex && optIndex !== q.answer && (
                                <X className="h-4 w-4 text-red-650 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Hint / Explanation drawer after submit */}
                      {showCorrect && (
                        <div className="ml-9 p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 font-semibold border border-slate-100 flex items-start gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <p><strong>Explanation:</strong> {q.hint}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit panel */}
              {!quizSubmitted && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleCalculateScore}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-750 hover:bg-emerald-700 px-6 py-3 text-xs font-black text-white shadow-md shadow-emerald-700/10 transition active:scale-[0.98]"
                  >
                    Finish Test & Submit Answers
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT PROFILE & PASSWORD */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl">
              <div className="border-b pb-4">
                <h2 className="text-lg font-black text-slate-900">Student Security Settings</h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">Configure security credentials and update account profile.</p>
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

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                <h3 className="text-xs font-extrabold text-slate-900 border-b pb-3 uppercase tracking-wider text-slate-500">
                  Update Account Password
                </h3>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
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
                        className="block w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                        disabled={profileLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword1(p => !p)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-650"
                      >
                        {showPassword1 ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
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
                          className="block w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                          disabled={profileLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword2(p => !p)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-650"
                        >
                          {showPassword2 ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
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
                          className="block w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition font-semibold"
                          disabled={profileLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/10 transition disabled:opacity-50"
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

        </div>
      </div>

      {/* 3. STUDY NOTE DETAIL DRAWER MODAL */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setSelectedNote(null)} 
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 text-left">
              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase">
                {selectedNote.subject}
              </span>
              <h3 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                {selectedNote.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-350" />
                {selectedNote.readTime}
              </p>
            </div>

            <hr className="border-slate-100" />

            <p className="text-xs text-slate-600 leading-relaxed font-semibold text-left select-text max-h-[300px] overflow-y-auto pr-2">
              {selectedNote.content}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedNote(null)}
                className="rounded-xl bg-slate-900 text-white hover:bg-slate-850 px-5 py-2.5 text-xs font-bold shadow-xs active:scale-[0.98] transition"
              >
                Close Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs font-semibold text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          © {new Date().getFullYear()} Flarelap Global Foundation. Empowering student minds globally.
        </div>
      </footer>
    </div>
  );
}
