"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
  Menu,
  Sun,
  Moon,
  LayoutDashboard,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { StudentProfile, StudentLog, Activity } from "./data";

interface DashboardContextType {
  student: StudentProfile | null;
  theme: "light" | "dark";
  isDark: boolean;
  dbLogs: StudentLog[];
  dbLogsLoading: boolean;
  activities: Activity[];
  fetchLogs: () => Promise<void>;
  saveActivity: (newAct: { id: number; type: "lesson" | "quiz" | "login"; title: string }) => void;
  formatTimelineDate: (isoString: string) => string;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Mounting state to prevent Next.js hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Initialize states directly from localStorage
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // UI structure control states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [studyPortalOpen, setStudyPortalOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(true);

  // Database Activity Logs
  const [dbLogs, setDbLogs] = useState<StudentLog[]>([]);
  const [dbLogsLoading, setDbLogsLoading] = useState(false);

  // Persistent activities log
  const [activities, setActivities] = useState<Activity[]>([]);

  // Set mounted and load localStorage values
  useEffect(() => {
    setMounted(true);
    
    const storedUser = localStorage.getItem("student_user");
    if (storedUser) {
      try {
        setStudent(JSON.parse(storedUser));
      } catch {
        setStudent(null);
      }
    }

    const storedTheme = localStorage.getItem("student_theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    } else {
      setTheme("light");
    }
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

  // Load activities once student is set
  useEffect(() => {
    if (student) {
      const storedActivities = localStorage.getItem(`student_activities_${student.student_id}`);
      if (storedActivities) {
        try {
          setActivities(JSON.parse(storedActivities));
        } catch {
          setActivities([]);
        }
      } else {
        const initialAct: Activity[] = [
          {
            id: 1,
            type: "login",
            title: "Logged in successfully to Scholar Console",
            timestamp: new Date().toISOString()
          }
        ];
        localStorage.setItem(`student_activities_${student.student_id}`, JSON.stringify(initialAct));
        setActivities(initialAct);
      }
    }
  }, [student]);

  // Fetch activity logs from DB
  const fetchLogs = async () => {
    try {
      setDbLogsLoading(true);
      const token = localStorage.getItem("student_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/auth/student/logs`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDbLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setDbLogsLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && student) {
      fetchLogs();
    }
  }, [mounted, student]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("student_theme", nextTheme);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("student_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      if (token) {
        await fetch(`${apiUrl}/api/auth/student/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.clear();
      router.push("/student/login");
    }
  };

  // Activity logger helper with dynamic timestamp
  const saveActivity = (newAct: { id: number; type: "lesson" | "quiz" | "login"; title: string }) => {
    if (!student) return;
    setActivities(prev => {
      const updated = [{ ...newAct, timestamp: new Date().toISOString() }, ...prev].slice(0, 10);
      localStorage.setItem(`student_activities_${student.student_id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Timeline Date Formatter Helper
  const formatTimelineDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " | " + date.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  // Safe skeleton loading state
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
  const bgMain = isDark ? "bg-slate-955 bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800";
  const bgSidebar = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg";
  const textHeading = isDark ? "text-white" : "text-slate-900";
  const bgHeader = isDark ? "bg-slate-900/40 border-slate-800" : "bg-white/80 border-slate-200 shadow-xs";
  const bgHover = isDark ? "hover:bg-slate-800/60 hover:text-white" : "hover:bg-slate-100 hover:text-slate-900";

  const getSidebarBtnClass = (route: string) => {
    const base = "flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-bold tracking-wide transition-all duration-200 outline-none cursor-pointer";
    const isActive = pathname === route;
    if (isActive) {
      return isDark 
        ? `${base} bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 text-emerald-400 border border-emerald-800/40 shadow-sm shadow-emerald-950/20`
        : `${base} bg-emerald-50 text-emerald-700 border border-emerald-100/70 shadow-sm shadow-emerald-100/20`;
    }
    return `${base} text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:translate-x-1 ${bgHover}`;
  };

  const getSubMenuBtnClass = (route: string) => {
    const base = "flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all duration-200 outline-none text-left cursor-pointer";
    const isActive = pathname === route;
    if (isActive) {
      return `${base} text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-955/20 dark:bg-emerald-950/20`;
    }
    return `${base} text-slate-600 dark:text-slate-400 hover:text-slate-955 dark:hover:text-white hover:translate-x-0.5`;
  };

  const getPageTitle = () => {
    if (pathname === "/student/dashboard") return "Scholar Console Overview";
    if (pathname === "/student/dashboard/materials") return "Study Course Materials";
    if (pathname === "/student/dashboard/quiz") return "Interactive Mock Exam";
    if (pathname === "/student/dashboard/test-series") return "My Test Series & Passes";
    if (pathname === "/student/dashboard/profile") return "Student Security Settings";
    return "Student Dashboard";
  };

  return (
    <DashboardContext.Provider value={{
      student,
      theme,
      isDark,
      dbLogs,
      dbLogsLoading,
      activities,
      fetchLogs,
      saveActivity,
      formatTimelineDate
    }}>
      <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDark ? "dark" : ""} ${bgMain}`}>
        
        {/* LEFT COLLAPSIBLE SIDEBAR */}
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
              <Link 
                href="/student/dashboard"
                onClick={() => setSidebarOpen(false)} 
                className={getSidebarBtnClass("/student/dashboard")}
              >
                <LayoutDashboard className={`h-4.5 w-4.5 ${pathname === '/student/dashboard' ? 'text-emerald-500' : 'text-slate-505 dark:text-slate-400'}`} />
                <span>Overview</span>
              </Link>

              {/* Study Portal Collapsible Menu */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/85">
                <button
                  onClick={() => setStudyPortalOpen(prev => !prev)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-bold tracking-wide transition-all duration-200 outline-none text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4.5 w-4.5 text-slate-550 dark:text-slate-400" />
                    <span>Study Portal</span>
                  </div>
                  {studyPortalOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  )}
                </button>
                
                {studyPortalOpen && (
                  <div className="mt-1.5 ml-8 space-y-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
                    <Link
                      href="/student/dashboard/materials"
                      onClick={() => setSidebarOpen(false)}
                      className={getSubMenuBtnClass("/student/dashboard/materials")}
                    >
                      Study Materials
                    </Link>
                    <Link
                      href="/student/dashboard/quiz"
                      onClick={() => setSidebarOpen(false)}
                      className={getSubMenuBtnClass("/student/dashboard/quiz")}
                    >
                      Practice Mock Exams
                    </Link>
                    <Link
                      href="/student/dashboard/test-series"
                      onClick={() => setSidebarOpen(false)}
                      className={getSubMenuBtnClass("/student/dashboard/test-series")}
                    >
                      Test Series
                    </Link>
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
                    <User className="h-4.5 w-4.5 text-slate-550 dark:text-slate-400" />
                    <span>My Account</span>
                  </div>
                  {accountOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  )}
                </button>
                
                {accountOpen && (
                  <div className="mt-1.5 ml-8 space-y-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
                    <Link
                      href="/student/dashboard/profile"
                      onClick={() => setSidebarOpen(false)}
                      className={getSubMenuBtnClass("/student/dashboard/profile")}
                    >
                      Security Settings
                    </Link>
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
                  ? "border-red-900/40 bg-red-955/20 dark:bg-red-950/20 text-red-400 hover:bg-red-900/25"
                  : "border-red-200 bg-red-50 text-red-655 hover:bg-red-100"
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

        {/* MAIN CORE CONTENT WRAPPER */}
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
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-505 shrink-0" />
                  </div>
                  <p className="text-[9px] text-emerald-600 font-extrabold tracking-wider uppercase mt-1">
                    Active Scholar
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Child Page Rendering Area */}
          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            {children}
          </main>

          {/* FOOTER */}
          <footer className={`border-t py-6 text-center text-xs font-semibold text-slate-400 mt-auto transition ${
            isDark ? "bg-slate-950 border-slate-900" : "bg-white border-slate-200"
          }`}>
            <div className="max-w-7xl mx-auto px-6">
              © {new Date().getFullYear()} {siteConfig.name}. Empowering student minds globally.
            </div>
          </footer>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
