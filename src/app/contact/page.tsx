"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/common/Footer";
import Herader from "@/components/common/Herader";
import { sampleImages } from "@/constants/images";
import { siteConfig } from "@/constants/site";
import { Loader2 } from "lucide-react";

export default function ContactPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [statusMessage, setStatusMessage] = useState("");

	const [contactInfo, setContactInfo] = useState({
		email: siteConfig.email,
		phone: siteConfig.phone,
		address: siteConfig.address,
	});

	useEffect(() => {
		async function fetchSettings() {
			try {
				const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
				const res = await fetch(`${apiUrl}/api/site-settings`);
				const data = await res.json();
				if (res.ok && data.setting) {
					setContactInfo({
						email: data.setting.email || siteConfig.email,
						phone: data.setting.phone || siteConfig.phone,
						address: data.setting.address || siteConfig.address,
					});
				}
			} catch (err) {
				console.error("Error loading contact details:", err);
			}
		}
		fetchSettings();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !email || !message) {
			setStatus("error");
			setStatusMessage("Please fill in all required fields.");
			return;
		}

		setStatus("loading");
		setStatusMessage("");

		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
			const res = await fetch(`${apiUrl}/api/foundation/contacts`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, message, post: "Foundation Inquiry" }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to send message.");

			setStatus("success");
			setName("");
			setEmail("");
			setMessage("");
			setStatusMessage("Your message has been sent successfully. We will get back to you soon!");
		} catch (err: any) {
			setStatus("error");
			setStatusMessage(err.message || "Failed to send message. Please try again later.");
		}
	};

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
									<form onSubmit={handleSubmit} className="grid gap-3">
										<input
											required
											value={name}
											onChange={(e) => setName(e.target.value)}
											aria-label="Name"
											placeholder="Full name"
											className="rounded-md border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
											disabled={status === "loading"}
										/>
										<input
											required
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											aria-label="Email"
											placeholder="Email address"
											className="rounded-md border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
											disabled={status === "loading"}
										/>
										<textarea
											required
											value={message}
											onChange={(e) => setMessage(e.target.value)}
											aria-label="Message"
											placeholder="How can we help?"
											rows={5}
											className="rounded-md border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
											disabled={status === "loading"}
										/>
										<button
											type="submit"
											disabled={status === "loading"}
											className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 transition disabled:opacity-50 gap-1.5"
										>
											{status === "loading" ? (
												<>
													<Loader2 className="h-4 w-4 animate-spin" />
													Sending...
												</>
											) : (
												"Send message"
											)}
										</button>

										{statusMessage && (
											<p className={`mt-2 text-sm font-semibold ${status === "success" ? "text-emerald-700" : "text-red-600"}`}>
												{statusMessage}
											</p>
										)}
									</form>
								</div>
							</div>

							<div className="relative">
								<div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-100 shadow-lg relative">
									<Image src={sampleImages.contact} alt="People talking" fill className="object-cover" />
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
								<p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{contactInfo.address}</p>
								<p className="mt-2 text-sm text-slate-700">
									Email:{" "}
									<a href={`mailto:${contactInfo.email}`} className="text-emerald-700 hover:underline font-bold">
										{contactInfo.email}
									</a>
								</p>
								<p className="mt-2 text-sm text-slate-700">
									Phone:{" "}
									<a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="text-emerald-700 hover:underline font-bold">
										{contactInfo.phone}
									</a>
								</p>
							</div>

							<div className="rounded-lg bg-white p-6 shadow-sm">
								<h3 className="font-semibold">Field offices</h3>
								<p className="mt-2 text-sm text-slate-700">Rural outreach hubs in three districts. We work through local partners — contact us for specifics.</p>
								<a className="mt-4 inline-block text-sm font-bold text-emerald-700 cursor-pointer">Request field contact →</a>
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
