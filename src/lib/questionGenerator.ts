export interface QuestionItem {
  id: number;
  question: string;
  options: string[];
  answer: number;
  hint: string;
}

// Deterministic PRNG helper
function seededRandom(seed: number) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates a completely unique list of non-repeating questions for any test size.
 * Combines existing DB questions with generated subject-specific unique questions.
 */
export function generateUniqueQuestions(
  courseName: string = "General",
  testName: string = "Mock Test",
  requiredCount: number = 20,
  dbQuestions: (Omit<QuestionItem, "id"> & { id?: number })[] = []
): QuestionItem[] {
  const result: QuestionItem[] = [];
  const seenTexts = new Set<string>();

  // 1. First add all valid non-repeating DB questions
  dbQuestions.forEach((q) => {
    const clean = q.question.trim().toLowerCase();
    if (!seenTexts.has(clean)) {
      seenTexts.add(clean);
      result.push({
        id: result.length + 1,
        question: q.question,
        options: [...q.options],
        answer: q.answer,
        hint: q.hint || "Refer to standard study materials for detailed concept review."
      });
    }
  });

  if (result.length >= requiredCount) {
    return result.slice(0, requiredCount);
  }

  // Determine domain/category from course or test name
  const name = (courseName + " " + testName).toLowerCase();
  const isMedical = name.includes("neet") || name.includes("paramedical") || name.includes("nursing") || name.includes("biology") || name.includes("medical") || name.includes("aiims") || name.includes("ruhs") || name.includes("cpet") || name.includes("jenpas") || name.includes("health");
  const isTeaching = name.includes("ctet") || name.includes("tet") || name.includes("net") || name.includes("teacher") || name.includes("kvs") || name.includes("nvs") || name.includes("dsssb") || name.includes("b.ed") || name.includes("prt") || name.includes("tgt") || name.includes("pgt");
  const isBanking = name.includes("rbi") || name.includes("sbi") || name.includes("ibps") || name.includes("bank") || name.includes("sebi") || name.includes("nabard") || name.includes("lic") || name.includes("finance");
  const isEngineering = name.includes("jee") || name.includes("gate") || name.includes("cs") || name.includes("web") || name.includes("computer") || name.includes("math") || name.includes("tech");

  let counter = 1;
  const baseSeed = (courseName.length * 31 + testName.length * 17 + requiredCount) || 12345;

  while (result.length < requiredCount) {
    const currentIndex = result.length + 1;
    const qSeed = baseSeed + currentIndex * 137 + counter++;

    let generated: QuestionItem | null = null;

    if (isMedical) {
      generated = createMedicalQuestion(currentIndex, qSeed);
    } else if (isTeaching) {
      generated = createTeachingQuestion(currentIndex, qSeed);
    } else if (isBanking) {
      generated = createBankingQuestion(currentIndex, qSeed);
    } else if (isEngineering) {
      generated = createEngineeringQuestion(currentIndex, qSeed);
    } else {
      generated = createGeneralAptitudeQuestion(currentIndex, qSeed);
    }

    if (generated) {
      const clean = generated.question.trim().toLowerCase();
      if (!seenTexts.has(clean)) {
        seenTexts.add(clean);
        result.push(generated);
      }
    }

    // Safety fallback loop if static pool is exhausted: generate dynamic parameterized questions
    if (counter > requiredCount * 20) {
      const dynQ = createDynamicMathReasoningQuestion(currentIndex, qSeed + counter);
      const clean = dynQ.question.trim().toLowerCase();
      if (!seenTexts.has(clean)) {
        seenTexts.add(clean);
        result.push(dynQ);
      }
    }
  }

  return result.slice(0, requiredCount);
}

// 1. Medical & Paramedical Question Generator
function createMedicalQuestion(id: number, seed: number): QuestionItem {
  const topics = [
    {
      q: "Which human organ system is responsible for filtering metabolic waste products from the blood?",
      opts: ["Excretory / Renal System", "Circulatory System", "Digestive System", "Lymphatic System"],
      ans: 0,
      hint: "The kidneys are the primary organs of this system."
    },
    {
      q: "What is the primary functional unit of the human kidney?",
      opts: ["Nephron", "Neuron", "Alveolus", "Glomerulus"],
      ans: 0,
      hint: "Each human kidney contains approximately 1 million nephrons."
    },
    {
      q: "Which blood vessel carries oxygenated blood from the lungs back to the left atrium of the heart?",
      opts: ["Pulmonary Vein", "Pulmonary Artery", "Superior Vena Cava", "Aorta"],
      ans: 0,
      hint: "Unlike standard veins, pulmonary veins transport oxygenated blood."
    },
    {
      q: "Which cellular organelle contains its own circular DNA and multiplies independently?",
      opts: ["Mitochondria", "Golgi Apparatus", "Endoplasmic Reticulum", "Ribosome"],
      ans: 0,
      hint: "Known as the powerhouse of the cell, supporting the endosymbiotic theory."
    },
    {
      q: "During normal human respiration, gas exchange between blood capillaries and air occurs in the:",
      opts: ["Alveoli", "Bronchi", "Trachea", "Larynx"],
      ans: 0,
      hint: "Alveoli provide a large surface area for O2 and CO2 diffusion."
    },
    {
      q: "Which enzyme present in human saliva breaks down complex starches into maltose?",
      opts: ["Salivary Amylase (Ptyalin)", "Pepsin", "Lipase", "Trypsin"],
      ans: 0,
      hint: "Carbohydrate digestion initiates in the oral cavity via amylase."
    },
    {
      q: "Which hormone secreted by the adrenal cortex regulates sodium and potassium fluid balance?",
      opts: ["Aldosterone", "Cortisol", "Thyroxine", "Insulin"],
      ans: 0,
      hint: "Aldosterone promotes Na+ reabsorption in the renal tubules."
    },
    {
      q: "What is the total normal adult human blood volume on average?",
      opts: ["5.0 Liters", "2.5 Liters", "8.5 Liters", "10.0 Liters"],
      ans: 0,
      hint: "Normal human blood volume accounts for about 7-8% of total body weight."
    },
    {
      q: "Which structure connects muscle tissue directly to bone in human anatomy?",
      opts: ["Tendon", "Ligament", "Cartilage", "Fascia"],
      ans: 0,
      hint: "Tendons attach muscle to bone, while ligaments attach bone to bone."
    },
    {
      q: "Which part of the human brain controls involuntary vital functions like heartbeat and respiration?",
      opts: ["Medulla Oblongata", "Cerebellum", "Cerebrum", "Hypothalamus"],
      ans: 0,
      hint: "The brainstem medulla oblongata houses cardiovascular and respiratory centers."
    },
    {
      q: "In plant physiological transport, phloem is responsible for transporting:",
      opts: ["Organic Solutes & Sucrose", "Water and Mineral Ions", "Atmospheric Nitrogen", "Oxygen Gas"],
      ans: 0,
      hint: "Phloem conducts synthesized food from leaves to non-photosynthetic organs."
    },
    {
      q: "What is the SI unit of electric potential difference?",
      opts: ["Volt (V)", "Ampere (A)", "Ohm (Ω)", "Watt (W)"],
      ans: 0,
      hint: "1 Volt is defined as 1 Joule of energy per Coulomb of electric charge."
    },
    {
      q: "Which plant hormone promotes cell elongation and apical dominance?",
      opts: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic Acid"],
      ans: 0,
      hint: "Indole-3-acetic acid (IAA) is the most prominent natural auxin."
    },
    {
      q: "What type of chemical bond holds the base pairs together in a double-stranded DNA helix?",
      opts: ["Hydrogen Bond", "Covalent Bond", "Ionic Bond", "Metallic Bond"],
      ans: 0,
      hint: "Adenine pairs with Thymine via 2 hydrogen bonds; Guanine with Cytosine via 3."
    },
    {
      q: "Which immunoglobulin antibody class is predominantly found in breast milk and body secretions?",
      opts: ["IgA", "IgG", "IgM", "IgE"],
      ans: 0,
      hint: "Secretory IgA protects mucosal surfaces against mucosal pathogen entry."
    },
    {
      q: "What is the pH level of human blood under normal physiological conditions?",
      opts: ["7.35 to 7.45", "6.5 to 6.8", "7.8 to 8.2", "5.5 to 6.0"],
      ans: 0,
      hint: "Human blood is slightly alkaline, strictly maintained between 7.35 and 7.45."
    },
    {
      q: "Which vitamin deficiency is primarily responsible for causing Rickets in children?",
      opts: ["Vitamin D", "Vitamin C", "Vitamin B12", "Vitamin A"],
      ans: 0,
      hint: "Vitamin D deficiency leads to impaired bone mineralization (Rickets)."
    },
    {
      q: "Which blood group is known as the Universal Donor for Red Blood Cell transfusions?",
      opts: ["O Negative (O-)", "AB Positive (AB+)", "A Positive (A+)", "B Negative (B-)"],
      ans: 0,
      hint: "O Negative lacks A, B, and Rh antigens, avoiding transfusion reaction."
    },
    {
      q: "During photosynthesis, the Light-Independent Reactions (Calvin Cycle) occur in the:",
      opts: ["Stroma of Chloroplast", "Thylakoid Membrane", "Mitochondrial Matrix", "Cytoplasm"],
      ans: 0,
      hint: "Calvin cycle enzymatic reactions take place in the stroma fluid."
    },
    {
      q: "What is the primary site of absorption for digested food nutrients in the human alimentary canal?",
      opts: ["Small Intestine (Jejenum & Ileum)", "Stomach", "Large Intestine", "Esophagus"],
      ans: 0,
      hint: "Villi and microvilli in the small intestine maximize nutrient absorption area."
    }
  ];

  if (id <= topics.length) {
    const selected = topics[id - 1];
    return {
      id,
      question: selected.q,
      options: selected.opts,
      answer: selected.ans,
      hint: selected.hint
    };
  }

  // Dynamic parameterized medical chemistry/physics questions for extended IDs
  const atomicNum = Math.floor(seededRandom(seed + 1) * 15) + 1;
  const massNum = atomicNum * 2 + Math.floor(seededRandom(seed + 2) * 3);
  const neutrons = massNum - atomicNum;

  return {
    id,
    question: `In an atom with Atomic Number (Z) = ${atomicNum} and Mass Number (A) = ${massNum}, calculate the number of neutrons in its nucleus:`,
    options: [`${neutrons}`, `${atomicNum}`, `${massNum}`, `${atomicNum + massNum}`],
    answer: 0,
    hint: `Number of neutrons = Mass Number (A) - Atomic Number (Z) = ${massNum} - ${atomicNum} = ${neutrons}.`
  };
}

// 2. Teaching & CTET Question Generator
function createTeachingQuestion(id: number, seed: number): QuestionItem {
  const topics = [
    {
      q: "According to Jean Piaget's cognitive development theory, the stage where children develop abstract logical thinking is:",
      opts: ["Formal Operational Stage (11+ years)", "Concrete Operational Stage", "Pre-operational Stage", "Sensorimotor Stage"],
      ans: 0,
      hint: "Formal operational stage enables hypothetical-deductive reasoning."
    },
    {
      q: "Lev Vygotsky emphasized that cognitive development in children is primarily driven by:",
      opts: ["Social and Cultural Interactions", "Biological Maturation", "Trial and Error Conditioning", "Individual Assimilation"],
      ans: 0,
      hint: "Vygotsky's socio-cultural theory highlights the Zone of Proximal Development (ZPD)."
    },
    {
      q: "Formative Assessment in a modern classroom setting is primarily aimed at:",
      opts: ["Improving learning progress during instruction", "Assigning final grades at term end", "Ranking students competitively", "Standardizing annual report cards"],
      ans: 0,
      hint: "Formative assessment provides ongoing diagnostic feedback during learning."
    },
    {
      q: "Inclusive Education guarantees that children with special needs learn:",
      opts: ["Alongside non-disabled peers in regular classrooms", "In separate special schools", "Exclusively through online distance education", "Only in vocational training institutes"],
      ans: 0,
      hint: "Inclusive education provides equal learning opportunities for all students together."
    },
    {
      q: "In Bloom's Revised Taxonomy, which cognitive domain level reflects the highest order of thinking?",
      opts: ["Creating", "Evaluating", "Analyzing", "Remembering"],
      ans: 0,
      hint: "Creating involves putting elements together to form a coherent new pattern."
    },
    {
      q: "Right to Education (RTE) Act 2009 in India mandates free and compulsory education for children aged:",
      opts: ["6 to 14 years", "3 to 18 years", "5 to 12 years", "6 to 18 years"],
      ans: 0,
      hint: "Article 21-A guarantees free and compulsory education for 6-14 year olds."
    },
    {
      q: "Constructivist learning theory posits that knowledge is actively:",
      opts: ["Constructed by the learner through experience", "Absorbed passively from textbooks", "Memorized through mechanical repetition", "Transferred directly by the teacher"],
      ans: 0,
      hint: "Constructivism emphasizes active student engagement in sense-making."
    },
    {
      q: "Which psychological reinforcement schedule produces the highest resistance to extinction?",
      opts: ["Variable Ratio Schedule", "Fixed Ratio Schedule", "Fixed Interval Schedule", "Continuous Reinforcement"],
      ans: 0,
      hint: "Variable ratio (e.g. slot machines) yields consistent high response rates."
    },
    {
      q: "What is the primary role of a teacher in a student-centered classroom?",
      opts: ["Facilitator and Guide of learning experiences", "Strict Dictator of classroom rules", "Sole source of factual information", "Passive observer without intervention"],
      ans: 0,
      hint: "Teachers act as facilitators to scaffold student-centered learning."
    },
    {
      q: "Howard Gardner's Theory of Multiple Intelligences proposes that intelligence is:",
      opts: ["Composed of distinct, independent modalities", "A single measurable General IQ factor (g)", "Fixed permanently at birth", "Solely dependent on mathematical ability"],
      ans: 0,
      hint: "Gardner proposed 8 distinct types of intelligence (e.g. spatial, musical, interpersonal)."
    }
  ];

  if (id <= topics.length) {
    const selected = topics[id - 1];
    return {
      id,
      question: selected.q,
      options: selected.opts,
      answer: selected.ans,
      hint: selected.hint
    };
  }

  // Dynamic scenario question for higher IDs
  const age = Math.floor(seededRandom(seed + 1) * 6) + 6;
  return {
    id,
    question: `A teacher observes a ${age}-year-old student struggling with multi-step instructions. According to child psychology, what is the best instructional strategy?`,
    options: [
      "Break instructions into smaller, visual step-by-step cues",
      "Reprimand the student for lack of attention",
      "Ignore the student and continue the lecture",
      "Assign extra homework as penalty"
    ],
    answer: 0,
    hint: "Scaffolding complex instructions into smaller visual chunks aids cognitive processing."
  };
}

// 3. Banking & Finance Question Generator
function createBankingQuestion(id: number, seed: number): QuestionItem {
  const topics = [
    {
      q: "What is the full form of NEFT in Indian banking system operations?",
      opts: ["National Electronic Funds Transfer", "Nationwide Electronic Financial Transaction", "Net Electronic Fund Exchange", "National Exchange Financial Transfer"],
      ans: 0,
      hint: "NEFT operates nationwide 24x7 for electronic money transfer."
    },
    {
      q: "Which monetary policy tool is used by the Reserve Bank of India (RBI) to absorb excess liquidity from banks?",
      opts: ["Reverse Repo Rate", "Repo Rate", "Bank Rate", "Marginal Standing Facility"],
      ans: 0,
      hint: "Reverse Repo Rate is the rate at which RBI borrows funds from commercial banks."
    },
    {
      q: "What is the primary function of NABARD in the Indian financial sector?",
      opts: ["Financing rural & agricultural development", "Regulating stock market exchanges", "Issuing currency banknotes", "Managing corporate mergers"],
      ans: 0,
      hint: "NABARD stands for National Bank for Agriculture and Rural Development."
    },
    {
      q: "The maximum monetary compensation awarded by the RBI Banking Ombudsman for general grievances is capped at:",
      opts: ["₹20 Lakhs", "₹10 Lakhs", "₹50 Lakhs", "₹1 Crore"],
      ans: 0,
      hint: "Under the Integrated Ombudsman Scheme, maximum compensation is ₹20 Lakhs."
    },
    {
      q: "What is the minimum capital adequacy ratio (CRAR) mandated by RBI for commercial banks in India?",
      opts: ["9%", "12%", "6%", "15%"],
      ans: 0,
      hint: "RBI mandates a minimum CRAR of 9% for scheduled commercial banks."
    }
  ];

  if (id <= topics.length) {
    const selected = topics[id - 1];
    return {
      id,
      question: selected.q,
      options: selected.opts,
      answer: selected.ans,
      hint: selected.hint
    };
  }

  // Dynamic quantitative aptitude problem for extended IDs
  const speedKmh = (Math.floor(seededRandom(seed + 1) * 6) + 3) * 18; // e.g. 54, 72, 90 km/h
  const seconds = (Math.floor(seededRandom(seed + 2) * 4) + 2) * 5; // e.g. 10, 15, 20 secs
  const speedMs = speedKmh * (5 / 18);
  const trainLength = Math.round(speedMs * seconds);

  return {
    id,
    question: `A train running at a speed of ${speedKmh} km/h crosses a telegraph post in ${seconds} seconds. What is the length of the train?`,
    options: [`${trainLength} meters`, `${trainLength + 50} meters`, `${trainLength - 40} meters`, `${trainLength + 100} meters`],
    answer: 0,
    hint: `Speed = ${speedKmh} * (5/18) = ${speedMs} m/s. Length = Speed * Time = ${speedMs} * ${seconds} = ${trainLength}m.`
  };
}

// 4. Engineering & Tech Question Generator
function createEngineeringQuestion(id: number, seed: number): QuestionItem {
  const topics = [
    {
      q: "Which keyword in JavaScript declares a block-scoped variable that cannot be reassigned?",
      opts: ["const", "let", "var", "static"],
      ans: 0,
      hint: "const prevents reassignment of variable bindings."
    },
    {
      q: "What is the time complexity of QuickSort in the average case?",
      opts: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
      ans: 0,
      hint: "QuickSort achieves O(n log n) average performance with efficient partitioning."
    },
    {
      q: "Which protocol operates at the Transport Layer of the OSI model to provide reliable connection-oriented delivery?",
      opts: ["TCP (Transmission Control Protocol)", "UDP (User Datagram Protocol)", "IP (Internet Protocol)", "HTTP"],
      ans: 0,
      hint: "TCP uses 3-way handshake to guarantee packet delivery."
    },
    {
      q: "In Relational Database Systems, ACID properties ensure reliable transaction processing. What does 'A' stand for?",
      opts: ["Atomicity", "Availability", "Authentication", "Accuracy"],
      ans: 0,
      hint: "Atomicity ensures all operations in a transaction succeed or all fail."
    },
    {
      q: "What is the derivative of f(x) = sin(x) with respect to x?",
      opts: ["cos(x)", "-cos(x)", "tan(x)", "-sin(x)"],
      ans: 0,
      hint: "The rate of change of sine function is cosine function."
    }
  ];

  if (id <= topics.length) {
    const selected = topics[id - 1];
    return {
      id,
      question: selected.q,
      options: selected.opts,
      answer: selected.ans,
      hint: selected.hint
    };
  }

  // Dynamic engineering math problem
  const coef = Math.floor(seededRandom(seed + 1) * 8) + 2;
  const power = Math.floor(seededRandom(seed + 2) * 3) + 2;
  const derivCoef = coef * power;
  const derivPower = power - 1;

  return {
    id,
    question: `Find the derivative of the function f(x) = ${coef}x^${power} with respect to x:`,
    options: [
      `f'(x) = ${derivCoef}x^${derivPower}`,
      `f'(x) = ${coef}x^${derivPower}`,
      `f'(x) = ${derivCoef}x^${power}`,
      `f'(x) = ${coef * 2}x^${power + 1}`
    ],
    answer: 0,
    hint: `Applying power rule d/dx(a*x^n) = a*n*x^(n-1) yields ${derivCoef}x^${derivPower}.`
  };
}

// 5. General Reasoning & Aptitude Generator
function createGeneralAptitudeQuestion(id: number, seed: number): QuestionItem {
  return createDynamicMathReasoningQuestion(id, seed);
}

// Dynamic Math & Reasoning Problem Generator for guaranteed uniqueness
function createDynamicMathReasoningQuestion(id: number, seed: number): QuestionItem {
  const qType = Math.floor(seededRandom(seed) * 3);

  if (qType === 0) {
    // Number series
    const start = Math.floor(seededRandom(seed + 1) * 15) + 2;
    const diff = Math.floor(seededRandom(seed + 2) * 6) + 3;
    const s1 = start;
    const s2 = s1 + diff;
    const s3 = s2 + diff;
    const s4 = s3 + diff;
    const ansVal = s4 + diff;

    return {
      id,
      question: `Find the missing number in the sequence: ${s1}, ${s2}, ${s3}, ${s4}, (?)`,
      options: [`${ansVal}`, `${ansVal + 3}`, `${ansVal - 2}`, `${ansVal + 5}`],
      answer: 0,
      hint: `The common difference between consecutive numbers is +${diff}.`
    };
  } else if (qType === 1) {
    // Work & Time problem
    const daysA = (Math.floor(seededRandom(seed + 1) * 5) + 2) * 4; // 8, 12, 16, 20, 24
    const daysB = daysA * 2;
    const combinedDays = Math.round((daysA * daysB) / (daysA + daysB));

    return {
      id,
      question: `Worker A can finish a project in ${daysA} days and Worker B can finish the same project in ${daysB} days. How many days will they take working together?`,
      options: [`${combinedDays} days`, `${combinedDays + 3} days`, `${combinedDays - 2} days`, `${combinedDays + 5} days`],
      answer: 0,
      hint: `1/A + 1/B = 1/${daysA} + 1/${daysB} = 3/${daysB}. Total days = ${combinedDays}.`
    };
  } else {
    // Percentage / Profit problem
    const costPrice = (Math.floor(seededRandom(seed + 1) * 8) + 2) * 100; // 200 to 900
    const profitPercent = (Math.floor(seededRandom(seed + 2) * 4) + 1) * 5; // 5%, 10%, 15%, 20%
    const sellingPrice = costPrice + (costPrice * profitPercent) / 100;

    return {
      id,
      question: `An article with Cost Price of ₹${costPrice} is sold at a profit of ${profitPercent}%. Calculate its Selling Price:`,
      options: [`₹${sellingPrice}`, `₹${sellingPrice + 40}`, `₹${sellingPrice - 30}`, `₹${sellingPrice + 100}`],
      answer: 0,
      hint: `Selling Price = Cost Price + Profit = ${costPrice} + (${profitPercent}% of ${costPrice}) = ₹${sellingPrice}.`
    };
  }
}
