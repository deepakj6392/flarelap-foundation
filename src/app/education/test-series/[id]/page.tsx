"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Herader from "@/components/common/Herader";
import Footer from "@/components/common/Footer";
import { 
  Award, 
  BookOpen, 
  FileText, 
  Globe, 
  Zap, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  Play,
  Lock,
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Loader2
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
  testSeries?: DBTestSeries[];
}

interface SubTest {
  id: string;
  name: string;
  type: string;
  qs: number;
  marks: number;
  duration: number;
  isFree: boolean;
}

interface CourseMetadata {
  users: string;
  totalTests: number;
  freeTests: number;
  languages: string;
  bullets: string[];
  gradient: string;
  iconName: "award" | "book" | "text" | "globe";
}

interface RealExamStats {
  questions: number;
  marks: number;
  duration: number;
  language: string;
}

const getRealExamStats = (courseName: string): RealExamStats => {
  const name = courseName.toLowerCase();
  if (name.includes("ssc cgl") || name.includes("cgl")) {
    return { questions: 100, marks: 200, duration: 60, language: "English, Hindi" };
  }
  if (name.includes("gate")) {
    return { questions: 65, marks: 100, duration: 180, language: "English Only" };
  }
  if (name.includes("sebi")) {
    return { questions: 100, marks: 100, duration: 60, language: "English, Hindi" };
  }
  if (name.includes("ctet")) {
    return { questions: 150, marks: 150, duration: 150, language: "English, Hindi" };
  }
  if (name.includes("fitter")) {
    return { questions: 50, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("electrician")) {
    return { questions: 50, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("rrb je") || name.includes("je ")) {
    return { questions: 100, marks: 100, duration: 90, language: "English, Hindi" };
  }
  if (name.includes("judiciary")) {
    return { questions: 100, marks: 100, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("paramedical")) {
    return { questions: 100, marks: 100, duration: 90, language: "English, Hindi" };
  }
  if (name.includes("electronic mechanic")) {
    return { questions: 50, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("rrb ntpc") || name.includes("ntpc")) {
    return { questions: 100, marks: 100, duration: 90, language: "English, Hindi" };
  }
  if (name.includes("sbi po")) {
    return { questions: 100, marks: 100, duration: 60, language: "English, Hindi" };
  }
  if (name.includes("neet")) {
    return { questions: 45, marks: 180, duration: 50, language: "English, Hindi" };
  }
  if (name.includes("nda")) {
    return { questions: 150, marks: 600, duration: 150, language: "English, Hindi" };
  }
  if (name.includes("upsc")) {
    return { questions: 100, marks: 200, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("police") || name.includes("constable")) {
    return { questions: 150, marks: 300, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("b.ed")) {
    return { questions: 100, marks: 200, duration: 180, language: "English, Hindi" };
  }
  return { questions: 100, marks: 100, duration: 90, language: "English, Hindi" };
};

const getCourseMetadata = (courseName: string, courseId: number, isPremium: boolean): CourseMetadata => {
  const hash = courseName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + (courseId || 0);
  const userCount = ((hash % 400) + 400).toFixed(1) + "k";
  const totalTests = 150;
  const freeTests = isPremium ? 3 : 150;
  
  const stats = getRealExamStats(courseName);

  const gradients = [
    "from-purple-200/50 to-purple-50",
    "from-pink-200/50 to-pink-50",
    "from-indigo-200/50 to-indigo-50"
  ];
  const gradient = gradients[hash % gradients.length];
  
  const icons: ("award" | "book" | "text" | "globe")[] = ["award", "book", "text", "globe"];
  const iconName = icons[hash % icons.length];

  return {
    users: `${userCount} Users`,
    totalTests,
    freeTests,
    languages: stats.language,
    bullets: isPremium ? [
      "2 Full Mock Tests (Free)",
      "1 Subject Test (Free)",
      "147 Premium Pass Tests",
      `Exam Pattern: ${stats.questions} Qs | ${stats.duration} Mins`
    ] : [
      "5 Full Length Mock Tests",
      "3 Subject Practice Tests",
      "142 Chapter Practice Tests",
      `100% Free Access for All`
    ],
    gradient,
    iconName
  };
};

const getCourseSubjects = (courseName: string) => {
  const name = courseName.toLowerCase();
  
  if (name.includes("ssc cgl") || name.includes("cgl")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 25, marks: 50, duration: 20 },
      { name: "General Awareness", qs: 25, marks: 50, duration: 10 },
      { name: "Quantitative Aptitude", qs: 25, marks: 50, duration: 20 },
      { name: "English Comprehension", qs: 25, marks: 50, duration: 10 }
    ];
  }
  if (name.includes("gate")) {
    return [
      { name: "General Aptitude", qs: 10, marks: 15, duration: 30 },
      { name: "Engineering Mathematics", qs: 10, marks: 15, duration: 30 },
      { name: "Discrete Mathematics & Databases", qs: 15, marks: 20, duration: 40 },
      { name: "Computer Architecture & OS", qs: 15, marks: 25, duration: 40 },
      { name: "Algorithms & Data Structures", qs: 15, marks: 25, duration: 40 }
    ];
  }
  if (name.includes("sebi")) {
    return [
      { name: "General Awareness & Financial Sector", qs: 25, marks: 25, duration: 15 },
      { name: "English Language", qs: 25, marks: 25, duration: 15 },
      { name: "Quantitative Aptitude", qs: 25, marks: 25, duration: 15 },
      { name: "Test of Reasoning", qs: 25, marks: 25, duration: 15 }
    ];
  }
  if (name.includes("ctet")) {
    return [
      { name: "Child Development and Pedagogy", qs: 30, marks: 30, duration: 30 },
      { name: "Language I (English/Hindi)", qs: 30, marks: 30, duration: 30 },
      { name: "Language II (English/Hindi/Sanskrit)", qs: 30, marks: 30, duration: 30 },
      { name: "Mathematics", qs: 30, marks: 30, duration: 30 },
      { name: "Environmental Studies", qs: 30, marks: 30, duration: 30 }
    ];
  }
  if (name.includes("fitter")) {
    return [
      { name: "Trade Theory (Fitter Shop & Safety)", qs: 20, marks: 40, duration: 45 },
      { name: "Workshop Calculation & Science", qs: 15, marks: 30, duration: 35 },
      { name: "Engineering Drawing", qs: 15, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("electrician")) {
    return [
      { name: "Trade Theory (Electrical Circuits & Machines)", qs: 20, marks: 40, duration: 45 },
      { name: "Workshop Calculation & Science", qs: 15, marks: 30, duration: 35 },
      { name: "Engineering Drawing", qs: 15, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("rrb je") || name.includes("je ")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 15, marks: 15, duration: 15 },
      { name: "General Awareness", qs: 15, marks: 15, duration: 10 },
      { name: "General Science", qs: 15, marks: 15, duration: 15 },
      { name: "Civil & Allied Engineering", qs: 55, marks: 55, duration: 50 }
    ];
  }
  if (name.includes("judiciary")) {
    return [
      { name: "Constitutional Law", qs: 25, marks: 25, duration: 45 },
      { name: "Civil Procedure Code & Law of Evidence", qs: 25, marks: 25, duration: 45 },
      { name: "Indian Penal Code & Criminal Procedure", qs: 25, marks: 25, duration: 45 },
      { name: "Contract & Property Law", qs: 25, marks: 25, duration: 45 }
    ];
  }
  if (name.includes("paramedical")) {
    return [
      { name: "Anatomy & Physiology", qs: 25, marks: 25, duration: 20 },
      { name: "Fundamentals of Nursing", qs: 25, marks: 25, duration: 20 },
      { name: "Community Health Nursing", qs: 25, marks: 25, duration: 25 },
      { name: "Medical Surgical Nursing", qs: 25, marks: 25, duration: 25 }
    ];
  }
  if (name.includes("electronic mechanic")) {
    return [
      { name: "Electronic Theory & Components", qs: 20, marks: 40, duration: 45 },
      { name: "Workshop Calculation & Science", qs: 15, marks: 30, duration: 35 },
      { name: "Engineering Drawing", qs: 15, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("rrb ntpc") || name.includes("ntpc")) {
    return [
      { name: "General Awareness", qs: 40, marks: 40, duration: 35 },
      { name: "Mathematics", qs: 30, marks: 30, duration: 30 },
      { name: "General Intelligence & Reasoning", qs: 30, marks: 30, duration: 25 }
    ];
  }
  if (name.includes("sbi po")) {
    return [
      { name: "English Language", qs: 30, marks: 30, duration: 20 },
      { name: "Quantitative Aptitude", qs: 35, marks: 35, duration: 20 },
      { name: "Reasoning Ability", qs: 35, marks: 35, duration: 20 }
    ];
  }
  if (name.includes("neet")) {
    return [
      { name: "Mechanics & General Physics", qs: 15, marks: 60, duration: 15 },
      { name: "Electrodynamics & Magnetism", qs: 15, marks: 60, duration: 15 },
      { name: "Optics & Modern Physics", qs: 15, marks: 60, duration: 20 }
    ];
  }
  if (name.includes("nda")) {
    return [
      { name: "English Vocabulary & Grammar", qs: 50, marks: 200, duration: 50 },
      { name: "Physics & Chemistry", qs: 40, marks: 160, duration: 40 },
      { name: "General Science & History", qs: 30, marks: 120, duration: 30 },
      { name: "Geography & Current Affairs", qs: 30, marks: 120, duration: 30 }
    ];
  }
  if (name.includes("upsc")) {
    return [
      { name: "History of India & Indian National Movement", qs: 20, marks: 40, duration: 25 },
      { name: "Indian and World Geography", qs: 20, marks: 40, duration: 25 },
      { name: "Indian Polity and Governance", qs: 20, marks: 40, duration: 25 },
      { name: "Economic and Social Development", qs: 20, marks: 40, duration: 25 },
      { name: "General Science & Ecology", qs: 20, marks: 40, duration: 20 }
    ];
  }
  if (name.includes("police") || name.includes("constable")) {
    return [
      { name: "General Knowledge", qs: 38, marks: 76, duration: 30 },
      { name: "General Hindi", qs: 37, marks: 74, duration: 30 },
      { name: "Numerical & Mental Ability", qs: 38, marks: 76, duration: 30 },
      { name: "Mental Aptitude & Reasoning", qs: 37, marks: 74, duration: 30 }
    ];
  }
  if (name.includes("b.ed")) {
    return [
      { name: "General Knowledge", qs: 25, marks: 50, duration: 45 },
      { name: "Language (Hindi or English)", qs: 25, marks: 50, duration: 45 },
      { name: "General Mental Ability", qs: 25, marks: 50, duration: 45 },
      { name: "Subject Specialisation (Arts/Science/Commerce)", qs: 25, marks: 50, duration: 45 }
    ];
  }
  return [
    { name: "General Awareness", qs: 25, marks: 25, duration: 20 },
    { name: "Quantitative Aptitude", qs: 25, marks: 25, duration: 25 },
    { name: "Reasoning Ability", qs: 25, marks: 25, duration: 25 },
    { name: "Language & Comprehension", qs: 25, marks: 25, duration: 20 }
  ];
};

const generateSubTestsList = (courseName: string, isPremium: boolean): SubTest[] => {
  const stats = getRealExamStats(courseName);
  const subjects = getCourseSubjects(courseName);
  
  const tests: SubTest[] = [];
  
  // 1. Add 5 Full Mocks
  for (let i = 1; i <= 5; i++) {
    tests.push({
      id: `fmt-${i}`,
      name: `Full Length Mock Test ${i}`,
      type: "Full Mock",
      qs: stats.questions,
      marks: stats.marks,
      duration: stats.duration,
      isFree: false
    });
  }
  
  // 2. Add Subject Tests based on the real subjects
  subjects.forEach((sub, index) => {
    tests.push({
      id: `st-${index + 1}`,
      name: `Subject Test: ${sub.name}`,
      type: "Subject Test",
      qs: sub.qs,
      marks: sub.marks,
      duration: sub.duration,
      isFree: false
    });
  });
  
  // 3. Add Chapter Tests
  tests.push({
    id: "ct-1",
    name: "Chapter Test 1: Foundation Concept Booster",
    type: "Chapter Test",
    qs: 15,
    marks: 30,
    duration: 15,
    isFree: false
  });
  tests.push({
    id: "ct-2",
    name: "Chapter Test 2: Core Topic Evaluation",
    type: "Chapter Test",
    qs: 20,
    marks: 40,
    duration: 20,
    isFree: false
  });
  
  // 4. Add Previous Year Papers
  tests.push({
    id: "pyp-1",
    name: "Previous Year Question Paper (2025)",
    type: "PYP",
    qs: stats.questions,
    marks: stats.marks,
    duration: stats.duration,
    isFree: false
  });
  
  // Apply free/paid logic dynamically
  tests.forEach((test, idx) => {
    if (!isPremium) {
      test.isFree = true;
    } else {
      test.isFree = (idx < 3); // exactly first 3 tests are Free
    }
  });
  
  return tests;
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
  const [studentToken, setStudentToken] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  // Checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [paymentTab, setPaymentTab] = useState<"card" | "upi">("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
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
        const ids = (data.purchases || []).map((p: any) => p.courseId);
        setPurchasedCourseIds(ids);
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

    // Simulate 1.5s delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const res = await fetch("/api/student/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          courseId: course?.id,
          amount: 299.00,
          paymentMethod: paymentTab === "card" ? "Credit Card" : "UPI QR Scan"
        })
      });

      const data = await res.json();
      if (res.ok) {
        setIsCheckoutModalOpen(false);
        setIsLockModalOpen(false);
        await fetchPurchases();
        
        Swal.fire({
          title: "Payment Successful!",
          text: `You have successfully unlocked the Premium Pass for "${course?.name}".`,
          icon: "success",
          confirmButtonColor: "#047857"
        });
      } else {
        throw new Error(data.message || "Failed to complete purchase.");
      }
    } catch (err: any) {
      Swal.fire({
        title: "Payment Failed",
        text: err.message || "Something went wrong during checkout. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626"
      });
    } finally {
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

  const meta = getCourseMetadata(course.name, course.id, course.premium);
  const stats = getRealExamStats(course.name);

  // Determine if student has premium access
  const isCoursePassActive = !course.premium || (studentProfile && Number(studentProfile.course_id) === course.id) || purchasedCourseIds.includes(course.id);

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
    : generateSubTestsList(course.name, course.premium);

  // Apply pricing overrides at runtime
  const subTestsList = rawSubTestsList.map(test => ({
    ...test,
    isFree: isCoursePassActive ? true : test.isFree
  }));

  const filteredSubTests = subTestsList.filter((test) => {
    if (activeSubTab === "All") return true;
    if (activeSubTab === "Full Mock") return test.type === "Full Mock";
    if (activeSubTab === "Subject Test") return test.type === "Subject Test" || test.type === "Chapter Test";
    if (activeSubTab === "PYP") return test.type === "PYP";
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
              {/* Card 1: Description */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                  Test Series Description
                </h2>
                <p className="text-sm leading-8 text-slate-600 font-medium">
                  This master mock test series package is professionally curated to help students build absolute exam readiness. The program features structured questions designed by top academic educators and experienced rank-holders. With precise real-time performance scorecards, dynamic negative-marking models, and descriptive answer keys, candidates can diagnose conceptual bottlenecks and accelerate accuracy rates.
                </p>
                <p className="text-sm leading-8 text-slate-600 font-medium">
                  Attempt the free tests to benchmark your preparation speed and compare rankings with hundreds of thousands of aspirants nationwide.
                </p>
              </div>

              {/* Dynamic Mock Tests Listing */}
              <div id="practice-tests" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-black text-slate-900">
                    Practice Tests in this Series
                  </h2>
                  <div className="flex items-center gap-1 text-[11px] bg-slate-100 border border-slate-200 rounded-full px-3 py-1 text-slate-600 font-bold">
                    <span>{isCoursePassActive ? "All Free Tests Included" : (course.premium ? "3 Free Tests Included" : "All Free Tests Included")}</span>
                  </div>
                </div>

                {/* Sub-tabs filter */}
                <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
                  {[
                    { id: "All", label: "All Tests" },
                    { id: "Full Mock", label: "Full Length Mocks" },
                    { id: "Subject Test", label: "Subject & Chapter Tests" },
                    { id: "PYP", label: "Previous Papers" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSubTab(tab.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border-none outline-none ${
                        activeSubTab === tab.id
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

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

              {/* Card 2: Features Included */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                  Key Features of this Test Series
                </h2>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { title: "Real Exam Simulation", desc: "Simulate authentic computer-based test (CBT) environments under actual time limits." },
                    { title: "Performance Analysis", desc: "Gain actionable accuracy ratings, sectional analysis, and comparative percentile ranks." },
                    { title: "Detailed Solutions", desc: "Access comprehensive explanations and alternative shortcut methods for all questions." },
                    { title: "Multi-Language Support", desc: "Attempt exams in English, Hindi, and regional languages as per the latest guidelines." }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 border border-emerald-100 text-emerald-600">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{feature.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{feature.desc}</p>
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
                      {course.premium ? "₹299" : "FREE"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {course.premium ? "/ Year" : "Mock Tests Included"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Active Period</span>
                    <span className="text-slate-800 font-bold">12 Months</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Format</span>
                    <span className="text-slate-800 font-bold">Online CBT</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Accuracy Analytics</span>
                    <span className="text-emerald-650 font-bold">Included</span>
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
                      ? "Buy Premium Pass - ₹299" 
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
                Get Premium Pass - ₹299 / Year
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
      {isCheckoutModalOpen && (
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
              <h3 className="text-lg font-black text-slate-900 mt-2">Secure Payment Pass</h3>
              <p className="text-xs text-slate-500 font-semibold">Unlock full access to {course.name} Test Series</p>
            </div>

            <hr className="border-slate-105" />

            {/* Price block */}
            <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3.5 border border-slate-150 text-left">
              <span className="text-xs font-extrabold text-slate-500">Premium Pass (1 Year)</span>
              <span className="text-base font-black text-emerald-700">₹299.00</span>
            </div>

            {/* Payment Method tabs */}
            <div className="flex gap-2">
              {[
                { id: "card", label: "Card", icon: CreditCard },
                { id: "upi", label: "UPI Scan", icon: QrCode }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPaymentTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      paymentTab === tab.id 
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs font-semibold text-left">
              {paymentTab === "card" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-slate-550 uppercase tracking-wider text-[10px] font-black">Cardholder Name</label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-555 uppercase tracking-wider text-[10px] font-black">Card Number</label>
                    <input
                      required
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-555 uppercase tracking-wider text-[10px] font-black">Expiry</label>
                      <input
                        required
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-555 uppercase tracking-wider text-[10px] font-black">CVV</label>
                      <input
                        required
                        type="password"
                        placeholder="***"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-150 text-center space-y-3">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-inner">
                    <div className="w-32 h-32 bg-slate-100 flex items-center justify-center border-2 border-dashed border-emerald-500 rounded-lg relative overflow-hidden">
                      <QrCode className="h-20 w-20 text-slate-800" />
                      <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold max-w-xs leading-relaxed">
                    Scan the QR code with any UPI app (PhonePe, Google Pay, Paytm) to pay securely.
                  </p>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-105 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold">
                    <Smartphone className="h-3.5 w-3.5" />
                    UPI Gateway Active
                  </div>
                </div>
              )}

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
                      Processing payment...
                    </>
                  ) : (
                    `Confirm & Pay ₹299`
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

      <Footer />
    </div>
  );
}
