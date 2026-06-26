const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/flarelap_foundation?schema=public";
console.log('Connecting to database:', dbUrl);

const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");
let adapter;

if (isLocal) {
  const pool = new Pool({ connectionString: dbUrl, ssl: false });
  adapter = new PrismaPg(pool);
} else {
  adapter = new PrismaNeon({ connectionString: dbUrl });
}

const prisma = new PrismaClient({ adapter });

const categoryCourses = [
  {
    name: 'SSC CGL Tier 1 Mock Test 2026',
    mcqs: [
      { question: 'Who among the following wrote the book "Hind Swaraj"?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Subhas Chandra Bose', 'Bal Gangadhar Tilak'], answer: 0, hint: 'Hind Swaraj or Indian Home Rule is a book written by Mohandas K. Gandhi in 1909.' },
      { question: 'Which article of the Indian Constitution is related to the Equality before law?', options: ['Article 14', 'Article 15', 'Article 16', 'Article 17'], answer: 0, hint: 'Article 14 of the Constitution of India provides for equality before law or the equal protection of the laws.' },
      { question: 'The value of cos 0° + sin 90° is:', options: ['0', '1', '2', '0.5'], answer: 2, hint: 'cos 0° = 1 and sin 90° = 1. Therefore, 1 + 1 = 2.' },
      { question: 'Which is the largest gland in the human body?', options: ['Thyroid', 'Liver', 'Pancreas', 'Pituitary'], answer: 1, hint: 'The liver is the largest gland in the human body.' },
      { question: 'In which year did the Battle of Plassey take place?', options: ['1757', '1764', '1789', '1857'], answer: 0, hint: 'The Battle of Plassey was fought on June 23, 1757.' },
      { question: 'Who was the first Governor-General of Bengal?', options: ['Robert Clive', 'Warren Hastings', 'Lord William Bentinck', 'Lord Cornwallis'], answer: 1, hint: 'Warren Hastings became the first Governor-General of Bengal in 1773.' },
      { question: 'What is the SI unit of pressure?', options: ['Newton', 'Joule', 'Pascal', 'Watt'], answer: 2, hint: 'Pascal (Pa) is the SI unit of pressure, equivalent to one newton per square meter.' },
      { question: 'Which acid is primarily present in vinegar?', options: ['Citric acid', 'Acetic acid', 'Lactic acid', 'Tartaric acid'], answer: 1, hint: 'Vinegar is a liquid consisting of about 5–20% acetic acid.' },
      { question: 'Sound waves cannot travel through which of the following media?', options: ['Solids', 'Liquids', 'Gases', 'Vacuum'], answer: 3, hint: 'Sound is a mechanical wave and requires a physical medium to propagate; it cannot travel through a vacuum.' },
      { question: 'What is the official currency of Japan?', options: ['Yuan', 'Yen', 'Won', 'Ringgit'], answer: 1, hint: 'The Yen is the official currency of Japan.' },
      { question: 'Fundamental Duties were added to the Indian Constitution by which amendment?', options: ['42nd Amendment', '44th Amendment', '86th Amendment', '52nd Amendment'], answer: 0, hint: 'Fundamental Duties were incorporated into Part IV-A by the 42nd Constitutional Amendment Act of 1976.' },
      { question: 'On which date is World Environment Day celebrated globally?', options: ['April 22', 'June 5', 'September 16', 'December 10'], answer: 1, hint: 'World Environment Day is celebrated annually on June 5 to raise global awareness of environmental issues.' },
      { question: 'The deficiency of Vitamin C in the human body leads to which disease?', options: ['Rickets', 'Beriberi', 'Scurvy', 'Night blindness'], answer: 2, hint: 'Scurvy is caused by a lack of Vitamin C (ascorbic acid) in the diet.' },
      { question: 'What is the capital city of Australia?', options: ['Sydney', 'Melbourne', 'Brisbane', 'Canberra'], answer: 3, hint: 'Canberra is the federal capital of Australia.' },
      { question: 'What is the compound interest on Rs 1,000 for 2 years at 10% per annum?', options: ['Rs 100', 'Rs 200', 'Rs 210', 'Rs 220'], answer: 2, hint: 'A = P(1 + r/100)^t = 1000 * (1.1)^2 = 1210. CI = 1210 - 1000 = Rs 210.' }
    ]
  },
  {
    name: 'GATE CS & IT Mock Exam',
    mcqs: [
      { question: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, hint: 'A balanced BST has a height of O(log n), so searching takes O(log n) time.' },
      { question: 'Which layer in the OSI model is responsible for routing packets?', options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'], answer: 2, hint: 'The Network Layer is responsible for routing packets across network boundaries.' },
      { question: 'Which of the following is not a transaction property in DBMS?', options: ['Atomicity', 'Consistency', 'Isolation', 'Concurrency'], answer: 3, hint: 'The ACID properties are Atomicity, Consistency, Isolation, and Durability.' },
      { question: 'What is the binary equivalent of decimal number 25?', options: ['11001', '11010', '10101', '11100'], answer: 0, hint: '25 in binary is 16 + 8 + 1, which corresponds to 11001.' },
      { question: 'Which scheduling algorithm can result in starvation?', options: ['First Come First Served', 'Round Robin', 'Shortest Job First', 'None of these'], answer: 2, hint: 'Shortest Job First can starve longer jobs if short jobs keep arriving.' },
      { question: 'A page fault occurs when:', options: ['The page is in main memory', 'The page is not in main memory', 'An error occurs in page table', 'The page is corrupted'], answer: 1, hint: 'A page fault occurs when an active program requests a memory page that is not currently loaded in the RAM.' },
      { question: 'Which logic gate is equivalent to Boolean multiplication?', options: ['OR gate', 'AND gate', 'NOT gate', 'XOR gate'], answer: 1, hint: 'The AND gate performs Boolean multiplication (Y = A . B).' },
      { question: 'How many states are required in a minimal DFA that accepts all binary strings of even length?', options: ['1', '2', '3', '4'], answer: 1, hint: 'A minimal DFA requires 2 states: an accepting state for even length and a non-accepting state for odd length.' },
      { question: 'Which SQL command is used to remove a table structure along with its data?', options: ['DELETE', 'TRUNCATE', 'REMOVE', 'DROP'], answer: 3, hint: 'DROP TABLE removes the table definition and all its rows, indices, and constraints.' },
      { question: 'What is the default TCP port number for HTTP?', options: ['21', '22', '80', '443'], answer: 2, hint: 'HTTP defaults to port 80, while HTTPS uses port 443.' },
      { question: 'Which protocol translates a logical IP address into a physical MAC address?', options: ['DNS', 'DHCP', 'ARP', 'ICMP'], answer: 2, hint: 'ARP (Address Resolution Protocol) maps dynamic IP addresses to physical hardware MAC addresses on a local network.' },
      { question: 'Which of the following is NOT a linear data structure?', options: ['Stack', 'Queue', 'Linked List', 'Tree'], answer: 3, hint: 'Trees and Graphs are non-linear hierarchical data structures.' },
      { question: 'What is the postfix expression of the infix string: A + B?', options: ['+AB', 'AB+', 'A+B', 'None of these'], answer: 1, hint: 'The postfix notation places operators after their operands (AB+).' },
      { question: 'Virtual memory is primarily based on which hardware/software concept?', options: ['Paging', 'Spooling', 'Caching', 'Segmentation only'], answer: 0, hint: 'Virtual memory is commonly implemented using demand paging.' },
      { question: 'Which sorting algorithm has a best-case time complexity of O(n log n) and is non-recursive?', options: ['Quick Sort', 'Bubble Sort', 'Insertion Sort', 'Merge Sort'], answer: 3, hint: 'Merge Sort uses a divide-and-conquer strategy guaranteeing O(n log n) comparisons in all cases.' }
    ]
  },
  {
    name: 'SEBI Grade A Officer Practice Mock',
    mcqs: [
      { question: 'Who is the current regulator of the securities market in India?', options: ['RBI', 'SEBI', 'IRDAI', 'PFRDA'], answer: 1, hint: 'SEBI (Securities and Exchange Board of India) regulates the securities market in India.' },
      { question: 'What does "IPO" stand for in financial markets?', options: ['Initial Public Offering', 'Internal Profit Option', 'International Payment Order', 'None of these'], answer: 0, hint: 'IPO stands for Initial Public Offering, which is when a company first sells shares to the public.' },
      { question: 'What is the primary function of a commercial bank?', options: ['Issuing currency', 'Accepting deposits and lending money', 'Regulating stock exchange', 'Formulating monetary policy'], answer: 1, hint: 'Commercial banks accept deposits from the public and use them to extend loans.' },
      { question: 'Inflation in India is primarily measured by which index?', options: ['WPI', 'CPI', 'GDP Deflator', 'IIB'], answer: 1, hint: 'The Consumer Price Index (CPI) is the primary measure of inflation in India.' },
      { question: 'What is the full form of GDP?', options: ['Gross Domestic Product', 'Gross Demand Profit', 'General Deposit Policy', 'Gross Development Plan'], answer: 0, hint: 'GDP stands for Gross Domestic Product.' },
      { question: 'Which government authority formulates the Fiscal Policy in India?', options: ['Reserve Bank of India', 'Ministry of Finance', 'NITI Aayog', 'Securities and Exchange Board of India'], answer: 1, hint: 'The Ministry of Finance formulates the Fiscal Policy of the country.' },
      { question: 'What does SLR stand for in banking terms?', options: ['Statutory Liquidity Ratio', 'Standard Lending Rate', 'Secured Loan Reserve', 'None of these'], answer: 0, hint: 'SLR stands for Statutory Liquidity Ratio, a minimum percentage of deposits banks must keep in liquid assets.' },
      { question: 'Which was the first development financial institution established in India?', options: ['IDBI', 'ICICI', 'IFCI', 'SIDBI'], answer: 2, hint: 'IFCI (Industrial Finance Corporation of India) was established in 1948.' },
      { question: 'Treasury Bills (T-Bills) in India are issued by whom?', options: ['Commercial Banks', 'State Governments', 'Reserve Bank of India', 'SEBI'], answer: 2, hint: 'The RBI issues T-bills on behalf of the Central Government to meet short-term funding needs.' },
      { question: 'Where is the head office of SEBI located?', options: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'], answer: 1, hint: 'The head office of SEBI is located at Bandra Kurla Complex (BKC) in Mumbai.' },
      { question: 'What is the full form of FDI?', options: ['Foreign Direct Investment', 'Federal Deposit Institution', 'Financial Debt Instrument', 'Foreign Dividend Income'], answer: 0, hint: 'FDI stands for Foreign Direct Investment.' },
      { question: 'Which act replaced the Foreign Exchange Regulation Act (FERA) in India?', options: ['FEMA', 'FRBM', 'SARFAESI', 'PMLA'], answer: 0, hint: 'FEMA (Foreign Exchange Management Act) replaced FERA in 1999.' },
      { question: 'Which of the following is the central bank of India?', options: ['State Bank of India', 'Punjab National Bank', 'Reserve Bank of India', 'Union Bank of India'], answer: 2, hint: 'The Reserve Bank of India (RBI) is India\'s central banking institution.' },
      { question: 'The Financial Year in India runs from:', options: ['January 1 to December 31', 'April 1 to March 31', 'July 1 to June 30', 'October 1 to September 30'], answer: 1, hint: 'The Indian financial year begins on April 1 and ends on March 31 of the next calendar year.' },
      { question: 'In which year was the Goods and Services Tax (GST) implemented in India?', options: ['2015', '2016', '2017', '2018'], answer: 2, hint: 'GST was implemented in India on July 1, 2017.' }
    ]
  },
  {
    name: 'CTET Paper 1 Child Pedagogy',
    mcqs: [
      { question: 'Who formulated the Theory of Multiple Intelligences?', options: ['Jean Piaget', 'Howard Gardner', 'Lev Vygotsky', 'B.F. Skinner'], answer: 1, hint: 'Howard Gardner proposed the Theory of Multiple Intelligences in 1983.' },
      { question: 'According to Piaget, the stage of cognitive development for age 2-7 is:', options: ['Sensori-motor', 'Pre-operational', 'Concrete operational', 'Formal operational'], answer: 1, hint: 'The Pre-operational stage lasts from age 2 to approximately 7.' },
      { question: 'What is the primary factor in Lev Vygotsky\'s theory of learning?', options: ['Social interaction', 'Reinforcement', 'Equilibrium', 'Adaptation'], answer: 0, hint: 'Vygotsky\'s sociocultural theory emphasizes social interaction in cognitive development.' },
      { question: 'Dyslexia is primarily associated with difficulty in:', options: ['Writing', 'Reading', 'Speaking', 'Calculating'], answer: 1, hint: 'Dyslexia is a learning disability characterized by difficulty in reading.' },
      { question: 'Inclusive Education refers to:', options: ['Providing education to disabled children only', 'Including all children regardless of background in the same school', 'Special classrooms for intelligent students', 'None of these'], answer: 1, hint: 'Inclusive education means all students, regardless of challenges, are placed in age-appropriate general education classes.' },
      { question: 'Which psychologist is associated with Operant Conditioning?', options: ['Ivan Pavlov', 'B.F. Skinner', 'Albert Bandura', 'Edward Thorndike'], answer: 1, hint: 'B.F. Skinner developed the theory of operant conditioning using rewards and punishments.' },
      { question: 'What is the correct formula to calculate Intelligence Quotient (IQ)?', options: ['Mental Age / Chronological Age * 100', 'Chronological Age / Mental Age * 100', 'Mental Age + Chronological Age', 'None of these'], answer: 0, hint: 'IQ = (MA / CA) * 100.' },
      { question: 'The concept of "scaffolding" in learning was proposed by which theorist?', options: ['Jean Piaget', 'Lev Vygotsky', 'Jerome Bruner', 'Lawrence Kohlberg'], answer: 1, hint: 'While Jerome Bruner coined the term, it is heavily linked to Lev Vygotsky\'s Zone of Proximal Development (ZPD).' },
      { question: 'Who proposed the "Trial and Error" theory of learning?', options: ['Edward Thorndike', 'Wolfgang Kohler', 'Clark Hull', 'Kurt Lewin'], answer: 0, hint: 'Edward Thorndike proposed the Connectionism theory based on trial and error learning.' },
      { question: 'The sequence of motor development is from:', options: ['Proximodistal to Cephalocaudal', 'Cephalocaudal to Proximodistal', 'General to Specific', 'Specific to General'], answer: 1, hint: 'Development goes from head-to-toe (cephalocaudal) and center-outwards (proximodistal).' },
      { question: 'Which term is associated with Noam Chomsky\'s theory of language acquisition?', options: ['Language Acquisition Device', 'Imitative learning', 'Reinforcement', 'Conditioning'], answer: 0, hint: 'Chomsky proposed that children are born with an innate Language Acquisition Device (LAD).' },
      { question: 'Lawrence Kohlberg is known for his research in which development domain?', options: ['Moral Development', 'Cognitive Development', 'Physical Development', 'Social Development'], answer: 0, hint: 'Kohlberg formulated the stages of Moral Development.' },
      { question: 'What is the total duration of the micro-teaching cycle in India?', options: ['30 minutes', '36 minutes', '40 minutes', '45 minutes'], answer: 1, hint: 'The standard NCERT micro-teaching cycle duration in India is 36 minutes.' },
      { question: 'In which year was the Right to Education (RTE) Act enacted by the Indian Parliament?', options: ['2005', '2009', '2010', '2012'], answer: 1, hint: 'The RTE Act was enacted on August 4, 2009, making education a fundamental right for children aged 6 to 14.' },
      { question: 'The project method of teaching is based on which educational philosophy?', options: ['Realism', 'Pragmatism', 'Naturalism', 'Idealism'], answer: 1, hint: 'The project method is founded on John Dewey\'s pragmatic learning-by-doing principles.' }
    ]
  },
  {
    name: 'ITI Fitter Theory Semester 1 & 2',
    mcqs: [
      { question: 'Which instrument is used to check the flatness of a surface?', options: ['Vernier Caliper', 'Micrometer', 'Try Square', 'Divider'], answer: 2, hint: 'A Try Square is used to check the squareness and flatness of surfaces.' },
      { question: 'What is the unit of pitch of a thread?', options: ['mm', 'cm', 'inches', 'degrees'], answer: 0, hint: 'Pitch is measured in mm in metric threads.' },
      { question: 'Which file is used for filing wood?', options: ['Bastard file', 'Rasps cut file', 'Smooth file', 'Dead smooth file'], answer: 1, hint: 'A rasps cut file is designed for woodworking and filing soft materials.' },
      { question: 'What is the least count of a standard Vernier Caliper?', options: ['0.02 mm', '0.01 mm', '0.05 mm', '0.1 mm'], answer: 0, hint: 'Standard metric Vernier Calipers have a least count of 0.02 mm.' },
      { question: 'Which metal is used to make hammer heads?', options: ['High Carbon Steel', 'Cast Iron', 'Copper', 'Aluminium'], answer: 0, hint: 'Hammer heads are typically made of forged high carbon steel.' },
      { question: 'What is the angle of a center punch?', options: ['30 degrees', '60 degrees', '90 degrees', '120 degrees'], answer: 2, hint: 'A center punch has a point angle of 90 degrees to make deep marks for drilling.' },
      { question: 'Which is the safest method to lift heavy loads in a workshop?', options: ['Manual lifting by back', 'Using hoists or cranes', 'Sliding on floor', 'None of these'], answer: 1, hint: 'Using hoists, cranes, or jacks is the safest way to move heavy machinery/loads.' },
      { question: 'What is the least count of an outside micrometer?', options: ['0.01 mm', '0.02 mm', '0.05 mm', '0.1 mm'], answer: 0, hint: 'A metric outside micrometer has a standard least count of 0.01 mm.' },
      { question: 'How is the size of a bench vice specified?', options: ['Weight of vice', 'Width of the jaw', 'Length of spindle', 'Max opening of jaw'], answer: 1, hint: 'A bench vice size is specified by the width of its jaws.' },
      { question: 'Which material is used to manufacture hacksaw blades?', options: ['Mild Steel', 'Cast Iron', 'High Speed Steel', 'Brass'], answer: 2, hint: 'Hacksaw blades are typically made of High Speed Steel (HSS) or High Carbon Steel.' },
      { question: 'Which coolant is recommended for drilling cast iron?', options: ['Soluble oil', 'Kerosene', 'Lard oil', 'Dry/Air blast'], answer: 3, hint: 'Cast iron is drilled dry because its graphite acts as a self-lubricant and oil creates sticky chips.' },
      { question: 'What is the pitch of a standard hacksaw blade for general purpose sheet cutting?', options: ['0.8 mm', '1.0 mm', '1.4 mm', '1.8 mm'], answer: 3, hint: 'A pitch of 1.8 mm (14 TPI) is standard for general workshop steel and sheet metal cutting.' },
      { question: 'Which type of thread is provided on the lead screw of a lathe machine?', options: ['V-thread', 'Square thread', 'Acme thread', 'Buttress thread'], answer: 2, hint: 'Acme threads (29-degree angle) are provided on lead screws for power transmission.' },
      { question: 'Which caliper is used to draw lines parallel to the outer edges of a workpiece?', options: ['Inside caliper', 'Outside caliper', 'Jenny caliper', 'Divider caliper'], answer: 2, hint: 'Jenny calipers (hermaphrodite calipers) have one bent leg to locate edges and draw parallel layout lines.' },
      { question: 'Which heat treatment process is used to increase the wear resistance of steel tools?', options: ['Annealing', 'Normalizing', 'Tempering', 'Hardening'], answer: 3, hint: 'Hardening increases the hardness and wear resistance of steel carbon tools.' }
    ]
  },
  {
    name: 'ITI Electrician Basic Theory 2026',
    mcqs: [
      { question: 'What is the unit of electrical resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], answer: 2, hint: 'Ohm is the SI unit of electrical resistance.' },
      { question: 'According to Ohm\'s Law, current (I) is equal to:', options: ['V * R', 'V / R', 'R / V', 'V + R'], answer: 1, hint: 'I = V / R, where V is voltage and R is resistance.' },
      { question: 'Which instrument is used to measure electric current?', options: ['Voltmeter', 'Ammeter', 'Galvanometer', 'Multimeter'], answer: 1, hint: 'An ammeter is used to measure electric current.' },
      { question: 'Which of the following is an insulator?', options: ['Copper', 'Aluminium', 'Rubber', 'Iron'], answer: 2, hint: 'Rubber is an insulator, meaning it does not conduct electricity.' },
      { question: 'What is the standard household AC frequency in India?', options: ['50 Hz', '60 Hz', '100 Hz', '120 Hz'], answer: 0, hint: 'India uses a standard grid frequency of 50 Hz.' },
      { question: 'Which acid is used as an electrolyte in a lead-acid battery?', options: ['Hydrochloric acid', 'Nitric acid', 'Sulphuric acid', 'Acetic acid'], answer: 2, hint: 'Dilute Sulphuric Acid (H2SO4) is used as an electrolyte in lead-acid accumulator cells.' },
      { question: 'Which device is used to convert AC voltage to DC voltage?', options: ['Inverter', 'Transformer', 'Rectifier', 'Alternator'], answer: 2, hint: 'A rectifier converts Alternating Current (AC) into Direct Current (DC).' },
      { question: 'A transformer works on which type of electrical supply?', options: ['DC only', 'AC only', 'Both AC and DC', 'Pulsating DC only'], answer: 1, hint: 'Transformers rely on electromagnetic induction which requires a changing magnetic field produced by AC.' },
      { question: 'What is the unit of electrical capacitance?', options: ['Henry', 'Farad', 'Tesla', 'Weber'], answer: 1, hint: 'The Farad (F) is the standard unit of capacitance.' },
      { question: 'Which semiconductor element is most commonly used in manufacturing electronic components?', options: ['Copper', 'Carbon', 'Silicon', 'Mica'], answer: 2, hint: 'Silicon is the most popular semiconductor material due to its temperature stability.' },
      { question: 'Which law states that induced electromotive force is proportional to the rate of change of magnetic flux?', options: ['Ohm\'s Law', 'Lenz\'s Law', 'Faraday\'s Law of Induction', 'Kirchhoff\'s Law'], answer: 2, hint: 'Faraday\'s Law describes the generation of EMF by changing magnetic fields.' },
      { question: 'Which instrument is used to test the insulation resistance of wiring installations?', options: ['Growler', 'Megger', 'Wattmeter', 'Earth Tester'], answer: 1, hint: 'A Megger is a high-resistance megohmmeter used to test insulation cables.' },
      { question: 'What is the color of the earth/ground wire in standard 3-core cables in India?', options: ['Red', 'Black', 'Green or Green/Yellow', 'Blue'], answer: 2, hint: 'Green (or green-yellow stripes) denotes the safety earth connection.' },
      { question: 'Which instrument is used to measure the specific gravity of battery electrolyte?', options: ['Hydrometer', 'Barometer', 'Lactometer', 'Thermometer'], answer: 0, hint: 'A hydrometer measures the density of liquids relative to water, testing battery charge levels.' },
      { question: 'What is the function of a choke in a traditional fluorescent tube light circuit?', options: ['Increase power factor', 'Limit current and induce starting strike voltage', 'Stabilize heater filaments', 'None of these'], answer: 1, hint: 'The choke limits running current and induces a high voltage kick to strike the gas discharge.' }
    ]
  },
  {
    name: 'RRB JE Civil Technical CBT',
    mcqs: [
      { question: 'What is the standard size of a modular brick?', options: ['19cm x 9cm x 9cm', '20cm x 10cm x 10cm', '22.8cm x 11.2cm x 7cm', '19cm x 19cm x 9cm'], answer: 0, hint: 'The standard size of a modular brick is 19cm x 9cm x 9cm.' },
      { question: 'Which cement test is used to check its soundness?', options: ['Le-Chatelier test', 'Vicat needle test', 'Slump test', 'Fineness test'], answer: 0, hint: 'The Le-Chatelier test is used to detect soundness due to free lime.' },
      { question: 'What is the pH value of drinking water?', options: ['Between 6.5 and 8.5', 'Exactly 7', 'Less than 6', 'More than 9'], answer: 0, hint: 'Drinking water pH should ideally be in the range of 6.5 to 8.5.' },
      { question: 'The ratio of lateral strain to linear strain is called:', options: ['Young\'s Modulus', 'Bulk Modulus', 'Poisson\'s Ratio', 'Rigidity Modulus'], answer: 2, hint: 'Poisson\'s Ratio is the ratio of lateral strain to longitudinal/linear strain.' },
      { question: 'Which instrument is used to measure high temperature in kilns?', options: ['Thermometer', 'Pyrometer', 'Barometer', 'Anemometer'], answer: 1, hint: 'A pyrometer measures very high temperatures by sensing radiation.' },
      { question: 'The slump test of concrete is used to measure its:', options: ['Compressive strength', 'Tensile strength', 'Workability', 'Durability'], answer: 2, hint: 'The slump test evaluates the workability and consistency of fresh concrete mixes.' },
      { question: 'What is the primary chemical constituent of limestone?', options: ['Calcium carbonate', 'Silica', 'Alumina', 'Iron oxide'], answer: 0, hint: 'Limestone is a sedimentary rock composed largely of calcium carbonate (CaCO3).' },
      { question: 'What is the hardness of a diamond on the Mohs scale?', options: ['1', '5', '8', '10'], answer: 3, hint: 'Diamond is the hardest natural substance, rated 10 on the Mohs scale.' },
      { question: 'What is the maximum aggregate impact value allowed for concrete used in road wearing surfaces?', options: ['15%', '20%', '30%', '45%'], answer: 2, hint: 'For wearing courses, the aggregate impact value should not exceed 30%.' },
      { question: 'Which instrument is used for measuring both horizontal and vertical angles in surveying?', options: ['Compass', 'Level', 'Theodolite', 'Planimeter'], answer: 2, hint: 'A theodolite is a precision optical instrument for measuring horizontal and vertical angles.' },
      { question: 'What is the SI unit of dynamic viscosity?', options: ['Pascal-second (Pa.s)', 'Poise', 'Stokes', 'm2/s'], answer: 0, hint: 'The SI unit of dynamic viscosity is Pascal-second (Pa.s), where 1 Pa.s = 10 Poise.' },
      { question: 'Which type of cement is recommended for underwater concrete construction?', options: ['Low heat cement', 'Rapid hardening cement', 'Quick setting cement', 'Portland pozzolana cement'], answer: 2, hint: 'Quick setting cement starts setting within 5 minutes and hardens in 30 minutes, ideal for running water.' },
      { question: 'What is the fundamental working principle of surveying?', options: ['Work from part to whole', 'Work from whole to part', 'Measuring local points only', 'None of these'], answer: 1, hint: 'Surveying works from whole to part to control and localize errors.' },
      { question: 'The contour interval on a map depends on which factors?', options: ['Scale of map & nature of ground', 'Color of map', 'Size of paper', 'None of these'], answer: 0, hint: 'Contour interval depends on topography and map scale detail requirements.' },
      { question: 'Concrete gains strength primarily due to which chemical reaction?', options: ['Carbonation', 'Evaporation of water', 'Hydration of cement', 'Siltation'], answer: 2, hint: 'The hydration of calcium silicate compounds in cement creates the binding gel.' }
    ]
  },
  {
    name: 'State Judiciary Mains Mock Law Paper',
    mcqs: [
      { question: 'Under which article of the Indian Constitution is the Supreme Court established?', options: ['Article 124', 'Article 129', 'Article 226', 'Article 131'], answer: 0, hint: 'Article 124 establishes the Supreme Court of India.' },
      { question: 'Which section of the Indian Penal Code defines "Murder"?', options: ['Section 299', 'Section 300', 'Section 302', 'Section 307'], answer: 1, hint: 'Section 300 defines Murder, while Section 302 provides the punishment.' },
      { question: 'The Indian Contract Act was enacted in the year:', options: ['1872', '1882', '1908', '1950'], answer: 0, hint: 'The Indian Contract Act was enacted in 1872.' },
      { question: 'Who administers the oath to the President of India?', options: ['Prime Minister', 'Chief Justice of India', 'Vice President', 'Speaker of Lok Sabha'], answer: 1, hint: 'The Chief Justice of India administers the oath of office to the President.' },
      { question: 'What is the maximum number of members in the Lok Sabha?', options: ['545', '550', '552', '560'], answer: 2, hint: 'The maximum strength of the Lok Sabha is 552.' },
      { question: 'The concept of the "Preamble" in the Indian Constitution was amended by which act?', options: ['42nd Amendment Act', '44th Amendment Act', '86th Amendment Act', 'First Amendment Act'], answer: 0, hint: 'The 42nd Amendment of 1976 added the terms Socialist, Secular, and Integrity to the Preamble.' },
      { question: 'Which section of the Code of Civil Procedure (CPC) deals with "Res Judicata"?', options: ['Section 9', 'Section 10', 'Section 11', 'Section 12'], answer: 2, hint: 'Section 11 of the CPC defines the rule of Res Judicata.' },
      { question: 'Which section of the Indian Penal Code (IPC) defines the offence of "Theft"?', options: ['Section 375', 'Section 378', 'Section 379', 'Section 380'], answer: 1, hint: 'Section 378 defines theft, and Section 379 provides the punishment.' },
      { question: 'Under which article of the Constitution of India can a citizen move the Supreme Court directly for enforcement of Fundamental Rights?', options: ['Article 32', 'Article 136', 'Article 226', 'Article 227'], answer: 0, hint: 'Article 32 provides the Right to Constitutional Remedies to approach the SC.' },
      { question: 'Which section of the Indian Evidence Act defines "Primary Evidence"?', options: ['Section 60', 'Section 61', 'Section 62', 'Section 63'], answer: 2, hint: 'Section 62 defines primary evidence as the document itself produced for inspection.' },
      { question: 'What is the limitation period for filing a suit for possession of immovable property based on title?', options: ['3 years', '12 years', '30 years', '60 years'], answer: 1, hint: 'Under the Limitation Act, the period is 12 years.' },
      { question: 'In which year was the Transfer of Property Act enacted in India?', options: ['1872', '1881', '1882', '1908'], answer: 2, hint: 'The Transfer of Property Act was enacted in 1882.' },
      { question: 'Which section of the Indian Contract Act defines a "Void Agreement"?', options: ['Section 2(e)', 'Section 2(g)', 'Section 2(h)', 'Section 2(j)'], answer: 1, hint: 'Section 2(g) defines an agreement not enforceable by law as void.' },
      { question: 'The Constitution of India was formally adopted on which date?', options: ['August 15, 1947', 'November 26, 1949', 'January 26, 1950', 'None of these'], answer: 1, hint: 'It was adopted on November 26, 1949 and came into effect on January 26, 1950.' },
      { question: 'What is the minimum age required to be appointed as the Governor of an Indian State?', options: ['25 years', '30 years', '35 years', '40 years'], answer: 2, hint: 'Article 157 prescribes 35 years as the minimum age for state governors.' }
    ]
  },
  {
    name: 'Paramedical Nursing Theory Exam',
    mcqs: [
      { question: 'Which of the following is the normal body temperature in Celsius?', options: ['35°C', '37°C', '38°C', '36.5°C'], answer: 1, hint: 'Normal human body temperature is around 37°C (98.6°F).' },
      { question: 'What is the primary function of white blood cells (WBC)?', options: ['Carrying oxygen', 'Fighting infections', 'Clotting blood', 'Regulating temperature'], answer: 1, hint: 'WBCs are an essential part of the immune system and fight infections.' },
      { question: 'Which vitamin is essential for blood clotting?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], answer: 3, hint: 'Vitamin K is required for the synthesis of proteins involved in blood clotting.' },
      { question: 'Which organ is primarily responsible for filtering wastes from blood?', options: ['Heart', 'Lungs', 'Kidneys', 'Liver'], answer: 2, hint: 'Kidneys filter wastes and excess fluids from the blood.' },
      { question: 'What is the average human heart rate per minute?', options: ['60-100 bpm', '50-60 bpm', '100-120 bpm', '72-80 bpm'], answer: 0, hint: 'Normal resting heart rate for adults ranges from 60 to 100 beats per minute.' },
      { question: 'Which medical instrument is used to measure arterial blood pressure?', options: ['Stethoscope', 'Thermometer', 'Sphygmomanometer', 'Otoscope'], answer: 2, hint: 'A sphygmomanometer consists of an inflatable cuff and pressure gauge.' },
      { question: 'What is considered a normal adult resting blood pressure?', options: ['120/80 mmHg', '140/90 mmHg', '90/60 mmHg', '100/100 mmHg'], answer: 0, hint: '120/80 mmHg is the textbook normal standard blood pressure.' },
      { question: 'Which organ is the primary site of nutrient absorption in the digestive tract?', options: ['Stomach', 'Small Intestine', 'Large Intestine', 'Esophagus'], answer: 1, hint: 'The small intestine absorbs over 90% of nutrients from digested food.' },
      { question: 'Which blood group is known as the universal donor?', options: ['A positive', 'B negative', 'AB positive', 'O negative'], answer: 3, hint: 'O negative blood has no antigens on red cells, making it safe for any recipient.' },
      { question: 'Which hormone is secreted by the pancreas to lower blood sugar levels?', options: ['Glucagon', 'Thyroxine', 'Insulin', 'Adrenaline'], answer: 2, hint: 'Insulin facilitates glucose uptake by cells, lowering systemic blood sugar.' },
      { question: 'What is the normal respiratory rate for a healthy resting adult?', options: ['8-12 breaths/min', '12-20 breaths/min', '20-30 breaths/min', '30-40 breaths/min'], answer: 1, hint: 'The normal adult respiratory rate is between 12 and 20 breaths per minute.' },
      { question: 'Deficiency of Vitamin D in children leads to which skeletal condition?', options: ['Scurvy', 'Osteoporosis', 'Rickets', 'Beriberi'], answer: 2, hint: 'Rickets is a bone-softening condition in growing children caused by lack of Vitamin D.' },
      { question: 'Generally, after surgical procedures, when are skin sutures removed?', options: ['2 days', '5 to 10 days', '20 days', '1 month'], answer: 1, hint: 'Sutures are typically removed between 5 to 10 days depending on body site tension.' },
      { question: 'Which is the largest organ in the human body?', options: ['Liver', 'Brain', 'Skin', 'Large Intestine'], answer: 2, hint: 'The skin is the largest organ by surface area and weight.' },
      { question: 'What is the compression-to-ventilation ratio for adult CPR by a single rescuer?', options: ['15:2', '30:2', '5:1', '30:5'], answer: 1, hint: 'Standard guidelines specify 30 chest compressions followed by 2 rescue breaths.' }
    ]
  },
  {
    name: 'Electronic Mechanic Semester 1 Prep',
    mcqs: [
      { question: 'Which semiconductor material is most commonly used in electronic chips?', options: ['Silicon', 'Germanium', 'Copper', 'Carbon'], answer: 0, hint: 'Silicon is the most popular semiconductor due to abundance and performance.' },
      { question: 'What is the main function of a diode?', options: ['Amplifying signals', 'Allowing current in one direction only', 'Storing charge', 'Regulating frequency'], answer: 1, hint: 'A diode acts as a one-way valve for electric current.' },
      { question: 'What is the colour code for a 1k Ohm resistor with 5% tolerance?', options: ['Brown, Black, Red, Gold', 'Brown, Black, Orange, Silver', 'Red, Red, Red, Gold', 'Brown, Green, Red, Gold'], answer: 0, hint: '1k = 1, 0, 10^2. Brown(1), Black(0), Red(multiplier 100), Gold(5%).' },
      { question: 'Which component stores electrical energy in an electric field?', options: ['Resistor', 'Inductor', 'Capacitor', 'Transistor'], answer: 2, hint: 'A capacitor stores energy in its electric field.' },
      { question: 'What does "IC" stand for in electronics?', options: ['Internal Conductor', 'Integrated Circuit', 'Internet Connection', 'Integrated Cable'], answer: 1, hint: 'IC stands for Integrated Circuit.' },
      { question: 'Which instrument is used to view electrical signal waveforms in real time?', options: ['Multimeter', 'Wattmeter', 'Oscilloscope', 'Signal Generator'], answer: 2, hint: 'An oscilloscope (CRO/DSO) plots voltage signals over time.' },
      { question: 'Which logic gate gives a high output (1) only when all inputs are low (0)?', options: ['AND gate', 'NAND gate', 'NOR gate', 'OR gate'], answer: 2, hint: 'A NOR gate yields 1 only when A and B are 0 (NOT OR).' },
      { question: 'Common electronics solder is an alloy composed of which metals?', options: ['Copper and Zinc', 'Tin and Lead', 'Silver and Copper', 'Gold and Nickel'], answer: 1, hint: 'Standard solder is composed of Tin (Sn) and Lead (Pb) in ratios like 60/40.' },
      { question: 'What is the frequency of pure Direct Current (DC)?', options: ['0 Hz', '50 Hz', '60 Hz', 'Infinity'], answer: 0, hint: 'DC flows constantly in one direction and does not alternate, meaning its frequency is 0.' },
      { question: 'Which component is primarily used to amplify weak electronic signals?', options: ['Diode', 'Resistor', 'Transistor', 'Capacitor'], answer: 2, hint: 'Transistors act as amplifiers and electronic switches.' },
      { question: 'What does BJT stand for in transistor electronics?', options: ['Bipolar Junction Transistor', 'Base Junction Triode', 'Binary Junction Terminal', 'None of these'], answer: 0, hint: 'BJT stands for Bipolar Junction Transistor.' },
      { question: 'What is the approximate forward voltage drop of a standard Silicon diode?', options: ['0.3 V', '0.7 V', '1.1 V', '2.0 V'], answer: 1, hint: 'Silicon PN junctions require about 0.7 V forward bias to conduct, while Germanium drops about 0.3 V.' },
      { question: 'What is the unit of electrical inductance?', options: ['Farad', 'Henry', 'Siemens', 'Ohm'], answer: 1, hint: 'The Henry (H) is the SI unit of self and mutual inductance.' },
      { question: 'Which instrument can measure voltage, current, and resistance?', options: ['Ammeter', 'Voltmeter', 'Megger', 'Multimeter'], answer: 3, hint: 'A multimeter combines multiple measurement functions in one unit.' },
      { question: 'What is the main application of a Zener diode?', options: ['Rectification', 'Voltage regulation', 'Signal detection', 'Filter smoothing'], answer: 1, hint: 'Zener diodes are operated in reverse breakdown to maintain stable reference voltages.' }
    ]
  },
  {
    name: 'RRB NTPC CBT 1 Full Mock Test',
    mcqs: [
      { question: 'Where is the headquarters of the Indian Railways located?', options: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'], answer: 0, hint: 'The headquarters of Indian Railways is in New Delhi.' },
      { question: 'Which state has the longest railway route in India?', options: ['Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Maharashtra'], answer: 0, hint: 'Uttar Pradesh has the largest route kilometer coverage in India.' },
      { question: 'The first train in India ran between Mumbai and:', options: ['Pune', 'Thane', 'Surat', 'Dadri'], answer: 1, hint: 'The first passenger train ran between Bori Bunder (Mumbai) and Thane on April 16, 1853.' },
      { question: 'Who was the first Railway Minister of independent India?', options: ['John Mathai', 'Lal Bahadur Shastri', 'Jawaharlal Nehru', 'Jagjivan Ram'], answer: 0, hint: 'John Mathai was the first Railway Minister of independent India.' },
      { question: 'What is the width of a broad gauge railway track in India?', options: ['1.0 m', '1.676 m', '0.762 m', '1.435 m'], answer: 1, hint: 'Broad gauge in India is 5 feet 6 inches (1.676 m).' },
      { question: 'In which year was the capital of India officially shifted from Calcutta to Delhi?', options: ['1905', '1911', '1919', '1927'], answer: 1, hint: 'The shift was announced by King George V during the Delhi Durbar of 1911.' },
      { question: 'Who was the first Governor-General of British India?', options: ['Warren Hastings', 'Lord William Bentinck', 'Lord Dalhousie', 'Lord Canning'], answer: 1, hint: 'Lord William Bentinck became the first official Governor-General of India under the Charter Act of 1833.' },
      { question: 'Which is the largest freshwater lake in India?', options: ['Chilika Lake', 'Wular Lake', 'Dal Lake', 'Loktak Lake'], answer: 1, hint: 'Wular Lake in Jammu and Kashmir is the largest freshwater lake in India.' },
      { question: 'Who was the founder of the ancient Buddhist religion?', options: ['Mahavira', 'Gautama Buddha', 'Guru Nanak', 'Ashoka'], answer: 1, hint: 'Siddhartha Gautama (Buddha) founded Buddhism in the 6th-5th centuries BCE.' },
      { question: 'National Sports Day of India is celebrated on which date?', options: ['August 29', 'July 11', 'October 2', 'January 12'], answer: 0, hint: 'National Sports Day is celebrated on August 29 to honor hockey legend Major Dhyan Chand\'s birthday.' },
      { question: 'Which is the largest and deepest ocean on Earth?', options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'], answer: 3, hint: 'The Pacific Ocean is the largest, covering more than 30% of the Earth\'s surface.' },
      { question: 'Who was the author of the famous classical book "Geet Govind"?', options: ['Jayadeva', 'Kalidasa', 'Tulsidas', 'Kabir'], answer: 0, hint: 'Jayadeva was a 12th-century Sanskrit poet who wrote Gita Govinda.' },
      { question: 'What is the chemical formula of common table salt?', options: ['NaHCO3', 'NaCl', 'NaOH', 'KCl'], answer: 1, hint: 'NaCl stands for Sodium Chloride.' },
      { question: 'A light-year is a standard unit of measurement for:', options: ['Time', 'Speed', 'Distance', 'Light intensity'], answer: 2, hint: 'A light-year is the distance that light travels in a vacuum in one Julian year (approx. 9.46 trillion km).' },
      { question: 'Which organelle is known as the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Lysosome'], answer: 1, hint: 'Mitochondria generate most of the cell\'s supply of adenosine triphosphate (ATP), used as chemical energy.' }
    ]
  },
  {
    name: 'SBI PO Prelims Full Mock Test',
    mcqs: [
      { question: 'Which bank is the largest public sector bank in India?', options: ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Punjab National Bank'], answer: 2, hint: 'State Bank of India is the largest public sector commercial bank in India.' },
      { question: 'What is the full form of RTGS?', options: ['Real Time Gross Settlement', 'Regular Transfer Gross Security', 'Real Time General Security', 'None of these'], answer: 0, hint: 'RTGS stands for Real Time Gross Settlement.' },
      { question: 'Who acts as the lender of last resort in India?', options: ['Central Government', 'State Bank of India', 'Reserve Bank of India', 'NABARD'], answer: 2, hint: 'The Reserve Bank of India acts as the lender of last resort for commercial banks.' },
      { question: 'What is the minimum age required to open a bank account independently?', options: ['10 years', '15 years', '18 years', '21 years'], answer: 0, hint: 'Under RBI guidelines, minors above 10 years can open and operate accounts independently.' },
      { question: 'The term "Bull" and "Bear" are associated with:', options: ['Agriculture', 'Stock Market', 'Elections', 'Forestry'], answer: 1, hint: 'Bull and Bear describe upward and downward stock market trends respectively.' },
      { question: 'Who is the current executive head of the Reserve Bank of India (RBI)?', options: ['Prime Minister', 'Finance Minister', 'Governor', 'Chief Economic Advisor'], answer: 2, hint: 'The RBI is headed by its Governor.' },
      { question: 'Who introduced the Banking Ombudsman Scheme in India?', options: ['SEBI', 'Reserve Bank of India', 'Central Government', 'Indian Banks Association'], answer: 1, hint: 'The RBI first introduced the Banking Ombudsman Scheme in 1995 to resolve customer complaints.' },
      { question: 'Where is the central headquarters of the Reserve Bank of India located?', options: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'], answer: 1, hint: 'The RBI central office was established in Kolkata but permanently moved to Mumbai in 1937.' },
      { question: 'What does PIN stand for in debit/credit card transactions?', options: ['Personal Identification Number', 'Private Internet Network', 'Primary Identification Name', 'Payment Instrument Note'], answer: 0, hint: 'PIN stands for Personal Identification Number.' },
      { question: 'What is the validity period of a bank cheque in India from the date of issue?', options: ['1 month', '3 months', '6 months', '1 year'], answer: 1, hint: 'Cheques are valid for 3 months from the date written on them.' },
      { question: 'Under which system does the RBI issue currency notes in India?', options: ['Proportional Reserve System', 'Minimum Reserve System', 'Maximum Reserve System', 'None of these'], answer: 1, hint: 'RBI adopted the Minimum Reserve System in 1957, requiring it to keep minimum reserves of Rs 200 crore.' },
      { question: 'Whose signature is present on the one-rupee currency note in India?', options: ['RBI Governor', 'Finance Secretary of India', 'President of India', 'Finance Minister'], answer: 1, hint: 'The One Rupee note is issued by the Ministry of Finance and signed by the Finance Secretary.' },
      { question: 'How many members constitute the Monetary Policy Committee (MPC) of India?', options: ['4 members', '5 members', '6 members', '8 members'], answer: 2, hint: 'The MPC consists of 6 members: 3 from RBI and 3 external members appointed by the Government.' },
      { question: 'Which of the following is NOT a Negotiable Instrument under the Negotiable Instruments Act?', options: ['Promissory Note', 'Bill of Exchange', 'Cheque', 'Share Certificate'], answer: 3, hint: 'Share certificates are not negotiable instruments.' },
      { question: 'What is the primary source of profits for commercial banks?', options: ['Locker rent fees', 'Mutual fund commissions', 'Difference between interest charged on loans and paid on deposits', 'Stock trading'], answer: 2, hint: 'The spread (interest margin) is the core profit source for banks.' }
    ]
  },
  {
    name: 'NEET Physics Practice Prep',
    mcqs: [
      { question: 'What is the dimensional formula for gravitational constant (G)?', options: ['[M^-1 L^3 T^-2]', '[M L^3 T^-2]', '[M^-2 L^3 T^-1]', '[M^-1 L^2 T^-2]'], answer: 0, hint: 'G = F*r^2/m^2. Dimensions: [M L T^-2] * [L^2] / [M^2] = [M^-1 L^3 T^-2].' },
      { question: 'A body is projected vertically upwards with a velocity of 20 m/s. Maximum height reached is (g = 10 m/s^2):', options: ['10 m', '20 m', '15 m', '40 m'], answer: 1, hint: 'H = u^2 / 2g = 400 / 20 = 20 m.' },
      { question: 'What is the SI unit of magnetic flux?', options: ['Tesla', 'Weber', 'Gauss', 'Henry'], answer: 1, hint: 'Weber is the SI unit of magnetic flux.' },
      { question: 'Which electromagnetic wave has the shortest wavelength?', options: ['X-Rays', 'Gamma-Rays', 'UV-Rays', 'Radio Waves'], answer: 1, hint: 'Gamma-rays have the highest frequency and shortest wavelength in the EM spectrum.' },
      { question: 'A convex lens has a focal length of 20 cm. Its power is:', options: ['+5 D', '-5 D', '+2 D', '-2 D'], answer: 0, hint: 'Power P = 100 / f (in cm) = 100 / 20 = +5 D.' },
      { question: 'What is the value of escape velocity from the surface of Earth?', options: ['8.0 km/s', '11.2 km/s', '42.0 km/s', '1.5 km/s'], answer: 1, hint: 'Escape velocity from Earth is approximately 11.2 km/s.' },
      { question: 'The acceleration due to gravity (g) is maximum at which location?', options: ['Equator', 'Poles', 'Center of Earth', 'Mount Everest'], answer: 1, hint: 'g is maximum at the poles because Earth is an oblate spheroid and polar radius is minimum.' },
      { question: 'Sound waves traveling through air are classified as which type of wave?', options: ['Transverse electromagnetic', 'Longitudinal mechanical', 'Transverse mechanical', 'Torsional waves'], answer: 1, hint: 'Sound in air travels as pressure waves (rarefactions and compressions), which are longitudinal mechanical waves.' },
      { question: 'What is the SI unit of electrical conductivity?', options: ['Ohm-meter', 'Siemens per meter (S/m)', 'Siemens', 'Volt per meter'], answer: 1, hint: 'Siemens per meter (S/m) is the standard unit of electrical conductivity.' },
      { question: 'The working of optical fiber is based on which optical phenomenon?', options: ['Refraction', 'Total Internal Reflection', 'Scattering', 'Interference'], answer: 1, hint: 'Optical fibers guide light signals using continuous Total Internal Reflection (TIR) inside the core cladding.' },
      { question: 'What is the angle of contact for pure water and clean glass?', options: ['0 degrees', '45 degrees', '90 degrees', '135 degrees'], answer: 0, hint: 'Pure water completely wets clean glass, resulting in a contact angle of 0 degrees.' },
      { question: 'Which instrument is specifically used to measure solar radiation?', options: ['Barometer', 'Pyrheliometer', 'Anemometer', 'Lactometer'], answer: 1, hint: 'A pyrheliometer is designed to measure direct beam solar irradiance.' },
      { question: 'Absolute zero temperature corresponds to what value in Celsius?', options: ['0 °C', '-100 °C', '-273.15 °C', '-300 °C'], answer: 2, hint: 'Absolute zero is 0 K, which equals -273.15 °C.' },
      { question: 'What is the weight of a body at the center of the Earth?', options: ['Zero', 'Double its surface weight', 'Same as surface weight', 'Infinite'], answer: 0, hint: 'At the center of the Earth, acceleration due to gravity (g) is zero, so the weight (m * g) is also zero.' },
      { question: 'Light waves exhibit transverse nature because they can be:', options: ['Reflected', 'Refracted', 'Diffracted', 'Polarized'], answer: 3, hint: 'Only transverse waves can be polarized; longitudinal waves cannot.' }
    ]
  },
  {
    name: 'NDA General Ability Mock Test',
    mcqs: [
      { question: 'Where is the National Defence Academy (NDA) located?', options: ['Dehradun', 'Khadakwasla', 'Chennai', 'Gwalior'], answer: 1, hint: 'NDA is located in Khadakwasla near Pune, Maharashtra.' },
      { question: 'Who is the supreme commander of the Indian Armed Forces?', options: ['Prime Minister', 'President of India', 'Chief of Defence Staff', 'Defence Minister'], answer: 1, hint: 'The President of India is the supreme commander of the Indian Armed Forces.' },
      { question: 'Which is the oldest paramilitary force in India?', options: ['BSF', 'CRPF', 'Assam Rifles', 'ITBP'], answer: 2, hint: 'Assam Rifles, established in 1835 as Cachar Levy, is the oldest.' },
      { question: 'The head of the Indian Army is called:', options: ['Chief of Army Staff', 'General of Army', 'Field Marshal', 'Chief of Defence Staff'], answer: 0, hint: 'The head of the Indian Army is the Chief of Army Staff (COAS).' },
      { question: 'In which year was the Kargil War fought?', options: ['1971', '1962', '1999', '1965'], answer: 2, hint: 'The Kargil War was fought between May and July 1999.' },
      { question: 'The famous Battle of Haldighati was fought in which year?', options: ['1526', '1556', '1576', '1761'], answer: 2, hint: 'The Battle of Haldighati was fought on June 18, 1576 between Akbar\'s forces led by Man Singh I and Maharana Pratap.' },
      { question: 'Which boundary line separates India and China?', options: ['Radcliffe Line', 'Durand Line', 'McMahon Line', 'Red Line'], answer: 2, hint: 'The McMahon Line is the boundary line between Tibet/China and northeast India.' },
      { question: 'Which is the highest peacetime gallantry award in India?', options: ['Param Vir Chakra', 'Maha Vir Chakra', 'Ashoka Chakra', 'Kirti Chakra'], answer: 2, hint: 'Ashoka Chakra is the highest peacetime military decoration, equivalent to the Param Vir Chakra (war-time).' },
      { question: 'The historical Treaty of Versailles was signed in which year?', options: ['1914', '1918', '1919', '1939'], answer: 2, hint: 'The Treaty of Versailles was signed on June 28, 1919, officially ending World War I.' },
      { question: 'Who is regarded as the father of the Indian Space Programme?', options: ['Homi J. Bhabha', 'A.P.J. Abdul Kalam', 'Vikram Sarabhai', 'Satish Dhawan'], answer: 2, hint: 'Dr. Vikram Sarabhai led the establishment of ISRO and space research in India.' },
      { question: 'What is dry ice chemically?', options: ['Solid water', 'Solid carbon dioxide', 'Solid nitrogen', 'Solid oxygen'], answer: 1, hint: 'Dry ice is the common name for solid carbon dioxide (CO2).' },
      { question: 'Solder used in electronics is an alloy of which metals?', options: ['Copper and Zinc', 'Tin and Lead', 'Nickel and Chromium', 'Iron and Carbon'], answer: 1, hint: 'Standard electrical solder consists of tin and lead.' },
      { question: 'Which gas is filled inside common household electric bulbs?', options: ['Oxygen', 'Hydrogen', 'Carbon dioxide', 'Nitrogen or Argon'], answer: 3, hint: 'Bulbs are filled with chemically inactive gases like nitrogen or argon to prevent filament oxidation.' },
      { question: 'The red color of human blood is due to the presence of which protein?', options: ['Myoglobin', 'Hemoglobin', 'Albumin', 'Melanin'], answer: 1, hint: 'Hemoglobin is the iron-containing oxygen-transport metalloprotein in red blood cells.' },
      { question: 'Which Part of the Indian Constitution contains the Fundamental Rights?', options: ['Part II', 'Part III', 'Part IV', 'Part IV-A'], answer: 1, hint: 'Articles 12 to 35 in Part III of the Constitution guarantee Fundamental Rights to citizens.' }
    ]
  },
  {
    name: 'UPSC Prelims GS Paper 1 Mock',
    mcqs: [
      { question: 'Which Indian leader was affectionately called "Loknayak"?', options: ['Jayaprakash Narayan', 'Bal Gangadhar Tilak', 'Lala Lajpat Rai', 'Subhas Chandra Bose'], answer: 0, hint: 'Jayaprakash Narayan is popularly known as Loknayak (People\'s Leader).' },
      { question: 'The concept of "Directive Principles of State Policy" was borrowed from which country?', options: ['USA', 'UK', 'Ireland', 'Australia'], answer: 2, hint: 'DPSPs are borrowed from the Irish Constitution.' },
      { question: 'Where is the Bandipur National Park located?', options: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Madhya Pradesh'], answer: 0, hint: 'Bandipur National Park is established in Karnataka.' },
      { question: 'Who was the first governor-general of independent India?', options: ['C. Rajagopalachari', 'Lord Mountbatten', 'Dr. Rajendra Prasad', 'Jawaharlal Nehru'], answer: 1, hint: 'Lord Mountbatten served as the first Governor-General of independent India.' },
      { question: 'Which river is known as the "Sorrow of Bengal"?', options: ['Kosi', 'Damodar', 'Ganga', 'Hooghly'], answer: 1, hint: 'Damodar River was historically known as Sorrow of Bengal due to devastating floods.' },
      { question: 'Which ancient Harappan site is famous for possessing a dockyard?', options: ['Harappa', 'Mohenjo-daro', 'Lothal', 'Kalibangan'], answer: 2, hint: 'Lothal in Gujarat had a massive tidal dockyard connecting to the Sabarmati river.' },
      { question: 'Who introduced the Permanent Settlement of land revenue in Bengal in 1793?', options: ['Warren Hastings', 'Lord Cornwallis', 'Lord Wellesley', 'Lord William Bentinck'], answer: 1, hint: 'Lord Cornwallis introduced the zamindari permanent settlement system.' },
      { question: 'Who appoints the Chief Election Commissioner of India?', options: ['Prime Minister', 'President of India', 'Chief Justice of India', 'Parliament'], answer: 1, hint: 'The President of India appoints the CEC under Article 324.' },
      { question: 'Which city was the capital of the ancient Satavahana dynasty?', options: ['Pratishthana (Paithan)', 'Pataliputra', 'Ujjain', 'Kanchipuram'], answer: 0, hint: 'Pratishthana (modern Paithan in Maharashtra) was the capital of the Satavahanas.' },
      { question: 'Where is the Silent Valley National Park located in India?', options: ['Tamil Nadu', 'Kerala', 'Karnataka', 'Uttarakhand'], answer: 1, hint: 'Silent Valley National Park is located in the Nilgiri Hills, Palakkad district, Kerala.' },
      { question: 'Where was the first session of the Indian National Congress held in 1885?', options: ['Calcutta', 'Bombay', 'Madras', 'Allahabad'], answer: 1, hint: 'The first INC session was held at Gokuldas Tejpal Sanskrit College, Bombay.' },
      { question: 'Which layer of the atmosphere contains the protective Ozone Layer?', options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'], answer: 1, hint: 'The stratosphere contains the ozone layer (about 15-35 km above Earth).' },
      { question: 'The separation of the judiciary from the executive is mentioned in which part of the Constitution?', options: ['Preamble', 'Fundamental Rights', 'Directive Principles of State Policy', 'Seventh Schedule'], answer: 2, hint: 'Article 50 of the DPSPs directs the State to separate the judiciary from the executive.' },
      { question: 'Who is the author of the famous ancient book "Panchatantra"?', options: ['Kalidasa', 'Vishnu Sharma', 'Chanakya', 'Banabhatta'], answer: 1, hint: 'Pandit Vishnu Sharma wrote the Panchatantra collection of animal fables in Sanskrit.' },
      { question: 'Which act served as the primary blueprint for the Constitution of India?', options: ['Indian Councils Act 1909', 'Government of India Act 1919', 'Government of India Act 1935', 'Indian Independence Act 1947'], answer: 2, hint: 'More than half of the Constitution\'s provisions are adapted from the GOI Act of 1935.' }
    ]
  },
  {
    name: 'UP Police Constable Practice Sets',
    mcqs: [
      { question: 'Which city is the administrative headquarters of Uttar Pradesh police?', options: ['Lucknow', 'Prayagraj', 'Kanpur', 'Noida'], answer: 0, hint: 'The Police Headquarters of UP is located in Lucknow.' },
      { question: 'What is the emergency helpline number for police in India?', options: ['100 or 112', '101', '102', '1091'], answer: 0, hint: '112 is the single emergency response number, which integrated 100 (police).' },
      { question: 'Which district is the largest in Uttar Pradesh by area?', options: ['Lakhimpur Kheri', 'Sonbhadra', 'Hardoi', 'Prayagraj'], answer: 0, hint: 'Lakhimpur Kheri is the largest district by area in Uttar Pradesh.' },
      { question: 'The classical dance form of Uttar Pradesh is:', options: ['Kathak', 'Kathakali', 'Bharatnatyam', 'Kuchipudi'], answer: 0, hint: 'Kathak originated in northern India, primarily Uttar Pradesh.' },
      { question: 'Who was the first Chief Minister of Uttar Pradesh?', options: ['Govind Ballabh Pant', 'Sucheta Kripalani', 'Chaudhary Charan Singh', 'Mayawati'], answer: 0, hint: 'Govind Ballabh Pant was the first Chief Minister of UP.' },
      { question: 'What is the official State Animal of Uttar Pradesh?', options: ['Tiger', 'Barasingha (Swamp Deer)', 'Lion', 'Elephant'], answer: 1, hint: 'The Barasingha (Swamp Deer) is the state animal of UP.' },
      { question: 'Which is the official State Flower of Uttar Pradesh?', options: ['Rose', 'Lotus', 'Palash', 'Marigold'], answer: 2, hint: 'Palash (Tesu) is designated as the state flower of UP.' },
      { question: 'What is the total number of districts in Uttar Pradesh?', options: ['70', '72', '75', '80'], answer: 2, hint: 'Uttar Pradesh is divided into 75 administrative districts grouped into 18 divisions.' },
      { question: 'Uttar Pradesh shares its borders with how many Indian States and Union Territories?', options: ['7 States', '8 States', '9 (8 States + 1 UT)', '10 States'], answer: 2, hint: 'UP shares borders with 8 states (Uttarakhand, Himachal, Haryana, Rajasthan, MP, Chhattisgarh, Jharkhand, Bihar) and 1 UT (Delhi).' },
      { question: 'Where is the main seat of the High Court of Judicature of Uttar Pradesh located?', options: ['Lucknow', 'Kanpur', 'Prayagraj (Allahabad)', 'Agra'], answer: 2, hint: 'The main seat is in Prayagraj, with a permanent bench in Lucknow.' },
      { question: 'What is the total number of seats in the Legislative Assembly (Vidhan Sabha) of Uttar Pradesh?', options: ['250', '400', '403', '500'], answer: 2, hint: 'The UP Legislative Assembly consists of 403 elected members.' },
      { question: 'Lal Bahadur Shastri International Airport in Uttar Pradesh is located at which city?', options: ['Lucknow', 'Varanasi', 'Kanpur', 'Gorakhpur'], answer: 1, hint: 'The airport is located in Babatpur near Varanasi.' },
      { question: 'The historical monument "Buland Darwaza" in Uttar Pradesh is located at:', options: ['Agra', 'Fatehpur Sikri', 'Lucknow', 'Jaunpur'], answer: 1, hint: 'Buland Darwaza (Gate of Magnificence) was built by Akbar at Fatehpur Sikri.' },
      { question: 'The holy site "Sarnath", where Buddha gave his first sermon, is near which city?', options: ['Varanasi', 'Gorakhpur', 'Allahabad', 'Ayodhya'], answer: 0, hint: 'Sarnath is located 10 km northeast of Varanasi.' },
      { question: 'Which type of soil covers the largest area in Uttar Pradesh?', options: ['Red soil', 'Black soil', 'Alluvial soil', 'Laterite soil'], answer: 2, hint: 'UP lies in the fertile Indo-Gangetic plain, primarily covered by alluvial soils.' }
    ]
  },
  {
    name: 'UP B.Ed Joint Entrance Exam Mock',
    mcqs: [
      { question: 'What is the full form of B.Ed?', options: ['Bachelor of Education', 'Board of Education', 'Basic Education degree', 'None of these'], answer: 0, hint: 'B.Ed stands for Bachelor of Education.' },
      { question: 'Which council is the regulatory body for teacher education in India?', options: ['UGC', 'NCERT', 'NCTE', 'CBSE'], answer: 2, hint: 'National Council for Teacher Education (NCTE) regulates teacher education.' },
      { question: 'According to the Right to Education (RTE) Act, education is a fundamental right for children of age:', options: ['6 to 14 years', '5 to 12 years', '6 to 18 years', '3 to 18 years'], answer: 0, hint: 'RTE Act 2009 provides free and compulsory education to all children aged 6 to 14 years.' },
      { question: 'Who is known as the father of modern psychology?', options: ['Wilhelm Wundt', 'Sigmund Freud', 'William James', 'John B. Watson'], answer: 0, hint: 'Wilhelm Wundt established the first laboratory for experimental psychology, earning him this title.' },
      { question: 'The primary aim of teaching is:', options: ['To give information', 'To promote cognitive development & learning', 'To maintain discipline', 'To prepare for exams'], answer: 1, hint: 'The main goal of teaching is to facilitate learning and cognitive development.' },
      { question: 'Which method of teaching was developed by Maria Montessori?', options: ['Playway method', 'Project method', 'Montessori method', 'Heuristic method'], answer: 2, hint: 'Maria Montessori developed the child-centered Montessori method based on scientific observations.' },
      { question: 'While writing on the blackboard in a classroom, which technique is considered best?', options: ['Writing fast and small', 'Writing clearly and legibly', 'Erasing frequently', 'None of these'], answer: 1, hint: 'Good blackboard writing requires bold, neat, legibly spaced letters.' },
      { question: 'The concept of "micro-teaching" originated at which international university?', options: ['Oxford University', 'Harvard University', 'Stanford University', 'Cambridge University'], answer: 2, hint: 'Micro-teaching was developed by Dwight W. Allen and colleagues at Stanford University in 1961.' },
      { question: 'A child-centric education system primarily focuses on which of the following?', options: ['Teacher\'s style', 'Needs, interests, and abilities of child', 'School infrastructure', 'Textbooks'], answer: 1, hint: 'Child-centered education adapts methods to student needs, learning styles, and background interests.' },
      { question: 'What does "cognition" mean in psychological terms?', options: ['Physical strength', 'Process of acquiring knowledge and understanding', 'Emotional outburst', 'None of these'], answer: 1, hint: 'Cognition refers to mental action or process of acquiring knowledge through thought, experience, and senses.' },
      { question: 'What is the definition of "learning" in educational psychology?', options: ['Memorizing facts', 'Modification of behavior through experience', 'Passing examinations', 'Reading books'], answer: 1, hint: 'Learning is a relatively permanent change/modification of behavior resulting from practice or experience.' },
      { question: 'Which is the primary agency of socialization for young children?', options: ['School', 'Media', 'Peer group', 'Family'], answer: 3, hint: 'The family is the first and primary source of social values, behaviors, and language.' },
      { question: 'Generally, "gifted" children possess an IQ score above what number?', options: ['90', '100', '120', '130'], answer: 3, hint: 'An IQ of 130 or higher is standard to categorize a child as intellectually gifted.' },
      { question: 'According to Bloom\'s Taxonomy, what are the three main domains of learning?', options: ['Cognitive, Affective, Psychomotor', 'Reading, Writing, Arithmetic', 'Primary, Secondary, Tertiary', 'Visual, Auditory, Kinesthetic'], answer: 0, hint: 'Benjamin Bloom categorized learning domains into Cognitive (head), Affective (heart), and Psychomotor (hands).' },
      { question: 'The National Education Policy (NEP) 2020 replaces which previous policy in India?', options: ['NEP 1968', 'NEP 1986', 'NEP 2005', 'None of these'], answer: 1, hint: 'NEP 2020 replaced the National Policy on Education of 1986.' }
    ]
  },
  {
    name: 'GATE ECE Practice Exam',
    mcqs: [
      { question: 'What is the relation between electron and hole concentrations in an intrinsic semiconductor?', options: ['Electron concentration is greater', 'Hole concentration is greater', 'They are exactly equal', 'Both are zero'], answer: 2, hint: 'In an intrinsic semiconductor, carrier concentrations are equal (n = p = ni).' },
      { question: 'Which component is used to prevent thermal runaway in bipolar transistors?', options: ['Emitter resistor', 'Collector resistor', 'Coupling capacitor', 'Zener diode'], answer: 0, hint: 'An emitter resistor provides negative feedback to stabilize the collector current.' },
      { question: 'A full-adder circuit can be implemented using which gate combination?', options: ['Two half adders and an OR gate', 'Two half adders and an AND gate', 'One half adder and one OR gate', 'Three half adders'], answer: 0, hint: 'A full adder requires two half adders and one OR gate to sum all three input bits.' },
      { question: 'The Fourier transform of a unit impulse function is:', options: ['0', '1', 'Infinity', 'None of these'], answer: 1, hint: 'The Fourier transform of delta(t) is 1 across all frequencies.' },
      { question: 'What is the characteristic impedance of a lossless transmission line?', options: ['sqrt(L * C)', 'sqrt(L / C)', 'sqrt(C / L)', 'L / C'], answer: 1, hint: 'For a lossless line, characteristic impedance Z0 = sqrt(L/C).' },
      { question: 'Which modulation technique is most robust against noise?', options: ['Amplitude Modulation (AM)', 'Frequency Modulation (FM)', 'Pulse Code Modulation (PCM)', 'Phase Modulation (PM)'], answer: 2, hint: 'PCM is a digital modulation scheme that exhibits high noise immunity.' },
      { question: 'What is the bandwidth of an FM wave according to Carson\'s rule?', options: ['2 * df', '2 * fm', '2 * (df + fm)', 'df + fm'], answer: 2, hint: 'Carson\'s rule defines FM bandwidth as 2 * (peak frequency deviation + modulating frequency).' },
      { question: 'A zener diode is operated in which region?', options: ['Forward bias', 'Reverse breakdown', 'Reverse cut-off', 'Active region'], answer: 1, hint: 'Zener diodes are designed to safely conduct current in reverse breakdown.' },
      { question: 'What is the speed of electromagnetic waves in a vacuum?', options: ['3 * 10^8 m/s', '3 * 10^6 m/s', '1.5 * 10^8 m/s', 'None of these'], answer: 0, hint: 'EM waves travel at the speed of light, approx 3 * 10^8 m/s in vacuum.' },
      { question: 'The dominant mode in a rectangular waveguide is:', options: ['TE10', 'TE11', 'TM11', 'TM01'], answer: 0, hint: 'TE10 has the lowest cut-off frequency in rectangular waveguides.' },
      { question: 'What is the logic function implemented by a multiplexer?', options: ['Product of Sums (POS)', 'Sum of Products (SOP)', 'NAND logic only', 'NOR logic only'], answer: 1, hint: 'Multiplexers channel inputs based on select lines, naturally matching SOP forms.' },
      { question: 'A system is stable if its poles lie in which region of the s-plane?', options: ['Right half plane', 'Left half plane', 'On the imaginary axis only', 'Nowhere'], answer: 1, hint: 'For BIBO stability, all poles must lie in the left half of s-plane.' },
      { question: 'Which feedback topology increases input impedance and decreases output impedance?', options: ['Series-Shunt', 'Series-Series', 'Shunt-Shunt', 'Shunt-Series'], answer: 0, hint: 'Series-shunt (voltage-series) feedback increases Rin and decreases Rout.' },
      { question: 'What is the SI unit of magnetic field intensity?', options: ['Tesla', 'Weber', 'Ampere per meter (A/m)', 'Henry'], answer: 2, hint: 'Ampere per meter (A/m) is the SI unit of magnetic field intensity (H).' },
      { question: 'Which theorem equates a surface integral to a volume integral?', options: ['Stoke\'s Theorem', 'Divergence Theorem', 'Green\'s Theorem', 'Cayley\'s Theorem'], answer: 1, hint: 'Gauss\'s Divergence Theorem relates surface flux to the volume integral of divergence.' }
    ]
  },
  {
    name: 'GATE EE Power Systems Prep',
    mcqs: [
      { question: 'Which relay is used for the protection of long transmission lines?', options: ['Impedance relay', 'Reactance relay', 'Mho relay', 'Overcurrent relay'], answer: 2, hint: 'Mho relays are least affected by power swings, ideal for long lines.' },
      { question: 'What is the primary function of a moderator in a nuclear reactor?', options: ['Absorb neutrons', 'Slow down fast neutrons', 'Cool the reactor core', 'Control the nuclear reaction'], answer: 1, hint: 'Moderators reduce the speed of fast neutrons to make them thermal for fission.' },
      { question: 'In a synchronous motor, the speed is determined by:', options: ['Load on motor', 'Supply frequency', 'Voltage applied', 'None of these'], answer: 1, hint: 'Synchronous speed Ns = 120f / P, determined solely by grid frequency.' },
      { question: 'What is the typical efficiency of a large power transformer?', options: ['50-60%', '70-80%', '95-99%', '100%'], answer: 2, hint: 'Large transformers have minimal copper and iron losses, achieving 98%+ efficiency.' },
      { question: 'Which method is used for load flow analysis in complex networks?', options: ['Gauss-Seidel', 'Newton-Raphson', 'Fast Decoupled', 'All of these'], answer: 3, hint: 'Gauss-Seidel, Newton-Raphson, and Fast Decoupled are standard load flow methods.' },
      { question: 'A buck converter is used to:', options: ['Step up DC voltage', 'Step down DC voltage', 'Invert DC voltage', 'Convert DC to AC'], answer: 1, hint: 'Buck converters act as step-down DC-to-DC converters.' },
      { question: 'Which semiconductor switch can be turned off by gate control?', options: ['Standard SCR', 'TRIAC', 'Gate Turn-Off Thyristor (GTO)', 'Diode'], answer: 2, hint: 'GTOs can be turned off by applying a negative gate pulse.' },
      { question: 'The corona loss in transmission lines is higher during:', options: ['Dry weather', 'Humid/wet weather', 'Winter season', 'None of these'], answer: 1, hint: 'Moisture in air lowers breakdown strength, increasing corona discharge.' },
      { question: 'What is the relation between line and phase voltage in a delta connection?', options: ['V_line = V_phase', 'V_line = sqrt(3) * V_phase', 'V_line = V_phase / sqrt(3)', 'None of these'], answer: 0, hint: 'In delta, terminals share the same lines so line voltage equals phase voltage.' },
      { question: 'What is the relation between line and phase current in a star connection?', options: ['I_line = I_phase', 'I_line = sqrt(3) * I_phase', 'I_line = I_phase / sqrt(3)', 'None of these'], answer: 0, hint: 'In star, line current passes directly into the phase winding.' },
      { question: 'Which plant has the lowest running cost per unit generated?', options: ['Thermal plant', 'Nuclear plant', 'Hydroelectric plant', 'Diesel plant'], answer: 2, hint: 'Hydroelectric energy relies on water gravity flows, costing zero fuel expenses.' },
      { question: 'In power systems, surge impedance loading is proportional to:', options: ['Voltage (V)', 'V^2', '1 / V', 'sqrt(V)'], answer: 1, hint: 'Surge impedance loading (SIL) = V^2 / Zc.' },
      { question: 'What is the function of a lightning arrester?', options: ['Absorb lightning energy', 'Divert high voltage surges to ground', 'Stop lightning strikes', 'Protect against overcurrent'], answer: 1, hint: 'Lightning arresters offer a low-resistance path to bypass surge currents to earth.' },
      { question: 'The slip of a synchronous motor at normal operating speed is:', options: ['0', '1', '0.05', '0.1'], answer: 0, hint: 'Synchronous motors run at synchronous speed, meaning slip (Ns - N)/Ns = 0.' },
      { question: 'What is the main advantage of HVDC transmission?', options: ['Easy voltage stepping', 'Lower skin effect and lower line losses', 'Low terminal station cost', 'Simple circuit breakers'], answer: 1, hint: 'HVDC lines do not have skin effect losses or reactive power losses.' }
    ]
  },
  {
    name: 'GATE ME Mechanical Engineering Mock',
    mcqs: [
      { question: 'What is the main purpose of annealing in metals?', options: ['Increase hardness', 'Increase tensile strength', 'Soften the metal & relieve internal stress', 'Improve magnetism'], answer: 2, hint: 'Annealing involves heating and slow cooling to soften grains and reduce internal stress.' },
      { question: 'Which thermodynamic cycle forms the basis of petrol engines?', options: ['Carnot cycle', 'Otto cycle', 'Diesel cycle', 'Rankine cycle'], answer: 1, hint: 'The Otto cycle describes constant-volume combustion in spark-ignition engines.' },
      { question: 'The COP of a refrigerator is always:', options: ['Less than 1', 'Greater than 1', 'Equal to 1', 'Can be any value'], answer: 3, hint: 'COP = Q_low / W_in, which can be less than, equal to, or greater than 1 depending on operating temps.' },
      { question: 'For a fluid at rest, the shear stress is:', options: ['Maximum', 'Zero', 'Constant', 'None of these'], answer: 1, hint: 'By definition, fluids at rest cannot support shear stress.' },
      { question: 'Which instrument is used to measure fluid velocity at a point?', options: ['Venturimeter', 'Orifice meter', 'Pitot tube', 'Rotameter'], answer: 2, hint: 'Pitot tubes measure local velocity by converting kinetic energy to pressure head.' },
      { question: 'A beam fixed at one end and free at the other is called:', options: ['Cantilever beam', 'Simply supported beam', 'Overhanging beam', 'Continuous beam'], answer: 0, hint: 'A cantilever beam has one rigid built-in support and a free projecting end.' },
      { question: 'Which theory of failure is best suited for ductile materials?', options: ['Maximum principal stress theory', 'Maximum shear stress theory (Tresca)', 'Maximum strain energy theory', 'None of these'], answer: 1, hint: 'Maximum shear stress theory provides reliable yields boundaries for ductile metals.' },
      { question: 'The thermal efficiency of a Carnot engine depends only on:', options: ['Working medium', 'Temperature of source and sink', 'Engine speed', 'Size of cylinders'], answer: 1, hint: 'Efficiency = 1 - T_sink / T_source.' },
      { question: 'What type of stress is induced in a shaft transmitting torque?', options: ['Bending stress', 'Torsional shear stress', 'Compressive stress', 'Tensile stress'], answer: 1, hint: 'Torque transmission causes shearing across circular cross-sectional planes.' },
      { question: 'The ratio of lateral strain to longitudinal strain is:', options: ['Young\'s modulus', 'Rigidity modulus', 'Poisson\'s ratio', 'Bulk modulus'], answer: 2, hint: 'Poisson\'s ratio measures structural transverse deformation behavior.' },
      { question: 'What is the primary mechanism of heat transfer in solid metals?', options: ['Convection', 'Radiation', 'Conduction', 'Advection'], answer: 2, hint: 'Conduction transfers kinetic heat energy via free electrons and lattice vibrations.' },
      { question: 'Which governor is classified as a dead-weight governor?', options: ['Watt governor', 'Porter governor', 'Hartnell governor', 'Pickering governor'], answer: 1, hint: 'The Porter governor adds a central heavy dead-weight on the sleeve to increase sensitivity.' },
      { question: 'For maximum transmission of power through a nozzle, the fluid speed should be:', options: ['Equal to speed of sound', 'Less than speed of sound', 'Two-thirds of inlet velocity', 'None of these'], answer: 2, hint: 'Maximum nozzle fluid power transmission occurs when friction loss equals one-third of inlet head.' },
      { question: 'Which casting defect occurs due to low pouring temperature of liquid metal?', options: ['Blow holes', 'Cold shut', 'Hot tears', 'Swell'], answer: 1, hint: 'A cold shut is a seam formed when two streams of liquid metal fail to fuse due to premature freezing.' },
      { question: 'The kinematic viscosity of a fluid is defined as:', options: ['Dynamic viscosity divided by density', 'Density divided by dynamic viscosity', 'Product of density and dynamic viscosity', 'None of these'], answer: 0, hint: 'Nu = Mu / Rho.' }
    ]
  },
  {
    name: 'GATE CE Structural Engineering Practice',
    mcqs: [
      { question: 'What is the standard dynamic modulus of elasticity of concrete according to IS 456?', options: ['Ec = 5000 * sqrt(fck)', 'Ec = 5700 * sqrt(fck)', 'Ec = 1000 * fck', 'Ec = 0.7 * sqrt(fck)'], answer: 0, hint: 'IS 456:2000 specifies the short term static modulus as 5000 * sqrt(fck).' },
      { question: 'In surveying, the curvature of the earth is taken into account in:', options: ['Plane surveying', 'Geodetic surveying', 'Topographical surveying', 'Cadastral surveying'], answer: 1, hint: 'Geodetic surveying covers large areas where earth curvature cannot be ignored.' },
      { question: 'Which test is performed to determine the bearing capacity of soil in the field?', options: ['Vane shear test', 'Plate load test', 'Standard proctor test', 'Consolidation test'], answer: 1, hint: 'The plate load test determines ultimate bearing capacity and settlement behavior.' },
      { question: 'The maximum bulking of sand occurs at a moisture content of about:', options: ['1-2%', '4-6%', '10-12%', '15-18%'], answer: 1, hint: 'Moisture of 4-6% forms film surface tension around sand grains, maximizing volume bulking.' },
      { question: 'The dynamic viscosity of water is:', options: ['Higher than air', 'Lower than air', 'Equal to air', 'Zero'], answer: 0, hint: 'Water is much more resistant to shear forces than air at room temperature.' },
      { question: 'A soil having a uniformity coefficient less than 2 is called:', options: ['Well graded', 'Uniformly graded', 'Gap graded', 'Coarse graded'], answer: 1, hint: 'Cu less than 2 implies a narrow range of grain sizes (uniformly graded).' },
      { question: 'What is the primary objective of primary sewage treatment?', options: ['Biological decomposition', 'Removal of large suspended organic & inorganic solids', 'Chemical disinfection', 'Nutrient removal'], answer: 1, hint: 'Primary treatment uses screens and sedimentation basins to settle solids.' },
      { question: 'The maximum bending moment in a simply supported beam with UDL occurs at:', options: ['Supports', 'One-third points', 'Mid-span', 'Quarter points'], answer: 2, hint: 'For a beam with UDL w, max bending moment is wL^2 / 8 at mid-span.' },
      { question: 'Which structure is specifically designed to resist lateral earth pressure?', options: ['Column footing', 'Retaining wall', 'Suspension bridge cable', 'Piles under tension'], answer: 1, hint: 'Retaining walls hold back soil and resist lateral thrust pressures.' },
      { question: 'In prestressed concrete, the loss due to elastic shortening is zero in:', options: ['Pre-tensioned members', 'Post-tensioned members if tensioned simultaneously', 'Both of these', 'None of these'], answer: 1, hint: 'Post-tensioning wires tensioned all at once do not experience progressive shortening losses.' },
      { question: 'What is the main chemical constituent of OPC cement?', options: ['Silica', 'Alumina', 'Lime (CaO)', 'Iron oxide'], answer: 2, hint: 'Lime (Calcium Oxide) forms about 60-67% of Portland cement composition.' },
      { question: 'Which instrument is used to measure turbidity in drinking water?', options: ['Nephelometer', 'Colorimeter', 'pH meter', 'Imhoff cone'], answer: 0, hint: 'Nephelometers measure light scattered at 90 degrees by suspended particles.' },
      { question: 'The critical path in project scheduling has a total float of:', options: ['Zero', 'Maximum', 'Negative', 'Infinite'], answer: 0, hint: 'Critical path activities cannot be delayed without delaying the project, meaning float is zero.' },
      { question: 'What is the relationship between degree of saturation, void ratio, water content, and specific gravity?', options: ['Se = wG', 'S / e = w / G', 'S * w = e * G', 'None of these'], answer: 0, hint: 'The fundamental relation is S * e = w * G.' },
      { question: 'In a column, the slenderness ratio is the ratio of effective length to:', options: ['Least lateral dimension', 'Least radius of gyration', 'Cross-sectional area', 'Total height'], answer: 1, hint: 'Slenderness ratio lambda = Leff / r_min.' }
    ]
  },
  {
    name: 'UGC NET Paper 1 General Aptitude',
    mcqs: [
      { question: 'Which of the following is the primary objective of teaching?', options: ['To dictate notes', 'To facilitate student learning & behavioral change', 'To prepare for exams only', 'To maintain classroom silence'], answer: 1, hint: 'Teaching focuses on guiding students towards self-learning and permanent positive behavioral change.' },
      { question: 'What is the main purpose of formative evaluation?', options: ['Grade students at the end', 'Monitor learning progress and provide ongoing feedback', 'Certify course completion', 'Select students for admission'], answer: 1, hint: 'Formative evaluation is diagnostic and conducted during instruction to improve learning.' },
      { question: 'The research method that investigates cause-and-effect relationships is:', options: ['Historical research', 'Descriptive survey', 'Experimental research', 'Phenomenology'], answer: 2, hint: 'Experimental research manipulates independent variables to measure effects on dependent variables.' },
      { question: 'Which of the following is considered a primary source of historical data?', options: ['Personal diaries and original letters', 'Textbooks published in 2020', 'Biographies written by secondary historians', 'Encyclopedia articles'], answer: 0, hint: 'Primary sources are first-hand, direct records created during the event period.' },
      { question: 'In communication, the process of translating thoughts into signals is called:', options: ['Decoding', 'Encoding', 'Feedback', 'Medium selection'], answer: 1, hint: 'Encoding is converting message ideas into transmittable verbal/non-verbal symbols.' },
      { question: 'Which of the following is a barrier to effective classroom communication?', options: ['Clear pronunciation', 'Semantic noise (ambiguous language)', 'Active student listening', 'Visual aids usage'], answer: 1, hint: 'Semantic barriers arise when sender and receiver interpret words differently.' },
      { question: 'What does ICT stand for?', options: ['Information and Communication Technology', 'Inter-network Computer Transfer', 'Integrated Communication Terminal', 'None of these'], answer: 0, hint: 'ICT refers to technologies used to manage, transmit, and process information.' },
      { question: 'Which protocol is used for sending emails over the internet?', options: ['HTTP', 'FTP', 'SMTP', 'POP3'], answer: 2, hint: 'SMTP (Simple Mail Transfer Protocol) is used to push mail messages to servers.' },
      { question: 'The main greenhouse gas responsible for global warming is:', options: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Argon'], answer: 2, hint: 'CO2 traps infrared radiation, contributing heavily to the greenhouse effect.' },
      { question: 'Which regulatory body governs higher education policies and funding in India?', options: ['NCERT', 'CBSE', 'University Grants Commission (UGC)', 'NCTE'], answer: 2, hint: 'UGC coordinates, determines, and maintains standards of university education.' },
      { question: 'What is the value of 2 + 2 * 2 according to BODMAS rules?', options: ['8', '6', '4', '0'], answer: 1, hint: 'Multiplication is performed first: 2 * 2 = 4. Then addition: 2 + 4 = 6.' },
      { question: 'A series is given: 2, 4, 8, 16, ... What is the next term?', options: ['20', '24', '32', '64'], answer: 2, hint: 'Each term is multiplied by 2 (geometric progression). 16 * 2 = 32.' },
      { question: 'Which of the following is a non-probability sampling method?', options: ['Simple Random Sampling', 'Stratified Sampling', 'Purposive/Judgmental Sampling', 'Cluster Sampling'], answer: 2, hint: 'Purposive sampling selects subjects based on researcher judgment, not random chance.' },
      { question: 'What is the name of the portal launched by the Ministry of Education for online MOOC courses?', options: ['Swayam', 'Diksha', 'Shodhganga', 'Swayam Prabha'], answer: 0, hint: 'SWAYAM (Study Webs of Active-Learning for Young Aspiring Minds) hosts online courses.' },
      { question: 'Which type of memory is volatile and loses data when power is turned off?', options: ['ROM', 'Hard Disk', 'RAM', 'Flash Drive'], answer: 2, hint: 'RAM (Random Access Memory) is temporary volatile working storage.' }
    ]
  },
  {
    name: 'UGC NET Commerce Exam Booster',
    mcqs: [
      { question: 'Which accounting concept states that a business will continue to operate indefinitely?', options: ['Money measurement concept', 'Going concern concept', 'Business entity concept', 'Dual aspect concept'], answer: 1, hint: 'The going concern assumption assumes the firm will not liquidate in the foreseeable future.' },
      { question: 'The difference between total assets and total liabilities is known as:', options: ['Net profit', 'Working capital', 'Owner\'s equity (Capital)', 'Gross margin'], answer: 2, hint: 'Assets = Liabilities + Owner\'s Equity.' },
      { question: 'What is the primary function of marketing management?', options: ['Cost control', 'Satisfying customer needs and creating value', 'Product packaging only', 'Share price inflation'], answer: 1, hint: 'Modern marketing focuses on identifying and delivering customer satisfaction.' },
      { question: 'Under which market structure is there a single seller of a product with no close substitutes?', options: ['Perfect competition', 'Monopoly', 'Oligopoly', 'Monopolistic competition'], answer: 1, hint: 'A monopoly has total market power with a single supplier.' },
      { question: 'Which index is primarily used to measure the change in average price level of consumer goods?', options: ['WPI', 'CPI', 'GDP deflator', 'BSE Sensex'], answer: 1, hint: 'The Consumer Price Index (CPI) tracks household cost changes.' },
      { question: 'What does WTO stand for in global trade?', options: ['World Trade Organization', 'Western Tariff Office', 'World Transport Order', 'None of these'], answer: 0, hint: 'WTO is the global body regulating rules of trade between nations.' },
      { question: 'The process of attracting suitable candidates to apply for a vacancy is called:', options: ['Selection', 'Recruitment', 'Orientation', 'Appraisal'], answer: 1, hint: 'Recruitment is positive search for prospective employees; selection is filtering them.' },
      { question: 'Which institution regulates the monetary policy and credit controls in India?', options: ['State Bank of India', 'Reserve Bank of India', 'SEBI', 'Ministry of Finance'], answer: 1, hint: 'The RBI administers interest rates, repo rates, and reserves to control liquidity.' },
      { question: 'The formula for break-even point in units is:', options: ['Fixed Costs / Contribution per unit', 'Variable Costs / Sales', 'Fixed Costs / Profit Margin', 'Sales / Fixed Costs'], answer: 0, hint: 'Break-even point occurs when total contribution equals total fixed costs.' },
      { question: 'What is the main objective of corporate financial management?', options: ['Maximizing sales revenue', 'Maximizing shareholder wealth', 'Minimizing tax payments', 'Maximizing employee count'], answer: 1, hint: 'Wealth maximization (market price of shares) is the primary goal.' },
      { question: 'Which theory explains international trade based on differences in opportunity costs?', options: ['Absolute advantage theory', 'Comparative advantage theory', 'Mercantilism', 'Factor endowment theory'], answer: 1, hint: 'David Ricardo proposed comparative advantage based on relative efficiency ratios.' },
      { question: 'What is the maximum number of partners in a general partnership firm under Companies Rules 2014?', options: ['10 partners', '20 partners', '50 partners', '100 partners'], answer: 2, hint: 'The limit is set at 50 partners for general partnerships.' },
      { question: 'Which audit is conducted continuously throughout the financial year at regular intervals?', options: ['Statutory audit', 'Internal audit', 'Continuous audit', 'Balance sheet audit'], answer: 2, hint: 'Continuous audits help in immediate detection of accounting errors.' },
      { question: 'What is the base slab structure of GST (Goods and Services Tax) in India?', options: ['Single flat rate', 'Five primary tiers (0%, 5%, 12%, 18%, 28%)', 'Ten different percentage categories', 'None of these'], answer: 1, hint: 'GST India divides products into 4 active brackets plus exempt items.' },
      { question: 'The concept of the "Double Entry System" of bookkeeping was first published by:', options: ['Adam Smith', 'Luca Pacioli', 'Alfred Marshall', 'F.W. Taylor'], answer: 1, hint: 'Luca Pacioli published Summa de Arithmetica in Venice in 1494.' }
    ]
  },
  {
    name: 'UGC NET History Practice Paper',
    mcqs: [
      { question: 'Who was the founder of the ancient Maurya Empire?', options: ['Chandragupta Maurya', 'Ashoka the Great', 'Bindusara', 'Chandragupta II'], answer: 0, hint: 'Chandragupta Maurya founded the dynasty in 322 BCE with Chanakya\'s guidance.' },
      { question: 'The famous Indus Valley site Harappa is situated on the banks of which river?', options: ['Indus', 'Ravi', 'Ghaggar', 'Sutlej'], answer: 1, hint: 'Harappa is located in Punjab, Pakistan on the old bank of the Ravi river.' },
      { question: 'Which Buddhist council was held during the reign of Emperor Ashoka?', options: ['First council', 'Second council', 'Third council', 'Fourth council'], answer: 2, hint: 'The Third Buddhist Council was held at Pataliputra under Ashoka\'s patronage.' },
      { question: 'Who wrote the famous book \'Indica\', describing Mauryan administration?', options: ['Chanakya', 'Megasthenes', 'Fa-Hien', 'Hiuen Tsang'], answer: 1, hint: 'Megasthenes was a Greek ambassador sent by Seleucus I to Chandragupta\'s court.' },
      { question: 'The battle of Tarain (1191 AD) was fought between Prithviraj Chauhan and:', options: ['Mahmud of Ghazni', 'Muhammad Ghori', 'Babur', 'Alauddin Khalji'], answer: 1, hint: 'Prithviraj Chauhan defeated Ghori in the first battle but lost the second in 1192.' },
      { question: 'Who was the first ruler and founder of the Slave Dynasty in India?', options: ['Iltutmish', 'Qutb-ud-din Aibak', 'Balban', 'Razia Sultana'], answer: 1, hint: 'Aibak established the Mamluk/Slave dynasty in 1206.' },
      { question: 'The famous monument Taj Mahal was built by which Mughal Emperor?', options: ['Akbar', 'Jahangir', 'Shah Jahan', 'Aurangzeb'], answer: 2, hint: 'Shah Jahan built it in memory of his wife Mumtaz Mahal.' },
      { question: 'In which year did the East India Company acquire the Diwani rights over Bengal?', options: ['1757', '1764', '1765', '1773'], answer: 2, hint: 'The Treaty of Allahabad in 1765 granted Diwani rights following the Battle of Buxar.' },
      { question: 'Who was the founder of the Arya Samaj organization?', options: ['Raja Ram Mohan Roy', 'Swami Dayanand Saraswati', 'Swami Vivekananda', 'Keshab Chandra Sen'], answer: 1, hint: 'Swami Dayanand Saraswati founded the Vedic reform movement in 1875.' },
      { question: 'The famous Partition of Bengal took place in which year?', options: ['1905', '1911', '1919', '1925'], answer: 0, hint: 'Lord Curzon partitioned Bengal in 1905, leading to the Swadeshi movement.' },
      { question: 'Who was the first President of the Indian National Congress in 1885?', options: ['A.O. Hume', 'W.C. Bonnerjee', 'Dadabhai Naoroji', 'Gopal Krishna Gokhale'], answer: 1, hint: 'Womesh Chandra Bonnerjee presided over the first session in Bombay.' },
      { question: 'In which year did Mahatma Gandhi lead the Salt Satyagraha (Dandi March)?', options: ['1920', '1930', '1942', '1947'], answer: 1, hint: 'The Dandi March started on March 12, 1930 and marked the Civil Disobedience launch.' },
      { question: 'The Quit India Movement was launched in which year?', options: ['1940', '1942', '1945', '1946'], answer: 1, hint: 'Gandhi gave the call "Do or Die" in August 1942 at Bombay.' },
      { question: 'Who was the first Governor-General of independent India?', options: ['C. Rajagopalachari', 'Lord Mountbatten', 'Dr. Rajendra Prasad', 'Jawaharlal Nehru'], answer: 1, hint: 'Lord Mountbatten served as Governor-General until Rajagopalachari succeeded him in 1948.' },
      { question: 'Which ancient inscription provides details about Ashoka\'s Kalinga war?', options: ['Rummindei Pillar Inscription', 'Allahabad Pillar Inscription', 'Major Rock Edict XIII', 'Junagarh Inscription'], answer: 2, hint: 'Rock Edict 13 describes the slaughter and Ashoka\'s transition to Dhamma.' }
    ]
  },
  {
    name: 'CSIR NET Life Sciences Prep',
    mcqs: [
      { question: 'Which organelle is responsible for cellular respiration and ATP production?', options: ['Lysosome', 'Mitochondria', 'Golgi apparatus', 'Endoplasmic reticulum'], answer: 1, hint: 'Mitochondria are the powerhouses containing enzymes for TCA cycle and ETC.' },
      { question: 'What is the primary site of protein translation inside a cell?', options: ['Nucleolus', 'Ribosome', 'Peroxisome', 'Lysosome'], answer: 1, hint: 'Ribosomes read mRNA and link amino acids to synthesize polypeptide chains.' },
      { question: 'The genetic material of retroviruses (like HIV) is:', options: ['Double-stranded DNA', 'Single-stranded RNA', 'Circular DNA', 'Z-DNA'], answer: 1, hint: 'Retroviruses store genomes as RNA and use reverse transcriptase to build DNA inside host cells.' },
      { question: 'Which molecule serves as the primary chemical energy currency of the cell?', options: ['ADP', 'ATP', 'NADH', 'Glucose'], answer: 1, hint: 'Adenosine Triphosphate (ATP) stores energy in phosphoanhydride bonds.' },
      { question: 'What is the process of copying DNA sequence into RNA called?', options: ['Replication', 'Translation', 'Transcription', 'Transduction'], answer: 2, hint: 'Transcription is carried out by RNA polymerase enzymes.' },
      { question: 'The double helix structure of DNA was proposed by whom in 1953?', options: ['Gregor Mendel', 'Watson and Crick', 'Robert Hooke', 'Louis Pasteur'], answer: 1, hint: 'James Watson and Francis Crick described the B-DNA structure using Rosalind Franklin\'s X-ray data.' },
      { question: 'Which hormone is primarily responsible for lowering blood glucose levels?', options: ['Glucagon', 'Adrenaline', 'Insulin', 'Thyroxine'], answer: 2, hint: 'Insulin promotes cellular glucose uptake and glycogen synthesis.' },
      { question: 'What is the main function of red blood cells (erythrocytes)?', options: ['Phagocytosis', 'Oxygen transport', 'Blood clotting', 'Antibody synthesis'], answer: 1, hint: 'Hemoglobin in red cells binds oxygen reversibly to transport it from lungs to tissues.' },
      { question: 'The process of programmed cell death is called:', options: ['Necrosis', 'Apoptosis', 'Autophagy', 'Senescence'], answer: 1, hint: 'Apoptosis is a clean, regulated self-destruction pathway in multicellular organisms.' },
      { question: 'Which vitamin is synthesized in the human skin in the presence of sunlight?', options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'], answer: 3, hint: 'UV radiation converts 7-dehydrocholesterol in skin to cholecalciferol (Vitamin D3).' },
      { question: 'What is the division of cytoplasm called during cell division?', options: ['Karyokinesis', 'Mitosis', 'Cytokinesis', 'Meiosis'], answer: 2, hint: 'Cytokinesis physically splits the parent cell into two daughter cells.' },
      { question: 'Which ecosystem generally exhibits the highest rate of primary productivity per unit area?', options: ['Desert', 'Open Ocean', 'Tropical Rainforest', 'Tundra'], answer: 2, hint: 'Warm temperatures, high rainfall, and dense foliage maximize photosynthesis rates.' },
      { question: 'The study of interactions between organisms and their physical environment is:', options: ['Taxonomy', 'Ecology', 'Genetics', 'Evolution'], answer: 1, hint: 'Ecology studies distribution, abundance, and interactions of organisms.' },
      { question: 'What is the primary antibody class produced during secondary immune responses?', options: ['IgM', 'IgG', 'IgA', 'IgE'], answer: 1, hint: 'IgG is the most abundant serum antibody class and dominates secondary memory responses.' },
      { question: 'Which molecule acts as the terminal electron acceptor in aerobic cellular respiration?', options: ['Water', 'Carbon dioxide', 'Oxygen', 'NAD+'], answer: 2, hint: 'Oxygen binds protons and electrons at the end of the ETC to form water.' }
    ]
  },
  {
    name: 'CSIR NET Chemical Sciences Mock',
    mcqs: [
      { question: 'What is the geometric shape of a water molecule (H2O)?', options: ['Linear', 'Bent / V-shaped', 'Tetrahedral', 'Trigonal planar'], answer: 1, hint: 'Oxygen has 2 bonding pairs and 2 lone pairs, resulting in a bent shape (104.5 degrees).' },
      { question: 'Which block of the periodic table contains the transition metal elements?', options: ['s-block', 'p-block', 'd-block', 'f-block'], answer: 2, hint: 'Transition metals are characterized by partially filled d subshells.' },
      { question: 'What is the pH value of a neutral aqueous solution at 25 degrees C?', options: ['0', '7', '14', '1'], answer: 1, hint: 'At neutral pH, [H+] = [OH-] = 10^-7 M, so pH = 7.' },
      { question: 'Which law states that pressure is inversely proportional to volume at constant temperature?', options: ['Charles\'s Law', 'Boyle\'s Law', 'Gay-Lussac\'s Law', 'Avogadro\'s Law'], answer: 1, hint: 'Boyle\'s Law states P1 * V1 = P2 * V2.' },
      { question: 'The hybridisation of the carbon atom in methane (CH4) is:', options: ['sp', 'sp2', 'sp3', 'dsp2'], answer: 2, hint: 'Methane carbon forms 4 single sigma bonds in a tetrahedral arrangement (sp3).' },
      { question: 'What is the primary catalyst used in the industrial Haber process for ammonia synthesis?', options: ['Nickel (Ni)', 'Platinum (Pt)', 'Iron (Fe)', 'Palladium (Pd)'], answer: 2, hint: 'Finely divided iron with molybdenum promoter is traditionally used.' },
      { question: 'Which gas is released when an active metal (like Zinc) reacts with dilute hydrochloric acid?', options: ['Oxygen', 'Hydrogen', 'Chlorine', 'Carbon dioxide'], answer: 1, hint: 'Zn + 2HCl -> ZnCl2 + H2 (hydrogen gas displacement).' },
      { question: 'What is the unit of the rate constant (k) for a first-order chemical reaction?', options: ['M / s', '1 / M.s', '1 / s (s^-1)', '1 / M^2.s'], answer: 2, hint: 'For first order, rate = k[A]. Units of k are 1 / time.' },
      { question: 'The process of heating ore in excess of air below its melting point is called:', options: ['Calcination', 'Roasting', 'Smelting', 'Bessemerisation'], answer: 1, hint: 'Roasting converts sulfide ores into metal oxides by heating in air.' },
      { question: 'Which isomerism arises due to different spatial arrangements of ligands around a metal center?', options: ['Linkage isomerism', 'Geometrical isomerism', 'Coordination isomerism', 'Ionisation isomerism'], answer: 1, hint: 'Geometrical isomerism (cis/trans, fac/mer) arises from spatial layouts.' },
      { question: 'What is the chemical formula of ozone gas?', options: ['O2', 'O3', 'O4', 'H2O2'], answer: 1, hint: 'Ozone is a triatomic allotrope of oxygen (O3).' },
      { question: 'Which acid is present in gastric juice of human stomach to aid digestion?', options: ['Sulphuric acid', 'Nitric acid', 'Hydrochloric acid (HCl)', 'Citric acid'], answer: 2, hint: 'The stomach lining secretes dilute hydrochloric acid (around pH 1.5-2.0).' },
      { question: 'Which molecule possesses a permanent dipole moment?', options: ['Carbon dioxide (CO2)', 'Ammonia (NH3)', 'Methane (CH4)', 'Boron trifluoride (BF3)'], answer: 1, hint: 'Ammonia has a trigonal pyramidal shape with net molecular dipole, unlike symmetric molecules.' },
      { question: 'What is the oxidation state of iron in rust (Fe2O3)?', options: ['+2', '+3', '0', '+6'], answer: 1, hint: 'Each oxygen is -2, so 2 * Fe + 3 * (-2) = 0 -> Fe = +3.' },
      { question: 'Which spectroscopic method is most commonly used to identify functional groups in organic molecules?', options: ['UV-Vis Spectroscopy', 'Infrared (IR) Spectroscopy', 'Mass Spectrometry', 'Flame Photometry'], answer: 1, hint: 'IR spectroscopy detects vibrational transitions unique to functional groups.' }
    ]
  },
  {
    name: 'LIC AAO General Insurance Mock Exam',
    mcqs: [
      { question: 'Insurance premium is paid to:', options: ['Transfer the risk', 'Increase the profit', 'Reduce the liability', 'Avoid taxation'], answer: 0, hint: 'Premium is paid by the insured to transfer the financial risk of loss to the insurer.' },
      { question: 'What does IRDAI stand for?', options: ['Insurance Regulatory and Development Authority of India', 'Indian Regulatory and Development Association of Insurance', 'Insurance Rights and Development Association of India', 'None of these'], answer: 0, hint: 'IRDAI is the statutory body that regulates and promotes the insurance and re-insurance industries in India.' },
      { question: 'The principle of utmost good faith in insurance is known as:', options: ['Uberrimae Fidei', 'Caveat Emptor', 'Quid Pro Quo', 'Consensus ad idem'], answer: 0, hint: 'Uberrimae Fidei is a Latin phrase meaning utmost good faith, a core principle in all insurance contracts.' },
      { question: 'A policy which covers loss of profit due to business interruption is:', options: ['Consequential Loss Policy', 'Marine Cargo Policy', 'Public Liability Policy', 'Reinsurance Policy'], answer: 0, hint: 'Consequential Loss Policy (or Business Interruption Insurance) covers profits lost during a shutdown.' },
      { question: 'Which index represents inflation in retail price in India?', options: ['CPI', 'WPI', 'GDP Deflator', 'Sensex'], answer: 0, hint: 'Consumer Price Index (CPI) measures the retail price inflation of goods and services.' },
      { question: 'What is the minimum capital required to set up an insurance company in India?', options: ['Rs 100 Crore', 'Rs 50 Crore', 'Rs 200 Crore', 'Rs 500 Crore'], answer: 0, hint: 'The Insurance Act, 1938 stipulates a minimum paid-up capital of Rs 100 Crore for direct insurers.' },
      { question: 'Double insurance is common in:', options: ['Life Insurance', 'Marine Insurance', 'Fire Insurance', 'None of these'], answer: 0, hint: 'Double insurance occurs when the same subject matter is insured with two or more insurers.' },
      { question: 'The person who assesses the value of property at the time of loss is called:', options: ['Surveyor/Loss Assessor', 'Actuary', 'Underwriter', 'Agent'], answer: 0, hint: 'Surveyors and Loss Assessors investigate, manage, and calculate the financial impact of claims.' },
      { question: 'Reinsurance is done by:', options: ['An insurance company with another insurance company', 'An individual with multiple companies', 'A company with a bank', 'None of these'], answer: 0, hint: 'Reinsurance is insurance that is purchased by an insurance company from another insurance company.' },
      { question: 'If an insured commits suicide within one year of taking life insurance, the company:', options: ['Might not pay the claim', 'Must pay the full claim', 'Pays double the claim', 'None of these'], answer: 0, hint: 'Standard suicide clauses in life insurance restrict or void coverage within the first 12 months.' },
      { question: 'Third-party insurance is compulsory for:', options: ['Motor vehicles', 'Houses', 'Factories', 'Life'], answer: 0, hint: 'Motor Vehicles Act makes third-party liability insurance mandatory for all on-road vehicles.' },
      { question: 'The pool of money collected from premiums is managed by:', options: ['Fund managers of insurance company', 'The government', 'IRDAI directly', 'None of these'], answer: 0, hint: 'Asset and liability management is handled by the insurance company\'s investment division.' },
      { question: 'Which committee recommended the opening up of the insurance sector in India?', options: ['Malhotra Committee', 'Narasimham Committee', 'Raghuram Rajan Committee', 'Kelkar Committee'], answer: 0, hint: 'Malhotra Committee (1994) recommended reforms and opening up to private and foreign entries.' },
      { question: 'Standard policy term for a health insurance policy is usually:', options: ['1 year', '5 years', '10 years', 'Whole life'], answer: 0, hint: 'Most health policies are issued for a 1-year term and renewed annually.' },
      { question: 'Bancassurance refers to:', options: ['Selling insurance products through bank branches', 'Banks taking loans from insurance companies', 'Merging banks with insurance firms', 'None of these'], answer: 0, hint: 'Bancassurance is an arrangement where banks and insurance companies partner to sell insurance.' }
    ]
  },
  {
    name: 'EMRS Non-Teaching Staff Practice Mock',
    mcqs: [
      { question: 'In EMRS, what does the acronym EMRS stand for?', options: ['Eklavya Model Residential School', 'English Medium Rural School', 'Elementary Model Regional School', 'Educational Model Residential Scheme'], answer: 0, hint: 'EMRS schools are set up by the Ministry of Tribal Affairs for quality education of scheduled tribes.' },
      { question: 'As a hostel warden, what is the primary duty towards students?', options: ['Ensure student safety and well-being', 'Manage the kitchen inventory only', 'Enforce strict silent hours all day', 'Report every minor issue to police'], answer: 0, hint: 'Student welfare, counseling, safety, and health care are the warden\'s primary responsibilities.' },
      { question: 'POCSO Act is related to the protection of:', options: ['Children from sexual offences', 'Women from domestic violence', 'Elderly people from neglect', 'Animals from cruelty'], answer: 0, hint: 'POCSO stands for Protection of Children from Sexual Offences Act, enacted in 2012.' },
      { question: 'What is the maximum age limit for child labor according to Indian law?', options: ['14 years', '16 years', '18 years', '12 years'], answer: 0, hint: 'Child Labour Act bans employment of children below 14 years in any occupation.' },
      { question: 'Which key is used to refresh a web page in a browser?', options: ['F5', 'F1', 'F11', 'F2'], answer: 0, hint: 'F5 is the standard browser command to reload the current page.' },
      { question: 'What is the full form of PDF?', options: ['Portable Document Format', 'Printable Document File', 'Personal Document Folder', 'Portable Data File'], answer: 0, hint: 'Adobe created the Portable Document Format (PDF) to present documents uniformly.' },
      { question: 'A Junior Secretariat Assistant primarily handles:', options: ['Filing, typing, and record maintenance', 'Designing school curriculum', 'Teaching science subjects', 'Managing security guard shift'], answer: 0, hint: 'JSA is a clerical post focused on data entry, dispatching mail, and file organization.' },
      { question: 'In MS Word, Ctrl + Z is a shortcut key for:', options: ['Undo', 'Redo', 'Cut', 'Paste'], answer: 0, hint: 'Ctrl + Z reverses the last typing or formatting action in MS Office.' },
      { question: 'Which of the following is NOT an input device of a computer?', options: ['Printer', 'Keyboard', 'Mouse', 'Scanner'], answer: 0, hint: 'A printer is an output device that produces physical hard copies.' },
      { question: 'The system of maintaining official files by recording correspondence is called:', options: ['Filing System', 'Accounting System', 'Auditing System', 'None of these'], answer: 0, hint: 'Filing keeps paper records organized in logical order.' },
      { question: 'Which government portal is used for online public procurement in India?', options: ['GeM', 'SWAYAM', 'GSTN', 'BHIM'], answer: 0, hint: 'Government e-Marketplace (GeM) allows departments to procure common services/goods online.' },
      { question: 'If a student falls sick in the school hostel, what should the warden do first?', options: ['Provide first aid and take to medical room', 'Call parents immediately', 'Ask other students to treat', 'Ignore till morning'], answer: 0, hint: 'Warden must render immediate care and check the student into the infirmary.' },
      { question: 'What is the maximum number of rows in MS Excel 2016?', options: ['1,048,576', '65,536', '1,000,000', '500,000'], answer: 0, hint: 'Modern versions of Excel support exactly 1,048,576 rows per worksheet.' },
      { question: 'Which department in a government school handles salaries and ledger accounts?', options: ['Accounts/Establishment Department', 'Academic Department', 'Sports Department', 'Hostel Department'], answer: 0, hint: 'Accounts handles budgeting, payments, salaries, and statutory deductions.' },
      { question: 'Official communication sent from one department to another in the same organization is called:', options: ['Office Memorandum', 'Circular', 'Notification', 'Press Release'], answer: 0, hint: 'OM (Office Memorandum) is a standard tool for inter-office or internal instructions.' }
    ]
  },
  {
    name: 'UP TGT/PGT School Teacher Mock Test',
    mcqs: [
      { question: 'According to Piaget\'s stages of cognitive development, the stage of formal operations begins at age:', options: ['11-15 years', '2-7 years', '7-11 years', '0-2 years'], answer: 0, hint: 'Formal operational stage starts around age 11/12 and involves abstract logic thinking.' },
      { question: 'What is the full form of NCERT?', options: ['National Council of Educational Research and Training', 'National Committee of Education, Research and Teaching', 'National Council of Elementary Research and Training', 'None of these'], answer: 0, hint: 'NCERT is an autonomous organisation advising the central and state governments on school education.' },
      { question: 'Which teaching method is most suitable for developing creative thinking?', options: ['Brainstorming', 'Lecture method', 'Textbook reading', 'Memorization'], answer: 0, hint: 'Brainstorming encourages pupils to generate diverse ideas without premature criticism.' },
      { question: 'The term Pedagogy refers to:', options: ['Theory and practice of teaching', 'Study of children\'s physical growth', 'Educational administration', 'None of these'], answer: 0, hint: 'Pedagogy covers the methods, theories, and instructional design used in education.' },
      { question: 'Diagnostic evaluation in classroom teaching is used to:', options: ['Identify learning difficulties of students', 'Assign grades at the end of term', 'Select students for scholarships', 'Compare performance with other schools'], answer: 0, hint: 'Diagnostic tests check prior gaps and pinpoint specific concept difficulties.' },
      { question: 'Who is known as the father of modern behaviorism?', options: ['John B. Watson', 'Sigmund Freud', 'Jean Piaget', 'B.F. Skinner'], answer: 0, hint: 'Watson published behaviorist principles first, advocating objective observations of actions.' },
      { question: 'What is the primary purpose of homework given to school students?', options: ['Reinforce and practice classroom learning', 'Keep students busy at home', 'Reduce teacher workload', 'Evaluate parents\' knowledge'], answer: 0, hint: 'Homework consolidates the skills introduced during direct class instructions.' },
      { question: 'Micro-teaching is used by teachers to practice:', options: ['Specific teaching skills', 'Complete classroom lessons', 'Preparing exam papers', 'Maintaining class discipline'], answer: 0, hint: 'Micro-teaching scales down class size and time to master specific instructional methods.' },
      { question: 'According to NEP 2020, the current 10+2 system is replaced by:', options: ['5+3+3+4 system', '5+3+2+2 system', '3+4+4+5 system', '4+3+3+5 system'], answer: 0, hint: 'NEP replaces 10+2 with Foundational (5), Preparatory (3), Middle (3), and Secondary (4) stages.' },
      { question: 'Cognitive domain in Bloom\'s Taxonomy deals with:', options: ['Knowledge and intellectual skills', 'Emotions and values', 'Physical and motor skills', 'Social skills'], answer: 0, hint: 'Cognitive covers memory, comprehension, application, analysis, synthesis, and evaluation.' },
      { question: 'The teacher is considered a:', options: ['Facilitator of learning', 'Authoritarian ruler', 'Passive observer', 'Information dispenser'], answer: 0, hint: 'Modern child-centric education positions the teacher as a guide/facilitator.' },
      { question: 'Inclusive education means:', options: ['Providing equal learning opportunities to all children', 'Separating disabled kids', 'Special curriculum for bright children', 'None of these'], answer: 0, hint: 'Inclusive classes integrate special needs kids in general educational classrooms.' },
      { question: 'Educational psychology is the study of:', options: ['How people learn in educational settings', 'School management systems', 'Teacher recruitment processes', 'None of these'], answer: 0, hint: 'It focuses on student development, learning theories, motivation, and instruction.' },
      { question: 'Which agency is responsible for curriculum design for school education in India?', options: ['NCERT', 'UGC', 'AICTE', 'NCTE'], answer: 0, hint: 'NCERT frames the National Curriculum Framework (NCF) for school boards.' },
      { question: 'What is the main objective of formative assessment?', options: ['Monitor student learning to provide ongoing feedback', 'Rank students', 'Certify final grades', 'Pass or fail students'], answer: 0, hint: 'Formative assessments occur mid-course to identify gaps and adjust active learning.' }
    ]
  },
  {
    name: 'Super TET Primary School Teacher Practice Mock',
    mcqs: [
      { question: 'Child Development starts from:', options: ['Prenatal stage', 'Infancy', 'Early childhood', 'Late childhood'], answer: 0, hint: 'Development begins at conception (prenatal period) and continues across life.' },
      { question: 'Under the RTE Act 2009, pupil-teacher ratio for primary classes (up to class V) should be:', options: ['30:1', '35:1', '40:1', '25:1'], answer: 0, hint: 'RTE Act dictates a 30:1 ratio for elementary primary levels.' },
      { question: 'Which of the following is a primary socialization agency?', options: ['Family', 'School', 'Media', 'Government'], answer: 0, hint: 'Family is the immediate and first source of language and values for a child.' },
      { question: 'The concept of Zone of Proximal Development (ZPD) was given by:', options: ['Lev Vygotsky', 'Jean Piaget', 'Jerome Bruner', 'Lawrence Kohlberg'], answer: 0, hint: 'Vygotsky defined ZPD as the difference between independent ability and assisted potential.' },
      { question: 'Dysgraphia is a learning disability characterized by difficulty in:', options: ['Writing', 'Reading', 'Calculation', 'Speaking'], answer: 0, hint: 'Dysgraphia primarily affects fine motor writing skills and spelling mechanics.' },
      { question: 'A primary teacher should focus on which type of teaching aid for young kids?', options: ['Concrete and visual objects', 'Abstract lectures', 'Reference textbooks', 'Video lectures only'], answer: 0, hint: 'Children learn best from tangible objects they can touch and see.' },
      { question: 'What is the main source of energy for the earth?', options: ['Sun', 'Coal', 'Petroleum', 'Wind'], answer: 0, hint: 'Solar energy fuels weather systems, water cycles, and plant photosynthesis.' },
      { question: 'In a primary school, the primary language of instruction should be:', options: ['Mother tongue / Regional language', 'English', 'Hindi', 'Sanskrit'], answer: 0, hint: 'Primary cognitive expansion is smoothest in the child\'s native tongue.' },
      { question: 'According to Vygotsky, children learn language through:', options: ['Social interaction', 'Imitation only', 'Innate mechanism', 'None of these'], answer: 0, hint: 'Sociocultural interactions drive the internalization of linguistic signs.' },
      { question: 'The process of taking in new information into existing mental schemas is:', options: ['Assimilation', 'Accommodation', 'Equilibration', 'Schema creation'], answer: 0, hint: 'Assimilation fits new data into current cognitive constructs without changing them.' },
      { question: 'Which method is most effective for teaching subtraction to primary students?', options: ['Concrete representations like beads', 'Writing formula on blackboard', 'Memorizing tables', 'Reading textbook aloud'], answer: 0, hint: 'Manipulative objects help visualize subtraction operations.' },
      { question: 'The environment studies (EVS) syllabus at primary level is designed on:', options: ['Thematic approach', 'Disciplinary approach', 'Subject-wise approach', 'None of these'], answer: 0, hint: 'EVS integrates family, food, shelter, water, and travel into themes.' },
      { question: 'Which of the following is a biotic component of environment?', options: ['Plants', 'Air', 'Water', 'Soil'], answer: 0, hint: 'Biotic components comprise the living parts of an ecosystem, like flora and fauna.' },
      { question: 'The teacher should treat student mistakes as:', options: ['Windows into student thinking', 'Signs of low intelligence', 'Violations of discipline', 'Occasions for punishment'], answer: 0, hint: 'Errors show current misconceptions and provide teaching guideposts.' },
      { question: 'Play-way method of teaching was introduced by:', options: ['Froebel', 'Montessori', 'John Dewey', 'Rousseau'], answer: 0, hint: 'Friedrich Froebel, the creator of Kindergarten, integrated play and learning.' }
    ]
  },
  {
    name: 'FSSAI Food Technology Officer Mock Exam',
    mcqs: [
      { question: 'Which agency regulates food safety standards in India?', options: ['FSSAI', 'ISI', 'AGMARK', 'BIS'], answer: 0, hint: 'Food Safety and Standards Authority of India (FSSAI) is the apex food regulator.' },
      { question: 'What is the primary purpose of food pasteurization?', options: ['Destroy pathogenic microorganisms', 'Improve food taste', 'Increase food weight', 'Bleach the food color'], answer: 0, hint: 'Pasteurization uses heat to kill disease-carrying bacteria and extend shelf life.' },
      { question: 'The temperature range of Danger Zone for food safety is:', options: ['5°C to 60°C', '0°C to 100°C', '-20°C to 0°C', '60°C to 120°C'], answer: 0, hint: 'Pathogens replicate rapidly in foods kept between 5°C and 60°C.' },
      { question: 'Which acid is naturally present in lemon?', options: ['Citric acid', 'Acetic acid', 'Lactic acid', 'Tartaric acid'], answer: 0, hint: 'Citrus fruits contain high levels of organic citric acid.' },
      { question: 'HTST pasteurization of milk is carried out at:', options: ['72°C for 15 seconds', '63°C for 30 minutes', '100°C for 1 minute', '135°C for 2 seconds'], answer: 0, hint: 'High-Temperature Short-Time (HTST) pasteurizer runs at 71.7°C to 72°C for 15 seconds.' },
      { question: 'What does HACCP stand for?', options: ['Hazard Analysis Critical Control Point', 'Hazard Assessment Common Control Protocol', 'Hygiene and Cleanliness Control Process', 'None of these'], answer: 0, hint: 'HACCP is a systematic preventive approach to food safety from biological/chemical hazards.' },
      { question: 'The blue-green mold found on bread is typically:', options: ['Penicillium', 'Aspergillus', 'Rhizopus', 'Yeast'], answer: 0, hint: 'Penicillium glaucum or digitatum is a common mold on organic starches.' },
      { question: 'Food additive MSG stands for:', options: ['Monosodium glutamate', 'Methyl sodium glycolate', 'Mono sodium glyceride', 'None of these'], answer: 0, hint: 'MSG is the sodium salt of glutamic acid, used as a flavor enhancer.' },
      { question: 'Which vitamin is highly sensitive to heat and easily destroyed during cooking?', options: ['Vitamin C', 'Vitamin A', 'Vitamin D', 'Vitamin K'], answer: 0, hint: 'Ascorbic acid (Vitamin C) oxidizes and breaks down at boiling temperatures.' },
      { question: 'The major protein present in cow\'s milk is:', options: ['Casein', 'Albumin', 'Gluten', 'Myosin'], answer: 0, hint: 'Casein forms about 80% of total milk proteins.' },
      { question: 'Which gas is filled in potato chip packets to prevent rancidity?', options: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Helium'], answer: 0, hint: 'Nitrogen displaces oxygen, preventing oxidation of lipids.' },
      { question: 'Water activity (aw) in foods represents:', options: ['Available free water for microbial growth', 'Total water content', 'Bound water content', 'None of these'], answer: 0, hint: 'Water activity is the ratio of vapor pressure of food to pure water.' },
      { question: 'Rigor mortis is related to the processing of:', options: ['Meat', 'Fruits', 'Vegetables', 'Grains'], answer: 0, hint: 'Rigor mortis represents post-mortem stiffening of muscle fibers in meat.' },
      { question: 'Canning of food was invented by:', options: ['Nicolas Appert', 'Louis Pasteur', 'Alexander Fleming', 'Robert Koch'], answer: 0, hint: 'Appert invented preservation by placing food in jars and heating them in 1810.' },
      { question: 'FSS Act was enacted by the Parliament of India in the year:', options: ['2006', '2011', '2000', '2016'], answer: 0, hint: 'The Food Safety and Standards Act was passed in 2006, consolidating old laws.' }
    ]
  },
  {
    name: 'AIIMS NORCET Nursing Officer Practice Mock',
    mcqs: [
      { question: 'What is the normal pulse rate of a healthy adult?', options: ['60-100 bpm', '50-60 bpm', '100-120 bpm', '40-50 bpm'], answer: 0, hint: 'The normal range of adult heart beats is 60 to 100 beats per minute.' },
      { question: 'Which route of drug administration provides the fastest absorption?', options: ['Intravenous (IV)', 'Oral', 'Intramuscular (IM)', 'Subcutaneous'], answer: 0, hint: 'IV delivery injects drugs directly into systemic circulation.' },
      { question: 'The infection acquired by a patient during hospital stay is called:', options: ['Nosocomial infection', 'Idiopathic infection', 'Latent infection', 'Iatrogenic infection'], answer: 0, hint: 'Hospital-acquired infections are referred to as nosocomial.' },
      { question: 'What is the size of an IV cannula used for blood transfusion in adults?', options: ['18 G (Green)', '22 G (Blue)', '24 G (Yellow)', '26 G (Purple)'], answer: 0, hint: 'A larger bore (18 Gauge) is required to prevent hemolysis during rapid blood infusions.' },
      { question: 'Which position is recommended for a patient who is short of breath?', options: ['Fowler\'s position', 'Supine position', 'Prone position', 'Trendelenburg position'], answer: 0, hint: 'Fowler\'s (semi-sitting) allows maximal lung chest expansion.' },
      { question: 'What is the primary cause of bedsores (decubitus ulcers)?', options: ['Prolonged pressure on bony prominences', 'Excess nutrition', 'Frequent bathing', 'High blood pressure'], answer: 0, hint: 'Ischemia due to local tissue compression cuts off local circulation.' },
      { question: 'What is the normal pH of arterial blood?', options: ['7.35 - 7.45', '6.80 - 7.00', '7.00 - 7.15', '7.50 - 7.60'], answer: 0, hint: 'Tight blood pH buffers must remain within 7.35 to 7.45 for metabolic enzymes.' },
      { question: 'The instrument used to check the lungs and heart sounds is:', options: ['Stethoscope', 'Sphygmomanometer', 'Otoscope', 'Laryngoscope'], answer: 0, hint: 'A stethoscope amplifies internal body acoustic sounds.' },
      { question: 'Which electrolyte imbalance is majorly associated with cardiac arrhythmias?', options: ['Potassium (K+)', 'Sodium (Na+)', 'Calcium (Ca2+)', 'Magnesium (Mg2+)'], answer: 0, hint: 'Potassium drives cardiac cell repolarization; hyper/hypokalemia causes dysrhythmias.' },
      { question: 'The first milk produced by the mother after childbirth is called:', options: ['Colostrum', 'Fore-milk', 'Hind-milk', 'Transitional milk'], answer: 0, hint: 'Colostrum is thick, yellowish, and rich in maternal immunoglobulins.' },
      { question: 'Which vitamin deficiency causes night blindness?', options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'], answer: 0, hint: 'Vitamin A (retinol) is required to form visual purple rhodopsin.' },
      { question: 'The method used to open the airway of a suspected spinal injury patient is:', options: ['Jaw-thrust maneuver', 'Head-tilt chin-lift', 'Heimlich maneuver', 'None of these'], answer: 0, hint: 'Jaw-thrust opens the airway without hyperextending the cervical neck.' },
      { question: 'Which hormone increases water reabsorption in the kidneys?', options: ['Antidiuretic hormone (ADH)', 'Aldosterone', 'Insulin', 'Thyroxine'], answer: 0, hint: 'ADH inserts aquaporins in collecting ducts to retain blood water.' },
      { question: 'What is the color code of a bio-medical waste bag for discarding anatomical waste?', options: ['Yellow', 'Red', 'Blue', 'Black'], answer: 0, hint: 'Placenta, organs, and tissue waste go in yellow incinerator bags.' },
      { question: 'What is the standard sterilization temperature and pressure in an autoclave?', options: ['121°C at 15 psi for 15-20 mins', '100°C at 10 psi for 30 mins', '134°C at 30 psi for 5 mins', 'None of these'], answer: 0, hint: 'Pressurized steam reaches 121°C to kill heat-resistant bacterial spores.' }
    ]
  },
  {
    name: 'Civil Engineering Core Practice Mock',
    mcqs: [
      { question: 'What is the main raw material used for manufacturing Portland cement?', options: ['Limestone', 'Clay', 'Gypsum', 'Silica'], answer: 0, hint: 'Calcareous raw materials (limestone/chalk) provide lime (CaO) for clinker.' },
      { question: 'The modular brick size is:', options: ['19 cm x 9 cm x 9 cm', '20 cm x 10 cm x 10 cm', '22.8 cm x 11.2 cm x 7 cm', '20 cm x 20 cm x 10 cm'], answer: 0, hint: 'Nominal brick size is 20x10x10 cm, while standard size is 19x9x9 cm.' },
      { question: 'The slump test is used to measure concrete\'s:', options: ['Workability', 'Compressive strength', 'Tensile strength', 'Soundness'], answer: 0, hint: 'The distance concrete drops measures mix workability and ease of placement.' },
      { question: 'Poisson\'s ratio for concrete is approximately:', options: ['0.15 to 0.20', '0.35 to 0.40', '0.45 to 0.50', '0.05 to 0.08'], answer: 0, hint: 'Standard structural concrete has a Poisson\'s ratio in the range of 0.15-0.2.' },
      { question: 'A beam supported on more than two supports is called:', options: ['Continuous beam', 'Simply supported beam', 'Cantilever beam', 'Fixed beam'], answer: 0, hint: 'Continuous beams span over multiple intermediate column supports.' },
      { question: 'The maximum shear stress in a rectangular beam cross-section occurs at:', options: ['Neutral axis', 'Top fiber', 'Bottom fiber', 'Mid-depth of top half'], answer: 0, hint: 'Shear stress distribution is parabolic, peaking at the neutral axis layer.' },
      { question: 'According to Terzaghi, the bearing capacity of soil depends on:', options: ['Cohesion, angle of internal friction, unit weight', 'Cohesion only', 'Friction angle only', 'Soil color'], answer: 0, hint: 'The capacity factors Nc, Nq, and Ngamma reflect soil shear and weight parameters.' },
      { question: 'Liquid limit and plastic limit tests are performed on:', options: ['Fine-grained soils', 'Coarse-grained soils', 'Gravels', 'None of these'], answer: 0, hint: 'Atterberg limits evaluate the plasticity index of silts and clays.' },
      { question: 'The unit of dynamic viscosity is:', options: ['Pascal-second (Pa.s)', 'm2/s', 'Poise only', 'Stoke'], answer: 0, hint: 'SI unit of dynamic viscosity is Pa.s, equivalent to N.s/m2.' },
      { question: 'The fundamental principle of surveying is:', options: ['Working from whole to part', 'Working from part to whole', 'Measuring local coordinates first', 'None of these'], answer: 0, hint: 'Whole-to-part principles prevent local mapping errors from expanding.' },
      { question: 'Which instrument is used to measure discharge in a pipe?', options: ['Venturimeter', 'Pitot tube', 'Anemometer', 'Barometer'], answer: 0, hint: 'A venturimeter creates a pressure differential to calculate fluid flow rates.' },
      { question: 'The process of adjusting the line of sight of a level is called:', options: ['Collimation adjustment', 'Focusing', 'Centering, Levelling', 'None of these'], answer: 0, hint: 'Temporary or permanent adjustments align the bubble tube axis and telescope sight line.' },
      { question: 'The main chemical compound responsible for early strength of cement is:', options: ['Tricalcium Silicate (C3S)', 'Dicalcium Silicate (C2S)', 'Tricalcium Aluminate (C3A)', 'None of these'], answer: 0, hint: 'C3S hydrates rapidly to govern strength development within first 7 days.' },
      { question: 'The coefficient of curvature (Cc) for a well-graded soil lies between:', options: ['1 and 3', '3 and 6', '0 and 1', 'Greater than 6'], answer: 0, hint: 'For well-graded sand or gravel, Cc must be in the range [1, 3].' },
      { question: 'If the pH of water is less than 7, the water is:', options: ['Acidic', 'Basic', 'Neutral', 'Saline'], answer: 0, hint: 'pH scales from 0 to 14; values under 7 signify acid levels.' }
    ]
  },
  {
    name: 'Electrical Engineering Core Practice Mock',
    mcqs: [
      { question: 'What is the unit of magnetic flux density?', options: ['Tesla', 'Weber', 'Henry', 'Ampere-turn'], answer: 0, hint: 'Tesla (T) measures magnetic induction flux lines per square meter.' },
      { question: 'According to Kirchhoff\'s Current Law (KCL), the algebraic sum of currents at a node is:', options: ['Zero', 'Positive', 'Negative', 'Infinite'], answer: 0, hint: 'Charge conservation dictates that sum of entering currents equals sum of leaving currents.' },
      { question: 'The power factor of a purely capacitive circuit is:', options: ['Zero leading', 'Zero lagging', 'Unity', '0.8 lagging'], answer: 0, hint: 'Current leads voltage by 90 degrees in ideal capacitors, making cos 90 = 0 leading.' },
      { question: 'A transformer does not change which of the following parameters?', options: ['Frequency', 'Voltage', 'Current', 'All of these'], answer: 0, hint: 'Transformers change AC voltage/current levels but keep frequency constant.' },
      { question: 'Speed of a DC shunt motor can be controlled by:', options: ['Armature voltage control', 'Field current control', 'Both of these', 'None of these'], answer: 2, hint: 'DC motor speed is proportional to Eb and inversely proportional to flux.' },
      { question: 'In a synchronous machine, the armature winding is placed on:', options: ['Stator', 'Rotor', 'Yoke', 'None of these'], answer: 0, hint: 'Placing the high-power armature on stator is mechanically easier than on rotor.' },
      { question: 'What is the function of a moderator in a nuclear power plant?', options: ['Slow down fast neutrons', 'Absorb neutrons', 'Cool the reactor', 'Control steam flow'], answer: 0, hint: 'Light water/graphite slows down neutrons to maximize thermal fission probabilities.' },
      { question: 'Which relay is used for the protection of transformers against internal faults?', options: ['Buchholz relay', 'Impedance relay', 'Mho relay', 'Thermal relay'], answer: 0, hint: 'Buchholz is a gas-actuated relay installed in oil-filled transformer pipes.' },
      { question: 'The skin effect in a transmission line conductor:', options: ['Increases effective resistance', 'Decreases effective resistance', 'Has no effect', 'None of these'], answer: 0, hint: 'AC current concentrates on conductor surfaces, reducing effective cross-sectional area.' },
      { question: 'The semiconductor device which can conduct current in both directions is:', options: ['TRIAC', 'DIAC', 'SCR', 'MOSFET'], answer: 0, hint: 'TRIAC is equivalent to two antiparallel thyristors sharing a gate control.' },
      { question: 'A buck-boost converter is used to:', options: ['Step up or step down DC voltage', 'Convert AC to DC', 'Invert DC to AC', 'Stabilize grid frequency'], answer: 0, hint: 'Buck-boost outputs magnitude that is either greater or less than input.' },
      { question: 'The unit of electrical conductivity is:', options: ['Siemens per meter (S/m)', 'Ohm-meter', 'Farad', 'Henry'], answer: 0, hint: 'Conductivity is the inverse of resistivity, measured in S/m.' },
      { question: 'Which instrument is used to measure insulation resistance?', options: ['Megger', 'Ammeter', 'Voltmeter', 'Wattmeter'], answer: 0, hint: 'Megger is a portable generator producing high voltage to test insulators.' },
      { question: 'In star connection, line current is:', options: ['Equal to phase current', 'sqrt(3) times phase current', 'Phase current divided by sqrt(3)', 'None of these'], answer: 0, hint: 'Star topology links line wires in series with phase windings.' },
      { question: 'What is the main cause of corona discharge in high-voltage transmission lines?', options: ['Ionization of air around conductors', 'High resistance of conductors', 'Low voltage', 'High frequency'], answer: 0, hint: 'Strong electrostatic fields break down and ionize nearby air atoms.' }
    ]
  },
  {
    name: 'Electronics & Communication Engineering Practice Mock',
    mcqs: [
      { question: 'The forward voltage drop across a Silicon PN junction diode is approximately:', options: ['0.7 V', '0.3 V', '1.1 V', '2.0 V'], answer: 0, hint: 'Silicon barrier potential requires 0.7 V bias to trigger current conduction.' },
      { question: 'What is the main application of a Zener diode?', options: ['Voltage regulation', 'Rectification', 'Amplification', 'Oscillation'], answer: 0, hint: 'Operated in reverse breakdown, Zener diodes maintain a stable voltage.' },
      { question: 'Which transistor configuration is used for impedance matching?', options: ['Common Collector', 'Common Emitter', 'Common Base', 'None of these'], answer: 0, hint: 'Common Collector (emitter follower) has high input and low output impedance.' },
      { question: 'An OP-AMP is basically a high-gain:', options: ['Differential amplifier', 'Power amplifier', 'Audio amplifier', 'None of these'], answer: 0, hint: 'OP-AMPs amplify the difference between their non-inverting and inverting inputs.' },
      { question: 'The number of select lines for a 16-to-1 multiplexer is:', options: ['4', '3', '5', '8'], answer: 0, hint: 'Multiplexers use n select lines to choose between 2^n inputs; 2^4 = 16.' },
      { question: 'The Nyquist sampling rate for a signal with maximum frequency fm is:', options: ['2 * fm', 'fm', '1.5 * fm', '3 * fm'], answer: 0, hint: 'To prevent aliasing, sampling rate must satisfy fs >= 2*fm.' },
      { question: 'Which digital modulation scheme is most bandwidth efficient?', options: ['QAM', 'ASK', 'FSK', 'PSK'], answer: 0, hint: 'Quadrature Amplitude Modulation encodes multiple bits per symbol, maximizing efficiency.' },
      { question: 'Carson\'s rule defines the bandwidth of:', options: ['FM wave', 'AM wave', 'PM wave', 'PCM wave'], answer: 0, hint: 'FM Bandwidth = 2 * (delta_f + fm).' },
      { question: 'The speed of electromagnetic waves in a vacuum is:', options: ['3 * 10^8 m/s', '3 * 10^6 m/s', '1.5 * 10^8 m/s', 'None of these'], answer: 0, hint: 'EM waves propagate at speed of light (3x10^8 m/s) in free space.' },
      { question: 'The characteristic impedance of a lossless transmission line is:', options: ['sqrt(L/C)', 'sqrt(L*C)', 'L/C', 'C/L'], answer: 0, hint: 'Lossless line equations reduce Z0 to real ratio sqrt(L/C).' },
      { question: 'The Z-transform is used for the analysis of:', options: ['Discrete-time systems', 'Continuous-time systems', 'Both', 'None'], answer: 0, hint: 'Z-transform maps discrete differences to frequency domains.' },
      { question: 'What is the function of a PLL (Phase Locked Loop)?', options: ['Frequency tracking and demodulation', 'Voltage amplification', 'Power conversion', 'None of these'], answer: 0, hint: 'PLL locks phase to follow and recover input signal carrier frequencies.' },
      { question: 'Which logic gate performs addition of two binary bits without carry?', options: ['XOR gate', 'AND gate', 'OR gate', 'NAND gate'], answer: 0, hint: 'XOR gate logic outputs sum bit: 0+0=0, 0+1=1, 1+0=1, 1+1=0.' },
      { question: 'The dominant mode in a rectangular waveguide is:', options: ['TE10', 'TE11', 'TM11', 'TM01'], answer: 0, hint: 'TE10 has the longest cutoff wavelength and is the lowest mode.' },
      { question: 'Which tool translates assembly code into machine language?', options: ['Assembler', 'Linker', 'Interpreter', 'Debugger'], answer: 0, hint: 'Assembler maps mnemonic opcodes to numeric hardware codes.' }
    ]
  },
  {
    name: 'Computer Science & Engineering Practice Mock',
    mcqs: [
      { question: 'What is the time complexity of searching in a balanced Binary Search Tree?', options: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'], answer: 0, hint: 'Balanced trees restrict height to log2(n) levels, limiting search paths.' },
      { question: 'Which data structure works on the LIFO principle?', options: ['Stack', 'Queue', 'Linked List', 'Tree'], answer: 0, hint: 'Stacks push/pop from the same end (Last-In First-Out).' },
      { question: 'The process of dividing physical memory into fixed-size blocks is:', options: ['Paging', 'Segmentation', 'Fragmentation', 'Spooling'], answer: 0, hint: 'Paging slices RAM into frames and virtual space into pages.' },
      { question: 'A deadlock can be prevented by breaking which condition?', options: ['Mutual exclusion / Hold and wait / No preemption / Circular wait', 'Only Circular wait', 'None of these', 'All of these'], answer: 0, hint: 'Eliminating any of the four Coffman conditions prevents deadlocks.' },
      { question: 'In DBMS, the ACID property \'I\' stands for:', options: ['Isolation', 'Integrity', 'Integration', 'Identification'], answer: 0, hint: 'Isolation guarantees concurrent transactions run without cross interference.' },
      { question: 'Which SQL statement is used to remove a table schema and all its rows?', options: ['DROP TABLE', 'DELETE TABLE', 'TRUNCATE TABLE', 'REMOVE TABLE'], answer: 0, hint: 'DROP TABLE permanently deletes schema, indices, constraints, and data.' },
      { question: 'What is the default port number for HTTP?', options: ['80', '443', '21', '22'], answer: 0, hint: 'Unsecured HTTP traffic defaults to TCP/IP port 80.' },
      { question: 'Which protocol is used to map an IP address to a MAC address?', options: ['ARP', 'DNS', 'DHCP', 'ICMP'], answer: 0, hint: 'Address Resolution Protocol (ARP) translates layer-3 IPs to layer-2 physical MACs.' },
      { question: 'The network topology in which all nodes are connected to a central hub is:', options: ['Star topology', 'Ring topology', 'Mesh topology', 'Bus topology'], answer: 0, hint: 'Star networks use point-to-point lines to a central switch/hub.' },
      { question: 'Which algorithm is used for finding shortest paths in a weighted graph?', options: ['Dijkstra\'s Algorithm', 'Prim\'s Algorithm', 'Kruskal\'s Algorithm', 'DFS'], answer: 0, hint: 'Dijkstra solves single-source shortest path values on positive weights.' },
      { question: 'The compiler phase that checks syntax rules is:', options: ['Syntax Analysis (Parser)', 'Lexical Analysis', 'Semantic Analysis', 'Code Generation'], answer: 0, hint: 'Parsers construct parse trees from tokens to validate grammatical correctness.' },
      { question: 'What is the size of an IPv4 address?', options: ['32 bits', '64 bits', '128 bits', '16 bits'], answer: 0, hint: 'IPv4 uses 4-byte (32-bit) addresses, whereas IPv6 uses 128-bit addresses.' },
      { question: 'Which of the following is NOT an OOP concept?', options: ['Compilation', 'Inheritance', 'Polymorphism', 'Encapsulation'], answer: 0, hint: 'Compilation is a build phase; OOP pillars are encapsulation, inheritance, polymorphism, and abstraction.' },
      { question: 'The logic gate equivalent to Boolean addition is:', options: ['OR gate', 'AND gate', 'NOT gate', 'XOR gate'], answer: 0, hint: 'OR gate yields 1 if either input is 1 (A + B).' },
      { question: 'What is the time complexity of Quick Sort in the worst case?', options: ['O(n^2)', 'O(n log n)', 'O(n)', 'O(1)'], answer: 0, hint: 'Worst case (e.g. sorted arrays with bad pivot choices) degrades partition steps to O(n^2).' }
    ]
  },
  {
    name: 'Other Engineering Exams Practice Mock',
    mcqs: [
      { question: 'What is the value of the derivative of x^2 at x = 3?', options: ['6', '3', '9', '2'], answer: 0, hint: 'd(x^2)/dx = 2x. Evaluated at x=3, 2 * 3 = 6.' },
      { question: 'A drawing instrument used to draw curves that cannot be drawn with a compass is:', options: ['French Curves', 'T-square', 'Set-squares', 'Divider'], answer: 0, hint: 'French curves provide pre-cut template segments for smoothing continuous plots.' },
      { question: 'In engineering drawing, what is the scale 1:2 called?', options: ['Reduced scale', 'Full size scale', 'Enlarged scale', 'None of these'], answer: 0, hint: '1:2 scale represents a model size which is half of the real physical scale.' },
      { question: 'The first law of thermodynamics is a statement of:', options: ['Conservation of energy', 'Conservation of mass', 'Conservation of momentum', 'None of these'], answer: 0, hint: 'It states that change in internal energy equals heat added minus work done.' },
      { question: 'Which mechanical property represents resistance to indentation or scratching?', options: ['Hardness', 'Ductility', 'Malleability', 'Toughness'], answer: 0, hint: 'Hardness measures local elastic deformation limits on surfaces.' },
      { question: 'In a project network diagram, critical path has:', options: ['Zero total float', 'Maximum float', 'Negative float', 'Infinite float'], answer: 0, hint: 'Critical path activities cannot be delayed without delaying project completion.' },
      { question: 'Which coding system is widely used to represent text in computers?', options: ['ASCII / Unicode', 'Binary Code', 'Gray Code', 'BCD'], answer: 0, hint: 'ASCII/Unicode map unique integers to alphabetical and international characters.' },
      { question: 'The vector product of two perpendicular vectors is:', options: ['Product of their magnitudes', 'Zero', 'Negative', 'None of these'], answer: 0, hint: 'Cross product magnitude is |A||B|sin(theta). Since theta=90, sin 90 = 1.' },
      { question: 'The ratio of stress to strain within the elastic limit is:', options: ['Modulus of Elasticity', 'Poisson\'s ratio', 'Shear Modulus', 'Bulk Modulus'], answer: 0, hint: 'Hooke\'s law equates stress = E * strain, where E is Young\'s Modulus.' },
      { question: 'What is the determinant of a 2x2 identity matrix?', options: ['1', '0', '2', '-1'], answer: 0, hint: 'det([[1, 0], [0, 1]]) = 1*1 - 0*0 = 1.' },
      { question: 'Intellectual Property Rights (IPR) protect:', options: ['Inventions and creative designs', 'Real estate properties', 'Money in banks', 'Physical health'], answer: 0, hint: 'IPR patents, trademarks, and copyright protect intellectual creations.' },
      { question: 'Which parameter determines the quality of a fuel?', options: ['Calorific value', 'Density', 'Viscosity', 'Flash point'], answer: 0, hint: 'Calorific value measures heat energy released per unit mass burned.' },
      { question: 'The process of converting solid directly into gas is:', options: ['Sublimation', 'Evaporation', 'Condensation', 'Melting'], answer: 0, hint: 'Dry ice or iodine sublime directly without entering liquid phases.' },
      { question: 'What is the unit of power in SI units?', options: ['Watt', 'Joule', 'Newton', 'Pascal'], answer: 0, hint: 'Watt (W) represents one Joule of work completed per second.' },
      { question: 'In MS Project or CPM, CPM stands for:', options: ['Critical Path Method', 'Critical Project Management', 'Cost Plan Management', 'None of these'], answer: 0, hint: 'CPM evaluates minimum time schedules and sequence dependencies.' }
    ]
  },
  {
    name: 'ITI Semester Exams Trade Theory Mock',
    mcqs: [
      { question: 'Which safety sign is triangular in shape with yellow background?', options: ['Warning sign', 'Prohibitory sign', 'Mandatory sign', 'Information sign'], answer: 0, hint: 'Warning/Caution symbols use black graphics on triangular yellow backgrounds.' },
      { question: 'What is the first aid treatment for a person with electrical shock?', options: ['Switch off power and check breathing', 'Give water to drink', 'Massage the limbs', 'Ignore the victim'], answer: 0, hint: 'Break power contacts safely first before examining or performing CPR.' },
      { question: 'Which fire extinguisher is used for electrical fires?', options: ['Halon / CO2 extinguisher', 'Water extinguisher', 'Foam extinguisher', 'None of these'], answer: 0, hint: 'CO2 or dry chemical extinguishers prevent conduction during class-C fires.' },
      { question: 'The size of a file is specified by its:', options: ['Length of cut portion', 'Width', 'Material', 'Color'], answer: 0, hint: 'Standard files are designated by their length from heel to point (tip).' },
      { question: 'What is the least count of a metric micrometer?', options: ['0.01 mm', '0.02 mm', '0.05 mm', '0.1 mm'], answer: 0, hint: 'Metric outside micrometers divide 0.5mm pitch into 50 thimble divisions, giving 0.01mm.' },
      { question: 'Which tool is used for tightening/loosening hexagonal bolts?', options: ['Spanner', 'Plier', 'Hammer', 'Screwdriver'], answer: 0, hint: 'Spanners fit bolt head flats securely to apply rotational forces.' },
      { question: 'The unit of current is:', options: ['Ampere', 'Volt', 'Ohm', 'Watt'], answer: 0, hint: 'Ampere (A) measures the rate of charge flow in conductors.' },
      { question: 'In a workshop, heavy loads should be lifted using:', options: ['Cranes or hoists', 'Manual back lifting', 'Pushing on floor', 'None of these'], answer: 0, hint: 'Lifting machinery avoids back injuries during layout rearrangements.' },
      { question: 'What is the composition of soft solder?', options: ['Tin and Lead', 'Copper and Zinc', 'Silver and Copper', 'Lead and Zinc'], answer: 0, hint: 'Traditional lead solder blends tin and lead in 60/40 configurations.' },
      { question: 'Which metal is highly malleable?', options: ['Gold', 'Iron', 'Cast Iron', 'Brass'], answer: 0, hint: 'Gold can be hammered into extremely thin sheets (leafs).' },
      { question: 'The instrument used to check perpendicularity is:', options: ['Try square', 'Vernier caliper', 'Outside micrometer', 'Steel rule'], answer: 0, hint: 'Try squares check 90-degree alignment on parts.' },
      { question: 'What is the function of a fuse in a circuit?', options: ['Protects against short-circuits and overcurrent', 'Increases current', 'Stabilizes voltage', 'None of these'], answer: 0, hint: 'Fuses blow under high loads, breaking contacts before components burn.' },
      { question: 'Which oil is used as coolant during drilling steel?', options: ['Soluble oil / cutting oil', 'Engine oil', 'Kerosene', 'Water only'], answer: 0, hint: 'Soluble cutting oil cools bits and sweeps chips away.' },
      { question: 'The least count of a standard Vernier Caliper is:', options: ['0.02 mm', '0.01 mm', '0.05 mm', '0.1 mm'], answer: 0, hint: 'Standard calipers resolve down to 0.02 mm.' },
      { question: 'Which process makes steel hard and brittle?', options: ['Hardening', 'Annealing', 'Tempering', 'Normalizing'], answer: 0, hint: 'Quenching steel from austenitic phases locks carbon into hard martensite.' }
    ]
  },
  {
    name: 'Accounting and Commerce Finance Mock',
    mcqs: [
      { question: 'The double entry system of bookkeeping was introduced by:', options: ['Luca Pacioli', 'Adam Smith', 'Alfred Marshall', 'None of these'], answer: 0, hint: 'Pacioli documented Venetian double-entry ledger bookkeeping systems in 1494.' },
      { question: 'What is the fundamental accounting equation?', options: ['Assets = Liabilities + Capital', 'Assets = Liabilities - Capital', 'Liabilities = Assets + Capital', 'Capital = Assets + Liabilities'], answer: 0, hint: 'All business assets are funded by either creditor liabilities or owner capital.' },
      { question: 'The recording of transactions in journal is done in:', options: ['Chronological order', 'Alphabetical order', 'Value-wise order', 'None of these'], answer: 0, hint: 'Transactions are recorded sequentially as they occur day-by-day.' },
      { question: 'Which account is a real account?', options: ['Cash Account', 'Salary Account', 'Ram\'s Account', 'Bank Account'], answer: 0, hint: 'Real accounts track tangible assets/properties like cash, land, and machinery.' },
      { question: 'Depreciation is defined as:', options: ['Gradual decrease in value of fixed assets', 'Increase in value of assets', 'Maintenance cost', 'None of these'], answer: 0, hint: 'Depreciation allocates fixed asset wear-and-tear costs over useful lifetimes.' },
      { question: 'Trial balance is prepared to check:', options: ['Arithmetical accuracy of ledger accounts', 'Net profit', 'Financial position', 'Cash balance'], answer: 0, hint: 'Trial balance checks if total debits equal total credits.' },
      { question: 'Goodwill is an:', options: ['Intangible asset', 'Tangible asset', 'Current asset', 'Fictitious asset'], answer: 0, hint: 'Goodwill represents reputational premiums, classified as intangible fixed assets.' },
      { question: 'In banking, what does NPA stand for?', options: ['Non-Performing Asset', 'Net Profit Account', 'National Payment Association', 'None of these'], answer: 0, hint: 'Non-performing assets are loans in default where interest/principal remains unpaid over 90 days.' },
      { question: 'GST was introduced in India in the year:', options: ['2017', '2015', '2016', '2018'], answer: 0, hint: 'GST came into effect across India on July 1, 2017.' },
      { question: 'The main objective of financial accounting is to prepare:', options: ['Profit & Loss A/c and Balance Sheet', 'Cash book only', 'Cost sheet', 'Budget report'], answer: 0, hint: 'Financial accounting reports company profitability and balances to external stakeholders.' },
      { question: 'Which audit is mandatory for public listed companies in India?', options: ['Statutory Audit', 'Internal Audit', 'Management Audit', 'Social Audit'], answer: 0, hint: 'Companies Act mandates annual independent statutory audits.' },
      { question: 'Working capital is calculated as:', options: ['Current Assets - Current Liabilities', 'Fixed Assets - Current Liabilities', 'Current Assets + Current Liabilities', 'Total Assets - Total Liabilities'], answer: 0, hint: 'Net working capital shows short-term operational cash buffers.' },
      { question: 'The cost of goods sold is:', options: ['Opening Stock + Purchases - Closing Stock', 'Sales - Gross Profit', 'Both of these', 'None of these'], answer: 2, hint: 'Both formulas yield COGS by adjusting stock changes or subtracting profit.' },
      { question: 'What does ROI stand for in business finance?', options: ['Return on Investment', 'Rate of Interest', 'Revenue on Income', 'None of these'], answer: 0, hint: 'ROI measures efficiency of investments by dividing net return by capital cost.' },
      { question: 'The ledger is also known as:', options: ['Principal book of accounts', 'Secondary book', 'Day book', 'Memo book'], answer: 0, hint: 'Ledger contains the final consolidated records of all individual T-accounts.' }
    ]
  },
  {
    name: 'Campus Placement Aptitude Practice Mock',
    mcqs: [
      { question: 'If the cost price of an item is Rs 200 and it is sold for Rs 250, what is the profit percentage?', options: ['25%', '20%', '50%', '30%'], answer: 0, hint: 'Profit % = (Profit / CP) * 100 = (50 / 200) * 100 = 25%.' },
      { question: 'Complete the sequence: 3, 6, 12, 24, ?', options: ['48', '36', '30', '60'], answer: 0, hint: 'Each term is multiplied by 2.' },
      { question: 'A train running at 54 km/hr crosses a post in 10 seconds. What is the length of the train?', options: ['150 meters', '120 meters', '180 meters', '200 meters'], answer: 0, hint: 'Speed = 54 * (5/18) = 15 m/s. Length = Speed * Time = 15 * 10 = 150m.' },
      { question: 'Find the odd one out: Apple, Orange, Potato, Banana', options: ['Potato', 'Apple', 'Orange', 'Banana'], answer: 0, hint: 'Potato is a tuber root vegetable; the rest are sweet fruits.' },
      { question: 'If in a code language, CAT is written as DBT, then DOG is written as:', options: ['EPH', 'EOG', 'DPH', 'EOH'], answer: 0, hint: 'C+1=D, A+1=B, T+0=T. So D+1=E, O+1=P, G+0=G. Wait, let\'s look at DOG. D+1=E, O+1=P, G+0=G, which is EPG. Wait, options has EPH. If the rule is C+1=D, A+1=B, T+0=T, then D+1=E, O+1=P, G+1=H -> EPH. Yes!' },
      { question: 'A work is completed by 5 men in 10 days. How many days will 10 men take to complete the same work?', options: ['5 days', '2 days', '10 days', '20 days'], answer: 0, hint: 'M1*D1 = M2*D2. 5 * 10 = 10 * D2 -> D2 = 5 days.' },
      { question: 'What is the average of first five prime numbers?', options: ['5.6', '5.0', '6.2', '4.8'], answer: 0, hint: 'First 5 primes: 2, 3, 5, 7, 11. Sum = 28. Average = 28 / 5 = 5.6.' },
      { question: 'In OOPS, wrapping data and methods into a single unit is called:', options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Abstraction'], answer: 0, hint: 'Encapsulation restricts direct access and bundles code blocks together.' },
      { question: 'Which language is purely object-oriented among these?', options: ['Java', 'C', 'Assembly', 'SQL'], answer: 0, hint: 'Java requires classes for all methods, aligning with object models.' },
      { question: 'The sum of two numbers is 20 and their difference is 4. Find the product of the two numbers.', options: ['96', '80', '100', '72'], answer: 0, hint: 'x + y = 20, x - y = 4 -> x = 12, y = 8. Product = 12 * 8 = 96.' },
      { question: 'Which data structure operates on FIFO?', options: ['Queue', 'Stack', 'Binary Tree', 'Heap'], answer: 0, hint: 'Queues process items in order of arrival (First-In First-Out).' },
      { question: 'If A is B\'s brother, and B is C\'s sister, how is A related to C?', options: ['Brother', 'Sister', 'Father', 'Uncle'], answer: 0, hint: 'Since A and B are siblings, and B and C are siblings, A is C\'s brother.' },
      { question: 'A man walks 5 km South, then turns East and walks 3 km, then turns North and walks 5 km. How far is he from starting point?', options: ['3 km', '5 km', '8 km', '2 km'], answer: 0, hint: 'He forms a rectangle, ending up exactly 3 km East of origin.' },
      { question: 'The probability of rolling a 4 on a fair six-sided die is:', options: ['1/6', '1/2', '1/4', '2/3'], answer: 0, hint: 'There is 1 favorable outcome out of 6 possible values.' },
      { question: 'In binary arithmetic, what is 1 + 1?', options: ['10 (decimal 2)', '2', '1', '0'], answer: 0, hint: '1 + 1 equals 2, which is binary 10.' }
    ]
  },
  {
    name: 'NRA CET Common Eligibility Practice Mock',
    mcqs: [
      { question: 'Who is the head of the National Recruitment Agency (NRA) governing body?', options: ['A Chairman of Secretary rank', 'Prime Minister', 'President', 'Finance Minister'], answer: 0, hint: 'NRA is headed by a Chairman of the rank of Secretary to the Government of India.' },
      { question: 'NRA CET will replace preliminary exams for which organizations?', options: ['SSC, RRB, and IBPS', 'UPSC and State PCS', 'NDA and CDS', 'All of these'], answer: 0, hint: 'CET replaces Tier-1 screening for banking, railways, and clerical posts.' },
      { question: 'Which article of the Constitution relates to the Finance Commission?', options: ['Article 280', 'Article 324', 'Article 110', 'Article 356'], answer: 0, hint: 'Article 280 requires the President to set up a Finance Commission every 5 years.' },
      { question: 'The first railway line in India was opened in:', options: ['1853', '1850', '1857', '1872'], answer: 0, hint: 'The line between Bori Bunder (Mumbai) and Thane opened on 16 April 1853.' },
      { question: 'What is the capital of France?', options: ['Paris', 'London', 'Rome', 'Berlin'], answer: 0, hint: 'Paris is the capital and most populous city of France.' },
      { question: 'Which river is also known as the Dakshin Ganga?', options: ['Godavari', 'Kaveri', 'Krishna', 'Narmada'], answer: 0, hint: 'Godavari is the second longest river in India and largest in south India.' },
      { question: 'The simple interest on Rs 5000 for 2 years at 10% per annum is:', options: ['Rs 1000', 'Rs 500', 'Rs 1200', 'Rs 1500'], answer: 0, hint: 'SI = P * R * T / 100 = 5000 * 10 * 2 / 100 = Rs 1000.' },
      { question: 'In a family tree, your father\'s sister is your:', options: ['Aunt', 'Mother', 'Grandmother', 'Sister'], answer: 0, hint: 'Paternal sister is commonly referred to as aunt.' },
      { question: 'Which of the following is a synonym of Benevolent?', options: ['Kind', 'Cruel', 'Greedy', 'Selfish'], answer: 0, hint: 'Benevolent means well-meaning, generous, and kindly.' },
      { question: 'The standard units digit of (256)^78 is:', options: ['6', '2', '4', '8'], answer: 0, hint: 'Any power of a number ending in 6 will always have a units digit of 6.' },
      { question: 'Which gland in human body is called the master gland?', options: ['Pituitary gland', 'Thyroid gland', 'Adrenal gland', 'Pancreas'], answer: 0, hint: 'Pituitary gland controls functions of many other endocrine glands.' },
      { question: 'The Indian standard time (IST) is based on the longitude of:', options: ['82.5° East', '80° East', '85° East', '90° East'], answer: 0, hint: 'IST passes through Mirzapur, UP along the 82°30\' E line.' },
      { question: 'Who wrote the national anthem of India?', options: ['Rabindranath Tagore', 'Bankim Chandra Chatterjee', 'Mahatma Gandhi', 'None of these'], answer: 0, hint: 'Jana Gana Mana was originally composed in Bengali by Tagore.' },
      { question: 'The power to create new states in India rests with:', options: ['Parliament', 'President', 'Prime Minister', 'Supreme Court'], answer: 0, hint: 'Article 3 empowers Parliament to form new states or alter boundaries.' },
      { question: 'What is the chemical formula of water?', options: ['H2O', 'CO2', 'NaCl', 'HCl'], answer: 0, hint: 'Water molecules comprise two hydrogen atoms bonded to one oxygen atom.' }
    ]
  },
  {
    name: 'Instrumentation Engineering Practice Mock',
    mcqs: [
      { question: 'Which sensor is commonly used to measure temperature?', options: ['RTD / Thermocouple', 'LVDT', 'Piezoelectric crystal', 'Strain gauge'], answer: 0, hint: 'Resistance Temperature Detectors (RTD) change resistance predictably with temperature.' },
      { question: 'What is the working principle of LVDT?', options: ['Variable Inductance', 'Variable Capacitance', 'Piezoelectric effect', 'Photoelectric effect'], answer: 0, hint: 'Linear Variable Differential Transformer uses mutual induction changes from core displacements.' },
      { question: 'Strain gauge is used to measure:', options: ['Strain and force', 'Temperature', 'Velocity', 'pH'], answer: 0, hint: 'Resistance of foil strain gauge changes when subject to mechanical tension/compression.' },
      { question: 'A pH sensor measures the concentration of:', options: ['Hydrogen ions', 'Oxygen ions', 'Sodium ions', 'None of these'], answer: 0, hint: 'pH is defined as the negative log of Hydrogen ion activity.' },
      { question: 'What does PLC stand for in process control?', options: ['Programmable Logic Controller', 'Process Line Computer', 'Programmed Loop Control', 'None of these'], answer: 0, hint: 'PLCs are ruggedized digital computers used for industrial automation.' },
      { question: 'The gauge factor of a strain gauge is defined as the ratio of:', options: ['Fractional change in resistance to strain', 'Stress to strain', 'Voltage to current', 'None of these'], answer: 0, hint: 'GF = (delta_R / Rg) / strain.' },
      { question: 'A thermocouple works on:', options: ['Seebeck effect', 'Peltier effect', 'Thomson effect', 'Hall effect'], answer: 0, hint: 'Seebeck effect generates voltage proportional to the junction temperature differences.' },
      { question: 'Which instrument is used to measure fluid flow velocity using magnetic field?', options: ['Electromagnetic flowmeter', 'Venturimeter', 'Rotameter', 'Pitot tube'], answer: 0, hint: 'Magnetic flowmeters use Faraday\'s law of induction on conductive fluids.' },
      { question: 'In a control system, feedback is used to:', options: ['Reduce error and stabilize', 'Increase gain', 'Remove sensors', 'None of these'], answer: 0, hint: 'Negative feedback tracks setpoints and rejects external system disturbances.' },
      { question: 'What is the unit of pressure?', options: ['Pascal', 'Joule', 'Newton', 'Watt'], answer: 0, hint: 'Pascal (Pa) is equivalent to one Newton of force per square meter.' },
      { question: 'An instrumentation amplifier has:', options: ['High CMRR and high input impedance', 'Low CMRR', 'Low input impedance', 'None of these'], answer: 0, hint: 'Differential layout guarantees high Common Mode Rejection Ratio (CMRR) and high impedance.' },
      { question: 'The device used to convert physical variables into electrical signals is:', options: ['Transducer', 'Actuator', 'Amplifier', 'Rectifier'], answer: 0, hint: 'Transducers act as energy converters for signal conditioning circuits.' },
      { question: 'Which sensor works on change in distance between plates?', options: ['Capacitive sensor', 'Inductive sensor', 'Hall effect sensor', 'Optoelectronic sensor'], answer: 0, hint: 'Capacitance C is proportional to area A divided by distance d.' },
      { question: 'A PID controller stands for:', options: ['Proportional-Integral-Derivative', 'Process-Integrated-Data', 'Programmed-Index-Diagnostic', 'None of these'], answer: 0, hint: 'PID loops use current error (P), past accumulative error (I), and rate of change (D).' },
      { question: 'The damping ratio for an underdamped system is:', options: ['Between 0 and 1', 'Exactly 1', 'Greater than 1', 'Zero'], answer: 0, hint: 'Underdamped systems decay with oscillations (damping ratio zeta < 1).' }
    ]
  },
  {
    name: 'Government Organizations Officer Mock',
    mcqs: [
      { question: 'Which body acts as the supreme audit authority in India?', options: ['CAG (Comptroller and Auditor General)', 'Finance Commission', 'RBI', 'Supreme Court'], answer: 0, hint: 'Article 148 mandates CAG to audit receipts and expenditures of government.' },
      { question: 'In administrative terminology, what is a circular?', options: ['Information sent to multiple recipients', 'A private note', 'An audit report', 'A salary slip'], answer: 0, hint: 'Circulars broadcast standard policies or notices to broad employee lists.' },
      { question: 'The right to information (RTI) in India was enacted in:', options: ['2005', '2000', '2010', '2015'], answer: 0, hint: 'RTI Act of 2005 replaced the older Freedom of Information Act.' },
      { question: 'Who is the head of the civil services board in India?', options: ['Cabinet Secretary', 'Prime Minister', 'Home Minister', 'President'], answer: 0, hint: 'Cabinet Secretary heads the Civil Services Board and civil administrations.' },
      { question: 'Central Vigilance Commission (CVC) was established on recommendations of:', options: ['Santhanam Committee', 'Sarkaria Commission', 'Kothari Commission', 'None of these'], answer: 0, hint: 'Santhanam Committee recommended CVC in 1964 to combat corruption.' },
      { question: 'What is the term of office for a member of UPSC?', options: ['6 years or 65 years of age', '5 years', '62 years of age', '3 years'], answer: 0, hint: 'UPSC members hold office for 6 years or until reaching 65 years of age.' },
      { question: 'Official secrets act in India was first enacted in:', options: ['1923', '1947', '1950', '1920'], answer: 0, hint: 'The OSA was passed in 1923 during British rule to secure official files.' },
      { question: 'In government offices, CCS Rules stand for:', options: ['Central Civil Services Rules', 'Common Civil Service Rules', 'Central Conduct Service Rules', 'None of these'], answer: 0, hint: 'CCS (Conduct) Rules outline the code of conduct for central bureaucrats.' },
      { question: 'The budget is presented in the Parliament by:', options: ['Finance Minister', 'Prime Minister', 'Speaker of Lok Sabha', 'President'], answer: 0, hint: 'Ministry of Finance drafts the annual budget, presented by the minister.' },
      { question: 'What does NITI in NITI Aayog stand for?', options: ['National Institution for Transforming India', 'National Integration and Trade Institution', 'National Investment Trust of India', 'None of these'], answer: 0, hint: 'NITI stands for National Institution for Transforming India, replacing the Planning Commission.' },
      { question: 'The supreme command of defence forces is vested in:', options: ['President of India', 'Prime Minister', 'Defence Minister', 'Chief of Defence Staff'], answer: 0, hint: 'Article 53(2) gives supreme command of Defence Forces to the President.' },
      { question: 'Who administers oath to the Governor of a state?', options: ['Chief Justice of the State High Court', 'President', 'Chief Minister', 'Vice President'], answer: 0, hint: 'Article 159 dictates that the Chief Justice of State High Court administers the oath.' },
      { question: 'The national human rights commission (NHRC) is a:', options: ['Statutory body', 'Constitutional body', 'Private NGO', 'None of these'], answer: 0, hint: 'NHRC was set up under Protection of Human Rights Act, 1993, making it statutory.' },
      { question: 'Which schedules of Indian Constitution contain list of languages?', options: ['8th Schedule', '7th Schedule', '9th Schedule', '10th Schedule'], answer: 0, hint: 'The 8th Schedule lists 22 officially recognized languages.' },
      { question: 'What is the minimum age to become member of Rajya Sabha?', options: ['30 years', '25 years', '35 years', '21 years'], answer: 0, hint: 'Article 84 requires a minimum age of 30 for Rajya Sabha, and 25 for Lok Sabha.' }
    ]
  },
  {
    name: 'UG Entrance Exams General Aptitude Mock',
    mcqs: [
      { question: 'Choose the correctly spelt word:', options: ['Accommodation', 'Acomodation', 'Accomodation', 'Acommodacion'], answer: 0, hint: 'Accommodation is spelt with double c and double m.' },
      { question: 'What is the next number in sequence: 5, 10, 17, 26, ?', options: ['37', '35', '40', '36'], answer: 0, hint: 'The terms are n^2 + 1: 2^2+1=5, 3^2+1=10, 4^2+1=17, 5^2+1=26, 6^2+1=37.' },
      { question: 'If A is taller than B, and B is taller than C, who is the shortest?', options: ['C', 'B', 'A', 'Cannot be determined'], answer: 0, hint: 'A > B > C. Therefore, C is the shortest.' },
      { question: 'The synonym of \'Elated\' is:', options: ['Happy', 'Sad', 'Angry', 'Tired'], answer: 0, hint: 'Elated means ecstatic, overjoyed, or very happy.' },
      { question: 'A shopkeeper offers 10% discount on a product marked at Rs 1000. Sale price is:', options: ['Rs 900', 'Rs 950', 'Rs 800', 'Rs 850'], answer: 0, hint: 'Discount = 10% of 1000 = Rs 100. Sale price = 1000 - 100 = Rs 900.' },
      { question: 'If a triangle has sides 3cm, 4cm, 5cm, what is its area?', options: ['6 sq cm', '12 sq cm', '10 sq cm', '7.5 sq cm'], answer: 0, hint: 'This is a right-angled triangle. Area = 0.5 * Base * Height = 0.5 * 3 * 4 = 6 sq cm.' },
      { question: 'Choose the antonym of \'Rigid\':', options: ['Flexible', 'Stiff', 'Hard', 'Solid'], answer: 0, hint: 'Flexible is the opposite of rigid (stiff/unbending).' },
      { question: 'In a certain code, ROAD is written as WTFI, then BEAT is written as:', options: ['GJFY', 'GIFY', 'GIDY', 'FJFY'], answer: 0, hint: 'Shift value is +5: R+5=W, O+5=T, A+5=F, D+5=I. So B+5=G, E+5=J, A+5=F, T+5=Y.' },
      { question: 'What is the value of 15% of 200?', options: ['30', '20', '15', '40'], answer: 0, hint: 'Value = 15/100 * 200 = 15 * 2 = 30.' },
      { question: 'The sum of interior angles of a quadrilateral is:', options: ['360 degrees', '180 degrees', '270 degrees', '540 degrees'], answer: 0, hint: 'Any four-sided polygon has interior angles totaling 360 degrees.' },
      { question: 'If 3x + 5 = 20, what is the value of x?', options: ['5', '4', '3', '6'], answer: 0, hint: '3x = 15 -> x = 5.' },
      { question: 'Find the average of 10, 20, 30, 40:', options: ['25', '20', '30', '35'], answer: 0, hint: 'Average = (10+20+30+40)/4 = 100/4 = 25.' },
      { question: 'Which planet is closest to the Sun?', options: ['Mercury', 'Venus', 'Earth', 'Mars'], answer: 0, hint: 'Mercury has the smallest orbital radius around the Sun.' },
      { question: 'A person who writes the story of their own life writes an:', options: ['Autobiography', 'Biography', 'Novel', 'Diary'], answer: 0, hint: 'Autobiographical texts are written by the subjects themselves.' },
      { question: 'If a coin is tossed, what is the probability of getting a head?', options: ['0.5', '1', '0.25', '0'], answer: 0, hint: 'There is 1 head out of 2 equally likely outcomes (0.5).' }
    ]
  },
  {
    name: 'CUET General Test Practice Mock',
    mcqs: [
      { question: 'In CUET, what does CUET stand for?', options: ['Common University Entrance Test', 'Central University Eligibility Test', 'Common Under-graduate Entrance Test', 'None of these'], answer: 0, hint: 'CUET is a standardized admission exam administered by the NTA.' },
      { question: 'Who is the current Chairman of UGC?', options: ['M. Jagadesh Kumar', 'D.P. Singh', 'Ved Prakash', 'None of these'], answer: 0, hint: 'Prof. M. Jagadesh Kumar is the head of University Grants Commission.' },
      { question: 'What is the capital of Uttarakhand?', options: ['Dehradun', 'Nainital', 'Haridwar', 'Rishikesh'], answer: 0, hint: 'Dehradun is the winter capital of Uttarakhand.' },
      { question: 'The G20 Summit in 2023 was hosted by which country?', options: ['India', 'Brazil', 'Indonesia', 'South Africa'], answer: 0, hint: 'India hosted the 18th G20 summit at Pragati Maidan, New Delhi.' },
      { question: 'Find the next term in series: Z, W, T, Q, ?', options: ['N', 'O', 'P', 'M'], answer: 0, hint: 'Subtract 3 letters each step: Z(26) -> W(23) -> T(20) -> Q(17) -> N(14).' },
      { question: 'If the ratio of two numbers is 3:4 and their sum is 14, find the numbers:', options: ['6 and 8', '5 and 9', '4 and 10', '7 and 7'], answer: 0, hint: '3x + 4x = 14 -> 7x = 14 -> x = 2. Numbers are 6 and 8.' },
      { question: 'The value of square root of 625 is:', options: ['25', '15', '35', '20'], answer: 0, hint: '25 * 25 = 625.' },
      { question: 'Who won the ICC Men\'s Cricket World Cup 2023?', options: ['Australia', 'India', 'South Africa', 'New Zealand'], answer: 0, hint: 'Australia defeated India in the final at Ahmedabad.' },
      { question: 'Which state is known as the Land of Five Rivers?', options: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Rajasthan'], answer: 0, hint: 'Punjab derives its name from Punjabi words Panj (Five) and Aab (Water).' },
      { question: 'The perimeter of a rectangle with length 10m and width 5m is:', options: ['30m', '50m', '15m', '20m'], answer: 0, hint: 'Perimeter = 2 * (length + width) = 2 * (10 + 5) = 30m.' },
      { question: 'Which acid is present in ant stings?', options: ['Formic acid', 'Citric acid', 'Lactic acid', 'Oxalic acid'], answer: 0, hint: 'Ants inject formic acid (methanoic acid) causing local stings.' },
      { question: 'The Indian constitution was adopted on:', options: ['November 26, 1949', 'January 26, 1950', 'August 15, 1947', 'None of these'], answer: 0, hint: 'It was formally adopted on 26 Nov 1949 and came into effect on 26 Jan 1950.' },
      { question: 'A man walks 10 meters north, then 10 meters east. How far is he from his starting point (approx)?', options: ['14.14 meters', '20 meters', '10 meters', '15 meters'], answer: 0, hint: 'Distance = sqrt(10^2 + 10^2) = sqrt(200) = 14.14m.' },
      { question: 'Which is the smallest state of India by area?', options: ['Goa', 'Sikkim', 'Tripura', 'Mizoram'], answer: 0, hint: 'Goa has an area of 3,702 sq km, the smallest in India.' },
      { question: 'If a number is doubled and then 5 is added, the result is 15. The number is:', options: ['5', '10', '6', '8'], answer: 0, hint: '2x + 5 = 15 -> 2x = 10 -> x = 5.' }
    ]
  },
  {
    name: 'MBA Entrance Exam CAT Practice Mock',
    mcqs: [
      { question: 'If log_2 (x) + log_2 (x - 2) = 3, what is the value of x?', options: ['4', '2', '8', '6'], answer: 0, hint: 'log_2 (x * (x - 2)) = 3 -> x(x - 2) = 8 -> x^2 - 2x - 8 = 0 -> x = 4 (x must be > 2).' },
      { question: 'What is the remainder when 2^100 is divided by 3?', options: ['1', '2', '0', 'None of these'], answer: 0, hint: '2 = -1 mod 3. So 2^100 = (-1)^100 = 1 mod 3.' },
      { question: 'In a class of 60 students, 40 like Tea and 30 like Coffee. What is the minimum number of students who like both?', options: ['10', '20', '30', '0'], answer: 0, hint: 'n(A and B) = n(A) + n(B) - n(A or B) >= 40 + 30 - 60 = 10.' },
      { question: 'A sum of money doubles itself in 5 years under simple interest. In how many years will it become 4 times?', options: ['15 years', '10 years', '20 years', '25 years'], answer: 0, hint: 'Doubles in 5 yrs means SI = P, so rate r = 20%. To become 4 times, SI = 3P -> 3P = P * 20 * t / 100 -> t = 15 years.' },
      { question: 'Find the number of zeros at the end of 100! (factorial).', options: ['24', '20', '25', '30'], answer: 0, hint: 'Number of zeros = floor(100/5) + floor(100/25) = 20 + 4 = 24.' },
      { question: 'If the roots of x^2 - 5x + 6 = 0 are p and q, what is the value of p^2 + q^2?', options: ['13', '25', '12', '10'], answer: 0, hint: 'p+q = 5, pq = 6. p^2+q^2 = (p+q)^2 - 2pq = 25 - 12 = 13.' },
      { question: 'A and B start a business with investments in ratio 3:2. If 5% of profit goes to charity and A\'s share is Rs 855, what is the total profit?', options: ['Rs 1500', 'Rs 1425', 'Rs 1600', 'Rs 1200'], answer: 0, hint: 'A gets 3/5 of 95% of profit. 3/5 * 0.95 * P = 855 -> 0.57 * P = 855 -> P = Rs 1500.' },
      { question: 'In a group of cows and chickens, the number of legs is 14 more than twice the number of heads. The number of cows is:', options: ['7', '5', '10', '14'], answer: 0, hint: '4C + 2H_ch = 2(C + H_ch) + 14 -> 4C = 2C + 14 -> 2C = 14 -> C = 7.' },
      { question: 'What is the probability of choosing a vowel from the word ALGORITHM?', options: ['3/9', '4/9', '2/9', '5/9'], answer: 0, hint: 'Vowels are A, O, I (3 vowels out of 9 letters).' },
      { question: 'The speed of a boat in still water is 15 km/h and speed of stream is 3 km/h. Time taken to travel 36 km downstream is:', options: ['2 hours', '3 hours', '1.5 hours', '2.5 hours'], answer: 0, hint: 'Downstream speed = 15 + 3 = 18 km/h. Time = 36 / 18 = 2 hours.' },
      { question: 'If x + 1/x = 3, what is the value of x^2 + 1/x^2?', options: ['7', '9', '11', '5'], answer: 0, hint: '(x + 1/x)^2 = x^2 + 1/x^2 + 2 -> 9 = x^2 + 1/x^2 + 2 -> x^2 + 1/x^2 = 7.' },
      { question: 'The number of ways to arrange the letters of the word CAT is:', options: ['6', '3', '2', '9'], answer: 0, hint: 'Number of arrangements is 3! = 3 * 2 * 1 = 6.' },
      { question: 'If 3 machines can make 3 toys in 3 minutes, how many minutes will it take 100 machines to make 100 toys?', options: ['3 minutes', '100 minutes', '33 minutes', '1 minute'], answer: 0, hint: 'Work rate per machine is constant; 1 machine takes 3 minutes to make 1 toy.' },
      { question: 'A cylinder has height 10cm and radius 7cm. What is its volume (approx)?', options: ['1540 cubic cm', '770 cubic cm', '2200 cubic cm', 'None of these'], answer: 0, hint: 'Volume = pi * r^2 * h = 22/7 * 49 * 10 = 1540 cubic cm.' },
      { question: 'If the average of four consecutive odd numbers is 16, what is the largest of these numbers?', options: ['19', '17', '21', '15'], answer: 0, hint: 'Numbers are 13, 15, 17, 19. Average = 16. Largest is 19.' }
    ]
  }
];


const getRealExamStats = (courseName) => {
  const name = courseName.toLowerCase();
  if (name.includes("net") || name.includes("ugc") || name.includes("csir")) {
    return { questions: 150, marks: 300, duration: 180 };
  }
  if (name.includes("cds") || name.includes("afcat") || name.includes("capf")) {
    return { questions: 120, marks: 300, duration: 120 };
  }
  if (name.includes("pcs") || name.includes("civil services")) {
    return { questions: 100, marks: 200, duration: 120 };
  }
  if (name.includes("tcs") || name.includes("infosys") || name.includes("wipro") || name.includes("cognizant")) {
    return { questions: 60, marks: 60, duration: 60 };
  }
  if (name.includes("rrb alp") || name.includes("rrb group d") || name.includes("rrb ntpc") || name.includes("ntpc")) {
    return { questions: 100, marks: 100, duration: 90 };
  }
  if (name.includes("sbi po") || name.includes("ibps po") || name.includes("sbi clerk") || name.includes("ibps clerk") || name.includes("banking") || name.includes("rbi assistant")) {
    return { questions: 100, marks: 100, duration: 60 };
  }
  if (name.includes("lic") || name.includes("insurance")) {
    return { questions: 100, marks: 100, duration: 60 };
  }
  if (name.includes("non-teaching") || name.includes("non teaching")) {
    return { questions: 120, marks: 120, duration: 120 };
  }
  if (name.includes("tgt") || name.includes("pgt")) {
    return { questions: 125, marks: 125, duration: 120 };
  }
  if (name.includes("tet") || name.includes("prt")) {
    return { questions: 150, marks: 150, duration: 150 };
  }
  if (name.includes("food technology") || name.includes("food tech")) {
    return { questions: 100, marks: 100, duration: 120 };
  }
  if (name.includes("nursing")) {
    return { questions: 100, marks: 100, duration: 120 };
  }
  if (name.includes("civil engineering")) {
    return { questions: 100, marks: 100, duration: 180 };
  }
  if (name.includes("electrical engineering")) {
    return { questions: 100, marks: 100, duration: 180 };
  }
  if (name.includes("electronics & communication")) {
    return { questions: 100, marks: 100, duration: 180 };
  }
  if (name.includes("computer science") || name.includes("cse")) {
    return { questions: 100, marks: 100, duration: 180 };
  }
  if (name.includes("instrumentation")) {
    return { questions: 100, marks: 100, duration: 180 };
  }
  if (name.includes("other engineering")) {
    return { questions: 100, marks: 100, duration: 180 };
  }
  if (name.includes("iti exam") || name.includes("iti")) {
    return { questions: 50, marks: 100, duration: 120 };
  }
  if (name.includes("accounting") || name.includes("commerce")) {
    return { questions: 100, marks: 100, duration: 120 };
  }
  if (name.includes("placement")) {
    return { questions: 60, marks: 60, duration: 60 };
  }
  if (name.includes("nra cet") || name.includes("nra")) {
    return { questions: 100, marks: 100, duration: 60 };
  }
  if (name.includes("government org") || name.includes("gov org")) {
    return { questions: 100, marks: 100, duration: 120 };
  }
  if (name.includes("ug entrance")) {
    return { questions: 100, marks: 150, duration: 120 };
  }
  if (name.includes("cuet")) {
    return { questions: 75, marks: 300, duration: 60 };
  }
  if (name.includes("mba")) {
    return { questions: 66, marks: 198, duration: 120 };
  }
  // SSC exams detailed configurations
  if (name.includes("ssc cgl") || name.includes("cgl")) {
    return { questions: 100, marks: 200, duration: 60 };
  }
  if (name.includes("ssc chsl") || name.includes("chsl")) {
    return { questions: 100, marks: 200, duration: 60 };
  }
  if (name.includes("ssc mts") || name.includes("mts")) {
    return { questions: 90, marks: 270, duration: 90 };
  }
  if (name.includes("ssc gd") || name.includes("gd constable")) {
    return { questions: 80, marks: 160, duration: 60 };
  }
  if (name.includes("ssc cpo") || name.includes("cpo")) {
    return { questions: 200, marks: 200, duration: 120 };
  }
  if (name.includes("ssc je") || name.includes("je ")) {
    return { questions: 200, marks: 200, duration: 120 };
  }
  if (name.includes("ssc stenographer") || name.includes("stenographer")) {
    return { questions: 200, marks: 200, duration: 120 };
  }
  if (name.includes("ssc jht") || name.includes("jht")) {
    return { questions: 200, marks: 200, duration: 120 };
  }
  if (name.includes("ssc selection post") || name.includes("selection post")) {
    return { questions: 100, marks: 200, duration: 60 };
  }
  if (name.includes("ssc departmental") || name.includes("departmental")) {
    return { questions: 100, marks: 100, duration: 120 };
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
  
  if (name.includes("net") || name.includes("ugc") || name.includes("csir")) {
    return [
      { name: "Paper 1: Teaching & Research Aptitude", qs: 50, marks: 100, duration: 60 },
      { name: "Paper 2: Subject Specialization", qs: 100, marks: 200, duration: 120 }
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
      { name: "General Studies Paper I", qs: 50, marks: 100, duration: 60 },
      { name: "General Studies Paper II (CSAT)", qs: 50, marks: 100, duration: 60 }
    ];
  }
  if (name.includes("tcs") || name.includes("infosys") || name.includes("wipro") || name.includes("cognizant")) {
    return [
      { name: "Numerical Ability", qs: 20, marks: 20, duration: 20 },
      { name: "Verbal Ability", qs: 20, marks: 20, duration: 20 },
      { name: "Reasoning Ability", qs: 20, marks: 20, duration: 20 }
    ];
  }
  if (name.includes("rrb alp") || name.includes("rrb group d") || name.includes("rrb ntpc") || name.includes("ntpc")) {
    return [
      { name: "Mathematics", qs: 30, marks: 30, duration: 30 },
      { name: "General Intelligence & Reasoning", qs: 35, marks: 35, duration: 30 },
      { name: "General Awareness & Science", qs: 35, marks: 35, duration: 30 }
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
      { name: "Reasoning Ability", qs: 30, marks: 30, duration: 20 },
      { name: "Quantitative Aptitude", qs: 30, marks: 30, duration: 20 },
      { name: "General Awareness & Current Affairs", qs: 20, marks: 20, duration: 10 },
      { name: "Insurance & Financial Market Awareness", qs: 20, marks: 20, duration: 10 }
    ];
  }
  if (name.includes("non-teaching") || name.includes("non teaching")) {
    return [
      { name: "General Awareness", qs: 30, marks: 30, duration: 30 },
      { name: "Reasoning Ability", qs: 30, marks: 30, duration: 30 },
      { name: "Quantitative Aptitude", qs: 30, marks: 30, duration: 30 },
      { name: "Language Competency (Hindi & English)", qs: 30, marks: 30, duration: 30 }
    ];
  }
  if (name.includes("tgt") || name.includes("pgt")) {
    return [
      { name: "Educational Psychology & Pedagogy", qs: 40, marks: 40, duration: 40 },
      { name: "General Studies & General Awareness", qs: 35, marks: 35, duration: 30 },
      { name: "Subject Specialization", qs: 50, marks: 50, duration: 50 }
    ];
  }
  if (name.includes("tet") || name.includes("prt")) {
    return [
      { name: "Child Development and Pedagogy", qs: 30, marks: 30, duration: 30 },
      { name: "Language I & II", qs: 40, marks: 40, duration: 40 },
      { name: "Mathematics & Science", qs: 40, marks: 40, duration: 40 },
      { name: "Environmental Studies", qs: 40, marks: 40, duration: 40 }
    ];
  }
  if (name.includes("food technology") || name.includes("food tech")) {
    return [
      { name: "Food Chemistry & Nutrition", qs: 25, marks: 25, duration: 30 },
      { name: "Food Microbiology & Safety", qs: 25, marks: 25, duration: 30 },
      { name: "Food Processing & Engineering", qs: 25, marks: 25, duration: 30 },
      { name: "Food Laws & Standards", qs: 25, marks: 25, duration: 30 }
    ];
  }
  if (name.includes("nursing")) {
    return [
      { name: "Anatomy & Physiology", qs: 25, marks: 25, duration: 30 },
      { name: "Fundamentals of Nursing", qs: 25, marks: 25, duration: 30 },
      { name: "Medical-Surgical Nursing", qs: 25, marks: 25, duration: 30 },
      { name: "Community Health Nursing", qs: 25, marks: 25, duration: 30 }
    ];
  }
  if (name.includes("civil engineering")) {
    return [
      { name: "Structural Engineering & Concrete Technology", qs: 30, marks: 30, duration: 50 },
      { name: "Geotechnical & Transportation Engineering", qs: 30, marks: 30, duration: 50 },
      { name: "Environmental & Water Resources Engineering", qs: 40, marks: 40, duration: 80 }
    ];
  }
  if (name.includes("electrical engineering")) {
    return [
      { name: "Electric Circuits & Fields", qs: 30, marks: 30, duration: 50 },
      { name: "Electrical Machines & Power Systems", qs: 40, marks: 40, duration: 70 },
      { name: "Control Systems & Power Electronics", qs: 30, marks: 30, duration: 60 }
    ];
  }
  if (name.includes("electronics & communication")) {
    return [
      { name: "Electronic Devices & Analog Circuits", qs: 30, marks: 30, duration: 55 },
      { name: "Digital Circuits & Microprocessors", qs: 30, marks: 30, duration: 55 },
      { name: "Signals & Communication Systems", qs: 40, marks: 40, duration: 70 }
    ];
  }
  if (name.includes("computer science") || name.includes("cse")) {
    return [
      { name: "Programming, Data Structures & Algorithms", qs: 35, marks: 35, duration: 60 },
      { name: "Computer Organization & Operating Systems", qs: 35, marks: 35, duration: 60 },
      { name: "Databases & Computer Networks", qs: 30, marks: 30, duration: 60 }
    ];
  }
  if (name.includes("instrumentation")) {
    return [
      { name: "Sensors & Industrial Instrumentation", qs: 30, marks: 30, duration: 50 },
      { name: "Control Systems & Process Control", qs: 30, marks: 30, duration: 50 },
      { name: "Measurements & Signal Conditioning", qs: 40, marks: 40, duration: 80 }
    ];
  }
  if (name.includes("other engineering")) {
    return [
      { name: "Engineering Mathematics", qs: 30, marks: 30, duration: 50 },
      { name: "Basic Science & Engineering Mechanics", qs: 45, marks: 45, duration: 80 },
      { name: "General Aptitude & Professional Ethics", qs: 25, marks: 25, duration: 50 }
    ];
  }
  if (name.includes("iti exam") || name.includes("iti")) {
    return [
      { name: "Trade Theory", qs: 20, marks: 40, duration: 50 },
      { name: "Workshop Calculation & Science", qs: 15, marks: 30, duration: 35 },
      { name: "Engineering Drawing", qs: 15, marks: 30, duration: 35 }
    ];
  }
  if (name.includes("accounting") || name.includes("commerce")) {
    return [
      { name: "Financial Accounting & Auditing", qs: 35, marks: 35, duration: 40 },
      { name: "Business Economics & Finance", qs: 35, marks: 35, duration: 40 },
      { name: "Corporate Laws & Taxation", qs: 30, marks: 30, duration: 40 }
    ];
  }
  if (name.includes("placement")) {
    return [
      { name: "Quantitative Aptitude", qs: 20, marks: 20, duration: 20 },
      { name: "Logical Reasoning", qs: 20, marks: 20, duration: 20 },
      { name: "Verbal Ability & Technical", qs: 20, marks: 20, duration: 20 }
    ];
  }
  if (name.includes("nra cet") || name.includes("nra")) {
    return [
      { name: "Quantitative Aptitude", qs: 25, marks: 25, duration: 15 },
      { name: "Reasoning Ability", qs: 25, marks: 25, duration: 15 },
      { name: "English Language", qs: 25, marks: 25, duration: 15 },
      { name: "General Awareness", qs: 25, marks: 25, duration: 15 }
    ];
  }
  if (name.includes("government org") || name.includes("gov org")) {
    return [
      { name: "General Aptitude & Reasoning", qs: 30, marks: 30, duration: 35 },
      { name: "General Studies & English", qs: 30, marks: 30, duration: 35 },
      { name: "Technical Awareness & Post Specific", qs: 40, marks: 40, duration: 50 }
    ];
  }
  if (name.includes("ug entrance")) {
    return [
      { name: "General Aptitude", qs: 30, marks: 45, duration: 35 },
      { name: "Logical Reasoning & English", qs: 40, marks: 60, duration: 50 },
      { name: "Elementary Mathematics", qs: 30, marks: 45, duration: 35 }
    ];
  }
  if (name.includes("cuet")) {
    return [
      { name: "Section IA: Languages", qs: 20, marks: 80, duration: 15 },
      { name: "Section II: Domain Specific", qs: 25, marks: 100, duration: 25 },
      { name: "Section III: General Test", qs: 30, marks: 120, duration: 20 }
    ];
  }
  if (name.includes("mba")) {
    return [
      { name: "Quantitative Ability", qs: 22, marks: 66, duration: 40 },
      { name: "Data Interpretation & Logical Reasoning", qs: 20, marks: 60, duration: 40 },
      { name: "Verbal Ability & Reading Comprehension", qs: 24, marks: 72, duration: 40 }
    ];
  }
  // SSC exams detailed configurations
  if (name.includes("ssc cgl") || name.includes("cgl") || name.includes("ssc chsl") || name.includes("chsl") || name.includes("selection post")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 25, marks: 50, duration: 15 },
      { name: "General Awareness", qs: 25, marks: 50, duration: 10 },
      { name: "Quantitative Aptitude", qs: 25, marks: 50, duration: 20 },
      { name: "English Comprehension", qs: 25, marks: 50, duration: 15 }
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
      { name: "English or Hindi Language", qs: 20, marks: 40, duration: 15 }
    ];
  }
  if (name.includes("ssc cpo") || name.includes("cpo")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 50, marks: 50, duration: 30 },
      { name: "General Knowledge & General Awareness", qs: 50, marks: 50, duration: 20 },
      { name: "Quantitative Aptitude", qs: 50, marks: 50, duration: 40 },
      { name: "English Comprehension", qs: 50, marks: 50, duration: 30 }
    ];
  }
  if (name.includes("ssc je") || name.includes("je ")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 50, marks: 50, duration: 30 },
      { name: "General Awareness", qs: 50, marks: 50, duration: 30 },
      { name: "General Engineering (Civil/Electrical/Mechanical)", qs: 100, marks: 100, duration: 60 }
    ];
  }
  if (name.includes("ssc stenographer") || name.includes("stenographer")) {
    return [
      { name: "General Intelligence & Reasoning", qs: 50, marks: 50, duration: 35 },
      { name: "General Awareness", qs: 50, marks: 50, duration: 35 },
      { name: "English Language & Comprehension", qs: 100, marks: 100, duration: 50 }
    ];
  }
  if (name.includes("ssc jht") || name.includes("jht")) {
    return [
      { name: "General Hindi", qs: 100, marks: 100, duration: 60 },
      { name: "General English", qs: 100, marks: 100, duration: 60 }
    ];
  }
  if (name.includes("ssc departmental") || name.includes("departmental")) {
    return [
      { name: "General Awareness", qs: 30, marks: 30, duration: 40 },
      { name: "Office Procedure & Rules", qs: 40, marks: 40, duration: 40 },
      { name: "English Language & Writing", qs: 30, marks: 30, duration: 40 }
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
  const subjects = getCourseSubjects(courseName);
  const tests = [];

  // 1. Full Length Mock Tests (10 tests)
  for (let i = 1; i <= 10; i++) {
    tests.push({
      name: `Full Length Mock Test ${i}`,
      type: "Full Mock",
      qs: stats.questions,
      marks: stats.marks,
      duration: stats.duration,
      isFree: false
    });
  }

  // 2. Subject Tests (3 tests per subject)
  subjects.forEach((sub) => {
    for (let i = 1; i <= 3; i++) {
      tests.push({
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
  subjects.forEach((sub) => {
    const chapters = [
      { prefix: "Foundation Concept Booster", qs: 15, marks: 30, duration: 15 },
      { prefix: "Core Topic Evaluation", qs: 20, marks: 40, duration: 20 },
      { prefix: "Advanced Practice Set", qs: 25, marks: 50, duration: 20 }
    ];
    chapters.forEach((chap, chapIdx) => {
      tests.push({
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
  const startYear = 2020;
  for (let i = 0; i < 6; i++) {
    const year = startYear + i;
    tests.push({
      name: `Previous Year Paper (${year} Exam)`,
      type: "PYP",
      qs: stats.questions,
      marks: stats.marks,
      duration: stats.duration,
      isFree: false
    });
  }

  // Set isFree flag per type/category: Exactly the first 4 of each type are free
  const typeCounters = {};
  tests.forEach((test) => {
    if (!isPremium) {
      test.isFree = true;
    } else {
      const currentCount = typeCounters[test.type] || 0;
      test.isFree = (currentCount < 4);
      typeCounters[test.type] = currentCount + 1;
    }
  });

  return tests;
};

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function getPseudoRandom(seed, index) {
  let val = hashCode(seed) + index * 98765;
  val = (val * 1103515245 + 12345) & 0x7fffffff;
  return val;
}

function generateUniqueMCQsForCourse(courseName, category, count = 60) {
  const mcqs = [];
  const name = courseName.toLowerCase();
  
  let domain = "general";
  if (name.includes("judiciary") || name.includes("law")) {
    domain = "law";
  } else if (name.includes("civil services") || name.includes("upsc") || name.includes("pcs")) {
    domain = "civil_services";
  } else if (name.includes("nursing") || name.includes("paramedical")) {
    domain = "medical";
  } else if (name.includes("food technology") || name.includes("food tech")) {
    domain = "food_tech";
  } else if (name.includes("fitter")) {
    domain = "fitter";
  } else if (name.includes("electrician")) {
    domain = "electrician";
  } else if (name.includes("electronic mechanic") || name.includes("electronics")) {
    domain = "electronics";
  } else if (name.includes("computer science") || name.includes("cse") || name.includes("gate cs")) {
    domain = "computer_science";
  } else if (name.includes("civil engineering")) {
    domain = "civil_eng";
  } else if (name.includes("electrical engineering")) {
    domain = "electrical_eng";
  } else if (name.includes("mechanical engineering") || name.includes("mechanical")) {
    domain = "mechanical_eng";
  } else if (name.includes("teaching") || name.includes("ctet") || name.includes("pedagogy") || name.includes("tet") || name.includes("prt") || name.includes("pgt") || name.includes("tgt") || name.includes("b.ed")) {
    domain = "teaching";
  } else if (name.includes("banking") || name.includes("insurance") || name.includes("sbi") || name.includes("ibps") || name.includes("sebi") || name.includes("lic") || name.includes("mba") || name.includes("placement")) {
    domain = "banking_finance";
  }

  for (let idx = 0; idx < count; idx++) {
    const rVal = getPseudoRandom(courseName, idx);
    let questionText = "";
    let baseOptions = [];
    let hintText = "";
    
    if (domain === "law") {
      const maxims = [
        { term: "Actus non facit reum nisi mens sit rea", meaning: "An act does not make a person guilty unless their mind is also guilty" },
        { term: "Audi alteram partem", meaning: "Listen to the other side (no one should be condemned unheard)" },
        { term: "Res judicata pro veritate accipitur", meaning: "A matter judged is accepted as truth" },
        { term: "Caveat emptor", meaning: "Let the buyer beware" },
        { term: "Damnum sine injuria", meaning: "Damage without legal injury" },
        { term: "Ubi jus ibi remedium", meaning: "Where there is a right, there is a remedy" },
        { term: "Volenti non fit injuria", meaning: "To a willing person, injury is not done" },
        { term: "Delegatus non potest delegare", meaning: "A delegate cannot delegate" },
        { term: "Salus populi suprema lex", meaning: "The welfare of the people is the supreme law" }
      ];
      const ipc = [
        { sec: "300", topic: "Murder" },
        { sec: "302", topic: "Punishment for Murder" },
        { sec: "304", topic: "Culpable Homicide" },
        { sec: "307", topic: "Attempt to Murder" },
        { sec: "375", topic: "Rape" },
        { sec: "378", topic: "Theft" },
        { sec: "379", topic: "Punishment for Theft" },
        { sec: "390", topic: "Robbery" },
        { sec: "405", topic: "Criminal Breach of Trust" },
        { sec: "415", topic: "Cheating" },
        { sec: "420", topic: "Cheating and dishonestly inducing delivery of property" }
      ];
      const consti = [
        { art: "14", topic: "Equality before law" },
        { art: "19", topic: "Protection of certain rights regarding freedom of speech" },
        { art: "21", topic: "Protection of life and personal liberty" },
        { art: "32", topic: "Remedies for enforcement of Fundamental Rights (Writs)" },
        { art: "44", topic: "Uniform Civil Code" },
        { art: "51", topic: "Promotion of international peace and security" },
        { art: "124", topic: "Establishment and Constitution of Supreme Court" },
        { art: "226", topic: "Power of High Courts to issue writs" },
        { art: "324", topic: "Superintendence, direction and control of elections" },
        { art: "356", topic: "Provisions in case of failure of constitutional machinery in States (President's Rule)" },
        { art: "368", topic: "Power of Parliament to amend the Constitution" }
      ];

      const type = rVal % 3;
      if (type === 0) {
        const item = maxims[rVal % maxims.length];
        questionText = `What is the correct legal meaning of the Latin maxim "${item.term}"?`;
        baseOptions = [
          item.meaning,
          maxims[(rVal + 1) % maxims.length].meaning,
          maxims[(rVal + 2) % maxims.length].meaning,
          maxims[(rVal + 3) % maxims.length].meaning
        ];
        hintText = `"${item.term}" literally means "${item.meaning}".`;
      } else if (type === 1) {
        const item = ipc[rVal % ipc.length];
        questionText = `Which section of the Indian Penal Code (IPC) defines or provides punishment for "${item.topic}"?`;
        baseOptions = [
          `Section ${item.sec}`,
          `Section ${ipc[(rVal + 1) % ipc.length].sec}`,
          `Section ${ipc[(rVal + 2) % ipc.length].sec}`,
          `Section ${ipc[(rVal + 3) % ipc.length].sec}`
        ];
        hintText = `Section ${item.sec} of the IPC is related to "${item.topic}".`;
      } else {
        const item = consti[rVal % consti.length];
        questionText = `Which article of the Constitution of India deals with "${item.topic}"?`;
        baseOptions = [
          `Article ${item.art}`,
          `Article ${consti[(rVal + 1) % consti.length].art}`,
          `Article ${consti[(rVal + 2) % consti.length].art}`,
          `Article ${consti[(rVal + 3) % consti.length].art}`
        ];
        hintText = `Article ${item.art} is dedicated to "${item.topic}".`;
      }
    } else if (domain === "teaching") {
      const theorists = ["Jean Piaget", "Lev Vygotsky", "Howard Gardner", "B.F. Skinner", "Lawrence Kohlberg", "Edward Thorndike", "Albert Bandura", "Noam Chomsky", "Jerome Bruner", "Ivan Pavlov"];
      const concepts = ["Cognitive Development Stages", "Social Constructivism", "Multiple Intelligences Theory", "Operant Conditioning", "Moral Development Stages", "Trial and Error Learning", "Social Learning Theory", "Language Acquisition Device", "Scaffolding in instruction", "Classical Conditioning"];
      const disabilities = [
        { name: "Dyslexia", meaning: "difficulty in reading and language comprehension" },
        { name: "Dysgraphia", meaning: "difficulty in writing and fine motor skills" },
        { name: "Dyscalculia", meaning: "difficulty in mathematical calculations" },
        { name: "ADHD", meaning: "difficulty with attention, hyperactivity, and impulsivity" },
        { name: "Aphasia", meaning: "difficulty in language comprehension and expression" }
      ];

      const type = rVal % 3;
      if (type === 0) {
        const theorist = theorists[rVal % theorists.length];
        const concept = concepts[rVal % concepts.length];
        questionText = `Which developmental psychologist or education theorist is most closely associated with the concept of "${concept}"?`;
        baseOptions = [
          theorist,
          theorists[(rVal + 1) % theorists.length],
          theorists[(rVal + 2) % theorists.length],
          theorists[(rVal + 3) % theorists.length]
        ];
        hintText = `The theory of "${concept}" is a core contribution of ${theorist}.`;
      } else if (type === 1) {
        const item = disabilities[rVal % disabilities.length];
        questionText = `The learning disability known as "${item.name}" is primarily characterized by which of the following?`;
        baseOptions = [
          item.meaning,
          disabilities[(rVal + 1) % disabilities.length].meaning,
          disabilities[(rVal + 2) % disabilities.length].meaning,
          disabilities[(rVal + 3) % disabilities.length].meaning
        ];
        hintText = `"${item.name}" refers to ${item.meaning}.`;
      } else {
        const stages = ["Sensori-motor", "Pre-operational", "Concrete operational", "Formal operational"];
        const ages = ["0-2 years", "2-7 years", "7-11 years", "11 years and above"];
        const sIdx = rVal % stages.length;
        questionText = `According to Jean Piaget's cognitive development theory, the "${stages[sIdx]}" stage corresponds to which age group?`;
        baseOptions = [
          ages[sIdx],
          ages[(sIdx + 1) % ages.length],
          ages[(sIdx + 2) % ages.length],
          ages[(sIdx + 3) % ages.length]
        ];
        hintText = `Piaget's "${stages[sIdx]}" stage covers the age range of ${ages[sIdx]}.`;
      }
    } else if (domain === "medical") {
      const vitals = [
        { name: "blood pressure", normal: "120/80 mmHg" },
        { name: "resting heart rate", normal: "60-100 beats per minute" },
        { name: "body temperature", normal: "37°C (98.6°F)" },
        { name: "respiratory rate", normal: "12-20 breaths per minute" }
      ];
      const vitamins = [
        { name: "Vitamin A", disease: "Night Blindness" },
        { name: "Vitamin C", disease: "Scurvy" },
        { name: "Vitamin D", disease: "Rickets" },
        { name: "Vitamin K", disease: "Increased Bleeding/Delayed Clotting" },
        { name: "Vitamin B1", disease: "Beriberi" }
      ];
      const organs = [
        { name: "kidneys", func: "filtering metabolic waste from blood" },
        { name: "liver", func: "producing bile and processing nutrients" },
        { name: "skin", func: "acting as the body's largest sensory and protective barrier" },
        { name: "heart", func: "pumping blood throughout the circulatory system" },
        { name: "small intestine", func: "absorbing the majority of nutrients from digested food" },
        { name: "pancreas", func: "secreting insulin to regulate blood sugar levels" }
      ];

      const type = rVal % 3;
      if (type === 0) {
        const item = vitals[rVal % vitals.length];
        questionText = `What is considered the standard normal range/value for a healthy resting adult's ${item.name}?`;
        baseOptions = [
          item.normal,
          vitals[(rVal + 1) % vitals.length].normal,
          vitals[(rVal + 2) % vitals.length].normal,
          "140/90 mmHg"
        ];
        hintText = `A normal adult's ${item.name} is typically around ${item.normal}.`;
      } else if (type === 1) {
        const item = vitamins[rVal % vitamins.length];
        questionText = `A severe deficiency of "${item.name}" in the human diet is the primary cause of which condition?`;
        baseOptions = [
          item.disease,
          vitamins[(rVal + 1) % vitamins.length].disease,
          vitamins[(rVal + 2) % vitamins.length].disease,
          vitamins[(rVal + 3) % vitamins.length].disease
        ];
        hintText = `Deficiency of ${item.name} leads directly to ${item.disease}.`;
      } else {
        const item = organs[rVal % organs.length];
        questionText = `Which organ of the human body is primarily responsible for the vital function of "${item.func}"?`;
        baseOptions = [
          item.name,
          organs[(rVal + 1) % organs.length].name,
          organs[(rVal + 2) % organs.length].name,
          organs[(rVal + 3) % organs.length].name
        ];
        hintText = `The ${item.name} plays a major role in ${item.func}.`;
      }
    } else if (domain === "food_tech") {
      const methods = [
        { name: "Pasteurization", principle: "heating liquid to destroy pathogenic microbes" },
        { name: "Lyophilization (Freeze Drying)", principle: "sublimating ice from frozen food under vacuum" },
        { name: "Canning", principle: "sealing food in airtight containers and heating to sterilize" },
        { name: "Ultra-Heat Treatment (UHT)", principle: "heating liquid above 135°C for a few seconds to sterilize" },
        { name: "Irradiation", principle: "exposing food to ionizing radiation to kill insects and bacteria" }
      ];
      const microbes = [
        { name: "Clostridium botulinum", danger: "severe foodborne botulism via anaerobic canned foods" },
        { name: "Salmonella enterica", danger: "food poisoning from undercooked poultry and eggs" },
        { name: "Escherichia coli", danger: "gastrointestinal infection from contaminated water or beef" },
        { name: "Listeria monocytogenes", danger: "listeriosis, which is highly dangerous for pregnant women" }
      ];
      const safety = [
        { name: "FSSAI", desc: "Food Safety and Standards Authority of India" },
        { name: "Codex Alimentarius", desc: "International collection of food standards and codes of practice" },
        { name: "HACCP", desc: "Hazard Analysis Critical Control Point system for food safety" },
        { name: "ISO 22000", desc: "International standard for food safety management systems" }
      ];

      const type = rVal % 3;
      if (type === 0) {
        const item = methods[rVal % methods.length];
        questionText = `In food technology, what is the primary physical principle of "${item.name}"?`;
        baseOptions = [
          item.principle,
          methods[(rVal + 1) % methods.length].principle,
          methods[(rVal + 2) % methods.length].principle,
          methods[(rVal + 3) % methods.length].principle
        ];
        hintText = `"${item.name}" works by ${item.principle}.`;
      } else if (type === 1) {
        const item = microbes[rVal % microbes.length];
        questionText = `Which foodborne pathogen is most commonly associated with the risk of "${item.danger}"?`;
        baseOptions = [
          item.name,
          microbes[(rVal + 1) % microbes.length].name,
          microbes[(rVal + 2) % microbes.length].name,
          microbes[(rVal + 3) % microbes.length].name
        ];
        hintText = `"${item.name}" poses the risk of "${item.danger}".`;
      } else {
        const item = safety[rVal % safety.length];
        questionText = `What is the correct full definition or purpose of the food standard framework "${item.name}"?`;
        baseOptions = [
          item.desc,
          safety[(rVal + 1) % safety.length].desc,
          safety[(rVal + 2) % safety.length].desc,
          "International Agency for Agricultural Development and Inspection"
        ];
        hintText = `"${item.name}" stands for "${item.desc}".`;
      }
    } else if (domain === "fitter" || domain === "electrician" || domain === "electronics" || domain === "technical") {
      const tools = [
        { name: "Vernier Caliper", func: "measuring internal and external dimensions with a precision of 0.02 mm" },
        { name: "Outside Micrometer", func: "measuring outer diameters with high precision of 0.01 mm" },
        { name: "Try Square", func: "checking the squareness (90 degrees) and flatness of a surface" },
        { name: "Jenny Caliper", func: "drawing lines parallel to the outer edges of a workpiece" },
        { name: "Multimeter", func: "measuring electrical parameters like voltage, current, and resistance" },
        { name: "Megger", func: "testing the high insulation resistance of electrical cables" },
        { name: "Oscilloscope", func: "visualizing electrical signal waveforms in real time" },
        { name: "Bench Vice", func: "holding workpieces firmly during filing, sawing, or drilling operations" }
      ];
      const components = [
        { name: "Zener Diode", property: "maintaining a stable reference voltage in reverse breakdown" },
        { name: "Capacitor", property: "storing electrical energy in an electrostatic field" },
        { name: "Transistor", property: "amplifying weak signals and acting as an electronic switch" },
        { name: "Inductor", property: "storing energy in a magnetic field when current flows through it" },
        { name: "NOR Gate", property: "yielding a high output (1) only when all inputs are low (0)" },
        { name: "AND Gate", property: "performing Boolean multiplication (Y = A . B)" }
      ];

      const type = rVal % 2;
      if (type === 0) {
        const item = tools[rVal % tools.length];
        questionText = `In workshop practice and measurements, what is the primary use of a "${item.name}"?`;
        baseOptions = [
          item.func,
          tools[(rVal + 1) % tools.length].func,
          tools[(rVal + 2) % tools.length].func,
          tools[(rVal + 3) % tools.length].func
        ];
        hintText = `A "${item.name}" is used for "${item.func}".`;
      } else {
        const item = components[rVal % components.length];
        questionText = `What is the fundamental working property of the electronic component "${item.name}"?`;
        baseOptions = [
          item.property,
          components[(rVal + 1) % components.length].property,
          components[(rVal + 2) % components.length].property,
          components[(rVal + 3) % components.length].property
        ];
        hintText = `The main property of a "${item.name}" is "${item.property}".`;
      }
    } else if (domain === "computer_science") {
      const algos = [
        { name: "Dijkstra's Algorithm", utility: "finding the shortest path from a single source node in a weighted graph" },
        { name: "Binary Search", utility: "searching in a sorted array in O(log n) time complexity" },
        { name: "Quick Sort", utility: "sorting an array using divide-and-conquer with average-case O(n log n)" },
        { name: "Kruskal's Algorithm", utility: "finding the Minimum Spanning Tree of a weighted undirected graph" },
        { name: "Merge Sort", utility: "guaranteeing O(n log n) sorting time in all cases using divide-and-merge" }
      ];
      const layers = [
        { name: "Physical Layer", role: "transmitting raw bit streams over a physical medium" },
        { name: "Data Link Layer", role: "providing node-to-node data transfer and error detection" },
        { name: "Network Layer", role: "routing packets and handling logical IP addressing" },
        { name: "Transport Layer", role: "managing end-to-end communication, flow control, and TCP/UDP ports" },
        { name: "Application Layer", role: "supporting direct user protocols like HTTP, SMTP, and DNS" }
      ];
      const acid = [
        { prop: "Atomicity", definition: "ensuring that all operations within a transaction succeed or all fail together" },
        { prop: "Consistency", definition: "ensuring the database moves from one valid state to another valid state" },
        { prop: "Isolation", definition: "ensuring concurrent transactions do not interfere with or see each other's partial changes" },
        { prop: "Durability", definition: "guaranteeing that completed transaction data remains safe even in a system crash" }
      ];

      const type = rVal % 3;
      if (type === 0) {
        const item = algos[rVal % algos.length];
        questionText = `What is the primary application or characteristic of the algorithm "${item.name}"?`;
        baseOptions = [
          item.utility,
          algos[(rVal + 1) % algos.length].utility,
          algos[(rVal + 2) % algos.length].utility,
          algos[(rVal + 3) % algos.length].utility
        ];
        hintText = `"${item.name}" is used for "${item.utility}".`;
      } else if (type === 1) {
        const item = layers[rVal % layers.length];
        questionText = `In the OSI networking model, what is the main responsibility of the "${item.name}"?`;
        baseOptions = [
          item.role,
          layers[(rVal + 1) % layers.length].role,
          layers[(rVal + 2) % layers.length].role,
          layers[(rVal + 3) % layers.length].role
        ];
        hintText = `The "${item.name}" is responsible for "${item.role}".`;
      } else {
        const item = acid[rVal % acid.length];
        questionText = `In database transactions (ACID properties), how is "${item.prop}" defined?`;
        baseOptions = [
          item.definition,
          acid[(rVal + 1) % acid.length].definition,
          acid[(rVal + 2) % acid.length].definition,
          "allocating memory dynamically for records"
        ];
        hintText = `"${item.prop}" is defined as "${item.definition}".`;
      }
    } else if (domain === "civil_eng" || domain === "electrical_eng" || domain === "mechanical_eng" || name.includes("engineering")) {
      const concepts = [
        { field: "Civil", topic: "soundness test of cement", details: "checking the cement's ability to retain volume using Le-Chatelier's apparatus" },
        { field: "Civil", topic: "surveying wholesomeness principle", details: "working from whole to part to localize and minimize experimental errors" },
        { field: "Mechanical", topic: "Carnot cycle thermal efficiency", details: "being a function of absolute temperature limits only: 1 - T_low/T_high" },
        { field: "Mechanical", topic: "Diesel cycle combustion", details: "taking place at constant pressure, unlike constant volume in Otto cycle" },
        { field: "Electrical", topic: "Thevenin's theorem", details: "simplifying a linear circuit to an equivalent voltage source in series with a resistor" },
        { field: "Electrical", topic: "transformer core lamination", details: "reducing eddy current losses by electromagnetic core structure" }
      ];

      const item = concepts[rVal % concepts.length];
      questionText = `In ${item.field} Engineering, what is the significance/meaning of "${item.topic}"?`;
      baseOptions = [
        item.details,
        concepts[(rVal + 1) % concepts.length].details,
        concepts[(rVal + 2) % concepts.length].details,
        "an aesthetic requirement for high visual design specifications"
      ];
      hintText = `"${item.topic}" refers to "${item.details}".`;
    } else if (domain === "banking_finance") {
      const concepts = [
        { name: "RTGS (Real Time Gross Settlement)", desc: "settling fund transfers individually and immediately on a continuous basis" },
        { name: "Statutory Liquidity Ratio (SLR)", desc: "the minimum percentage of deposits that banks must maintain in gold, cash, or approved securities" },
        { name: "Lender of last resort", desc: "the role of the central bank (RBI) to provide liquidity to banks in distress" },
        { name: "Consumer Price Index (CPI)", desc: "the primary index used to measure retail inflation in the Indian economy" },
        { name: "IPO (Initial Public Offering)", desc: "the process by which a private company offers shares to the public for the first time" }
      ];

      const item = concepts[rVal % concepts.length];
      questionText = `In banking and financial markets, what does "${item.name}" refer to?`;
      baseOptions = [
        item.desc,
        concepts[(rVal + 1) % concepts.length].desc,
        concepts[(rVal + 2) % concepts.length].desc,
        "a penalty fee charged on accounts that fall below the minimum threshold"
      ];
      hintText = `"${item.name}" refers to "${item.desc}".`;
    } else {
      const history = [
        { event: "the Battle of Plassey", year: "1757", fact: "June 23, establishing East India Company rule" },
        { event: "the Battle of Buxar", year: "1764", fact: "October 22, consolidating British power in Bengal" },
        { event: "the Indian Revolt (Sepoy Mutiny)", year: "1857", fact: "May 10, beginning at Meerut against the Company" },
        { event: "the Quit India Movement", year: "1942", fact: "August 8, launched by Mahatma Gandhi with 'Do or Die'" },
        { event: "the Jallianwala Bagh Massacre", year: "1919", fact: "April 13, general Dyer ordering firing on a peaceful crowd" }
      ];

      const type = rVal % 3;
      if (type === 0) {
        const item = history[rVal % history.length];
        questionText = `In modern Indian history, in which year did "${item.event}" occur?`;
        baseOptions = [
          item.year,
          history[(rVal + 1) % history.length].year,
          history[(rVal + 2) % history.length].year,
          "1947"
        ];
        hintText = `"${item.event}" occurred in ${item.year} (${item.fact}).`;
      } else if (type === 1) {
        const v1 = ((rVal % 5) + 1) * 100;
        const v2 = ((rVal >> 3) % 4) + 5;
        const ans = (v1 * v2 * 2) / 100;
        questionText = `What is the simple interest on Rs ${v1} for 2 years at an annual interest rate of ${v2}%?`;
        baseOptions = [
          `Rs ${ans}`,
          `Rs ${ans + 10}`,
          `Rs ${ans - 10}`,
          `Rs ${(v1 * v2) / 100}`
        ];
        hintText = `Formula: SI = P * R * T / 100. So, ${v1} * ${v2} * 2 / 100 = Rs ${ans}.`;
      } else {
        const words = [
          { term: "PRISTINE", syn: "Uncorrupted/Pure", ant: "Dirty/Spoiled" },
          { term: "EPHEMERAL", syn: "Transient/Short-lived", ant: "Permanent/Eternal" },
          { term: "BENEVOLENT", syn: "Kind/Generous", ant: "Malevolent/Hostile" },
          { term: "AUDACIOUS", syn: "Bold/Daring", ant: "Timid/Fearful" },
          { term: "METICULOUS", syn: "Precise/Thorough", ant: "Careless/Sloppy" }
        ];
        const item = words[rVal % words.length];
        const isSyn = rVal % 2 === 0;
        questionText = `In English vocabulary, what is the closest ${isSyn ? 'synonym' : 'antonym'} of the word "${item.term}"?`;
        baseOptions = [
          isSyn ? item.syn : item.ant,
          isSyn ? item.ant : item.syn,
          "Irrelevant/Neutral",
          "Excessive/Loud"
        ];
        hintText = `The word "${item.term}" has "${item.syn}" as its synonym and "${item.ant}" as its antonym.`;
      }
    }
    
    // Deterministic option shuffle
    const optIndices = [0, 1, 2, 3];
    const swap = (arr, i1, i2) => {
      const temp = arr[i1];
      arr[i1] = arr[i2];
      arr[i2] = temp;
    };
    swap(optIndices, 0, rVal % 4);
    swap(optIndices, 1, (rVal >> 2) % 4);
    swap(optIndices, 2, (rVal >> 4) % 4);
    
    const finalOptions = optIndices.map(i => baseOptions[i]);
    const finalAnswerIdx = optIndices.indexOf(0);
    
    mcqs.push({
      question: questionText,
      options: finalOptions,
      answer: finalAnswerIdx,
      hint: hintText
    });
  }
  
  return mcqs;
}

const categories = [
  "SSC", "PG Entrance Exam", "Regulatory Body Exams", "Teaching Exams", 
  "Fitter", "Electrician", "AE/JE Exams", "Judiciary Exams", 
  "Paramedical Exams", "Electronic Mechanic", "Railways", 
  "Banking & Insurance", "State Exams", "Defence Exams", 
  "Civil Services", "Police Exams", "B.Ed Entrance Exams",
  "Non - Teaching Exams", "TGT/PGT Exams", "TET/PRT Exams", "NET/SET Exams",
  "Food Technology", "Nursing Recruitment Exams", "Mechanical Engineering",
  "Civil Engineering", "Electrical Engineering", "Electronics & Communication Eng",
  "Computer Science & Engineering", "Other Engineering Exams", "ITI Exams",
  "Accounting and Commerce", "Campus Placements", "NRA CET",
  "Instrumentation Engineering", "Government Organizations", "UG Entrance Exams",
  "CUET", "MBA Entrance Exam", "Banking"
];

const examsByCategory = {
  "SSC": [
    "SSC CGL Mock Test",
    "SSC CHSL Mock Test",
    "SSC MTS Mock Test",
    "SSC GD Constable Mock Test",
    "SSC CPO Mock Test",
    "SSC JE Mock Test",
    "SSC Stenographer Mock Test",
    "SSC JHT (Junior Hindi Translator) Mock Test",
    "SSC Selection Post Mock Test",
    "SSC Departmental Exams Mock Test"
  ],
  "PG Entrance Exam": [
    "GATE Computer Science Mock Test",
    "GATE Electrical Engineering Mock Test",
    "GATE Civil Engineering Mock Test",
    "GATE Mechanical Engineering Mock Test",
    "GATE Electronics & Comm Mock Test",
    "UGC NET General Paper 1 Mock Test",
    "CSIR NET Life Sciences Mock Test",
    "CSIR NET Chemical Sciences Mock Test"
  ],
  "Regulatory Body Exams": [
    "SEBI Grade A Officer Mock Test",
    "NABARD Grade A Officer Mock Test",
    "RBI Grade B Officer Mock Test",
    "PFRDA Grade A Officer Mock Test",
    "IFSCA Grade A Officer Mock Test"
  ],
  "Teaching Exams": [
    "CTET Paper 1 Pedagogy Mock Test",
    "CTET Paper 2 Pedagogy Mock Test",
    "UPTET Paper 1 Mock Test",
    "UPTET Paper 2 Mock Test",
    "KVS PGT General Mock Test",
    "KVS TGT General Mock Test",
    "NVS TGT Mock Test",
    "Super TET Mock Test"
  ],
  "Fitter": [
    "ITI Fitter Semester 1 Mock Test",
    "ITI Fitter Semester 2 Mock Test",
    "ITI Fitter Yearly Theory Mock Test"
  ],
  "Electrician": [
    "ITI Electrician Semester 1 Mock Test",
    "ITI Electrician Semester 2 Mock Test",
    "ITI Electrician Yearly Theory Mock Test"
  ],
  "AE/JE Exams": [
    "RRB JE Civil Engineering Mock Test",
    "RRB JE Electrical Engineering Mock Test",
    "RRB JE Mechanical Engineering Mock Test",
    "SSC JE Civil Technical Mock Test",
    "SSC JE Electrical Technical Mock Test",
    "SSC JE Mechanical Technical Mock Test",
    "State PSC AE Civil Mock Test",
    "State PSC JE Electrical Mock Test"
  ],
  "Judiciary Exams": [
    "Delhi Judiciary Service Mock Test",
    "UP Civil Judge Junior Mock Test",
    "Bihar Judiciary Exam Mock Test",
    "MP Judiciary Service Mock Test",
    "Rajasthan Judiciary Mock Test"
  ],
  "Paramedical Exams": [
    "AIIMS NORCET Staff Nurse Mock Test",
    "ESIC Staff Nurse Recruitment Mock Test",
    "RRB Paramedical Staff Mock Test",
    "DSSSB Nursing Officer Mock Test"
  ],
  "Electronic Mechanic": [
    "ITI Electronic Mechanic Semester 1 Mock Test",
    "ITI Electronic Mechanic Semester 2 Mock Test",
    "ITI Electronic Mechanic Yearly Theory Mock Test"
  ],
  "Railways": [
    "RRB NTPC CBT 1 Mock Test",
    "RRB NTPC CBT 2 Mock Test",
    "RRB ALP Stage 1 Mock Test",
    "RRB ALP Stage 2 Mock Test",
    "RRB Group D Mock Test",
    "RRB JE CBT 1 Mock Test"
  ],
  "Banking & Insurance": [
    "SBI PO Mock Test",
    "SBI Clerk Mock Test",
    "IBPS PO Mock Test",
    "IBPS Clerk Mock Test",
    "IBPS RRB PO Mock Test",
    "RBI Assistant Mock Test",
    "LIC AAO Mock Test",
    "LIC ADO Mock Test",
    "NIACL AO Mock Test"
  ],
  "State Exams": [
    "UPPSC PCS Prelims Mock Test",
    "BPSC PCS Prelims Mock Test",
    "MPPSC PCS Prelims Mock Test",
    "RAS Rajasthan PCS Mock Test",
    "MPSC Maharashtra PCS Mock Test"
  ],
  "Defence Exams": [
    "NDA General Ability Mock Test",
    "CDS Elementary Mathematics Mock Test",
    "CDS General Knowledge Mock Test",
    "AFCAT Entry Mock Test",
    "CAPF Assistant Commandant Mock Test",
    "Indian Airforce X/Y Group Mock Test"
  ],
  "Civil Services": [
    "UPSC Civil Services Prelims GS 1 Mock Test",
    "UPSC Civil Services Prelims CSAT Mock Test",
    "State PSC GS Paper 1 Mock Test",
    "State PSC GS Paper 2 Mock Test"
  ],
  "Police Exams": [
    "UP Police Constable Mock Test",
    "UP Police SI Mock Test",
    "Delhi Police Constable Mock Test",
    "Delhi Police SI Mock Test",
    "Bihar Police Constable Mock Test"
  ],
  "B.Ed Entrance Exams": [
    "UP B.Ed Joint Entrance Exam Mock Test",
    "Bihar B.Ed CET Mock Test",
    "Delhi University B.Ed Entrance Mock Test"
  ],
  "Non - Teaching Exams": [
    "EMRS Non-Teaching Staff Mock Test",
    "DSSSB Non-Teaching Assistant Mock Test",
    "KVS Non-Teaching Clerk Mock Test"
  ],
  "TGT/PGT Exams": [
    "UP TGT School Teacher Mock Test",
    "UP PGT School Teacher Mock Test",
    "DSSSB TGT Mock Test",
    "KVS PGT Mock Test"
  ],
  "TET/PRT Exams": [
    "CTET Paper 1 Child Pedagogy",
    "CTET Paper 2 Child Pedagogy",
    "UPTET Paper 1 Mock Test",
    "Super TET Primary Teacher Mock Test"
  ],
  "NET/SET Exams": [
    "UGC NET Paper 1 General Aptitude",
    "UGC NET Commerce Paper 2 Mock Test",
    "UGC NET Computer Science Mock Test",
    "CSIR NET Life Sciences Mock Test"
  ],
  "Food Technology": [
    "FSSAI Central Food Safety Officer Mock Test",
    "FSSAI Technical Officer Mock Test",
    "State Food Safety Officer Mock Test"
  ],
  "Nursing Recruitment Exams": [
    "AIIMS NORCET Nursing Officer Mock Test",
    "ESIC Staff Nurse Recruitment Mock Test",
    "DSSSB Nursing Officer Mock Test"
  ],
  "Mechanical Engineering": [
    "GATE Mechanical Engineering Mock Test",
    "SSC JE Mechanical Mock Test",
    "RRB JE Mechanical Mock Test",
    "ISRO Mechanical Mock Test"
  ],
  "Civil Engineering": [
    "GATE Civil Engineering Mock Test",
    "SSC JE Civil Mock Test",
    "RRB JE Civil Mock Test",
    "ISRO Civil Mock Test"
  ],
  "Electrical Engineering": [
    "GATE Electrical Engineering Mock Test",
    "SSC JE Electrical Mock Test",
    "RRB JE Electrical Mock Test",
    "ISRO Electrical Mock Test"
  ],
  "Electronics & Communication Eng": [
    "GATE Electronics & Comm Mock Test",
    "ISRO Electronics Mock Test",
    "BARC Electronics Mock Test"
  ],
  "Computer Science & Engineering": [
    "GATE Computer Science & IT Mock Test",
    "ISRO Computer Science Mock Test",
    "NIELIT Scientist B Mock Test"
  ],
  "Other Engineering Exams": [
    "GATE Chemical Engineering Mock Test",
    "GATE Biotechnology Mock Test",
    "GATE Aerospace Engineering Mock Test"
  ],
  "ITI Exams": [
    "ITI Fitter Trade Theory Mock Test",
    "ITI Electrician Trade Theory Mock Test",
    "ITI Electronic Mechanic Trade Theory Mock Test"
  ],
  "Accounting and Commerce": [
    "UGC NET Commerce Paper 2 Mock Test",
    "CA Foundation Principles of Accounting",
    "CMA Foundation Financial Accounting"
  ],
  "Campus Placements": [
    "TCS NQT Cognitive Skills Mock Test",
    "Infosys Specialist Programmer Mock Test",
    "Wipro Elite Talent Hunt Mock Test",
    "Cognizant GenC Quantitative Mock Test"
  ],
  "NRA CET": [
    "NRA CET Matriculation 10th Level Mock Test",
    "NRA CET Higher Secondary 12th Level Mock Test",
    "NRA CET Graduation Level Mock Test"
  ],
  "Instrumentation Engineering": [
    "GATE Instrumentation Engineering Mock Test",
    "ISRO Instrumentation Mock Test"
  ],
  "Government Organizations": [
    "ISRO Scientist recruitment Mock Test",
    "BARC Scientific Officer Mock Test",
    "DRDO Scientist B Mock Test"
  ],
  "UG Entrance Exams": [
    "CUET UG General Test Mock Test",
    "JEE Main Physics & Chemistry Mock Test",
    "JEE Main Mathematics Mock Test",
    "NEET UG Complete Practice Mock Test"
  ],
  "CUET": [
    "CUET UG Section III General Test Mock Test",
    "CUET UG Section IA English Mock Test",
    "CUET UG Physics & Chemistry Mock Test"
  ],
  "MBA Entrance Exam": [
    "CAT Quantitative Aptitude Mock Test",
    "CAT Data Interpretation & LR Mock Test",
    "CAT Verbal Ability & RC Mock Test",
    "CMAT Complete Syllabus Mock Test"
  ],
  "Banking": [
    "SBI PO Preliminary Mock Test",
    "SBI Clerk Preliminary Mock Test",
    "IBPS PO Preliminary Mock Test",
    "IBPS Clerk Preliminary Mock Test"
  ]
};

// Helper to match courses to categories
const getCategoryForCourse = (courseName) => {
  const name = courseName.toLowerCase();
  
  // Specific Engineering disciplines first
  if (name.includes("civil engineering")) return "Civil Engineering";
  if (name.includes("electrical engineering")) return "Electrical Engineering";
  if (name.includes("mechanical engineering") || name.includes("mechanical")) return "Mechanical Engineering";
  if (name.includes("electronics & communication") || name.includes("electronics") || name.includes("ece")) return "Electronics & Communication Eng";
  if (name.includes("computer science") || name.includes("cse")) return "Computer Science & Engineering";
  if (name.includes("instrumentation")) return "Instrumentation Engineering";
  if (name.includes("other engineering")) return "Other Engineering Exams";
  
  // Specific Teaching/Academic exams
  if (name.includes("tgt") || name.includes("pgt")) return "TGT/PGT Exams";
  if (name.includes("tet") || name.includes("prt")) return "TET/PRT Exams";
  if (name.includes("net") || name.includes("set")) return "NET/SET Exams";
  if (name.includes("b.ed")) return "B.Ed Entrance Exams";
  if (name.includes("teaching") || name.includes("ctet") || name.includes("uptet") || name.includes("kvs")) return "Teaching Exams";
  
  // ITI and technical
  if (name.includes("fitter")) return "Fitter";
  if (name.includes("electrician")) return "Electrician";
  if (name.includes("electronic mechanic")) return "Electronic Mechanic";
  if (name.includes("iti exam") || name.includes("iti")) return "ITI Exams";
  
  // Miscellaneous
  if (name.includes("non-teaching") || name.includes("non teaching")) return "Non - Teaching Exams";
  if (name.includes("food tech") || name.includes("food technology")) return "Food Technology";
  if (name.includes("nursing recruitment") || name.includes("nursing")) return "Nursing Recruitment Exams";
  if (name.includes("accounting") || name.includes("commerce")) return "Accounting and Commerce";
  if (name.includes("placement") || name.includes("campus placement")) return "Campus Placements";
  if (name.includes("nra cet") || name.includes("nra")) return "NRA CET";
  if (name.includes("government org") || name.includes("gov org") || name.includes("govt org")) return "Government Organizations";
  if (name.includes("ug entrance") || name.includes("under graduate")) return "UG Entrance Exams";
  if (name.includes("cuet")) return "CUET";
  if (name.includes("mba")) return "MBA Entrance Exam";
  
  // Standard categories
  if (name.includes("police") || name.includes("constable")) return "Police Exams";
  if (name.includes("ssc") || name.includes("cgl") || name.includes("cpo")) return "SSC";
  if (name.includes("ae") || name.includes("je")) return "AE/JE Exams";
  if (name.includes("rrb") || name.includes("alp") || name.includes("ntpc") || name.includes("group d")) return "Railways";
  
  // Banking
  if (name.includes("sbi po") || name.includes("ibps po") || name.includes("banking")) {
    if (name.includes("insurance")) return "Banking & Insurance";
    return "Banking";
  }
  if (name.includes("bank") || name.includes("sbi") || name.includes("ibps") || name.includes("lic") || name.includes("rbi")) return "Banking & Insurance";
  
  if (name.includes("sebi") || name.includes("nabard") || name.includes("regulatory")) return "Regulatory Body Exams";
  if (name.includes("jrf") || name.includes("gate")) return "PG Entrance Exam";
  if (name.includes("judiciary")) return "Judiciary Exams";
  if (name.includes("paramedical")) return "Paramedical Exams";
  if (name.includes("civil") || name.includes("upsc") || name.includes("pcs")) return "Civil Services";
  if (name.includes("nda") || name.includes("cds") || name.includes("defence") || name.includes("afcat")) return "Defence Exams";
  
  return "State Exams"; // Default fallback
};

const getGeneratedName = (category, idx, baseCourse) => {
  const num = idx + 1;
  switch (category) {
    case "SSC":
      return `SSC CGL Practice Mock Paper ${num}`;
    case "AE/JE Exams":
      return `JE/AE Technical Test Set ${num}`;
    case "Railways":
      return `RRB NTPC CBT Mock Exam ${num}`;
    case "Banking & Insurance":
      return `IBPS PO Banking & Insurance Practice Set ${num}`;
    case "Regulatory Body Exams":
      return `NABARD Grade A Officer Prep Set ${num}`;
    case "PG Entrance Exam":
      if (baseCourse.name.includes("GATE")) {
        return `${baseCourse.name.replace("Mock", "Practice").replace("Exam", "Test")} Set ${num}`;
      } else if (baseCourse.name.includes("UGC") || baseCourse.name.includes("CSIR")) {
        return `${baseCourse.name.replace("Booster", "Set").replace("Paper", "Test").replace("Prep", "Set")} ${num}`;
      } else {
        return `${baseCourse.name} Practice Set ${num}`;
      }
    case "Teaching Exams":
      return `CTET Paper 1 Pedagogy Mock Set ${num}`;
    case "Fitter":
      return `ITI Fitter Theory Practice Set ${num}`;
    case "Electrician":
      return `ITI Electrician Basic Theory Mock ${num}`;
    case "Judiciary Exams":
      return `State Judiciary Law Prep Test ${num}`;
    case "Paramedical Exams":
      return `Paramedical Staff Nurse Practice Set ${num}`;
    case "Electronic Mechanic":
      return `Electronic Mechanic Semester Prep Set ${num}`;
    case "Civil Services":
      return `UPSC Civil Services GS Practice ${num}`;
    case "Defence Exams":
      return `NDA General Ability Defence Mock ${num}`;
    case "Police Exams":
      return `UP Police Constable Practice Mock ${num}`;
    case "B.Ed Entrance Exams":
      return `UP B.Ed Joint Entrance Test Set ${num}`;
    case "State Exams":
      return `NEET Practice Mock Set ${num}`;
    case "Non - Teaching Exams":
      return `Non-Teaching Staff Mock Paper ${num}`;
    case "TGT/PGT Exams":
      return `TGT/PGT School Teacher Test ${num}`;
    case "TET/PRT Exams":
      return `State TET/PRT Practice Set ${num}`;
    case "NET/SET Exams":
      return `UGC NET/SET Assistant Prof Mock ${num}`;
    case "Food Technology":
      return `Food Technology Officer Practice ${num}`;
    case "Nursing Recruitment Exams":
      return `Nursing Recruitment Staff Nurse Mock ${num}`;
    case "Mechanical Engineering":
      return `Mechanical Engineering Core Test ${num}`;
    case "Civil Engineering":
      return `Civil Engineering Structure Test ${num}`;
    case "Electrical Engineering":
      return `Electrical Engineering Basic Mock ${num}`;
    case "Electronics & Communication Eng":
      return `ECE Circuit & Systems Test ${num}`;
    case "Computer Science & Engineering":
      return `CSE Algorithm & Coding Prep ${num}`;
    case "Other Engineering Exams":
      return `Other Engineering Simulator Set ${num}`;
    case "ITI Exams":
      return `ITI Semester Trade Mock ${num}`;
    case "Accounting and Commerce":
      return `Accounting and Commerce Finance Mock ${num}`;
    case "Campus Placements":
      return `Campus Placement Aptitude Test ${num}`;
    case "NRA CET":
      return `NRA CET Common Eligibility Test ${num}`;
    case "Instrumentation Engineering":
      return `Instrumentation Engineering Sensors Mock ${num}`;
    case "Government Organizations":
      return `Govt Org Officer Recruitment Mock ${num}`;
    case "UG Entrance Exams":
      return `Under Graduate Entrance Mock ${num}`;
    case "CUET":
      return `CUET General Test Preparation ${num}`;
    case "MBA Entrance Exam":
      return `MBA CAT/MAT Quantitative Mock ${num}`;
    case "Banking":
      return `IBPS/SBI Banking Practice Paper ${num}`;
    default:
      return `${baseCourse.name} Simulator Set ${num}`;
  }
};

async function seed() {
  console.log('Clearing old purchases...');
  await prisma.purchase.deleteMany({});

  console.log('Clearing old test attempts...');
  await prisma.testAttempt.deleteMany({});

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

  // Load courses directly from examsByCategory mapping
  const expandedCourses = [];
  for (const cat of categories) {
    const list = examsByCategory[cat] || [];
    for (const name of list) {
      expandedCourses.push({
        name: name,
        category: cat
      });
    }
  }

  console.log(`Seeding ${expandedCourses.length} courses with batch MCQ and TestSeries inserts...`);

  for (const item of expandedCourses) {
    const isPremium = 
      item.category === "SSC" || 
      item.category === "PG Entrance Exam" || 
      item.category === "Regulatory Body Exams" || 
      item.category === "Judiciary Exams" || 
      item.category === "Civil Services";

    const course = await prisma.course.create({
      data: { 
        name: item.name, 
        active: true,
        premium: isPremium
      }
    });

    const courseMcqs = generateUniqueMCQsForCourse(course.name, item.category, 60);

    // Seed MCQs in a batch
    await prisma.mCQQuestion.createMany({
      data: courseMcqs.map(q => ({
        courseId: course.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        hint: q.hint || ""
      }))
    });

    // Seed test series in a batch
    const subTests = generateSubTestsList(course.name, course.premium);
    await prisma.testSeries.createMany({
      data: subTests.map(test => ({
        courseId: course.id,
        name: test.name,
        type: test.type,
        qs: test.qs,
        marks: test.marks,
        duration: test.duration,
        isFree: test.isFree
      }))
    });

    console.log(`Created course "${course.name}" (ID: ${course.id}) with 60 MCQs and ${subTests.length} Test Series.`);
  }

  console.log('All done!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
