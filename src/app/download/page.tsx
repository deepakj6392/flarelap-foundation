import type { Metadata } from "next";
import Link from "next/link";
import Herader from "@/components/common/Herader";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Download App – Flarelap Global Foundation",
  description:
    "Download the Flarelap Exam Preparation app for Android. Study smarter, prepare better, and achieve your goals with our free learning platform.",
};

export default function DownloadPage() {
  const ANDROID_URL =
    "https://play.google.com/store/apps/details?id=com.flarelaporg.exampreparation";

  return (
    <>
      <Herader />

      <main className="flex-1 bg-slate-950 overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[52vh] flex items-center justify-center px-5 py-24 sm:py-32 overflow-hidden">
          {/* Background blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
          >
            <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#5d00e5] opacity-20 blur-[120px]" />
            <div className="absolute -bottom-20 -right-20 h-[420px] w-[420px] rounded-full bg-[#d60086] opacity-20 blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[#ff6427] opacity-10 blur-[90px]" />
          </div>

          {/* Grid overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-[#5d00e5]/40 bg-[#5d00e5]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Official App
            </span>

            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl tracking-tight">
              Download the{" "}
              <span className="text-brand-gradient">Flarelap App</span>
            </h1>
            <p className="mt-6 text-lg font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Prepare smarter for competitive exams with our free learning
              platform. Access mock tests, study materials, and live results —
              anytime, anywhere.
            </p>

            {/* App rating strip */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
                </svg>
                4.8 Rating
              </span>
              <span>•</span>
              <span>Free Download</span>
              <span>•</span>
              <span>10,000+ Students</span>
            </div>
          </div>
        </section>

        {/* Download Cards Section */}
        <section className="px-5 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-2">

              {/* Android Card */}
              <div
                id="android-download"
                className="group relative rounded-3xl border border-slate-800 bg-slate-900/70 p-8 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-emerald-600/60 hover:shadow-2xl hover:shadow-emerald-950/40"
              >
                <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#5d00e5]/10 via-transparent to-transparent" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/15 border border-emerald-600/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available Now
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Android</span>
                  </div>

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#01875f] to-[#00c896] shadow-lg shadow-emerald-900/30">
                    <svg className="h-9 w-9 fill-white" viewBox="0 0 24 24">
                      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4161 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-black text-white mb-2">Android App</h2>
                  <p className="text-sm font-medium text-slate-400 leading-relaxed mb-2">
                    Flarelap Exam Preparation
                  </p>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed mb-8">
                    Practice with curated mock tests, track your progress, and ace your competitive exams. Available free on Google Play.
                  </p>

                  <ul className="mb-8 space-y-2 text-xs font-semibold text-slate-400">
                    {["Mock Test Series", "Live Leaderboards", "Detailed Analytics", "Offline Access"].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5 text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={ANDROID_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="android-download-btn"
                    className="mt-auto group/btn flex items-center justify-center gap-3 w-full rounded-2xl bg-gradient-to-r from-[#01875f] to-[#00c896] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:shadow-emerald-800/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396" />
                    </svg>
                    Download on Google Play
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </a>

                  <p className="mt-3 text-center text-[10px] font-medium text-slate-600">
                    Opens Google Play Store
                  </p>
                </div>
              </div>

              {/* iOS Card */}
              <div
                id="ios-download"
                className="relative rounded-3xl border border-slate-800/60 bg-slate-900/40 p-8 overflow-hidden"
              >
                {/* Coming Soon overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-slate-950/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80 border border-slate-700">
                    <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="rounded-full bg-slate-800/90 border border-slate-700 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Coming Soon
                  </span>
                  <p className="text-xs font-medium text-slate-500 text-center max-w-[180px]">
                    iOS version is under development. Stay tuned!
                  </p>
                </div>

                {/* Background content (muted) */}
                <div className="opacity-30">
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                      Unavailable
                    </span>
                    <span className="text-xs font-semibold text-slate-600">iOS</span>
                  </div>

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-600">
                    <svg className="h-9 w-9 fill-slate-400" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-black text-slate-600 mb-2">iOS App</h2>
                  <p className="text-sm font-medium text-slate-600 mb-8">Coming to App Store</p>
                  <ul className="mb-8 space-y-2 text-xs font-semibold text-slate-700">
                    {["Mock Test Series", "Live Leaderboards", "Detailed Analytics", "Offline Access"].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5 text-slate-700 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-center gap-3 w-full rounded-2xl bg-slate-800 px-6 py-4 text-sm font-bold text-slate-600">
                    <svg className="h-5 w-5 fill-slate-600" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Download on App Store
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code / Info strip */}
            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="shrink-0 flex h-20 w-20 items-center justify-center rounded-xl bg-white p-2 shadow-md">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    <rect x="0" y="0" width="40" height="40" fill="black" rx="4" />
                    <rect x="5" y="5" width="30" height="30" fill="white" rx="2" />
                    <rect x="10" y="10" width="20" height="20" fill="black" rx="1" />
                    <rect x="60" y="0" width="40" height="40" fill="black" rx="4" />
                    <rect x="65" y="5" width="30" height="30" fill="white" rx="2" />
                    <rect x="70" y="10" width="20" height="20" fill="black" rx="1" />
                    <rect x="0" y="60" width="40" height="40" fill="black" rx="4" />
                    <rect x="5" y="65" width="30" height="30" fill="white" rx="2" />
                    <rect x="10" y="70" width="20" height="20" fill="black" rx="1" />
                    <rect x="50" y="50" width="8" height="8" fill="black" rx="1" />
                    <rect x="62" y="50" width="8" height="8" fill="black" rx="1" />
                    <rect x="74" y="50" width="8" height="8" fill="black" rx="1" />
                    <rect x="86" y="50" width="8" height="8" fill="black" rx="1" />
                    <rect x="50" y="62" width="8" height="8" fill="black" rx="1" />
                    <rect x="74" y="62" width="8" height="8" fill="black" rx="1" />
                    <rect x="50" y="74" width="8" height="8" fill="black" rx="1" />
                    <rect x="62" y="74" width="8" height="8" fill="black" rx="1" />
                    <rect x="74" y="74" width="8" height="8" fill="black" rx="1" />
                    <rect x="86" y="62" width="8" height="8" fill="black" rx="1" />
                    <rect x="86" y="74" width="8" height="8" fill="black" rx="1" />
                    <rect x="62" y="86" width="8" height="8" fill="black" rx="1" />
                    <rect x="86" y="86" width="8" height="8" fill="black" rx="1" />
                  </svg>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm font-bold text-white mb-1">Scan to Download</p>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed">
                    Point your Android camera at this QR code or search{" "}
                    <span className="text-violet-400 font-semibold">&quot;Flarelap Exam Preparation&quot;</span>{" "}
                    on Google Play Store.
                  </p>
                </div>

                <a
                  href={ANDROID_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="android-play-badge"
                  className="shrink-0 flex items-center gap-2 rounded-xl border border-emerald-600/40 bg-emerald-600/10 px-5 py-3 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-600/20 hover:border-emerald-500/60"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396" />
                  </svg>
                  Open Google Play
                </a>
              </div>
            </div>

            {/* Back to home link */}
            <div className="mt-10 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-violet-400 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
