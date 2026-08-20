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

  // ── 1. BIOLOGY & MEDICAL DISCIPLINES ──
  if (name.includes("botany")) {
    return [
      { name: "Plant Diversity & Morphology", qs: 25, marks: 100, duration: 25 },
      { name: "Plant Physiology, Genetics & Cell Biology", qs: 25, marks: 100, duration: 25 }
    ];
  }
  if (name.includes("zoology")) {
    return [
      { name: "Human Physiology & Reproduction", qs: 25, marks: 100, duration: 25 },
      { name: "Evolution, Genetics & Animal Diversity", qs: 25, marks: 100, duration: 25 }
    ];
  }
  if (name.includes("biology") || name.includes("neet biology") || name.includes("biotechnology") || name.includes("life science")) {
    return [
      { name: "Botany (Section A & B)", qs: 50, marks: 200, duration: 45 },
      { name: "Zoology (Section A & B)", qs: 50, marks: 200, duration: 45 }
    ];
  }
  if (name.includes("organic chemistry")) {
    return [
      { name: "Reaction Mechanisms & Hydrocarbons", qs: 25, marks: 100, duration: 25 },
      { name: "Functional Groups & Biomolecules", qs: 25, marks: 100, duration: 25 }
    ];
  }
  if (name.includes("inorganic chemistry")) {
    return [
      { name: "Chemical Bonding & Periodic Properties", qs: 25, marks: 100, duration: 25 },
      { name: "Coordination Compounds & Metallurgy", qs: 25, marks: 100, duration: 25 }
    ];
  }
  if (name.includes("physical chemistry")) {
    return [
      { name: "Thermodynamics & Chemical Kinetics", qs: 25, marks: 100, duration: 25 },
      { name: "Electrochemistry & Equilibrium", qs: 25, marks: 100, duration: 25 }
    ];
  }
  if (name.includes("chemistry")) {
    return [
      { name: "Physical & Inorganic Chemistry", qs: 25, marks: 100, duration: 25 },
      { name: "Organic Chemistry & Environmental Chemistry", qs: 25, marks: 100, duration: 25 }
    ];
  }
  if (name.includes("mechanics") || name.includes("electrodynamics") || name.includes("optics") || name.includes("physics")) {
    return [
      { name: "Mechanics, Waves & Thermodynamics", qs: 25, marks: 100, duration: 25 },
      { name: "Electromagnetism, Optics & Modern Physics", qs: 25, marks: 100, duration: 25 }
    ];
  }
  if (name.includes("algebra")) {
    return [
      { name: "Matrices, Determinants & Complex Numbers", qs: 15, marks: 50, duration: 30 },
      { name: "Permutations, Combinations & Probability", qs: 15, marks: 50, duration: 30 }
    ];
  }
  if (name.includes("calculus")) {
    return [
      { name: "Differential Calculus & Continuity", qs: 15, marks: 50, duration: 30 },
      { name: "Integral Calculus & Differential Equations", qs: 15, marks: 50, duration: 30 }
    ];
  }
  if (name.includes("mathematics") || name.includes("maths") || name.includes("math mock")) {
    return [
      { name: "Algebra & Coordinate Geometry", qs: 15, marks: 50, duration: 30 },
      { name: "Calculus, Vectors & Trigonometry", qs: 15, marks: 50, duration: 30 }
    ];
  }
  if (name.includes("neet pg") || name.includes("medical pg")) {
    return [
      { name: "Pre & Para-Clinical Medical Sciences", qs: 100, marks: 400, duration: 105 },
      { name: "Clinical Medicine, Surgery & Obstetrics", qs: 100, marks: 400, duration: 105 }
    ];
  }
  if (name.includes("neet")) {
    return [
      { name: "Physics (Section A & B)", qs: 45, marks: 180, duration: 45 },
      { name: "Chemistry (Section A & B)", qs: 45, marks: 180, duration: 45 },
      { name: "Botany (Section A & B)", qs: 45, marks: 180, duration: 45 },
      { name: "Zoology (Section A & B)", qs: 45, marks: 180, duration: 45 }
    ];
  }
  if (name.includes("jee main") || name.includes("jee advanced") || name.includes("iit jam")) {
    return [
      { name: "Physics", qs: 30, marks: 100, duration: 60 },
      { name: "Chemistry", qs: 30, marks: 100, duration: 60 },
      { name: "Mathematics", qs: 30, marks: 100, duration: 60 }
    ];
  }

  // ── 2. SSC EXAMS ──
  if (name.includes("ssc cgl") || name.includes("cgl")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 25, marks: 50, duration: 15 },
      { name: "General Awareness", qs: 25, marks: 50, duration: 15 },
      { name: "Quantitative Aptitude", qs: 25, marks: 50, duration: 15 },
      { name: "English Comprehension", qs: 25, marks: 50, duration: 15 }
    ];
  }
  if (name.includes("ssc chsl") || name.includes("chsl")) {
    return [
      { name: "English Language (Basic Knowledge)", qs: 25, marks: 50, duration: 15 },
      { name: "General Intelligence", qs: 25, marks: 50, duration: 15 },
      { name: "Quantitative Aptitude (Basic Arithmetic)", qs: 25, marks: 50, duration: 15 },
      { name: "General Awareness", qs: 25, marks: 50, duration: 15 }
    ];
  }
  if (name.includes("ssc mts") || name.includes("mts")) {
    return [
      { name: "Numerical & Mathematical Ability", qs: 20, marks: 60, duration: 25 },
      { name: "Reasoning Ability & Problem Solving", qs: 20, marks: 60, duration: 25 },
      { name: "General Awareness", qs: 25, marks: 75, duration: 20 },
      { name: "English Language & Comprehension", qs: 25, marks: 75, duration: 20 }
    ];
  }
  if (name.includes("ssc gd") || name.includes("gd constable")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 20, marks: 40, duration: 15 },
      { name: "General Knowledge & General Awareness", qs: 20, marks: 40, duration: 15 },
      { name: "Elementary Mathematics", qs: 20, marks: 40, duration: 15 },
      { name: "English / Hindi", qs: 20, marks: 40, duration: 15 }
    ];
  }
  if (name.includes("ssc cpo") || name.includes("cpo") || name.includes("delhi police si")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 50, marks: 50, duration: 30 },
      { name: "General Knowledge & General Awareness", qs: 50, marks: 50, duration: 30 },
      { name: "Quantitative Aptitude", qs: 50, marks: 50, duration: 30 },
      { name: "English Comprehension", qs: 50, marks: 50, duration: 30 }
    ];
  }
  if (name.includes("ssc je") || name.includes("rrb je") || name.includes("junior engineer")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 50, marks: 50, duration: 30 },
      { name: "General Awareness", qs: 50, marks: 50, duration: 30 },
      { name: "General Engineering (Discipline Specific)", qs: 100, marks: 100, duration: 60 }
    ];
  }
  if (name.includes("ssc stenographer") || name.includes("stenographer") || name.includes("steno")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 50, marks: 50, duration: 30 },
      { name: "General Awareness", qs: 50, marks: 50, duration: 30 },
      { name: "English Language & Comprehension", qs: 100, marks: 100, duration: 60 }
    ];
  }
  if (name.includes("jht") || name.includes("hindi translator")) {
    return [
      { name: "General Hindi", qs: 100, marks: 100, duration: 60 },
      { name: "General English", qs: 100, marks: 100, duration: 60 }
    ];
  }

  // ── 3. RAILWAYS EXAMS ──
  if (name.includes("rrb ntpc") || name.includes("ntpc")) {
    return [
      { name: "General Awareness", qs: 40, marks: 40, duration: 35 },
      { name: "Mathematics", qs: 30, marks: 30, duration: 30 },
      { name: "General Intelligence & Reasoning", qs: 30, marks: 30, duration: 25 }
    ];
  }
  if (name.includes("rrb alp") || name.includes("alp & technician") || name.includes("loco pilot")) {
    return [
      { name: "Mathematics", qs: 20, marks: 20, duration: 15 },
      { name: "General Intelligence & Reasoning", qs: 25, marks: 25, duration: 20 },
      { name: "General Science", qs: 20, marks: 20, duration: 15 },
      { name: "General Awareness & Current Affairs", qs: 10, marks: 10, duration: 10 }
    ];
  }
  if (name.includes("rrb group d") || name.includes("group d")) {
    return [
      { name: "General Science", qs: 25, marks: 25, duration: 25 },
      { name: "Mathematics", qs: 25, marks: 25, duration: 25 },
      { name: "General Intelligence & Reasoning", qs: 30, marks: 30, duration: 25 },
      { name: "General Awareness & Current Affairs", qs: 20, marks: 20, duration: 15 }
    ];
  }

  // ── 4. BANKING & FINANCIAL INSTITUTIONS ──
  if (name.includes("sbi po") || name.includes("ibps po") || name.includes("sbi clerk") || name.includes("ibps clerk") || name.includes("rbi assistant") || name.includes("banking") || name.includes("rrb po") || name.includes("rrb clerk") || name.includes("ibps rrb")) {
    return [
      { name: "English Language", qs: 30, marks: 30, duration: 20 },
      { name: "Quantitative Aptitude", qs: 35, marks: 35, duration: 20 },
      { name: "Reasoning Ability", qs: 35, marks: 35, duration: 20 }
    ];
  }
  if (name.includes("rbi grade b")) {
    return [
      { name: "General Awareness", qs: 80, marks: 80, duration: 45 },
      { name: "Reasoning", qs: 60, marks: 60, duration: 45 },
      { name: "English Language", qs: 30, marks: 30, duration: 25 },
      { name: "Quantitative Aptitude", qs: 30, marks: 30, duration: 25 }
    ];
  }
  if (name.includes("sebi") || name.includes("nabard") || name.includes("irdai") || name.includes("pfrda") || name.includes("sidbi") || name.includes("ifsca")) {
    return [
      { name: "General Awareness & Financial Sector", qs: 40, marks: 40, duration: 30 },
      { name: "English Language & Quantitative Aptitude", qs: 30, marks: 30, duration: 25 },
      { name: "Reasoning Ability & Computer Knowledge", qs: 30, marks: 30, duration: 25 }
    ];
  }
  if (name.includes("lic") || name.includes("insurance") || name.includes("niacl") || name.includes("gic")) {
    return [
      { name: "Reasoning Ability", qs: 35, marks: 35, duration: 20 },
      { name: "Numerical Ability", qs: 35, marks: 35, duration: 20 },
      { name: "English Language", qs: 30, marks: 30, duration: 20 }
    ];
  }

  // ── 5. TEACHING EXAMS ──
  if (name.includes("ctet") || name.includes("uptet") || name.includes("reet") || name.includes("tet")) {
    return [
      { name: "Child Development & Pedagogy", qs: 30, marks: 30, duration: 30 },
      { name: "Language I (Hindi / Regional)", qs: 30, marks: 30, duration: 30 },
      { name: "Language II (English)", qs: 30, marks: 30, duration: 30 },
      { name: "Mathematics & Environmental Studies", qs: 60, marks: 60, duration: 60 }
    ];
  }
  if (name.includes("ugc net") || name.includes("csir net") || name.includes("net exam")) {
    return [
      { name: "Paper 1: Teaching & Research Aptitude", qs: 50, marks: 100, duration: 60 },
      { name: "Paper 2: Domain Specific Advanced Paper", qs: 100, marks: 200, duration: 120 }
    ];
  }
  if (name.includes("kvs") || name.includes("nvs") || name.includes("dsssb teacher") || name.includes("tgt") || name.includes("pgt") || name.includes("prt") || name.includes("b.ed") || name.includes("m.ed")) {
    return [
      { name: "General Knowledge, Reasoning & Language", qs: 50, marks: 50, duration: 50 },
      { name: "Teaching Aptitude & Pedagogy / Subject Domain", qs: 50, marks: 50, duration: 50 }
    ];
  }

  // ── 6. ITI & VOCATIONAL TRADES ──
  if (name.includes("fitter")) {
    return [
      { name: "Trade Theory & Fitting Workshop Practice", qs: 38, marks: 76, duration: 60 },
      { name: "Workshop Calculation & Science", qs: 6, marks: 12, duration: 15 },
      { name: "Engineering Drawing & Employability Skills", qs: 6, marks: 12, duration: 15 }
    ];
  }
  if (name.includes("electrician")) {
    return [
      { name: "Trade Theory & Electrical Circuits/Machines", qs: 38, marks: 76, duration: 60 },
      { name: "Workshop Calculation & Science", qs: 6, marks: 12, duration: 15 },
      { name: "Engineering Drawing & Employability Skills", qs: 6, marks: 12, duration: 15 }
    ];
  }
  if (name.includes("electronic mechanic") || name.includes("electronics")) {
    return [
      { name: "Trade Theory & Semiconductor / Microcontroller", qs: 38, marks: 76, duration: 60 },
      { name: "Workshop Calculation & Science", qs: 6, marks: 12, duration: 15 },
      { name: "Engineering Drawing & Employability Skills", qs: 6, marks: 12, duration: 15 }
    ];
  }

  // ── 7. ENGINEERING DISCIPLINES (GATE, PSUs, AE/JE) ──
  if (name.includes("instrumentation")) {
    return [
      { name: "Sensors, Transducers & Industrial Instrumentation", qs: 35, marks: 35, duration: 40 },
      { name: "Control Systems & Signal Conditioning", qs: 35, marks: 35, duration: 40 },
      { name: "Analog & Digital Electronics", qs: 30, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("civil")) {
    return [
      { name: "Structural Engineering & Concrete Technology", qs: 35, marks: 35, duration: 40 },
      { name: "Geotechnical & Environmental Engineering", qs: 35, marks: 35, duration: 40 },
      { name: "Surveying, Transportation & Hydrology", qs: 30, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("electrical")) {
    return [
      { name: "Electrical Circuits & Power Systems", qs: 35, marks: 35, duration: 40 },
      { name: "Electrical Machines & Power Electronics", qs: 35, marks: 35, duration: 40 },
      { name: "Control Systems, Signals & Measurements", qs: 30, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("mechanical")) {
    return [
      { name: "Thermodynamics & Heat Transfer", qs: 35, marks: 35, duration: 40 },
      { name: "Fluid Mechanics & Manufacturing Technology", qs: 35, marks: 35, duration: 40 },
      { name: "Theory of Machines & Strength of Materials", qs: 30, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("computer science") || name.includes("cse") || name.includes("it mock") || name.includes("nielit")) {
    return [
      { name: "Data Structures, Algorithms & Programming", qs: 35, marks: 35, duration: 40 },
      { name: "Computer Networks, OS & DBMS", qs: 35, marks: 35, duration: 40 },
      { name: "Theory of Computation & Digital Logic", qs: 30, marks: 30, duration: 40 }
    ];
  }

  // ── 8. LAW & JUDICIARY ──
  if (name.includes("judiciary") || name.includes("judge") || name.includes("clat")) {
    return [
      { name: "Code of Civil Procedure & Law of Contract", qs: 40, marks: 40, duration: 40 },
      { name: "Code of Criminal Procedure & Indian Penal Code", qs: 35, marks: 35, duration: 40 },
      { name: "Constitutional Law & Law of Evidence", qs: 25, marks: 25, duration: 40 }
    ];
  }

  // ── 9. HEALTHCARE & NURSING ──
  if (name.includes("nursing") || name.includes("norcet") || name.includes("staff nurse")) {
    return [
      { name: "Anatomy, Physiology & Medical Surgical Nursing", qs: 40, marks: 40, duration: 45 },
      { name: "Pharmacology, Community Health & Obstetrics", qs: 40, marks: 40, duration: 45 },
      { name: "General Aptitude & General Knowledge", qs: 20, marks: 20, duration: 30 }
    ];
  }
  if (name.includes("food safety") || name.includes("fssai")) {
    return [
      { name: "FSSAI Act, Rules & Food Safety Ecosystem", qs: 40, marks: 40, duration: 45 },
      { name: "Food Science, Microbiology & Quality Control", qs: 40, marks: 40, duration: 45 },
      { name: "General Aptitude & Computer Literacy", qs: 20, marks: 20, duration: 30 }
    ];
  }

  // ── 10. COMMERCE & ACCOUNTING ──
  if (name.includes("accounting") || name.includes("accountant") || name.includes("commerce") || name.includes("cma") || name.includes("ca foundation") || name.includes("tally")) {
    return [
      { name: "Financial Accounting, Corporate Accounting & Auditing", qs: 50, marks: 50, duration: 60 },
      { name: "Business Laws, Taxation & Costing", qs: 50, marks: 50, duration: 60 }
    ];
  }

  // ── 11. DEFENCE & POLICE ──
  if (name.includes("police") || name.includes("constable") || name.includes("sub inspector") || name.includes("daroga")) {
    return [
      { name: "General Knowledge & Current Affairs", qs: 38, marks: 76, duration: 30 },
      { name: "General Hindi", qs: 37, marks: 74, duration: 30 },
      { name: "Numerical & Mental Ability", qs: 38, marks: 76, duration: 30 },
      { name: "Mental Aptitude, I.Q. & Reasoning Ability", qs: 37, marks: 74, duration: 30 }
    ];
  }
  if (name.includes("nda")) {
    return [
      { name: "Mathematics", qs: 120, marks: 300, duration: 150 },
      { name: "General Ability Test (GAT)", qs: 150, marks: 600, duration: 150 }
    ];
  }
  if (name.includes("cds") || name.includes("afcat") || name.includes("capf")) {
    return [
      { name: "English Language", qs: 40, marks: 100, duration: 40 },
      { name: "General Knowledge", qs: 40, marks: 100, duration: 40 },
      { name: "Elementary Mathematics", qs: 40, marks: 100, duration: 40 }
    ];
  }

  // ── 12. MANAGEMENT & PLACEMENT ──
  if (name.includes("cat (mba)") || name.includes("cmat") || name.includes("xat") || name.includes("mat") || name.includes("snap") || name.includes("nmat") || name.includes("mah cet") || name.includes("mba")) {
    return [
      { name: "Verbal Ability & Reading Comprehension (VARC)", qs: 24, marks: 72, duration: 40 },
      { name: "Data Interpretation & Logical Reasoning (DILR)", qs: 20, marks: 60, duration: 40 },
      { name: "Quantitative Aptitude (QA)", qs: 22, marks: 66, duration: 40 }
    ];
  }
  if (name.includes("tcs") || name.includes("infosys") || name.includes("wipro") || name.includes("cognizant") || name.includes("placement") || name.includes("accenture") || name.includes("capgemini") || name.includes("tech mahindra") || name.includes("mindtree") || name.includes("deloitte") || name.includes("tech bee")) {
    return [
      { name: "Numerical Ability", qs: 20, marks: 20, duration: 20 },
      { name: "Reasoning Ability", qs: 20, marks: 20, duration: 20 },
      { name: "Verbal Ability & Technical Assessment", qs: 20, marks: 20, duration: 20 }
    ];
  }

  // ── 13. CUET & UG ENTRANCE ──
  if (name.includes("cuet") || name.includes("ug entrance")) {
    return [
      { name: "Section IA: Language Aptitude", qs: 25, marks: 125, duration: 30 },
      { name: "Section II: Domain Specific Subject", qs: 25, marks: 125, duration: 30 }
    ];
  }

  // ── 14. GENERAL KNOWLEDGE & SUBJECTS ──
  if (name.includes("history")) {
    return [
      { name: "Ancient & Medieval Indian History", qs: 25, marks: 50, duration: 30 },
      { name: "Modern History & Indian National Movement", qs: 25, marks: 50, duration: 30 }
    ];
  }
  if (name.includes("geography")) {
    return [
      { name: "Physical & World Geography", qs: 25, marks: 50, duration: 30 },
      { name: "Indian Geography, Climate & Resources", qs: 25, marks: 50, duration: 30 }
    ];
  }
  if (name.includes("polity") || name.includes("constitution") || name.includes("governance")) {
    return [
      { name: "Constitutional Framework & Fundamental Rights", qs: 25, marks: 50, duration: 30 },
      { name: "Union & State Governance, Judiciary & Local Bodies", qs: 25, marks: 50, duration: 30 }
    ];
  }
  if (name.includes("economy") || name.includes("economic")) {
    return [
      { name: "Macroeconomics, Fiscal & Monetary Policies", qs: 25, marks: 50, duration: 30 },
      { name: "Indian Economic Development & Budget / Reforms", qs: 25, marks: 50, duration: 30 }
    ];
  }
  if (name.includes("environment") || name.includes("ecology")) {
    return [
      { name: "Ecology, Ecosystems & Biodiversity", qs: 25, marks: 50, duration: 30 },
      { name: "Environmental Pollution, Climate Change & Conservation", qs: 25, marks: 50, duration: 30 }
    ];
  }
  if (name.includes("gk") || name.includes("general knowledge") || name.includes("current affairs") || name.includes("general awareness")) {
    return [
      { name: "History, Culture & Heritage", qs: 25, marks: 50, duration: 25 },
      { name: "Geography & Economy", qs: 25, marks: 50, duration: 25 },
      { name: "Polity & Current Affairs", qs: 25, marks: 50, duration: 25 },
      { name: "General Science & Environment", qs: 25, marks: 50, duration: 25 }
    ];
  }

  // ── 15. STATE PSC & CIVIL SERVICES ──
  if (name.includes("pcs") || name.includes("psc") || name.includes("civil services") || name.includes("uppsc") || name.includes("bpsc") || name.includes("mppsc") || name.includes("ras") || name.includes("mpsc")) {
    return [
      { name: "General Studies (History, Polity, Geography & Economy)", qs: 50, marks: 100, duration: 60 },
      { name: "General Science, Current Affairs & State GK", qs: 50, marks: 100, duration: 60 }
    ];
  }

  // ── 16. CENTRAL PSUs, SCIENTIST & RESEARCH (ISRO, BARC, DRDO, AAI, FCI, CSIR, NPCIL) ──
  if (name.includes("scientist") || name.includes("scientific officer") || name.includes("barc") || name.includes("drdo") || name.includes("isro scientist")) {
    return [
      { name: "Core Engineering / Science Discipline Knowledge", qs: 60, marks: 180, duration: 90 },
      { name: "Engineering Mathematics & General Aptitude", qs: 20, marks: 60, duration: 30 }
    ];
  }
  if (name.includes("gate") || name.includes("m.tech")) {
    return [
      { name: "General Aptitude", qs: 15, marks: 15, duration: 30 },
      { name: "Engineering Mathematics & Core Subject", qs: 50, marks: 85, duration: 150 }
    ];
  }
  if (name.includes("paramedical") || name.includes("cpet") || name.includes("ruhs") || name.includes("jenpas") || name.includes("smfwbee") || name.includes("dcece") || name.includes("jipmer") || name.includes("pgimer")) {
    return [
      { name: "Physics & Chemistry", qs: 50, marks: 50, duration: 45 },
      { name: "Biology / Allied Health Science & Aptitude", qs: 50, marks: 50, duration: 45 }
    ];
  }
  if (name.includes("pharmacy") || name.includes("gpat")) {
    return [
      { name: "Pharmaceutics & Pharmacology", qs: 65, marks: 260, duration: 90 },
      { name: "Pharmaceutical Chemistry & Pharmacognosy", qs: 60, marks: 240, duration: 90 }
    ];
  }
  if (name.includes("nimcet") || name.includes("mca")) {
    return [
      { name: "Mathematics", qs: 50, marks: 600, duration: 60 },
      { name: "Analytical Ability & Logical Reasoning", qs: 40, marks: 240, duration: 35 },
      { name: "Computer Awareness & English", qs: 30, marks: 160, duration: 25 }
    ];
  }
  if (name.includes("set (state eligibility test)") || name.includes("state eligibility")) {
    return [
      { name: "Paper I: General Teaching & Research Aptitude", qs: 50, marks: 100, duration: 60 },
      { name: "Paper II: Core Subject Specialized Paper", qs: 100, marks: 200, duration: 120 }
    ];
  }
  if (name.includes("pg entrance") || name.includes("university specific")) {
    return [
      { name: "General Aptitude & Language", qs: 25, marks: 100, duration: 30 },
      { name: "Subject Domain Specialized Paper", qs: 50, marks: 200, duration: 60 }
    ];
  }
  if (name.includes("ibbi")) {
    return [
      { name: "Insolvency and Bankruptcy Code Regulations", qs: 60, marks: 60, duration: 70 },
      { name: "General Laws, Finance & Accounts", qs: 40, marks: 40, duration: 50 }
    ];
  }
  if (name.includes("selection post") || name.includes("departmental")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 25, marks: 50, duration: 15 },
      { name: "General Awareness", qs: 25, marks: 50, duration: 15 },
      { name: "Quantitative Aptitude", qs: 25, marks: 50, duration: 15 },
      { name: "English Language", qs: 25, marks: 50, duration: 15 }
    ];
  }
  if (name.includes("airforce") || name.includes("air force") || name.includes("x/y group")) {
    return [
      { name: "English Language", qs: 20, marks: 20, duration: 20 },
      { name: "Physics & Mathematics (Tech X) / Reasoning & GA (Y)", qs: 50, marks: 50, duration: 45 }
    ];
  }
  if (name.includes("nra cet") || name.includes("nra")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 25, marks: 50, duration: 15 },
      { name: "General Awareness", qs: 25, marks: 50, duration: 15 },
      { name: "Quantitative Aptitude", qs: 25, marks: 50, duration: 15 },
      { name: "English Comprehension", qs: 25, marks: 50, duration: 15 }
    ];
  }
  if (name.includes("fci") || name.includes("csir") || name.includes("aso") || name.includes("so") || name.includes("manager") || name.includes("assistant") || name.includes("non-teaching") || name.includes("superintendent") || name.includes("clerk") || name.includes("postman") || name.includes("mail guard") || name.includes("stipendiary trainee") || name.includes("executive")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 25, marks: 25, duration: 20 },
      { name: "General Awareness & Current Affairs", qs: 25, marks: 25, duration: 20 },
      { name: "Quantitative Aptitude / Numerical Ability", qs: 25, marks: 25, duration: 25 },
      { name: "General English / Hindi & Computer Literacy", qs: 25, marks: 25, duration: 25 }
    ];
  }
  if (name.includes("web development") || name.includes("programming") || name.includes("software")) {
    return [
      { name: "Core Fundamentals & Frontend Technologies", qs: 50, marks: 50, duration: 45 },
      { name: "Backend Architecture, Databases & APIs", qs: 50, marks: 50, duration: 45 }
    ];
  }
  if (name.includes("grammar") || name.includes("english mastery") || name.includes("english")) {
    return [
      { name: "Grammar, Parts of Speech & Syntax", qs: 50, marks: 50, duration: 45 },
      { name: "Vocabulary, Idioms & Reading Comprehension", qs: 50, marks: 50, duration: 45 }
    ];
  }
  if (name.includes("sports") || name.includes("culture") || name.includes("socialism") || name.includes("welfare") || name.includes("freedom movement")) {
    return [
      { name: "Core Subject History & Concepts", qs: 50, marks: 50, duration: 45 },
      { name: "Contemporary Developments & GK", qs: 50, marks: 50, duration: 45 }
    ];
  }

  // ── Default Fallback ──
  return [
    { name: "General Intelligence & Reasoning", qs: 25, marks: 25, duration: 20 },
    { name: "General Awareness & Domain Knowledge", qs: 50, marks: 50, duration: 45 },
    { name: "Language & Quantitative Aptitude", qs: 25, marks: 25, duration: 25 }
  ];
};

export const generateSubTestsList = (courseName: string, isPremium: boolean): SubTest[] => {
  const stats = getRealExamStats(courseName);
  const tests: SubTest[] = [];

  // 1. Exactly 5 Full Length Mock Tests
  for (let i = 1; i <= 5; i++) {
    tests.push({
      id: `fmt-${i}`,
      name: `Full Length Mock Test ${i}`,
      type: "Full Mock",
      qs: stats.questions,
      marks: stats.marks,
      duration: stats.duration,
      isFree: i <= 3
    });
  }

  // 2. Exactly 5 Chapter Tests
  for (let i = 1; i <= 5; i++) {
    tests.push({
      id: `ct-${i}`,
      name: `Chapter Test ${i}`,
      type: "Chapter Test",
      qs: Math.min(25, stats.questions),
      marks: Math.min(25, stats.questions),
      duration: Math.max(15, Math.round(stats.duration / 3)),
      isFree: false
    });
  }

  // Set free status: if not premium, all are free; if premium, first 3 are free
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
}> = {};

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
  let freeTests = 4;

  if (spec) {
    totalTests = spec.totalTests;
    freeTests = spec.freeTests;
  } else if (dbTestSeries && Array.isArray(dbTestSeries) && dbTestSeries.length > 0) {
    totalTests = dbTestSeries.length;
    freeTests = Math.min(totalTests, dbTestSeries.filter((t: any) => t.isFree).length || 4);
  } else {
    const subTests = generateSubTestsList(courseName, isPremium);
    totalTests = subTests.length;
    freeTests = Math.min(totalTests, subTests.filter((t) => t.isFree).length || 4);
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
