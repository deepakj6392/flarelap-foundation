"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/constants/site";
import { Menu, X, ChevronDown, LayoutDashboard } from "lucide-react";

export default function Herader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("student_token");
    const user = localStorage.getItem("student_user");
    if (token && user) {
      setIsStudentLoggedIn(true);
    }
  }, []);

  // Split navigation items
  const mainNavItems = siteConfig.navItems.filter((item) =>
    ["Home", "About", "Programs", "Education", "Donate"].includes(item.label)
  );

  const moreNavItems = siteConfig.navItems.filter((item) =>
    ["Impact", "Blog", "Contact"].includes(item.label)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:bg-slate-950/90 dark:border-slate-800/80">
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
            <p className="text-base font-bold leading-tight text-slate-950 dark:text-white sm:text-lg">
              {siteConfig.name}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
              Empower people & change lives
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {item.label}
            </Link>
          ))}

          {/* More Dropdown Menu */}
          <div className="relative py-2">
            <button 
              onClick={() => setDesktopMoreOpen(!desktopMoreOpen)}
              onBlur={() => setTimeout(() => setDesktopMoreOpen(false), 200)}
              className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer outline-none"
            >
              More
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${desktopMoreOpen ? "rotate-180" : ""}`} />
            </button>
            
            {desktopMoreOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 p-1.5 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                {moreNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDesktopMoreOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-emerald-700 dark:hover:text-emerald-400"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {isStudentLoggedIn ? (
            <Link
              href="/student/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 shrink-0 rounded-full bg-sky-500 hover:bg-sky-600 active:scale-95 text-white px-4 py-2 text-xs font-bold transition shadow-sm"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Go to Student Dashboard
            </Link>
          ) : (
            <Link
              href="/student/login"
              className="hidden sm:inline-flex shrink-0 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 px-4 py-2 text-xs font-bold transition"
            >
              Login As Student
            </Link>
          )}
          <Link
            href="#contact"
            className="hidden sm:inline-flex shrink-0 rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Get involved
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-700 dark:text-slate-300 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-900 transition outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown/Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white dark:bg-slate-950 py-4 px-5 lg:hidden animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-700 dark:text-slate-300 py-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile More Accordion */}
            <div className="flex flex-col">
              <button
                onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                className="flex w-full items-center justify-between py-1 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer outline-none"
              >
                <span>More</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileMoreOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileMoreOpen && (
                <div className="mt-1 flex flex-col gap-2 pl-4 border-l border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
                  {moreNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileMoreOpen(false);
                      }}
                      className="text-sm font-bold text-slate-600 dark:text-slate-400 py-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {isStudentLoggedIn ? (
              <Link
                href="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 text-xs font-bold transition shadow-sm"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to Student Dashboard
              </Link>
            ) : (
              <Link
                href="/student/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-2.5 text-xs font-bold hover:bg-slate-50 transition"
              >
                Login As Student
              </Link>
            )}
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
            >
              Get involved
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
