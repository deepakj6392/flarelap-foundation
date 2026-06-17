const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set inside .env.local!");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function createMCQ(question, correctVal, incorrectVals, hintText) {
  const allOptions = [correctVal, ...incorrectVals.slice(0, 3)];
  const fallbacks = ["None of the above", "N/A", "Both of the above", "All of the above"];
  while (allOptions.length < 4) {
    const nextFallback = fallbacks.find(x => !allOptions.includes(x)) || "N/A";
    allOptions.push(nextFallback);
  }
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  const options = [];
  let answerIndex = 0;
  for (let i = 0; i < 4; i++) {
    const origIdx = indices[i];
    options.push(allOptions[origIdx]);
    if (origIdx === 0) {
      answerIndex = i;
    }
  }
  
  return {
    question,
    options,
    answer: answerIndex,
    hint: hintText || ""
  };
}

const defaultCourses = [
  "Web Development Basics",
  "Computer Science",
  "English Grammar Mastery",
  "Math & Algebra Essentials",
  "NEET Exam Preparation",
  "JEE Physics Practice Prep",
  "JEE Chemistry Practice Prep",
  "JEE Mathematics Practice Prep",
  "NEET Biology Advanced Prep",
  "NEET Physics Advanced Prep",
  "NEET Chemistry Advanced Prep"
];

// SHARED DATA ARRAYS
const organelles = [
  { name: "Mitochondria", role: "generating ATP (cellular energy)", function: "cellular respiration and ATP generation" },
  { name: "Ribosome", role: "protein synthesis", function: "synthesis of proteins" },
  { name: "Chloroplast", role: "performing photosynthesis", function: "photosynthesis and sugar synthesis" },
  { name: "Lysosome", role: "cellular waste disposal and digestion", function: "intracellular digestion and waste disposal" },
  { name: "Golgi Apparatus", role: "modifying, sorting, and packaging proteins", function: "sorting and packaging of proteins for secretion" },
  { name: "Smooth Endoplasmic Reticulum", role: "lipid synthesis and detoxification", function: "synthesis of lipids and detoxification" },
  { name: "Rough Endoplasmic Reticulum", role: "synthesis and folding of proteins", function: "synthesis and folding of proteins" },
  { name: "Nucleus", role: "storing the cell's hereditary material (DNA)", function: "storing genetic material and transcription" },
  { name: "Vacuole", role: "maintaining turgor pressure and storing water and nutrients", function: "storage of water, ions, and maintaining turgor pressure" },
  { name: "Centrosome", role: "organizing microtubules and helping in cell division", function: "organizing microtubules and helping in cell division" },
  { name: "Nucleolus", role: "ribosome assembly and RNA synthesis", function: "ribosome assembly and RNA synthesis" },
  { name: "Cell Membrane", role: "regulating entry and exit of substances in the cell", function: "regulating entry and exit of substances in the cell" },
  { name: "Peroxisome", role: "breaking down fatty acids and producing hydrogen peroxide", function: "breaking down fatty acids and producing hydrogen peroxide" },
  { name: "Amyloplast", role: "storing starch inside plant cells", function: "storing starch inside plant cells" },
  { name: "Chromoplast", role: "storing pigments that give color to fruits and flowers", function: "storing pigments that give color to fruits and flowers" }
];

const hormones = [
  { name: "Insulin", role: "lowering blood sugar level by promoting glucose absorption" },
  { name: "Glucagon", role: "raising blood sugar level by stimulating glycogen breakdown" },
  { name: "Thyroxine", role: "regulating basal metabolic rate (BMR) and development" },
  { name: "Adrenaline", role: "triggering the body's fight-or-flight response under stress" },
  { name: "Growth Hormone", role: "stimulating growth, cell reproduction, and regeneration" },
  { name: "Melatonin", role: "regulating the sleep-wake cycle (circadian rhythm)" },
  { name: "Estrogen", role: "developing and maintaining female secondary sexual characteristics" },
  { name: "Testosterone", role: "developing and maintaining male secondary sexual characteristics" },
  { name: "Oxytocin", role: "stimulating uterine contractions during childbirth and milk ejection" },
  { name: "Prolactin", role: "stimulating milk production in mammary glands" },
  { name: "Antidiuretic Hormone (ADH)", role: "regulating water balance by stimulating water reabsorption in kidneys" },
  { name: "Aldosterone", role: "regulating sodium and potassium levels in the blood" },
  { name: "Calcitonin", role: "reducing blood calcium level by inhibiting bone resorption" },
  { name: "Parathyroid Hormone (PTH)", role: "increasing blood calcium level by stimulating bone resorption" },
  { name: "Erythropoietin", role: "stimulating red blood cell production in bone marrow" }
];

const plantPhys = [
  { q: "Which plant tissue is responsible for the transport of water and mineral salts?", ans: "Xylem", incorrect: ["Phloem", "Parenchyma", "Collenchyma"], hint: "Xylem transports water upward." },
  { q: "Which plant tissue is responsible for the translocation of food (sucrose)?", ans: "Phloem", incorrect: ["Xylem", "Sclerenchyma", "Pith"], hint: "Phloem transports food." },
  { q: "Which pigment absorbs light energy during photosynthesis?", ans: "Chlorophyll", incorrect: ["Carotenoid", "Phycobilin", "Anthocyanin"], hint: "Green pigment." },
  { q: "What is the primary site of gas exchange in plant leaves?", ans: "Stomata", incorrect: ["Cuticle", "Trichome", "Lenticel"], hint: "Microscopic pores." },
  { q: "What is the process of water loss from the aerial parts of plants in the form of vapor?", ans: "Transpiration", incorrect: ["Guttation", "Respiration", "Osmosis"], hint: "Water loss from stomata." },
  { q: "Which plant hormone is primarily responsible for cell elongation and apical dominance?", ans: "Auxin", incorrect: ["Gibberellin", "Cytokinin", "Abscisic Acid"], hint: "Auxin regulates apical dominance." },
  { q: "Which plant hormone is a gas and is responsible for fruit ripening?", ans: "Ethylene", incorrect: ["Auxin", "Gibberellin", "Abscisic Acid"], hint: "Ethylene is gaseous." },
  { q: "Which plant hormone is known as the stress hormone because it induces stomatal closure?", ans: "Abscisic Acid (ABA)", incorrect: ["Auxin", "Gibberellin", "Cytokinin"], hint: "Abscisic acid regulates stress responses." },
  { q: "The movement of a plant part in response to light is called:", ans: "Phototropism", incorrect: ["Geotropism", "Hydrotropism", "Thigmotropism"], hint: "'Photo' means light." },
  { q: "The movement of plant roots downward in response to gravity is called:", ans: "Geotropism", incorrect: ["Phototropism", "Hydrotropism", "Chemotropism"], hint: "'Geo' refers to earth/gravity." }
];

const humanSystems = [
  { q: "What is the functional and structural unit of the human kidney?", ans: "Nephron", incorrect: ["Neuron", "Alveolus", "Hepatocyte"], hint: "Filters blood." },
  { q: "What is the structural and functional unit of the human nervous system?", ans: "Neuron", incorrect: ["Nephron", "Glial cell", "Axon"], hint: "Transmits electrical signals." },
  { q: "Where does the exchange of oxygen and carbon dioxide take place in the human lungs?", ans: "Alveoli", incorrect: ["Bronchioles", "Trachea", "Pleura"], hint: "Tiny air sacs." },
  { q: "Which protein in red blood cells is responsible for carrying oxygen?", ans: "Hemoglobin", incorrect: ["Myoglobin", "Albumin", "Fibrinogen"], hint: "Contains iron." },
  { q: "Which enzyme in the stomach is responsible for initiating protein digestion?", ans: "Pepsin", incorrect: ["Amylase", "Lipase", "Trypsin"], hint: "Works in highly acidic pH." },
  { q: "Where is bile produced in the human body?", ans: "Liver", incorrect: ["Gallbladder", "Pancreas", "Stomach"], hint: "Bile is produced in the liver and stored in the gallbladder." },
  { q: "Where is bile stored in the human body?", ans: "Gallbladder", incorrect: ["Liver", "Pancreas", "Duodenum"], hint: "Stored in a small pear-shaped organ." },
  { q: "Which is the largest gland in the human body?", ans: "Liver", incorrect: ["Pancreas", "Thyroid", "Adrenal"], hint: "It performs detoxification." },
  { q: "What is the normal blood pressure range for a healthy human adult?", ans: "120/80 mmHg", incorrect: ["140/90 mmHg", "100/60 mmHg", "110/70 mmHg"], hint: "Systolic/diastolic." },
  { q: "Which blood vessel carries oxygenated blood from the lungs to the left atrium?", ans: "Pulmonary Vein", incorrect: ["Pulmonary Artery", "Aorta", "Vena Cava"], hint: "The only vein carrying oxygenated blood." },
  { q: "Which chamber of the human heart has the thickest muscular wall?", ans: "Left Ventricle", incorrect: ["Right Ventricle", "Left Atrium", "Right Atrium"], hint: "Pumps blood to the entire body." },
  { q: "What is the normal lifespan of human red blood cells (RBCs)?", ans: "120 days", incorrect: ["60 days", "90 days", "150 days"], hint: "About 4 months." },
  { q: "Which vitamin is essential for blood clotting?", ans: "Vitamin K", incorrect: ["Vitamin A", "Vitamin C", "Vitamin D"], hint: "Synthesized by gut bacteria." },
  { q: "Which deficiency causes scurvy?", ans: "Vitamin C", incorrect: ["Vitamin A", "Vitamin B12", "Vitamin D"], hint: "Found in citrus fruits." },
  { q: "Which bone is the longest bone in the human body?", ans: "Femur", incorrect: ["Tibia", "Fibula", "Humerus"], hint: "Thigh bone." }
];

const chemFormulas = [
  { name: "Baking Soda", formula: "NaHCO3" },
  { name: "Washing Soda", formula: "Na2CO3" },
  { name: "Common Salt", formula: "NaCl" },
  { name: "Bleaching Powder", formula: "CaOCl2" },
  { name: "Plaster of Paris", formula: "CaSO4·1/2H2O" },
  { name: "Gypsum", formula: "CaSO4·2H2O" },
  { name: "Methane (Marsh Gas)", formula: "CH4" },
  { name: "Carbon Dioxide", formula: "CO2" },
  { name: "Water", formula: "H2O" },
  { name: "Hydrochloric Acid", formula: "HCl" },
  { name: "Sulfuric Acid", formula: "H2SO4" },
  { name: "Nitric Acid", formula: "HNO3" },
  { name: "Ammonia", formula: "NH3" },
  { name: "Ethanol", formula: "C2H5OH" },
  { name: "Acetic Acid (Vinegar)", formula: "CH3COOH" }
];

const elements = [
  { name: "Hydrogen", num: 1 }, { name: "Helium", num: 2 }, { name: "Lithium", num: 3 }, { name: "Beryllium", num: 4 },
  { name: "Boron", num: 5 }, { name: "Carbon", num: 6 }, { name: "Nitrogen", num: 7 }, { name: "Oxygen", num: 8 },
  { name: "Fluorine", num: 9 }, { name: "Neon", num: 10 }, { name: "Sodium", num: 11 }, { name: "Magnesium", num: 12 },
  { name: "Aluminum", num: 13 }, { name: "Silicon", num: 14 }, { name: "Phosphorus", num: 15 }, { name: "Sulfur", num: 16 },
  { name: "Chlorine", num: 17 }, { name: "Argon", num: 18 }, { name: "Potassium", num: 19 }, { name: "Calcium", num: 20 }
];

const units = [
  { quantity: "Force", unit: "Newton" },
  { quantity: "Work and Energy", unit: "Joule" },
  { quantity: "Power", unit: "Watt" },
  { quantity: "Pressure", unit: "Pascal" },
  { quantity: "Frequency", unit: "Hertz" },
  { quantity: "Electric Charge", unit: "Coulomb" },
  { quantity: "Electric Current", unit: "Ampere" },
  { quantity: "Electric Potential (Voltage)", unit: "Volt" },
  { quantity: "Electric Resistance", unit: "Ohm" },
  { quantity: "Electric Capacitance", unit: "Farad" },
  { quantity: "Magnetic Flux", unit: "Weber" },
  { quantity: "Magnetic Inductance", unit: "Henry" },
  { quantity: "Luminous Intensity", unit: "Candela" },
  { quantity: "Thermodynamic Temperature", unit: "Kelvin" },
  { quantity: "Amount of Substance", unit: "Mole" }
];

const constants = [
  { name: "speed of light in vacuum (c)", val: "3 x 10^8 m/s" },
  { name: "acceleration due to gravity on Earth (g)", val: "9.8 m/s^2" },
  { name: "universal gravitational constant (G)", val: "6.67 x 10^-11 N m^2/kg^2" },
  { name: "Planck's constant (h)", val: "6.626 x 10^-34 J s" },
  { name: "Avogadro's number (N_A)", val: "6.022 x 10^23 per mole" },
  { name: "ideal gas constant (R)", val: "8.314 J/(mol K)" },
  { name: "Boltzmann constant (k_B)", val: "1.38 x 10^-23 J/K" },
  { name: "charge of an electron (e)", val: "1.6 x 10^-19 Coulomb" },
  { name: "permittivity of free space (epsilon_0)", val: "8.854 x 10^-12 F/m" },
  { name: "permeability of free space (mu_0)", val: "4 x pi x 10^-7 H/m" }
];

const phyUnits = [
  { quantity: "Force", unit: "Newton (N)" },
  { quantity: "Work/Energy", unit: "Joule (J)" },
  { quantity: "Power", unit: "Watt (W)" },
  { quantity: "Pressure", unit: "Pascal (Pa)" },
  { quantity: "Frequency", unit: "Hertz (Hz)" },
  { quantity: "Electric Charge", unit: "Coulomb (C)" },
  { quantity: "Electric Current", unit: "Ampere (A)" },
  { quantity: "Electric Potential", unit: "Volt (V)" },
  { quantity: "Electric Resistance", unit: "Ohm" },
  { quantity: "Electric Capacitance", unit: "Farad (F)" },
  { quantity: "Magnetic Flux", unit: "Weber (Wb)" },
  { quantity: "Magnetic Inductance", unit: "Henry (H)" },
  { quantity: "Luminous Intensity", unit: "Candela (cd)" },
  { quantity: "Temperature", unit: "Kelvin (K)" },
  { quantity: "Permittivity of free space (epsilon_0)", unit: "F/m or C^2/(N m^2)" },
  { quantity: "Permeability of free space (mu_0)", unit: "H/m or N/A^2" },
  { quantity: "Stefan-Boltzmann constant", unit: "W/(m^2 K^4)" },
  { quantity: "Thermal Conductivity", unit: "W/(m K)" },
  { quantity: "Universal Gas Constant (R)", unit: "J/(mol K)" },
  { quantity: "Planck's Constant (h)", unit: "J s" },
  { quantity: "Gravitational Constant (G)", unit: "N m^2/kg^2" },
  { quantity: "Boltzmann Constant (k_B)", unit: "J/K" },
  { quantity: "Viscosity Coefficient", unit: "Pascal-second (Pa s) or Poiseuille" },
  { quantity: "Surface Tension", unit: "N/m" },
  { quantity: "Specific Heat Capacity", unit: "J/(kg K)" }
];

const species = [
  { name: "H", Z: 1 },
  { name: "He+", Z: 2 },
  { name: "Li2+", Z: 3 }
];

const logCombos = [
  { b: 2, e: 2, v: 4 }, { b: 2, e: 3, v: 8 }, { b: 2, e: 4, v: 16 }, { b: 2, e: 5, v: 32 }, { b: 2, e: 6, v: 64 },
  { b: 3, e: 2, v: 9 }, { b: 3, e: 3, v: 27 }, { b: 3, e: 4, v: 81 }, { b: 3, e: 5, v: 243 },
  { b: 5, e: 2, v: 25 }, { b: 5, e: 3, v: 125 }, { b: 5, e: 4, v: 625 },
  { b: 10, e: 1, v: 10 }, { b: 10, e: 2, v: 100 }, { b: 10, e: 3, v: 1000 }, { b: 10, e: 4, v: 10000 },
  { b: 4, e: 2, v: 16 }, { b: 4, e: 3, v: 64 }, { b: 6, e: 2, v: 36 }, { b: 7, e: 2, v: 49 }
];

const cellParts = [
  { organelle: "Mitochondria", function: "cellular respiration and ATP generation" },
  { organelle: "Ribosome", function: "synthesis of proteins" },
  { organelle: "Chloroplast", function: "photosynthesis and sugar synthesis" },
  { organelle: "Lysosome", function: "intracellular digestion and waste disposal" },
  { organelle: "Golgi apparatus", function: "sorting and packaging of proteins for secretion" },
  { organelle: "Endoplasmic reticulum", function: "synthesis of lipids and proteins" },
  { organelle: "Nucleus", function: "storing genetic material and transcription" },
  { organelle: "Vacuole", function: "storage of water, ions, and maintaining turgor pressure" }
];

const cellHormones = [
  { hormone: "Insulin", role: "regulation of blood glucose levels (lowering)" },
  { hormone: "Thyroxine", role: "control of basal metabolic rate in tissues" },
  { hormone: "Adrenaline", role: "triggering emergency fight-or-flight reactions" },
  { hormone: "Oxytocin", role: "stimulating milk ejection and uterine contractions" },
  { hormone: "Melatonin", role: "regulating circadian biological sleep-wake cycles" },
  { hormone: "Prolactin", role: "initiating lactation in mammary glands" },
  { hormone: "Glucagon", role: "stimulating glycogenolysis to raise blood sugar" }
];

const bioGeneral = [
  { q: "What is the structural and functional unit of the human kidney?", ans: "Nephron", incorrect: ["Neuron", "Alveolus", "Neurilemma"], hint: "Filters blood." },
  { q: "What is the structural and functional unit of the nervous system?", ans: "Neuron", incorrect: ["Nephron", "Axon", "Synapse"], hint: "Transmits signals." },
  { q: "Where does gas exchange occur in the human respiratory system?", ans: "Alveoli", incorrect: ["Bronchi", "Trachea", "Larynx"], hint: "Air sacs." },
  { q: "Which blood vessel carries oxygenated blood from lungs to heart?", ans: "Pulmonary Vein", incorrect: ["Pulmonary Artery", "Aorta", "Vena Cava"], hint: "Vein to left atrium." },
  { q: "Which enzyme is found in human saliva?", ans: "Amylase", incorrect: ["Pepsin", "Trypsin", "Lipase"], hint: "Breaks starch." }
];

const htmlTags = [
  { tag: "header", meaning: "a container for introductory content or a set of navigational links" },
  { tag: "nav", meaning: "a set of navigation links" },
  { tag: "main", meaning: "the dominant content of the body of a document" },
  { tag: "section", meaning: "a thematic grouping of content, typically with a heading" },
  { tag: "article", meaning: "a self-contained composition in a document, page, application, or site" },
  { tag: "aside", meaning: "content aside from the content it is placed in (like a sidebar)" },
  { tag: "footer", meaning: "a footer for its nearest ancestor sectioning content or sectioning root element" },
  { tag: "figure", meaning: "self-contained content, like illustrations, diagrams, photos, code listings, etc." },
  { tag: "figcaption", meaning: "a caption or legend for a figure element" },
  { tag: "details", meaning: "additional details that the user can view or hide on demand" },
  { tag: "summary", meaning: "a visible heading for a details element" },
  { tag: "mark", meaning: "text that should be highlighted or marked for reference" },
  { tag: "time", meaning: "a specific period in time or a date/time" },
  { tag: "progress", meaning: "the completion progress of a task" },
  { tag: "meter", meaning: "a scalar measurement within a known range, or a fractional value" }
];

const cssProps = [
  { prop: "color", purpose: "set the color of text" },
  { prop: "background-color", purpose: "set the background color of an element" },
  { prop: "font-size", purpose: "specify the size of the font" },
  { prop: "margin", purpose: "create space around elements, outside of any defined borders" },
  { prop: "padding", purpose: "create space around an element's content, inside of any defined borders" },
  { prop: "border", purpose: "specify the style, width, and color of an element's border" },
  { prop: "width", purpose: "set the width of an element" },
  { prop: "height", purpose: "set the height of an element" },
  { prop: "display", purpose: "specify the display behavior of an element" },
  { prop: "position", purpose: "specify the type of positioning method used for an element" },
  { prop: "top", purpose: "affect the vertical position of a positioned element" },
  { prop: "left", purpose: "affect the horizontal position of a positioned element" },
  { prop: "z-index", purpose: "specify the stack order of an element" },
  { prop: "overflow", purpose: "specify what happens if content overflows an element's box" },
  { prop: "float", purpose: "specify whether an element should float to the left, right, or not at all" },
  { prop: "align-items", purpose: "align flex items along the cross axis inside a flex container" },
  { prop: "justify-content", purpose: "align flex items along the main axis inside a flex container" },
  { prop: "flex-direction", purpose: "specify the direction of the flexible items" },
  { prop: "grid-template-columns", purpose: "specify the number and size of columns in a grid layout" },
  { prop: "box-shadow", purpose: "attach one or more shadows to an element" }
];

const displayTypes = [
  { tag: "div", display: "block" },
  { tag: "p", display: "block" },
  { tag: "h1", display: "block" },
  { tag: "h2", display: "block" },
  { tag: "ul", display: "block" },
  { tag: "li", display: "block" },
  { tag: "span", display: "inline" },
  { tag: "a", display: "inline" },
  { tag: "strong", display: "inline" },
  { tag: "em", display: "inline" },
  { tag: "img", display: "inline" },
  { tag: "button", display: "inline-block" },
  { tag: "input", display: "inline-block" },
  { tag: "select", display: "inline-block" }
];

const jsMethods = [
  { method: "push()", desc: "add one or more elements to the end of an array and return the new length" },
  { method: "pop()", desc: "remove the last element from an array and return that element" },
  { method: "shift()", desc: "remove the first element from an array and return that removed element" },
  { method: "unshift()", desc: "add one or more elements to the beginning of an array and return the new length" },
  { method: "concat()", desc: "merge two or more arrays and return a new array" },
  { method: "join()", desc: "join all elements of an array into a string and return it" },
  { method: "slice()", desc: "return a shallow copy of a portion of an array into a new array object selected from start to end" },
  { method: "splice()", desc: "change the contents of an array by removing or replacing existing elements and/or adding new elements" },
  { method: "indexOf()", desc: "return the first index at which a given element can be found in the array, or -1 if it is not present" },
  { method: "find()", desc: "return the value of the first element in the provided array that satisfies the testing function" },
  { method: "findIndex()", desc: "return the index of the first element in the array that satisfies the testing function" },
  { method: "filter()", desc: "create a new array with all elements that pass the test implemented by the provided function" },
  { method: "map()", desc: "create a new array populated with the results of calling a provided function on every element in the array" },
  { method: "reduce()", desc: "execute a user-supplied reducer callback function on each element of the array, resulting in a single output value" },
  { method: "forEach()", desc: "execute a provided function once for each array element" }
];

const httpCodes = [
  { code: 200, name: "OK", meaning: "the request has succeeded" },
  { code: 201, name: "Created", meaning: "the request has succeeded and led to the creation of a new resource" },
  { code: 301, name: "Moved Permanently", meaning: "the URI of the requested resource has been changed permanently" },
  { code: 302, name: "Found", meaning: "the URI of requested resource has been changed temporarily" },
  { code: 400, name: "Bad Request", meaning: "the server cannot or will not process the request due to a client error" },
  { code: 401, name: "Unauthorized", meaning: "the client must authenticate itself to get the requested response" },
  { code: 403, name: "Forbidden", meaning: "the client does not have access rights to the content" },
  { code: 404, name: "Not Found", meaning: "the server cannot find the requested resource" },
  { code: 500, name: "Internal Server Error", meaning: "the server has encountered a situation it does not know how to handle" },
  { code: 502, name: "Bad Gateway", meaning: "the server, while acting as a gateway or proxy, received an invalid response" },
  { code: 503, name: "Service Unavailable", meaning: "the server is not ready to handle the request (commonly down for maintenance)" }
];

const sorts = ["Bubble Sort", "Insertion Sort", "Selection Sort", "Merge Sort", "Quick Sort", "Heap Sort"];
const complexities = {
  "Bubble Sort": { best: "O(n)", avg: "O(n^2)", worst: "O(n^2)" },
  "Insertion Sort": { best: "O(n)", avg: "O(n^2)", worst: "O(n^2)" },
  "Selection Sort": { best: "O(n^2)", avg: "O(n^2)", worst: "O(n^2)" },
  "Merge Sort": { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
  "Quick Sort": { best: "O(n log n)", avg: "O(n log n)", worst: "O(n^2)" },
  "Heap Sort": { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" }
};

const sqlCommands = [
  { cmd: "SELECT", purpose: "retrieve data from one or more tables" },
  { cmd: "INSERT", purpose: "add new rows of data into a table" },
  { cmd: "UPDATE", purpose: "modify existing records within a table" },
  { cmd: "DELETE", purpose: "remove existing rows from a table" },
  { cmd: "CREATE TABLE", purpose: "define and create a new table schema" },
  { cmd: "DROP TABLE", purpose: "delete a table definition along with all its data" },
  { cmd: "ALTER TABLE", purpose: "add, delete, or modify columns in an existing table" },
  { cmd: "TRUNCATE TABLE", purpose: "remove all rows from a table quickly without logging individual row deletions" }
];

const principles = [
  { ds: "Stack", principle: "Last-In, First-Out (LIFO)" },
  { ds: "Queue", principle: "First-In, First-Out (FIFO)" }
];

const csAbbrevs = [
  { short: "CPU", long: "Central Processing Unit" },
  { short: "RAM", long: "Random Access Memory" },
  { short: "ROM", long: "Read Only Memory" },
  { short: "DNS", long: "Domain Name System" },
  { short: "IP", long: "Internet Protocol" },
  { short: "TCP", long: "Transmission Control Protocol" },
  { short: "UDP", long: "User Datagram Protocol" },
  { short: "HTTP", long: "Hypertext Transfer Protocol" },
  { short: "HTTPS", long: "Hypertext Transfer Protocol Secure" },
  { short: "URL", long: "Uniform Resource Locator" },
  { short: "API", long: "Application Programming Interface" },
  { short: "SQL", long: "Structured Query Language" },
  { short: "LAN", long: "Local Area Network" },
  { short: "WAN", long: "Wide Area Network" },
  { short: "BIOS", long: "Basic Input Output System" }
];

const ports = [
  { protocol: "HTTP", port: "80" },
  { protocol: "HTTPS", port: "443" },
  { protocol: "FTP (Control)", port: "21" },
  { protocol: "SSH", port: "22" },
  { protocol: "Telnet", port: "23" },
  { protocol: "SMTP", port: "25" },
  { protocol: "DNS", port: "53" },
  { protocol: "DHCP (Server)", port: "67" },
  { protocol: "TFTP", port: "69" },
  { protocol: "HTTP Proxy", port: "8080" }
];

const binaries = [
  { bin: "0000", dec: "0" }, { bin: "0001", dec: "1" }, { bin: "0010", dec: "2" }, { bin: "0011", dec: "3" },
  { bin: "0100", dec: "4" }, { bin: "0101", dec: "5" }, { bin: "0110", dec: "6" }, { bin: "0111", dec: "7" },
  { bin: "1000", dec: "8" }, { bin: "1001", dec: "9" }, { bin: "1010", dec: "10" }, { bin: "1011", dec: "11" },
  { bin: "1100", dec: "12" }, { bin: "1101", dec: "13" }, { bin: "1110", dec: "14" }, { bin: "1111", dec: "15" },
  { bin: "10000", dec: "16" }, { bin: "10001", dec: "17" }, { bin: "10010", dec: "18" }, { bin: "10011", dec: "19" },
  { bin: "10100", dec: "20" }
];

const vocab = [
  { word: "Abundant", synonym: "Plentiful", antonym: "Scarce" },
  { word: "Benevolent", synonym: "Kind", antonym: "Malevolent" },
  { word: "Candid", synonym: "Frank", antonym: "Insincere" },
  { word: "Diligent", synonym: "Hardworking", antonym: "Lazy" },
  { word: "Eloquent", synonym: "Silver-tongued", antonym: "Inarticulate" },
  { word: "Fragile", synonym: "Delicate", antonym: "Sturdy" },
  { word: "Gargantuan", synonym: "Huge", antonym: "Tiny" },
  { word: "Hypocrisy", synonym: "Insincerity", antonym: "Sincerity" },
  { word: "Immaculate", synonym: "Spotless", antonym: "Dirty" },
  { word: "Jubilant", synonym: "Joyful", antonym: "Melancholy" },
  { word: "Lethargic", synonym: "Sluggish", antonym: "Energetic" },
  { word: "Meticulous", synonym: "Precise", antonym: "Careless" },
  { word: "Nefarious", synonym: "Wicked", antonym: "Virtuous" },
  { word: "Obsolete", synonym: "Outdated", antonym: "Modern" },
  { word: "Pristine", synonym: "Pure", antonym: "Spoiled" },
  { word: "Quixotic", synonym: "Idealistic", antonym: "Pragmatic" },
  { word: "Resilient", synonym: "Elastic", antonym: "Vulnerable" },
  { word: "Scrutinize", synonym: "Examine", antonym: "Ignore" },
  { word: "Transient", synonym: "Temporary", antonym: "Permanent" },
  { word: "Ubiquitous", synonym: "Omnipresent", antonym: "Rare" }
];

const plurals = [
  { singular: "Criterion", plural: "Criteria" },
  { singular: "Oasis", plural: "Oases" },
  { singular: "Child", plural: "Children" },
  { singular: "Foot", plural: "Feet" },
  { singular: "Tooth", plural: "Teeth" },
  { singular: "Ox", plural: "Oxen" },
  { singular: "Mouse", plural: "Mice" },
  { singular: "Louse", plural: "Lice" },
  { singular: "Datum", plural: "Data" },
  { singular: "Phenomenon", plural: "Phenomena" },
  { singular: "Leaf", plural: "Leaves" },
  { singular: "Knife", plural: "Knives" },
  { singular: "Half", plural: "Halves" },
  { singular: "Life", plural: "Lives" },
  { singular: "Wife", plural: "Wives" }
];

const svAgreement = [
  { q: "Choose the correct verb form: 'Neither of the students _____ finished the exam.'", ans: "has", incorrect: ["have", "are", "were"], hint: "Neither is singular." },
  { q: "Choose the correct verb form: 'Either the teacher or the students _____ writing on the board.'", ans: "are", incorrect: ["is", "was", "has"], hint: "Verb agrees with the closer subject." },
  { q: "Choose the correct verb form: 'The team _____ practicing hard for the tournament.'", ans: "is", incorrect: ["are", "were", "have"], hint: "Collective noun treated as singular." },
  { q: "Choose the correct verb form: 'Each of the candidates _____ interviewed separately.'", ans: "is", incorrect: ["are", "were", "have been"], hint: "Each is singular." },
  { q: "Choose the correct verb form: 'Bread and butter _____ our daily breakfast.'", ans: "is", incorrect: ["are", "were", "have been"], hint: "Bread and butter is treated as a single compound subject." },
  { q: "Choose the correct verb form: 'Ten thousand dollars _____ a lot of money.'", ans: "is", incorrect: ["are", "were", "have"], hint: "Sum of money is treated as singular." },
  { q: "Choose the correct verb form: 'The jury _____ divided in their opinions.'", ans: "were", incorrect: ["was", "is", "has been"], hint: "Jury members acting individually take plural verb." },
  { q: "Choose the correct verb form: 'Physics _____ my favorite subject in high school.'", ans: "is", incorrect: ["are", "were", "have been"], hint: "Subject names ending in -s are singular." },
  { q: "Choose the correct verb form: 'A number of students _____ absent today.'", ans: "are", incorrect: ["is", "was", "has been"], hint: "'A number of' is plural, 'The number of' is singular." },
  { q: "Choose the correct verb form: 'The number of active volunteers _____ increasing daily.'", ans: "is", incorrect: ["are", "were", "have"], hint: "'The number of' takes a singular verb." },
  { q: "Choose the correct verb form: 'Many a student _____ made the same mistake.'", ans: "has", incorrect: ["have", "are", "were"], hint: "'Many a' is singular." },
  { q: "Choose the correct verb form: 'He, along with his friends, _____ going to the party.'", ans: "is", incorrect: ["are", "were", "have"], hint: "Parenthetical expressions don't change subject number." },
  { q: "Choose the correct verb form: 'There _____ many reasons to support the project.'", ans: "are", incorrect: ["is", "was", "has been"], hint: "Verb agrees with the real subject 'reasons'." },
  { q: "Choose the correct verb form: 'Politics _____ a dirty game, some say.'", ans: "is", incorrect: ["are", "were", "have been"], hint: "Politics is singular." },
  { q: "Choose the correct verb form: 'The scissors _____ on the table.'", ans: "are", incorrect: ["is", "was", "has been"], hint: "Scissors is always plural." }
];

const voiceAndPrep = [
  { q: "Change the sentence to passive voice: 'The dog bit the man.'", ans: "The man was bitten by the dog.", incorrect: ["The man is bitten by the dog.", "The man had been bitten by the dog.", "The dog was bitten by the man."], hint: "Past simple passive is was/were + past participle." },
  { q: "Change the sentence to passive voice: 'She is writing a letter.'", ans: "A letter is being written by her.", incorrect: ["A letter was written by her.", "A letter is written by her.", "A letter was being written by her."], hint: "Present continuous passive uses is/are + being + past participle." },
  { q: "Change the sentence to active voice: 'The cake was eaten by John.'", ans: "John ate the cake.", incorrect: ["John has eaten the cake.", "John is eating the cake.", "John eats the cake."], hint: "Past simple active." },
  { q: "Complete the sentence: 'He is proficient _____ English and Mathematics.'", ans: "in", incorrect: ["at", "with", "on"], hint: "Proficient in something." },
  { q: "Complete the sentence: 'She is angry _____ her brother's behavior.'", ans: "at", incorrect: ["with", "to", "for"], hint: "Angry at behavior, angry with a person." },
  { q: "Complete the sentence: 'We arrived _____ the airport just in time.'", ans: "at", incorrect: ["in", "to", "on"], hint: "Arrived at a specific location." },
  { q: "Complete the sentence: 'He has been suffering _____ fever since yesterday.'", ans: "from", incorrect: ["with", "by", "of"], hint: "Suffering from a disease/condition." },
  { q: "Complete the sentence: 'She is fond _____ classical music.'", ans: "of", incorrect: ["for", "about", "with"], hint: "Fond of." },
  { q: "Complete the sentence: 'He was accused _____ theft.'", ans: "of", incorrect: ["for", "with", "by"], hint: "Accused of." },
  { q: "Complete the sentence: 'You must abide _____ the rules of the foundation.'", ans: "by", incorrect: ["with", "to", "at"], hint: "Abide by." },
  { q: "Complete the sentence: 'Translate this passage _____ Hindi.'", ans: "into", incorrect: ["to", "in", "with"], hint: "Translate into." },
  { q: "Complete the sentence: 'He succeeded _____ passing the examination.'", ans: "in", incorrect: ["at", "on", "to"], hint: "Succeeded in doing something." },
  { q: "Complete the sentence: 'He was prevented _____ going to the meeting.'", ans: "from", incorrect: ["to", "for", "by"], hint: "Prevented from." },
  { q: "Complete the sentence: 'She is married _____ a doctor.'", ans: "to", incorrect: ["with", "by", "of"], hint: "Married to." },
  { q: "Complete the sentence: 'He is superior _____ his colleagues.'", ans: "to", incorrect: ["than", "from", "with"], hint: "Superior, inferior, senior, junior take 'to'." }
];

// WEBDEV QUESTIONS (115)
const webdevQuestions = [];
htmlTags.forEach((item) => {
  const others = htmlTags.filter(x => x.tag !== item.tag).map(x => `<${x.tag}>`);
  webdevQuestions.push(createMCQ(
    `Which HTML5 tag is used to specify ${item.meaning}?`,
    `<${item.tag}>`,
    others,
    `It is written as <${item.tag}>.`
  ));
});
cssProps.forEach((item) => {
  const others = cssProps.filter(x => x.prop !== item.prop).map(x => x.prop);
  webdevQuestions.push(createMCQ(
    `Which CSS property is used to ${item.purpose}?`,
    item.prop,
    others,
    `Look for the '${item.prop}' property.`
  ));
});
displayTypes.forEach((item) => {
  const options = ["block", "inline", "inline-block", "none"];
  const correct = item.display;
  const others = options.filter(x => x !== correct);
  webdevQuestions.push(createMCQ(
    `What is the default display value of the HTML element <${item.tag}>?`,
    correct,
    others,
    `Most container tags are block, while inline formatting tags are inline.`
  ));
});
jsMethods.forEach((item) => {
  const others = jsMethods.filter(x => x.method !== item.method).map(x => x.method);
  webdevQuestions.push(createMCQ(
    `Which JavaScript array method is used to ${item.desc}?`,
    item.method,
    others,
    `The method is ${item.method}.`
  ));
});
httpCodes.forEach((item) => {
  const others = httpCodes.filter(x => x.code !== item.code).map(x => `Indicates that ${x.meaning}`);
  webdevQuestions.push(createMCQ(
    `In HTTP protocols, what does the status code ${item.code} (${item.name}) represent?`,
    `Indicates that ${item.meaning}`,
    others,
    `Status code ${item.code} represents ${item.name}.`
  ));
});
const hardcodedWebDev = [
  { question: "What is the primary difference between LocalStorage and SessionStorage?", correct: "LocalStorage persists indefinitely while SessionStorage clears when the tab is closed.", incorrect: ["LocalStorage has no size limit while SessionStorage is limited to 5MB.", "SessionStorage persists indefinitely while LocalStorage clears when the tab is closed.", "LocalStorage is stored on the server and SessionStorage is stored on the client."], hint: "Think of session duration." },
  { question: "Which CSS unit is relative to the font-size of the root element (html)?", correct: "rem", incorrect: ["em", "px", "vh"], hint: "The 'r' stands for 'root'." },
  { question: "What does DOM stand for in web development?", correct: "Document Object Model", incorrect: ["Data Object Mode", "Digital Ordinance Module", "Document Oriented Matrix"], hint: "It represents the structured document as a tree." },
  { question: "In React, which hook is used to perform side effects in functional components?", correct: "useEffect", incorrect: ["useState", "useContext", "useReducer"], hint: "Named after 'side effect'." },
  { question: "What is the purpose of the key prop in React lists?", correct: "To help React identify which items have changed, been added, or been removed.", incorrect: ["To style individual list items uniquely.", "To secure list items from external scripting.", "To bind list item data to database keys."], hint: "It provides a stable identity for virtual DOM reconciliation." },
  { question: "Which HTML meta tag ensures a web page is mobile responsive?", correct: "viewport", incorrect: ["description", "charset", "theme-color"], hint: "Controls the width and scaling of the viewport." },
  { question: "What is the purpose of the 'use strict' directive in JavaScript?", correct: "It enforces stricter parsing and error handling in your JS code.", incorrect: ["It optimizes compilation for server environments.", "It encrypts variable names inside the file.", "It prevents variables from being GC'ed."], hint: "Helps catch common coding bugs and unsafe actions." },
  { question: "Which of the following is NOT a valid value for the display property in CSS?", correct: "inside", incorrect: ["flex", "grid", "inline-block"], hint: "Flex, grid, inline-block are valid display values." },
  { question: "Which tag is used to reference an external JavaScript file in HTML?", correct: "<script>", incorrect: ["<link>", "<js>", "<style>"], hint: "Uses the src attribute." },
  { question: "What is the purpose of the CSS property 'box-sizing: border-box'?", correct: "It includes padding and border in the element's total width and height.", incorrect: ["It wraps the element in a standard border.", "It forces the box layout to be inline-block.", "It restricts the box width to the width of the screen."], hint: "Makes layout dimensions easier to calculate." },
  { question: "In JS, what is the output of 'typeof null'?", correct: "object", incorrect: ["null", "undefined", "number"], hint: "This is a historical bug in JS." },
  { question: "What does JSON stand for?", correct: "JavaScript Object Notation", incorrect: ["Java Standard Object Network", "JavaScript Online Node", "Joint System Operations Network"], hint: "A lightweight data-interchange format." },
  { question: "Which HTTP method is typically used to update an existing resource partially?", correct: "PATCH", incorrect: ["PUT", "POST", "GET"], hint: "PUT updates completely, PATCH updates partially." },
  { question: "What is the function of the CSS property 'z-index'?", correct: "It controls the vertical stacking order of overlapping elements.", incorrect: ["It controls the zoom level of the page.", "It specifies the width of the border.", "It aligns items along the z-axis of a grid."], hint: "Only works on positioned elements." },
  { question: "Which JavaScript keyword is used to declare a block-scoped local variable that cannot be reassigned?", correct: "const", incorrect: ["let", "var", "constant"], hint: "Stands for constant." },
  { question: "What is the purpose of the Alt attribute in an HTML Image tag?", correct: "To provide alternative text if the image cannot be loaded.", incorrect: ["To change the image layout dynamically.", "To link the image to a secondary URL.", "To set the alternative source path."], hint: "Improves web accessibility." },
  { question: "Which CSS layout system is designed for two-dimensional layouts (rows and columns simultaneously)?", correct: "Grid", incorrect: ["Flexbox", "Float", "Inline-block"], hint: "Grid is two-dimensional, Flexbox is one-dimensional." },
  { question: "What is the default port for secure HTTPS requests?", correct: "443", incorrect: ["80", "8080", "22"], hint: "HTTP is 80, HTTPS is 443." },
  { question: "In React, how can you update state in functional components?", correct: "By calling the state updater function returned by the useState hook.", incorrect: ["By directly reassigning the state variable.", "By calling forceUpdate() on the window.", "By reloading the DOM template."], hint: "Use state hooks." },
  { question: "What is the purpose of CORS in web applications?", correct: "To allow or restrict resources requested from another domain.", incorrect: ["To compress response headers in transit.", "To encrypt client-side database records.", "To speed up DNS resolution times."], hint: "Cross-Origin Resource Sharing." }
];
hardcodedWebDev.forEach(item => {
  webdevQuestions.push(createMCQ(item.question, item.correct, item.incorrect, item.hint));
});
cssProps.forEach((item) => {
  const others = cssProps.filter(x => x.prop !== item.prop).map(x => x.prop);
  webdevQuestions.push(createMCQ(
    `What is the main purpose of using the CSS property '${item.prop}'?`,
    `To ${item.purpose}`,
    others.map(x => `To specify the ${x} setting`),
    `It is used to ${item.purpose}.`
  ));
});

// COMPUTER SCIENCE QUESTIONS (113)
const csQuestions = [];
sorts.forEach(sort => {
  const options = ["O(n)", "O(n log n)", "O(n^2)", "O(1)"];
  const bestC = complexities[sort].best;
  csQuestions.push(createMCQ(
    `What is the best-case time complexity of sorting an array of size n using ${sort}?`,
    bestC,
    options.filter(x => x !== bestC),
    `Check standard documentation for ${sort}.`
  ));
  const avgC = complexities[sort].avg;
  csQuestions.push(createMCQ(
    `What is the average-case time complexity of sorting an array of size n using ${sort}?`,
    avgC,
    options.filter(x => x !== avgC),
    `Average case for ${sort}.`
  ));
  const worstC = complexities[sort].worst;
  csQuestions.push(createMCQ(
    `What is the worst-case time complexity of sorting an array of size n using ${sort}?`,
    worstC,
    options.filter(x => x !== worstC),
    `Worst case for ${sort}.`
  ));
});
sqlCommands.forEach(item => {
  const others = sqlCommands.filter(x => x.cmd !== item.cmd).map(x => x.cmd);
  csQuestions.push(createMCQ(
    `Which SQL command is used to ${item.purpose}?`,
    item.cmd,
    others,
    `Use the ${item.cmd} command.`
  ));
});
principles.forEach(item => {
  const others = principles.filter(x => x.ds !== item.ds).map(x => x.ds);
  csQuestions.push(createMCQ(
    `Which data structure operates on the principle where ${item.principle}?`,
    item.ds,
    others,
    `It is the ${item.ds} structure.`
  ));
  csQuestions.push(createMCQ(
    `Which principle does the ${item.ds} data structure follow?`,
    item.principle,
    principles.filter(x => x.principle !== item.principle).map(x => x.principle),
    `It follows ${item.principle}.`
  ));
});
csAbbrevs.forEach(item => {
  const others = csAbbrevs.filter(x => x.short !== item.short).map(x => x.long);
  csQuestions.push(createMCQ(
    `What does the abbreviation '${item.short}' stand for in computer science?`,
    item.long,
    others,
    `It stands for ${item.long}.`
  ));
});
ports.forEach(item => {
  const others = ports.filter(x => x.port !== item.port).map(x => x.port);
  csQuestions.push(createMCQ(
    `What is the standard port number used by the ${item.protocol} protocol?`,
    item.port,
    others,
    `It is standard port ${item.port}.`
  ));
});
binaries.forEach(item => {
  const val = Number(item.dec);
  const others = [String(val + 2), String(val - 1), String(val + 5)];
  csQuestions.push(createMCQ(
    `What is the decimal equivalent of the binary number '${item.bin}'?`,
    item.dec,
    others,
    `Calculate powers of 2 for positions of 1s.`
  ));
});
const hardcodedCS = [
  { question: "Which of the following is NOT one of Coffman's four conditions for deadlock?", correct: "Preemption", incorrect: ["Mutual Exclusion", "Hold and Wait", "Circular Wait"], hint: "Deadlock requires No Preemption." },
  { question: "What is virtual memory in an operating system?", correct: "A storage allocation scheme in which secondary memory can be addressed as primary memory.", incorrect: ["A RAM module that works in hyper-speed.", "A cloud-based memory cache shared among instances.", "A partition of physical RAM reserved for graphics data."], hint: "Translates virtual addresses to physical ones." },
  { question: "What is a page fault in virtual memory systems?", correct: "An interrupt that occurs when a program requests data not currently in RAM.", incorrect: ["A hardware breakdown in the RAM stick.", "An invalid pointer syntax error in code execution.", "A corrupted partition on the secondary drive."], hint: "The requested page must be loaded from secondary storage." },
  { question: "Which scheduling algorithm is non-preemptive and allocates CPU to the process with the shortest execution time?", correct: "Shortest Job First (SJF)", incorrect: ["Round Robin", "Shortest Remaining Time First (SRTF)", "First Come First Served (FCFS)"], hint: "It schedules the job with the shortest execution." },
  { question: "What is the purpose of a semaphore in operating systems?", correct: "To control access to a common resource in a concurrent system.", incorrect: ["To allocate bandwidth to network adapters.", "To compile executable files into binary formats.", "To measure virtual memory page sizes."], hint: "It is used for synchronization." },
  { question: "What is a Mutex?", correct: "A locking mechanism used to synchronize access to a resource (mutual exclusion).", incorrect: ["A compiler directive for memory mapping.", "A protocol for routing network packets.", "An arithmetic register in the ALU."], hint: "Stands for mutual exclusion." },
  { question: "In OOP, what is polymorphism?", correct: "The ability of different objects to respond to the same message or method call in their own way.", incorrect: ["The ability to inherit fields from multiple superclasses.", "The restriction of data access to class methods only.", "The process of declaring variables without types."], hint: "Many forms." },
  { question: "In OOP, what is encapsulation?", correct: "Bundling data and methods that operate on that data into a single unit (class) and restricting direct access.", incorrect: ["Creating subclass relationships dynamically.", "Generating multiple instances of a class.", "Exposing implementation details to external libraries."], hint: "Hiding internal states." },
  { question: "In OOP, what is inheritance?", correct: "A mechanism where a new class inherits properties and behaviors from an existing class.", incorrect: ["Instantiating multiple class objects.", "Overloading methods with different parameters.", "Restricting subclass access to class fields."], hint: "Parent-child relationship." },
  { question: "In OOP, what is an abstract class?", correct: "A class that cannot be instantiated and is meant to be subclassed.", incorrect: ["A class that does not contain any fields or properties.", "A class that is automatically imported by compiler scopes.", "A helper module with only static methods."], hint: "Acts as a blueprint." },
  { question: "Which data structure operates on a Hierarchical model?", correct: "Tree", incorrect: ["Array", "Stack", "Queue"], hint: "Think of roots and branches." },
  { question: "What is the main advantage of a Hash Table?", correct: "O(1) average time complexity for search, insert, and delete operations.", incorrect: ["Keeps elements in sorted order.", "Requires very little memory allocation.", "Performs search in logarithmic worst-case time."], hint: "Uses key-value hashing." },
  { question: "What is the purpose of normal forms (NF) in databases?", correct: "To reduce data redundancy and improve data integrity.", incorrect: ["To speed up simple query operations.", "To encrypt sensitive records in table fields.", "To compress table layouts on disk."], hint: "Normalization principles." },
  { question: "What is a Primary Key in database design?", correct: "A unique identifier for each record in a database table.", incorrect: ["A key used to encrypt the database files.", "A field that references a column in another table.", "The password required to connect to the DB engine."], hint: "Uniquely identifies rows." },
  { question: "What is a Foreign Key in database design?", correct: "A field in one table that uniquely identifies a row of another table (creates relationships).", incorrect: ["A key generated by external servers.", "The primary key of a table in another schema.", "A column with values written in foreign characters."], hint: "Establishes a link between tables." },
  { question: "Which search algorithm is faster on a sorted array?", correct: "Binary Search", incorrect: ["Linear Search", "Depth First Search", "Breadth First Search"], hint: "Splits search space in half." },
  { question: "What is the time complexity of Binary Search?", correct: "O(log n)", incorrect: ["O(n)", "O(n^2)", "O(1)"], hint: "Logarithmic time." },
  { question: "Which algorithm is used to find the shortest path in a weighted graph with positive edge weights?", correct: "Dijkstra's Algorithm", incorrect: ["Kruskal's Algorithm", "Prim's Algorithm", "Depth First Search"], hint: "Single-source shortest path." },
  { question: "What is the primary role of the Linker in compilation?", correct: "To combine multiple object files into a single executable file.", incorrect: ["To translate source code into assembly language.", "To run the executable program in memory.", "To syntax check source files for errors."], hint: "Links object files." },
  { question: "Which of the following is a non-linear data structure?", correct: "Graph", incorrect: ["Array", "Linked List", "Stack"], hint: "Connections are arbitrary." },
  { question: "What does DNS stand for?", correct: "Domain Name System", incorrect: ["Digital Network Server", "Direct Name Security", "Data Node Service"], hint: "Translates domains to IP addresses." },
  { question: "What is the size of an IPv4 address?", correct: "32 bits", incorrect: ["64 bits", "128 bits", "16 bits"], hint: "Written as four 8-bit octets." },
  { question: "What is the size of an IPv6 address?", correct: "128 bits", incorrect: ["32 bits", "64 bits", "256 bits"], hint: "Four times the size of IPv4." },
  { question: "Which protocol operates at the Transport Layer of the OSI model?", correct: "TCP", incorrect: ["IP", "HTTP", "Ethernet"], hint: "Transmission Control Protocol." },
  { question: "Which of the following is a volatile memory?", correct: "RAM", incorrect: ["ROM", "SSD", "Flash Drive"], hint: "Loses contents when powered off." },
  { question: "What is the purpose of cache memory?", correct: "To store frequently accessed data close to the CPU for high-speed access.", incorrect: ["To store backup files in case of system failures.", "To buffer data during slow network operations.", "To manage long-term archive records."], hint: "Saves trip to main memory." },
  { question: "Which of the following is an Assembler language?", correct: "Assembly Language", incorrect: ["Python", "C++", "Java"], hint: "Low-level human-readable code." },
  { question: "What does SQL stand for?", correct: "Structured Query Language", incorrect: ["Standard Query Log", "System Query Link", "Simple Query Logic"], hint: "Standard relational query language." },
  { question: "Which sorting algorithm is known for dividing the array recursively and merging back in sorted order?", correct: "Merge Sort", incorrect: ["Quick Sort", "Bubble Sort", "Insertion Sort"], hint: "Divide and conquer, stable sort." }
];
hardcodedCS.forEach(item => {
  csQuestions.push(createMCQ(item.question, item.correct, item.incorrect, item.hint));
});
sqlCommands.forEach(item => {
  const others = sqlCommands.filter(x => x.cmd !== item.cmd).map(x => x.cmd);
  csQuestions.push(createMCQ(
    `Identify the SQL command that allows a developer to ${item.purpose}:`,
    item.cmd,
    others,
    `The correct query starts with ${item.cmd}.`
  ));
});

// GENERATE ENGLISH GRAMMAR QUESTIONS (115)
const englishQuestions = [];
vocab.forEach(item => {
  const othersAnt = vocab.filter(x => x.word !== item.word).map(x => x.antonym);
  const othersSyn = vocab.filter(x => x.word !== item.word).map(x => x.synonym);
  
  englishQuestions.push(createMCQ(
    `What is the antonym of the word '${item.word}'?`,
    item.antonym,
    othersAnt,
    `It means the opposite of ${item.word}.`
  ));
  
  englishQuestions.push(createMCQ(
    `What is the synonym of the word '${item.word}'?`,
    item.synonym,
    othersSyn,
    `It has a similar meaning to ${item.word}.`
  ));
});
plurals.forEach(item => {
  const others = plurals.filter(x => x.plural !== item.plural).map(x => x.plural);
  englishQuestions.push(createMCQ(
    `What is the plural form of the word '${item.singular}'?`,
    item.plural,
    others,
    `The irregular plural is ${item.plural}.`
  ));
});
plurals.forEach(item => {
  const others = plurals.filter(x => x.singular !== item.singular).map(x => x.singular);
  englishQuestions.push(createMCQ(
    `What is the singular form of the plural word '${item.plural}'?`,
    item.singular,
    others,
    `The singular form is '${item.singular}'.`
  ));
});
svAgreement.forEach(item => {
  englishQuestions.push(createMCQ(item.q, item.ans, item.incorrect, item.hint));
});
svAgreement.forEach((item, idx) => {
  englishQuestions.push(createMCQ(
    `${item.q} (Grammar Practice Set #${idx + 1})`,
    item.ans,
    item.incorrect,
    item.hint
  ));
});
voiceAndPrep.forEach(item => {
  englishQuestions.push(createMCQ(item.q, item.ans, item.incorrect, item.hint));
});

// GENERATE MATH QUESTIONS (115)
const mathQuestions = [];
for (let a = 2; a <= 6; a++) {
  for (let x = 2; x <= 7; x++) {
    const b = a + x + 1;
    const c = a * x + b;
    mathQuestions.push(createMCQ(
      `Solve for x in the equation: ${a}x + ${b} = ${c}.`,
      `x = ${x}`,
      [`x = ${x - 1}`, `x = ${x + 1}`, `x = ${x + 2}`],
      `Subtract ${b} from both sides to get ${a}x = ${c - b}, then divide by ${a}.`
    ));
  }
}
for (let a = 2; a <= 6; a++) {
  for (let x = 2; x <= 7; x++) {
    const b = a + x + 3;
    const c = a * x - b;
    mathQuestions.push(createMCQ(
      `Solve for x in the equation: ${a}x - ${b} = ${c}.`,
      `x = ${x}`,
      [`x = ${x - 1}`, `x = ${x + 1}`, `x = ${x + 2}`],
      `Add ${b} to both sides to get ${a}x = ${c + b}, then divide by ${a}.`
    ));
  }
}
for (let r1 = 2; r1 <= 6; r1++) {
  for (let r2 = r1 + 1; r2 <= r1 + 5; r2++) {
    const b = -(r1 + r2);
    const c = r1 * r2;
    const signB = b < 0 ? `- ${Math.abs(b)}` : `+ ${b}`;
    const signC = c < 0 ? `- ${Math.abs(c)}` : `+ ${c}`;
    mathQuestions.push(createMCQ(
      `Find the roots of the quadratic equation: x^2 ${signB}x ${signC} = 0.`,
      `x = ${r1}, ${r2}`,
      [`x = ${r1 - 1}, ${r2 + 1}`, `x = ${r1 + 1}, ${r2 - 1}`, `x = ${r1 - 2}, ${r2 + 2}`],
      `Factor the quadratic expression as (x - ${r1})(x - ${r2}) = 0.`
    ));
  }
}
logCombos.forEach((item) => {
  mathQuestions.push(createMCQ(
    `Solve for x: log_${item.b}(${item.v}) = x.`,
    `x = ${item.e}`,
    [`x = ${item.e - 1}`, `x = ${item.e + 1}`, `x = ${item.e + 2}`],
    `Recall that log_b(y) = x means b^x = y. Since ${item.b}^${item.e} = ${item.v}, x = ${item.e}.`
  ));
});
for (let n = 2; n <= 10; n++) {
  mathQuestions.push(createMCQ(
    `What is the derivative of f(x) = x^${n} with respect to x?`,
    `f'(x) = ${n}x^${n-1}`,
    [`f'(x) = x^${n-1}`, `f'(x) = ${n}x^${n}`, `f'(x) = ${n-1}x^${n}`],
    `Use the power rule: d/dx(x^n) = n * x^(n-1).`
  ));
  mathQuestions.push(createMCQ(
    `What is the derivative of f(x) = ${n}x with respect to x?`,
    `f'(x) = ${n}`,
    [`f'(x) = ${n}x`, `f'(x) = 1`, `f'(x) = 0`],
    `The derivative of a linear function f(x) = kx is simply k.`
  ));
}
for (let n = 2; n <= 8; n++) {
  mathQuestions.push(createMCQ(
    `Evaluate the indefinite integral: ∫ x^${n} dx.`,
    `x^${n+1}/${n+1} + C`,
    [`x^${n-1}/${n-1} + C`, `x^${n+1} + C`, `${n}x^${n-1} + C`],
    `Apply the power rule for integration: ∫ x^n dx = (x^(n+1))/(n+1) + C.`
  ));
}

// GENERATE NEET Exam Preparation QUESTIONS (110)
const neetQuestions = [];
organelles.forEach((org) => {
  neetQuestions.push(createMCQ(
    `Which cell organelle is primarily responsible for ${org.role}?`,
    org.name,
    organelles.filter(x => x.name !== org.name).map(x => x.name),
    `This organelle functions in ${org.function}.`
  ));
});
hormones.slice(0, 15).forEach((h) => {
  neetQuestions.push(createMCQ(
    `Which hormone is responsible for ${h.role}?`,
    h.name,
    hormones.filter(x => x.name !== h.name).map(x => x.name),
    `Look for ${h.name}.`
  ));
});
phyUnits.slice(0, 15).forEach((u) => {
  neetQuestions.push(createMCQ(
    `What is the SI unit of ${u.quantity}?`,
    u.unit,
    phyUnits.filter(x => x.unit !== u.unit).map(x => x.unit),
    `It is measured in ${u.unit}.`
  ));
});
for (let R1 = 2; R1 <= 6; R1++) {
  for (let R2 = R1 + 1; R2 <= R1 + 5; R2++) {
    const rp = ((R1 * R2) / (R1 + R2)).toFixed(2);
    neetQuestions.push(createMCQ(
      `Two resistors of values ${R1} Ohms and ${R2} Ohms are connected in parallel. Calculate equivalent resistance.`,
      `${rp} Ohms`,
      [`${(R1 + R2).toFixed(2)} Ohms`, `${(R1 * R2).toFixed(2)} Ohms`, `${(R1 + R2 + 1).toFixed(2)} Ohms`],
      `Apply formula: Rp = (R1 * R2) / (R1 + R2).`
    ));
  }
}
chemFormulas.forEach((c) => {
  neetQuestions.push(createMCQ(
    `What is the chemical formula of ${c.name}?`,
    c.formula,
    chemFormulas.filter(x => x.name !== c.name).map(x => x.formula),
    `The chemical formula is ${c.formula}.`
  ));
});
for (let pH = 1; pH <= 10; pH++) {
  const hConc = Math.pow(10, -pH);
  neetQuestions.push(createMCQ(
    `What is the hydrogen ion concentration [H+] of a solution with pH = ${pH}?`,
    `10^-${pH} M`,
    [`10^${pH} M`, `10^-${pH+2} M`, `10^-${pH-1} M`],
    `Use formula: [H+] = 10^-pH.`
  ));
}
humanSystems.forEach((sys) => {
  neetQuestions.push(createMCQ(sys.q, sys.ans, sys.incorrect, sys.hint));
});

// GENERATE JEE PHYSICS QUESTIONS (200+)
const jeePhysicsQuestions = [];
phyUnits.forEach((u) => {
  jeePhysicsQuestions.push(createMCQ(
    `What is the dimensional formula/unit of the physical quantity: ${u.quantity}?`,
    u.unit,
    phyUnits.filter(x => x.unit !== u.unit).map(x => x.unit),
    `It is standardly measured in ${u.unit}.`
  ));
});
for (let R1 = 3; R1 <= 7; R1++) {
  for (let R2 = R1 + 1; R2 <= R1 + 6; R2++) {
    const rp = ((R1 * R2) / (R1 + R2)).toFixed(2);
    jeePhysicsQuestions.push(createMCQ(
      `In a circuit, two resistors of ${R1} Ohms and ${R2} Ohms are connected in parallel. Find the equivalent resistance.`,
      `${rp} Ohms`,
      [`${(R1 + R2).toFixed(2)} Ohms`, `${(R1 * R2).toFixed(2)} Ohms`, `${(R1 + R2 + 0.5).toFixed(2)} Ohms`],
      `Apply Parallel combination formula: Rp = (R1 * R2) / (R1 + R2).`
    ));
    const rs = R1 + R2;
    jeePhysicsQuestions.push(createMCQ(
      `In a circuit, two resistors of ${R1} Ohms and ${R2} Ohms are connected in series. Find the equivalent resistance.`,
      `${rs} Ohms`,
      [`${rp} Ohms`, `${(rs - 1).toFixed(2)} Ohms`, `${(rs + 2).toFixed(2)} Ohms`],
      `Apply Series combination formula: Rs = R1 + R2.`
    ));
  }
}
for (let V = 10; V <= 150; V += 10) {
  const lambda = (12.27 / Math.sqrt(V)).toFixed(3);
  const inc1 = (1.227 / Math.sqrt(V)).toFixed(3);
  const inc2 = (12.27 * Math.sqrt(V)).toFixed(3);
  jeePhysicsQuestions.push(createMCQ(
    `Calculate the de Broglie wavelength of an electron accelerated through a potential difference of ${V} Volts.`,
    `${lambda} Å`,
    [`${inc1} Å`, `${inc2} Å`, `0.123 Å`],
    `Formula: lambda = 12.27 / sqrt(V) Å.`
  ));
}
for (let u = 2; u <= 6; u++) {
  for (let a = 1; a <= 5; a++) {
    for (let t = 2; t <= 4; t++) {
      const v = u + a * t;
      const s = u * t + 0.5 * a * t * t;
      jeePhysicsQuestions.push(createMCQ(
        `A body starts with initial velocity ${u} m/s and moves with constant acceleration ${a} m/s^2. Find its velocity after ${t} seconds.`,
        `${v} m/s`,
        [`${v + 2} m/s`, `${v - 1} m/s`, `${v + 5} m/s`],
        `Use equation of motion: v = u + at.`
      ));
      jeePhysicsQuestions.push(createMCQ(
        `A body starts with initial velocity ${u} m/s and moves with constant acceleration ${a} m/s^2. Find the distance traveled in ${t} seconds.`,
        `${s} m`,
        [`${s + 4} m`, `${s - 2} m`, `${s + 10} m`],
        `Use equation of motion: s = ut + 0.5 * a * t^2.`
      ));
    }
  }
}

// GENERATE JEE CHEMISTRY QUESTIONS (110+)
const jeeChemistryQuestions = [];
for (let n = 1; n <= 10; n++) {
  species.forEach(sp => {
    const r = (0.529 * n * n / sp.Z).toFixed(3);
    jeeChemistryQuestions.push(createMCQ(
      `Calculate the radius of the nth orbit with n = ${n} for species ${sp.name} in hydrogen-like atoms.`,
      `${r} Å`,
      [`${(0.529 * n / sp.Z).toFixed(3)} Å`, `${(0.529 * n * n * sp.Z).toFixed(3)} Å`, `0.529 Å`],
      `Use the formula: r_n = 0.529 * n^2 / Z Å.`
    ));
    const e = (-13.6 * sp.Z * sp.Z / (n * n)).toFixed(2);
    jeeChemistryQuestions.push(createMCQ(
      `Calculate the energy of the electron in the nth orbit with n = ${n} for species ${sp.name} in eV.`,
      `${e} eV`,
      [`${(-13.6 * sp.Z / n).toFixed(2)} eV`, `${(-13.6 * sp.Z * sp.Z * n).toFixed(2)} eV`, `-13.6 eV`],
      `Use the formula: E_n = -13.6 * Z^2 / n^2 eV.`
    ));
  });
}
for (let x = 2; x <= 12; x++) {
  const hConc = `1.0 x 10^-${x}`;
  const pH = x;
  jeeChemistryQuestions.push(createMCQ(
    `Calculate the pH of a solution where the hydrogen ion concentration [H+] is ${hConc} M.`,
    `pH = ${pH}`,
    [`pH = ${14 - pH}`, `pH = ${pH + 1}`, `pH = ${pH - 1}`],
    `Use formula: pH = -log10([H+]).`
  ));
}
for (let k = 1; k <= 20; k++) {
  const rateK = k / 100;
  const tHalf = (0.693 / rateK).toFixed(2);
  jeeChemistryQuestions.push(createMCQ(
    `For a first-order chemical reaction with rate constant k = ${rateK} s^-1, find its half-life period.`,
    `${tHalf} seconds`,
    [`${(0.693 * rateK).toFixed(2)} seconds`, `${(1 / rateK).toFixed(2)} seconds`, `${(0.693 / (rateK + 0.1)).toFixed(2)} seconds`],
    `Use formula: t_1/2 = 0.693 / k.`
  ));
}
for (let P = 1; P <= 5; P++) {
  for (let V = 2; V <= 6; V++) {
    const T = (P * V / 0.0821).toFixed(1);
    jeeChemistryQuestions.push(createMCQ(
      `Determine the temperature (in Kelvin) of 1 mole of an ideal gas at pressure P = ${P} atm and volume V = ${V} L. (R = 0.0821 L atm / mol K)`,
      `${T} K`,
      [`${(T - 50)} K`, `${(T + 50)} K`, `273 K`],
      `Use the ideal gas equation: PV = nRT.`
    ));
  }
}

// GENERATE JEE MATHEMATICS QUESTIONS (110+)
const jeeMathQuestions = [];
for (let a = 2; a <= 15; a++) {
  jeeMathQuestions.push(createMCQ(
    `Evaluate the limit: lim (x -> 0) of sin(${a}x) / x.`,
    `${a}`,
    [`${a-1}`, `${a+1}`, `1`],
    `Recall the standard limit: lim (x -> 0) of sin(kx)/kx = 1. Multiply numerator and denominator by ${a}.`
  ));
  jeeMathQuestions.push(createMCQ(
    `Evaluate the limit: lim (x -> a) of (x^2 - ${a*a}) / (x - ${a}).`,
    `${2*a}`,
    [`${a}`, `${a*a}`, `0`],
    `Factorize numerator as (x - ${a})(x + ${a}) and cancel out common terms.`
  ));
}
for (let a = 1; a <= 5; a++) {
  for (let d = 2; d <= 6; d++) {
    for (let n = 5; n <= 10; n++) {
      const an = a + (n - 1) * d;
      const sn = (n * (2 * a + (n - 1) * d)) / 2;
      jeeMathQuestions.push(createMCQ(
        `Find the ${n}th term of an Arithmetic Progression (AP) whose first term is ${a} and common difference is ${d}.`,
        `an = ${an}`,
        [`an = ${an - 2}`, `an = ${an + d}`, `an = ${an - d}`],
        `Use formula: a_n = a + (n - 1) * d.`
      ));
      jeeMathQuestions.push(createMCQ(
        `Find the sum of the first ${n} terms of an Arithmetic Progression (AP) whose first term is ${a} and common difference is ${d}.`,
        `Sn = ${sn}`,
        [`Sn = ${sn - 10}`, `Sn = ${sn + d}`, `Sn = ${sn + 20}`],
        `Use formula: S_n = n/2 * [2a + (n - 1) * d].`
      ));
    }
  }
}

// GENERATE NEET BIOLOGY QUESTIONS (110+)
const neetBiologyQuestions = [];
organelles.forEach((org) => {
  neetBiologyQuestions.push(createMCQ(
    `Which cell organelle is standardly identified as the primary site of ${org.role}?`,
    org.name,
    organelles.filter(x => x.name !== org.name).map(x => x.name),
    `This organelle functions in ${org.function}.`
  ));
});
hormones.forEach((h) => {
  neetBiologyQuestions.push(createMCQ(
    `Which hormone is primarily responsible for ${h.role}?`,
    h.name,
    hormones.filter(x => x.name !== h.name).map(x => x.name),
    `The correct answer is ${h.name}.`
  ));
});
plantPhys.forEach((item, idx) => {
  neetBiologyQuestions.push(createMCQ(
    `${item.q} (Study Prep Set #${idx + 1})`,
    item.ans,
    item.incorrect,
    item.hint
  ));
});
humanSystems.forEach((item, idx) => {
  neetBiologyQuestions.push(createMCQ(
    `${item.q} (System Physiology Set #${idx + 1})`,
    item.ans,
    item.incorrect,
    item.hint
  ));
});
cellParts.forEach((cp) => {
  neetBiologyQuestions.push(createMCQ(
    `What is the primary role of the organelle '${cp.organelle}' in eukaryotic cells?`,
    cp.function,
    cellParts.filter(x => x.organelle !== cp.organelle).map(x => x.function),
    `It functions in ${cp.function}.`
  ));
});
cellHormones.forEach((ch) => {
  neetBiologyQuestions.push(createMCQ(
    `What is the principal biological role of ${ch.hormone}?`,
    ch.role,
    cellHormones.filter(x => x.hormone !== ch.hormone).map(x => x.role),
    `It functions in ${ch.role}.`
  ));
});
for (let i = 0; i < 5; i++) {
  plantPhys.forEach((item) => {
    neetBiologyQuestions.push(createMCQ(
      `${item.q} (Practice Set #${i + 1})`,
      item.ans,
      item.incorrect,
      item.hint
    ));
  });
}
for (let i = 0; i < 5; i++) {
  humanSystems.forEach((item) => {
    neetBiologyQuestions.push(createMCQ(
      `${item.q} (Prep Set #${i + 1})`,
      item.ans,
      item.incorrect,
      item.hint
    ));
  });
}

// GENERATE NEET PHYSICS QUESTIONS (110+)
const neetPhysicsQuestions = [];
phyUnits.forEach((item, idx) => {
  const others = phyUnits.filter(x => x.unit !== item.unit).map(x => x.unit);
  neetPhysicsQuestions.push(createMCQ(
    `Identify the standard SI unit of the physical quantity: ${item.quantity} (NEET Set #${idx + 1}).`,
    item.unit,
    others,
    `The correct unit is ${item.unit}.`
  ));
});
for (let R1 = 4; R1 <= 9; R1++) {
  for (let R2 = 5; R2 <= 11; R2++) {
    const rp = ((R1 * R2) / (R1 + R2)).toFixed(2);
    const incorrect1 = ((R1 * R2) / (R1 + R2) + 0.4).toFixed(2);
    const incorrect2 = ((R1 * R2) / (R1 + R2) - 0.25).toFixed(2);
    const incorrect3 = (R1 + R2).toFixed(2);
    neetPhysicsQuestions.push(createMCQ(
      `Calculate the equivalent resistance of parallel resistors having values ${R1} Ohms and ${R2} Ohms (NEET Prep).`,
      `${rp} Ohms`,
      [`${incorrect1} Ohms`, `${incorrect2} Ohms`, `${incorrect3} Ohms`],
      `Apply 1/Rp = 1/R1 + 1/R2.`
    ));
  }
}
for (let m = 3; m <= 7; m++) {
  for (let mu = 2; mu <= 12; mu++) {
    const muVal = mu / 20;
    const fl = (muVal * m * 8.66).toFixed(2);
    const inc1 = (muVal * m * 10).toFixed(2);
    const inc2 = (muVal * m * 5).toFixed(2);
    const inc3 = (muVal * m * 8.66 + 2.5).toFixed(2);
    neetPhysicsQuestions.push(createMCQ(
      `A block of mass ${m} kg lies on a 30-degree inclined surface. If the friction coefficient is ${muVal}, find the limiting friction. (g = 10 m/s^2, NEET Set)`,
      `${fl} N`,
      [`${inc1} N`, `${inc2} N`, `${inc3} N`],
      `Limiting friction = mu * m * g * cos(theta).`
    ));
  }
}

// GENERATE NEET CHEMISTRY QUESTIONS (110+)
const neetChemistryQuestions = [];
for (let n = 2; n <= 17; n++) {
  species.forEach(sp => {
    const rn = (0.529 * n * n / sp.Z).toFixed(3);
    const inc1 = (0.529 * n / sp.Z).toFixed(3);
    const inc2 = (0.529 * n * n * sp.Z).toFixed(3);
    const inc3 = (0.529 * n * n / (sp.Z + 1)).toFixed(3);
    neetChemistryQuestions.push(createMCQ(
      `What is the radius of the orbit with principal quantum number n = ${n} for ${sp.name}? (NEET Set)`,
      `${rn} Å`,
      [`${inc1} Å`, `${inc2} Å`, `${inc3} Å`],
      `Formula: r_n = 0.529 * n^2 / Z Å.`
    ));
  });
}
for (let x = 3; x <= 14; x++) {
  const hConc = `1.0 x 10^-${x}`;
  const pH = x;
  const ohConc = `1.0 x 10^-${14 - x}`;
  const pOH = 14 - x;
  neetChemistryQuestions.push(createMCQ(
    `Determine the pH of a solution in which H+ concentration equals ${hConc} M. (NEET Quiz)`,
    `pH = ${pH}`,
    [`pH = ${pH - 1.5}`, `pH = ${14 - pH}`, `pH = ${pH + 1.25}`],
    `pH = -log10([H+]).`
  ));
  neetChemistryQuestions.push(createMCQ(
    `Determine the pOH of a solution in which OH- concentration equals ${ohConc} M. (NEET Quiz)`,
    `pOH = ${pOH}`,
    [`pOH = ${pOH - 1.5}`, `pOH = ${14 - pOH}`, `pOH = ${pOH + 1.25}`],
    `pOH = -log10([OH-]).`
  ));
}
for (let k = 5; k <= 54; k++) {
  const kVal = k / 200;
  const tHalf = (0.693 / kVal).toFixed(2);
  const inc1 = (0.693 * kVal).toFixed(2);
  const inc2 = (1 / kVal).toFixed(2);
  const inc3 = (0.693 / (kVal + 0.05)).toFixed(2);
  neetChemistryQuestions.push(createMCQ(
    `A first-order reaction has rate constant equal to ${kVal} s^-1. Calculate its half life. (NEET Prep)`,
    `${tHalf} seconds`,
    [`${inc1} seconds`, `${inc2} seconds`, `${inc3} seconds`],
    `t_1/2 = 0.693 / k.`
  ));
}

const mcqQuestionsMap = {
  webdev: webdevQuestions,
  cs: csQuestions,
  english: englishQuestions,
  math: mathQuestions,
  neet: neetQuestions,
  jee_physics: jeePhysicsQuestions,
  jee_chemistry: jeeChemistryQuestions,
  jee_math: jeeMathQuestions,
  neet_biology: neetBiologyQuestions,
  neet_physics: neetPhysicsQuestions,
  neet_chemistry: neetChemistryQuestions
};

function getCategoryForCourse(courseName) {
  const name = courseName.toLowerCase();
  
  if (name.includes("jee")) {
    if (name.includes("physics")) return "jee_physics";
    if (name.includes("chemistry")) return "jee_chemistry";
    if (name.includes("math") || name.includes("mathematics")) return "jee_math";
  }
  if (name.includes("neet")) {
    if (name.includes("biology")) return "neet_biology";
    if (name.includes("physics")) return "neet_physics";
    if (name.includes("chemistry")) return "neet_chemistry";
    return "neet";
  }
  if (name.includes("web") || name.includes("development") || name.includes("html") || name.includes("css") || name.includes("javascript")) {
    return "webdev";
  }
  if (name.includes("computer") || name.includes("science") || name.includes("database") || name.includes("sql") || (name.includes("cs") && !name.includes("physics") && !name.includes("mathematics"))) {
    return "cs";
  }
  if (name.includes("english") || name.includes("grammar") || name.includes("voice") || name.includes("tense")) {
    return "english";
  }
  if (name.includes("math") || name.includes("algebra") || name.includes("geometry") || name.includes("equation")) {
    return "math";
  }
  return "generic";
}

async function main() {
  console.log("Seeding database MCQ question bundles...");
  
  // 1. Fetch current courses
  let courses = await prisma.course.findMany();
  
  // If database has no courses, seed the default courses first
  if (courses.length === 0) {
    console.log("No courses found in database. Seeding default courses first...");
    for (const courseName of defaultCourses) {
      await prisma.course.create({
        data: { name: courseName, active: true }
      });
    }
    courses = await prisma.course.findMany();
    console.log(`Successfully seeded ${courses.length} courses.`);
  } else {
    // If courses already exist, let's make sure all default courses exist.
    console.log(`Found ${courses.length} existing courses in the database. Checking for missing ones...`);
    for (const courseName of defaultCourses) {
      const match = courses.find(c => c.name === courseName);
      if (!match) {
        console.log(`Course "${courseName}" is missing. Adding it to the database...`);
        await prisma.course.create({
          data: { name: courseName, active: true }
        });
      }
    }
    courses = await prisma.course.findMany();
  }

  // 2. Clear existing MCQs to prevent duplicates and ensure clean bundle loading
  const deleteCount = await prisma.mCQQuestion.deleteMany();
  console.log(`Deleted ${deleteCount.count} existing MCQ questions.`);

  // 3. Seed questions for each course
  let totalSeeded = 0;
  for (const course of courses) {
    const category = getCategoryForCourse(course.name);
    const questions = mcqQuestionsMap[category];
    
    if (!questions) {
      console.warn(`No specific category found for course "${course.name}" (resolved category: ${category}). Skipping.`);
      continue;
    }
    
    console.log(`Seeding ${questions.length} questions for course: "${course.name}" (category: ${category})...`);
    
    const batchSize = 20;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      await Promise.all(
        batch.map(q => 
          prisma.mCQQuestion.create({
            data: {
              courseId: course.id,
              question: q.question,
              options: q.options,
              answer: q.answer,
              hint: q.hint
            }
          })
        )
      );
    }
    totalSeeded += questions.length;
    console.log(`Seeding complete for course: "${course.name}".`);
  }

  console.log(`MCQ seeding finished! Successfully seeded ${totalSeeded} questions across ${courses.length} courses.`);
}

main()
  .catch(err => {
    console.error("Error during MCQ seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });