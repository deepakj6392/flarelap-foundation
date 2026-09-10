"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import Herader from "@/components/common/Herader";
import Footer from "@/components/common/Footer";
import { 
  getRealExamStats, 
  getCourseMetadata, 
  SubTest 
} from "@/lib/testSeriesGenerator";
import { 
  Award, 
  BookOpen, 
  FileText, 
  Globe, 
  Zap, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Play,
  Lock,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Swal from "sweetalert2";

interface DBTestSeries {
  id: number;
  name: string;
  type: string;
  qs: number;
  marks: number;
  duration: number;
  isFree: boolean;
}

interface Course {
  id: number;
  name: string;
  premium: boolean;
  price?: number | string | any;
  testSeries?: DBTestSeries[];
  categoryId?: number | null;
}

const TabHeader = ({
  tabs,
  activeId,
  onChange
}: {
  tabs: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 5);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [tabs]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-2 shadow-xs select-none">
      {showLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-2 z-10 p-1.5 bg-white hover:bg-slate-50 text-sky-500 hover:text-sky-600 transition cursor-pointer border-none flex items-center justify-center rounded-lg"
        >
          <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex-1 overflow-x-auto scroll-smooth flex items-center gap-8 py-3 px-6 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar {
            display: none !important;
          }
        `}} />
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative py-1 text-xs font-bold transition-all cursor-pointer border-none bg-transparent whitespace-nowrap shrink-0 ${
                isActive ? "text-sky-500" : "text-slate-655 hover:text-slate-900"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-sky-400 rounded-full animate-in fade-in zoom-in duration-200" />
              )}
            </button>
          );
        })}
      </div>
      {showRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-2 z-10 p-1.5 bg-white hover:bg-slate-50 text-sky-500 hover:text-sky-600 transition cursor-pointer border-none flex items-center justify-center rounded-lg"
        >
          <ChevronRight className="h-5 w-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};

export default function TestSeriesDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs & Lock modal state
  const [activeSubTab, setActiveSubTab] = useState<string>("All");
  const [isLockModalOpen, setIsLockModalOpen] = useState<boolean>(false);
  const [selectedTestName, setSelectedTestName] = useState<string>("");

  // Student purchases and auth states
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<number[]>([]);
  const [purchasedCategoryIds, setPurchasedCategoryIds] = useState<number[]>([]);
  const [studentToken, setStudentToken] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  // Checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("student_token");
    const storedUser = localStorage.getItem("student_user");
    if (token) {
      setStudentToken(token);
    }
    if (storedUser) {
      try {
        setStudentProfile(JSON.parse(storedUser));
      } catch {}
    }
  }, []);

  const fetchPurchases = async () => {
    const token = localStorage.getItem("student_token");
    if (!token) return;
    try {
      const res = await fetch("/api/student/purchases", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const activePurchases = (data.purchases || []).filter((p: any) => p.isActive);
        const ids = activePurchases.map((p: any) => p.courseId);
        setPurchasedCourseIds(ids);

        const catIds = activePurchases
          .map((p: any) => p.course?.categoryId)
          .filter((catId: any) => catId !== null && catId !== undefined);
        setPurchasedCategoryIds(catIds);
      }
    } catch (err) {
      console.error("Failed to load purchases:", err);
    }
  };

  useEffect(() => {
    if (studentToken) {
      fetchPurchases();
    }
  }, [studentToken]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToken) {
      router.push("/student/login");
      return;
    }

    setPaymentLoading(true);

    try {
      // 1. Create order on backend
      const orderRes = await fetch("/api/student/purchases/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${studentToken}`
        },
        body: JSON.stringify({ courseId: course?.id })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to initiate payment.");

      const { orderId, keyId, currency } = orderData;

      if (!(window as any).Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please refresh the page.");
      }

      // 2. Open Razorpay Popup
      const options = {
        key: keyId,
        amount: orderData.amount, // in paise
        currency: currency,
        name: "Flarelap Foundation",
        description: `Premium Test Series Pass for ${course?.name}`,
        order_id: orderId,
        handler: async function (response: any) {
          setPaymentLoading(true);
          try {
            // 3. Verify payment on backend
            const verifyRes = await fetch("/api/student/purchases", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${studentToken}`
              },
              body: JSON.stringify({
                courseId: course?.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: parseFloat(orderData.coursePrice || "59")
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message || "Payment verification failed.");

            setIsCheckoutModalOpen(false);
            setIsLockModalOpen(false);
            await fetchPurchases();

            Swal.fire({
              title: "Payment Successful!",
              text: `You have successfully unlocked the Premium Pass for "${course?.name}".`,
              icon: "success",
              confirmButtonColor: "#047857"
            });
          } catch (err: any) {
            Swal.fire({
              title: "Verification Failed",
              text: err.message || "Payment completed, but verification failed. Please contact support.",
              icon: "warning",
              confirmButtonColor: "#dc2626"
            });
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: studentProfile?.name || "",
          email: studentProfile?.email || "",
          contact: studentProfile?.phone || ""
        },
        theme: {
          color: "#047857"
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      Swal.fire({
        title: "Payment Failed",
        text: err.message || "Something went wrong during checkout. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626"
      });
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const id = params?.id;
        if (!id) return;
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) {
          throw new Error("Failed to load test series details.");
        }
        const data = await res.json();
        setCourse(data.course);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourseDetails();
  }, [params]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "award":
        return <Award className="h-8 w-8 text-emerald-600" />;
      case "book":
        return <BookOpen className="h-8 w-8 text-emerald-600" />;
      case "text":
        return <FileText className="h-8 w-8 text-emerald-600" />;
      case "globe":
        return <Globe className="h-8 w-8 text-emerald-600" />;
      default:
        return <Award className="h-8 w-8 text-emerald-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Herader />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Herader />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <BookOpen className="h-16 w-16 text-slate-350 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Test Series Not Found</h2>
          <p className="text-slate-500 mt-2">The test series you are looking for does not exist or has been removed.</p>
          <Link href="/education" className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Education Page
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const meta = getCourseMetadata(course.name, course.id, course.premium, course.testSeries);
  const stats = getRealExamStats(course.name);

  // Determine if student has premium access
  const isCoursePassActive = 
    !course.premium || 
    (studentProfile && Number(studentProfile.course_id) === course.id) || 
    purchasedCourseIds.includes(course.id) ||
    (course.categoryId && purchasedCategoryIds.includes(course.categoryId));

  // Load from database if available, else fallback to generator
  const dbTests = course.testSeries || [];
  const rawSubTestsList = dbTests.length > 0 
    ? dbTests.map((t: any) => ({
        id: t.id.toString(),
        name: t.name,
        type: t.type,
        qs: t.qs,
        marks: t.marks,
        duration: t.duration,
        isFree: t.isFree
      }))
    : [];

  const subTestsList = rawSubTestsList.map(test => {
    let isFree = test.isFree;

    if (!course.premium || isCoursePassActive) {
      isFree = true;
    }

    return {
      ...test,
      isFree
    };
  });

  // Derive available test types dynamically from the actual test list
  const availableTypes = Array.from(new Set(subTestsList.map(t => t.type).filter(Boolean)));

  const filteredSubTests = subTestsList.filter((test) => {
    if (activeSubTab !== "All" && test.type !== activeSubTab) return false;
    return true;
  });

  const handleTestClick = (test: SubTest) => {
    if (!studentToken) {
      router.push(`/student/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
 
    if (test.isFree) {
      router.push(`/education/test-series/attempt/${test.id}?course=${course.id}`);
    } else {
      setSelectedTestName(test.name);
      setIsLockModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-950 font-sans antialiased flex flex-col justify-between">
      <div>
        <Herader />

        {/* Dynamic Header Banner */}
        <section className={`relative overflow-hidden bg-gradient-to-br ${meta.gradient} py-12 border-b border-slate-200/50`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link href="/" className="hover:text-emerald-700 transition">Home</Link>
              <span>/</span>
              <Link href="/education" className="hover:text-emerald-700 transition">Education</Link>
              <span>/</span>
              <span className="text-slate-800 font-bold line-clamp-1">{course.name}</span>
            </div>

            {/* Back Button */}
            <Link href="/education#exams-hub" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-750 hover:text-emerald-800 transition mb-6">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Mock Tests
            </Link>

            {/* Course Title and Info Banner */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-md p-2">
                    {getIconComponent(meta.iconName)}
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-600/10 border border-emerald-600/20 rounded-full px-3 py-1">
                    <Zap className="h-3.5 w-3.5 text-emerald-650" />
                    <span className="text-xs font-bold text-emerald-750">{meta.users} enrolled</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                  {course.name}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4.5 w-4.5 text-slate-400" />
                    {meta.totalTests} Total Tests
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-650">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    {meta.freeTests} Free Tests Available
                  </span>
                  <span className="flex items-center gap-1.5 text-teal-650">
                    <Globe className="h-4.5 w-4.5" />
                    {meta.languages}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details Grid Container */}
        <section className="py-12 px-5 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Details & Description */}
            <div className="lg:col-span-2 space-y-8">

              {/* Dynamic Mock Tests Listing */}
              <div id="practice-tests" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-black text-slate-900">
                    Practice Tests in this Series
                  </h2>
                  <div className="flex items-center gap-1 text-[11px] bg-slate-100 border border-slate-200 rounded-full px-3 py-1 text-slate-600 font-bold">
                    <span>{isCoursePassActive ? "All Free Tests Included" : (course.premium ? "First 4 Tests Free" : "All Free Tests Included")}</span>
                  </div>
                </div>

                {/* Sub-tabs filter — driven by actual test types in this series */}
                {availableTypes.length > 0 && (
                  <div className="border-b border-slate-105 pb-5">
                    <TabHeader
                      tabs={[
                        { id: "All", label: "All Tests" },
                        ...availableTypes.map(type => ({ id: type, label: type === "Full Mock" ? "Full Length Mocks" : type === "PYP" ? "Previous Papers" : `${type}s` }))
                      ]}
                      activeId={activeSubTab}
                      onChange={setActiveSubTab}
                    />
                  </div>
                )}

                {/* List of subtests */}
                <div className="space-y-3.5">
                  {filteredSubTests.map((test) => (
                    <div
                      key={test.id}
                      onClick={() => handleTestClick(test)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-600/35 hover:shadow-md transition-all duration-300 cursor-pointer gap-4"
                    >
                      <div className="space-y-1.5 max-w-lg">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            test.type === "Full Mock"
                              ? "bg-purple-100 text-purple-700"
                              : (test.type === "Subject Test" || test.type === "Chapter Test")
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {test.type}
                          </span>
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-800 transition">
                            {test.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                          <span>{test.qs} Questions</span>
                          <span>•</span>
                          <span>{test.marks} Marks</span>
                          <span>•</span>
                          <span>{test.duration} Mins</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        {test.isFree ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 rounded-full px-3 py-1">
                              Free Test
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTestClick(test);
                              }}
                              className="flex items-center gap-1 px-4 py-2 bg-[#00c2ff] hover:bg-[#00b0e6] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] cursor-pointer border-none"
                            >
                              <Play className="h-3 w-3 fill-white" />
                              Attempt
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 rounded-full px-3 py-1 flex items-center gap-1">
                              <Lock className="h-3 w-3 text-purple-650" />
                              Premium
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTestClick(test);
                              }}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition active:scale-[0.98] cursor-pointer border-none flex items-center gap-1"
                            >
                              <Lock className="h-3 w-3 text-slate-500" />
                              Unlock
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>

            {/* Right Col: Sticky Action Box */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
                <div>
                  <span className="inline-block bg-emerald-50 border border-emerald-200/50 text-[10px] font-black uppercase text-emerald-800 px-3 py-1 rounded-full">
                    {course.premium ? "Premium Pass" : "Free Access"}
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {course.premium ? `₹${parseFloat(course.price?.toString() || "59")}` : "FREE"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {course.premium ? "/ Month" : "Mock Tests Included"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Active Period</span>
                    <span className="text-slate-800 font-bold">{course.premium ? "1 Month" : "Lifetime"}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Total Tests</span>
                    <span className="text-slate-800 font-bold">{meta.totalTests}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Free Tests</span>
                    <span className="text-emerald-650 font-bold">{meta.freeTests}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!studentToken) {
                      router.push(`/student/register?course=${course.id}`);
                    } else if (course.premium && !purchasedCourseIds.includes(course.id) && Number(studentProfile?.course_id) !== course.id) {
                      setIsCheckoutModalOpen(true);
                    } else {
                      document.getElementById("practice-tests")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black rounded-xl text-xs uppercase tracking-wider text-center transition active:scale-[0.98] shadow-md shadow-emerald-700/10 cursor-pointer border-none"
                >
                  {!studentToken 
                    ? "Continue to Register" 
                    : (course.premium && !purchasedCourseIds.includes(course.id) && Number(studentProfile?.course_id) !== course.id) 
                      ? `Pay for Next Month - ₹${parseFloat(course.price?.toString() || "59")}` 
                      : "Start Mock Test"}
                </button>

                <p className="text-[11px] text-center text-slate-400 font-semibold leading-relaxed">
                  {!studentToken 
                    ? "Clicking continue will take you to the registration page. Complete registration to start your practice test."
                    : (course.premium && !purchasedCourseIds.includes(course.id) && Number(studentProfile?.course_id) !== course.id)
                      ? "Upgrade to premium pass to unlock all mock test items in this series."
                      : "Access pass is active. Click to view all mock tests below."}
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Upgrade to Premium Unlock Modal */}
      {isLockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative space-y-4 text-left">
            <button 
              onClick={() => setIsLockModalOpen(false)} 
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition cursor-pointer border-none bg-transparent"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1.5">
              <span className="inline-block text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded border border-purple-200/50">Premium Locked</span>
              <h3 className="text-lg font-black text-slate-900 mt-2">Unlock Test Item</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans">
                "{selectedTestName}" is a premium mock test. Please upgrade to the Premium Pass to unlock full access.
              </p>
            </div>

            <hr className="border-slate-100" />

            <div className="flex flex-col gap-3.5 pt-2">
              <button
                onClick={() => {
                  setIsLockModalOpen(false);
                  if (!studentToken) {
                    router.push(`/student/register?course=${course.id}`);
                  } else {
                    setIsCheckoutModalOpen(true);
                  }
                }}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center transition active:scale-[0.98] cursor-pointer border-none shadow-md shadow-emerald-700/10"
              >
                Get Premium Pass - ₹{parseFloat(course.price?.toString() || "59")} / Month
              </button>
              <button
                onClick={() => setIsLockModalOpen(false)}
                className="w-full py-3 bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider text-center transition active:scale-[0.98] cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade to Premium Checkout Modal */}
      {isCheckoutModalOpen && course && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative space-y-5 text-slate-955">
            <button 
              onClick={() => setIsCheckoutModalOpen(false)} 
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition cursor-pointer border-none bg-transparent"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1 text-left">
              <span className="inline-block text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">Checkout Portal</span>
              <h3 className="text-lg font-black text-slate-900 mt-2">Unlock Premium Pass</h3>
              <p className="text-xs text-slate-500 font-semibold">Get instant full access to {course.name} Test Series</p>
            </div>

            <hr className="border-slate-105" />

            {/* Price block */}
            <div className="flex justify-between items-center bg-slate-50 rounded-xl p-4 border border-slate-150 text-left">
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Premium Access</span>
                <span className="text-sm font-semibold text-slate-800">1 Month Validity</span>
              </div>
              <span className="text-xl font-black text-emerald-700">₹{parseFloat(course.price?.toString() || "59")}.00</span>
            </div>

            <div className="text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-left">
              Payments are securely processed online. You can pay via UPI, Credit/Debit Card, Netbanking, or Wallets using Razorpay.
            </div>

            {/* Form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {/* Submit Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center transition active:scale-[0.98] cursor-pointer border-none shadow-md shadow-emerald-700/10 flex items-center justify-center gap-1.5"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay Online via Razorpay`
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="w-full py-3 bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider text-center transition active:scale-[0.98] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Footer />
    </div>
  );
}
