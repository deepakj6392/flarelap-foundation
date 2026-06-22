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
  Play
} from "lucide-react";

interface Course {
  id: number;
  name: string;
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

const getCourseMetadata = (courseName: string, courseId: number): CourseMetadata => {
  const name = courseName.toLowerCase();
  
  if (name.includes("group d mock test series") || name.includes("group d")) {
    return {
      users: "1078.2k Users",
      totalTests: 1723,
      freeTests: 6,
      languages: "English, Hindi + 8 More",
      bullets: ["2 Live Test", "30 Full Test", "60 Sectional Test", "+1631 more tests"],
      gradient: "from-purple-200/50 to-purple-50",
      iconName: "award"
    };
  }
  if (name.includes("rrb alp") || name.includes("alp")) {
    return {
      users: "198.3k Users",
      totalTests: 990,
      freeTests: 5,
      languages: "English, Hindi + 8 More",
      bullets: ["3 Live Test", "139 Chapter Test (CBT 1)", "30 Subject Test (CBT 1)", "+818 more tests"],
      gradient: "from-pink-200/50 to-pink-50",
      iconName: "book"
    };
  }
  if (name.includes("current affairs") || name.includes("ca 2026")) {
    return {
      users: "1002.3k Users",
      totalTests: 473,
      freeTests: 46,
      languages: "English, Hindi + 8 More",
      bullets: ["17 Quarterly Revision: Jan-Feb-Mar", "16 2025 REVISION LIVE TEST", "14 Special Tests", "+426 more tests"],
      gradient: "from-indigo-200/50 to-indigo-50",
      iconName: "text"
    };
  }
  if (name.includes("rrb ntpc")) {
    return {
      users: "1256.3k Users",
      totalTests: 1603,
      freeTests: 23,
      languages: "English, Hindi + 8 More",
      bullets: ["274 Chapter Test (CBT 2)", "29 Current Affairs (CBT 2)", "30 Sectional Test (CBT 2)", "+1270 more tests"],
      gradient: "from-purple-200/50 to-purple-50",
      iconName: "award"
    };
  }
  if (name.includes("mission jrf")) {
    return {
      users: "95.0k Users",
      totalTests: 601,
      freeTests: 23,
      languages: "English, Hindi",
      bullets: ["333 Unit Test", "60 Full Test", "54 Full Mock Test", "+154 more tests"],
      gradient: "from-pink-200/50 to-pink-50",
      iconName: "book"
    };
  }
  if (name.includes("ssc maths")) {
    return {
      users: "1412.1k Users",
      totalTests: 1877,
      freeTests: 2,
      languages: "English, Hindi",
      bullets: ["284 SSC CGL PYST", "74 SSC CPO PYST (New Pattern)", "120 SSC Selection Post PYST", "+1399 more tests"],
      gradient: "from-indigo-200/50 to-indigo-50",
      iconName: "award"
    };
  }

  const hash = courseName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + (courseId || 0);
  const userCount = ((hash % 800) + 50).toFixed(1) + "k";
  const totalTests = (hash % 1500) + 100;
  const freeTests = (hash % 30) + 2;
  const languages = hash % 2 === 0 ? "English, Hindi + 5 More" : "English, Hindi";
  
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
    languages,
    bullets: [
      `${Math.floor(totalTests * 0.2)} Subject Tests`,
      `${Math.floor(totalTests * 0.4)} Chapter Tests`,
      `${Math.floor(totalTests * 0.15)} Full Length Tests`,
      `+${Math.floor(totalTests * 0.25)} more tests`
    ],
    gradient,
    iconName
  };
};

export default function TestSeriesDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const meta = getCourseMetadata(course.name, course.id);

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

              {/* Card 3: Package/Test Breakdowns */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                  Included Sub-Tests
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {meta.bullets.map((bullet, idx) => {
                    const isLast = idx === meta.bullets.length - 1;
                    return (
                      <li key={idx} className="flex items-center gap-2.5 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${isLast ? "bg-emerald-500" : "bg-teal-500"}`} />
                        <span>{bullet}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Right Col: Sticky Action Box */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
                <div>
                  <span className="inline-block bg-emerald-50 border border-emerald-200/50 text-[10px] font-black uppercase text-emerald-800 px-3 py-1 rounded-full">
                    Recommended Pass
                  </span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">FREE</span>
                    <span className="text-xs font-semibold text-slate-500">Mock Tests Included</span>
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
                  onClick={() => router.push(`/student/register?course=${encodeURIComponent(course.name)}`)}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black rounded-xl text-xs uppercase tracking-wider text-center transition active:scale-[0.98] shadow-md shadow-emerald-700/10 cursor-pointer"
                >
                  Continue to Register
                </button>

                <p className="text-[11px] text-center text-slate-400 font-semibold leading-relaxed">
                  Clicking continue will take you to the registration page. Complete registration to start your practice test.
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
