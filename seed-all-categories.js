const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/flarelap_foundation?schema=public";
console.log('Connecting to database:', dbUrl);
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categoryCourses = [
  {
    name: 'SSC CGL Tier 1 Mock Test 2026',
    mcqs: [
      { question: 'Who among the following wrote the book "Hind Swaraj"?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Subhas Chandra Bose', 'Bal Gangadhar Tilak'], answer: 0, hint: 'Hind Swaraj or Indian Home Rule is a book written by Mohandas K. Gandhi in 1909.' },
      { question: 'Which article of the Indian Constitution is related to the Equality before law?', options: ['Article 14', 'Article 15', 'Article 16', 'Article 17'], answer: 0, hint: 'Article 14 of the Constitution of India provides for equality before law or the equal protection of the laws.' },
      { question: 'The value of cos 0° + sin 90° is:', options: ['0', '1', '2', '0.5'], answer: 2, hint: 'cos 0° = 1 and sin 90° = 1. Therefore, 1 + 1 = 2.' },
      { question: 'Which is the largest gland in the human body?', options: ['Thyroid', 'Liver', 'Pancreas', 'Pituitary'], answer: 1, hint: 'The liver is the largest gland in the human body.' },
      { question: 'In which year did the Battle of Plassey take place?', options: ['1757', '1764', '1789', '1857'], answer: 0, hint: 'The Battle of Plassey was fought on June 23, 1757.' }
    ]
  },
  {
    name: 'GATE CS & IT Mock Exam',
    mcqs: [
      { question: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, hint: 'A balanced BST has a height of O(log n), so searching takes O(log n) time.' },
      { question: 'Which layer in the OSI model is responsible for routing packets?', options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'], answer: 2, hint: 'The Network Layer is responsible for routing packets across network boundaries.' },
      { question: 'Which of the following is not a transaction property in DBMS?', options: ['Atomicity', 'Consistency', 'Isolation', 'Concurrency'], answer: 3, hint: 'The ACID properties are Atomicity, Consistency, Isolation, and Durability.' },
      { question: 'What is the binary equivalent of decimal number 25?', options: ['11001', '11010', '10101', '11100'], answer: 0, hint: '25 in binary is 16 + 8 + 1, which corresponds to 11001.' },
      { question: 'Which scheduling algorithm can result in starvation?', options: ['First Come First Served', 'Round Robin', 'Shortest Job First', 'None of these'], answer: 2, hint: 'Shortest Job First can starve longer jobs if short jobs keep arriving.' }
    ]
  },
  {
    name: 'SEBI Grade A Officer Practice Mock',
    mcqs: [
      { question: 'Who is the current regulator of the securities market in India?', options: ['RBI', 'SEBI', 'IRDAI', 'PFRDA'], answer: 1, hint: 'SEBI (Securities and Exchange Board of India) regulates the securities market in India.' },
      { question: 'What does "IPO" stand for in financial markets?', options: ['Initial Public Offering', 'Internal Profit Option', 'International Payment Order', 'None of these'], answer: 0, hint: 'IPO stands for Initial Public Offering, which is when a company first sells shares to the public.' },
      { question: 'What is the primary function of a commercial bank?', options: ['Issuing currency', 'Accepting deposits and lending money', 'Regulating stock exchange', 'Formulating monetary policy'], answer: 1, hint: 'Commercial banks accept deposits from the public and use them to extend loans.' },
      { question: 'Inflation in India is primarily measured by which index?', options: ['WPI', 'CPI', 'GDP Deflator', 'IIB'], answer: 1, hint: 'The Consumer Price Index (CPI) is the primary measure of inflation in India.' },
      { question: 'What is the full form of GDP?', options: ['Gross Domestic Product', 'Gross Demand Profit', 'General Deposit Policy', 'Gross Development Plan'], answer: 0, hint: 'GDP stands for Gross Domestic Product.' }
    ]
  },
  {
    name: 'CTET Paper 1 Child Pedagogy',
    mcqs: [
      { question: 'Who formulated the Theory of Multiple Intelligences?', options: ['Jean Piaget', 'Howard Gardner', 'Lev Vygotsky', 'B.F. Skinner'], answer: 1, hint: 'Howard Gardner proposed the Theory of Multiple Intelligences in 1983.' },
      { question: 'According to Piaget, the stage of cognitive development for age 2-7 is:', options: ['Sensori-motor', 'Pre-operational', 'Concrete operational', 'Formal operational'], answer: 1, hint: 'The Pre-operational stage lasts from age 2 to approximately 7.' },
      { question: 'What is the primary factor in Lev Vygotsky\'s theory of learning?', options: ['Social interaction', 'Reinforcement', 'Equilibrium', 'Adaptation'], answer: 0, hint: 'Vygotsky\'s sociocultural theory emphasizes social interaction in cognitive development.' },
      { question: 'Dyslexia is primarily associated with difficulty in:', options: ['Writing', 'Reading', 'Speaking', 'Calculating'], answer: 1, hint: 'Dyslexia is a learning disability characterized by difficulty in reading.' },
      { question: 'Inclusive Education refers to:', options: ['Providing education to disabled children only', 'Including all children regardless of background in the same school', 'Special classrooms for intelligent students', 'None of these'], answer: 1, hint: 'Inclusive education means all students, regardless of challenges, are placed in age-appropriate general education classes.' }
    ]
  },
  {
    name: 'ITI Fitter Theory Semester 1 & 2',
    mcqs: [
      { question: 'Which instrument is used to check the flatness of a surface?', options: ['Vernier Caliper', 'Micrometer', 'Try Square', 'Divider'], answer: 2, hint: 'A Try Square is used to check the squareness and flatness of surfaces.' },
      { question: 'What is the unit of pitch of a thread?', options: ['mm', 'cm', 'inches', 'degrees'], answer: 0, hint: 'Pitch is measured in mm in metric threads.' },
      { question: 'Which file is used for filing wood?', options: ['Bastard file', 'Rasps cut file', 'Smooth file', 'Dead smooth file'], answer: 1, hint: 'A rasps cut file is designed for woodworking and filing soft materials.' },
      { question: 'What is the least count of a standard Vernier Caliper?', options: ['0.02 mm', '0.01 mm', '0.05 mm', '0.1 mm'], answer: 0, hint: 'Standard metric Vernier Calipers have a least count of 0.02 mm.' },
      { question: 'Which metal is used to make hammer heads?', options: ['High Carbon Steel', 'Cast Iron', 'Copper', 'Aluminium'], answer: 0, hint: 'Hammer heads are typically made of forged high carbon steel.' }
    ]
  },
  {
    name: 'ITI Electrician Basic Theory 2026',
    mcqs: [
      { question: 'What is the unit of electrical resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], answer: 2, hint: 'Ohm is the SI unit of electrical resistance.' },
      { question: 'According to Ohm\'s Law, current (I) is equal to:', options: ['V * R', 'V / R', 'R / V', 'V + R'], answer: 1, hint: 'I = V / R, where V is voltage and R is resistance.' },
      { question: 'Which instrument is used to measure electric current?', options: ['Voltmeter', 'Ammeter', 'Galvanometer', 'Multimeter'], answer: 1, hint: 'An ammeter is used to measure electric current.' },
      { question: 'Which of the following is an insulator?', options: ['Copper', 'Aluminium', 'Rubber', 'Iron'], answer: 2, hint: 'Rubber is an insulator, meaning it does not conduct electricity.' },
      { question: 'What is the standard household AC frequency in India?', options: ['50 Hz', '60 Hz', '100 Hz', '120 Hz'], answer: 0, hint: 'India uses a standard grid frequency of 50 Hz.' }
    ]
  },
  {
    name: 'RRB JE Civil Technical CBT',
    mcqs: [
      { question: 'What is the standard size of a modular brick?', options: ['19cm x 9cm x 9cm', '20cm x 10cm x 10cm', '22.8cm x 11.2cm x 7cm', '19cm x 19cm x 9cm'], answer: 0, hint: 'The standard size of a modular brick is 19cm x 9cm x 9cm.' },
      { question: 'Which cement test is used to check its soundness?', options: ['Le-Chatelier test', 'Vicat needle test', 'Slump test', 'Fineness test'], answer: 0, hint: 'The Le-Chatelier test is used to detect soundness due to free lime.' },
      { question: 'What is the pH value of drinking water?', options: ['Between 6.5 and 8.5', 'Exactly 7', 'Less than 6', 'More than 9'], answer: 0, hint: 'Drinking water pH should ideally be in the range of 6.5 to 8.5.' },
      { question: 'The ratio of lateral strain to linear strain is called:', options: ['Young\'s Modulus', 'Bulk Modulus', 'Poisson\'s Ratio', 'Rigidity Modulus'], answer: 2, hint: 'Poisson\'s Ratio is the ratio of lateral strain to longitudinal/linear strain.' },
      { question: 'Which instrument is used to measure high temperature in kilns?', options: ['Thermometer', 'Pyrometer', 'Barometer', 'Anemometer'], answer: 1, hint: 'A pyrometer measures very high temperatures by sensing radiation.' }
    ]
  },
  {
    name: 'State Judiciary Mains Mock Law Paper',
    mcqs: [
      { question: 'Under which article of the Indian Constitution is the Supreme Court established?', options: ['Article 124', 'Article 129', 'Article 226', 'Article 131'], answer: 0, hint: 'Article 124 establishes the Supreme Court of India.' },
      { question: 'Which section of the Indian Penal Code defines "Murder"?', options: ['Section 299', 'Section 300', 'Section 302', 'Section 307'], answer: 1, hint: 'Section 300 defines Murder, while Section 302 provides the punishment.' },
      { question: 'The Indian Contract Act was enacted in the year:', options: ['1872', '1882', '1908', '1950'], answer: 0, hint: 'The Indian Contract Act was enacted in 1872.' },
      { question: 'Who administers the oath to the President of India?', options: ['Prime Minister', 'Chief Justice of India', 'Vice President', 'Speaker of Lok Sabha'], answer: 1, hint: 'The Chief Justice of India administers the oath of office to the President.' },
      { question: 'What is the maximum number of members in the Lok Sabha?', options: ['545', '550', '552', '560'], answer: 2, hint: 'The maximum strength of the Lok Sabha is 552.' }
    ]
  },
  {
    name: 'Paramedical Nursing Theory Exam',
    mcqs: [
      { question: 'Which of the following is the normal body temperature in Celsius?', options: ['35°C', '37°C', '38°C', '36.5°C'], answer: 1, hint: 'Normal human body temperature is around 37°C (98.6°F).' },
      { question: 'What is the primary function of white blood cells (WBC)?', options: ['Carrying oxygen', 'Fighting infections', 'Clotting blood', 'Regulating temperature'], answer: 1, hint: 'WBCs are an essential part of the immune system and fight infections.' },
      { question: 'Which vitamin is essential for blood clotting?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], answer: 3, hint: 'Vitamin K is required for the synthesis of proteins involved in blood clotting.' },
      { question: 'Which organ is primarily responsible for filtering blood?', options: ['Heart', 'Lungs', 'Kidneys', 'Liver'], answer: 2, hint: 'Kidneys filter wastes and excess fluids from the blood.' },
      { question: 'What is the average human heart rate per minute?', options: ['60-100 bpm', '50-60 bpm', '100-120 bpm', '72-80 bpm'], answer: 0, hint: 'Normal resting heart rate for adults ranges from 60 to 100 beats per minute.' }
    ]
  },
  {
    name: 'Electronic Mechanic Semester 1 Prep',
    mcqs: [
      { question: 'Which semiconductor material is most commonly used in electronic chips?', options: ['Silicon', 'Germanium', 'Copper', 'Carbon'], answer: 0, hint: 'Silicon is the most popular semiconductor due to abundance and performance.' },
      { question: 'What is the main function of a diode?', options: ['Amplifying signals', 'Allowing current in one direction only', 'Storing charge', 'Regulating frequency'], answer: 1, hint: 'A diode acts as a one-way valve for electric current.' },
      { question: 'What is the colour code for a 1k Ohm resistor with 5% tolerance?', options: ['Brown, Black, Red, Gold', 'Brown, Black, Orange, Silver', 'Red, Red, Red, Gold', 'Brown, Green, Red, Gold'], answer: 0, hint: '1k = 1, 0, 10^2. Brown(1), Black(0), Red(multiplier 100), Gold(5%).' },
      { question: 'Which component stores electrical energy in an electric field?', options: ['Resistor', 'Inductor', 'Capacitor', 'Transistor'], answer: 2, hint: 'A capacitor stores energy in its electric field.' },
      { question: 'What does "IC" stand for in electronics?', options: ['Internal Conductor', 'Integrated Circuit', 'Internet Connection', 'Integrated Cable'], answer: 1, hint: 'IC stands for Integrated Circuit.' }
    ]
  },
  {
    name: 'RRB NTPC CBT 1 Full Mock Test',
    mcqs: [
      { question: 'Where is the headquarters of the Indian Railways located?', options: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'], answer: 0, hint: 'The headquarters of Indian Railways is in New Delhi.' },
      { question: 'Which state has the longest railway route in India?', options: ['Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Maharashtra'], answer: 0, hint: 'Uttar Pradesh has the largest route kilometer coverage in India.' },
      { question: 'The first train in India ran between Mumbai and:', options: ['Pune', 'Thane', 'Surat', 'Dadri'], answer: 1, hint: 'The first passenger train ran between Bori Bunder (Mumbai) and Thane on April 16, 1853.' },
      { question: 'Who was the first Railway Minister of independent India?', options: ['John Mathai', 'Lal Bahadur Shastri', 'Jawaharlal Nehru', 'Jagjivan Ram'], answer: 0, hint: 'John Mathai was the first Railway Minister of independent India.' },
      { question: 'What is the width of a broad gauge railway track in India?', options: ['1.0 m', '1.676 m', '0.762 m', '1.435 m'], answer: 1, hint: 'Broad gauge in India is 5 feet 6 inches (1.676 m).' }
    ]
  },
  {
    name: 'SBI PO Prelims Full Mock Test',
    mcqs: [
      { question: 'Which bank is the largest public sector bank in India?', options: ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Punjab National Bank'], answer: 2, hint: 'State Bank of India is the largest public sector commercial bank in India.' },
      { question: 'What is the full form of RTGS?', options: ['Real Time Gross Settlement', 'Regular Transfer Gross Security', 'Real Time General Security', 'None of these'], answer: 0, hint: 'RTGS stands for Real Time Gross Settlement.' },
      { question: 'Who acts as the lender of last resort in India?', options: ['Central Government', 'State Bank of India', 'Reserve Bank of India', 'NABARD'], answer: 2, hint: 'The Reserve Bank of India acts as the lender of last resort for commercial banks.' },
      { question: 'What is the minimum age required to open a bank account independently?', options: ['10 years', '15 years', '18 years', '21 years'], answer: 0, hint: 'Under RBI guidelines, minors above 10 years can open and operate accounts independently.' },
      { question: 'The term "Bull" and "Bear" are associated with:', options: ['Agriculture', 'Stock Market', 'Elections', 'Forestry'], answer: 1, hint: 'Bull and Bear describe upward and downward stock market trends respectively.' }
    ]
  },
  {
    name: 'NEET Physics Practice Prep',
    mcqs: [
      { question: 'What is the dimensional formula for gravitational constant (G)?', options: ['[M^-1 L^3 T^-2]', '[M L^3 T^-2]', '[M^-2 L^3 T^-1]', '[M^-1 L^2 T^-2]'], answer: 0, hint: 'G = F*r^2/m^2. Dimensions: [M L T^-2] * [L^2] / [M^2] = [M^-1 L^3 T^-2].' },
      { question: 'A body is projected vertically upwards with a velocity of 20 m/s. Maximum height reached is (g = 10 m/s^2):', options: ['10 m', '20 m', '15 m', '40 m'], answer: 1, hint: 'H = u^2 / 2g = 400 / 20 = 20 m.' },
      { question: 'What is the SI unit of magnetic flux?', options: ['Tesla', 'Weber', 'Gauss', 'Henry'], answer: 1, hint: 'Weber is the SI unit of magnetic flux.' },
      { question: 'Which electromagnetic wave has the shortest wavelength?', options: ['X-Rays', 'Gamma-Rays', 'UV-Rays', 'Radio Waves'], answer: 1, hint: 'Gamma-rays have the highest frequency and shortest wavelength in the EM spectrum.' },
      { question: 'A convex lens has a focal length of 20 cm. Its power is:', options: ['+5 D', '-5 D', '+2 D', '-2 D'], answer: 0, hint: 'Power P = 100 / f (in cm) = 100 / 20 = +5 D.' }
    ]
  },
  {
    name: 'NDA General Ability Mock Test',
    mcqs: [
      { question: 'Where is the National Defence Academy (NDA) located?', options: ['Dehradun', 'Khadakwasla', 'Chennai', 'Gwalior'], answer: 1, hint: 'NDA is located in Khadakwasla near Pune, Maharashtra.' },
      { question: 'Who is the supreme commander of the Indian Armed Forces?', options: ['Prime Minister', 'President of India', 'Chief of Defence Staff', 'Defence Minister'], answer: 1, hint: 'The President of India is the supreme commander of the Indian Armed Forces.' },
      { question: 'Which is the oldest paramilitary force in India?', options: ['BSF', 'CRPF', 'Assam Rifles', 'ITBP'], answer: 2, hint: 'Assam Rifles, established in 1835 as Cachar Levy, is the oldest.' },
      { question: 'The head of the Indian Army is called:', options: ['Chief of Army Staff', 'General of Army', 'Field Marshal', 'Chief of Defence Staff'], answer: 0, hint: 'The head of the Indian Army is the Chief of Army Staff (COAS).' },
      { question: 'In which year was the Kargil War fought?', options: ['1971', '1962', '1999', '1965'], answer: 2, hint: 'The Kargil War was fought between May and July 1999.' }
    ]
  },
  {
    name: 'UPSC Prelims GS Paper 1 Mock',
    mcqs: [
      { question: 'Which Indian leader was affectionately called "Loknayak"?', options: ['Jayaprakash Narayan', 'Bal Gangadhar Tilak', 'Lala Lajpat Rai', 'Subhas Chandra Bose'], answer: 0, hint: 'Jayaprakash Narayan is popularly known as Loknayak (People\'s Leader).' },
      { question: 'The concept of "Directive Principles of State Policy" was borrowed from which country?', options: ['USA', 'UK', 'Ireland', 'Australia'], answer: 2, hint: 'DPSPs are borrowed from the Irish Constitution.' },
      { question: 'Where is the Bandipur National Park located?', options: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Madhya Pradesh'], answer: 0, hint: 'Bandipur National Park is established in Karnataka.' },
      { question: 'Who was the first governor-general of independent India?', options: ['C. Rajagopalachari', 'Lord Mountbatten', 'Dr. Rajendra Prasad', 'Jawaharlal Nehru'], answer: 1, hint: 'Lord Mountbatten served as the first Governor-General of independent India.' },
      { question: 'Which river is known as the "Sorrow of Bengal"?', options: ['Kosi', 'Damodar', 'Ganga', 'Hooghly'], answer: 1, hint: 'Damodar River was historically known as Sorrow of Bengal due to devastating floods.' }
    ]
  },
  {
    name: 'UP Police Constable Practice Sets',
    mcqs: [
      { question: 'Which city is the administrative headquarters of Uttar Pradesh police?', options: ['Lucknow', 'Prayagraj', 'Kanpur', 'Noida'], answer: 0, hint: 'The Police Headquarters of UP is located in Lucknow.' },
      { question: 'What is the emergency helpline number for police in India?', options: ['100 or 112', '101', '102', '1091'], answer: 0, hint: '112 is the single emergency response number, which integrated 100 (police).' },
      { question: 'Which district is the largest in Uttar Pradesh by area?', options: ['Lakhimpur Kheri', 'Sonbhadra', 'Hardoi', 'Prayagraj'], answer: 0, hint: 'Lakhimpur Kheri is the largest district by area in Uttar Pradesh.' },
      { question: 'The classical dance form of Uttar Pradesh is:', options: ['Kathak', 'Kathakali', 'Bharatnatyam', 'Kuchipudi'], answer: 0, hint: 'Kathak originated in northern India, primarily Uttar Pradesh.' },
      { question: 'Who was the first Chief Minister of Uttar Pradesh?', options: ['Govind Ballabh Pant', 'Sucheta Kripalani', 'Chaudhary Charan Singh', 'Mayawati'], answer: 0, hint: 'Govind Ballabh Pant was the first Chief Minister of UP.' }
    ]
  },
  {
    name: 'UP B.Ed Joint Entrance Exam Mock',
    mcqs: [
      { question: 'What is the full form of B.Ed?', options: ['Bachelor of Education', 'Board of Education', 'Basic Education degree', 'None of these'], answer: 0, hint: 'B.Ed stands for Bachelor of Education.' },
      { question: 'Which council is the regulatory body for teacher education in India?', options: ['UGC', 'NCERT', 'NCTE', 'CBSE'], answer: 2, hint: 'National Council for Teacher Education (NCTE) regulates teacher education.' },
      { question: 'According to the Right to Education (RTE) Act, education is a fundamental right for children of age:', options: ['6 to 14 years', '5 to 12 years', '6 to 18 years', '3 to 18 years'], answer: 0, hint: 'RTE Act 2009 provides free and compulsory education to all children aged 6 to 14 years.' },
      { question: 'Who is known as the father of modern psychology?', options: ['Wilhelm Wundt', 'Sigmund Freud', 'William James', 'John B. Watson'], answer: 0, hint: 'Wilhelm Wundt established the first laboratory for experimental psychology, earning him this title.' },
      { question: 'The primary aim of teaching is:', options: ['To give information', 'To promote cognitive development & learning', 'To maintain discipline', 'To prepare for exams'], answer: 1, hint: 'The main goal of teaching is to facilitate learning and cognitive development.' }
    ]
  }
];

const getRealExamStats = (courseName) => {
  const name = courseName.toLowerCase();
  if (name.includes("ssc cgl") || name.includes("cgl")) {
    return { questions: 100, marks: 200, duration: 60 };
  }
  if (name.includes("gate")) {
    return { questions: 65, marks: 100, duration: 180 };
  }
  if (name.includes("sebi")) {
    return { questions: 100, marks: 100, duration: 60 };
  }
  if (name.includes("ctet")) {
    return { questions: 150, marks: 150, duration: 150 };
  }
  if (name.includes("fitter")) {
    return { questions: 50, marks: 100, duration: 120 };
  }
  if (name.includes("electrician")) {
    return { questions: 50, marks: 100, duration: 120 };
  }
  if (name.includes("rrb je") || name.includes("je ")) {
    return { questions: 100, marks: 100, duration: 90 };
  }
  if (name.includes("judiciary")) {
    return { questions: 100, marks: 100, duration: 180 };
  }
  if (name.includes("paramedical")) {
    return { questions: 100, marks: 100, duration: 90 };
  }
  if (name.includes("electronic mechanic")) {
    return { questions: 50, marks: 100, duration: 120 };
  }
  if (name.includes("rrb ntpc") || name.includes("ntpc")) {
    return { questions: 100, marks: 100, duration: 90 };
  }
  if (name.includes("sbi po")) {
    return { questions: 100, marks: 100, duration: 60 };
  }
  if (name.includes("neet")) {
    return { questions: 45, marks: 180, duration: 50 };
  }
  if (name.includes("nda")) {
    return { questions: 150, marks: 600, duration: 150 };
  }
  if (name.includes("upsc")) {
    return { questions: 100, marks: 200, duration: 120 };
  }
  if (name.includes("police") || name.includes("constable")) {
    return { questions: 150, marks: 300, duration: 120 };
  }
  if (name.includes("b.ed")) {
    return { questions: 100, marks: 200, duration: 180 };
  }
  return { questions: 100, marks: 100, duration: 90 };
};

const getCourseSubjects = (courseName) => {
  const name = courseName.toLowerCase();
  if (name.includes("ssc cgl") || name.includes("cgl")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 25, marks: 50, duration: 20 },
      { name: "General Awareness", qs: 25, marks: 50, duration: 10 },
      { name: "Quantitative Aptitude", qs: 25, marks: 50, duration: 20 },
      { name: "English Comprehension", qs: 25, marks: 50, duration: 10 }
    ];
  }
  if (name.includes("gate")) {
    return [
      { name: "General Aptitude", qs: 10, marks: 15, duration: 30 },
      { name: "Engineering Mathematics", qs: 10, marks: 15, duration: 30 },
      { name: "Discrete Mathematics & Databases", qs: 15, marks: 20, duration: 40 },
      { name: "Computer Architecture & OS", qs: 15, marks: 25, duration: 40 },
      { name: "Algorithms & Data Structures", qs: 15, marks: 25, duration: 40 }
    ];
  }
  if (name.includes("sebi")) {
    return [
      { name: "General Awareness & Financial Sector", qs: 25, marks: 25, duration: 15 },
      { name: "English Language", qs: 25, marks: 25, duration: 15 },
      { name: "Quantitative Aptitude", qs: 25, marks: 25, duration: 15 },
      { name: "Test of Reasoning", qs: 25, marks: 25, duration: 15 }
    ];
  }
  if (name.includes("ctet")) {
    return [
      { name: "Child Development and Pedagogy", qs: 30, marks: 30, duration: 30 },
      { name: "Language I (English/Hindi)", qs: 30, marks: 30, duration: 30 },
      { name: "Language II (English/Hindi/Sanskrit)", qs: 30, marks: 30, duration: 30 },
      { name: "Mathematics", qs: 30, marks: 30, duration: 30 },
      { name: "Environmental Studies", qs: 30, marks: 30, duration: 30 }
    ];
  }
  if (name.includes("fitter")) {
    return [
      { name: "Trade Theory (Fitter Shop & Safety)", qs: 20, marks: 40, duration: 45 },
      { name: "Workshop Calculation & Science", qs: 15, marks: 30, duration: 35 },
      { name: "Engineering Drawing", qs: 15, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("electrician")) {
    return [
      { name: "Trade Theory (Electrical Circuits & Machines)", qs: 20, marks: 40, duration: 45 },
      { name: "Workshop Calculation & Science", qs: 15, marks: 30, duration: 35 },
      { name: "Engineering Drawing", qs: 15, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("rrb je") || name.includes("je ")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 15, marks: 15, duration: 15 },
      { name: "General Awareness", qs: 15, marks: 15, duration: 10 },
      { name: "General Science", qs: 15, marks: 15, duration: 15 },
      { name: "Civil & Allied Engineering", qs: 55, marks: 55, duration: 50 }
    ];
  }
  if (name.includes("judiciary")) {
    return [
      { name: "Constitutional Law", qs: 25, marks: 25, duration: 45 },
      { name: "Civil Procedure Code & Law of Evidence", qs: 25, marks: 25, duration: 45 },
      { name: "Indian Penal Code & Criminal Procedure", qs: 25, marks: 25, duration: 45 },
      { name: "Contract & Property Law", qs: 25, marks: 25, duration: 45 }
    ];
  }
  if (name.includes("paramedical")) {
    return [
      { name: "Anatomy & Physiology", qs: 25, marks: 25, duration: 20 },
      { name: "Fundamentals of Nursing", qs: 25, marks: 25, duration: 20 },
      { name: "Community Health Nursing", qs: 25, marks: 25, duration: 25 },
      { name: "Medical Surgical Nursing", qs: 25, marks: 25, duration: 25 }
    ];
  }
  if (name.includes("electronic mechanic")) {
    return [
      { name: "Electronic Theory & Components", qs: 20, marks: 40, duration: 45 },
      { name: "Workshop Calculation & Science", qs: 15, marks: 30, duration: 35 },
      { name: "Engineering Drawing", qs: 15, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("rrb ntpc") || name.includes("ntpc")) {
    return [
      { name: "General Awareness", qs: 40, marks: 40, duration: 35 },
      { name: "Mathematics", qs: 30, marks: 30, duration: 30 },
      { name: "General Intelligence & Reasoning", qs: 30, marks: 30, duration: 25 }
    ];
  }
  if (name.includes("sbi po")) {
    return [
      { name: "English Language", qs: 30, marks: 30, duration: 20 },
      { name: "Quantitative Aptitude", qs: 35, marks: 35, duration: 20 },
      { name: "Reasoning Ability", qs: 35, marks: 35, duration: 20 }
    ];
  }
  if (name.includes("neet")) {
    return [
      { name: "Mechanics & General Physics", qs: 15, marks: 60, duration: 15 },
      { name: "Electrodynamics & Magnetism", qs: 15, marks: 60, duration: 15 },
      { name: "Optics & Modern Physics", qs: 15, marks: 60, duration: 20 }
    ];
  }
  if (name.includes("nda")) {
    return [
      { name: "English Vocabulary & Grammar", qs: 50, marks: 200, duration: 50 },
      { name: "Physics & Chemistry", qs: 40, marks: 160, duration: 40 },
      { name: "General Science & History", qs: 30, marks: 120, duration: 30 },
      { name: "Geography & Current Affairs", qs: 30, marks: 120, duration: 30 }
    ];
  }
  if (name.includes("upsc")) {
    return [
      { name: "History of India & Indian National Movement", qs: 20, marks: 40, duration: 25 },
      { name: "Indian and World Geography", qs: 20, marks: 40, duration: 25 },
      { name: "Indian Polity and Governance", qs: 20, marks: 40, duration: 25 },
      { name: "Economic and Social Development", qs: 20, marks: 40, duration: 25 },
      { name: "General Science & Ecology", qs: 20, marks: 40, duration: 20 }
    ];
  }
  if (name.includes("police") || name.includes("constable")) {
    return [
      { name: "General Knowledge", qs: 38, marks: 76, duration: 30 },
      { name: "General Hindi", qs: 37, marks: 74, duration: 30 },
      { name: "Numerical & Mental Ability", qs: 38, marks: 76, duration: 30 },
      { name: "Mental Aptitude & Reasoning", qs: 37, marks: 74, duration: 30 }
    ];
  }
  if (name.includes("b.ed")) {
    return [
      { name: "General Knowledge", qs: 25, marks: 50, duration: 45 },
      { name: "Language (Hindi or English)", qs: 25, marks: 50, duration: 45 },
      { name: "General Mental Ability", qs: 25, marks: 50, duration: 45 },
      { name: "Subject Specialisation (Arts/Science/Commerce)", qs: 25, marks: 50, duration: 45 }
    ];
  }
  return [
    { name: "General Awareness", qs: 25, marks: 25, duration: 20 },
    { name: "Quantitative Aptitude", qs: 25, marks: 25, duration: 25 },
    { name: "Reasoning Ability", qs: 25, marks: 25, duration: 25 },
    { name: "Language & Comprehension", qs: 25, marks: 25, duration: 20 }
  ];
};

const generateSubTestsList = (courseName, isPremium) => {
  const stats = getRealExamStats(courseName);
  const tests = [];

  // 1-6: Full Length Mock Tests
  for (let i = 1; i <= 6; i++) {
    tests.push({
      name: `Full Length Mock Test ${i}`,
      type: "Full Mock",
      qs: stats.questions,
      marks: stats.marks,
      duration: stats.duration,
      isFree: false
    });
  }

  // 7-8: Sectional Mock Tests
  tests.push({
    name: "Sectional Mock Test 1: General Core Skills",
    type: "Subject Test",
    qs: Math.max(10, Math.round(stats.questions * 0.5)),
    marks: Math.max(20, Math.round(stats.marks * 0.5)),
    duration: Math.max(15, Math.round(stats.duration * 0.5)),
    isFree: false
  });
  tests.push({
    name: "Sectional Mock Test 2: Advanced Topics & Analysis",
    type: "Subject Test",
    qs: Math.max(10, Math.round(stats.questions * 0.5)),
    marks: Math.max(20, Math.round(stats.marks * 0.5)),
    duration: Math.max(15, Math.round(stats.duration * 0.5)),
    isFree: false
  });

  // 9-10: Previous Year Papers
  tests.push({
    name: "Previous Year Paper (2024 Exam)",
    type: "PYP",
    qs: stats.questions,
    marks: stats.marks,
    duration: stats.duration,
    isFree: false
  });
  tests.push({
    name: "Previous Year Paper (2025 Exam)",
    type: "PYP",
    qs: stats.questions,
    marks: stats.marks,
    duration: stats.duration,
    isFree: false
  });

  tests.forEach((test, idx) => {
    if (!isPremium) {
      test.isFree = true;
    } else {
      test.isFree = (idx < 3);
    }
  });

  return tests;
};

async function seed() {
  console.log('Clearing old purchases...');
  await prisma.purchase.deleteMany({});

  console.log('Clearing old test series...');
  await prisma.testSeries.deleteMany({});

  console.log('Clearing old MCQ questions...');
  await prisma.mCQQuestion.deleteMany({});

  console.log('Unlinking users from courses...');
  await prisma.user.updateMany({
    data: { courseId: null }
  });

  console.log('Clearing old courses...');
  await prisma.course.deleteMany({});

  console.log('Resetting identity sequences...');
  try {
    await prisma.$executeRawUnsafe('ALTER SEQUENCE courses_id_seq RESTART WITH 1;');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE mcq_questions_id_seq RESTART WITH 1;');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE test_series_id_seq RESTART WITH 1;');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE purchases_id_seq RESTART WITH 1;');
    console.log('Identity sequences reset successfully.');
  } catch (seqError) {
    console.error('Warning: Failed to reset sequences.', seqError);
  }

  console.log('Seeding courses, MCQs, and Test Series for all categories...');
  for (const catCourse of categoryCourses) {
    const isPremium = 
      catCourse.name.includes("SSC CGL") || 
      catCourse.name.includes("GATE") || 
      catCourse.name.includes("SEBI") || 
      catCourse.name.includes("Judiciary") || 
      catCourse.name.includes("UPSC");

    const course = await prisma.course.create({
      data: { 
        name: catCourse.name, 
        active: true,
        premium: isPremium
      }
    });
    console.log(`Created course (ID: ${course.id}, Premium: ${isPremium}): ${course.name}`);
    
    // Seed MCQs
    for (const q of catCourse.mcqs) {
      await prisma.mCQQuestion.create({
        data: {
          courseId: course.id,
          question: q.question,
          options: q.options,
          answer: q.answer,
          hint: q.hint
        }
      });
    }
    console.log(`Seeded ${catCourse.mcqs.length} MCQs for ${course.name}`);

    // Seed mock test series dynamically
    const subTests = generateSubTestsList(course.name, course.premium);
    for (const test of subTests) {
      await prisma.testSeries.create({
        data: {
          courseId: course.id,
          name: test.name,
          type: test.type,
          qs: test.qs,
          marks: test.marks,
          duration: test.duration,
          isFree: test.isFree
        }
      });
    }
    console.log(`Seeded ${subTests.length} Test Series entries for ${course.name}`);
  }
  console.log('All done!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
