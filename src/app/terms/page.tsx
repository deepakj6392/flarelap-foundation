"use client";

import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-950 font-sans antialiased">
      <Herader />

      <main className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          
          {/* Header */}
          <div className="border-b border-slate-100 pb-8 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              Legal Document
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Terms & Conditions
            </h1>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              Last Updated: 17 June, 2026
            </p>
          </div>

          {/* Introduction */}
          <div className="mt-8 text-sm leading-7 text-slate-700 space-y-6 font-medium">
            <p>
              Welcome to the Flarelap Global Foundation website (
              <a href="https://www.flarelap.org" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-bold">
                www.flarelap.org
              </a>
              ) (&quot;the Website&quot;). These Terms &amp; Conditions outline the rules and regulations governing your use of our Website and services. By accessing or using this Website, you accept and agree to comply with these terms in full. If you disagree with any part of these Terms &amp; Conditions, please do not use our Website.
            </p>

            {/* Table of Contents */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/60 p-6 my-8">
              <h2 className="text-base font-black text-slate-900 mb-4">Table of Contents</h2>
              <ul className="grid gap-2 text-xs font-bold text-slate-650">
                <li>
                  <a href="#acceptance" className="hover:text-emerald-700 transition">
                    1. Acceptance of Terms
                  </a>
                </li>
                <li>
                  <a href="#donations" className="hover:text-emerald-700 transition">
                    2. Donations and Payments
                  </a>
                </li>
                <li>
                  <a href="#refund-policy" className="hover:text-emerald-700 transition">
                    3. Refund Policy
                  </a>
                </li>
                <li>
                  <a href="#education-portal" className="hover:text-emerald-700 transition">
                    4. Student Portal and Educational Resources
                  </a>
                </li>
                <li>
                  <a href="#volunteer-terms" className="hover:text-emerald-700 transition">
                    5. Volunteer and Internship Conduct
                  </a>
                </li>
                <li>
                  <a href="#disclaimers" className="hover:text-emerald-700 transition">
                    6. Limitation of Liability and Disclaimers
                  </a>
                </li>
                <li>
                  <a href="#contact-info" className="hover:text-emerald-700 transition">
                    7. Contact Information
                  </a>
                </li>
              </ul>
            </div>

            {/* Sections */}
            <div className="space-y-10 pt-4">
              
              {/* Section 1 */}
              <section id="acceptance" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  1. Acceptance of Terms
                </h2>
                <p className="mt-4">
                  By accessing, browsing, or using the Website, registering as a student, donor, or volunteer, you acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions. We reserve the right to amend these terms at any time without prior notice, and such amendments will become effective immediately upon posting.
                </p>
              </section>

              {/* Section 2 */}
              <section id="donations" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  2. Donations and Payments
                </h2>
                <p className="mt-4">
                  All donations made through our secure payment gateway go towards our social development initiatives, including digital education, health camps, and economic relief programs.
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-650">
                  <li>Donations must be made using valid credit cards, debit cards, net banking, or other approved digital payment methods.</li>
                  <li>You warrant that all payment credentials you provide are correct and you are authorized to execute the transaction.</li>
                  <li>Tax exemption certificates (e.g., under 80G as applicable in India) will be issued to qualified donors subject to tax regulation compliance.</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="refund-policy" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  3. Refund Policy
                </h2>
                <p className="mt-4">
                  Flarelap Global Foundation handles all contributions with utmost transparency and accountability. As a general rule, all donations made to the foundation are final and non-refundable.
                </p>
                <p className="mt-4">
                  However, we recognize that errors can happen (such as technical double-charges or unauthorized transactions). In such events:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-650">
                  <li>Donors may submit a written refund request by emailing us at <a href="mailto:contact@flarelap.org" className="text-emerald-700 hover:underline font-bold">contact@flarelap.org</a> within 15 working days from the transaction date.</li>
                  <li>Requests must include valid proof of deduction, bank transaction reference ID, and date of donation.</li>
                  <li>Approved refunds will be processed and credited back to the original payment source within 7 to 10 working days of approval, subject to gateway processing times.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="education-portal" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  4. Student Portal and Educational Resources
                </h2>
                <p className="mt-4">
                  Our student login dashboard provides access to mock tests, MCQs, and learning materials.
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-650">
                  <li>Accounts are strictly for personal, non-commercial educational use. Share of account credentials is prohibited.</li>
                  <li>Scraping, copying, or distributing mock test questions (JEE/NEET bundles) is an infringement of intellectual property.</li>
                  <li>We do not guarantee test scores or admissions; resources are intended solely for preparation assistance.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="volunteer-terms" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  5. Volunteer and Internship Conduct
                </h2>
                <p className="mt-4">
                  Volunteers and interns registering through the website are representatives of our social missions and must maintain high ethical standards:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-650">
                  <li>Keep confidentiality of beneficiary information and data.</li>
                  <li>Abide by safety codes and guidelines during ground relief campaigns.</li>
                  <li>Refrain from representing the foundation for monetary solicitation without written authorization.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="disclaimers" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  6. Limitation of Liability and Disclaimers
                </h2>
                <p className="mt-4">
                  The content on this Website is provided on an &quot;as is&quot; and &quot;as available&quot; basis. Flarelap Global Foundation makes no warranties, expressed or implied, regarding the accuracy, completeness, or suitability of materials. We shall not be liable for any damages arising out of the use or inability to use this Website.
                </p>
              </section>

              {/* Section 7 */}
              <section id="contact-info" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  7. Changes to Terms &amp; Contact Information
                </h2>
                <p className="mt-4">
                  We reserve the right to review and update these terms to reflect legal compliance. If you have questions about these Terms &amp; Conditions or the Refund Policy, contact us at:
                </p>
                <div className="mt-6 rounded-2xl bg-emerald-50/50 border border-emerald-500/10 p-6">
                  <p className="font-extrabold text-slate-900">
                    Flarelap Global Foundation
                  </p>
                  <p className="text-xs text-slate-600 mt-1 font-bold">
                    Email:{" "}
                    <a href="mailto:contact@flarelap.org" className="underline hover:text-emerald-950">
                      contact@flarelap.org
                    </a>
                  </p>
                </div>
              </section>
              
            </div>

            <p className="text-center text-xs text-slate-400 mt-12 pt-8 border-t border-slate-100 font-bold">
              Thank you for supporting our community missions.
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
