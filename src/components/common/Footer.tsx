import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/constants/site";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-800 bg-slate-950 text-white">
      {/* Main Footer Content */}
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & Bio */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Flarelap Global Foundation logo"
                width={50}
                height={50}
                className="h-12 w-12 rounded-full object-contain bg-white p-0.5"
              />
              <div>
                <p className="text-base font-black tracking-tight">{siteConfig.name}</p>
                <p className="text-xs font-semibold text-emerald-400">Social Impact Foundation</p>
              </div>
            </div>
            
            <p className="mt-2 text-xs leading-6 text-slate-400 font-medium">
              We partner with local communities, active youth volunteers, and corporate institutions to implement practical solutions in digital education, healthcare, and economic relief.
            </p>
            
            {/* Social Media Links */}
            <div className="mt-4 flex items-center gap-4">
              {siteConfig.links.facebook && (
                <a 
                  href={siteConfig.links.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook Link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition duration-200"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                </a>
              )}
              {siteConfig.links.x && (
                <a 
                  href={siteConfig.links.x} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="X/Twitter Link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition duration-200"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {siteConfig.links.youtube && (
                <a 
                  href={siteConfig.links.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Youtube Link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition duration-200"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {siteConfig.links.github && (
                <a 
                  href={siteConfig.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="GitHub Link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition duration-200"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
              Explore Flarelap
            </h3>
            <ul className="mt-6 space-y-3.5">
              <li>
                <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition">
                  About Foundation
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition">
                  Active Programs
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition">
                  Our Products
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition">
                  Education Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Impact & Portal Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
              Impact & Community
            </h3>
            <ul className="mt-6 space-y-3.5">
              <li>
                <Link href="/impact" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition">
                  Our Impact Studies
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition">
                  Blogs & Newsletters
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1">
                  Support / Donate
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/student/login" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition">
                  Student Learning Portal
                </Link>
              </li>
              <li>
                <Link href="/student/register" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition">
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Registration Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
              Get in Touch
            </h3>
            <div className="mt-2 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4.5 w-4.5 shrink-0 text-emerald-400 mt-0.5" />
                <span className="text-xs font-medium text-slate-400 leading-5">
                  {siteConfig.location}, Global Head Office
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
                <a 
                  href={siteConfig.links.email || `mailto:${siteConfig.email}`} 
                  className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
                <a 
                  href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`} 
                  className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </div>
            
            <div className="mt-4 border-t border-slate-900 pt-4 flex gap-4 items-center">
              <Image
                src="/msme_logo.png"
                alt="MSME logo"
                width={80}
                height={36}
                className="h-8 w-auto object-contain opacity-60 filter brightness-200"
              />
              <Image
                src="/iso_logo.png"
                alt="ISO logo"
                width={36}
                height={36}
                className="h-8 w-auto object-contain opacity-60 filter brightness-200"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-slate-900 bg-slate-950 px-5 py-6 text-slate-500 text-xs">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="font-semibold text-slate-500 transition hover:text-emerald-400">
              Admin Console
            </Link>
            <span className="text-slate-800">|</span>
            <span className="text-[10px] tracking-wide text-slate-600 font-bold uppercase">
              Empower People & Change Lives
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
