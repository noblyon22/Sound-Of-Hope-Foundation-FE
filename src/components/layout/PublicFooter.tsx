import { Music2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight } from "lucide-react";
import { useCmsContent } from "@/features/public/hooks/use-cms-content";

// ── KV parser (same helper used in HomePage) ─────────────────────────────────
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

function parsePlainList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  // skip lines that look like "Heading: ..." key-value pairs
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.includes(":"));
}

export function PublicFooter() {
  // ── CMS content (all slugs matching back-office sections) ──────────────────
  const { data: newsletterRaw }  = useCmsContent("footer/newsletter");
  const { data: blurbRaw }       = useCmsContent("footer/about-blurb");
  const { data: quickLinksRaw }  = useCmsContent("footer/quick-links");
  const { data: programmesRaw }  = useCmsContent("footer/programmes");
  const { data: contactRaw }     = useCmsContent("footer/contact");
  const { data: socialRaw }      = useCmsContent("footer/social");
  const { data: legalRaw }       = useCmsContent("footer/legal");

  // ── Parse each section with fallback to hardcoded defaults ────────────────
  const newsletter = parseKV(newsletterRaw);
  const blurb      = parseKV(blurbRaw);
  const contact    = parseKV(contactRaw);
  const social     = parseKV(socialRaw);

  const newsletterHeadline = newsletter["Headline"]    ?? "Music to your ears. Impact in your inbox.";
  const newsletterSub      = newsletter["Sub-text"]    ?? "Be the first to know our latest news and find out how you can make an impact.";
  const subscribeLabel     = newsletter["Button"]      ?? "Subscribe";
  const emailPlaceholder   = newsletter["Placeholder"] ?? "Your email address";

  const orgName   = blurb["Name"]    ?? "Sound of Hope";
  const orgTagline = blurb["Tagline"] ?? "Foundation";
  const orgBlurb  = blurb["Blurb"]   ?? "Empowering children, youth and communities through practical skills development in music and creative arts across East Africa.";

  const contactHeading = contact["Heading"] ?? "Contact Us";
  const contactAddress = contact["Address"] ?? "Juba, South Sudan";
  const contactEmail   = contact["Email"]   ?? "info@soundofhope.org";
  const contactPhone   = contact["Phone"]   ?? "+211 000 000 000";

  const fbUrl  = social["Facebook"]  ?? "#";
  const twUrl  = social["Twitter"]   ?? "#";
  const igUrl  = social["Instagram"] ?? "#";
  const ytUrl  = social["YouTube"]   ?? "#";

  const quickLinks = quickLinksRaw
    ? parseLinks(quickLinksRaw)
    : [
        { label: "About Us",        href: "/#about" },
        { label: "Our Programmes",  href: "/#programmes" },
        { label: "Our Impact",      href: "/#impact" },
        { label: "News & Stories",  href: "/news" },
        { label: "Upcoming Events", href: "/events" },
        { label: "Donate",          href: "/#donate" },
      ];

  const programmesHeading = programmesRaw
    ? (parseKV(programmesRaw)["Heading"] ?? "Programmes")
    : "Programmes";

  const programmesList = programmesRaw
    ? parsePlainList(programmesRaw)
    : [
        "Instrument Tuition",
        "Music Theory Classes",
        "Psychosocial Support",
        "Community Outreach",
        "Concerts & Performances",
        "Vocational Training",
      ];

  const legalLinks = legalRaw
    ? parseLinks(legalRaw)
    : [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Use",   href: "#" },
      ];

  const socialIcons = [
    { Icon: Facebook,  url: fbUrl },
    { Icon: Twitter,   url: twUrl },
    { Icon: Instagram, url: igUrl },
    { Icon: Youtube,   url: ytUrl },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">

      {/* Newsletter strip */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading font-700 text-xl text-white mb-1">
                {newsletterHeadline}
              </h3>
              <p className="text-white/70 text-sm font-body">
                {newsletterSub}
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder={emailPlaceholder}
                className="flex-1 md:w-72 px-4 py-2.5 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm font-body focus:outline-none focus:border-white/60"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-accent text-white font-heading font-700 text-sm rounded hover:bg-amber-600 transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                {subscribeLabel} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Music2 className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <p className="font-heading font-700 text-white text-sm tracking-wide">{orgName}</p>
                <p className="font-heading font-400 text-primary text-xs tracking-widest uppercase">{orgTagline}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5 font-body">
              {orgBlurb}
            </p>
            <div className="flex gap-3">
              {socialIcons.map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-700 text-white mb-4 text-sm uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm font-body">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-heading font-700 text-white mb-4 text-sm uppercase tracking-widest">
              {programmesHeading}
            </h4>
            <ul className="space-y-2.5 text-sm font-body text-gray-400">
              {programmesList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="font-heading font-700 text-white mb-4 text-sm uppercase tracking-widest">
              {contactHeading}
            </h4>
            <ul className="space-y-3 text-sm font-body">
              <li className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-gray-400">{contactAddress}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${contactEmail}`} className="text-gray-400 hover:text-white transition-colors">
                  {contactEmail}
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="text-gray-400 hover:text-white transition-colors">
                  {contactPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500 font-body">
          <p>© {new Date().getFullYear()} Sound of Hope Foundation. All rights reserved.</p>
          <div className="flex gap-5">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
