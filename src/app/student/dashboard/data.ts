export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  student_id: string;
  created_at: string;
  course_name?: string;
  course_id?: number | string;
}

export interface StudyMaterial {
  id: number;
  courseId: number;
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

// Study materials mapped to specific Course IDs (1: Web Dev, 2: CS, 3: English, 4: Math, 5: NEET)
export const STUDY_MATERIALS: StudyMaterial[] = [
  // Course 1: Web Development Basics
  {
    id: 1,
    courseId: 1,
    subject: "Web Development",
    title: "Introduction to HTML5 & Semantic Web",
    readTime: "8 mins read",
    content: "HTML5 is the latest version of Hypertext Markup Language, the code that describes web pages. It consists of semantic elements like <header>, <nav>, <main>, <section>, <article>, and <footer>. Using semantic tags improves SEO, document accessibility for screen readers, and layout readability for developer teams. In HTML5, you also have modern APIs like LocalStorage, SessionStorage, Canvas drawing, and Geolocation tags directly in the browser.",
  },
  {
    id: 2,
    courseId: 1,
    subject: "Web Development",
    title: "CSS3 Flexbox and Layout Systems",
    readTime: "10 mins read",
    content: "CSS Flexible Box Layout (Flexbox) is a 1-dimensional layout model for arranging items in rows or columns. By setting display: flex on a parent element, it becomes a flex container. Children elements automatically become flex items. Flexbox allows items to grow to fill unused space or shrink to prevent overflow. Key properties include justify-content (aligns items along the main axis) and align-items (aligns items along the cross axis).",
  },
  // Course 2: Computer Science
  {
    id: 3,
    courseId: 2,
    subject: "Computer Science",
    title: "Introduction to Databases & SQL Keys",
    readTime: "12 mins read",
    content: "A database is an organized collection of data stored electronically. Relational databases store records in tables with rows and columns, structured by SQL (Structured Query Language). A primary key is a field that uniquely identifies each record in a table. A foreign key is a field that links records in two different tables. Normalization is the process of structuring a database to reduce data redundancy and improve data integrity.",
  },
  {
    id: 4,
    courseId: 2,
    subject: "Computer Science",
    title: "Introduction to Sorting Algorithms",
    readTime: "15 mins read",
    content: "Sorting algorithms arrange elements of a list in a specific order (numerical or lexicographical). Popular algorithms include Bubble Sort, Insertion Sort, Merge Sort, and Quick Sort. Understanding time complexity (Big O notation) is essential for evaluating sorting efficiency in software systems.",
  },
  // Course 3: English Grammar Mastery
  {
    id: 5,
    courseId: 3,
    subject: "English Grammar",
    title: "Active vs. Passive Voice Rules",
    readTime: "6 mins read",
    content: "In active voice, the subject of the sentence performs the action (e.g., 'The student wrote the quiz'). In passive voice, the subject receives the action (e.g., 'The quiz was written by the student'). Use active voice for strong, direct writing, and passive voice when the performer of the action is unknown or when emphasizing the action itself rather than the actor.",
  },
  {
    id: 6,
    courseId: 3,
    subject: "English Grammar",
    title: "Tenses & Aspect Guidelines",
    readTime: "10 mins read",
    content: "English verbs have three primary tenses: Past, Present, and Future. Each tense has four aspects: Simple, Continuous, Perfect, and Perfect Continuous. Mastering tenses is crucial for effective and accurate written and verbal communication.",
  },
  // Course 4: Math & Algebra Essentials
  {
    id: 7,
    courseId: 4,
    subject: "Algebra",
    title: "Linear Equations & Solving Variables",
    readTime: "9 mins read",
    content: "A linear equation is an algebraic equation of the first degree, meaning it contains variables to the power of 1. Solving a linear equation involves isolating the variable on one side by applying reciprocal operations (addition/subtraction, multiplication/division) to both sides.",
  },
  {
    id: 8,
    courseId: 4,
    subject: "Algebra",
    title: "Solving Quadratic Equations via Formula",
    readTime: "11 mins read",
    content: "A quadratic equation is in the form ax^2 + bx + c = 0. We can solve it using the quadratic formula: x = (-b ± √(b^2 - 4ac)) / 2a. The term b^2 - 4ac is called the discriminant, determining the number and type of roots (real or complex).",
  },
  // Course 5: NEET Exam Preparation
  {
    id: 9,
    courseId: 5,
    subject: "Biology",
    title: "NEET Prep: Cell Biology Basics",
    readTime: "15 mins read",
    content: "Cell biology covers the structure and functions of cell organelles. Mitochondria are the powerhouse of the cell, generating ATP. Chloroplasts perform photosynthesis. Ribosomes carry out protein synthesis. The nucleus contains genetic material (DNA).",
  },
  {
    id: 10,
    courseId: 5,
    subject: "Physics",
    title: "NEET Prep: Laws of Motion Guidelines",
    readTime: "18 mins read",
    content: "Newton's laws of motion form the basis of classical mechanics. First law (Inertia): an object remains at rest or in uniform motion unless acted upon by a net force. Second law: F = ma. Third law: For every action, there is an equal and opposite reaction.",
  }
];

// Question banks mapped to each Course ID (1: Web Dev, 2: CS, 3: English, 4: Math, 5: NEET)
export const MCQ_BANKS: Record<number, Omit<MCQQuestion, "id">[]> = {
  1: [
    {
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Managing Language", "Home Tool Markup Language"],
      answer: 0,
      hint: "It is the standard markup language for creating web pages."
    },
    {
      question: "Which HTML5 tag is used to specify a footer for a document or section?",
      options: ["<bottom>", "<section-footer>", "<footer>", "<foot>"],
      answer: 2,
      hint: "It has the same name as the footer layout tag."
    },
    {
      question: "Which CSS property is used to change the text color of an element?",
      options: ["font-color", "color", "text-color", "background-color"],
      answer: 1,
      hint: "It is a single 5-letter word."
    },
    {
      question: "What is the default display value of a <div> element?",
      options: ["inline", "inline-block", "flex", "block"],
      answer: 3,
      hint: "It takes up the full width available and starts on a new line."
    },
    {
      question: "Which JavaScript array method adds an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      answer: 0,
      hint: "It pushes an element onto the end of the array."
    }
  ],
  2: [
    {
      question: "Which SQL command is used to retrieve data from a database?",
      options: ["GET", "FETCH", "SELECT", "EXTRACT"],
      answer: 2,
      hint: "It is used in queries like 'SELECT * FROM users'."
    },
    {
      question: "What is the time complexity of searching in a Balanced Binary Search Tree?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: 1,
      hint: "Binary search cuts the space in half at each step."
    },
    {
      question: "In computer networks, what does IP stand for?",
      options: ["Internet Protocol", "Internal Process", "Intranet Page", "Instant Port"],
      answer: 0,
      hint: "It is the main protocol for routing packets across the internet."
    },
    {
      question: "Which data structure operates on a Last-In, First-Out (LIFO) basis?",
      options: ["Queue", "Stack", "Heap", "Tree"],
      answer: 1,
      hint: "Think of a pile of plates: you add to the top and take from the top."
    },
    {
      question: "What does CPU stand for?",
      options: ["Central Process Unit", "Computer Processing Unit", "Central Processing Unit", "Central Processor Utility"],
      answer: 2,
      hint: "It is the primary electronic component of a computer that acts as its brain."
    }
  ],
  3: [
    {
      question: "Which of the following is passive voice?",
      options: ["She designed the website.", "The website was designed by her.", "They are designing websites.", "She designs websites."],
      answer: 1,
      hint: "The receiver of the action (website) is the subject of the sentence."
    },
    {
      question: "Identify the conjunction in the sentence: 'I went to bed early because I was tired.'",
      options: ["early", "because", "went", "tired"],
      answer: 1,
      hint: "It links the independent clause with the dependent clause of reason."
    },
    {
      question: "Which word is an antonym of 'Generous'?",
      options: ["Kind", "Selfish", "Helpful", "Giving"],
      answer: 1,
      hint: "It describes someone who cares only about themselves."
    },
    {
      question: "Choose the correct verb form: 'Neither of the students _____ finished the exam.'",
      options: ["have", "has", "are", "were"],
      answer: 1,
      hint: "Neither is singular, so it takes a singular verb."
    },
    {
      question: "What is the plural form of the word 'Criterion'?",
      options: ["Criterions", "Criteria", "Criterias", "Criteriones"],
      answer: 1,
      hint: "It is a word of Greek origin, where -on changes to -a."
    }
  ],
  4: [
    {
      question: "Solve for x in the equation: 3x - 7 = 11.",
      options: ["x = 4", "x = 5", "x = 6", "x = 7"],
      answer: 2,
      hint: "Add 7 to both sides, then divide by 3."
    },
    {
      question: "What is the value of the discriminant in the quadratic equation x^2 - 4x + 4 = 0?",
      options: ["-8", "0", "8", "16"],
      answer: 1,
      hint: "Use the formula b^2 - 4ac."
    },
    {
      question: "What is the derivative of x^2 with respect to x?",
      options: ["x", "2", "2x", "x^2"],
      answer: 2,
      hint: "Apply the power rule d/dx(x^n) = n*x^(n-1)."
    },
    {
      question: "What is the value of log10(1000)?",
      options: ["1", "2", "3", "4"],
      answer: 2,
      hint: "What power do you raise 10 to in order to get 1000?"
    },
    {
      question: "A triangle has side lengths of 3cm, 4cm, and 5cm. What type of triangle is it?",
      options: ["Equilateral", "Isosceles", "Right-angled", "Obtuse"],
      answer: 2,
      hint: "It satisfies the Pythagorean theorem: 3^2 + 4^2 = 5^2."
    }
  ],
  5: [
    {
      question: "Which cell organelle is known as the powerhouse of the cell?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"],
      answer: 2,
      hint: "It generates ATP (cellular energy)."
    },
    {
      question: "What is the function of xylem in plants?",
      options: ["Transport of food", "Transport of water and minerals", "Photosynthesis", "Respiration"],
      answer: 1,
      hint: "It transports water upwards from the roots."
    },
    {
      question: "What is the value of acceleration due to gravity on the surface of the Earth?",
      options: ["9.8 m/s^2", "1.6 m/s^2", "10.5 m/s^2", "8.9 m/s^2"],
      answer: 0,
      hint: "Standard approximate constant value."
    },
    {
      question: "Which hormone regulates the blood sugar level in humans?",
      options: ["Adrenaline", "Thyroxine", "Insulin", "Estrogen"],
      answer: 2,
      hint: "It is produced by the pancreas to lower glucose levels."
    },
    {
      question: "Which plant part performs photosynthesis?",
      options: ["Roots", "Stem", "Leaves", "Flowers"],
      answer: 2,
      hint: "It contains chlorophyll to absorb sunlight."
    }
  ],
  6: [
    {
      question: "What is the equivalent resistance of two 6 Ohm resistors connected in parallel?",
      options: ["12 Ohms", "3 Ohms", "6 Ohms", "1.5 Ohms"],
      answer: 1,
      hint: "Rp = (R1 * R2) / (R1 + R2)."
    },
    {
      question: "What is the de Broglie wavelength of an electron accelerated through 100 Volts?",
      options: ["1.227 Å", "12.27 Å", "0.123 Å", "122.7 Å"],
      answer: 0,
      hint: "Use lambda = 12.27 / sqrt(V) Å."
    }
  ],
  7: [
    {
      question: "What is the pH of a 10^-3 M HCl solution?",
      options: ["pH = 7", "pH = 3", "pH = 11", "pH = 4"],
      answer: 1,
      hint: "pH = -log[H+]."
    },
    {
      question: "What is the volume occupied by 1 mole of ideal gas at STP?",
      options: ["22.4 L", "11.2 L", "44.8 L", "5.6 L"],
      answer: 0,
      hint: "Standard molar volume at STP is 22.4 Liters."
    }
  ],
  8: [
    {
      question: "Evaluate the limit as x approaches 0 of sin(3x) / 2x.",
      options: ["3/2", "2/3", "1", "0"],
      answer: 0,
      hint: "Multiply by 3/3 and evaluate standard limit."
    },
    {
      question: "What is the derivative of x^3 with respect to x?",
      options: ["3x^2", "x^2", "3x", "3x^3"],
      answer: 0,
      hint: "Apply the power rule."
    }
  ],
  9: [
    {
      question: "Which cellular organelle is responsible for ATP generation?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"],
      answer: 2,
      hint: "Also known as the powerhouse of the cell."
    },
    {
      question: "Which hormone regulates human blood sugar levels?",
      options: ["Insulin", "Adrenaline", "Thyroxine", "Growth Hormone"],
      answer: 0,
      hint: "Secreted by beta cells of pancreas."
    }
  ],
  10: [
    {
      question: "What is the SI unit of electric resistance?",
      options: ["Ohm", "Volt", "Ampere", "Farad"],
      answer: 0,
      hint: "V = IR."
    },
    {
      question: "Calculate the limiting friction force for a 5 kg block on a level surface with friction coefficient 0.2. (g = 10 m/s^2)",
      options: ["10 N", "5 N", "50 N", "2 N"],
      answer: 0,
      hint: "f = mu * m * g."
    }
  ],
  11: [
    {
      question: "What is the oxidation state of sulfur in H2SO4?",
      options: ["+4", "+6", "-2", "0"],
      answer: 1,
      hint: "Calculate based on H as +1 and O as -2."
    },
    {
      question: "What is the rate equation of a first-order reaction's half-life?",
      options: ["t_1/2 = 0.693 / k", "t_1/2 = k / 0.693", "t_1/2 = 1 / k", "t_1/2 = 0.5 * k"],
      answer: 0,
      hint: "t_1/2 is independent of initial concentration."
    }
  ]
};
