// English to Hindi translation utility for procedurally generated mock test questions.

const stateMap: Record<string, string> = {
  "delhi": "दिल्ली",
  "bombay": "बॉम्बे",
  "allahabad": "इलाहाबाद",
  "madras": "मद्रास",
  "rajasthan": "राजस्थान",
  "patna": "पटना",
  "punjab": "पंजाब",
  "gujarat": "गुजरात",
  "karnataka": "कर्नाटक",
  "kerala": "केरल",
  "mumbai": "मुंबई",
  "bangalore": "बेंगलुरु",
  "chennai": "चेन्नई",
  "kolkata": "कोलकाता",
  "pune": "पुणे",
  "hyderabad": "हैदराबाद",
  "ahmedabad": "अहमदाबाद",
  "uttar pradesh": "उत्तर प्रदेश",
  "bihar": "बिहार",
  "madhya pradesh": "मध्य प्रदेश",
  "maharashtra": "महाराष्ट्र",
  "haryana": "हरियाणा",
  "west bengal": "पश्चिम बंगाल",
  "tamil nadu": "तमिलनाडु",
  "andhra pradesh": "आंध्र प्रदेश",
  "telangana": "तेलंगाना",
  "odisha": "ओडिशा",
  "assam": "असम",
  "jharkhand": "झारखंड",
  "chhattisgarh": "छत्तीसगढ़",
  "uttarakhand": "उत्तराखंड",
  "himachal pradesh": "हिमाचल प्रदेश",
  "jammu & kashmir": "जम्मू और कश्मीर",
  "goa": "गोवा",
  "tripura": "त्रिपुरा",
  "manipur": "मणिपुर",
  "meghalaya": "मेघालय",
  "nagaland": "नागालैंड",
  "arunachal pradesh": "अरुणाचल प्रदेश",
  "mizoram": "मिजोरम",
  "sikkim": "सिक्किम",
  "puducherry": "पुडुचेरी",
  "ladakh": "लद्दाख",
  "andaman & nicobar": "अंडमान और निकोबार",
  "chandigarh": "चंडीगढ़"
};

const commonTerms: Record<string, string> = {
  "which of the following represents the correct legal meaning of the latin maxim": "निम्नलिखित में से कौन सा लैटिन मैक्सिम का सही कानूनी अर्थ दर्शाता है",
  "which of the following correctly identifies the year in which": "निम्नलिखित में से कौन सा सही वर्ष की पहचान करता है जिसमें",
  "occurred in the region of": "क्षेत्र में हुआ था",
  "in modern indian history": "आधुनिक भारतीय इतिहास में",
  "what is the statutory scope of": "का वैधानिक दायरा क्या है",
  "in this scenario": "इस परिदृश्य में",
  "which deals with": "जो संबंधित है",
  "what specific jurisdiction or directive is highlighted involving": "से जुड़े किस विशिष्ट क्षेत्राधिकार या निर्देश पर प्रकाश डाला गया है",
  "in a contract scenario": "एक अनुबंध परिदृश्य में",
  "offers to sell": "बेचने का प्रस्ताव देता है",
  "what is the status of the contract under the indian contract act": "भारतीय अनुबंध अधिनियम के तहत अनुबंध की स्थिति क्या है",
  "in a class": "कक्षा",
  "learning setting": "के शिक्षण वातावरण में",
  "when designing lesson plans focusing on": "पर केंद्रित पाठ योजनाएँ बनाते समय",
  "which educator's theory is most relevant": "किस शिक्षाविद् का सिद्धांत सबसे प्रासंगिक है",
  "in a classroom assessment": "कक्षा मूल्यांकन में",
  "identifies that the student": "पहचानता है कि छात्र",
  "exhibits symptoms consistent with": "के अनुकूल लक्षण प्रदर्शित करता है",
  "what is the primary characteristic of this learning challenge": "इस सीखने की चुनौती की प्राथमिक विशेषता क्या है",
  "according to jean piaget's cognitive development theory": "जीन पियाजे के संज्ञानात्मक विकास सिद्धांत के अनुसार",
  "during the": "के दौरान",
  "stage, what cognitive milestone should a student achieve in a": "चरण में, एक छात्र को कौन सा संज्ञानात्मक मील का पत्थर हासिल करना चाहिए",
  "to clear your concept on neet physics 2026 pattern": "NEET भौतिकी 2026 पैटर्न पर अपनी अवधारणा स्पष्ट करने के लिए",
  "to clear your concept on neet chemistry 2026 pattern": "NEET रसायन विज्ञान 2026 पैटर्न पर अपनी अवधारणा स्पष्ट करने के लिए",
  "to clear your concept on neet biology 2026 pattern": "NEET जीव विज्ञान 2026 पैटर्न पर अपनी अवधारणा स्पष्ट करने के लिए",
  "to clear your concept on jee physics 2026 pattern": "JEE भौतिकी 2026 पैटर्न पर अपनी अवधारणा स्पष्ट करने के लिए",
  "to clear your concept on jee chemistry 2026 pattern": "JEE रसायन विज्ञान 2026 पैटर्न पर अपनी अवधारणा स्पष्ट करने के लिए",
  "to clear your concept on jee mathematics 2026 pattern": "JEE गणित 2026 पैटर्न पर अपनी अवधारणा स्पष्ट करने के लिए",
  "during a routine triage, a nurse evaluates a patient aged": "एक नियमित ट्राइएज के दौरान, एक नर्स मरीज का मूल्यांकन करती है जिसकी आयु",
  "and finds their": "है और पाती है कि उनका",
  "is abnormal. what is the standard healthy resting value for this parameter": "असामान्य है। इस पैरामीटर के लिए मानक स्वस्थ विश्राम मूल्य क्या है",
  "a patient presents with symptoms of": "एक मरीज लक्षणों के साथ प्रस्तुत होता है",
  "what nutritional deficiency does this indicate": "यह किस पोषण संबंधी कमी को दर्शाता है",
  "physiological study of": "का शारीरिक अध्ययन",
  "shows a reduction in its capacity for": "की क्षमता में कमी दिखाता है",
  "which of the following conditions is most closely linked to dysfunction in this organ": "निम्नलिखित में से कौन सी स्थिति इस अंग के काम न करने से सबसे निकटता से जुड़ी है",
  "a food quality engineer is designing a preservation process for": "एक खाद्य गुणवत्ता इंजीनियर संरक्षण प्रक्रिया तैयार कर रहा है",
  "what is the primary physical mechanism involved": "इसमें शामिल प्राथमिक भौतिक तंत्र क्या है",
  "during safety audits of packaged": "पैकेज्ड सुरक्षा ऑडिट के दौरान",
  "which pathogen presents the high risk of": "कौन सा रोगजनक का उच्च जोखिम प्रस्तुत करता है",
  "a manufacturing unit in": "में एक विनिर्माण इकाई",
  "applies": "लागू करती है",
  "for compliance. what is the scope of this safety framework": "अनुपालन के लिए। इस सुरक्षा ढांचे का दायरा क्या है",
  "in a manufacturing workshop, a technician is measuring": "एक विनिर्माण कार्यशाला में, एक तकनीशियन माप रहा है",
  "if they use a": "यदि वे उपयोग करते हैं",
  "what is the primary use": "तो प्राथमिक उपयोग क्या है",
  "a circuit designer incorporates a": "एक सर्किट डिजाइनर शामिल करता है",
  "for a": "के लिए एक",
  "application. what is its fundamental physical property": "अनुप्रयोग। इसका मूलभूत भौतिक गुण क्या है",
  "a machinist needs to turn a cylindrical workpiece of length": "एक मशीनिस्ट को लंबाई वाले एक बेलनाकार वर्कपीस को मोड़ने की आवश्यकता है",
  "mm and diameter": "मिमी और व्यास",
  "what is the recommended safety precaution during high-speed lathe turning": "हाई-स्पीड लेथ टर्निंग के दौरान अनुशंसित सुरक्षा सावधानी क्या है",
  "an ac series circuit consists of a resistor of": "एक एसी श्रृंखला सर्किट में प्रतिरोधक शामिल है",
  "ohms and an inductive reactance of": "ओम और प्रेरक प्रतिक्रिया",
  "what is the total calculated impedance (z) of the circuit": "सर्किट की कुल परिकलित प्रतिबाधा (Z) क्या है",
  "when analyzing algorithm performance on a database of size": "आकार के डेटाबेस पर एल्गोरिथम प्रदर्शन का विश्लेषण करते समय",
  "what is the principal benefit of": "का प्रमुख लाभ क्या है",
  "during network transmission using the": "का उपयोग करके नेटवर्क ट्रांसमिशन के दौरान",
  "protocol, which of the following describes the key function of the": "प्रोटोकॉल, निम्नलिखित में से कौन कार्य का वर्णन करता है",
  "in database transactions (acid properties), which of the following represents the definition of": "डेटाबेस लेनदेन (ACID गुण) में, निम्नलिखित में से कौन परिभाषा का प्रतिनिधित्व करता है",
  "a simply supported concrete beam of span": "स्पैन की एक सरल समर्थित कंक्रीट बीम",
  "meters carries a uniformly distributed load of": "मीटर समान रूप से वितरित भार उठाती है",
  "what is the maximum bending moment (m_max = w * l^2 / 8) in the beam": "बीम में अधिकतम झुकने वाला क्षण (M_max = w * L^2 / 8) क्या है",
  "in levelling survey operations, if the elevation of the benchmark is": "लेवलिंग सर्वेक्षण संचालन में, यदि बेंचमार्क की ऊंचाई",
  "m and the back sight reading is": "मीटर है और बैक साइट रीडिंग",
  "m, what is the computed height of instrument (hi)": "मीटर है, तो उपकरण की गणना की गई ऊंचाई (HI) क्या है",
  "to check the soundness of portland cement due to excess lime, which survey or testing apparatus is standard": "अतिरिक्त चूने के कारण पोर्टलैंड सीमेंट की सुदृढ़ता की जांच करने के लिए, कौन सा सर्वेक्षण या परीक्षण उपकरण मानक है",
  "a dc shunt motor is connected to a": "एक डीसी शंट मोटर जुड़ी है",
  "v source. if the armature current is": "V स्रोत से। यदि आर्मेचर करंट",
  "a and the armature resistance is": "A है और आर्मेचर प्रतिरोध",
  "ohms, what is the back emf (eb)": "ओम है, तो बैक ईएमएफ (Eb) क्या है",
  "a single-phase step-down transformer has": "एक सिंगल-फेज स्टेप-डाउन ट्रांसफार्मर में",
  "primary turns and": "प्राथमिक घुमाव और",
  "secondary turns. if a primary voltage of": "द्वितीयक घुमाव होते हैं। यदि प्राथमिक वोल्टेज",
  "v is applied, what is the secondary voltage (v2)": "V लागू किया जाता है, तो द्वितीयक वोल्टेज (V2) क्या है",
  "which theorem simplifies a linear networks of voltages and resistances to a single current source in parallel with an equivalent resistor": "कौन सा प्रमेय वोल्टेज और प्रतिरोधों के रैखिक नेटवर्क को एक समान प्रतिरोधी के समानांतर एक एकल वर्तमान स्रोत में सरल बनाता है",
  "a carnot heat engine operates between source temperature of": "एक कार्नोट हीट इंजन स्रोत तापमान",
  "k and sink temperature of": "K और सिंक तापमान के बीच काम करता है",
  "what is the maximum thermal efficiency (%) of this engine": "इस इंजन की अधिकतम थर्मल दक्षता (%) क्या है",
  "determine the head loss due to friction in a pipe of length": "घर्षण के कारण सिर के नुकसान का निर्धारण करें पाइप की लंबाई",
  "m and diameter": "मीटर और व्यास",
  "where water flows at a velocity of": "जहां पानी वेग से बहता है",
  "which machining process uses abrasive stones to produce extremely high dimensional precision and surface finish on internal cylinders": "कौन सी मशीनिंग प्रक्रिया आंतरिक सिलेंडरों पर अत्यधिक उच्च आयामी सटीकता और सतह खत्म करने के लिए अपघर्षक पत्थरों का उपयोग करती है",
  "a bank customer deposits rs": "एक बैंक ग्राहक रुपये",
  "in a fixed deposit for a term of": "की अवधि के लिए सावधि जमा में",
  "years at an interest rate of": "वर्ष के लिए ब्याज दर पर जमा करता है",
  "% per annum simple interest. what is the interest earned at maturity": "% प्रति वर्ष साधारण ब्याज। परिपक्वता पर अर्जित ब्याज क्या है",
  "an analyst assesses a balance sheet showing current assets of rs": "एक विश्लेषक वर्तमान संपत्ति रुपये दिखाने वाली बैलेंस शीट का आकलन करता है",
  "and current liabilities of rs": "और वर्तमान देनदारियां रुपये",
  "what is the current ratio": "वर्तमान अनुपात क्या है",
  "which of the following regulatory tools is used by the reserve bank of india (rbi) to specify the minimum gold and liquid reserves banks must maintain": "भारतीय रिजर्व बैंक (RBI) द्वारा बैंकों को न्यूनतम सोना और तरल भंडार निर्दिष्ट करने के लिए निम्नलिखित में से किस नियामक उपकरण का उपयोग किया जाता है",
  "regarding the history of": "के इतिहास के संबंध में",
  "which of the following events or dynasties played a pivotal role in shaping its early heritage": "निम्नलिखित में से किस घटना या राजवंश ने इसके प्रारंभिक इतिहास को आकार देने में महत्वपूर्ण भूमिका निभाई",
  "in terms of the geography of": "के भूगोल के संदर्भ में",
  "which geographical feature or river basin forms the lifeline of this region": "कौन सी भौगोलिक विशेषता या नदी बेसिन इस क्षेत्र की जीवन रेखा बनाती है",
  "discussing the political scenario in": "में राजनीतिक परिदृश्य पर चर्चा करते हुए",
  "how are the local governance and assembly constituencies structured": "स्थानीय शासन और विधानसभा क्षेत्र कैसे संरचित हैं",
  "under the economic pillar of": "के आर्थिक स्तंभ के तहत",
  "which sector contributes the most to the state's gross state domestic product (gsdp)": "कौन सा क्षेत्र राज्य के सकल राज्य घरेलू उत्पाद (GSDP) में सबसे अधिक योगदान देता है",
  "regarding the environment and ecology of": "के पर्यावरण और पारिस्थितिकी के संबंध में",
  "which national park or wildlife reserve is a protected habitat here": "कौन सा राष्ट्रीय उद्यान या वन्यजीव अभ्यारण्य यहाँ एक संरक्षित आवास है",
  "in the administrative structure of": "के प्रशासनिक ढांचे में",
  "how is the executive power distributed between the governor, chief minister, and state bureaucrats": "राज्यपाल, मुख्यमंत्री और राज्य नौकरशाहों के बीच कार्यकारी शक्ति कैसे वितरित की जाती है",
  "which of the following historical places in": "में निम्नलिखित में से कौन सा ऐतिहासिक स्थान",
  "is recognized for its archaeological significance and ancient monuments": "अपने पुरातात्विक महत्व और प्राचीन स्मारकों के लिए मान्यता प्राप्त है",
  "in the realm of sports, which traditional game or modern sport tournament is celebrated with high enthusiasm in": "खेल के क्षेत्र में, किस पारंपरिक खेल या आधुनिक खेल टूर्नामेंट को उत्साह के साथ मनाया जाता है",
  "how does socialism and social welfare policy manifest in": "समाजवाद और समाज कल्याण नीति कैसे प्रकट होती है",
  "to uplift the marginalized communities": "हाशिए पर मौजूद समुदायों के उत्थान के लिए",
  "to clear your basic concept of indian history": "भारतीय इतिहास की अपनी बुनियादी अवधारणा को स्पष्ट करने के लिए",
  "to clear your basic concept of indian geography": "भारतीय भूगोल की अपनी बुनियादी अवधारणा को स्पष्ट करने के लिए",
  "to clear your basic concept of indian polity": "भारतीय राजनीति की अपनी बुनियादी अवधारणा को स्पष्ट करने के लिए",
  "to clear your basic concept of indian economy": "भारतीय अर्थव्यवस्था की अपनी बुनियादी अवधारणा को स्पष्ट करने के लिए",
  "to clear your basic concept of indian environment": "भारतीय पर्यावरण की अपनी बुनियादी अवधारणा को स्पष्ट करने के लिए",
  "to clear your basic concept of indian administration": "भारतीय प्रशासन की अपनी बुनियादी अवधारणा को स्पष्ट करने के लिए",
  "to clear your basic concept of indian sports": "भारतीय खेल की अपनी बुनियादी अवधारणा को स्पष्ट करने के लिए",
  "to clear your basic concept of indian socialism": "भारतीय समाजवाद की अपनी बुनियादी अवधारणा को स्पष्ट करने के लिए",
  "to clear your basic concept of the indian freedom movement": "भारतीय स्वतंत्रता आंदोलन की अपनी बुनियादी अवधारणा को स्पष्ट करने के लिए",
  "what was the primary characteristic of the town planning system of the indus valley civilisation": "सिंधु घाटी सभ्यता की नगर नियोजन प्रणाली की प्राथमिक विशेषता क्या थी",
  "which longitude is accepted as the standard meridian of india": "किस देशांतर को भारत के मानक मध्याह्न रेखा के रूप में स्वीकार किया जाता है",
  "is the primary regulator of the financial sector in india": "भारत में वित्तीय क्षेत्र का प्राथमिक नियामक है",
  "which of the following is responsible for conducting general elections in india": "भारत में आम चुनाव कराने के लिए निम्नलिखित में से कौन जिम्मेदार है",
  "which of the following is the oldest mountain range in india": "निम्नलिखित में से कौन सी भारत की सबसे पुरानी पर्वत श्रृंखला है",
  "what is the core theme of the upsc civil services prelims exam": "UPSC सिविल सेवा प्रारंभिक परीक्षा का मुख्य विषय क्या है"
};

const optionTranslationMap: Record<string, string> = {
  // Common choices / categories
  "equality before law": "कानून के समक्ष समानता",
  "protection of life and personal liberty": "जीवन और व्यक्तिगत स्वतंत्रता की सुरक्षा",
  "equality of opportunity in public employment": "सार्वजनिक रोजगार में अवसर की समानता",
  "abolition of untouchability": "अस्पृश्यता का उन्मूलन",
  "a democratic socialism aiming to end poverty, ignorance, disease, and inequality of opportunity": "एक लोकतांत्रिक समाजवाद जिसका उद्देश्य गरीबी, अज्ञानता, बीमारी और अवसर की असमानता को समाप्त करना है",
  "complete nationalisation of all private property and ban on private business": "सभी निजी संपत्ति का पूर्ण राष्ट्रीयकरण और निजी व्यवसाय पर प्रतिबंध",
  "alignment of india with the soviet bloc during the cold war": "शीत युद्ध के दौरान सोवियत ब्लॉक के साथ भारत का गठबंधन",
  "preferential distribution of wealth to political parties": "राजनीतिक दलों को धन का तरजीही वितरण",
  "the civil disobedience movement (salt satyagraha in 1930)": "सविनय अवज्ञा आंदोलन (1930 में नमक सत्याग्रह)",
  "the swadeshi movement (1905)": "स्वदेशी आंदोलन (1905)",
  "the non-cooperation movement (1920)": "असहयोग आंदोलन (1920)",
  "the quit india movement (1942)": "भारत छोड़ो आंदोलन (1942)",
  "rbi (reserve bank of india)": "RBI (भारतीय रिजर्व बैंक)",
  "sebi (securities and exchange board of india)": "SEBI (भारतीय प्रतिभूति और विनिमय बोर्ड)",
  "irda": "IRDA (बीमा नियामक और विकास प्राधिकरण)",
  "pfrda": "PFRDA (पेंशन निधि नियामक और विकास प्राधिकरण)",
  "election commission of india": "भारत निर्वाचन आयोग",
  "supreme court of india": "भारत का सर्वोच्च न्यायालय",
  "parliament of india": "भारत की संसद",
  "delhi high court": "दिल्ली उच्च न्यायालय",
  "aravali range": "अरावली पर्वत श्रृंखला",
  "himalayas": "हिमालय",
  "western ghats": "पश्चिमी घाट",
  "satpura range": "सतपुड़ा पर्वत श्रृंखला",
  "general studies and aptitude": "सामान्य अध्ययन और योग्यता",
  "specialized engineering fields": "विशेषज्ञता प्राप्त इंजीनियरिंग क्षेत्र",
  "medical sciences only": "केवल चिकित्सा विज्ञान",
  "foreign languages and literature": "विदेशी भाषाएं और साहित्य"
};

export function translateTextToHindi(englishText: string): string {
  if (!englishText) return englishText;

  let text = englishText;

  // 1. Replace states
  for (const [engState, hinState] of Object.entries(stateMap)) {
    const regex = new RegExp(`\\b${engState}\\b`, 'gi');
    text = text.replace(regex, hinState);
  }

  // 2. Replace templates/sentences
  for (const [engTerm, hinTerm] of Object.entries(commonTerms)) {
    // Escape special characters in the term
    const escaped = engTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    text = text.replace(regex, hinTerm);
  }

  // 3. Fallback translation for common words/question cues
  const wordTranslations: Record<string, string> = {
    "Question": "प्रश्न",
    "correct": "सही",
    "incorrect": "गलत",
    "What is": "क्या है",
    "Calculate": "गणना करें",
    "Determine": "निर्धारित करें",
    "synonym": "पर्यायवाची",
    "antonym": "विलोम शब्द",
    "of the word": "शब्द का",
    "explain": "व्याख्या करें",
    "explanation": "व्याख्या",
    "Hint": "संकेत",
    "Option": "विकल्प"
  };

  for (const [engWord, hinWord] of Object.entries(wordTranslations)) {
    const regex = new RegExp(`\\b${engWord}\\b`, 'gi');
    text = text.replace(regex, hinWord);
  }

  return text;
}

export function translateOptionToHindi(optionText: string): string {
  if (!optionText) return optionText;
  
  const lower = optionText.toLowerCase().trim();
  if (optionTranslationMap[lower]) {
    return optionTranslationMap[lower];
  }

  return translateTextToHindi(optionText);
}
