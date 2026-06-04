import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/constants/site";

export default function Herader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt={`${siteConfig.name} logo`}
            width={56}
            height={56}
            className="h-12 w-12 rounded-full object-contain"
            priority
          />
          <div className="min-w-0">
            <p className="text-base font-bold leading-tight text-slate-950 sm:text-lg">
              {siteConfig.name}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
              Empower people & change lives
            </p>
          </div>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#contact"
          className="shrink-0 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
        >
          Get involved
        </Link>
      </div>
    </header>
  );
}
