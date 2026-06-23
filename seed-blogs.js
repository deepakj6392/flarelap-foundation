import { prisma } from './src/lib/prisma.ts';

async function main() {
  const blogs = [
    {
      title: "Empowering Rural Youth through Digitized Learning Hubs",
      slug: "empowering-rural-youth-through-digitized-learning-hubs",
      content: `
        <h2>The Digital Divide in Rural India</h2>
        <p>In today's fast-paced world, digital literacy is no longer a luxury—it is an absolute necessity. However, a significant digital divide still separates rural youth from their urban counterparts. At Flarelap Global Foundation, we believe that every child, regardless of their geographical location, deserves access to modern technology and digitized education.</p>
        
        <h2>Setting up Learning Hubs</h2>
        <p>To address this gap, we have launched the "Digitized Learning Hubs" initiative. We establish computer labs in remote village schools, equipped with desktop computers, internet connectivity, and interactive learning software. These hubs serve as classrooms during school hours and community learning centers in the evening.</p>
        
        <h2>Empowering the Next Generation</h2>
        <p>By teaching coding, basic computer application skills, and internet research techniques, we open up a world of opportunities for rural children. This hands-on training builds confidence, fosters creativity, and prepares students for future academic and professional endeavors. We are committed to scaling this project to cover 50 more villages in the coming year.</p>
      `,
      thumbnail: "/uploads/about/education.png",
      excerpt: "Establishing modern computer labs and internet-based classrooms in remote villages to bridge the digital divide for rural students.",
      metaTitle: "Empowering Rural Youth through Digitized Learning Hubs | Flarelap",
      metaDesc: "Discover how Flarelap Global Foundation bridges the digital divide by setting up digitized learning hubs and computer labs in rural schools.",
      keywords: "rural education, digital literacy, computer labs, youth empowerment, rural development, NGO India",
      published: true
    },
    {
      title: "Why Early Childhood Nutrition is the Cornerstone of Education",
      slug: "early-childhood-nutrition-cornerstone-of-education",
      content: `
        <h2>The Link Between Health and Learning</h2>
        <p>It is impossible to teach a hungry child. Brain development during the first five years of a child's life is critical, and nutrition plays a foundational role. Chronic undernutrition leads to stunting, cognitive delays, and poor concentration levels in school. At Flarelap, we address education and health together.</p>
        
        <h2>Our Midday Meal and Supplement Program</h2>
        <p>We work closely with rural schools to supplement standard midday meals with nutrient-dense supplements, fresh fruits, and iron-fortified milk. We also educate mothers about low-cost nutritious foods that can be prepared easily at home using local produce.</p>
        
        <h2>Tracking the Impact</h2>
        <p>Since the launch of our nutrition program, cooperating schools have reported a 30% increase in student attendance, along with remarkable improvements in test scores and energy levels. Healthier bodies pave the way for smarter minds, proving that nutrition is the ultimate foundation for learning.</p>
      `,
      thumbnail: "/uploads/about/health.png",
      excerpt: "Exploring the critical link between child health, cognitive development, and classroom focus, and how our programs support healthy meals.",
      metaTitle: "Why Nutrition is the Cornerstone of Education | Flarelap Foundation",
      metaDesc: "Learn how the nutrition programs by Flarelap Global Foundation improve classroom focus, brain development, and school attendance in rural regions.",
      keywords: "child nutrition, rural health, education health connection, clean meals, community health, preventive care",
      published: true
    },
    {
      title: "The Power of Mentorship: Transforming Trajectories of First-Generation Students",
      slug: "power-of-mentorship-transforming-trajectories",
      content: `
        <h2>Navigating Uncharted Territories</h2>
        <p>First-generation students are the first in their families to pursue higher education or professional careers. While their parents are supportive, they often lack the technical knowledge, network, and guidance required to navigate modern admission procedures, interview processes, and career choices.</p>
        
        <h2>The One-on-One Mentor Program</h2>
        <p>Through our network of volunteer professionals, Flarelap pairs students with experienced mentors from various fields. These mentors guide them in choosing courses, practicing communication skills, and preparing resumes. They act as sounding boards, helping students overcome impostor syndrome and build confidence.</p>
        
        <h2>Success Beyond the Village</h2>
        <p>Over the last three years, more than 400 of our mentored students have gained admission into reputable state colleges and secured corporate internships. This program shows that a few hours of structured mentoring can rewrite a student's life path.</p>
      `,
      thumbnail: "/uploads/about/hero.png",
      excerpt: "How pairing volunteer professionals with first-generation college aspirants helps them break barriers and unlock global opportunities.",
      metaTitle: "Power of Mentorship: First-Generation Students Guide | Flarelap",
      metaDesc: "See how professional mentors volunteer with Flarelap to guide rural, first-generation students through higher education and corporate careers.",
      keywords: "student mentorship, volunteer mentors, first generation students, education support, career guidance",
      published: true
    },
    {
      title: "Sustaining Clean Water Systems in Rural Communities",
      slug: "sustaining-clean-water-systems-in-rural-communities",
      content: `
        <h2>The Water Crisis and Public Health</h2>
        <p>Contaminated drinking water is the source of multiple water-borne diseases like cholera, typhoid, and diarrhea, which account for millions of school days lost every year. Setting up clean water systems is not just an infrastructure project; it is a direct boost to local health and livelihood.</p>
        
        <h2>Designing Community-Owned Filtration Plants</h2>
        <p>Flarelap Global Foundation installs RO-filtration systems and clean water hubs in regions with contaminated groundwater. Crucially, we form community committees to manage operations. We charge a nominal, affordable user fee which is put into a maintenance fund managed entirely by the villagers.</p>
        
        <h2>Long-Term Sustainability</h2>
        <p>By empowering the local community to own and maintain the purification units, we ensure they remain functional for years. This initiative has reduced instances of seasonal waterborne illnesses by over 70% in our target villages, demonstrating the success of community-owned solutions.</p>
      `,
      thumbnail: "/uploads/about/relief.png",
      excerpt: "Implementing low-cost, community-owned water filtration hubs that reduce waterborne illnesses and build rural self-reliance.",
      metaTitle: "Sustaining Clean Water Systems in Rural Communities | Flarelap",
      metaDesc: "Discover the clean water initiatives of Flarelap Global Foundation, establishing sustainable, community-owned filtration plants.",
      keywords: "clean water, water systems, rural sanitisation, community health, safe drinking water, rural infrastructure",
      published: true
    },
    {
      title: "Bridging the Gender Gap in STEM Education",
      slug: "bridging-gender-gap-in-stem-education",
      content: `
        <h2>Unlocking Scientific Potential</h2>
        <p>Girls in rural communities are frequently discouraged from pursuing science, technology, engineering, and mathematics (STEM) fields due to social biases and a lack of local role models. We believe that empowering girls in STEM is crucial for global progress and equal opportunity.</p>
        
        <h2>STEM Clubs and Hands-on Science Labs</h2>
        <p>We established girls-only STEM clubs in 12 rural high schools. These clubs provide access to practical science kits, coding bootcamps, and interactive electronics projects. We also host visits from female engineers and researchers who share their inspiring journeys.</p>
        
        <h2>Fostering Curiosity and Confidence</h2>
        <p>By providing a supportive and hands-on learning environment, we have seen rural girls design working solar chargers, enter science competitions, and express strong interests in pursuing engineering and medicine. This project is a key step towards gender equality in technical fields.</p>
      `,
      thumbnail: "/uploads/education_hero.png",
      excerpt: "Providing girls in rural schools with dedicated STEM clubs, science kits, and mentorship to cultivate technical careers.",
      metaTitle: "Bridging the Gender Gap in STEM Education | Flarelap Foundation",
      metaDesc: "Learn about the STEM clubs and coding bootcamps run by Flarelap to encourage rural girls to pursue careers in science and engineering.",
      keywords: "STEM education, gender equality, women in science, rural girls tutoring, computer coding, female literacy",
      published: true
    },
    {
      title: "Vocational Training: Unleashing the Potential of Rural Women",
      slug: "vocational-training-unleashing-potential-rural-women",
      content: `
        <h2>Economic Independence at the Grassroots</h2>
        <p>When women earn an income, they invest up to 90% of it back into their families—supporting education, nutrition, and healthcare. Helping rural women gain vocational skills is one of the most effective ways to break the cycle of generational poverty.</p>
        
        <h2>Our Tailoring and Crafts Training Program</h2>
        <p>At our livelihood centers, we offer free, certified vocational courses in sewing, textile design, and handicraft creation. Crucially, the training goes beyond skills: we teach financial literacy, online marketing, and how to form self-help groups (SHGs).</p>
        
        <h2>From Trainees to Entrepreneurs</h2>
        <p>We have supported over 300 women in setting up home-based tailoring shops and securing collective contracts from local textile manufacturers. With a steady income, these women are now active decision-makers in their families and communities.</p>
      `,
      thumbnail: "/uploads/about/livelihood.png",
      excerpt: "Empowering rural women through tailoring, embroidery, and micro-business courses that generate local employment and financial independence.",
      metaTitle: "Vocational Training for Rural Women Livelihoods | Flarelap",
      metaDesc: "Explore the vocational training courses run by Flarelap Foundation that help rural women start micro-businesses and gain financial independence.",
      keywords: "vocational training, women empowerment, micro finance, rural livelihoods, tailoring classes, skill development",
      published: true
    },
    {
      title: "Health on Wheels: Bringing Preventive Care to Underserved Villages",
      slug: "health-on-wheels-preventive-care-villages",
      content: `
        <h2>The Healthcare Accessibility Barrier</h2>
        <p>For many rural families, visiting a clinic means losing a day's wages, spending money on travel, and walking long distances. Consequently, simple health concerns go untreated, developing into serious medical conditions over time. Preventive health should be easily accessible.</p>
        
        <h2>Our Mobile Medical Units</h2>
        <p>Our 'Health on Wheels' project deploys customized vans staffed by doctors, nurses, and pharmacists directly to underserved villages. We provide free diagnostics, basic checkups, pediatric care, and essential medicines. We also conduct diabetes, hypertension, and vision tests.</p>
        
        <h2>Early Detection Saves Lives</h2>
        <p>By bringing regular, monthly screening to the doorsteps of rural families, we detect chronic illnesses early and coordinate referrals to urban hospitals when necessary. Over 15,000 villagers have received care through this initiative, proving that mobile checkups improve lives.</p>
      `,
      thumbnail: "/uploads/about/health.png",
      excerpt: "Delivering primary medical consultations, diagnostic screenings, and free medication via mobile vans directly to rural doorsteps.",
      metaTitle: "Health on Wheels: Rural Mobile Medical Vans | Flarelap",
      metaDesc: "See how the Health on Wheels program by Flarelap brings doctors and diagnostic tools directly to remote villages for preventive care.",
      keywords: "mobile health clinic, rural healthcare, preventive checkups, healthcare on wheels, medical camp, free checkup",
      published: true
    },
    {
      title: "Community-Driven Libraries: Fostering a Culture of Reading",
      slug: "community-driven-libraries-fostering-reading",
      content: `
        <h2>Cultivating a Love for Books</h2>
        <p>Access to stories, literature, and knowledge shouldn't be limited to those in urban settings. While textbooks teach core syllabi, voluntary reading develops vocabulary, curiosity, and independent critical thinking. Many village children grow up without reading a single non-academic storybook.</p>
        
        <h2>Establishing Library Corners</h2>
        <p>Flarelap partners with local youth groups to set up libraries in community halls or empty schoolrooms. We stock them with local-language children's literature, scientific magazines, and basic encyclopedias. The youth act as voluntary librarians, hosting weekly reading and storytelling hours.</p>
        
        <h2>Igniting Young Minds</h2>
        <p>These libraries have become vibrant safe spaces for children after school. Encouraging interactive discussions, quiz sessions, and reading contests has rekindled a genuine interest in books, boosting local reading and writing skills.</p>
      `,
      thumbnail: "/uploads/about/education.png",
      excerpt: "Setting up small reading centers in villages stocked with storybooks, encyclopedias, and hosting storytelling sessions.",
      metaTitle: "Community Libraries: Fostering Reading Culture | Flarelap",
      metaDesc: "Learn how community-driven libraries established by Flarelap Global Foundation spark children's imagination and increase literacy rates.",
      keywords: "community library, children reading habits, rural libraries, literacy program, books for kids, voluntary reading",
      published: true
    },
    {
      title: "How Voluntary Action Strengthens Grassroots Development",
      slug: "voluntary-action-strengthens-grassroots-development",
      content: `
        <h2>The Heart of Development</h2>
        <p>Top-down development projects often struggle because they fail to engage the local community. True, lasting development begins from within. Volunteers are the essential link that translates development programs into local realities.</p>
        
        <h2>Mobilizing Village Volunteers</h2>
        <p>At Flarelap Global Foundation, we train local youth and community elders to volunteer in our education, health, and relief drives. By training local coordinators, we ensure our outreach campaigns are tailored to the cultural context and command the trust of villagers.</p>
        
        <h2>A Shared Responsibility</h2>
        <p>When community members actively volunteer to clean water hubs, organize medical queues, or mentor school children, they take ownership of their community's progress. Voluntary action transforms beneficiaries into active agents of local change.</p>
      `,
      thumbnail: "/uploads/about/hero.png",
      excerpt: "Analyzing the role of local volunteer networks in making non-profit campaigns sustainable, trusted, and impactful.",
      metaTitle: "How Voluntary Action Strengthens Grassroots Development | Flarelap",
      metaDesc: "Discover the vital role that local volunteers play in driving, executing, and sustaining the programs of Flarelap Global Foundation.",
      keywords: "volunteering, grassroots development, community helpers, non profit volunteer, community action, NGO volunteer",
      published: true
    },
    {
      title: "Designing Sustainable Impact: A Look into Our Program Transparency",
      slug: "sustainable-impact-program-transparency",
      content: `
        <h2>The Trust Deficit in Philanthropy</h2>
        <p>Donors often ask: "Where does my money actually go?" and "How is it helping?" In the non-profit sector, maintaining complete transparency is vital to building trust, securing funding, and maintaining long-term community relationships.</p>
        
        <h2>Our Digital Audit and Accountability Framework</h2>
        <p>Flarelap maintains a strict digital ledger of all donations received and tracks every dollar spent. We compile detailed quarterly reports detailing purchase invoices, student progress charts, health-camp lists, and audit findings, publishing them on our portal.</p>
        
        <h2>Why Transparency Drives Scaling</h2>
        <p>By showing exact numbers and visual evidence, we assure our partners of absolute integrity. This direct reporting increases donor retention and enables us to secure large corporate grants to expand our rural programs.</p>
      `,
      thumbnail: "/uploads/home_hero.png",
      excerpt: "A deep dive into Flarelap's transparency model, detailing our financial reports, program audits, and impact metrics.",
      metaTitle: "Sustainable Impact and Program Transparency | Flarelap",
      metaDesc: "Learn how Flarelap Global Foundation implements rigorous audit standards, digital ledgers, and impact reporting for complete donor transparency.",
      keywords: "ngo transparency, program impact, charity accountability, sustainable donation, impact reporting, measured change",
      published: true
    }
  ];

  console.log('Starting seeding of blogs...');
  
  for (const b of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }

  console.log('10 blogs seeded successfully');
}

main()
  .catch((e) => {
    console.error('Seeding blogs failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
