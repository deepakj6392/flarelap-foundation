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

const generateSubTestsList = (courseName, isPremium) => {
  const stats = getRealExamStats(courseName);
  const tests = [];

  // 1-10: Full Length Mock Tests (10 tests)
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

  // 11-13: Sectional Mock Tests (3 tests)
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
  tests.push({
    name: "Sectional Mock Test 3: High Difficulty Booster",
    type: "Subject Test",
    qs: Math.max(10, Math.round(stats.questions * 0.5)),
    marks: Math.max(20, Math.round(stats.marks * 0.5)),
    duration: Math.max(15, Math.round(stats.duration * 0.5)),
    isFree: false
  });

  // 14-16: Previous Year Papers (3 tests)
  tests.push({
    name: "Previous Year Paper (2023 Exam)",
    type: "PYP",
    qs: stats.questions,
    marks: stats.marks,
    duration: stats.duration,
    isFree: false
  });
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

  // Set isFree flag: If course is free, all are free. If course is premium (paid), only first 3 tests are free.
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
