export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  dob?: string | null;
  address?: string | null;
  student_id: string;
  created_at: string;
  course_name?: string;
  course_id?: number | string;
  category_id?: number | string;
  category_name?: string;
}

export interface StudyMaterial {
  id: number;
  courseId?: number | string;
  courseName?: string;
  categoryId?: number | string;
  categoryName?: string;
  subject: string;
  title: string;
  readTime: string;
  content: string;
}

export interface Activity {
  id: number;
  type: "lesson" | "quiz" | "login" | "logout";
  title: string;
  timestamp: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  hint: string;
}

export interface StudentLog {
  id: number;
  action: string;
  timestamp: string;
}

// Study materials mapped to specific Categories & Courses
export const STUDY_MATERIALS: StudyMaterial[] = [
  // --- SSC & GOVERNMENT EXAMS CATEGORY ---
  {
    id: 101,
    courseId: 9001,
    courseName: "SSC CGL / NRA CET Mock Test",
    categoryId: 10,
    categoryName: "SSC & Government Exams",
    subject: "Indian Polity",
    title: "SSC Prep: Preamble & Fundamental Rights Overview",
    readTime: "10 mins read",
    content: "The Preamble to the Constitution of India is a brief introductory statement that sets out guidelines to guide the nation. It highlights Justice (Social, Economic, Political), Liberty (Thought, Expression, Belief, Faith, Worship), Equality (Status and Opportunity), and Fraternity. Articles 12 to 35 under Part III of the Constitution guarantee Fundamental Rights to all citizens: Right to Equality (Art. 14-18), Right to Freedom (Art. 19-22), Right against Exploitation (Art. 23-24), Right to Freedom of Religion (Art. 25-28), Cultural & Educational Rights (Art. 29-30), and Right to Constitutional Remedies (Art. 32).",
  },
  {
    id: 102,
    courseId: 9001,
    courseName: "SSC CGL / NRA CET Mock Test",
    categoryId: 10,
    categoryName: "SSC & Government Exams",
    subject: "General Awareness",
    title: "SSC Prep: Indian Freedom Movement Highlights (1857-1947)",
    readTime: "14 mins read",
    content: "The Indian Independence Movement spans major historical milestones: The Revolt of 1857 (Sepoy Mutiny), Foundation of the Indian National Congress (1885), Partition of Bengal & Swadeshi Movement (1905), Non-Cooperation Movement (1920-1922), Civil Disobedience Movement & Salt Satyagraha (1930), Government of India Act (1935), and Quit India Movement (1942). The movement culminated in the Indian Independence Act of 1947, creating the sovereign dominions of India and Pakistan.",
  },
  {
    id: 103,
    courseId: 9001,
    courseName: "SSC CGL / NRA CET Mock Test",
    categoryId: 10,
    categoryName: "SSC & Government Exams",
    subject: "Logical Reasoning",
    title: "SSC Prep: Syllogism & Logical Deduction Rules",
    readTime: "12 mins read",
    content: "Syllogism questions test logical reasoning by drawing conclusions from given statements. Use Venn Diagram methods to represent universal affirmative (All A are B), universal negative (No A is B), particular affirmative (Some A are B), and particular negative (Some A are not B). Remember: Never assume real-world facts outside the given statements; rely purely on formal logical validity.",
  },

  // --- NRA CET & RAILWAYS CATEGORY ---
  {
    id: 201,
    courseId: 9002,
    courseName: "NRA CET Graduates Mock Test",
    categoryId: 11,
    categoryName: "NRA CET & Railways",
    subject: "General Science",
    title: "NRA CET Prep: Chemistry Periodic Table & Bonding Essentials",
    readTime: "11 mins read",
    content: "The Modern Periodic Table organizes elements by atomic number in 18 groups and 7 periods. Group 1 elements (Alkalis) are highly reactive metals. Group 17 (Halogens) and Group 18 (Noble Gases) play key roles in chemical bonding. Chemical bonds include Ionic (electron transfer), Covalent (electron sharing), and Metallic bonds. Electronegativity increases across a period and decreases down a group.",
  },
  {
    id: 202,
    courseId: 9002,
    courseName: "NRA CET Graduates Mock Test",
    categoryId: 11,
    categoryName: "NRA CET & Railways",
    subject: "General Knowledge",
    title: "NRA CET Prep: World Geography & Major Indian Rivers",
    readTime: "13 mins read",
    content: "Indian river systems are categorized into Himalayan (Ganga, Indus, Brahmaputra) and Peninsular rivers (Godavari, Krishna, Cauvery, Narmada, Tapti). Ganga is the longest river in India (2,525 km), originating from the Gangotri Glacier as Bhagirathi. Peninsular rivers are rain-fed and seasonal, while Himalayan rivers are perennial, fed by snowmelts and rainfall.",
  },

  // --- BANKING & INSURANCE CATEGORY ---
  {
    id: 301,
    courseId: 9009,
    courseName: "CWC & FCI Manager / Banking Mock Test",
    categoryId: 12,
    categoryName: "Banking & Insurance",
    subject: "Banking Awareness",
    title: "Banking Prep: RBI Monetary Policy & Economic Instruments",
    readTime: "15 mins read",
    content: "The Reserve Bank of India (RBI) controls money supply and inflation using Quantitative and Qualitative instruments. Repo Rate is the rate at which RBI lends money to commercial banks against government securities. Reverse Repo Rate is the interest rate RBI pays on commercial bank deposits. Cash Reserve Ratio (CRR) is the percentage of Net Demand and Time Liabilities (NDTL) banks must hold with RBI in cash. Statutory Liquidity Ratio (SLR) is the percentage banks must maintain in liquid assets like gold or government bonds.",
  },
  {
    id: 302,
    courseId: 9009,
    courseName: "CWC & FCI Manager / Banking Mock Test",
    categoryId: 12,
    categoryName: "Banking & Insurance",
    subject: "Quantitative Aptitude",
    title: "Banking Prep: Data Interpretation (DI) Shortcuts & Speed Math",
    readTime: "10 mins read",
    content: "Data Interpretation (DI) in banking exams features Pie Charts, Bar Graphs, Line Graphs, and Radar Charts. Master percentage calculations, ratios, and averages to solve DI sets rapidly. Shortcut rule: Memorize fraction-to-percentage conversions (e.g. 1/6 = 16.66%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%).",
  },

  // --- MEDICAL & PARAMEDICAL CATEGORY ---
  {
    id: 401,
    courseId: 9003,
    courseName: "AIIMS CRE / PGIMER Paramedical Mock Test",
    categoryId: 13,
    categoryName: "Paramedical & Nursing",
    subject: "Human Anatomy",
    title: "Paramedical Prep: Cardiovascular System & Heart Anatomy",
    readTime: "16 mins read",
    content: "The human heart is a 4-chambered muscular organ: right atrium, right ventricle, left atrium, and left ventricle. Deoxygenated blood enters the right atrium via the Vena Cava, passes through the Tricuspid valve into the right ventricle, and is pumped to lungs via the Pulmonary Artery. Oxygenated blood returns to the left atrium via Pulmonary Veins, passes through the Bicuspid (Mitral) valve to the left ventricle, and is distributed to the body via the Aorta.",
  },
  {
    id: 402,
    courseId: 9003,
    courseName: "AIIMS CRE / PGIMER Paramedical Mock Test",
    categoryId: 13,
    categoryName: "Paramedical & Nursing",
    subject: "Biochemistry",
    title: "Paramedical Prep: Blood Composition & Hematology Basics",
    readTime: "14 mins read",
    content: "Blood accounts for ~8% of total body weight, consisting of 55% liquid Plasma and 45% Formed Elements (Erythrocytes/RBCs, Leukocytes/WBCs, and Thrombocytes/Platelets). RBCs transport oxygen via Hemoglobin (normal range: 12-16 g/dL). WBCs defend against pathogens (Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils). Platelets are essential for blood clotting via the coagulation cascade.",
  },

  // --- COMPUTER SCIENCE CATEGORY ---
  {
    id: 3,
    courseId: 2,
    courseName: "Computer Science Core",
    categoryId: 2,
    categoryName: "Computer Science",
    subject: "Computer Science",
    title: "Introduction to Databases & SQL Keys",
    readTime: "12 mins read",
    content: "A database is an organized collection of data stored electronically. Relational databases store records in tables with rows and columns, structured by SQL (Structured Query Language). A primary key is a field that uniquely identifies each record in a table. A foreign key is a field that links records in two different tables. Normalization is the process of structuring a database to reduce data redundancy and improve data integrity.",
  },
  {
    id: 4,
    courseId: 2,
    courseName: "Computer Science Core",
    categoryId: 2,
    categoryName: "Computer Science",
    subject: "Computer Science",
    title: "Introduction to Sorting Algorithms",
    readTime: "15 mins read",
    content: "Sorting algorithms arrange elements of a list in a specific order (numerical or lexicographical). Popular algorithms include Bubble Sort, Insertion Sort, Merge Sort, and Quick Sort. Understanding time complexity (Big O notation) is essential for evaluating sorting efficiency in software systems.",
  },

  // --- ENGLISH & VERBAL ABILITY ---
  {
    id: 5,
    courseId: 3,
    courseName: "English Grammar Mastery",
    categoryId: 3,
    categoryName: "English & Verbal Ability",
    subject: "English Grammar",
    title: "Active vs. Passive Voice Rules",
    readTime: "6 mins read",
    content: "In active voice, the subject of the sentence performs the action (e.g., 'The student wrote the quiz'). In passive voice, the subject receives the action (e.g., 'The quiz was written by the student'). Use active voice for strong, direct writing, and passive voice when the performer of the action is unknown or when emphasizing the action itself rather than the actor.",
  },
  {
    id: 6,
    courseId: 3,
    courseName: "English Grammar Mastery",
    categoryId: 3,
    categoryName: "English & Verbal Ability",
    subject: "English Grammar",
    title: "Tenses & Aspect Guidelines",
    readTime: "10 mins read",
    content: "English verbs have three primary tenses: Past, Present, and Future. Each tense has four aspects: Simple, Continuous, Perfect, and Perfect Continuous. Mastering tenses is crucial for effective and accurate written and verbal communication.",
  },

  // --- MATH & QUANTITATIVE APTITUDE ---
  {
    id: 7,
    courseId: 4,
    courseName: "Math & Algebra Essentials",
    categoryId: 4,
    categoryName: "Math & Quantitative Aptitude",
    subject: "Algebra",
    title: "Linear Equations & Solving Variables",
    readTime: "9 mins read",
    content: "A linear equation is an algebraic equation of the first degree, meaning it contains variables to the power of 1. Solving a linear equation involves isolating the variable on one side by applying reciprocal operations (addition/subtraction, multiplication/division) to both sides.",
  },
  {
    id: 8,
    courseId: 4,
    courseName: "Math & Algebra Essentials",
    categoryId: 4,
    categoryName: "Math & Quantitative Aptitude",
    subject: "Algebra",
    title: "Solving Quadratic Equations via Formula",
    readTime: "11 mins read",
    content: "A quadratic equation is in the form ax^2 + bx + c = 0. We can solve it using the quadratic formula: x = (-b ± √(b^2 - 4ac)) / 2a. The term b^2 - 4ac is called the discriminant, determining the number and type of roots (real or complex).",
  }
];


