import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/constants/site";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/flarelap_seal.png"
              alt="Flarelap Global Foundation seal"
              width={64}
              height={61}
              className="h-14 w-14 object-contain"
            />
            <div>
              <p className="text-lg font-bold">{siteConfig.name}</p>
              <p className="text-sm text-emerald-200">{siteConfig.description}</p>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
            We partner with communities, volunteers, and institutions to create
            practical programs in education, health, livelihood, and social
            welfare.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">
            Quick Links
          </h2>
          <div className="mt-4 grid gap-3">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">
            Contact
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>{siteConfig.location}</p>
            <p>{siteConfig.email}</p>
            <p>{siteConfig.phone}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-slate-400 text-xs">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p>(c) {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <Link href="/admin/login" className="font-semibold text-slate-400 transition hover:text-emerald-400">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
