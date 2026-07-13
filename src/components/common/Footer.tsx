"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/constants/site";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [settings, setSettings] = useState({
    email: siteConfig.email,
    phone: siteConfig.phone,
    location: siteConfig.location,
    address: siteConfig.address,
    facebook: siteConfig.links.facebook,
    instagram: "https://www.instagram.com/flarelap_org",
    xLink: siteConfig.links.x,
    youtube: siteConfig.links.youtube,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/site-settings`);
        const data = await res.json();
        if (res.ok && data.setting) {
          setSettings({
            email: data.setting.email || siteConfig.email,
            phone: data.setting.phone || siteConfig.phone,
            location: data.setting.location || siteConfig.location,
            address: data.setting.address || siteConfig.address,
            facebook: data.setting.facebook || siteConfig.links.facebook,
            instagram: data.setting.instagram || "https://www.instagram.com/flarelap_org",
            xLink: data.setting.xLink || siteConfig.links.x,
            youtube: data.setting.youtube || siteConfig.links.youtube,
          });
        }
      } catch (err) {
        console.error("Error fetching site settings in footer:", err);
      }
    }
    loadSettings();
  }, []);

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
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition duration-200"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
                  </svg>
                </a>
              )}
              {settings.xLink && (
                <a
                  href={settings.xLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X/Twitter Link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition duration-200"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {settings.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Youtube Link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition duration-200"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Link"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition duration-200"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
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
                <span className="text-xs font-medium text-slate-400 leading-5 whitespace-pre-line">
                  {settings.address || `${settings.location}, Global Head Office`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition"
                >
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition"
                >
                  {settings.phone}
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-slate-900 bg-slate-950 px-5 py-6 text-slate-500 text-xs">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="font-semibold text-slate-500 transition hover:text-emerald-400">
              Terms & Conditions
            </Link>
            <span className="text-slate-800">|</span>
            <Link href="/privacy" className="font-semibold text-slate-500 transition hover:text-emerald-400">
              Privacy Policy
            </Link>
            <span className="text-slate-800">|</span>
            <Link href="/admin/login" className="font-semibold text-slate-500 transition hover:text-emerald-400">
              Admin Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
