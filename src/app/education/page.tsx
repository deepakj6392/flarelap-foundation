"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { sampleImages } from "@/constants/images";
import { 
  BookOpen, 
  GraduationCap, 
  Laptop, 
  Award, 
  ArrowRight, 
  ArrowUpRight,
  HeartHandshake,
  Building2,
  TrendingUp,
  FileText,
  Cpu,
  ChevronRight
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

const examCategories: ExamCategory[] = [
  {
    id: "bank-insurance",
    label: "Bank & Insurance",
    exams: [
      { name: "SBI PO Mock Test", tests: "15 Mock Tests", details: "100 Qs • 60 Mins", badge: "Free" },
      { name: "SBI Clerk Mock Test", tests: "12 Mock Tests", details: "100 Qs • 60 Mins", badge: "Free" },
      { name: "IBPS RRB Clerk Practice", tests: "20 Practice Tests", details: "80 Qs • 45 Mins", badge: "Premium" },
      { name: "IBPS RRB PO Practice", tests: "18 Practice Tests", details: "80 Qs • 45 Mins", badge: "Premium" },
      { name: "IBPS PO Full Mock", tests: "15 Full Tests", details: "100 Qs • 60 Mins", badge: "Free" },
      { name: "IBPS Clerk Full Mock", tests: "12 Full Tests", details: "100 Qs • 60 Mins", badge: "Free" },
      { name: "RBI Assistant Series", tests: "10 Practice Tests", details: "100 Qs • 60 Mins", badge: "Premium" },
      { name: "LIC AAO Mock Exam", tests: "8 Full Length Tests", details: "100 Qs • 60 Mins", badge: "Free" },
    ]
  },
  {
    id: "ssc-exams",
    label: "SSC Exams",
    exams: [
      { name: "SSC CGL (Tier I) Mock", tests: "25 Full Tests", details: "100 Qs • 60 Mins", badge: "Free" },
      { name: "SSC CGL (Tier II) Practice", tests: "12 Subject Tests", details: "150 Qs • 120 Mins", badge: "Premium" },
      { name: "SSC CHSL Speed Series", tests: "20 Mock Tests", details: "100 Qs • 60 Mins", badge: "Free" },
      { name: "SSC MTS Practice Mock", tests: "15 Practice Sets", details: "90 Qs • 90 Mins", badge: "Free" },
      { name: "SSC GD Constable Exam", tests: "18 Full Tests", details: "80 Qs • 60 Mins", badge: "Premium" },
      { name: "SSC CPO General Mock", tests: "10 Full Tests", details: "200 Qs • 120 Mins", badge: "Premium" }
    ]
  },
  {
    id: "railways-exams",
    label: "Railways Exams",
    exams: [
      { name: "RRB NTPC CBT 1 Mock", tests: "20 Mock Tests", details: "100 Qs • 90 Mins", badge: "Free" },
      { name: "RRB NTPC CBT 2 Test", tests: "15 Full Tests", details: "120 Qs • 90 Mins", badge: "Premium" },
      { name: "RRB Group D Practice", tests: "25 Practice Sets", details: "100 Qs • 90 Mins", badge: "Free" },
      { name: "RRB ALP & Tech Mock", tests: "12 Skill Tests", details: "75 Qs • 60 Mins", badge: "Premium" }
    ]
  },
  {
    id: "civil-services",
    label: "Civil Services",
    exams: [
      { name: "UPSC Prelims CSAT Series", tests: "10 Mock Tests", details: "80 Qs • 120 Mins", badge: "Premium" },
      { name: "UPSC Prelims GS 1 Mock", tests: "15 Mock Tests", details: "100 Qs • 120 Mins", badge: "Free" },
      { name: "State PCS GS Practice", tests: "12 Full Tests", details: "150 Qs • 120 Mins", badge: "Free" },
      { name: "NDA/CDS Entrance Mock", tests: "8 Practice Tests", details: "120 Qs • 150 Mins", badge: "Premium" }
    ]
  },
  {
    id: "teaching-exams",
    label: "Teaching Exams",
    exams: [
      { name: "CTET Paper 1 Practice", tests: "12 Full Tests", details: "150 Qs • 150 Mins", badge: "Free" },
      { name: "CTET Paper 2 Practice", tests: "12 Full Tests", details: "150 Qs • 150 Mins", badge: "Free" },
      { name: "UPTET Complete Series", tests: "10 Mock Tests", details: "150 Qs • 150 Mins", badge: "Premium" },
      { name: "KVS Teacher Speed Test", tests: "8 Practice Tests", details: "180 Qs • 180 Mins", badge: "Premium" }
    ]
  },
  {
    id: "engineering-exams",
    label: "Engineering & IT",
    exams: [
      { name: "GATE CS & IT Full Mock", tests: "15 Full Length Tests", details: "65 Qs • 180 Mins", badge: "Premium" },
      { name: "GATE Civil Subject Test", tests: "10 Subject Tests", details: "65 Qs • 180 Mins", badge: "Free" },
      { name: "GATE Mechanical Mock", tests: "10 Full Tests", details: "65 Qs • 180 Mins", badge: "Free" },
      { name: "RRB JE IT Technical CBT", tests: "12 Practice Sets", details: "150 Qs • 120 Mins", badge: "Premium" }
    ]
  }
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
  const [activeCategory, setActiveCategory] = useState<string>("bank-insurance");

  const currentCategory = examCategories.find((cat) => cat.id === activeCategory);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "bank-insurance":
        return <Building2 className="h-4.5 w-4.5" />;
      case "ssc-exams":
        return <Award className="h-4.5 w-4.5" />;
      case "railways-exams":
        return <TrendingUp className="h-4.5 w-4.5" />;
      case "civil-services":
        return <FileText className="h-4.5 w-4.5" />;
      case "teaching-exams":
        return <GraduationCap className="h-4.5 w-4.5" />;
      case "engineering-exams":
        return <Cpu className="h-4.5 w-4.5" />;
      default:
        return <BookOpen className="h-4.5 w-4.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-950 font-sans antialiased">
      <Herader />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#ecfdf5_45%,#fffbeb_100%)] py-20 lg:py-24">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.25]" />
          
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="max-w-3xl text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-4 py-2 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                Empowerment through Learning
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.12] text-slate-900 sm:text-5xl lg:text-6xl tracking-tight">
                Empowering Minds,
                <br />
                <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  Shaping Brighter Futures.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
                At Flarelap Global Foundation, we believe that education is the single most powerful tool to break generational poverty. We build supportive learning hubs, offer digital literacy camps, and provide direct sponsorships to help students stay in school.
              </p>

              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <Link
                  href="#get-involved"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-700/10 transition hover:bg-emerald-800 hover:scale-[1.01] active:scale-100"
                >
                  Sponsor a Child Now
                </Link>
                <Link
                  href="#exams-hub"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition hover:border-emerald-600 hover:text-emerald-800 hover:scale-[1.01] active:scale-100"
                >
                  Explore Exam Prep Courses
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto aspect-4/3 w-full max-w-[500px] overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-2xl shadow-emerald-900/5">
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
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">What We Do</p>
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

        {/* NEW Interactive Exam Finder (Mimicking the user's reference image) */}
        <section id="exams-hub" className="bg-slate-100/60 dark:bg-slate-900/10 border-y border-slate-200/50 px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl text-left">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700 font-bold">Mock Test & Preparation Hub</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Start Practicing Free Mock Tests Now
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Choose an exam category on the left, select your course, and log in or sign up to begin practice sets, complete live MCQs, and access detail reports.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[290px_1fr]">
              {/* Category selector on Left */}
              <div className="flex flex-row overflow-x-auto gap-2 pb-4 lg:pb-0 lg:flex-col lg:overflow-x-visible lg:border-r lg:border-slate-200 dark:lg:border-slate-800 lg:pr-6 whitespace-nowrap">
                {examCategories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center justify-between gap-3 rounded-xl px-4.5 py-3.5 text-xs font-black transition-all cursor-pointer outline-none ${
                        isActive
                          ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/10"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 hover:text-emerald-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {getCategoryIcon(cat.id)}
                        <span>{cat.label}</span>
                      </div>
                      <ChevronRight className={`hidden lg:block h-3.5 w-3.5 opacity-60 transition-transform ${isActive ? "translate-x-0.5 text-white" : "group-hover:translate-x-0.5"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Exams card grid on Right */}
              <div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {currentCategory?.exams.map((exam, idx) => (
                    <Link
                      key={idx}
                      href={`/student/register?course=${encodeURIComponent(exam.name)}`}
                      className="group rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between shadow-xs transition duration-350 hover:border-emerald-500/40 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`rounded-full px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider ${
                            exam.badge === "Free"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}>
                            {exam.badge}
                          </span>
                          <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500">
                            MCQ Prep Set
                          </span>
                        </div>

                        <h4 className="mt-4 text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                          {exam.name}
                        </h4>
                        <p className="mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {exam.tests}
                        </p>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-450 dark:text-slate-500 font-medium">
                          {exam.details}
                        </span>
                        <span className="text-emerald-750 dark:text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-all">
                          Start Test
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
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
                  className={`rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 ${
                    option.highlight 
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
                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold transition-all ${
                      option.highlight 
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

      <Footer />
    </div>
  );
}
