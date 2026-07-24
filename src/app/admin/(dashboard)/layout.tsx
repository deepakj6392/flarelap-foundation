"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Mail, 
  LogOut, 
  Menu,
  X,
  Sun,
  Moon,
  User,
  ShieldCheck,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  Settings,
  Heart,
  Images,
  HeartHandshake,
  History,
  Briefcase
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // UI states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [educationOpen, setEducationOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");
    const storedTheme = localStorage.getItem("admin_theme") as "light" | "dark" | null;

    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme("light"); // Default is light mode
    }

    if (!storedToken || !storedUser) {
      router.push("/admin/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "super_admin") {
        localStorage.clear();
        router.push("/admin/login");
        return;
      }
      setUser(parsedUser);
      setAuthorized(true);
    } catch (err) {
      localStorage.clear();
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    if (pathname.startsWith("/admin/education")) {
      setEducationOpen(true);
    }
    if (pathname.startsWith("/admin/profile") || pathname.startsWith("/admin/team")) {
      setMoreOpen(true);
    }
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("admin_theme", nextTheme);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/admin/login");
  };

  if (!authorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 text-slate-800 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Authenticating Admin Session...</p>
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";
  const bgMain = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800";
  const bgSidebar = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg";
  const textHeading = isDark ? "text-white" : "text-slate-900";
  const bgHeader = isDark ? "bg-slate-900/40" : "bg-white/80 shadow-xs";
  const bgHover = isDark ? "hover:bg-slate-800/60 hover:text-white" : "hover:bg-slate-100 hover:text-slate-900";

  // Sidebar Menu button colors
  const getMenuBtnClass = (route: string) => {
    const base = "flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-bold tracking-wide transition-all duration-200 outline-none";
    if (pathname === route) {
      return isDark 
        ? `${base} bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 text-emerald-400 border border-emerald-800/40 shadow-sm shadow-emerald-950/20`
        : `${base} bg-emerald-50 text-emerald-700 border border-emerald-100/70 shadow-sm shadow-emerald-100/20`;
    }
    return `${base} text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:translate-x-1 ${bgHover}`;
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/admin/dashboard":
        return "Dashboard Overview";
      case "/admin/contacts":
        return "Contact Inquiries";
      case "/admin/newsletter":
        return "Newsletter Subscribers";
      case "/admin/education/mcqs":
        return "MCQ Questions";
      case "/admin/education/study-material":
        return "Study Materials";
      case "/admin/education/courses":
        return "Manage Courses";
      case "/admin/education/test-series":
        return "Manage Test Series";
      case "/admin/education/categories":
        return "Manage Categories";
      case "/admin/donations":
        return "Donation Records";
      case "/admin/students":
        return "Student Directory";
      case "/admin/volunteers":
        return "Volunteer Directory";
      case "/admin/designations":
        return "Member Designations";
      case "/admin/user-logs":
        return "User Login & Activity Logs";
      case "/admin/profile":
        return "Update Profile";
      case "/admin/team":
        return "Team Members";
      case "/admin/gallery":
        return "Gallery Manager";
      case "/admin/blogs":
        return "Blogs Manager";
      default:
        return "Admin Panel";
    }
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDark ? "dark" : ""} ${bgMain}`}>
      
      {/* 1. LEFT COLLAPSIBLE SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col justify-between border-r p-6 transition-all duration-300 ${bgSidebar} ${
          sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"
        } lg:static lg:translate-x-0 ${
          sidebarCollapsed ? "lg:w-0 lg:p-0 lg:border-r-0 lg:overflow-hidden" : "lg:w-72"
        }`}
      >
        <div className="space-y-10">
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
                  Admin Panel
                </h2>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">
                  Manage your platform
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
          <nav className="space-y-2.5" aria-label="Sidebar navigation">
            <Link href="/admin/dashboard" className={getMenuBtnClass("/admin/dashboard")}>
              <LayoutDashboard className={`h-5 w-5 ${pathname === '/admin/dashboard' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              Overview
            </Link>
            <Link href="/admin/contacts" className={getMenuBtnClass("/admin/contacts")}>
              <MessageSquare className={`h-5 w-5 ${pathname === '/admin/contacts' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              Contacts
            </Link>
            <Link href="/admin/newsletter" className={getMenuBtnClass("/admin/newsletter")}>
              <Mail className={`h-5 w-5 ${pathname === '/admin/newsletter' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              Newsletter
            </Link>
            <Link href="/admin/donations" className={getMenuBtnClass("/admin/donations")}>
              <Heart className={`h-5 w-5 ${pathname === '/admin/donations' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              Donations
            </Link>
            <Link href="/admin/students" className={getMenuBtnClass("/admin/students")}>
              <GraduationCap className={`h-5 w-5 ${pathname === '/admin/students' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              Students
            </Link>
            <Link href="/admin/volunteers" className={getMenuBtnClass("/admin/volunteers")}>
              <HeartHandshake className={`h-5 w-5 ${pathname === '/admin/volunteers' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              Volunteers
            </Link>
            <Link href="/admin/designations" className={getMenuBtnClass("/admin/designations")}>
              <Briefcase className={`h-5 w-5 ${pathname === '/admin/designations' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              Designations
            </Link>
            <Link href="/admin/user-logs" className={getMenuBtnClass("/admin/user-logs")}>
              <History className={`h-5 w-5 ${pathname === '/admin/user-logs' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              User Logs
            </Link>
            <Link href="/admin/gallery" className={getMenuBtnClass("/admin/gallery")}>
              <Images className={`h-5 w-5 ${pathname === '/admin/gallery' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              Gallery
            </Link>
            <Link href="/admin/blogs" className={getMenuBtnClass("/admin/blogs")}>
              <FileText className={`h-5 w-5 ${pathname === '/admin/blogs' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
              Blogs
            </Link>

            {/* Education Collapsible Menu */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={() => setEducationOpen(prev => !prev)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition-all duration-200 outline-none text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-3.5">
                  <GraduationCap className={`h-5 w-5 ${pathname.startsWith('/admin/education') ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>Education</span>
                </div>
                {educationOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                )}
              </button>
              
              {educationOpen && (
                <div className="mt-1.5 ml-9 space-y-1 border-l border-slate-200 dark:border-slate-800 pl-3">
                  <Link
                    href="/admin/education/mcqs"
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200 ${
                      pathname === "/admin/education/mcqs"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    MCQ Question
                  </Link>
                  <Link
                    href="/admin/education/study-material"
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200 ${
                      pathname === "/admin/education/study-material"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Study Material
                  </Link>
                  <Link
                    href="/admin/education/courses"
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200 ${
                      pathname === "/admin/education/courses"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    Manage Courses
                  </Link>
                  <Link
                    href="/admin/education/categories"
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200 ${
                      pathname === "/admin/education/categories"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Manage Categories
                  </Link>
                  <Link
                    href="/admin/education/test-series"
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200 ${
                      pathname === "/admin/education/test-series"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Test Series
                  </Link>
                </div>
              )}
            </div>

            {/* More Collapsible Menu */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={() => setMoreOpen(prev => !prev)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition-all duration-200 outline-none text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-3.5">
                  <Settings className={`h-5 w-5 ${pathname.startsWith('/admin/profile') || pathname.startsWith('/admin/team') ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>More</span>
                </div>
                {moreOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                )}
              </button>
              
              {moreOpen && (
                <div className="mt-1.5 ml-9 space-y-1 border-l border-slate-200 dark:border-slate-800 pl-3">
                  <Link
                    href="/admin/team"
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200 ${
                      pathname === "/admin/team"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    <User className="h-3.5 w-3.5" />
                    Team Members
                  </Link>
                  <Link
                    href="/admin/profile"
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200 ${
                      pathname === "/admin/profile"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:translate-x-0.5"
                    }`}
                  >
                    <User className="h-3.5 w-3.5" />
                    Update Profile
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
            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-xs font-bold transition duration-200 ${
              isDark 
                ? "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10"
                : "border-red-200 bg-red-50/55 text-red-600 hover:bg-red-100/80"
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
      <div className="flex flex-1 flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className={`sticky top-0 z-30 flex h-14 items-center justify-between px-6 py-2 backdrop-blur-md ${bgHeader}`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(true);
                } else {
                  setSidebarCollapsed(prev => !prev);
                }
              }}
              className={`rounded-xl p-2 border transition ${isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800/60' : 'border-slate-200 text-slate-600 hover:bg-slate-100 shadow-xs'}`}
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
              className={`rounded-xl border p-2 transition duration-200 ${isDark ? 'border-slate-800 bg-slate-900 text-yellow-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 shadow-xs'}`}
            >
              {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Visual Divider */}
            <span className={`h-6 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

            {/* User Profile Badge */}
            <div className={`flex items-center gap-3 border rounded-xl pl-3 pr-4 py-1.5 shadow-sm max-w-[200px] sm:max-w-xs transition ${
              isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-400/5 border border-emerald-500/25 text-emerald-500 shadow-xs">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs font-black leading-none truncate ${textHeading}`}>
                    {user?.name || user?.fullName || user?.username || "Admin"}
                  </p>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                </div>
                <p className="text-[9px] text-emerald-600 font-extrabold tracking-wider uppercase mt-1">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Child Pages Content */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
