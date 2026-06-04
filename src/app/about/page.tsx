import Image from "next/image";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { sampleImages } from "@/constants/images";
import { siteConfig } from "@/constants/site";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-white text-slate-950">
			<Herader />
			<main>
				<section className="relative overflow-hidden bg-white">
					<div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
						<div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
							<div>
								<p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
									About {siteConfig.name}
								</p>
								<h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
									Mission-driven, community-first work.
								</h1>
								<p className="mt-6 text-lg leading-8 text-slate-700">
									{siteConfig.name} helps communities access essential services,
									practical skills, and responsive relief — with humility,
									transparency, and local partnerships.
								</p>
								<div className="mt-8 flex gap-3">
									<a
										href="#programs"
										className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800"
									>
										View programs
									</a>
									<a
										href="#contact"
										className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-sm hover:border-emerald-600 hover:text-emerald-800"
									>
										Contact us
									</a>
								</div>
							</div>

							<div className="relative">
												<div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-100 shadow-lg">
																		<Image
																			src={sampleImages.community}
																			alt="Community working together"
																			fill
																			className="object-cover"
																			sizes="(max-width: 768px) 100vw, 50vw"
																		/>
												</div>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-slate-50 px-5 py-16 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<h2 className="text-2xl font-bold text-slate-950">Our approach</h2>
						<div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<div className="rounded-lg bg-white p-6 shadow-sm">
								<h3 className="font-semibold text-slate-900">Local partners</h3>
								<p className="mt-3 text-sm text-slate-700">
									We work through trusted local groups so programs are relevant
									and long-lasting.
								</p>
							</div>
							<div className="rounded-lg bg-white p-6 shadow-sm">
								<h3 className="font-semibold text-slate-900">Data-driven</h3>
								<p className="mt-3 text-sm text-slate-700">
									Decisions are informed by community feedback and simple
									measurable indicators.
								</p>
							</div>
							<div className="rounded-lg bg-white p-6 shadow-sm">
								<h3 className="font-semibold text-slate-900">Capacity building</h3>
								<p className="mt-3 text-sm text-slate-700">
									We help people build skills that lead to sustained economic
									opportunity.
								</p>
							</div>
						</div>
					</div>
				</section>

							<section className="bg-white px-5 py-16 sm:px-6 lg:px-8">
								<div className="mx-auto max-w-7xl">
									<h2 className="text-2xl font-bold text-slate-950">Programs we run</h2>
									<p className="mt-3 text-sm text-slate-700">Practical, local programs in education, health, livelihoods and relief.</p>

									<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
										<div className="rounded-lg bg-slate-50 p-4 text-center">
											<div className="relative mb-3 h-40 w-full overflow-hidden rounded-md">
												<Image src={sampleImages.education} alt="education" fill className="object-cover" />
											</div>
											<h3 className="font-semibold">Education Access</h3>
											<p className="mt-2 text-sm text-slate-700">After-school support, digital literacy and scholarships.</p>
										</div>

										<div className="rounded-lg bg-slate-50 p-4 text-center">
											<div className="relative mb-3 h-40 w-full overflow-hidden rounded-md">
												<Image src={sampleImages.health} alt="health" fill className="object-cover" />
											</div>
											<h3 className="font-semibold">Health & Wellness</h3>
											<p className="mt-2 text-sm text-slate-700">Health camps, preventive care and hygiene awareness.</p>
										</div>

										<div className="rounded-lg bg-slate-50 p-4 text-center">
											<div className="relative mb-3 h-40 w-full overflow-hidden rounded-md">
												<Image src={sampleImages.livelihood} alt="livelihood" fill className="object-cover" />
											</div>
											<h3 className="font-semibold">Livelihood Support</h3>
											<p className="mt-2 text-sm text-slate-700">Skills training, micro-grants and small business guidance.</p>
										</div>

										<div className="rounded-lg bg-slate-50 p-4 text-center">
											<div className="relative mb-3 h-40 w-full overflow-hidden rounded-md">
												<Image src={sampleImages.relief} alt="relief" fill className="object-cover" />
											</div>
											<h3 className="font-semibold">Community Relief</h3>
											<p className="mt-2 text-sm text-slate-700">Rapid response and seasonal relief for vulnerable families.</p>
										</div>
									</div>
								</div>
							</section>

							<section className="bg-slate-50 px-5 py-16 sm:px-6 lg:px-8">
								<div className="mx-auto max-w-7xl">
									<h2 className="text-2xl font-bold text-slate-950">Leadership</h2>
									<p className="mt-3 text-sm text-slate-700">A small team with local experience and practical skills.</p>

									<div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
										<div className="rounded-lg bg-white p-6 text-center shadow-sm">
											<div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full">
												<Image src={sampleImages.community} alt="leader" width={96} height={96} className="object-cover" />
											</div>
											<p className="font-semibold">Dr. Meera Rao</p>
											<p className="mt-1 text-xs text-slate-600">Programs Director</p>
										</div>

										<div className="rounded-lg bg-white p-6 text-center shadow-sm">
											<div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full">
												<Image src={sampleImages.livelihood} alt="leader" width={96} height={96} className="object-cover" />
											</div>
											<p className="font-semibold">Arjun Patel</p>
											<p className="mt-1 text-xs text-slate-600">Operations Lead</p>
										</div>

										<div className="rounded-lg bg-white p-6 text-center shadow-sm">
											<div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full">
												<Image src={sampleImages.health} alt="leader" width={96} height={96} className="object-cover" />
											</div>
											<p className="font-semibold">Sara Fernando</p>
											<p className="mt-1 text-xs text-slate-600">Community Outreach</p>
										</div>

										<div className="rounded-lg bg-white p-6 text-center shadow-sm">
											<div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full">
												<Image src={sampleImages.education} alt="leader" width={96} height={96} className="object-cover" />
											</div>
											<p className="font-semibold">Volunteer Team</p>
											<p className="mt-1 text-xs text-slate-600">Network of volunteers</p>
										</div>
									</div>
								</div>
							</section>
			</main>
			<Footer />
		</div>
	);
}
