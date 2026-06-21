import Image from "next/image";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { sampleImages } from "@/constants/images";

const programs = [
	{
		title: "Learning & Scholarships",
		excerpt:
			"After-school learning, scholarships, and mentorship that help children stay in school.",
		image: "/uploads/about/education.png",
	},
	{
		title: "Health Camps",
		excerpt: "Local health camps offering screenings, hygiene supplies, and education.",
		image: "/uploads/about/health.png",
	},
	{
		title: "Skills & Livelihood",
		excerpt: "Short trainings and micro-grants that jumpstart small businesses.",
		image: "/uploads/about/livelihood.png",
	},
	{
		title: "Emergency Relief",
		excerpt: "Rapid response and community relief during urgent seasons and crises.",
		image: "/uploads/about/relief.png",
	},
];

export default function ProgramsPage() {
	return (
		<div className="min-h-screen bg-white text-slate-950">
			<Herader />
			<main>
				<section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
							Programs
						</p>
						<h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">
							Practical programs, designed with communities.
						</h1>

						<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{programs.map((p) => (
								<article key={p.title} className="rounded-lg bg-slate-50 shadow-sm">
									<div className="relative h-44 w-full overflow-hidden rounded-t-lg">
										<Image src={p.image} alt={p.title} fill className="object-cover" />
									</div>
									<div className="p-4">
										<h3 className="font-semibold text-slate-900">{p.title}</h3>
										<p className="mt-2 text-sm text-slate-700">{p.excerpt}</p>
										<a href="#contact" className="mt-4 inline-block text-sm font-bold text-emerald-700">
											Learn more →
										</a>
									</div>
								</article>
							))}
						</div>

									<div className="mt-12">
										<h2 className="text-2xl font-bold text-slate-950">Case studies</h2>
										<div className="mt-6 grid gap-6 sm:grid-cols-2">
											<article className="rounded-lg bg-white p-6 shadow-sm">
												<h3 className="font-semibold text-slate-900">Village learning center — uplift in attendance</h3>
												<p className="mt-2 text-sm text-slate-700">After setting up a community learning center with local tutors, school attendance rose by 27% in six months.</p>
												<div className="mt-4 relative h-44 w-full overflow-hidden rounded-md group">
													<Image src="/uploads/about/education.png" alt="case study" fill className="object-cover transition duration-300 group-hover:scale-105" />
												</div>
											</article>

											<article className="rounded-lg bg-white p-6 shadow-sm">
												<h3 className="font-semibold text-slate-900">Health camp outcomes</h3>
												<p className="mt-2 text-sm text-slate-700">Local health camps led to early detection of chronic conditions and distribution of hygiene kits to 420 families.</p>
												<div className="mt-4 relative h-44 w-full overflow-hidden rounded-md group">
													<Image src="/uploads/about/health.png" alt="health camp" fill className="object-cover transition duration-300 group-hover:scale-105" />
												</div>
											</article>
										</div>
									</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
