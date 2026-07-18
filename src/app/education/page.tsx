"use client";

import { useState, useEffect } from "react";
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
  Stethoscope,
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
  },
  {
    id: "jee-exams",
    label: "Engineering (JEE Main/Adv)",
    exams: [
      { name: "JEE Physics Practice Prep", tests: "25 Full Length Tests", details: "90 Qs • 180 Mins", badge: "Free" },
      { name: "JEE Chemistry Practice Prep", tests: "25 Full Length Tests", details: "90 Qs • 180 Mins", badge: "Free" },
      { name: "JEE Mathematics Practice Prep", tests: "25 Full Length Tests", details: "90 Qs • 180 Mins", badge: "Premium" },
      { name: "JEE Main Integrated Mock", tests: "15 Integrated Tests", details: "90 Qs • 180 Mins", badge: "Premium" }
    ]
  },
  {
    id: "medical-exams",
    label: "Medical (NEET)",
    exams: [
      { name: "NEET UG Full Mock Test", tests: "10 Full Mock Tests", details: "180 Qs • 200 Mins", badge: "Free" },
      { name: "NEET Biology Advanced Prep", tests: "15 Full Tests", details: "90 Qs • 100 Mins", badge: "Free" },
      { name: "NEET Physics Advanced Prep", tests: "15 Full Tests", details: "45 Qs • 50 Mins", badge: "Premium" },
      { name: "NEET Chemistry Advanced Prep", tests: "15 Full Tests", details: "45 Qs • 50 Mins", badge: "Premium" },
      { name: "NEET Biology Speed Mock", tests: "20 Practice Sets", details: "90 Qs • 95 Mins", badge: "Free" },
      { name: "NEET Physics Chapter Test", tests: "15 Subject Tests", details: "45 Qs • 50 Mins", badge: "Premium" },
      { name: "NEET Chemistry Topic Test", tests: "15 Subject Tests", details: "45 Qs • 50 Mins", badge: "Premium" },
      { name: "NEET Previous Year Papers", tests: "8 Full Length Papers", details: "180 Qs • 200 Mins", badge: "Premium" }
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
const courseToCategory: { [key: string]: string } = {
  "ssc cgl mock test": "SSC",
  "ssc chsl mock test": "SSC",
  "ssc mts mock test": "SSC",
  "ssc gd constable mock test": "SSC",
  "ssc cpo mock test": "SSC",
  "ssc je mock test": "SSC",
  "ssc stenographer mock test": "SSC",
  "ssc jht (junior hindi translator) mock test": "SSC",
  "ssc selection post mock test": "SSC",
  "ssc departmental exams mock test": "SSC",
  "cuet pg mock test": "UG Entrance Exam",
  "iit jam mock test": "PG Entrance Exam",
  "gate (pg/m.tech) mock test": "PG Entrance Exam",
  "cat (mba) mock test": "PG Entrance Exam",
  "cmat (mba) mock test": "PG Entrance Exam",
  "xat (mba) mock test": "PG Entrance Exam",
  "mat (mba) mock test": "PG Entrance Exam",
  "neet pg (medical) mock test": "PG Entrance Exam",
  "gpat (pharmacy) mock test": "PG Entrance Exam",
  "clat pg (law) mock test": "PG Entrance Exam",
  "tiss cuet pg mock test": "UG Entrance Exam",
  "nimcet (mca) mock test": "PG Entrance Exam",
  "jnu pg entrance (cuet pg route) mock test": "UG Entrance Exam",
  "university specific pg entrance exams mock test": "PG Entrance Exam",
  "rbi grade b mock test": "Regulatory Body Exams",
  "rbi assistant mock test": "Banking & Insurance",
  "sebi grade a mock test": "Regulatory Body Exams",
  "nabard grade a mock test": "Regulatory Body Exams",
  "irdai grade a mock test": "Regulatory Body Exams",
  "pfrda grade a mock test": "Regulatory Body Exams",
  "sidbi grade a mock test": "Regulatory Body Exams",
  "ifsca grade a mock test": "Regulatory Body Exams",
  "ibbi exam mock test": "Regulatory Body Exams",
  "ctet mock test": "Teaching Exam",
  "state tet (htet, uptet, reet, btet, etc.) mock test": "Teaching Exam",
  "ugc net mock test": "NET/SET",
  "csir net mock test": "NET/SET",
  "kvs teacher exam mock test": "Teaching Exam",
  "nvs teacher exam mock test": "Teaching Exam",
  "dsssb teacher exam mock test": "Teaching Exam",
  "tgt exam mock test": "Teaching Exam",
  "pgt exam mock test": "Teaching Exam",
  "prt exam mock test": "Teaching Exam",
  "b.ed entrance exam mock test": "Teaching Exam",
  "m.ed entrance exam mock test": "Teaching Exam",
  "set (state eligibility test) mock test": "NET/SET",
  "up tgt school teacher mock test": "Teaching Exam",
  "up pgt school teacher mock test": "Teaching Exam",
  "dsssb tgt mock test": "Teaching Exam",
  "kvs pgt mock test": "Teaching Exam",
  "up b.ed joint entrance exam mock test": "Teaching Exam",
  "bihar b.ed cet mock test": "Teaching Exam",
  "delhi university b.ed entrance mock test": "Teaching Exam",
  "ctet paper 1 child pedagogy": "Teaching Exam",
  "ctet paper 2 child pedagogy": "Teaching Exam",
  "uptet paper 1 mock test": "Teaching Exam",
  "super tet primary teacher mock test": "Teaching Exam",
  "iti fitter semester 1 mock test": "ITI Exam",
  "iti fitter semester 2 mock test": "ITI Exam",
  "iti fitter yearly theory mock test": "ITI Exam",
  "iti electrician semester 1 mock test": "ITI Exam",
  "iti electrician semester 2 mock test": "ITI Exam",
  "iti electrician yearly theory mock test": "ITI Exam",
  "iti electronic mechanic semester 1 mock test": "ITI Exam",
  "iti electronic mechanic semester 2 mock test": "ITI Exam",
  "iti electronic mechanic yearly theory mock test": "ITI Exam",
  "iti fitter trade theory mock test": "ITI Exam",
  "iti electrician trade theory mock test": "ITI Exam",
  "iti electronic mechanic trade theory mock test": "ITI Exam",
  "rrb je civil engineering mock test": "Engineering Test",
  "rrb je electrical engineering mock test": "Engineering Test",
  "rrb je mechanical engineering mock test": "Engineering Test",
  "ssc je civil technical mock test": "Engineering Test",
  "ssc je electrical technical mock test": "Engineering Test",
  "ssc je mechanical technical mock test": "Engineering Test",
  "state psc ae civil mock test": "Engineering Test",
  "state psc je electrical mock test": "Engineering Test",
  "gate mechanical engineering mock test": "Engineering Test",
  "ssc je mechanical mock test": "Engineering Test",
  "rrb je mechanical mock test": "Engineering Test",
  "isro mechanical mock test": "Engineering Test",
  "gate civil engineering mock test": "Engineering Test",
  "ssc je civil mock test": "Engineering Test",
  "rrb je civil mock test": "Engineering Test",
  "isro civil mock test": "Engineering Test",
  "gate electrical engineering mock test": "Engineering Test",
  "ssc je electrical mock test": "Engineering Test",
  "rrb je electrical mock test": "Engineering Test",
  "isro electrical mock test": "Engineering Test",
  "gate electronics & comm mock test": "Engineering Test",
  "isro electronics mock test": "Engineering Test",
  "barc electronics mock test": "Engineering Test",
  "gate computer science & it mock test": "Engineering Test",
  "isro computer science mock test": "Engineering Test",
  "nielit scientist b mock test": "Engineering Test",
  "gate chemical engineering mock test": "Engineering Test",
  "gate biotechnology mock test": "Engineering Test",
  "gate aerospace engineering mock test": "Engineering Test",
  "gate instrumentation engineering mock test": "Engineering Test",
  "isro instrumentation mock test": "Engineering Test",
  "delhi judiciary service mock test": "Judiciary Exam",
  "up civil judge junior mock test": "Judiciary Exam",
  "bihar judiciary exam mock test": "Judiciary Exam",
  "mp judiciary service mock test": "Judiciary Exam",
  "rajasthan judiciary mock test": "Judiciary Exam",
  "haryana judiciary exam mock test": "Judiciary Exam",
  "punjab judiciary exam mock test": "Judiciary Exam",
  "gujarat judiciary exam mock test": "Judiciary Exam",
  "maharashtra judiciary exam mock test": "Judiciary Exam",
  "west bengal judiciary exam mock test": "Judiciary Exam",
  "himachal pradesh judiciary exam mock test": "Judiciary Exam",
  "jharkhand judiciary exam mock test": "Judiciary Exam",
  "chhattisgarh judiciary exam mock test": "Judiciary Exam",
  "uttarakhand judiciary exam mock test": "Judiciary Exam",
  "odisha judiciary exam mock test": "Judiciary Exam",
  "karnataka judiciary exam mock test": "Judiciary Exam",
  "tamil nadu judiciary exam mock test": "Judiciary Exam",
  "andhra pradesh judiciary exam mock test": "Judiciary Exam",
  "telangana judiciary exam mock test": "Judiciary Exam",
  "kerala judiciary exam mock test": "Judiciary Exam",
  "assam judiciary exam mock test": "Judiciary Exam",
  "jammu & kashmir judiciary exam mock test": "Judiciary Exam",
  "goa judiciary exam mock test": "Judiciary Exam",
  "tripura judiciary exam mock test": "Judiciary Exam",
  "manipur judiciary exam mock test": "Judiciary Exam",
  "meghalaya judiciary exam mock test": "Judiciary Exam",
  "nagaland judiciary exam mock test": "Judiciary Exam",
  "arunachal pradesh judiciary exam mock test": "Judiciary Exam",
  "sikkim judiciary exam mock test": "Judiciary Exam",
  "aiims paramedical entrance exam mock test": "Paramedical Exams",
  "pgimer paramedical entrance mock test": "Paramedical Exams",
  "jipmer paramedical entrance mock test": "Paramedical Exams",
  "cuet ug (paramedical courses) mock test": "Paramedical Exams",
  "neet ug (some allied health courses) mock test": "Paramedical Exams",
  "up cpet (abvmu paramedical) mock test": "Paramedical Exams",
  "ruhs paramedical entrance mock test": "Paramedical Exams",
  "jenpas ug (west bengal) mock test": "Paramedical Exams",
  "smfwbee mock test": "Paramedical Exams",
  "uttarakhand paramedical entrance mock test": "Paramedical Exams",
  "bihar dcece paramedical mock test": "Paramedical Exams",
  "ipu cet (paramedical courses) mock test": "Paramedical Exams",
  "rrb ntpc cbt 1 mock test": "Railways",
  "rrb ntpc cbt 2 mock test": "Railways",
  "rrb alp stage 1 mock test": "Railways",
  "rrb alp stage 2 mock test": "Railways",
  "rrb group d mock test": "Railways",
  "rrb je cbt 1 mock test": "Railways",
  "sbi po mock test": "Banking & Insurance",
  "sbi clerk mock test": "Banking & Insurance",
  "ibps po mock test": "Banking & Insurance",
  "ibps clerk mock test": "Banking & Insurance",
  "ibps rrb po mock test": "Banking & Insurance",
  "lic aao mock test": "Banking & Insurance",
  "lic ado mock test": "Banking & Insurance",
  "niacl ao mock test": "Banking & Insurance",
  "sbi po preliminary mock test": "Banking & Insurance",
  "sbi clerk preliminary mock test": "Banking & Insurance",
  "ibps po preliminary mock test": "Banking & Insurance",
  "ibps clerk preliminary mock test": "Banking & Insurance",
  "uppsc pcs prelims mock test": "State Exam",
  "bpsc pcs prelims mock test": "State Exam",
  "mppsc pcs prelims mock test": "State Exam",
  "ras rajasthan pcs mock test": "State Exam",
  "mpsc maharashtra pcs mock test": "State Exam",
  "state psc gs paper 1 mock test": "State Exam",
  "state psc gs paper 2 mock test": "State Exam",
  "state pcs gs practice": "State Exam",
  "nda general ability mock test": "Defence Exams",
  "cds elementary mathematics mock test": "Defence Exams",
  "cds general knowledge mock test": "Defence Exams",
  "afcat entry mock test": "Defence Exams",
  "capf assistant commandant mock test": "Defence Exams",
  "indian airforce x/y group mock test": "Defence Exams",
  "upsc civil services prelims gs mock test": "Civil Services",
  "up police constable mock test": "Police Exams",
  "up police si mock test": "Police Exams",
  "delhi police constable mock test": "Police Exams",
  "delhi police si mock test": "Police Exams",
  "bihar police constable mock test": "Police Exams",
  "emrs non-teaching staff mock test": "Non - Teaching Exams",
  "dsssb non-teaching assistant mock test": "Non - Teaching Exams",
  "kvs non-teaching clerk mock test": "Non - Teaching Exams",
  "ugc net paper 1 general aptitude": "NET/SET",
  "ugc net commerce paper 2 mock test": "Accounting and Commerce",
  "ugc net computer science mock test": "NET/SET",
  "csir net life sciences mock test": "NET/SET",
  "ugc net paper 1 mock test series": "NET/SET",
  "ugc net economics mock test": "NET/SET",
  "ugc net political science mock test": "NET/SET",
  "ugc net philosophy mock test": "NET/SET",
  "ugc net psychology mock test": "NET/SET",
  "ugc net sociology mock test": "NET/SET",
  "ugc net history mock test": "NET/SET",
  "ugc net anthropology mock test": "NET/SET",
  "ugc net commerce mock test": "NET/SET",
  "ugc net education mock test": "NET/SET",
  "ugc net social work mock test": "NET/SET",
  "ugc net defence studies mock test": "NET/SET",
  "ugc net home science mock test": "NET/SET",
  "ugc net public administration mock test": "NET/SET",
  "ugc net population studies mock test": "NET/SET",
  "ugc net music mock test": "NET/SET",
  "fssai central food safety officer mock test": "Food Technology",
  "fssai technical officer mock test": "Food Technology",
  "state food safety officer mock test": "Food Technology",
  "aiims norcet nursing officer mock test": "Nursing Recruitment Exams",
  "esic staff nurse recruitment mock test": "Nursing Recruitment Exams",
  "dsssb nursing officer mock test": "Nursing Recruitment Exams",
  "cuet ug general test mock test": "UG Entrance Exam",
  "cuet ug section iii general test mock test": "UG Entrance Exam",
  "cuet ia english mock test": "UG Entrance Exam",
  "cuet physics & chemistry mock test": "UG Entrance Exam",
  "neet ug complete practice mock test": "NEET",
  "neet ug mock test series": "NEET",
  "jee main physics & chemistry mock test": "JEE",
  "jee main mathematics mock test": "JEE",
  "jee main mock test series": "JEE",
  "rajasthan gk mock test": "State GK",
  "uttar pradesh gk mock test": "State GK",
  "bihar gk mock test": "State GK",
  "madhya pradesh gk mock test": "State GK",
  "maharashtra gk mock test": "State GK",
  "haryana gk mock test": "State GK",
  "punjab gk mock test": "State GK",
  "gujarat gk mock test": "State GK",
  "west bengal gk mock test": "State GK",
  "karnataka gk mock test": "State GK",
  "tamil nadu gk mock test": "State GK",
  "andhra pradesh gk mock test": "State GK",
  "kerala gk mock test": "State GK",
  "telangana gk mock test": "State GK",
  "odisha gk mock test": "State GK",
  "assam gk mock test": "State GK",
  "jharkhand gk mock test": "State GK",
  "chhattisgarh gk mock test": "State GK",
  "uttarakhand gk mock test": "State GK",
  "himachal pradesh gk mock test": "State GK",
  "jammu & kashmir gk mock test": "State GK",
  "goa gk mock test": "State GK",
  "tripura gk mock test": "State GK",
  "manipur gk mock test": "State GK",
  "meghalaya gk mock test": "State GK",
  "nagaland gk mock test": "State GK",
  "arunachal pradesh gk mock test": "State GK",
  "mizoram gk mock test": "State GK",
  "sikkim gk mock test": "State GK",
  "delhi gk mock test": "State GK",
  "puducherry gk mock test": "State GK",
  "ladakh gk mock test": "State GK",
  "andaman & nicobar gk mock test": "State GK",
  "chandigarh gk mock test": "State GK",
  "dadra & nagar haveli & daman & diu gk mock test": "State GK",
  "lakshadweep gk mock test": "State GK",
  "indian history mock test": "Indian Studies",
  "indian geography mock test": "Indian Studies",
  "indian polity & constitution mock test": "Indian Studies",
  "indian economy mock test": "Indian Studies",
  "indian environment & ecology mock test": "Indian Studies",
  "indian administration & governance mock test": "Indian Studies",
  "indian sports & culture mock test": "Indian Studies",
  "indian socialism & social welfare mock test": "Indian Studies",
  "indian freedom movement mock test": "Indian Studies"
};


const getCategoryForCourse = (courseName: string): string => {
  const name = courseName.toLowerCase();
  if (courseToCategory[name]) {
    return courseToCategory[name];
  }
  if (name.includes("state gk") || name.includes("gk")) {
    return "State GK";
  }
  if (name.includes("indian history") || name.includes("indian geography") || name.includes("indian polity") || name.includes("indian economy") || name.includes("indian environment") || name.includes("indian admin") || name.includes("indian sports") || name.includes("indian socialism") || name.includes("indian freedom")) {
    return "Indian Studies";
  }
  if (name.includes("aiims paramedical") || name.includes("pgimer paramedical") || name.includes("jipmer paramedical") || name.includes("cpet") || name.includes("jenpas") || name.includes("smfwbee") || name.includes("dcece") || name.includes("paramedical")) {
    return "Paramedical Exams";
  }
  if (name.includes("teaching") || name.includes("ctet") || name.includes("pedagogy") || name.includes("tet") || name.includes("prt") || name.includes("pgt") || name.includes("tgt") || name.includes("b.ed") || name.includes("m.ed")) {
    return "Teaching Exam";
  }
  if (name.includes("rbi") || name.includes("sebi") || name.includes("nabard") || name.includes("irdai") || name.includes("pfrda") || name.includes("sidbi") || name.includes("ifsca") || name.includes("ibbi")) {
    return "Regulatory Body Exams";
  }
  if (name.includes("cuet pg") || name.includes("iit jam") || name.includes("gate") || name.includes("cat") || name.includes("cmat") || name.includes("xat") || name.includes("mat") || name.includes("neet pg") || name.includes("gpat") || name.includes("clat pg") || name.includes("nimcet")) {
    return "PG Entrance Exam";
  }
  if (name.includes("fitter") || name.includes("electrician") || name.includes("electronic mechanic") || name.includes("iti")) {
    return "ITI Exam";
  }
  if (name.includes("mechanical") || name.includes("civil engineering") || name.includes("electrical engineering") || name.includes("electronics &") || name.includes("computer science &") || name.includes("instrumentation")) {
    return "Engineering Test";
  }
  if (name.includes("neet")) {
    return "NEET";
  }
  if (name.includes("jee")) {
    return "JEE";
  }
  if (name.includes("net") || name.includes("set")) {
    return "NET/SET";
  }
  return "State Exam";
};


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
  if (name.includes("neet") && !name.includes("allied")) {
    return { questions: 20, marks: 80, duration: 30, language: "English, Hindi" };
  }
  if (name.includes("jee")) {
    return { questions: 20, marks: 80, duration: 30, language: "English, Hindi" };
  }
  if (name.includes("aiims paramedical")) {
    return { questions: 90, marks: 90, duration: 90, language: "English, Hindi" };
  }
  if (name.includes("pgimer paramedical")) {
    return { questions: 100, marks: 100, duration: 90, language: "English Only" };
  }
  if (name.includes("jipmer paramedical")) {
    return { questions: 100, marks: 100, duration: 90, language: "English Only" };
  }
  if (name.includes("cuet ug (paramedical")) {
    return { questions: 120, marks: 600, duration: 135, language: "English, Hindi" };
  }
  if (name.includes("neet ug (some allied")) {
    return { questions: 180, marks: 720, duration: 200, language: "English, Hindi" };
  }
  if (name.includes("up cpet")) {
    return { questions: 100, marks: 100, duration: 90, language: "English, Hindi" };
  }
  if (name.includes("ruhs paramedical")) {
    return { questions: 100, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("jenpas ug")) {
    return { questions: 100, marks: 115, duration: 90, language: "English Only" };
  }
  if (name.includes("smfwbee")) {
    return { questions: 100, marks: 100, duration: 120, language: "English Only" };
  }
  if (name.includes("uttarakhand paramedical")) {
    return { questions: 100, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("bihar dcece")) {
    return { questions: 90, marks: 450, duration: 135, language: "English, Hindi" };
  }
  if (name.includes("ipu cet (paramedical")) {
    return { questions: 150, marks: 600, duration: 150, language: "English Only" };
  }
  if (name.includes("ctet mock test")) {
    return { questions: 150, marks: 150, duration: 150, language: "English, Hindi" };
  }
  if (name.includes("state tet (htet, uptet, reet, btet, etc.)")) {
    return { questions: 150, marks: 150, duration: 150, language: "English, Hindi" };
  }
  if (name.includes("ugc net mock test")) {
    return { questions: 150, marks: 300, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("csir net mock test")) {
    return { questions: 120, marks: 200, duration: 180, language: "English Only" };
  }
  if (name.includes("kvs teacher exam")) {
    return { questions: 180, marks: 180, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("nvs teacher exam")) {
    return { questions: 150, marks: 150, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("dsssb teacher exam")) {
    return { questions: 200, marks: 200, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("tgt exam mock test")) {
    return { questions: 150, marks: 150, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("pgt exam mock test")) {
    return { questions: 150, marks: 150, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("prt exam mock test")) {
    return { questions: 150, marks: 150, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("b.ed entrance exam mock test")) {
    return { questions: 100, marks: 200, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("m.ed entrance exam mock test")) {
    return { questions: 100, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("set (state eligibility test) mock test")) {
    return { questions: 150, marks: 300, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("rbi grade b")) {
    return { questions: 200, marks: 200, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("gk mock test") || name.includes("state gk")) {
    return { questions: 100, marks: 100, duration: 90, language: "English, Hindi" };
  }
  if (name.includes("rbi assistant")) {
    return { questions: 100, marks: 100, duration: 60, language: "English, Hindi" };
  }
  if (name.includes("sebi grade a")) {
    return { questions: 100, marks: 100, duration: 80, language: "English Only" };
  }
  if (name.includes("nabard grade a")) {
    return { questions: 200, marks: 200, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("irdai grade a")) {
    return { questions: 160, marks: 160, duration: 90, language: "English Only" };
  }
  if (name.includes("pfrda grade a")) {
    return { questions: 100, marks: 100, duration: 80, language: "English Only" };
  }
  if (name.includes("sidbi grade a")) {
    return { questions: 160, marks: 200, duration: 120, language: "English Only" };
  }
  if (name.includes("ifsca grade a")) {
    return { questions: 100, marks: 100, duration: 80, language: "English Only" };
  }
  if (name.includes("ibbi exam")) {
    return { questions: 100, marks: 100, duration: 120, language: "English Only" };
  }
  if (name.includes("cuet pg")) {
    return { questions: 75, marks: 300, duration: 105, language: "English, Hindi" };
  }
  if (name.includes("iit jam")) {
    return { questions: 60, marks: 100, duration: 180, language: "English Only" };
  }
  if (name.includes("gate (pg/m.tech)")) {
    return { questions: 65, marks: 100, duration: 180, language: "English Only" };
  }
  if (name.includes("cat (mba)")) {
    return { questions: 66, marks: 198, duration: 120, language: "English Only" };
  }
  if (name.includes("cmat (mba)")) {
    return { questions: 100, marks: 400, duration: 180, language: "English Only" };
  }
  if (name.includes("xat (mba)")) {
    return { questions: 100, marks: 100, duration: 210, language: "English Only" };
  }
  if (name.includes("mat (mba)")) {
    return { questions: 150, marks: 150, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("neet pg")) {
    return { questions: 200, marks: 800, duration: 210, language: "English Only" };
  }
  if (name.includes("gpat")) {
    return { questions: 125, marks: 500, duration: 180, language: "English Only" };
  }
  if (name.includes("clat pg")) {
    return { questions: 120, marks: 120, duration: 120, language: "English Only" };
  }
  if (name.includes("tiss cuet pg")) {
    return { questions: 75, marks: 300, duration: 105, language: "English Only" };
  }
  if (name.includes("nimcet")) {
    return { questions: 120, marks: 1000, duration: 120, language: "English Only" };
  }
  if (name.includes("jnu pg")) {
    return { questions: 75, marks: 300, duration: 105, language: "English, Hindi" };
  }
  if (name.includes("university specific pg")) {
    return { questions: 100, marks: 100, duration: 90, language: "English, Hindi" };
  }
  if (name.includes("net") || name.includes("ugc") || name.includes("csir")) {
    return { questions: 150, marks: 300, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("cds") || name.includes("afcat") || name.includes("capf")) {
    return { questions: 120, marks: 300, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("pcs") || name.includes("civil services")) {
    return { questions: 100, marks: 200, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("tcs") || name.includes("infosys") || name.includes("wipro") || name.includes("cognizant")) {
    return { questions: 60, marks: 60, duration: 60, language: "English Only" };
  }
  if (name.includes("rrb alp") || name.includes("rrb group d") || name.includes("rrb ntpc") || name.includes("ntpc")) {
    return { questions: 100, marks: 100, duration: 90, language: "English, Hindi" };
  }
  if (name.includes("sbi po") || name.includes("ibps po") || name.includes("sbi clerk") || name.includes("ibps clerk") || name.includes("banking") || name.includes("rbi assistant")) {
    return { questions: 100, marks: 100, duration: 60, language: "English, Hindi" };
  }
  if (name.includes("lic") || name.includes("insurance")) {
    return { questions: 100, marks: 100, duration: 60, language: "English, Hindi" };
  }
  if (name.includes("non-teaching") || name.includes("non teaching")) {
    return { questions: 120, marks: 120, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("tgt") || name.includes("pgt")) {
    return { questions: 125, marks: 125, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("tet") || name.includes("prt")) {
    return { questions: 150, marks: 150, duration: 150, language: "English, Hindi" };
  }
  if (name.includes("food technology") || name.includes("food tech")) {
    return { questions: 100, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("nursing")) {
    return { questions: 100, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("civil engineering")) {
    return { questions: 100, marks: 100, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("electrical engineering")) {
    return { questions: 100, marks: 100, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("electronics & communication")) {
    return { questions: 100, marks: 100, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("computer science") || name.includes("cse")) {
    return { questions: 100, marks: 100, duration: 180, language: "English Only" };
  }
  if (name.includes("instrumentation")) {
    return { questions: 100, marks: 100, duration: 180, language: "English Only" };
  }
  if (name.includes("other engineering")) {
    return { questions: 100, marks: 100, duration: 180, language: "English, Hindi" };
  }
  if (name.includes("iti exam") || name.includes("iti")) {
    return { questions: 50, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("accounting") || name.includes("commerce")) {
    return { questions: 100, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("placement")) {
    return { questions: 60, marks: 60, duration: 60, language: "English Only" };
  }
  if (name.includes("nra cet") || name.includes("nra")) {
    return { questions: 100, marks: 100, duration: 60, language: "English, Hindi" };
  }
  if (name.includes("government org") || name.includes("gov org")) {
    return { questions: 100, marks: 100, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("ug entrance")) {
    return { questions: 100, marks: 150, duration: 120, language: "English, Hindi" };
  }
  if (name.includes("cuet")) {
    return { questions: 75, marks: 300, duration: 60, language: "English, Hindi" };
  }
  if (name.includes("mba")) {
    return { questions: 66, marks: 198, duration: 120, language: "English Only" };
  }
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
  
  const name = courseName.toLowerCase();
  const isSpecial20TestCourse = 
    name.includes("neet") || 
    name.includes("jee") || 
    name.includes("ugc net paper 1") || 
    name.includes("ugc net paper-1") ||
    name.includes("upsc civil services prelims gs");

  const totalTests = isSpecial20TestCourse ? 20 : 150;
  const freeTests = 3;
  
  const stats = getRealExamStats(courseName);

  const gradients = [
    "from-purple-200/50 to-purple-50",
    "from-pink-200/50 to-pink-50",
    "from-indigo-200/50 to-indigo-50"
  ];
  const gradient = gradients[hash % gradients.length];
  
  const icons: ("award" | "book" | "text" | "globe")[] = ["award", "book", "text", "globe"];
  const iconName = icons[hash % icons.length];

  const bullets = isSpecial20TestCourse 
    ? [
        "3 Full Mock Tests (Free)",
        "17 Premium Pass Tests",
        "2026 Exam Pattern Aligned",
        `Exam Pattern: ${stats.questions} Qs | ${stats.duration} Mins`
      ]
    : [
        "3 Full Mock Tests (Free)",
        `${totalTests - 3} Premium Pass Tests`,
        "Comprehensive Syllabus Cover",
        `Exam Pattern: ${stats.questions} Qs | ${stats.duration} Mins`
      ];

  return {
    users: `${userCount} Users`,
    totalTests,
    freeTests,
    languages: stats.language,
    bullets,
    gradient,
    iconName
  };
};

export default function EducationPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
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

  const categoryOrder = [
    "SSC", "PG Entrance Exam", "Regulatory Body Exams", "Teaching Exam",
    "ITI Exam", "Judiciary Exam", "Paramedical Exams",
    "Railways", "Banking & Insurance", "State Exam", "Defence Exams",
    "Civil Services", "Police Exams", "Non - Teaching Exams", "NET/SET",
    "Food Technology", "Nursing Recruitment Exams", "Engineering Test",
    "Accounting and Commerce", "Campus Placements", "NRA CET",
    "Government Organizations", "UG Entrance Exam", "NEET", "JEE",
    "MBA Entrance Exam", "State GK", "Indian Studies"
  ];

  let filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === "All") {
      return matchesSearch;
    } else {
      return matchesSearch && getCategoryForCourse(course.name) === activeCategory;
    }
  });

  if (activeCategory === "All") {
    const groups: { [key: string]: typeof courses } = {};
    filteredCourses.forEach((course) => {
      const cat = getCategoryForCourse(course.name);
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(course);
    });

    const allCats = Array.from(new Set([...categoryOrder, ...Object.keys(groups)]));
    const interleaved: typeof courses = [];
    let maxLen = 0;
    allCats.forEach((cat) => {
      if (groups[cat] && groups[cat].length > maxLen) {
        maxLen = groups[cat].length;
      }
    });

    for (let i = 0; i < maxLen; i++) {
      allCats.forEach((cat) => {
        if (groups[cat] && i < groups[cat].length) {
          interleaved.push(groups[cat][i]);
        }
      });
    }
    filteredCourses = interleaved;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-950 font-sans antialiased">
      <Herader />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_45%,#fffbeb_100%)] py-20 lg:py-24">
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
                    {[
                      "All", "SSC", "PG Entrance Exam", "Regulatory Body Exams", "Teaching Exam",
                      "ITI Exam", "Judiciary Exam", "Paramedical Exams",
                      "Railways", "Banking & Insurance", "State Exam", "Defence Exams",
                      "Civil Services", "Police Exams", "Non - Teaching Exams", "NET/SET",
                      "Food Technology", "Nursing Recruitment Exams", "Engineering Test",
                      "Accounting and Commerce", "Campus Placements", "NRA CET",
                      "Government Organizations", "UG Entrance Exam", "NEET", "JEE",
                      "MBA Entrance Exam", "State GK", "Indian Studies"
                    ].map((cat, idx) => (
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
                    {[
                      "All", "SSC", "PG Entrance Exam", "Regulatory Body Exams", "Teaching Exam",
                      "ITI Exam", "Judiciary Exam", "Paramedical Exams",
                      "Railways", "Banking & Insurance", "State Exam", "Defence Exams",
                      "Civil Services", "Police Exams", "Non - Teaching Exams", "NET/SET",
                      "Food Technology", "Nursing Recruitment Exams", "Engineering Test",
                      "Accounting and Commerce", "Campus Placements", "NRA CET",
                      "Government Organizations", "UG Entrance Exam", "NEET", "JEE",
                      "MBA Entrance Exam", "State GK", "Indian Studies"
                    ].map((cat, idx) => (
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
                        const meta = getCourseMetadata(course.name, course.id, course.premium);
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
                                    {course.premium ? `₹${Number(course.price || 99).toFixed(0)}/Month` : "Free"}
                                  </span>
                                </div>
                              </div>
                              <h3 className="mt-4 text-base font-bold text-slate-900 leading-tight min-h-[40px]">
                                {course.name}
                              </h3>
                              <p className="mt-2 text-[11px] font-semibold text-slate-600">
                                {meta.totalTests} Total Tests <span className="text-slate-300 mx-1">|</span> <span className="text-emerald-500">{course.premium ? "3 Free Tests" : "All Free Tests"}</span>
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
                              <Link href={`/education/test-series/${course.id}`} className="block w-full py-2.5 bg-[#00c2ff] hover:bg-[#00b0e6] text-white font-bold rounded-md text-sm text-center transition-colors">
                                View Test Series
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

      <Footer />
    </div>
  );
}
