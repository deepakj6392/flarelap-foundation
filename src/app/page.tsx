import Image from "next/image";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { galleryImages, sampleImages } from "@/constants/images";

const focusAreas = [
  {
    title: "Education Access",
    description:
      "Learning support, digital literacy, mentorship, and supplies for children and youth who need steady encouragement.",
  },
  {
    title: "Health and Wellness",
    description:
      "Awareness drives, preventive care camps, hygiene initiatives, and local health partnerships for stronger families.",
  },
  {
    title: "Livelihood Support",
    description:
      "Skill-building, self-employment guidance, and practical resources that help people move toward financial independence.",
  },
  {
    title: "Community Relief",
    description:
      "Rapid support for vulnerable families during urgent needs, seasonal hardships, and local crisis situations.",
  },
];

const metrics = [
  { value: "4", label: "Core program areas" },
  { value: "100%", label: "Community-first approach" },
  { value: "24/7", label: "Volunteer spirit" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Herader />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(120deg,#f8fafc_0%,#eefdf4_52%,#fff7ed_100%)]">
          <div className="mx-auto grid min-h-[calc(100svh-80px)] w-full max-w-7xl items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-18">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Registered social impact foundation
              </div>
              <h1 className="mt-7 text-4xl font-black leading-[1.05] text-slate-950 sm:text-6xl lg:text-7xl">
                Flarelap Global Foundation
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
                Empowering people and changing lives through practical programs
                in education, health, livelihood, and community welfare.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#programs"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  Explore programs
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:border-emerald-600 hover:text-emerald-800"
                >
                  Partner with us
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[2rem] border border-white bg-white p-6 shadow-2xl shadow-emerald-900/10">
                <div className="flex h-full flex-col items-center justify-center rounded-[1.5rem] bg-slate-50 p-8 text-center">
                  <Image
                    src="/logo.png"
                    alt="Flarelap Global Foundation emblem"
                    width={744}
                    height={744}
                    className="h-auto w-full max-w-[320px] object-contain"
                    priority
                  />
                  <div className="mt-6 grid w-full grid-cols-2 items-center gap-4 border-t border-slate-200 pt-6">
                    <Image
                      src="/msme_logo.png"
                      alt="MSME registered logo"
                      width={230}
                      height={105}
                      className="mx-auto h-12 w-auto object-contain"
                    />
                    <Image
                      src="/iso_logo.png"
                      alt="ISO certification logo"
                      width={225}
                      height={225}
                      className="mx-auto h-14 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-white px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                About Us
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Built for steady, local, human impact.
              </h2>
            </div>
            <div className="text-base leading-8 text-slate-700 sm:text-lg">
              <p>
                Flarelap Global Foundation works with a simple belief: lasting
                change starts when people get timely support, practical
                opportunities, and a community that stands beside them.
              </p>
              <p className="mt-5">
                Our home page brings together the foundation&apos;s public identity,
                program focus, and contact paths so volunteers, donors, and
                community partners can understand where to begin.
              </p>
            </div>
          </div>
        </section>

        <section id="programs" className="bg-slate-50 px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                Programs
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Focus areas that meet real needs.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {focusAreas.map((area) => (
                <article
                  key={area.title}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-950">{area.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {area.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="bg-white px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Gallery</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Moments from our work</h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((src, idx) => (
                <div key={idx} className="relative h-56 w-full overflow-hidden rounded-lg border border-slate-100 shadow-sm">
                  <Image src={src} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="bg-white px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                Impact Model
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Transparent work, trusted partners, measurable care.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-6"
                >
                  <p className="text-3xl font-black text-emerald-700">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="partners" className="bg-slate-50 px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Partners</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Trusted local partners</h2>

            <div className="mt-8 grid grid-cols-3 items-center gap-6 sm:grid-cols-6 lg:grid-cols-6">
              <div className="flex items-center justify-center p-4">
                <Image src="/flarelap_seal.png" alt="Flarelap seal" width={96} height={96} className="object-contain" />
              </div>
              <div className="flex items-center justify-center p-4">
                <Image src="/msme_logo.png" alt="MSME" width={120} height={48} className="object-contain" />
              </div>
              <div className="flex items-center justify-center p-4">
                <Image src="/iso_logo.png" alt="ISO" width={120} height={60} className="object-contain" />
              </div>
              <div className="flex items-center justify-center p-4">
                <Image src="/logo.png" alt="Flarelap" width={120} height={48} className="object-contain" />
              </div>
              <div className="flex items-center justify-center p-4">
                <Image src="/vercel.svg" alt="Vercel" width={120} height={36} className="object-contain" />
              </div>
              <div className="flex items-center justify-center p-4">
                <Image src="/next.svg" alt="Next.js" width={120} height={36} className="object-contain" />
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-white px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Stories</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Voices from the field</h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <blockquote className="rounded-lg border border-slate-100 bg-slate-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                    <Image src={sampleImages.community} alt="Volunteer" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Asha Kumari</p>
                    <p className="text-xs text-slate-600">Community volunteer</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-700">“Working with Flarelap helped our village open a learning center — families have hope again.”</p>
              </blockquote>

              <blockquote className="rounded-lg border border-slate-100 bg-slate-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                    <Image src={sampleImages.livelihood} alt="Volunteer" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Rahul Sharma</p>
                    <p className="text-xs text-slate-600">Program partner</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-700">“Their practical training modules made it possible to teach marketable skills locally.”</p>
              </blockquote>

              <blockquote className="rounded-lg border border-slate-100 bg-slate-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                    <Image src={sampleImages.health} alt="Volunteer" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Lina Costa</p>
                    <p className="text-xs text-slate-600">Donor & supporter</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-700">“I see the difference my support makes — the reports are clear and honest.”</p>
              </blockquote>
            </div>
          </div>
        </section>

        <section id="news" className="bg-slate-50 px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">News</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Latest updates</h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">Volunteer day recap</h3>
                <p className="mt-2 text-sm text-slate-700">A look back at our recent community volunteer day and progress made.</p>
                <a href="/blogs" className="mt-4 inline-block text-sm font-bold text-emerald-700">Read →</a>
              </article>

              <article className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">New skills cohort</h3>
                <p className="mt-2 text-sm text-slate-700">We launched a new skills training cohort in three communities.</p>
                <a href="/blogs" className="mt-4 inline-block text-sm font-bold text-emerald-700">Read →</a>
              </article>

              <article className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">Health camp outcomes</h3>
                <p className="mt-2 text-sm text-slate-700">Early results from our last health outreach initiative.</p>
                <a href="/blogs" className="mt-4 inline-block text-sm font-bold text-emerald-700">Read →</a>
              </article>
            </div>
          </div>
        </section>

        <section id="newsletter" className="bg-white px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-8 text-center">
              <h3 className="text-2xl font-bold text-slate-950">Stay connected</h3>
              <p className="mt-3 text-sm text-slate-700">Subscribe for short updates and practical ways to help.</p>

              <form className="mt-6 mx-auto max-w-xl">
                <div className="flex items-center gap-2">
                  <input aria-label="Email" type="email" placeholder="Your email address" className="flex-1 rounded-md border border-slate-200 px-4 py-3" />
                  <button className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">Subscribe</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
