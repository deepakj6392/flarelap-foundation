import Image from "next/image";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";

export default function ContactPage() {
	return (
		<div className="min-h-screen bg-white text-slate-950">
			<Herader />
			<main>
				<section className="relative overflow-hidden bg-white">
					<div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
						<div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
							<div>
								<p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Get in touch</p>
								<h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">Connect with us</h1>
								<p className="mt-6 text-lg leading-8 text-slate-700">Whether you want to volunteer, partner, or learn more — send a note and we will reply.</p>

								<div className="mt-8 max-w-xl">
									<form className="grid gap-3">
										<input aria-label="Name" placeholder="Full name" className="rounded-md border border-slate-200 px-4 py-3" />
										<input aria-label="Email" placeholder="Email address" className="rounded-md border border-slate-200 px-4 py-3" />
										<textarea aria-label="Message" placeholder="How can we help?" rows={5} className="rounded-md border border-slate-200 px-4 py-3" />
										<button className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800">Send message</button>
									</form>
								</div>
							</div>

							<div className="relative">
								<div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-100 shadow-lg">
									<Image src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop" alt="People talking" fill className="object-cover" />
								</div>
							</div>
						</div>
					</div>
				</section>
							<section className="bg-slate-50 px-5 py-16 sm:px-6 lg:px-8">
								<div className="mx-auto max-w-7xl">
									<h2 className="text-2xl font-bold text-slate-950">Contact information</h2>
									<div className="mt-6 grid gap-6 sm:grid-cols-2">
										<div className="rounded-lg bg-white p-6 shadow-sm">
											<h3 className="font-semibold">Head office</h3>
											<p className="mt-2 text-sm text-slate-700">123 Community Lane, City, State, India</p>
											<p className="mt-2 text-sm text-slate-700">Email: hello@flarelap.org</p>
											<p className="mt-2 text-sm text-slate-700">Phone: +91 98765 43210</p>
										</div>

										<div className="rounded-lg bg-white p-6 shadow-sm">
											<h3 className="font-semibold">Field offices</h3>
											<p className="mt-2 text-sm text-slate-700">Rural outreach hubs in three districts. We work through local partners — contact us for specifics.</p>
											<a className="mt-4 inline-block text-sm font-bold text-emerald-700">Request field contact →</a>
										</div>
									</div>

									<div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
										<h3 className="font-semibold">FAQ</h3>
										<div className="mt-3 space-y-3 text-sm text-slate-700">
											<p><strong>How can I volunteer?</strong> Sign up via the contact form and let us know your skills and availability.</p>
											<p><strong>How are funds used?</strong> Funds support local program delivery, materials, and small grants; we publish summaries in our impact reports.</p>
										</div>
									</div>
								</div>
							</section>
			</main>
			<Footer />
		</div>
	);
}

