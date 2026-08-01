"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  HelpCircle, 
  Zap, 
  Globe, 
  Award,
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Lock,
  ArrowRight,
  Loader2,
  Clock
} from "lucide-react";
import { useDashboard } from "../layout";
import { getCourseTestCount } from "@/lib/testSeriesGenerator";

interface CourseRecord {
  id: number;
  name: string;
  premium: boolean;
  active: boolean;
  categoryId?: number | null;
}

interface PurchaseRecord {
  id: number;
  courseId: number;
  status: string;
  createdAt?: string | Date;
  expiresAt?: string;
  daysLeft?: number;
  isExpired?: boolean;
  isActive?: boolean;
  course?: {
    name: string;
    premium: boolean;
    categoryId?: number | null;
  } | null;
}

export default function StudentTestSeriesPage() {
  const { student, isDark } = useDashboard();
  
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudentTestSeriesData() {
      try {
        setLoading(true);
        // Fetch courses
        const coursesRes = await fetch("/api/courses");
        const coursesData = await coursesRes.json();
        
        // Fetch student purchases
        const token = localStorage.getItem("student_token");
        const purchasesRes = await fetch("/api/student/purchases", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const purchasesData = await purchasesRes.json();

        if (coursesRes.ok) {
          setCourses(coursesData.courses || []);
        }
        if (purchasesRes.ok) {
          setPurchases(purchasesData.purchases || []);
        }
      } catch (err) {
        console.error("Failed to load student test series info:", err);
        setError("Could not retrieve test series data.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchStudentTestSeriesData();
  }, []);

  if (!student) return null;

  const enrolledCourseId = Number(student.course_id);

  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  const getActivePurchase = (course: CourseRecord) => {
    return purchases.find(p => {
      if (p.status !== "COMPLETED") return false;
      const isMatch = p.courseId === course.id || (course.categoryId && p.course?.categoryId === course.categoryId);
      const createdTime = p.createdAt ? new Date(p.createdAt).getTime() : 0;
      const isActive = (Date.now() - createdTime) <= thirtyDaysMs;
      return isMatch && isActive;
    });
  };

  const getExpiredPurchase = (course: CourseRecord) => {
    return purchases.find(p => {
      if (p.status !== "COMPLETED") return false;
      const isMatch = p.courseId === course.id || (course.categoryId && p.course?.categoryId === course.categoryId);
      const createdTime = p.createdAt ? new Date(p.createdAt).getTime() : 0;
      const isExpired = (Date.now() - createdTime) > thirtyDaysMs;
      return isMatch && isExpired;
    });
  };

  const isCourseUnlocked = (course: CourseRecord) => {
    if (!course.premium) return true;
    if (course.id === enrolledCourseId) return true;
    return Boolean(getActivePurchase(course));
  };

  const activeTestSeries = courses.filter(c => isCourseUnlocked(c));
  const expiredTestSeries = courses.filter(c => !isCourseUnlocked(c) && Boolean(getExpiredPurchase(c)));
  const otherTestSeries = courses.filter(c => !isCourseUnlocked(c) && !getExpiredPurchase(c));

  const textHeading = isDark ? "text-white" : "text-slate-900";
  const bgCard = isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-xs";

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* Intro Panel */}
      <div className="space-y-1">
        <h2 className={`text-xl font-black ${textHeading}`}>Test Series Hub</h2>
        <p className="text-xs font-semibold text-slate-500">
          Access your enrolled exam course, view active 30-day monthly passes, and renew expired subscriptions.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
            <p className="text-xs font-bold text-slate-500">Loading test series data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-800 transition">
          <HelpCircle className="h-4.5 w-4.5 shrink-0 text-red-655" />
          {error}
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Section 1: Active & Unlocked Test Series */}
          <div className="space-y-4">
            <h3 className={`text-sm font-black border-b border-slate-105 dark:border-slate-800/80 pb-2 ${textHeading} flex items-center gap-2`}>
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-650" />
              Active & Unlocked Test Series (30-Day Monthly Pass)
            </h3>
            
            {activeTestSeries.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium pl-1">No active test series unlocked.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeTestSeries.map(course => {
                  const isDefault = course.id === enrolledCourseId;
                  const isPaid = course.premium;
                  const activeP = getActivePurchase(course);
                  let daysRemaining = 30;
                  if (activeP) {
                    const createdTime = activeP.createdAt ? new Date(activeP.createdAt).getTime() : 0;
                    const msRemaining = (createdTime + thirtyDaysMs) - Date.now();
                    daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
                  }

                  return (
                    <div 
                      key={course.id} 
                      className={`rounded-2xl border p-5 flex flex-col justify-between hover:shadow-md transition ${bgCard}`}
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-start justify-between">
                          <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                            isDefault 
                              ? "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 border border-emerald-200/50" 
                              : "bg-blue-100 dark:bg-blue-950/20 text-blue-800 dark:text-blue-450 border border-blue-200/50"
                          }`}>
                            {isDefault ? "Primary Course" : (isPaid ? `30 Days Pass (${daysRemaining} Days Left)` : "Free Access")}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 py-0.5 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700/60">
                            <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            Active
                          </span>
                        </div>

                        <h4 className={`text-sm font-black leading-tight ${textHeading} min-h-[38px] line-clamp-2`}>
                          {course.name}
                        </h4>

                        <div className="flex items-center gap-1.5 text-xs text-slate-405 dark:text-slate-400 font-bold">
                          <BookOpen className="h-4 w-4" />
                          <span>{getCourseTestCount(course.name, course.premium, (course as any).testSeries)} practice mock tests</span>
                        </div>
                      </div>

                      <Link 
                        href={`/education/test-series/${course.id}`} 
                        className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white py-2.5 text-xs font-black shadow-md shadow-emerald-950/15 transition active:scale-[0.99] cursor-pointer"
                      >
                        Attempt Tests
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Expired Subscriptions (Need Renewal) */}
          {expiredTestSeries.length > 0 && (
            <div className="space-y-4">
              <h3 className={`text-sm font-black border-b border-amber-500/30 pb-2 text-amber-600 flex items-center gap-2`}>
                <Clock className="h-4.5 w-4.5 text-amber-500" />
                Expired Subscriptions (30 Days Completed)
              </h3>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {expiredTestSeries.map(course => {
                  const totalCount = getCourseTestCount(course.name, course.premium, (course as any).testSeries);

                  return (
                    <div 
                      key={course.id} 
                      className={`rounded-2xl border border-amber-300/60 dark:border-amber-900/40 p-5 flex flex-col justify-between hover:shadow-md transition bg-amber-50/30 dark:bg-amber-950/10`}
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-start justify-between">
                          <span className="rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200/50">
                            Expired Pass
                          </span>
                          <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 rounded-full px-2.5 py-0.5 font-bold border border-red-200">
                            Expired
                          </span>
                        </div>

                        <h4 className={`text-sm font-black leading-tight ${textHeading} min-h-[38px] line-clamp-2`}>
                          {course.name}
                        </h4>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                          <BookOpen className="h-4 w-4" />
                          <span>30 Days period completed ({totalCount} Tests)</span>
                        </div>
                      </div>

                      <Link 
                        href={`/education/test-series/${course.id}`} 
                        className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white py-2.5 text-xs font-black shadow-md shadow-amber-950/15 transition active:scale-[0.99] cursor-pointer"
                      >
                        Pay for Next Month (₹59)
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Available Premium Courses */}
          <div className="space-y-4">
            <h3 className={`text-sm font-black border-b border-slate-105 dark:border-slate-800/80 pb-2 ${textHeading} flex items-center gap-2`}>
              <Lock className="h-4.5 w-4.5 text-slate-400" />
              Available Premium Test Series
            </h3>

            {otherTestSeries.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium pl-1">You have unlocked all test series packages!</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherTestSeries.map(course => {
                  const totalCount = getCourseTestCount(course.name, course.premium, (course as any).testSeries);
                  const freeCount = Math.min(totalCount, 4);
                  const premCount = Math.max(0, totalCount - freeCount);

                  return (
                    <div 
                      key={course.id} 
                      className={`rounded-2xl border p-5 flex flex-col justify-between hover:shadow-md transition ${bgCard}`}
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-start justify-between">
                          <span className="rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/20 text-purple-800 dark:text-purple-450 border border-purple-200/50">
                            Premium Course
                          </span>
                          <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-500 rounded-full px-2.5 py-0.5 font-bold border border-amber-500/20">
                            <Lock className="h-3 w-3" />
                            Locked
                          </span>
                        </div>

                        <h4 className={`text-sm font-black leading-tight ${textHeading} min-h-[38px] line-clamp-2`}>
                          {course.name}
                        </h4>

                        <div className="flex items-center gap-1.5 text-xs text-slate-405 dark:text-slate-400 font-bold">
                          <BookOpen className="h-4 w-4" />
                          <span>{premCount > 0 ? `${premCount} Premium + ${freeCount} Free Tests` : `${totalCount} Free Tests`}</span>
                        </div>
                      </div>

                    <Link 
                      href={`/education/test-series/${course.id}`} 
                      className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-750 hover:bg-purple-700 text-white py-2.5 text-xs font-black shadow-md shadow-purple-950/15 transition active:scale-[0.99] cursor-pointer"
                    >
                      Buy 30 Days Pass (₹59)
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
