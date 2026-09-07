"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { getCourseMetadata } from "@/lib/testSeriesGenerator";
import { sampleImages } from "@/constants/images";
import {
  BookOpen,
  GraduationCap,
  Laptop,
  Award,
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  FileText,
  Search,
  Zap,
  Globe
} from "lucide-react";

interface ExamItem {
  name: string;
  tests: string;
  details: string;
  badge: "Free" | "Premium";
}

interface ExamCategory {
  id: string;
  label: string;
  exams: ExamItem[];
}

const initiatives = [
  {
    title: "Vidya Digital Literacy",
    description: "Equipping rural communities with modern computer labs, high-speed internet, and hands-on digital skills instruction. Students learn basic programming, office productivity software, and safe internet navigation.",
    icon: Laptop,
    badge: "Technology Access",
  },
  {
    title: "Shiksha Scholarships",
    description: "Removing financial barriers for meritorious students from marginalized backgrounds. Our sponsorships cover direct school tuition fees, custom uniforms, backpacks, and complete textbook sets for the academic year.",
    icon: GraduationCap,
    badge: "Financial Relief",
  },
  {
    title: "After-School Support Hubs",
    description: "Creating safe spaces inside local communities where students receive homework assistance, exam preparation, and conceptual reviews from qualified tutors. This prevents dropout rates and bridges learning gaps.",
    icon: BookOpen,
    badge: "Daily Mentorship",
  },
  {
    title: "Girl Child Education Initiative",
    description: "Increasing classroom retention rates for girls by offering focused hygiene supplies, dedicated counseling sessions, family workshops, and merit-based high school grants to ensure complete secondary completion.",
    icon: Award,
    badge: "Gender Equity",
  },
];

const stats = [
  { value: "4,500+", label: "Students Empowered", desc: "Accessing quality learning support" },
  { value: "18", label: "Learning Hubs Active", desc: "Located directly within needy sectors" },
  { value: "94%", label: "Retention Rate", desc: "Students continuing their school journey" },
  { value: "320+", label: "Laptops Deployed", desc: "Supporting digital classes & exams" },
];

const journeySteps = [
  {
    step: "01",
    title: "Grassroots Identification",
    desc: "Our field volunteers conduct surveys in under-resourced villages to identify children who have dropped out or are at extreme risk of dropping out due to economic hardships.",
  },
  {
    step: "02",
    title: "Holistic Resource Provision",
    desc: "Enrolled students receive uniforms, notebooks, reference textbooks, and access to digital labs. We cover standard school fee arrears to ensure zero interruption.",
  },
  {
    step: "03",
    title: "Daily Mentoring & Hub Classes",
    desc: "Students attend our community hubs after standard school hours, getting custom academic tutoring, character building, and fundamental technological training.",
  },
  {
    step: "04",
    title: "High School & Career Pathway",
    desc: "As students mature, we connect them with professional counselors, scholarship programs for higher education, and industry skills training for direct employment.",
  },
];

const supportOptions = [
  {
    title: "Sponsor a Student's Future",
    desc: "Just $30 a month covers all educational needs (school fees, textbooks, uniform, and tutoring) for a child in one of our rural hubs.",
    cta: "Become a Sponsor",
    href: "#contact",
    highlight: true,
  },
  {
    title: "Donate Digital Equipment",
    desc: "We accept working computers, tablets, and learning software to equip our newly proposed digital centers in tier-3 communities.",
    cta: "Donate Gadgets",
    href: "#contact",
    highlight: false,
  },
  {
    title: "Volunteer as an Educator",
    desc: "Share your knowledge. Spend 2-4 hours a week teaching English, math, or basic programming either in person or online.",
    cta: "Apply to Tutor",
    href: "#contact",
    highlight: false,
  },
];


export default function EducationPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [studentToken, setStudentToken] = useState<string | null>(null);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<number[]>([]);
  const [purchasingCourseId, setPurchasingCourseId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("student_token");
    if (token) {
      setStudentToken(token);
      fetchStudentPurchases(token);
    }
  }, []);

  const fetchStudentPurchases = async (token: string) => {
    try {
      const res = await fetch("/api/student/purchases", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const pIds = (data.purchases || []).map((p: any) => p.courseId);
        setPurchasedCourseIds(pIds);
      }
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        let fetchedCourses: any[] = [];
        if (res.ok) {
          const data = await res.json();
          fetchedCourses = data.courses || [];
        }
        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "award":
        return <Award className="h-6 w-6" />;
      case "book":
        return <BookOpen className="h-6 w-6" />;
      case "text":
        return <FileText className="h-6 w-6" />;
      case "globe":
        return <Globe className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  // Resolve category purely from DB relation
  const getCourseCategory = (course: any): string =>
    course.category?.name ?? "Uncategorized";

  // Build category list dynamically from actual courses in DB (alphabetically sorted)
  const dynamicCategories = [
    "All",
    ...Array.from(new Set(courses.map(getCourseCategory))).sort((a, b) =>
      a.localeCompare(b)
    )
  ];

  let filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === "All") {
      return matchesSearch;
    } else {
      return matchesSearch && getCourseCategory(course) === activeCategory;
    }
  });

  if (activeCategory === "All") {
    const groups: { [key: string]: typeof courses } = {};
    filteredCourses.forEach((course) => {
      const cat = getCourseCategory(course);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(course);
    });

    const allCats = Object.keys(groups).sort((a, b) => a.localeCompare(b));
    const interleaved: typeof courses = [];
    const maxLen = Math.max(0, ...allCats.map((cat) => groups[cat].length));

    for (let i = 0; i < maxLen; i++) {
      allCats.forEach((cat) => {
        if (i < groups[cat].length) interleaved.push(groups[cat][i]);
      });
    }
    filteredCourses = interleaved;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-950 font-sans antialiased">
      <Herader />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#f5f3ff_45%,#fff1f6_100%)] py-20 lg:py-24">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.25]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="max-w-3xl text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/85 px-4 py-2 text-xs font-bold text-violet-900 shadow-sm backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#5d00e5] animate-pulse" />
                Empowerment through Learning
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.12] text-slate-900 sm:text-5xl lg:text-6xl tracking-tight">
                Empowering Minds,
                <br />
                <span className="text-brand-gradient">
                  Shaping Brighter Futures.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
                At Flarelap Global Foundation, we believe that education is the single most powerful tool to break generational poverty. We build supportive learning hubs, offer digital literacy camps, and provide direct sponsorships to help students stay in school.
              </p>

              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <Link
                  href="#get-involved"
                  className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 hover:scale-[1.01] active:scale-100"
                >
                  Sponsor a Child Now
                </Link>
                <Link
                  href="#exams-hub"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition hover:border-[#5d00e5] hover:text-[#5d00e5] hover:scale-[1.01] active:scale-100"
                >
                  Explore Exam Prep Courses
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto aspect-4/3 w-full max-w-[500px] overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-2xl shadow-violet-900/10">
                <Image
                  src={sampleImages.education}
                  alt="Students studying inside computer lab"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Initiatives Grid */}
        <section id="initiatives" className="bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl text-left">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-gradient">What We Do</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Strategic programs addressing key learning barriers.
              </h2>
              <p className="mt-3 text-sm text-slate-600">Our programs focus on physical items, conceptual training, and technological skills to deliver balanced growth.</p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {initiatives.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-8 shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/20 hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold tracking-wide text-emerald-800">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-extrabold text-slate-950 transition group-hover:text-emerald-800">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 font-medium">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Test Series by Categories Section */}
        <section id="exams-hub" className="bg-slate-50 py-16 px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-100 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Test Series by Categories
                </h2>
                <div className="relative w-full sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Test Series"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition duration-150 ease-in-out"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row h-auto md:h-[800px]">
                {/* Sidebar Categories */}
                <div className="w-full md:w-64 border-r border-slate-100 bg-white overflow-y-auto hidden md:block">
                  <ul className="flex flex-col py-2">
                    {dynamicCategories.map((cat, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => setActiveCategory(cat)}
                          className={`w-full text-left px-6 py-3 text-sm transition-colors cursor-pointer outline-none ${activeCategory === cat
                            ? "bg-slate-50 font-bold text-slate-900 border-l-4 border-slate-800"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
                            }`}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobile categories (horizontal scroll) */}
                <div className="w-full border-b border-slate-100 bg-white overflow-x-auto md:hidden scrollbar-hide">
                  <ul className="flex flex-row py-2 px-4 whitespace-nowrap gap-2">
                    {dynamicCategories.map((cat, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${activeCategory === cat
                            ? "bg-slate-800 text-white font-bold"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Main Content Grid */}
                <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                  ) : filteredCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
                      <h4 className="text-lg font-bold text-slate-700">No courses found</h4>
                      <p className="text-slate-500 text-sm mt-1">Try adjusting search keywords or selecting a different category.</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredCourses.map((course) => {
                        const meta = getCourseMetadata(course.name, course.id, course.premium, course.testSeries);
                        return (
                          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            <div className={`bg-gradient-to-br ${meta.gradient} p-5 rounded-t-xl`}>
                              <div className="flex items-start justify-between">
                                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm p-2 text-red-500">
                                  {getIconComponent(meta.iconName)}
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                  <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-full px-2.5 py-1">
                                    <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-[10px] font-bold text-slate-650">{meta.users}</span>
                                  </div>
                                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                    course.premium 
                                      ? "bg-purple-600 text-white shadow-xs"
                                      : "bg-emerald-600 text-white shadow-xs"
                                  }`}>
                                    {course.premium ? `₹${Number(course.price || 59).toFixed(0)}/Month` : "Free"}
                                  </span>
                                </div>
                              </div>
                              <h3 className="mt-4 text-base font-bold text-slate-900 leading-tight min-h-[40px]">
                                {course.name}
                              </h3>
                              <p className="mt-2 text-[11px] font-semibold text-slate-600">
                                {meta.totalTests} Total Tests <span className="text-slate-300 mx-1">|</span> <span className="text-emerald-500">{course.premium ? "4 Free Tests" : "All Free Tests"}</span>
                              </p>
                              <div className="flex items-center gap-1.5 mt-2 pb-4 border-b border-slate-200/60">
                                <Globe className="h-3.5 w-3.5 text-[#00c2ff]" />
                                <span className="text-[10px] font-medium text-[#00c2ff]">{meta.languages}</span>
                              </div>

                              <ul className="mt-4 space-y-2">
                                {meta.bullets.map((bullet, bIdx) => {
                                  const isLast = bIdx === meta.bullets.length - 1;
                                  return (
                                    <li key={bIdx} className={`flex items-center text-xs font-medium ${isLast ? "text-emerald-500" : "text-slate-650"}`}>
                                      <span className={`mr-2 ${isLast ? "text-emerald-400" : "text-slate-400"}`}>•</span>
                                      {bullet}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="p-4 mt-auto">
                              <Link 
                                href={`/education/test-series/${course.id}`} 
                                className="block w-full py-2.5 bg-[#00c2ff] hover:bg-[#00b0e6] active:scale-[0.98] text-white font-black rounded-xl text-xs sm:text-sm text-center transition shadow-sm"
                              >
                                View Tests
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white px-5 py-16 sm:px-6 lg:px-8 border-b border-slate-100">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-black text-emerald-700">{stat.value}</span>
                    <h4 className="mt-3 text-sm font-bold text-slate-900 leading-tight">{stat.label}</h4>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-500">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline / How it works */}
        <section className="bg-slate-50/30 px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl text-left">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Methodology</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                The lifecycle of our educational support.
              </h2>
              <p className="mt-3 text-sm text-slate-600">We guide each beneficiary through a structured, long-term educational lifecycle to achieve independence.</p>
            </div>

            <div className="mt-16 relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-6 space-y-12">
              {journeySteps.map((step, idx) => (
                <div key={idx} className="relative pl-8 md:pl-12">
                  {/* Timeline point */}
                  <span className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 font-extrabold text-white text-xs shadow-md">
                    {step.step}
                  </span>

                  <div className="bg-slate-50/70 dark:bg-slate-900/10 rounded-2xl border border-slate-200/60 p-6 md:p-8 max-w-4xl hover:border-emerald-500/20 transition-all">
                    <h3 className="text-lg font-extrabold text-slate-950">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsor/Get Involved Section */}
        <section id="get-involved" className="bg-slate-900 text-white px-5 py-20 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

          <div className="mx-auto max-w-7xl relative z-10">
            <div className="max-w-3xl text-left">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">Join Our Effort</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Help us bring learning to every child.
              </h2>
              <p className="mt-4 text-sm text-slate-300">
                Choose a contribution channel to support local learning hubs or sponsor an individual child today.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {supportOptions.map((option, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 ${option.highlight
                    ? "border-emerald-500 bg-emerald-950/40 shadow-xl shadow-emerald-950/20"
                    : "border-slate-800 bg-slate-950/50"
                    }`}
                >
                  <div>
                    {option.highlight && (
                      <span className="inline-block rounded-full bg-emerald-500/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-400 mb-4">
                        Most Critical Need
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white">{option.title}</h3>
                    <p className="mt-3 text-xs leading-6 text-slate-400">
                      {option.desc}
                    </p>
                  </div>

                  <Link
                    href={option.href}
                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold transition-all ${option.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "border border-slate-700 bg-transparent text-slate-300 hover:text-white hover:border-emerald-500"
                      }`}
                  >
                    <span>{option.cta}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Quick Quote block */}
            <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-950/30 p-8 sm:p-12 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div className="text-left">
                <h4 className="text-lg font-extrabold flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-emerald-400" />
                  Want to establish a new learning center?
                </h4>
                <p className="mt-2 text-xs text-slate-400 max-w-xl">
                  Corporates, foundations, and institutional partners can fund and establish local IT hubs. Reach out to coordinate feasibility audits.
                </p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 px-6 py-3 text-xs font-bold text-white shadow-md transition"
              >
                Inquire Partnership
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Footer />
    </div>
  );
}
