"use client";

import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              Last Updated: 17 June, 2026
            </p>
          </div>

          {/* Introduction */}
          <div className="mt-8 text-sm leading-7 text-slate-700 space-y-6 font-medium">
            <p>
              Thank you for visiting the Flarelap Global Foundation website (
              <a href="https://www.flarelap.org" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-bold">
                www.flarelap.org
              </a>
              ) (&quot;the Website&quot;). We are committed to safeguarding your privacy and protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and protect your personal data, and outlines your rights as a visitor, donor, or volunteer. By accessing or using our Website, you agree to the practices described below. Our Terms & Conditions and Refund Policy are set out in a separate document.
            </p>

            {/* Table of Contents */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/60 p-6 my-8">
              <h2 className="text-base font-black text-slate-900 mb-4">Table of Contents</h2>
              <ul className="grid gap-2 text-xs font-bold text-slate-650">
                <li>
                  <a href="#information-collect" className="hover:text-emerald-700 transition">
                    1. Information We Collect
                  </a>
                </li>
                <li>
                  <a href="#use-data" className="hover:text-emerald-700 transition">
                    2. Use of Personal Data
                  </a>
                </li>
                <li>
                  <a href="#data-sharing" className="hover:text-emerald-700 transition">
                    3. Data Sharing and Confidentiality
                  </a>
                </li>
                <li>
                  <a href="#your-rights" className="hover:text-emerald-700 transition">
                    4. Your Rights
                  </a>
                </li>
                <li>
                  <a href="#cookie-policy" className="hover:text-emerald-700 transition">
                    5. Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#payment-security" className="hover:text-emerald-700 transition">
                    6. Payment Gateway and Security
                  </a>
                </li>
                <li>
                  <a href="#external-services" className="hover:text-emerald-700 transition">
                    6.1 External Web Services and Third-Party Links
                  </a>
                </li>
                <li>
                  <a href="#changes-policy" className="hover:text-emerald-700 transition">
                    7. Changes to This Policy and Contact Information
                  </a>
                </li>
              </ul>
            </div>

            {/* Sections */}
            <div className="space-y-10 pt-4">
              
              {/* Section 1 */}
              <section id="information-collect" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  1. Information We Collect
                </h2>
                <p className="mt-4">
                  We collect personal information from visitors in a number of ways, including when a user makes a donation, signs up for a campaign, registers as a volunteer or intern, or signs up to receive updates. Depending on the nature of your interaction with us, the information we may collect includes:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-650">
                  <li>Your name</li>
                  <li>Your email address and mailing address</li>
                  <li>Your telephone or mobile number</li>
                  <li>Your payment processing details (for donations) or for our Education Program</li>
                  <li>Any other information you voluntarily provide through forms, surveys, or correspondence</li>
                </ul>
                <p className="mt-4">
                  Flarelap Global Foundation does not collect or record personal information unless a visitor chooses to provide it. General browsing of the Website is anonymous: we do not register a visitor's personal information, only non-identifying data such as the time, date, and place of visit and the visitor's internet service provider, which is used solely for statistics and diagnostics.
                </p>
              </section>

              {/* Section 2 */}
              <section id="use-data" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  2. Use of Personal Data
                </h2>
                <p className="mt-4">
                  We use the personal data we collect for the following purposes:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-650">
                  <li>To keep an accurate record of all donations received</li>
                  <li>To communicate with you about our initiatives, programs, events, and updates, including newsletters and bulletins (with the option to unsubscribe at any time)</li>
                  <li>To process and respond to your inquiries, feedback, or requests</li>
                  <li>To manage our volunteer and internship programs</li>
                  <li>To ensure you receive the most appropriate and relevant information based on your interests</li>
                  <li>To conduct research and analysis related to our areas of work, and to learn more about visitors, donors, and campaign participants</li>
                  <li>To collaborate with corporate partners and government bodies on community projects and research, where data is anonymized and aggregated wherever possible</li>
                </ul>
                <p className="mt-4">
                  By signing up for any service offered on the Website, you explicitly authorize us to collect and use information based on your usage, in line with any instructions you specify (such as opting out of newsletters).
                </p>
                <p className="mt-4">
                  Ordinarily, Flarelap Global Foundation does not retain user data beyond what is needed to fulfill the purposes above. Where data is stored as part of a specific sign-up, you may request deletion of your information at any time by writing to us at{" "}
                  <a href="mailto:contact@flarelap.org" className="text-emerald-700 hover:underline font-bold">
                    contact@flarelap.org
                  </a>
                  . We will delete all such information within two working days of your request, subject to any legal record-keeping obligations.
                </p>
              </section>

              {/* Section 3 */}
              <section id="data-sharing" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  3. Data Sharing and Confidentiality
                </h2>
                <p className="mt-4">
                  Flarelap Global Foundation keeps user information strictly confidential and stored securely. All information collected through the Website is handled only by internal or authorized personnel. We do not sell, rent, loan, trade, or lease your personal information, including email addresses, to any third party. We do not share your personal information with external agencies or third-party individuals without your explicit consent, except where required by law.
                </p>
              </section>

              {/* Section 4 */}
              <section id="your-rights" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  4. Your Rights
                </h2>
                <p className="mt-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-650">
                  <li>Access and review the personal data we hold about you</li>
                  <li>Request corrections or updates to your personal data</li>
                  <li>Withdraw your consent to our use of your data</li>
                  <li>Request deletion of your personal data, subject to applicable legal requirements</li>
                  <li>Opt out of receiving communications from us at any time</li>
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, please contact us using the details in Section 7 below.
                </p>
              </section>

              {/* Section 5 */}
              <section id="cookie-policy" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  5. Cookie Policy
                </h2>
                <p className="mt-4">
                  Cookies are small pieces of electronic information sent to your device when you visit our Website, allowing us to recognize you on subsequent visits. You can configure your browser to accept all cookies, reject them all, or notify you when a cookie is sent; check your browser's settings to adjust this behavior. Please note that if you disable, remove, or reject cookies from our Website, some features may not function as intended.
                </p>
              </section>

              {/* Section 6 */}
              <section id="payment-security" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  6. Payment Gateway and Security
                </h2>
                <p className="mt-4">
                  We use well-recognized and proven payment technology. Payment information is transmitted using an SSL connection, offering the highest level of security supported by your browser. Collected payment information is further protected by multiple layers of security, including firewalls, encryption of card details, and password protection.
                </p>
              </section>

              {/* Section 6.1 */}
              <section id="external-services" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  6.1 External Web Services and Third-Party Links
                </h2>
                <p className="mt-4">
                  Our Website may use external services (for example, embedded video players) and may contain links to third-party websites for visitors' convenience. We cannot control, and are not responsible for, the privacy practices or content of such external services or websites. This Privacy Policy does not extend to them, and we encourage you to review their respective privacy policies before sharing any personal information.
                </p>
              </section>

              {/* Section 7 */}
              <section id="changes-policy" className="scroll-mt-24">
                <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-600 pl-3">
                  7. Changes to This Policy and Contact Information
                </h2>
                <p className="mt-4">
                  Flarelap Global Foundation may revise this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. Any updates will be posted on the Website with a revised &quot;Last Updated&quot; date, and, where appropriate, we will provide timely notice of material changes.
                </p>
                <div className="mt-6 rounded-2xl bg-emerald-50/50 border border-emerald-500/10 p-6">
                  <p className="font-extrabold text-slate-900">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at:
                  </p>
                  <p className="mt-3 font-extrabold text-emerald-800">
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
              Your privacy is important to us, and we will always appreciate your cooperation.
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
