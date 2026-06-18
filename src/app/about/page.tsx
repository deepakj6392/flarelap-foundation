import Image from "next/image";
import { connection } from "next/server";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { sampleImages } from "@/constants/images";
import { siteConfig } from "@/constants/site";
import { prisma } from "@/lib/prisma";

// SVG Icons for social links
const FacebookIcon = ({ className }: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
	</svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
	</svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
		<path d="M9 18c-4.51 2-5-2-7-2"></path>
	</svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
		<rect x="2" y="9" width="4" height="12"></rect>
		<circle cx="4" cy="4" r="2"></circle>
	</svg>
);

export default async function AboutPage() {
	await connection();

	const teamMembers = await prisma.teamMember.findMany({
		orderBy: [
			{ order: "asc" },
			{ createdAt: "asc" }
		]
	});

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
									practical skills, and responsive relief - with humility,
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

							<section className="bg-gradient-to-b from-slate-50 to-white px-5 py-24 sm:px-6 lg:px-8 border-t border-slate-100">
								<div className="mx-auto max-w-7xl">
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 text-center mb-3">
										Meet Our Visionaries
									</p>
									<h2 className="text-3xl sm:text-4xl font-black text-slate-900 text-center tracking-tight">
										Core Leadership
									</h2>
									<div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-emerald-600"></div>
									<p className="mt-4 text-slate-600 text-center max-w-xl mx-auto text-sm sm:text-base">
										Dedicated individuals working together to direct programs, build key partnerships, and empower local communities.
									</p>

									<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-16">
										{teamMembers.map((member) => {
											// Select dynamic fallback description based on role
											let fallbackDesc = "Committed to fostering positive change and empowering communities through education and support.";
											const roleLower = member.role.toLowerCase();
											if (roleLower.includes("founder")) {
												fallbackDesc = "Leading the vision and driving sustainable development initiatives to create lasting positive impact.";
											} else if (roleLower.includes("m.d.") || roleLower.includes("managing")) {
												fallbackDesc = "Directing overall operations, managing partnerships, and ensuring strategic execution of foundation goals.";
											} else if (roleLower.includes("executive")) {
												fallbackDesc = "Overseeing project deployment, volunteer networks, and community development programs.";
											} else if (roleLower.includes("operational") || roleLower.includes("operations")) {
												fallbackDesc = "Managing daily logistics, program execution, and administrative excellence across regions.";
											}

											return (
												<div key={member.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
													{/* Card Decorative Banner */}
													<div className="h-20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 relative overflow-hidden">
														<div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full translate-x-8 -translate-y-8"></div>
													</div>

													{/* Card Body content */}
													<div className="px-6 pb-8 flex flex-col items-center -mt-12 relative z-10 flex-grow">
														{/* Premium Avatar Frame with Ring */}
														<div className="relative h-24 w-24 rounded-full p-1 bg-white shadow-md group-hover:scale-105 transition-transform duration-300">
															<div className="w-full h-full rounded-full overflow-hidden border border-slate-100 bg-white relative">
																<Image 
																	src={member.imageUrl} 
																	alt={member.name} 
																	fill 
																	className="object-cover" 
																	sizes="88px"
																/>
															</div>
														</div>

														{/* Member Info */}
														<h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors duration-300 mt-4">
															{member.name}
														</h3>
														<p className="mt-2 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/40 inline-block">
															{member.role}
														</p>
														
														<p className="mt-4 text-xs leading-relaxed text-slate-500 max-w-[220px] flex-grow">
															{member.description || fallbackDesc}
														</p>

														{/* Divider & Social Links */}
														<div className="w-full border-t border-slate-100 mt-6 pt-5 flex justify-center gap-3">
															<a 
																href={member.facebook || "https://facebook.com"} 
																target="_blank" 
																rel="noreferrer" 
																className="w-8 h-8 rounded-full bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 hover:scale-105"
																title="Facebook"
															>
																<FacebookIcon className="h-3.5 w-3.5" />
															</a>
															<a 
																href={member.twitter || "https://twitter.com"} 
																target="_blank" 
																rel="noreferrer" 
																className="w-8 h-8 rounded-full bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 hover:scale-105"
																title="Twitter"
															>
																<TwitterIcon className="h-3.5 w-3.5" />
															</a>
															<a 
																href={member.behance || "https://linkedin.com"} 
																target="_blank" 
																rel="noreferrer" 
																className="w-8 h-8 rounded-full bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 hover:scale-105"
																title="LinkedIn"
															>
																<LinkedinIcon className="h-3.5 w-3.5" />
															</a>
															<a 
																href={member.github || "https://github.com"} 
																target="_blank" 
																rel="noreferrer" 
																className="w-8 h-8 rounded-full bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 hover:scale-105"
																title="Github"
															>
																<GithubIcon className="h-3.5 w-3.5" />
															</a>
														</div>
													</div>
												</div>
											);
										})}
										
										{teamMembers.length === 0 && (
											<div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
												No leadership members added yet.
											</div>
										)}
									</div>
								</div>
							</section>
			</main>
			<Footer />
		</div>
	);
}


