"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  HelpCircle, 
  Clock, 
  ChevronRight, 
  ShieldCheck,
  History,
  Sparkles,
  Loader2
} from "lucide-react";
import { useDashboard } from "./layout";
import { STUDY_MATERIALS } from "./data";

export default function StudentDashboardPage() {
  const { 
    student, 
    isDark, 
    dbLogs, 
    dbLogsLoading, 
    activities, 
    formatTimelineDate 
  } = useDashboard();

  // Local storage states for completed lessons and last exam
  const [readLessons, setReadLessons] = useState<number[]>([]);
  const [lastBundleScore, setLastBundleScore] = useState<number | null>(null);
  const [lastBundleSize, setLastBundleSize] = useState<number | null>(null);

  useEffect(() => {
    if (student) {
      const storedRead = localStorage.getItem(`student_read_lessons_${student.student_id}`);
      if (storedRead) {
        try {
          setReadLessons(JSON.parse(storedRead));
        } catch {
          setReadLessons([]);
        }
      }

      const scoreVal = localStorage.getItem(`student_last_bundle_score_${student.student_id}`);
      const sizeVal = localStorage.getItem(`student_last_bundle_size_${student.student_id}`);
      if (scoreVal && sizeVal) {
        setLastBundleScore(parseInt(scoreVal, 10));
        setLastBundleSize(parseInt(sizeVal, 10));
      }
    }
  }, [student]);

  if (!student) return null;

  const enrolledCourseId = Number(student.course_id);
  const filteredMaterials = STUDY_MATERIALS.filter(
    (material) => material.courseId === enrolledCourseId
  );
  
  const courseCompletedCount = readLessons.filter(lessonId => 
    filteredMaterials.some(m => m.id === lessonId)
  ).length;

  const getLastLoginTime = () => {
    if (dbLogs.length === 0) return "N/A";
    const loginLogs = dbLogs.filter(log => log.action === "LOGIN");
    if (loginLogs.length > 1) {
      const date = new Date(loginLogs[1].timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " | " + date.toLocaleDateString();
    }
    return "First Session Active";
  };

  const mergedTimeline = [
    ...dbLogs.map(log => ({
      id: log.id,
      type: log.action.toLowerCase() as "login" | "logout",
      title: log.action === "LOGIN" 
        ? "Successfully logged in to Scholar Console" 
        : "Logged out / ended active session",
      timestamp: log.timestamp
    })),
    ...activities.map(act => ({
      id: act.id,
      type: act.type,
      title: act.title,
      timestamp: act.timestamp
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  const textHeading = isDark ? "text-white" : "text-slate-900";

  return (
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
          <Link
            href="/student/dashboard/materials"
            className="self-start md:self-auto shrink-0 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-805 px-6 py-3.5 text-xs font-black shadow-lg shadow-emerald-950/20 transition-all hover:scale-[1.02] text-center"
          >
            Explore Study Materials
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Study Progress */}
        <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
          isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white shadow-xs"
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
              {courseCompletedCount} / {filteredMaterials.length}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold">Lessons completed</p>
            {/* Progress Bar */}
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${filteredMaterials.length > 0 ? (courseCompletedCount / filteredMaterials.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Exam Score */}
        <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
          isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white shadow-xs"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Mock Performance
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-550 border border-blue-500/20">
              <HelpCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <h3 className={`text-xl font-black ${textHeading}`}>
              {lastBundleScore !== null ? `${lastBundleScore} / ${lastBundleSize}` : "No attempts"}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold">
              {lastBundleScore !== null ? `${Math.round((lastBundleScore / lastBundleSize!) * 100)}% Last Score` : "Test your skills now"}
            </p>
            {/* Progress Bar */}
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: lastBundleScore !== null ? `${(lastBundleScore / lastBundleSize!) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Verified Scholar Status */}
        <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
          isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white shadow-xs"
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
              <h3 className={`text-xs font-black text-emerald-600 dark:text-emerald-450`}>Session: Active</h3>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1 truncate">
              Last Login: {getLastLoginTime()}
            </p>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 select-all">
              ID: {student.student_id}
            </p>
          </div>
        </div>

        {/* Metric 4: Next Milestone */}
        <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
          isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white shadow-xs"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-505">
              Suggested Action
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <h3 className={`text-xs font-black ${textHeading} truncate`}>
              {courseCompletedCount < filteredMaterials.length ? "Read Next Lesson" : (lastBundleScore !== null ? "Update Credentials" : "Take Practice Exam")}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold">
              {courseCompletedCount < filteredMaterials.length ? "Complete study guide" : (lastBundleScore !== null ? "Manage account credentials" : "Attempt aptitudes exam")}
            </p>
            <Link
              href={courseCompletedCount < filteredMaterials.length ? "/student/dashboard/materials" : (lastBundleScore === null ? "/student/dashboard/quiz" : "/student/dashboard/profile")}
              className="text-[10.5px] font-black text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              Go to Portal <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Panels Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Recent activity timeline logs */}
        <div className={`lg:col-span-2 rounded-2xl border p-6 ${
          isDark ? "border-slate-800 bg-slate-900/30" : "border-slate-200 bg-white shadow-xs"
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-slate-400" />
              <h3 className={`text-sm font-black ${textHeading}`}>Recent Console Activity</h3>
            </div>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Last 10 events</span>
          </div>

          <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-6">
            {dbLogsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-605" />
              </div>
            ) : mergedTimeline.length === 0 ? (
              <p className="text-xs text-slate-550 font-semibold pl-2">No activity logs recorded yet.</p>
            ) : (
              mergedTimeline.map((act) => (
                <div key={act.id} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[20.5px] top-1.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-950 group-hover:scale-110 transition-all ${
                    act.type === "login" 
                      ? "bg-emerald-500" 
                      : act.type === "logout" 
                        ? "bg-red-500" 
                        : act.type === "lesson" 
                          ? "bg-blue-500" 
                          : "bg-purple-500"
                  }`} />
                  <div className="space-y-1">
                    <p className={`text-xs font-semibold ${textHeading}`}>{act.title}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold">
                      {formatTimelineDate(act.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Digital Student ID Card */}
        <div className={`rounded-2xl border p-6 flex flex-col justify-between text-center relative overflow-hidden ${
          isDark ? "border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/40" : "border-slate-200 bg-gradient-to-b from-slate-50/80 to-white shadow-xs"
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Scholar Digital Pass</span>
              <span className="text-[9px] text-slate-405 dark:text-slate-500 font-bold">ACTIVE</span>
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
              <span>Enrolled Course:</span>
              <span className="font-bold text-slate-600 dark:text-slate-300 select-all">{student.course_name || "None"}</span>
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
  );
}
