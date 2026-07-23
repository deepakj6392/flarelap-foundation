"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { 
  Users, 
  Clock, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Heart, 
  Activity, 
  Sparkles, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  Building,
  Target,
  HeartHandshake,
  Briefcase,
  GraduationCap,
  Globe,
  Smartphone,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Smile
} from "lucide-react";
import Swal from "sweetalert2";

const impactStats = [
  { 
    value: "12,000+", 
    label: "Lives Impacted", 
    desc: "Empowered through learning support, digital literacy, and economic relief campaigns across rural communities.", 
    icon: Users,
    color: "from-blue-500 to-emerald-500"
  },
  { 
    value: "350+", 
    label: "Volunteer Hours / Mo", 
    desc: "Dedicated instruction and mentorship delivered by passionate youth and academic professionals.", 
    icon: Clock,
    color: "from-emerald-500 to-teal-500"
  },
  { 
    value: "48+", 
    label: "Community Partners", 
    desc: "Active collaborations with local schools, diagnostic clinics, and corporate outreach sponsors.", 
    icon: Award,
    color: "from-teal-500 to-indigo-500"
  },
  { 
    value: "92%", 
    label: "Success Retention", 
    desc: "A stellar rate of participants continuing in our active developmental cohorts year over year.", 
    icon: TrendingUp,
    color: "from-indigo-500 to-purple-500"
  },
];

const programTabs = [
  {
    id: "education",
    label: "Education Access",
    icon: BookOpen,
    title: "Bridging the Digital & Literacy Gap",
    subtitle: "We believe structured mentorship and tools unlock generational potential.",
    description: "Our educational initiatives target under-resourced schools and student groups in Haryana. By offering access to specialized learning software, offline reference materials, and digital tablets, we foster an environment of continuous progress.",
    metrics: [
      "24% improvement in average literacy and mathematics scores after 9 months.",
      "450+ hours of digital learning and computer lab access facilitated weekly.",
      "Free learning materials and school kits delivered to 1,200+ students this year."
    ],
    accentColor: "emerald"
  },
  {
    id: "health",
    label: "Healthcare & Wellness",
    icon: Heart,
    title: "Preventive Care for Stronger Villages",
    subtitle: "Timely screenings and clinical outreach protect families and save lives.",
    description: "In collaboration with regional healthcare centers, we manage regular diagnostic and screening camps. By mapping local health profiles and ensuring follow-up care, we assist families in gaining access to timely medical assistance.",
    metrics: [
      "Diagnostic screenings and health checkups provided for over 2,200+ villagers.",
      "120+ successful referrals to specialized hospitals for critical treatment.",
      "15+ rural medical and hygiene awareness camps hosted in the last 12 months."
    ],
    accentColor: "rose"
  },
  {
    id: "livelihood",
    label: "Livelihood & Skills",
    icon: Sparkles,
    title: "Fostering Economic Self-Reliance",
    subtitle: "Skill training workshops that enable women and youth to thrive.",
    description: "We work directly with local training hubs to conduct sewing, tailoring, and micro-business modules. Our programs provide both technical skill acquisition and self-employment counseling to help individuals build stable, independent incomes.",
    metrics: [
      "Supported 65+ women in launching tailoring and handicraft micro-enterprises.",
      "100% completion rate for active self-employment training cohorts.",
      "Provided micro-grants and sewing tools to help top graduates establish shops."
    ],
    accentColor: "blue"
  },
  {
    id: "relief",
    label: "Community Relief",
    icon: Activity,
    title: "Rapid Support in Vulnerable Times",
    subtitle: "Standing by our community through sudden seasonal and economic crises.",
    description: "When hardships arise, our active networks of youth volunteers respond rapidly to provide essential support. From providing warm clothing and blankets during harsh winters to food kits during crises, we ensure families are safe.",
    metrics: [
      "Distributed 2,500+ emergency food ration kits and warm clothing supplies.",
      "24-hour response window for local partner emergency relief requests.",
      "Dedicated clean drinking water camps deployed during severe summer heatwaves."
    ],
    accentColor: "amber"
  }
];

const reports = [
  {
    title: "2025 Annual Impact Summary",
    desc: "A comprehensive look at our outreach metrics, audited program expenditures, and local outcomes.",
    size: "4.8 MB",
    date: "Jan 2026",
    tag: "Annual Report"
  },
  {
    title: "Beneficiary Feedback Digest",
    desc: "Synthesized review of qualitative program feedback, surveys, and suggestions for development.",
    size: "1.2 MB",
    date: "Nov 2025",
    tag: "Survey Data"
  },
  {
    title: "Digital Literacy Action Plan",
    desc: "Strategic roadmap for the setup and expansion of learning centers across Kaithal district.",
    size: "2.5 MB",
    date: "Mar 2026",
    tag: "Outreach Strategy"
  }
];

const volunteerBenefits = [
  {
    title: "Make a Difference",
    desc: "Directly impact lives and contribute to meaningful social causes across education, health, and community welfare.",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    badge: "Impact Lives"
  },
  {
    title: "Gain Real-World Experience",
    desc: "Learn new skills, develop leadership qualities, and enhance your resume with hands-on project experience.",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    badge: "Skill Building"
  },
  {
    title: "Expand Your Network",
    desc: "Connect with passionate, like-minded individuals, changemakers, and community leaders.",
    icon: Users,
    color: "from-indigo-500 to-purple-500",
    badge: "Strong Network"
  },
  {
    title: "Flexible Engagement",
    desc: "Choose opportunities that align with your schedule and interests (On-field ground action or Remote/Virtual).",
    icon: Globe,
    color: "from-amber-500 to-orange-500",
    badge: "On-Field or Remote"
  },
  {
    title: "Certificate of Recognition",
    desc: "Receive an official Volunteer Certificate and appreciation for your dedicated contributions.",
    icon: Award,
    color: "from-emerald-500 to-teal-500",
    badge: "Official Certificate"
  }
];

const volunteerPersonas = [
  {
    role: "Students",
    desc: "Looking for valuable social work experience, leadership exposure, and official certification.",
    icon: GraduationCap,
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    border: "border-emerald-500/20",
    pillBg: "bg-emerald-100 text-emerald-800"
  },
  {
    role: "Working Professionals",
    desc: "Wanting to give back to society during weekends or free time through skill-based contribution.",
    icon: Briefcase,
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    border: "border-blue-500/20",
    pillBg: "bg-blue-100 text-blue-800"
  },
  {
    role: "Homemakers & Senior Citizens",
    desc: "Ready to share their wisdom, warmth, and time for empowering families and children.",
    icon: Heart,
    gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    border: "border-purple-500/20",
    pillBg: "bg-purple-100 text-purple-800"
  },
  {
    role: "Anyone",
    desc: "With a heart to serve and a passion for creating positive, lasting social good!",
    icon: Sparkles,
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    border: "border-amber-500/20",
    pillBg: "bg-amber-100 text-amber-800"
  }
];

const registrationSteps = [
  {
    step: "01",
    title: "Download App",
    desc: "Download the Flarelap Org app from the Google Play Store on your smartphone.",
    icon: Smartphone
  },
  {
    step: "02",
    title: "Complete Form",
    desc: "Fill out the simple Volunteer Registration Form in the app in under 2 minutes.",
    icon: UserCheck
  },
  {
    step: "03",
    title: "Be the Spark",
    desc: "Start contributing to active projects and transform lives in your community!",
    icon: HeartHandshake
  }
];

export default function ImpactPage() {
  const [activeTab, setActiveTab] = useState("education");

  const handleDownload = (reportTitle: string) => {
    Swal.fire({
      title: "Preparing Document",
      html: `Creating a secure copy of <strong>${reportTitle}</strong>...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Download Started",
        text: `${reportTitle} is downloading to your device.`,
        timer: 2000,
        showConfirmButton: false
      });
    }, 1500);
  };

  const handleVolunteerRegister = () => {
    Swal.fire({
      title: "Join Flarelap Volunteer Network",
      html: `
        <div class="text-left text-sm text-slate-700 space-y-3 pt-2">
          <p class="font-bold text-slate-900">Follow these simple steps to get started:</p>
          <div class="p-3 bg-slate-100 rounded-xl space-y-2 text-xs font-medium">
            <div class="flex items-center gap-2 text-slate-800">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">1</span>
              <span>Open <strong>Google Play Store</strong> on your smartphone.</span>
            </div>
            <div class="flex items-center gap-2 text-slate-800">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
              <span>Search for <strong>Flarelap Org</strong> app and tap Install.</span>
            </div>
            <div class="flex items-center gap-2 text-slate-800">
              <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
              <span>Complete the <strong>Volunteer Registration Form</strong>.</span>
            </div>
          </div>
          <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
            ✨ Be the Spark of Change in Someone’s Life!
          </div>
        </div>
      `,
      icon: "success",
      iconColor: "#059669",
      showCancelButton: true,
      confirmButtonText: "Search Play Store",
      confirmButtonColor: "#059669",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        window.open("https://play.google.com/store/search?q=Flarelap%20Org&c=apps", "_blank");
      }
    });
  };

  const activeProgram = programTabs.find((t) => t.id === activeTab) || programTabs[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Herader />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-20 lg:py-28">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              
              {/* Hero Left */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/10">
                  <Sparkles className="h-3 w-3" />
                  Our Real-World Impact
                </span>
                
                <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                  Measured care, <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
                    local transformation.
                  </span>
                </h1>
                
                <p className="mt-6 text-lg leading-relaxed text-slate-650 max-w-xl">
                  We believe that change should be measurable and sustainable. Our foundation publishes transparent summaries of outreach initiatives so partners, donors, and the community can trace every milestone to actual lives changed.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => handleDownload("2025 Annual Impact Summary")}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg hover:bg-emerald-700 hover:shadow-emerald-700/20 transition-all duration-300"
                  >
                    <Download className="h-4 w-4" />
                    Download 2025 Report
                  </button>
                  <a
                    href="#volunteer"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg hover:bg-emerald-700 transition duration-300"
                  >
                    <HeartHandshake className="h-4 w-4" />
                    Join as Volunteer
                  </a>
                  <a
                    href="#outcomes"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-extrabold text-slate-700 hover:bg-slate-50 transition"
                  >
                    View Outcomes
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Hero Right: Professional Generated Image */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 opacity-70 blur-2xl -z-10" />
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-100 shadow-2xl bg-slate-100 group">
                  <Image
                    src="/uploads/community_impact_hero.png"
                    alt="Flarelap Foundation outreach program in India"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Kaithal, Haryana</p>
                    <p className="text-sm font-extrabold mt-1">Direct community learning initiatives in local areas</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Grid Section */}
        <section className="bg-slate-50 py-16 border-y border-slate-200/60">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <div 
                    key={s.label} 
                    className="relative group overflow-hidden rounded-2xl border border-white bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600" />
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-black tracking-tight text-slate-900">{s.value}</p>
                      <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-black text-slate-800 uppercase tracking-wider">{s.label}</p>
                    <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Interactive outcomes tabs section */}
        <section id="outcomes" className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-600/10">
                <Target className="h-3 w-3" />
                Focused Portfolios
              </span>
              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
                Where We Create Lasting Change
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Explore our active program streams. We regularly evaluate feedback and structural parameters to optimize resource utility.
              </p>
            </div>

            {/* Tabs List */}
            <div className="mt-12 flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-2">
              {programTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-md shadow-slate-950/10 scale-105"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <TabIcon className="h-4.5 w-4.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Active Tab Panel */}
            <div className="mt-10 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 lg:p-10 shadow-inner">
              <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
                
                {/* Panel Info Left */}
                <div className="lg:col-span-7">
                  <h3 className="text-2xl font-black text-slate-900">{activeProgram.title}</h3>
                  <p className="mt-2 text-sm font-bold text-emerald-700 uppercase tracking-wider">{activeProgram.subtitle}</p>
                  
                  <p className="mt-4 text-base leading-relaxed text-slate-650">
                    {activeProgram.description}
                  </p>

                  <div className="mt-8">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Key Outcomes Summary</h4>
                    <ul className="mt-4 space-y-3.5">
                      {activeProgram.metrics.map((m, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                          <span className="text-sm font-medium text-slate-700 leading-normal">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Panel Media Right: Generated timeline graphic */}
                <div className="lg:col-span-5 flex flex-col gap-5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg group">
                    <Image
                      src="/uploads/impact_milestones_timeline.png"
                      alt="NGO timeline milestone diagram"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200/60 bg-white p-4 text-xs font-semibold text-slate-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
                    Milestones updated quarterly in sync with programmatic reports.
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Reports Download Section */}
        <section className="bg-slate-900 px-5 py-20 text-white sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-emerald-400">
                <Building className="h-3 w-3" />
                Transparency Reports
              </span>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl tracking-tight">Recent Publications & Summary Data</h2>
              <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
                Download copies of our operational plans and community digests. We support continuous verification of our projects.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <div 
                  key={report.title} 
                  className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-6 hover:border-emerald-600/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-1">
                      {report.tag}
                    </span>
                    <h3 className="mt-4 text-lg font-black text-slate-100">{report.title}</h3>
                    <p className="mt-2 text-xs text-slate-400 font-medium leading-relaxed">{report.desc}</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{report.date} • {report.size}</span>
                    <button 
                      onClick={() => handleDownload(report.title)}
                      className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-full bg-slate-900 hover:bg-emerald-600 text-white transition duration-200"
                      aria-label="Download Publication"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Volunteer & Community Empowerment Section */}
        <section id="volunteer" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950 py-24 text-white">
          {/* Ambient Background Glows */}
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            
            {/* Header & Tagline */}
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-bold text-emerald-400 backdrop-blur-md">
                <HeartHandshake className="h-4 w-4 text-emerald-400" />
                Join Flarelap Global Foundation as a Volunteer
              </span>
              <h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Empower People & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Change Lives</span>
              </h2>
              
              {/* Mission Statement Box */}
              <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-md text-slate-200 shadow-2xl text-left sm:text-center">
                <p className="text-base sm:text-lg leading-relaxed italic text-slate-300">
                  “At <strong className="text-white font-extrabold">Flarelap Global Foundation</strong>, we believe that every small action can lead to a massive impact. Our mission is to create sustainable, positive change in society through education, community welfare and empowerment programs.”
                </p>
              </div>
            </div>

            {/* Why Become a Volunteer with Us? */}
            <div className="mt-20">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Why Become a Volunteer with Us?
                </h3>
                <p className="mt-3 text-sm text-slate-400">
                  Discover meaningful opportunities to grow, connect, and drive social action.
                </p>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {volunteerBenefits.map((b) => {
                  const BenefitIcon = b.icon;
                  return (
                    <div 
                      key={b.title} 
                      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 hover:-translate-y-1 shadow-lg backdrop-blur-sm"
                    >
                      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${b.color}`} />
                      <div className="flex items-center justify-between">
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-1">
                          {b.badge}
                        </span>
                        <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-300">
                          <BenefitIcon className="h-5 w-5" />
                        </div>
                      </div>
                      <h4 className="mt-5 text-lg font-black text-white group-hover:text-emerald-400 transition-colors">{b.title}</h4>
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed font-medium">{b.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Who Can Join? */}
            <div className="mt-24 pt-12 border-t border-slate-800/80">
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400">
                  <Users className="h-3.5 w-3.5" />
                  Inclusive Volunteer Network
                </span>
                <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Who Can Join?
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Our door is open to everyone with a passion to serve and uplift society.
                </p>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {volunteerPersonas.map((p) => {
                  const PersonaIcon = p.icon;
                  return (
                    <div 
                      key={p.role} 
                      className={`relative rounded-2xl border ${p.border} bg-slate-900/40 p-6 backdrop-blur-sm hover:border-slate-700 transition duration-300 flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="h-10 w-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-emerald-400">
                            <PersonaIcon className="h-5 w-5" />
                          </div>
                          <span className={`text-[11px] font-black px-3 py-1 rounded-full ${p.pillBg}`}>
                            {p.role}
                          </span>
                        </div>
                        <p className="mt-4 text-xs text-slate-300 leading-relaxed font-medium">
                          {p.desc}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center text-[11px] font-bold text-emerald-400 gap-1">
                        <span>Open to Join</span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How to Register? */}
            <div className="mt-24">
              <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/50 via-slate-900 to-indigo-950/70 p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="grid gap-8 lg:grid-cols-12 items-center">
                  
                  {/* Left Column: Steps */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Simple & Quick Process</span>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      How to Register?
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Joining our volunteer network is quick and simple:
                    </p>
                    
                    <div className="grid gap-4 sm:grid-cols-3">
                      {registrationSteps.map((s) => {
                        const StepIcon = s.icon;
                        return (
                          <div key={s.step} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 hover:border-emerald-500/40 transition">
                            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                              <span>STEP</span>
                              <span className="font-bold text-emerald-400">{s.step}</span>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
                              <StepIcon className="h-4 w-4 text-emerald-400 shrink-0" />
                              <span>{s.title}</span>
                            </div>
                            <p className="mt-1.5 text-[11px] text-slate-400 leading-normal">{s.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 text-xs font-semibold text-emerald-300 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Start contributing to active projects and <strong>Be the Spark of Change in Someone’s Life!</strong></span>
                    </div>
                  </div>

                  {/* Right Column: CTA Box */}
                  <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md text-center shadow-xl">
                      <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Smartphone className="h-7 w-7" />
                      </div>
                      <h4 className="mt-4 text-lg font-black text-white">Flarelap Org App</h4>
                      <p className="mt-1 text-xs text-slate-350">Available on Play Store for Android</p>
                      
                      <button
                        onClick={handleVolunteerRegister}
                        className="mt-6 w-full inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-500/25 transition-all duration-300 transform active:scale-95"
                      >
                        <Smartphone className="h-5 w-5" />
                        Register via Play Store App
                      </button>
                      
                      <p className="mt-3 text-[10px] text-slate-400 font-medium">Free Download • Complete Volunteer Form</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CTA Join Section */}
        <section className="bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 p-8 sm:p-12 lg:p-16 shadow-2xl text-center text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="relative flex flex-col items-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-emerald-400">
                  Join the Mission
                </span>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                  Ready to Drive Real Community Value?
                </h2>
                <p className="mt-4 text-slate-350 text-sm sm:text-base max-w-xl leading-relaxed">
                  Support our active campaigns by volunteering your time or donating to help purchase devices and host clinical camps.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Link 
                    href="/donate" 
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg hover:bg-emerald-700 transition"
                  >
                    Support / Donate
                  </Link>
                  <button 
                    onClick={handleVolunteerRegister}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-6 py-3.5 text-sm font-extrabold text-slate-100 hover:bg-slate-750 transition"
                  >
                    <HeartHandshake className="h-4 w-4 text-emerald-400" />
                    Become a Volunteer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
