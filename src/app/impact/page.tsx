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
  Target
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
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-6 py-3.5 text-sm font-extrabold text-slate-100 hover:bg-slate-750 transition"
                  >
                    Become a Volunteer
                  </Link>
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
