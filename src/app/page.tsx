"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { galleryImages, sampleImages } from "@/constants/images";
import {
  BookOpen,
  Heart,
  Award,
  Users,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  Compass,
  FileText,
  Clock,
  Sparkles
} from "lucide-react";

const focusAreas = [
  {
    title: "Education Access",
    description:
      "Learning support, digital literacy, mentorship, and supplies for children and youth who need steady encouragement.",
    icon: BookOpen,
  },
  {
    title: "Health and Wellness",
    description:
      "Awareness drives, preventive care camps, hygiene initiatives, and local health partnerships for stronger families.",
    icon: Heart,
  },
  {
    title: "Livelihood Support",
    description:
      "Skill-building, self-employment guidance, and practical resources that help people move toward financial independence.",
    icon: Award,
  },
  {
    title: "Community Relief",
    description:
      "Rapid support for vulnerable families during urgent needs, seasonal hardships, and local crisis situations.",
    icon: Users,
  },
];

const coreValues = [
  {
    title: "Empathy First",
    description: "We place human dignity, local challenges, and individual care at the center of every program we implement.",
    icon: Heart
  },
  {
    title: "Absolute Transparency",
    description: "Every inquiry tracked, every volunteer assigned, and every campaign launched is reported with high integrity.",
    icon: ShieldAlert
  },
  {
    title: "Sustainable Growth",
    description: "We avoid temporary patches. We design learning centers and health camps that help communities develop independently.",
    icon: Compass
  },
  {
    title: "Collaborative Action",
    description: "True impact is built together. We connect corporate sponsors, youth volunteers, and local centers under one hub.",
    icon: Users
  }
];

const activeEvents = [
  {
    tag: "Education",
    title: "Vidya Digital Literacy Drive",
    desc: "Setting up 5 new computer training centers in rural zones to train 500+ student candidates.",
    date: "July 12, 2026",
    status: "Active Preparation"
  },
  {
    tag: "Healthcare",
    title: "Swasthya Preventive Health Camps",
    desc: "Free diagnostic screenings, medical check-ups, and child immunization camps with hospital partners.",
    date: "August 04, 2026",
    status: "Scheduling Hubs"
  },
  {
    tag: "Livelihood",
    title: "Women Self-Help Group (SHG) Summit",
    desc: "Self-employment training, financial guidance, and startup resources for micro-business operations.",
    date: "September 19, 2026",
    status: "Calling Registrations"
  }
];

const metrics = [
  { value: "4", label: "Core Program Areas", desc: "Targeted support networks" },
  { value: "100%", label: "Community-First Focus", desc: "Locally driven execution" },
  { value: "24/7", label: "Volunteer Spirit", desc: "Dedicated impact builders" },
];

const involvementOptions = [
  {
    title: "Become a Volunteer",
    description: "Offer your skills, time, or mentorship. Join our local programs and work directly with children and families in need.",
    cta: "Apply as Volunteer",
    href: "#contact"
  },
  {
    title: "Partner With Us",
    description: "Corporates, institutes, and local societies can partner with Flarelap to implement CSR and grassroots initiatives.",
    cta: "Initiate Partnership",
    href: "#contact"
  },
  {
    title: "Spread the Word",
    description: "Follow our social profiles, share our updates, and raise awareness within your networks for our social campaigns.",
    cta: "Follow Campaigns",
    href: "#partners"
  }
];

const sdgGoals = [
  {
    number: "#3",
    title: "GOOD HEALTH & WELL BEING",
    gradient: "from-purple-600 to-indigo-700",
    shadow: "hover:drop-shadow-[0_12px_22px_rgba(147,51,234,0.35)]",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-white">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
  },
  {
    number: "#5",
    title: "GENDER EQUALITY",
    gradient: "from-pink-550 to-rose-600",
    shadow: "hover:drop-shadow-[0_12px_22px_rgba(236,72,153,0.35)]",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-white">
        <circle cx="12" cy="9" r="4" />
        <path d="M12 13v6M10 16h4M15 6l4-4M19 2h-4M19 2v4" />
      </svg>
    )
  },
  {
    number: "#4",
    title: "QUALITY EDUCATION",
    gradient: "from-amber-450 to-orange-600",
    shadow: "hover:drop-shadow-[0_12px_22px_rgba(245,158,11,0.35)]",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-white">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    )
  },
  {
    number: "#8",
    title: "DECENT WORK & ECONOMIC GROWTH",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "hover:drop-shadow-[0_12px_22px_rgba(16,185,129,0.35)]",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-white">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    )
  },
  {
    number: "#10",
    title: "REDUCED INEQUALITIES",
    gradient: "from-blue-500 to-indigo-600",
    shadow: "hover:drop-shadow-[0_12px_22px_rgba(59,130,246,0.35)]",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-white">
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="16" y2="14" />
      </svg>
    )
  },
  {
    number: "#17",
    title: "PARTNERSHIPS FOR THE GOALS",
    gradient: "from-lime-500 to-green-600",
    shadow: "hover:drop-shadow-[0_12px_22px_rgba(132,204,22,0.35)]",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-white">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="12" cy="19" r="2.5" />
        <circle cx="5" cy="12" r="2.5" />
        <circle cx="19" cy="12" r="2.5" />
      </svg>
    )
  }
];

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const [galleryImagesList, setGalleryImagesList] = useState<string[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const res = await fetch("/api/admin/gallery");
        const data = await res.json();
        if (res.ok && data.images && data.images.length > 0) {
          setGalleryImagesList(data.images.map((img: any) => img.imageUrl));
        } else {
          setGalleryImagesList([...galleryImages]);
        }
      } catch (err) {
        setGalleryImagesList([...galleryImages]);
      } finally {
        setGalleryLoading(false);
      }
    };
    fetchGalleryImages();
  }, []);

  const getMarqueeList = () => {
    let list = [...galleryImagesList];
    if (list.length === 0) return [];
    while (list.length < 6) {
      list = [...list, ...list];
    }
    return [...list, ...list];
  };

  // Typewriter lines
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");

  useEffect(() => {
    const text1 = "Empowering People,";
    const text2 = "Changing Lives.";
    let i = 0;
    let j = 0;

    const timer = setInterval(() => {
      if (i < text1.length) {
        setLine1(text1.substring(0, i + 1));
        i++;
      } else if (j < text2.length) {
        setLine2(text2.substring(0, j + 1));
        j++;
      } else {
        clearInterval(timer);
      }
    }, 70);

    return () => clearInterval(timer);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus("loading");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/foundation/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      setNewsletterStatus("success");
      setNewsletterEmail("");
      setNewsletterMessage("Thank you for subscribing!");
    } catch (err: any) {
      setNewsletterStatus("error");
      setNewsletterMessage(err.message || "Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-950 font-sans antialiased">
      <Herader />

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eefdf4_45%,#fffbeb_100%)] py-20 lg:py-28">
          {/* Ambient Glow Blobs */}
          <div className="absolute w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl -top-12 -left-12 pointer-events-none" />
          <div className="absolute w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-3xl bottom-0 right-1/4 pointer-events-none" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.25]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="max-w-3xl text-left">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-bold text-emerald-800 shadow-xs backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                Registered Social Impact Foundation
              </div>

              {/* Typewriter Hero Heading */}
              <h1 className="mt-8 text-4xl font-black leading-[1.12] text-slate-900 sm:text-6xl lg:text-7xl tracking-tight min-h-[96px] sm:min-h-[140px] md:min-h-[160px]">
                <span>{line1}</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  {line2}
                </span>
                <span className="inline-block w-[4px] h-[32px] sm:h-[48px] lg:h-[60px] ml-1 bg-emerald-600 animate-pulse align-middle" />
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
                Flarelap Global Foundation drives grassroots progress through practical, sustainable programs in education access, preventive healthcare, livelihood guidance, and relief welfare.
              </p>
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <Link
                  href="#programs"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-700/10 transition duration-300 hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-700/20 hover:-translate-y-[1px] active:translate-y-0"
                >
                  Explore Our Programs
                  <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-xs transition duration-300 hover:border-emerald-600 hover:text-emerald-800 hover:shadow-md hover:shadow-slate-250/40 hover:-translate-y-[1px] active:translate-y-0"
                >
                  Partner With Us
                </Link>
              </div>
            </div>

            <div className="relative">
              {/* Floating Badge 1 - Left Overlap */}
              <div className="hidden md:flex absolute -left-8 top-1/4 backdrop-blur-md bg-white/95 rounded-2xl shadow-lg border border-slate-100 p-3.5 items-center gap-2.5 hover:-translate-y-1 transition duration-300 z-20 pointer-events-none">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-xs">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">Impact Created</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">10k+ Beneficiaries</p>
                </div>
              </div>

              {/* Floating Badge 2 - Right Overlap */}
              <div className="hidden md:flex absolute -right-8 bottom-1/4 backdrop-blur-md bg-white/95 rounded-2xl shadow-lg border border-slate-100 p-3.5 items-center gap-2.5 hover:-translate-y-1 transition duration-300 z-20 pointer-events-none">
                <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center shadow-xs">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">Social Strength</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">500+ Active Volunteers</p>
                </div>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-[500px] rounded-[2.5rem] border border-slate-200 bg-white/85 p-6 shadow-2xl shadow-emerald-950/5 backdrop-blur-md">
                <div className="flex h-full flex-col justify-between rounded-[2rem] bg-slate-50/40 p-6 border border-slate-100/80">
                  <div className="flex-1 flex items-center justify-center p-2">
                    <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-md shadow-slate-100/50 hover:scale-[1.015] hover:shadow-xl transition-all duration-300 group">
                      <Image
                        src="/uploads/home_hero.png"
                        alt="Indian children studying in a bright modern classroom"
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        priority
                      />
                    </div>
                  </div>

                  {/* Credentials / Certifications Row */}
                  <div className="mt-4 border-t border-slate-200/80 pt-4 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Govt. Registered & Certified</p>
                    <div className="grid grid-cols-2 items-center gap-4 bg-white/80 rounded-xl border border-slate-200/40 p-2.5">
                      <Image
                        src="/msme_logo.png"
                        alt="MSME registered logo"
                        width={230}
                        height={105}
                        className="mx-auto h-9 w-auto object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300"
                      />
                      <Image
                        src="/iso_logo.png"
                        alt="ISO certification logo"
                        width={225}
                        height={225}
                        className="mx-auto h-10 w-auto object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ABOUT US SECTION */}
        <section id="about" className="bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">About Our Purpose</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Built for steady, local, and human-first social progress.
              </h2>
            </div>
            <div className="text-sm leading-8 text-slate-700 sm:text-base space-y-4">
              <p>
                Flarelap Global Foundation was founded on a simple principle: lasting change takes place when vulnerable community members receive resources, skill training, and cooperative support networks.
              </p>
              <p>
                By linking passionate volunteers, corporate partners, and field experts, we deploy targeted learning hubs, health check camps, and financial independence guides directly to those who need them.
              </p>
            </div>
          </div>
        </section>

        {/* 3. NEW: CORE VALUES MATRIX */}
        <section className="bg-slate-50/50 px-5 py-20 sm:px-6 lg:px-8 border-y border-slate-100">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl text-left">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Our Identity</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                The core values guiding our daily work.
              </h2>
              <p className="mt-3 text-sm text-slate-600">We establish long-term values to ensure our projects remain transparent, helpful, and transparent.</p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((value, idx) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white p-6.5 shadow-xs transition duration-300 hover:border-emerald-500/20"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-base font-extrabold text-slate-900">{value.title}</h3>
                    <p className="mt-3 text-xs leading-6 text-slate-500 font-medium">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. PROGRAMS SECTION */}
        <section id="programs" className="bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl text-left">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Social Focus Areas</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Practical solutions solving real-world challenges.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {focusAreas.map((area) => {
                const IconComponent = area.icon;
                return (
                  <article
                    key={area.title}
                    className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/20 hover:bg-white"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900 transition group-hover:text-emerald-800">{area.title}</h3>
                    <p className="mt-3 text-xs leading-6 text-slate-600">
                      {area.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* UN SUSTAINABLE DEVELOPMENT GOALS SECTION */}
        <section className="bg-slate-50/30 px-5 py-24 sm:px-6 lg:px-8 border-t border-slate-100">
          <div className="mx-auto max-w-7xl text-center space-y-4">
            <div className="space-y-2 max-w-3xl mx-auto">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Towards Achieving</span>
              <h2 className="text-3xl font-black uppercase tracking-wider text-slate-900 sm:text-4xl md:text-5xl leading-tight">
                Sustainable Development Goals
              </h2>
              <div className="mx-auto h-1 w-24 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full mt-4" />
            </div>

            <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto">
              {sdgGoals.map((goal, idx) => (
                <div
                  key={idx}
                  className={`group relative aspect-[1/1.14] transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${goal.shadow}`}
                >
                  <div className={`hexagon-clip-vertical w-full h-full bg-gradient-to-br ${goal.gradient} pt-7 pb-6 px-4 flex flex-col items-center justify-between text-center relative overflow-hidden`}>

                    {/* Top shine reflection effect */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-white/10 -skew-y-12 origin-top-left pointer-events-none transition group-hover:bg-white/15" />

                    {/* Goal Icon Container */}
                    <div className="mt-1 flex items-center justify-center h-10 w-10 text-white z-10 transition group-hover:scale-110">
                      {goal.icon}
                    </div>

                    {/* Separator & Details */}
                    <div className="w-full flex-1 flex flex-col justify-end items-center z-10 space-y-3">
                      <div className="w-8/12 mx-auto border-t border-white/30" />

                      <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white/95 leading-snug min-h-[36px] flex items-center justify-center px-1">
                        {goal.title}
                      </h3>

                      <span className="text-[11px] sm:text-xs font-black text-white/80 tracking-widest block">
                        {goal.number}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. NEW: ACTIVE CAMPAIGNS & UPCOMING EVENTS */}
        <section className="bg-slate-50/50 px-5 py-20 sm:px-6 lg:px-8 border-y border-slate-100">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Ongoing Operations</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Active campaigns & upcoming drives.
                </h2>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-700">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
                Live Hub Operations
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {activeEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300"
                >
                  <div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-black tracking-wider uppercase text-emerald-700">
                      {event.tag}
                    </span>
                    <h3 className="mt-5 text-base font-black text-slate-900 leading-snug">{event.title}</h3>
                    <p className="mt-3 text-xs leading-6 text-slate-500 font-medium">{event.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {event.date}
                    </span>
                    <span className="text-emerald-700">{event.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. IMPACT METRICS */}
        <section id="impact" className="bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Impact Indicators</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Commitment to transparent, trusted, and measurable care.
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <p className="text-4xl font-black text-emerald-700">
                      {metric.value}
                    </p>
                    <p className="mt-3 text-sm font-bold text-slate-900 leading-tight">
                      {metric.label}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">
                    {metric.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. WAYS TO SUPPORT / INTERACTIVE VOLUNTEER SECTION */}
        <section className="bg-slate-900 text-white px-5 py-20 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

          <div className="mx-auto max-w-7xl relative z-10">
            <div className="max-w-3xl text-left">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">Join the Movement</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                How you can support our initiatives today.
              </h2>
              <p className="mt-4 text-sm text-slate-300">
                You can help us build a stronger community. Choose a path below to get involved.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {involvementOptions.map((option, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6.5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">{option.title}</h3>
                    <p className="mt-3 text-xs leading-6 text-slate-400">
                      {option.description}
                    </p>
                  </div>
                  <Link
                    href={option.href}
                    className="mt-6 inline-flex items-center gap-1.5 self-start text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:translate-x-1 transition-all"
                  >
                    {option.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. TESTIMONIALS SECTION */}
        <section id="testimonials" className="bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Voices From the Field</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Stories of growth & support</h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <blockquote className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between">
                <p className="text-xs leading-6 text-slate-700 font-medium italic">
                  “Working with Flarelap helped our village open a local youth learning center. Families now have direct support and hope for their kids.”
                </p>
                <div className="flex items-center gap-4 mt-6 border-t border-slate-200/60 pt-4">
                  <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-slate-200">
                    <Image src={sampleImages.community} alt="Asha Kumari" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Asha Kumari</p>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Community Volunteer</p>
                  </div>
                </div>
              </blockquote>

              <blockquote className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between">
                <p className="text-xs leading-6 text-slate-700 font-medium italic">
                  “Their practical skill training modules made it possible for us to teach computer basics and programming models to local youths.”
                </p>
                <div className="flex items-center gap-4 mt-6 border-t border-slate-200/60 pt-4">
                  <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-slate-200">
                    <Image src={sampleImages.livelihood} alt="Rahul Sharma" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Rahul Sharma</p>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Program Partner</p>
                  </div>
                </div>
              </blockquote>

              <blockquote className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between">
                <p className="text-xs leading-6 text-slate-700 font-medium italic">
                  “I see the impact my support drives. The community reports are transparent, showing where resources are deployed.”
                </p>
                <div className="flex items-center gap-4 mt-6 border-t border-slate-200/60 pt-4">
                  <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-slate-200">
                    <Image src={sampleImages.health} alt="Lina Costa" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Lina Costa</p>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Donor & Supporter</p>
                  </div>
                </div>
              </blockquote>
            </div>
          </div>
        </section>

        {/* 9. GALLERY SECTION */}
        <section id="gallery" className="bg-slate-50/50 px-5 py-20 sm:px-6 lg:px-8 border-y border-slate-100 overflow-hidden">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-scroll {
              display: flex;
              width: max-content;
              animation: marquee 35s linear infinite;
            }
            .animate-marquee-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Project Gallery</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Moments from our activities</h2>
          </div>

          <div className="relative mt-12 w-full overflow-hidden py-4">
            {/* Soft Fading Edges */}
            <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-50/90 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-slate-50/90 to-transparent pointer-events-none" />

            <div className="animate-marquee-scroll gap-6">
              {getMarqueeList().map((src, idx) => (
                <div
                  key={idx}
                  className="group relative h-64 w-96 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-350 hover:shadow-md hover:scale-[1.015]"
                >
                  <Image
                    src={src}
                    alt={`Gallery image ${idx + 1}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. NEWS UPDATES SECTION */}
        <section id="news" className="bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Media Center</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Latest updates</h2>
              </div>
              <Link href="/blogs" className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1">
                Read All Blogs
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  June 12, 2026
                </div>
                <h3 className="mt-3 font-bold text-slate-900 text-base">Volunteer day outreach recap</h3>
                <p className="mt-3 text-xs leading-6 text-slate-600">A comprehensive recap of our recent cooperative volunteer drives in rural hubs.</p>
                <Link href="/blogs" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800">
                  Read details
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  May 28, 2026
                </div>
                <h3 className="mt-3 font-bold text-slate-900 text-base">New digital skills cohort launch</h3>
                <p className="mt-3 text-xs leading-6 text-slate-600">We have deployed new skill mentoring schedules in three rural centers.</p>
                <Link href="/blogs" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800">
                  Read details
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  May 15, 2026
                </div>
                <h3 className="mt-3 font-bold text-slate-900 text-base">Health check camp outcomes</h3>
                <p className="mt-3 text-xs leading-6 text-slate-600">A summary of families helped and treatments supported in last medical initiatives.</p>
                <Link href="/blogs" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800">
                  Read details
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* 11. PARTNERS SECTION */}
        {/* <section id="partners" className="bg-slate-50/50 px-5 py-16 sm:px-6 lg:px-8 border-t border-slate-100">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400 text-center">Supported and Trusted by</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-10 opacity-70 filter grayscale dark:invert">
              <div className="h-10 w-24 relative">
                <Image src="/msme_logo.png" alt="MSME" fill className="object-contain" />
              </div>
              <div className="h-10 w-24 relative">
                <Image src="/iso_logo.png" alt="ISO" fill className="object-contain" />
              </div>
              <div className="h-10 w-20 relative">
                <Image src="/logo.png" alt="Flarelap Seal" fill className="object-contain" />
              </div>
              <div className="h-7 w-20 relative">
                <Image src="/vercel.svg" alt="Vercel" fill className="object-contain" />
              </div>
              <div className="h-7 w-24 relative">
                <Image src="/next.svg" alt="Next.js" fill className="object-contain" />
              </div>
            </div>
          </div>
        </section> */}

        {/* 12. NEWSLETTER SECTION */}
        <section id="newsletter" className="bg-white px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/5 blur-xl" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">Stay connected with our updates</h3>
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Subscribe to receive brief highlights on our achievements and notice details on how you can participate.
                </p>

                <form onSubmit={handleNewsletterSubmit} className="mt-8 mx-auto max-w-xl">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      aria-label="Email"
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full sm:flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs transition"
                      disabled={newsletterStatus === "loading"}
                    />
                    <button
                      type="submit"
                      disabled={newsletterStatus === "loading"}
                      className="w-full sm:w-auto shrink-0 rounded-full bg-emerald-700 hover:bg-emerald-800 px-6 py-3 text-xs font-bold text-white shadow-md transition disabled:opacity-50"
                    >
                      {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe Now"}
                    </button>
                  </div>
                </form>

                {newsletterMessage && (
                  <p className={`mt-4 text-xs font-bold ${newsletterStatus === "success" ? "text-emerald-700" : "text-red-600"}`}>
                    {newsletterMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
