export interface SubTest {
  id: string;
  name: string;
  type: string;
  qs: number;
  marks: number;
  duration: number;
  isFree: boolean;
}

export interface CourseMetadata {
  users: string;
  totalTests: number;
  freeTests: number;
  languages: string;
  bullets: string[];
  gradient: string;
  iconName: "award" | "book" | "text" | "globe";
}

export interface RealExamStats {
  questions: number;
  marks: number;
  duration: number;
  language: string;
}

export const getRealExamStats = (courseName: string): RealExamStats => {
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

export const getCourseSubjects = (courseName: string) => {
  const name = courseName.toLowerCase();
  
  if (name.includes("aiims paramedical")) {
    return [
      { name: "Physics", qs: 30, marks: 30, duration: 30 },
      { name: "Chemistry", qs: 30, marks: 30, duration: 30 },
      { name: "Biology/Mathematics", qs: 30, marks: 30, duration: 30 }
    ];
  }
  if (name.includes("pgimer paramedical")) {
    return [
      { name: "Physics & Chemistry", qs: 50, marks: 50, duration: 45 },
      { name: "Biology/Maths & General English", qs: 50, marks: 50, duration: 45 }
    ];
  }
  if (name.includes("jipmer paramedical")) {
    return [
      { name: "Physics & Chemistry", qs: 50, marks: 50, duration: 45 },
      { name: "Biology/English/Aptitude", qs: 50, marks: 50, duration: 45 }
    ];
  }
  if (name.includes("cuet ug (paramedical")) {
    return [
      { name: "Section I: English Language", qs: 40, marks: 200, duration: 45 },
      { name: "Section II: Physics & Chemistry", qs: 80, marks: 400, duration: 90 }
    ];
  }
  if (name.includes("neet ug (some allied")) {
    return [
      { name: "Physics", qs: 45, marks: 180, duration: 50 },
      { name: "Chemistry", qs: 45, marks: 180, duration: 50 },
      { name: "Biology (Botany & Zoology)", qs: 90, marks: 360, duration: 100 }
    ];
  }
  if (name.includes("up cpet")) {
    return [
      { name: "Physics & Chemistry", qs: 50, marks: 50, duration: 45 },
      { name: "Biology/English/General Knowledge", qs: 50, marks: 50, duration: 45 }
    ];
  }
  if (name.includes("ruhs paramedical")) {
    return [
      { name: "Physics", qs: 50, marks: 50, duration: 60 },
      { name: "Chemistry", qs: 50, marks: 50, duration: 60 }
    ];
  }
  if (name.includes("jenpas ug")) {
    return [
      { name: "Physics & Chemistry", qs: 50, marks: 50, duration: 45 },
      { name: "Biology, English & Logical Reasoning", qs: 50, marks: 65, duration: 45 }
    ];
  }
  if (name.includes("smfwbee")) {
    return [
      { name: "Physics & Chemistry", qs: 50, marks: 50, duration: 60 },
      { name: "Biology / Allied Sciences", qs: 50, marks: 50, duration: 60 }
    ];
  }
  if (name.includes("uttarakhand paramedical")) {
    return [
      { name: "Physics & Chemistry", qs: 50, marks: 50, duration: 60 },
      { name: "Biology / General Science", qs: 50, marks: 50, duration: 60 }
    ];
  }
  if (name.includes("bihar dcece")) {
    return [
      { name: "General Science (Physics, Chemistry, Biology)", qs: 25, marks: 125, duration: 40 },
      { name: "Mathematics & Hindi", qs: 30, marks: 150, duration: 45 },
      { name: "English & General Knowledge", qs: 35, marks: 175, duration: 50 }
    ];
  }
  if (name.includes("gk mock test") || name.includes("state gk")) {
    return [
      { name: "State History & Geography", qs: 40, marks: 40, duration: 35 },
      { name: "State Polity & Economy", qs: 30, marks: 30, duration: 25 },
      { name: "State Current Affairs & Culture", qs: 30, marks: 30, duration: 30 }
    ];
  }
  if (name.includes("ipu cet (paramedical")) {
    return [
      { name: "Physics", qs: 50, marks: 200, duration: 50 },
      { name: "Chemistry", qs: 50, marks: 200, duration: 50 },
      { name: "Biology", qs: 50, marks: 200, duration: 50 }
    ];
  }
  if (name.includes("ctet mock test")) {
    return [
      { name: "Child Development and Pedagogy", qs: 30, marks: 30, duration: 30 },
      { name: "Language I & II", qs: 60, marks: 60, duration: 60 },
      { name: "Mathematics & Environmental Studies", qs: 60, marks: 60, duration: 60 }
    ];
  }
  if (name.includes("state tet (htet, uptet, reet, btet, etc.)")) {
    return [
      { name: "Child Development and Pedagogy", qs: 30, marks: 30, duration: 30 },
      { name: "Language I & II", qs: 60, marks: 60, duration: 60 },
      { name: "Subject Competency (Math/Science/Social)", qs: 60, marks: 60, duration: 60 }
    ];
  }
  if (name.includes("ugc net mock test")) {
    return [
      { name: "Paper I: General Teaching & Research Aptitude", qs: 50, marks: 100, duration: 60 },
      { name: "Paper II: Subject Specific Advanced Paper", qs: 100, marks: 200, duration: 120 }
    ];
  }
  if (name.includes("csir net mock test")) {
    return [
      { name: "Part A: General Science & Quantitative Reasoning", qs: 20, marks: 30, duration: 30 },
      { name: "Part B & C: Core Subject Knowledge", qs: 100, marks: 170, duration: 150 }
    ];
  }
  if (name.includes("kvs teacher exam") || name.includes("nvs teacher exam")) {
    return [
      { name: "General English & Hindi", qs: 20, marks: 20, duration: 20 },
      { name: "General Awareness, Reasoning & Computer Literacy", qs: 40, marks: 40, duration: 40 },
      { name: "Perspectives on Education & Leadership", qs: 60, marks: 60, duration: 60 },
      { name: "Subject Specific Test", qs: 60, marks: 60, duration: 60 }
    ];
  }
  if (name.includes("dsssb teacher exam")) {
    return [
      { name: "General Awareness & Reasoning", qs: 40, marks: 40, duration: 30 },
      { name: "Arithmetical & Numerical Ability", qs: 20, marks: 20, duration: 20 },
      { name: "Hindi & English Language", qs: 40, marks: 40, duration: 30 },
      { name: "Subject Pedagogy & Teaching Methodology", qs: 100, marks: 100, duration: 40 }
    ];
  }
  if (name.includes("tgt exam mock test") || name.includes("pgt exam mock test") || name.includes("prt exam mock test")) {
    return [
      { name: "General Aptitude & Pedagogy", qs: 50, marks: 50, duration: 40 },
      { name: "Domain Knowledge", qs: 100, marks: 100, duration: 80 }
    ];
  }
  if (name.includes("b.ed entrance exam mock test") || name.includes("m.ed entrance exam mock test")) {
    return [
      { name: "General Knowledge & Teaching Aptitude", qs: 50, marks: 100, duration: 90 },
      { name: "General English & Subject Aptitude", qs: 50, marks: 100, duration: 90 }
    ];
  }
  if (name.includes("set (state eligibility test) mock test")) {
    return [
      { name: "Paper I: General Teaching Aptitude", qs: 50, marks: 100, duration: 60 },
      { name: "Paper II: Core Domain Knowledge", qs: 100, marks: 200, duration: 120 }
    ];
  }
  if (name.includes("rbi grade b")) {
    return [
      { name: "General Awareness", qs: 80, marks: 80, duration: 25 },
      { name: "Reasoning Ability", qs: 60, marks: 60, duration: 45 },
      { name: "Quantitative Aptitude", qs: 30, marks: 30, duration: 25 },
      { name: "English Language", qs: 30, marks: 30, duration: 25 }
    ];
  }
  if (name.includes("sebi grade a") || name.includes("pfrda grade a") || name.includes("ifsca grade a")) {
    return [
      { name: "General Awareness & English", qs: 40, marks: 40, duration: 30 },
      { name: "Quantitative Aptitude & Reasoning", qs: 40, marks: 40, duration: 30 },
      { name: "Specialized Stream Paper", qs: 20, marks: 20, duration: 20 }
    ];
  }
  if (name.includes("nabard grade a") || name.includes("sidbi grade a")) {
    return [
      { name: "Reasoning & Quantitative Aptitude", qs: 40, marks: 40, duration: 30 },
      { name: "General Awareness & Agriculture/Rural Dev", qs: 80, marks: 80, duration: 50 },
      { name: "English & Computer Knowledge", qs: 40, marks: 40, duration: 40 }
    ];
  }
  if (name.includes("irdai grade a")) {
    return [
      { name: "Reasoning & English", qs: 80, marks: 80, duration: 45 },
      { name: "Quantitative Aptitude & GA", qs: 80, marks: 80, duration: 45 }
    ];
  }
  if (name.includes("ibbi exam")) {
    return [
      { name: "Insolvency Code & Allied Laws", qs: 60, marks: 60, duration: 70 },
      { name: "Finance, Accounting & Valuation", qs: 40, marks: 40, duration: 50 }
    ];
  }
  if (name.includes("cuet pg") || name.includes("jnu pg") || name.includes("tiss cuet pg")) {
    return [
      { name: "Domain Specific Knowledge", qs: 75, marks: 300, duration: 105 }
    ];
  }
  if (name.includes("iit jam")) {
    return [
      { name: "Section A: Multiple Choice Questions", qs: 30, marks: 50, duration: 90 },
      { name: "Section B & C: MSQ & NAT Questions", qs: 30, marks: 50, duration: 90 }
    ];
  }
  if (name.includes("gate (pg/m.tech)") || name.includes("gate")) {
    return [
      { name: "General Aptitude", qs: 10, marks: 15, duration: 30 },
      { name: "Core Engineering & Mathematics", qs: 55, marks: 85, duration: 150 }
    ];
  }
  if (name.includes("cat (mba)") || name.includes("xat (mba)")) {
    return [
      { name: "Verbal Ability & Reading Comprehension", qs: 24, marks: 72, duration: 40 },
      { name: "Data Interpretation & Logical Reasoning", qs: 20, marks: 60, duration: 40 },
      { name: "Quantitative Ability", qs: 22, marks: 66, duration: 40 }
    ];
  }
  if (name.includes("cmat (mba)") || name.includes("mat (mba)")) {
    return [
      { name: "Quantitative Technique & Data Interpretation", qs: 20, marks: 80, duration: 35 },
      { name: "Logical Reasoning & Language Comprehension", qs: 40, marks: 160, duration: 70 },
      { name: "General Awareness & Innovation", qs: 40, marks: 160, duration: 75 }
    ];
  }
  if (name.includes("neet pg") || name.includes("gpat")) {
    return [
      { name: "Clinical & Pre-Clinical Subjects", qs: 100, marks: 400, duration: 105 },
      { name: "Para-Clinical & Pharmaceutical Sciences", qs: 100, marks: 400, duration: 105 }
    ];
  }
  if (name.includes("clat pg")) {
    return [
      { name: "Constitutional Law", qs: 60, marks: 60, duration: 60 },
      { name: "Jurisprudence, Administrative Law & Law of Contracts", qs: 60, marks: 60, duration: 60 }
    ];
  }
  if (name.includes("nimcet")) {
    return [
      { name: "Mathematics", qs: 50, marks: 600, duration: 70 },
      { name: "Analytical Ability & Logical Reasoning", qs: 40, marks: 240, duration: 30 },
      { name: "Computer Awareness & English", qs: 30, marks: 160, duration: 20 }
    ];
  }
  if (name.includes("university specific pg")) {
    return [
      { name: "General Aptitude", qs: 25, marks: 25, duration: 25 },
      { name: "Subject Domain Knowledge", qs: 75, marks: 75, duration: 65 }
    ];
  }
  if (name.includes("net") || name.includes("ugc") || name.includes("csir")) {
    return [
      { name: "Paper 1: Teaching & Research Aptitude", qs: 50, marks: 100, duration: 60 },
      { name: "Paper 2: Domain Knowledge", qs: 100, marks: 200, duration: 120 }
    ];
  }
  if (name.includes("cds") || name.includes("afcat") || name.includes("capf")) {
    return [
      { name: "English Language", qs: 40, marks: 100, duration: 40 },
      { name: "General Knowledge", qs: 40, marks: 100, duration: 40 },
      { name: "Elementary Mathematics", qs: 40, marks: 100, duration: 40 }
    ];
  }
  if (name.includes("pcs") || name.includes("civil services")) {
    return [
      { name: "General Studies 1", qs: 50, marks: 100, duration: 60 },
      { name: "General Studies 2 / CSAT", qs: 50, marks: 100, duration: 60 }
    ];
  }
  if (name.includes("tcs") || name.includes("infosys") || name.includes("wipro") || name.includes("cognizant") || name.includes("placement")) {
    return [
      { name: "Numerical & Verbal Ability", qs: 30, marks: 30, duration: 30 },
      { name: "Reasoning & Coding Assessment", qs: 30, marks: 30, duration: 30 }
    ];
  }
  if (name.includes("rrb alp") || name.includes("rrb group d") || name.includes("rrb ntpc") || name.includes("ntpc")) {
    return [
      { name: "Mathematics", qs: 30, marks: 30, duration: 25 },
      { name: "General Intelligence & Reasoning", qs: 30, marks: 30, duration: 25 },
      { name: "General Science & General Awareness", qs: 40, marks: 40, duration: 40 }
    ];
  }
  if (name.includes("sbi po") || name.includes("ibps po") || name.includes("sbi clerk") || name.includes("ibps clerk") || name.includes("banking") || name.includes("rbi assistant")) {
    return [
      { name: "English Language", qs: 30, marks: 30, duration: 20 },
      { name: "Quantitative Aptitude", qs: 35, marks: 35, duration: 20 },
      { name: "Reasoning Ability", qs: 35, marks: 35, duration: 20 }
    ];
  }
  if (name.includes("lic") || name.includes("insurance")) {
    return [
      { name: "Reasoning Ability", qs: 35, marks: 35, duration: 20 },
      { name: "Numerical Ability", qs: 35, marks: 35, duration: 20 },
      { name: "English Language", qs: 30, marks: 30, duration: 20 }
    ];
  }
  if (name.includes("non-teaching") || name.includes("non teaching")) {
    return [
      { name: "Reasoning & Quantitative Ability", qs: 60, marks: 60, duration: 60 },
      { name: "General Awareness & Language", qs: 60, marks: 60, duration: 60 }
    ];
  }
  if (name.includes("food technology") || name.includes("food tech")) {
    return [
      { name: "General Aptitude", qs: 30, marks: 30, duration: 30 },
      { name: "Food Technology & Microbiology", qs: 70, marks: 70, duration: 90 }
    ];
  }
  if (name.includes("nursing")) {
    return [
      { name: "Anatomy & Physiology", qs: 50, marks: 50, duration: 60 },
      { name: "Nursing Foundation & Pharmacology", qs: 50, marks: 50, duration: 60 }
    ];
  }
  if (name.includes("iti exam") || name.includes("iti") || name.includes("fitter") || name.includes("electrician") || name.includes("electronic mechanic")) {
    return [
      { name: "Trade Theory", qs: 25, marks: 50, duration: 60 },
      { name: "Workshop Calculation & Employability Skills", qs: 25, marks: 50, duration: 60 }
    ];
  }
  if (name.includes("accounting") || name.includes("commerce")) {
    return [
      { name: "Financial Accounting & Auditing", qs: 50, marks: 50, duration: 60 },
      { name: "Business Laws & Taxation", qs: 50, marks: 50, duration: 60 }
    ];
  }
  if (name.includes("nra cet") || name.includes("nra")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 25, marks: 25, duration: 15 },
      { name: "General Awareness & Quantitative Aptitude", qs: 50, marks: 50, duration: 30 },
      { name: "English Comprehension", qs: 25, marks: 25, duration: 15 }
    ];
  }
  if (name.includes("government org") || name.includes("gov org")) {
    return [
      { name: "Reasoning & General Awareness", qs: 50, marks: 50, duration: 60 },
      { name: "Technical / Domain Specific Paper", qs: 50, marks: 50, duration: 60 }
    ];
  }
  if (name.includes("ug entrance") || name.includes("cuet")) {
    return [
      { name: "Language Test", qs: 25, marks: 100, duration: 30 },
      { name: "Domain Specific Subject", qs: 50, marks: 200, duration: 30 }
    ];
  }
  if (name.includes("ssc cgl") || name.includes("cgl")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 25, marks: 50, duration: 15 },
      { name: "General Awareness", qs: 25, marks: 50, duration: 15 },
      { name: "Quantitative Aptitude", qs: 25, marks: 50, duration: 15 },
      { name: "English Comprehension", qs: 25, marks: 50, duration: 15 }
    ];
  }
  if (name.includes("police") || name.includes("constable")) {
    return [
      { name: "General Knowledge & Reasoning", qs: 75, marks: 150, duration: 60 },
      { name: "Numerical & Mental Ability", qs: 75, marks: 150, duration: 60 }
    ];
  }

  // Default Fallback
  return [
    { name: "Quantitative Aptitude", qs: 25, marks: 25, duration: 25 },
    { name: "General Intelligence & Reasoning", qs: 25, marks: 25, duration: 20 },
    { name: "General Awareness", qs: 25, marks: 25, duration: 20 },
    { name: "English Comprehension", qs: 25, marks: 25, duration: 25 }
  ];
};

export const generateSubTestsList = (courseName: string, isPremium: boolean): SubTest[] => {
  const stats = getRealExamStats(courseName);
  const subjects = getCourseSubjects(courseName);
  const tests: SubTest[] = [];
  const name = courseName.toLowerCase();

  const isSpecial20TestCourse = 
    name.includes("neet") || 
    name.includes("jee") || 
    name.includes("ugc net paper 1") || 
    name.includes("ugc net paper-1") ||
    name.includes("upsc civil services prelims gs");

  const normName = courseName.toLowerCase().trim();
  const spec = SPECIAL_COURSE_SPECS[normName];

  if (spec && spec.totalTests === 40) {
    // Generate exactly 40 tests (10 Full Mock + 15 Subject Tests + 10 Chapter Tests + 5 PYP)
    for (let i = 1; i <= 10; i++) {
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
    subjects.forEach((sub, subIdx) => {
      for (let i = 1; i <= 4; i++) {
        if (tests.length >= 25) break;
        tests.push({
          id: `st-${subIdx}-${i}`,
          name: `Subject Test ${i}: ${sub.name}`,
          type: "Subject Test",
          qs: sub.qs,
          marks: sub.marks,
          duration: sub.duration,
          isFree: false
        });
      }
    });
    while (tests.length < 25) {
      const idx = tests.length - 9;
      tests.push({
        id: `st-${idx}`,
        name: `Subject Test ${idx}: Core Concepts`,
        type: "Subject Test",
        qs: stats.questions,
        marks: stats.marks,
        duration: stats.duration,
        isFree: false
      });
    }
    for (let i = 1; i <= 10; i++) {
      tests.push({
        id: `ct-${i}`,
        name: `Chapter Test ${i}: Topic Mastery & Practice`,
        type: "Chapter Test",
        qs: 20,
        marks: 40,
        duration: 20,
        isFree: false
      });
    }
    for (let i = 1; i <= 5; i++) {
      const year = 2020 + i;
      tests.push({
        id: `pyp-${i}`,
        name: `Previous Year Paper (${year} Exam)`,
        type: "PYP",
        qs: stats.questions,
        marks: stats.marks,
        duration: stats.duration,
        isFree: false
      });
    }
  } else if (isSpecial20TestCourse) {
    for (let i = 1; i <= 20; i++) {
      tests.push({
        id: `fmt-${i}`,
        name: `Complete Mock Test ${i}`,
        type: "Full Mock",
        qs: stats.questions,
        marks: stats.marks,
        duration: stats.duration,
        isFree: false
      });
    }
  } else {
    // 1. Full Length Mock Tests (10 tests)
    for (let i = 1; i <= 10; i++) {
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

    // 2. Subject Tests (3 tests per subject)
    let stCounter = 1;
    subjects.forEach((sub) => {
      for (let i = 1; i <= 3; i++) {
        tests.push({
          id: `st-${stCounter++}`,
          name: `Subject Test ${i}: ${sub.name}`,
          type: "Subject Test",
          qs: sub.qs,
          marks: sub.marks,
          duration: sub.duration,
          isFree: false
        });
      }
    });

    // 3. Chapter Tests (3 tests per subject)
    let ctCounter = 1;
    subjects.forEach((sub) => {
      const chapters = [
        { prefix: "Foundation Concept Booster", qs: 15, marks: 30, duration: 15 },
        { prefix: "Core Topic Evaluation", qs: 20, marks: 40, duration: 20 },
        { prefix: "Advanced Practice Set", qs: 25, marks: 50, duration: 20 }
      ];
      chapters.forEach((chap, chapIdx) => {
        tests.push({
          id: `ct-${ctCounter++}`,
          name: `Chapter Test ${chapIdx + 1}: ${sub.name} - ${chap.prefix}`,
          type: "Chapter Test",
          qs: chap.qs,
          marks: chap.marks,
          duration: chap.duration,
          isFree: false
        });
      });
    });

    // 4. Previous Year Papers (6 tests)
    for (let i = 0; i < 6; i++) {
      const year = 2020 + i;
      tests.push({
        id: `pyp-${i + 1}`,
        name: `Previous Year Paper (${year} Exam)`,
        type: "PYP",
        qs: stats.questions,
        marks: stats.marks,
        duration: stats.duration,
        isFree: false
      });
    }
  }

  // Set first 3 tests free if premium, else all free
  tests.forEach((test, index) => {
    if (!isPremium) {
      test.isFree = true;
    } else {
      test.isFree = (index < 3);
    }
  });

  return tests;
};

const SPECIAL_COURSE_SPECS: Record<string, {
  users: string;
  totalTests: number;
  freeTests: number;
  bullets: string[];
  languages?: string;
}> = {
  "nra cet 12th level mock test": {
    users: "53.6k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "40 Total Tests Available", "Comprehensive Syllabus Cover"]
  },
  "nra cet higher secondary 12th level mock test": {
    users: "53.6k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "40 Total Tests Available", "Comprehensive Syllabus Cover"]
  },
  "nra cet graduates mock test": {
    users: "54.2k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "40 Total Tests Available", "Comprehensive Syllabus Cover"]
  },
  "nra cet graduation level mock test": {
    users: "54.2k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "40 Total Tests Available", "Comprehensive Syllabus Cover"]
  },
  "aiims cre ldc/udc/steno/deo/jaa/sa mock test": {
    users: "57.7k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "nbe junior assistant 2024 mock tests series": {
    users: "9.2k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "5 PYP"]
  },
  "isro assistant mock test 2022": {
    users: "34.1k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "5 Previous Year Papers"]
  },
  "isro junior personal assistant mock test 2022": {
    users: "29.1k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "ccras udc/ldc/steno/assistant mock test": {
    users: "32.7k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "nbe junior assistant mock test": {
    users: "38.0k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "cwc (central warehousing corporation) superintendent mock test": {
    users: "6.6k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "fci manager phase i & ii mock test 2022": {
    users: "205.4k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "fci stenographer mock test 2022": {
    users: "233.8k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "csir junior secretariat assistant (jsa) 2025 mock test": {
    users: "39.6k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "csir aso/so mock test 2023": {
    users: "133.9k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "upsc epfo personal assistant mock test": {
    users: "31.7k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "csir junior stenographer 2025 mock test": {
    users: "13.0k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "aai junior executive (common cadre) mock test": {
    users: "117.1k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "supreme court junior court assistant mock test": {
    users: "68.7k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "ccras mts 2025 mock test series": {
    users: "18.4k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "cbse junior assistant mock test 2025 (old)": {
    users: "65.1k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "jci junior assistant mock test series": {
    users: "5.8k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "cbse assistant/superintendent & all other post(tier i) mock test": {
    users: "10.6k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "npcil stipendiary trainee (category ii) prelims 2026 mock test": {
    users: "6.2k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "5 Previous Year Papers"]
  },
  "india post postman & mail guard mock test": {
    users: "75.7k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "epfo stenographer (group c) mock test 2023": {
    users: "113.1k Users",
    totalTests: 40,
    freeTests: 3,
    languages: "Hindi, English",
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "sgpgi stenographer mock test series 2025": {
    users: "22.6k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  },
  "npcil scientific assistant physics mock test": {
    users: "17.5k Users",
    totalTests: 40,
    freeTests: 3,
    bullets: ["3 Full Mock Tests (Free)", "37 Premium Pass Tests", "15 Subject Tests", "10 Chapter Tests"]
  }
};

export const getCourseTestCount = (
  courseName: string,
  isPremium: boolean = false,
  dbTestSeries?: any[]
): number => {
  const normName = courseName.toLowerCase().trim();
  if (SPECIAL_COURSE_SPECS[normName]) {
    return SPECIAL_COURSE_SPECS[normName].totalTests;
  }
  if (dbTestSeries && Array.isArray(dbTestSeries) && dbTestSeries.length > 0) {
    return dbTestSeries.length;
  }
  return generateSubTestsList(courseName, isPremium).length;
};

export const getCourseMetadata = (
  courseName: string,
  courseId: number,
  isPremium: boolean,
  dbTestSeries?: any[]
): CourseMetadata => {
  const normName = courseName.toLowerCase().trim();
  const spec = SPECIAL_COURSE_SPECS[normName];

  const hash = courseName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + (courseId || 0);
  const userCount = spec ? spec.users : ((hash % 400) + 400).toFixed(1) + "k";

  let totalTests = 0;
  let freeTests = 3;

  if (spec) {
    totalTests = spec.totalTests;
    freeTests = spec.freeTests;
  } else if (dbTestSeries && Array.isArray(dbTestSeries) && dbTestSeries.length > 0) {
    totalTests = dbTestSeries.length;
    freeTests = Math.min(totalTests, dbTestSeries.filter((t: any) => t.isFree).length || 3);
  } else {
    const subTests = generateSubTestsList(courseName, isPremium);
    totalTests = subTests.length;
    freeTests = Math.min(totalTests, subTests.filter((t) => t.isFree).length || 3);
  }

  if (!isPremium) {
    freeTests = totalTests;
  }

  const stats = getRealExamStats(courseName);

  const gradients = [
    "from-purple-200/50 to-purple-50",
    "from-pink-200/50 to-pink-50",
    "from-indigo-200/50 to-indigo-50"
  ];
  const gradient = gradients[hash % gradients.length];

  const icons: ("award" | "book" | "text" | "globe")[] = ["award", "book", "text", "globe"];
  const iconName = icons[hash % icons.length];

  const premiumTestsCount = Math.max(0, totalTests - freeTests);

  const bullets = spec ? spec.bullets : [
    `${freeTests} Full Mock Tests (Free)`,
    `${premiumTestsCount} Premium Pass Tests`,
    "2026 Exam Pattern Aligned",
    `Exam Pattern: ${stats.questions} Qs | ${stats.duration} Mins`
  ];

  return {
    users: `${userCount}`,
    totalTests,
    freeTests,
    languages: spec?.languages || stats.language,
    bullets,
    gradient,
    iconName
  };
};
