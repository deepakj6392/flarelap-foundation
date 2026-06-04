import Image from "next/image";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { sampleImages } from "@/constants/images";

const products = [
	{
		id: "kit-edu",
		title: "Community Learning Kit",
		price: "₹499",
		img: sampleImages.education,
		desc: "Low-cost kit with learning materials and guidance for local tutors.",
	},
	{
		id: "kit-health",
		title: "Health Outreach Pack",
		price: "₹699",
		img: sampleImages.health,
		desc: "Basic supplies and awareness materials for village health camps.",
	},
	{
		id: "kit-skills",
		title: "Skills Starter Kit",
		price: "₹599",
		img: sampleImages.products,
		desc: "Tools and curriculum for short vocational trainings.",
	},
];

export default function ProductsPage() {
	return (
		<div className="min-h-screen bg-white text-slate-950">
			<Herader />
			<main>
				<section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Products</p>
						<h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">Support our work — practical kits</h1>

						<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{products.map((p) => (
								<article key={p.id} className="rounded-lg border border-slate-100 bg-white shadow-sm">
									<div className="relative h-44 w-full overflow-hidden rounded-t-lg">
										<Image src={p.img} alt={p.title} fill className="object-cover" />
									</div>
									<div className="p-4">
										<h3 className="font-semibold text-slate-900">{p.title}</h3>
										<p className="mt-2 text-sm text-slate-700">{p.desc}</p>
										<div className="mt-4 flex items-center justify-between">
											<p className="text-lg font-bold text-slate-900">{p.price}</p>
											<button className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800">Buy</button>
										</div>
									</div>
								</article>
							))}
						</div>

										<div className="mt-12">
											<h2 className="text-2xl font-bold text-slate-950">Impact of these kits</h2>
											<p className="mt-3 text-sm text-slate-700">Each kit is designed to start a small program locally — tutors can run units from the learning kit and health volunteers can distribute outreach packs.</p>

											<div className="mt-6 grid gap-6 sm:grid-cols-2">
												<div className="rounded-lg bg-slate-50 p-6">
													<h3 className="font-semibold">Community Learning Kit — beneficiary story</h3>
													<p className="mt-2 text-sm text-slate-700">A small village used three kits to run evening classes; two students went on to get scholarships.</p>
												</div>

												<div className="rounded-lg bg-slate-50 p-6">
													<h3 className="font-semibold">Health Outreach Pack — on the ground</h3>
													<p className="mt-2 text-sm text-slate-700">Health volunteers used the packs in a camp that reached 420 people with screenings and hygiene kits.</p>
												</div>
											</div>
										</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
