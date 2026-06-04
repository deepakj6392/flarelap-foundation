import Image from "next/image";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { sampleImages } from "@/constants/images";

const impactStats = [
	{ value: "12k+", label: "People reached" },
	{ value: "350+", label: "Volunteer hours / month" },
	{ value: "48", label: "Community partners" },
];

export default function ImpactPage() {
	return (
		<div className="min-h-screen bg-white text-slate-950">
			<Herader />
			<main>
				<section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Impact</p>
						<h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">Measured care, local change</h1>

						<div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
							<div>
								<p className="text-base leading-8 text-slate-700">
									We measure what matters: participation, service quality, and
									sustained benefits. We publish high-level summaries so partners
									and donors can see how resources translate to outcomes.
								</p>

								<div className="mt-8 grid gap-4 sm:grid-cols-3">
									{impactStats.map((s) => (
										<div key={s.label} className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
											<p className="text-2xl font-black text-emerald-700">{s.value}</p>
											<p className="mt-2 text-sm font-semibold text-slate-700">{s.label}</p>
										</div>
									))}
								</div>
							</div>

							<div className="relative">
												<div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-100 shadow-lg">
													  <Image src={sampleImages.community} alt="Impact work" fill className="object-cover" />
												</div>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-slate-50 px-5 py-16 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<h2 className="text-2xl font-bold text-slate-950">Recent reports</h2>
						<div className="mt-6 grid gap-6 sm:grid-cols-2">
							<article className="rounded-lg bg-white p-6 shadow-sm">
								<h3 className="font-semibold text-slate-900">2025 Annual Summary</h3>
								<p className="mt-2 text-sm text-slate-700">Highlights from our last year of work and local outcomes.</p>
								<a className="mt-4 inline-block text-sm font-bold text-emerald-700">Download PDF →</a>
							</article>
							<article className="rounded-lg bg-white p-6 shadow-sm">
								<h3 className="font-semibold text-slate-900">Community Feedback Digest</h3>
								<p className="mt-2 text-sm text-slate-700">A short summary of beneficiary feedback and program refinements.</p>
								<a className="mt-4 inline-block text-sm font-bold text-emerald-700">Read →</a>
							</article>
						</div>
					</div>
				</section>

							<section className="bg-white px-5 py-16 sm:px-6 lg:px-8">
								<div className="mx-auto max-w-7xl">
									<h2 className="text-2xl font-bold text-slate-950">Program outcomes</h2>
									<div className="mt-6 grid gap-6 sm:grid-cols-2">
										<div className="rounded-lg bg-slate-50 p-6">
											<h3 className="font-semibold">Education</h3>
											<p className="mt-2 text-sm text-slate-700">24% improvement in literacy scores among program participants after 9 months of tutoring and materials support.</p>
										</div>

										<div className="rounded-lg bg-slate-50 p-6">
											<h3 className="font-semibold">Health</h3>
											<p className="mt-2 text-sm text-slate-700">Early screenings identified chronic conditions and promoted timely referrals in collaborating clinics.</p>
										</div>
									</div>

												<div className="mt-8 relative h-56 w-full overflow-hidden rounded-md">
													<Image src={sampleImages.blog} alt="timeline" fill className="object-cover" />
												</div>
								</div>
							</section>
			</main>
			<Footer />
		</div>
	);
}
