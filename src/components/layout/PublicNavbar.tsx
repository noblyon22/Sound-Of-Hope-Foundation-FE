import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Music2 } from "lucide-react";
import { useCmsContent } from "@/features/public/hooks/use-cms-content";

function parseLinks(raw: string | null | undefined): { label: string; href: string }[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => {
      const [label, href] = line.split("|").map((s) => s.trim());
      return { label: label ?? "", href: href ?? "#" };
    })
    .filter((l) => l.label);
}

function parseKV(raw: string | null | undefined): Record<string, string> {
  if (!raw) return {};
  const map: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key) map[key] = val;
  }
  return map;
}

const DEFAULT_NAV_LINKS = [
  { label: "Home",        href: "/" },
  { label: "About",       href: "/#about" },
  { label: "Programmes",  href: "/#programmes" },
  { label: "News",        href: "/news" },
  { label: "Events",      href: "/events" },
  { label: "Contact",     href: "/#contact" },
];

export function PublicNavbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: linksRaw } = useCmsContent("navbar/links");
  const { data: ctasRaw }  = useCmsContent("navbar/ctas");

  const navLinks    = linksRaw ? parseLinks(linksRaw) : DEFAULT_NAV_LINKS;
  const ctas        = parseKV(ctasRaw);
  const signInLabel = ctas["Sign-in"]  ?? "Sign In";
  const registerLabel = ctas["Register"] ?? "Register";
  const donateLabel = ctas["Donate"]   ?? "Donate";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md border-b border-cream-200" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className={`font-heading font-800 text-sm tracking-wide transition-colors duration-200 ${scrolled ? "text-gray-900" : "text-white"}`}>
                Sound of Hope
              </p>
              <p className={`font-heading font-400 text-xs tracking-widest uppercase transition-colors duration-200 ${scrolled ? "text-primary" : "text-white/70"}`}>
                Foundation
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className={`relative px-4 py-2 font-heading font-600 text-sm tracking-wide transition-all duration-200 rounded-sm group ${
                  scrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-4/5 transition-all duration-300 rounded-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/auth/login"
              className={`font-heading font-600 text-sm tracking-wide transition-all duration-200 hover:scale-105 ${
                scrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-white"
              }`}
            >
              {signInLabel}
            </Link>
            <Link
              to="/book"
              className="px-5 py-2.5 border border-primary text-primary font-heading font-700 text-sm tracking-wide rounded hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Book Musicians
            </Link>
            <Link
              to="/auth/register"
              className="px-5 py-2.5 bg-accent text-white font-heading font-700 text-sm tracking-wide rounded hover:bg-amber-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              {registerLabel}
            </Link>
            <a
              href="/#donate"
              className="px-5 py-2.5 bg-primary text-white font-heading font-700 text-sm tracking-wide rounded hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              {donateLabel}
            </a>
          </div>

          {/* Hamburger */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-90 ${scrolled ? "text-gray-700" : "text-white"}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open
              ? <X className="w-6 h-6 transition-transform duration-200 rotate-0" />
              : <Menu className="w-6 h-6 transition-transform duration-200" />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-cream-200 shadow-lg animate-[fade-up_0.2s_ease-out_forwards]">
          <div className="max-w-7xl mx-auto px-5 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 font-heading font-600 text-sm text-gray-700 hover:text-primary hover:bg-primary/5 tracking-wide rounded transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-cream-200 mt-2 flex flex-col gap-2">
              <Link
                to="/auth/login"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2.5 font-heading font-700 text-sm text-primary border border-primary rounded tracking-wide hover:bg-primary hover:text-white transition-all duration-200"
              >
                {signInLabel}
              </Link>
              <Link
                to="/book"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2.5 border border-primary text-primary font-heading font-700 text-sm rounded tracking-wide hover:bg-primary hover:text-white transition-all duration-200"
              >
                Book Musicians
              </Link>
              <Link
                to="/auth/register"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2.5 bg-accent text-white font-heading font-700 text-sm rounded tracking-wide hover:bg-amber-600 transition-all duration-200"
              >
                {registerLabel}
              </Link>
              <a
                href="/#donate"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2.5 bg-primary text-white font-heading font-700 text-sm rounded tracking-wide hover:bg-primary/90 transition-all duration-200"
              >
                {donateLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
