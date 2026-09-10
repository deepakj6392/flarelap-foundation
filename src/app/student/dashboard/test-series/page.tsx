"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  HelpCircle, 
  Zap, 
  Award, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Clock,
  Search,
  Sparkles,
  Play,
  Check,
  ShoppingBag,
  ChevronRight,
  FileText,
  Trophy,
  Filter
} from "lucide-react";
import Swal from "sweetalert2";
import { useDashboard } from "../layout";
import { generateSubTestsList, getCourseTestCount, SubTest } from "@/lib/testSeriesGenerator";

interface DBTestSeries {
  id: number;
  name: string;
  type: string;
  qs: number;
  marks: number;
  duration: number;
  isFree: boolean;
}

interface CourseRecord {
  id: number;
  name: string;
  premium: boolean;
  active: boolean;
  categoryId?: number | null;
  category?: { id: number; name: string } | null;
  testSeries?: DBTestSeries[];
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
  const router = useRouter();

  const [activeMainTab, setActiveMainTab] = useState<"unlocked" | "store">("unlocked");
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [courseTestSeries, setCourseTestSeries] = useState<SubTest[]>([]);
  const [loadingTests, setLoadingTests] = useState<boolean>(false);

  const [testSearchQuery, setTestSearchQuery] = useState<string>("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("All");

  const [storeSearchQuery, setStoreSearchQuery] = useState<string>("");
  const [storeCategoryFilter, setStoreCategoryFilter] = useState<string>("All");

  const [purchasingCourseId, setPurchasingCourseId] = useState<number | null>(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchStudentTestSeriesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const coursesRes = await fetch("/api/courses");
      const coursesData = await coursesRes.json();
      
      const token = localStorage.getItem("student_token");
      let purchasesList: PurchaseRecord[] = [];

      if (token) {
        const purchasesRes = await fetch("/api/student/purchases", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (purchasesRes.ok) {
          const purchasesData = await purchasesRes.json();
          purchasesList = purchasesData.purchases || [];
        }
      }

      if (coursesRes.ok) {
        const allCourses: CourseRecord[] = coursesData.courses || [];
        setCourses(allCourses);
        setPurchases(purchasesList);

        if (student) {
          const enrolledId = Number(student.course_id);
          const unlockedCourses = allCourses.filter((c) => {
            if (!c.premium) return true;
            if (c.id === enrolledId) return true;
            return purchasesList.some((p) => p.status === "COMPLETED" && p.courseId === c.id && p.isActive);
          });

          if (unlockedCourses.length > 0) {
            setSelectedCourseId((prev) => prev || unlockedCourses[0].id.toString());
          } else if (allCourses.length > 0) {
            setSelectedCourseId((prev) => prev || allCourses[0].id.toString());
          }
        }
      }
    } catch (err) {
      console.error("Failed to load student test series info:", err);
      setError("Could not retrieve test series data. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentTestSeriesData();
  }, [student?.student_id]);

  // Load tests for selected course
  useEffect(() => {
    if (!selectedCourseId) return;

    async function loadSelectedCourseTests() {
      setLoadingTests(true);
      try {
        const res = await fetch(`/api/courses/${selectedCourseId}`);
        if (res.ok) {
          const data = await res.json();
          const targetCourse: CourseRecord = data.course;
          if (targetCourse) {
            let list: SubTest[] = [];
            if (targetCourse.testSeries && targetCourse.testSeries.length > 0) {
              list = targetCourse.testSeries.map((t: any) => ({
                id: t.id.toString(),
                name: t.name,
                type: t.type || "Full Mock",
                qs: t.qs || 100,
                marks: t.marks || 200,
                duration: t.duration || 60,
                isFree: t.isFree ?? !targetCourse.premium
              }));
            } else {
              list = generateSubTestsList(targetCourse.name, targetCourse.premium);
            }
            setCourseTestSeries(list);
          }
        }
      } catch (err) {
        console.error("Failed to load course tests:", err);
      } finally {
        setLoadingTests(false);
      }
    }

    loadSelectedCourseTests();
  }, [selectedCourseId]);

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

  const isCourseUnlocked = (course: CourseRecord) => {
    if (!course.premium) return true;
    if (course.id === enrolledCourseId) return true;
    return Boolean(getActivePurchase(course));
  };

  const activeUnlockedCourses = courses.filter(c => isCourseUnlocked(c));
  const lockedStoreCourses = courses.filter(c => !isCourseUnlocked(c));

  // Current selected course details
  const currentSelectedCourse = courses.find((c) => c.id.toString() === selectedCourseId) || activeUnlockedCourses[0];

  // Filtered tests for Tab 1
  const filteredCourseTests = courseTestSeries.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
                          test.type.toLowerCase().includes(testSearchQuery.toLowerCase());
    const matchesType = selectedTypeFilter === "All" || 
                        test.type.toLowerCase().includes(selectedTypeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  // Filtered store courses for Tab 2
  const filteredStoreCourses = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(storeSearchQuery.toLowerCase());
    const catName = c.category?.name || "General";
    const matchesCat = storeCategoryFilter === "All" || catName.toLowerCase() === storeCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Unique categories for Tab 2 filter
  const storeCategories = Array.from(
    new Set(courses.map((c) => c.category?.name || "General"))
  );

  // Buy / Unlock Course Handler with Razorpay
  const handleUnlockCoursePass = async (courseToBuy: CourseRecord) => {
    const token = localStorage.getItem("student_token");
    if (!token) {
      router.push("/student/login");
      return;
    }

    setPurchasingCourseId(courseToBuy.id);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your network connection.");
      }

      // 1. Create order on backend
      const orderRes = await fetch("/api/student/purchases/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: courseToBuy.id })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to initiate purchase.");

      const { orderId, keyId, currency } = orderData;

      // 2. Open Razorpay Popup
      const options = {
        key: keyId,
        amount: orderData.amount, // in paise
        currency: currency || "INR",
        name: "Flarelap Foundation",
        description: `30-Day Premium Test Series Pass for ${courseToBuy.name}`,
        order_id: orderId,
        handler: async function (response: any) {
          setPurchasingCourseId(courseToBuy.id);
          try {
            // 3. Verify payment on backend
            const verifyRes = await fetch("/api/student/purchases", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                courseId: courseToBuy.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: parseFloat(orderData.coursePrice || "59")
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message || "Payment verification failed.");

            // Reload purchases and switch to unlocked tab
            await fetchStudentTestSeriesData();
            setSelectedCourseId(courseToBuy.id.toString());
            setActiveMainTab("unlocked");

            Swal.fire({
              title: "🎉 Course Unlocked Successfully!",
              html: `You have successfully unlocked the 30-Day Pass for <b>${courseToBuy.name}</b>.<br/>All Full Length Mock Tests are now unlocked in your dashboard!`,
              icon: "success",
              confirmButtonColor: "#10b981"
            });
          } catch (err: any) {
            Swal.fire({
              title: "Verification Failed",
              text: err.message || "Payment completed, but verification failed. Please contact support.",
              icon: "error",
              confirmButtonColor: "#10b981"
            });
          } finally {
            setPurchasingCourseId(null);
          }
        },
        theme: {
          color: "#10b981"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Course purchase error:", err);
      Swal.fire({
        title: "Checkout Error",
        text: err.message || "Could not initiate payment. Please try again.",
        icon: "error",
        confirmButtonColor: "#10b981"
      });
    } finally {
      setPurchasingCourseId(null);
    }
  };

  const textHeading = isDark ? "text-white" : "text-slate-900";
  const bgCard = isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-xs";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans pb-12">
      
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Interactive Student Test Portal</span>
          </div>
          <h2 className={`text-2xl font-black ${textHeading} tracking-tight`}>
            Mock Test Series & Course Passes Hub
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Attempt all full-length mock tests for your unlocked courses or buy new 30-day exam passes directly from your dashboard.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shrink-0">
          <button
            onClick={() => setActiveMainTab("unlocked")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeMainTab === "unlocked"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>My Unlocked Mock Tests</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {activeUnlockedCourses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab("store")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeMainTab === "store"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Buy / Unlock New Courses</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
              ₹59/mo
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-xs font-bold">Loading test series and subscription passes...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-xs font-semibold text-red-500">
          <HelpCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      ) : activeMainTab === "unlocked" ? (
        
        /* ════════════════════════════════════════════════════════════════ */
        /* TAB 1: MY UNLOCKED COURSES & MOCK TESTS                          */
        /* ════════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          
          {/* Unlocked Courses Selector Bar */}
          <div className="space-y-3">
            <h3 className={`text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5`}>
              <BookOpen className="h-4 w-4 text-emerald-600" /> Select Unlocked Course Category
            </h3>

            {activeUnlockedCourses.length === 0 ? (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center space-y-3">
                <Lock className="h-8 w-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-black text-amber-900 dark:text-amber-200">No Unlocked Courses Found</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  You haven't unlocked any course passes yet. Browse available mock test passes to unlock full-length test series.
                </p>
                <button
                  onClick={() => setActiveMainTab("store")}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-md transition cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" /> Explore & Buy New Course Pass (₹59)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {activeUnlockedCourses.map((c) => {
                  const isSelected = c.id.toString() === selectedCourseId;
                  const isPrimary = c.id === enrolledCourseId;
                  const activeP = getActivePurchase(c);
                  let daysRemaining = 30;
                  if (activeP) {
                    const createdTime = activeP.createdAt ? new Date(activeP.createdAt).getTime() : 0;
                    const msRemaining = (createdTime + thirtyDaysMs) - Date.now();
                    daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
                  }

                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCourseId(c.id.toString());
                        setTestSearchQuery("");
                      }}
                      className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
                            isPrimary
                              ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50"
                              : "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50"
                          }`}>
                            {isPrimary ? "Primary Course" : `Unlocked (${daysRemaining}d left)`}
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                        </div>
                        <h4 className="text-xs font-black line-clamp-1 leading-snug">
                          {c.name}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Course Test List Section */}
          {currentSelectedCourse && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5">
              
              {/* Selected Course Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {currentSelectedCourse.category?.name || "Mock Exam Series"}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">•</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {courseTestSeries.length} Associated Mock Tests
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {currentSelectedCourse.name}
                  </h3>
                </div>

                {/* Sub-type Filters & Search */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={testSearchQuery}
                      onChange={(e) => setTestSearchQuery(e.target.value)}
                      placeholder="Filter test by name..."
                      className="w-full sm:w-56 pl-9 pr-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none transition"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                    {["All", "Full Mock", "Prelims", "Mains"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedTypeFilter(type)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                          selectedTypeFilter === type
                            ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mock Tests Data Table */}
              {loadingTests ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mb-2" />
                  <p className="text-xs font-bold">Fetching associated mock tests...</p>
                </div>
              ) : filteredCourseTests.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-semibold text-xs">
                  No mock tests found matching "{testSearchQuery}".
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3 px-4 w-12 text-center">#</th>
                          <th className="py-3 px-4 min-w-[240px]">Test Series Name</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4 text-center">Questions</th>
                          <th className="py-3 px-4 text-center">Duration</th>
                          <th className="py-3 px-4 text-center">Total Marks</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {filteredCourseTests.map((t, idx) => (
                          <tr key={t.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition">
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                              #{idx + 1}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900 dark:text-slate-100">
                                {t.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                CBT Exam Mode • Dynamic Questions
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                                t.type.toLowerCase().includes("full")
                                  ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                                  : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                              }`}>
                                {t.type}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-black text-slate-800 dark:text-slate-200">
                              {t.qs} Qs
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-emerald-600" /> {t.duration} min
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                              {t.marks} Marks
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <Link
                                href={`/education/test-series/attempt/${t.id}?course=${currentSelectedCourse.id}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
                              >
                                <Play className="h-3.5 w-3.5 fill-white" /> Attempt Test
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (

        /* ════════════════════════════════════════════════════════════════ */
        /* TAB 2: EXPLORE & BUY NEW COURSE PASSES (IN-DASHBOARD STORE)      */
        /* ════════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          
          {/* Store Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Unlock Unlimited Exam Passes (₹59 / 30 Days)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select any exam course to purchase a 30-day monthly pass and gain instant access to all full-length mock tests.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <select
                value={storeCategoryFilter}
                onChange={(e) => setStoreCategoryFilter(e.target.value)}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none transition"
              >
                <option value="All">All Categories</option>
                {storeCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={storeSearchQuery}
                  onChange={(e) => setStoreSearchQuery(e.target.value)}
                  placeholder="Search exam course..."
                  className="w-full sm:w-56 pl-9 pr-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Store Course Cards Grid */}
          {filteredStoreCourses.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-semibold text-xs">
              No course exam passes found matching your search.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStoreCourses.map((c) => {
                const isUnlocked = isCourseUnlocked(c);
                const isBuying = purchasingCourseId === c.id;
                const totalTests = getCourseTestCount(c.name, c.premium, c.testSeries);

                return (
                  <div
                    key={c.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between hover:shadow-lg transition-all ${bgCard} ${
                      isUnlocked ? "border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10" : ""
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-start justify-between">
                        <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                          {c.category?.name || "Exam Pass"}
                        </span>

                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <Check className="h-3 w-3" /> Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            <Lock className="h-3 w-3" /> Premium Pass
                          </span>
                        )}
                      </div>

                      {/* Course Name */}
                      <div>
                        <h4 className={`text-base font-black leading-tight ${textHeading} min-h-[44px] line-clamp-2`}>
                          {c.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                          Full Exam Test Series Pack
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span><strong>{totalTests}</strong> Full Mock & Sectional Tests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>30-Days Monthly Unlimited Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>Instant Score Analysis & Ranking</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            ₹59.00
                          </span>
                          <span className="text-xs text-slate-400 font-bold ml-1">/ 30 Days</span>
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          BEST VALUE
                        </span>
                      </div>

                      {isUnlocked ? (
                        <button
                          onClick={() => {
                            setSelectedCourseId(c.id.toString());
                            setActiveMainTab("unlocked");
                          }}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white py-3 text-xs font-black shadow-md transition cursor-pointer"
                        >
                          <Trophy className="h-4 w-4" /> Go to Unlocked Tests
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnlockCoursePass(c)}
                          disabled={isBuying}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white py-3 text-xs font-black shadow-lg shadow-emerald-600/20 transition active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isBuying ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Initiating Checkout...
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-4 w-4" />
                              Buy & Unlock Pass (₹59)
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

