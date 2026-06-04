import Image from "next/image";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { sampleImages } from "@/constants/images";

const posts = [
	{
		title: "How local mentors change trajectories",
	excerpt: "Stories from the field about mentorship, small wins, and how consistent guidance helps children stay in school and find purpose.",
		img: sampleImages.education,
	},
	{
		title: "Simple metrics that matter",
	excerpt: "How we designed a short set of indicators that track program health without burdening local partners — and what we learned.",
		img: sampleImages.blog,
	},
	{
		title: "Volunteer day — building a community library",
	excerpt: "A recap of a recent community day: building a small library, engaging youth volunteers, and practical lessons for scaling.",
		img: sampleImages.community,
	},
];

export default function BlogsPage() {
	return (
		<div className="min-h-screen bg-white text-slate-950">
			<Herader />
			<main>
				<section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Blog</p>
						<h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">Stories & updates</h1>

									<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{posts.map((p) => (
								<article key={p.title} className="rounded-lg border border-slate-100 bg-white shadow-sm">
									<div className="relative h-44 w-full overflow-hidden rounded-t-lg">
										<Image src={p.img} alt={p.title} fill className="object-cover" />
									</div>
									<div className="p-4">
										<h3 className="font-semibold text-slate-900">{p.title}</h3>
													<p className="mt-2 text-sm text-slate-700">{p.excerpt}</p>
										<a className="mt-4 inline-block text-sm font-bold text-emerald-700">Read →</a>
									</div>
								</article>
							))}
						</div>

									<div className="mt-12 rounded-lg border border-slate-100 bg-slate-50 p-6">
										<h2 className="text-xl font-bold">Featured story</h2>
										<p className="mt-3 text-sm text-slate-700">How a small reading corner became a catalyst for local youth engagement — our detailed writeup.</p>
										<div className="mt-4 relative h-56 w-full overflow-hidden rounded-md">
											<Image src={sampleImages.blog} alt="featured" fill className="object-cover" />
										</div>
									</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
