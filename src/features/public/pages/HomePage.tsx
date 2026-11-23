import { Link } from "react-router-dom";
import {
  Music2, BookOpen, Users, Star, ArrowRight,
  Calendar, ChevronRight, Heart, Globe, Award,
  HeartHandshake, Shield,
} from "lucide-react";
import { usePublications } from "../hooks/use-publications";
import { useEvents } from "../hooks/use-events";
import { useOrganisation } from "../hooks/use-organisation";
import { useCmsContent } from "../hooks/use-cms-content";
import { formatDate } from "@/lib/utils";
import type { Publication, Event } from "@/services/generated/api-types";

// ── Photos ────────────────────────────────────────────────────────────────────
const IMG = "/images/Sound Of Hope Foundation/";
const HERO_IMAGE      = `${IMG}PXL_20260615_110953667.jpg`;
const ABOUT_IMAGE_1   = `${IMG}PXL_20260506_115213817.jpg`;
const ABOUT_IMAGE_2   = `${IMG}PXL_20260302_130028324.jpg`;
const COMMUNITY_IMAGE = `${IMG}PXL_20260914_094122842.jpg`;
const PIANO_IMAGE     = `${IMG}PXL_20260506_115213817.jpg`;

const PROGRAMME_IMAGES = [
  `${IMG}PXL_20260506_115220433.jpg`,
  `${IMG}PXL_20260309_124632336.jpg`,
  `${IMG}PXL_20260222_090126622.jpg`,
  `${IMG}PXL_20260222_090135052.jpg`,
];

const GALLERY_IMAGES = [
  `${IMG}PXL_20260125_140446622.jpg`,
  `${IMG}PXL_20260222_090203240.jpg`,
  `${IMG}PXL_20260225_141155526.jpg`,
  `${IMG}PXL_20260316_091610716.jpg`,
  `${IMG}PXL_20260414_143425208.jpg`,
  `${IMG}PXL_20260523_121113343.jpg`,
  `${IMG}PXL_20260630_083438513.jpg`,
  `${IMG}PXL_20260807_083903106.jpg`,
];

// ── Defaults ──────────────────────────────────────────────────────────────────
interface StatItem { value: string; label: string }
const DEFAULT_STATS: StatItem[] = [
  { value: "500+", label: "Students Trained" },
  { value: "12",   label: "Partner Schools" },
  { value: "30+",  label: "Concerts Performed" },
  { value: "5",    label: "Countries Reached" },
];

// ── Parsers ───────────────────────────────────────────────────────────────────

/** Parse a Key: value flat-text block into a lookup map. */
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

function parseStats(raw: string | null | undefined): StatItem[] {
  if (!raw) return DEFAULT_STATS;
  try {
    const p = JSON.parse(raw);
    if (Array.isArray(p)) return p as StatItem[];
  } catch { /* fall through */ }
  return DEFAULT_STATS;
}

function parseHero(raw: string | null | undefined) {
  const kv = parseKV(raw);
  return {
    eyebrow:      kv["Eyebrow"]        ?? "Music · Healing · Community",
    headline:     kv["Headline"]       ?? "Where Music Gives Hope",
    sub:          kv["Sub-headline"]   ?? "Sound of Hope Foundation uses music as a vehicle for healing, education, and community transformation across East Africa. Every lesson changes a life.",
    ctaPrimary:   kv["CTA-primary"]    ?? "Our Programmes",
    ctaSecondary: kv["CTA-secondary"]  ?? "Support Our Work",
  };
}

function parseWhatWeDo(raw: string | null | undefined) {
  const kv = parseKV(raw);
  return {
    eyebrow: kv["Eyebrow"] ?? "What We Do",
    heading: kv["Heading"] ?? "Music as a vehicle for change",
    pillars: [
      {
        label: kv["Pillar1-title"] ?? "Education",
        desc:  kv["Pillar1-desc"]  ?? "We deliver comprehensive life-skills education and robust career development programmes, alongside targeted initiatives to ensure sustained youth engagement in learning.",
        color: "bg-primary" as const,
        icon:  BookOpen,
      },
      {
        label: kv["Pillar2-title"] ?? "Health",
        desc:  kv["Pillar2-desc"]  ?? "We equip young people with high-quality psychosocial support, mental health programmes, and impactful public health campaigns that drive positive change across communities.",
        color: "bg-accent" as const,
        icon:  Heart,
      },
      {
        label: kv["Pillar3-title"] ?? "Equality",
        desc:  kv["Pillar3-desc"]  ?? "We champion inclusion through dedicated programmes for displaced persons, ensuring equal opportunities for children with disabilities and advocating for gender equality.",
        color: "bg-primary" as const,
        icon:  Shield,
      },
    ],
  };
}

function parseAbout(raw: string | null | undefined) {
  const kv = parseKV(raw);
  const hasCms = raw != null;
  return {
    eyebrow:  kv["Eyebrow"]  ?? "Who We Are",
    heading:  kv["Heading"]  ?? "Unlocking Potential Through the Power of Music",
    para1:    kv["Para1"]    ?? (hasCms ? "" : "Sound of Hope Foundation was founded on the belief that music is a universal language that transcends circumstance. Working in partnership with schools and local communities across East Africa, we provide free and subsidised music education to children who would otherwise have no access."),
    para2:    kv["Para2"]    ?? (hasCms ? "" : "Our programmes go beyond notes and rhythms — they build discipline, teamwork, confidence, and a sense of identity. For many of our students, their instrument is the first thing they have truly called their own."),
    cta:      kv["CTA"]      ?? "See Our Programmes",
  };
}

function parseProgrammes(raw: string | null | undefined) {
  const kv = parseKV(raw);
  return {
    eyebrow: kv["Eyebrow"] ?? "Our Programmes",
    heading: kv["Heading"] ?? "Every child deserves to be heard",
    items: [
      { title: kv["Prog1-title"] ?? "Instrument Tuition",    desc: kv["Prog1-desc"] ?? "Weekly violin, piano, guitar, and percussion lessons for children aged 6–18 in partner schools.",                       image: PROGRAMME_IMAGES[0], icon: Music2 },
      { title: kv["Prog2-title"] ?? "Music Theory",          desc: kv["Prog2-desc"] ?? "Structured classroom sessions covering notation, ear training, and music history to build a strong academic foundation.", image: PROGRAMME_IMAGES[1], icon: BookOpen },
      { title: kv["Prog3-title"] ?? "Community Outreach",    desc: kv["Prog3-desc"] ?? "Bringing music into underserved communities through workshops, instrument donations, and professional mentorship.",        image: PROGRAMME_IMAGES[2], icon: Users },
      { title: kv["Prog4-title"] ?? "Concerts & Showcases",  desc: kv["Prog4-desc"] ?? "Student performances and fundraising concerts that celebrate progress, build confidence, and connect communities.",        image: PROGRAMME_IMAGES[3], icon: Star },
    ],
  };
}

function parseCommunity(raw: string | null | undefined) {
  const kv = parseKV(raw);
  return {
    eyebrow: kv["Eyebrow"] ?? "More Than Music",
    heading: kv["Heading"] ?? "Building bridges between communities",
    body:    kv["Body"]    ?? "Our outreach events bring communities together, foster friendship, and show children that joy is possible — regardless of circumstance.",
    cta:     kv["CTA"]     ?? "Join the Movement",
  };
}

function parseDonate(raw: string | null | undefined) {
  const kv = parseKV(raw);
  return {
    eyebrow:      kv["Eyebrow"]       ?? "Make a Difference",
    headline:     kv["Headline"]      ?? "Help a Child Find Their Voice",
    body:         kv["Body"]          ?? "Your donation provides instruments, lessons, and opportunities for children who would otherwise never have access to music.",
    ctaPrimary:   kv["CTA-primary"]   ?? "Donate Now",
    ctaSecondary: kv["CTA-secondary"] ?? "Become a Partner",
  };
}

function parseMission(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return raw.trim() || null;
}

function parseGallery(raw: string | null | undefined): string[] {
  if (!raw) return GALLERY_IMAGES;
  const urls = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  return urls.length > 0 ? urls : GALLERY_IMAGES;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function HomePage() {
  const { data: newsData }   = usePublications({ page_size: 3 });
  const { data: eventsData } = useEvents({ page_size: 3 });
  const { data: org }        = useOrganisation();
  const { data: heroRaw }        = useCmsContent("homepage/hero");
  const { data: missionRaw }     = useCmsContent("homepage/mission");
  const { data: whatWeDoRaw }    = useCmsContent("homepage/what-we-do");
  const { data: statsRaw }       = useCmsContent("homepage/impact-stats", "stats");
  const { data: aboutRaw }       = useCmsContent("homepage/about");
  const { data: programmesRaw }  = useCmsContent("homepage/programmes");
  const { data: communityRaw }   = useCmsContent("homepage/community");
  const { data: donateRaw }      = useCmsContent("homepage/donate-cta");
  const { data: galleryRaw }     = useCmsContent("homepage/gallery");

  const hero       = parseHero(heroRaw);
  const whatWeDo   = parseWhatWeDo(whatWeDoRaw);
  const stats      = parseStats(statsRaw);
  const about      = parseAbout(aboutRaw);
  const programmes = parseProgrammes(programmesRaw);
  const community  = parseCommunity(communityRaw);
  const donate     = parseDonate(donateRaw);
  const gallery    = parseGallery(galleryRaw);

  const orgEmail   = org?.email   ?? "info@soundofhope.org";
  const orgCity    = org?.city    ?? "Juba";
  const orgCountry = org?.country ?? "South Sudan";
  const orgMission =
    parseMission(missionRaw) ??
    org?.mission ??
    "We use music to empower young people, helping them achieve better health, education, and equality. We believe in a world where everyone has the opportunity to fulfil their potential and thrive.";

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Student playing violin" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-32">
          <div className="max-w-2xl">
            {/* Eyebrow — Brass for Africa style */}
            <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-accent mb-6">
              {hero.eyebrow}
            </p>
            {/* Big Raleway headline */}
            <h1 className="font-heading font-900 text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
              {hero.headline.includes("Hope") ? (
                <>
                  {hero.headline.split("Hope")[0]}
                  <span className="text-accent">Hope</span>
                  {hero.headline.split("Hope").slice(1).join("Hope")}
                </>
              ) : hero.headline}
            </h1>
            <p className="font-body text-lg text-white/80 mb-10 leading-relaxed max-w-lg">
              {hero.sub}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#programmes"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-heading font-700 text-sm tracking-wide rounded hover:bg-amber-600 transition-colors shadow"
              >
                {hero.ctaPrimary} <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#donate"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white text-white font-heading font-700 text-sm tracking-wide rounded hover:bg-white hover:text-gray-900 transition-colors"
              >
                <Heart className="w-4 h-4" /> {hero.ctaSecondary}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-10 bg-white animate-pulse" />
          <span className="font-heading text-white text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* ── OUR MISSION — Brass for Africa style full-width statement ──── */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-white/60 mb-4">
            Our Mission
          </p>
          <p className="font-heading font-600 text-xl sm:text-2xl text-white leading-relaxed">
            {orgMission}
          </p>
        </div>
      </section>

      {/* ── THREE PILLARS — Brass for Africa's Education / Health / Equality ── */}
      <section className="bg-cream-100 py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-14">
            <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-primary mb-3">{whatWeDo.eyebrow}</p>
            <h2 className="font-heading font-800 text-4xl sm:text-5xl text-gray-900">
              {whatWeDo.heading}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {whatWeDo.pillars.map(({ icon: Icon, label, color, desc }) => (
              <div key={label} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${color} rounded flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-800 text-xl text-gray-900 mb-3 uppercase tracking-wide">
                  {label}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS — ReachApac bold counters style ─────────────────── */}
      <section id="impact" className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center mb-14">
            <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-accent mb-3">Our Impact</p>
            <h2 className="font-heading font-800 text-4xl sm:text-5xl text-white">
              Measuring what matters
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center border border-white/10 rounded-lg p-8">
                <p className="font-heading font-900 text-5xl sm:text-6xl text-accent mb-3">{value}</p>
                <p className="font-heading font-600 text-sm uppercase tracking-widest text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT — image + text, Brass for Africa split layout ─────────── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Images */}
            <div className="relative">
              <div className="rounded-lg overflow-hidden aspect-[4/3] shadow-xl">
                <img src={ABOUT_IMAGE_1} alt="Students learning violin" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-5 w-52 rounded-lg overflow-hidden shadow-xl border-4 border-white aspect-square">
                <img src={ABOUT_IMAGE_2} alt="Student at piano" className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Text */}
            <div className="lg:pl-6">
              <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-primary mb-4">{about.eyebrow}</p>
              <h2 className="font-heading font-800 text-4xl sm:text-5xl text-gray-900 leading-tight mb-6">
                {about.heading}
              </h2>
              {about.para1 && <p className="font-body text-gray-600 leading-relaxed mb-4">{about.para1}</p>}
              {about.para2 && <p className="font-body text-gray-600 leading-relaxed mb-4">{about.para2}</p>}
              <div className="flex flex-wrap gap-6 mt-6">
                {[
                  { icon: Award, text: "Registered NGO" },
                  { icon: Globe, text: `${orgCity}, ${orgCountry}` },
                  { icon: HeartHandshake, text: "Community-led" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="font-body text-sm font-500 text-gray-700">{text}</span>
                  </div>
                ))}
              </div>
              <a
                href="#programmes"
                className="mt-8 inline-flex items-center gap-2 font-heading font-700 text-sm tracking-wide text-primary hover:gap-3 transition-all uppercase"
              >
                {about.cta} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMMES ───────────────────────────────────────────────────── */}
      <section id="programmes" className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-primary mb-3">{programmes.eyebrow}</p>
            <h2 className="font-heading font-800 text-4xl sm:text-5xl text-gray-900">
              {programmes.heading}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmes.items.map(({ title, desc, image, icon: Icon }) => (
              <div key={title} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="w-9 h-9 bg-primary/10 rounded flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-700 text-gray-900 mb-2 tracking-wide">{title}</h3>
                  <p className="font-body text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY BAND — full-width image section ────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={COMMUNITY_IMAGE} alt="Community outreach event" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gray-900/65" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-accent mb-4">{community.eyebrow}</p>
          <h2 className="font-heading font-800 text-4xl sm:text-5xl text-white mb-5 leading-tight">
            {community.heading}
          </h2>
          <p className="font-body text-lg text-white/80 max-w-xl mx-auto mb-8">
            {community.body}
          </p>
          <a
            href="#donate"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-heading font-700 text-sm tracking-wide rounded hover:bg-amber-600 transition-colors"
          >
            <Heart className="w-4 h-4" /> {community.cta}
          </a>
        </div>
      </section>

      {/* ── GALLERY STRIP ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-primary mb-2">Gallery</p>
              <h2 className="font-heading font-800 text-4xl text-gray-900">Life at Sound of Hope</h2>
            </div>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 px-5 sm:px-8 lg:px-10 snap-x snap-mandatory">
          {gallery.map((src, i) => (
            <div key={i} className="shrink-0 w-60 sm:w-72 aspect-[3/4] rounded-lg overflow-hidden snap-start">
              <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ── LATEST NEWS ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-primary mb-2">News & Stories</p>
              <h2 className="font-heading font-800 text-4xl sm:text-5xl text-gray-900">Latest from the Field</h2>
            </div>
            <Link to="/news" className="hidden sm:inline-flex items-center gap-1.5 font-heading font-700 text-sm uppercase tracking-wide text-primary hover:gap-3 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {newsData && newsData.items.length > 0
            ? <NewsGrid items={newsData.items} />
            : <NewsPlaceholder />}
          <div className="mt-8 text-center sm:hidden">
            <Link to="/news" className="font-heading font-700 text-sm uppercase tracking-wide text-primary">
              View All News →
            </Link>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-primary mb-2">Events</p>
              <h2 className="font-heading font-800 text-4xl sm:text-5xl text-gray-900">Upcoming Events</h2>
            </div>
            <Link to="/events" className="hidden sm:inline-flex items-center gap-1.5 font-heading font-700 text-sm uppercase tracking-wide text-primary hover:gap-3 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {eventsData && eventsData.items.length > 0
            ? <EventsGrid items={eventsData.items} />
            : <EventsPlaceholder />}
        </div>
      </section>

      {/* ── DONATE CTA ───────────────────────────────────────────────────── */}
      <section id="donate" className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={PIANO_IMAGE} alt="Student at piano" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/90" />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <p className="font-heading font-700 text-xs tracking-widest2 uppercase text-white/60 mb-4">{donate.eyebrow}</p>
          <h2 className="font-heading font-800 text-4xl sm:text-5xl text-white mb-5 leading-tight">
            {donate.headline}
          </h2>
          <p className="font-body text-lg text-white/80 max-w-xl mx-auto mb-10">{donate.body}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${orgEmail}?subject=Donation%20Enquiry`}
              className="px-8 py-4 bg-accent text-white font-heading font-700 text-sm tracking-wide rounded hover:bg-amber-600 transition-colors shadow-lg"
            >
              {donate.ctaPrimary}
            </a>
            <a
              href={`mailto:${orgEmail}?subject=Partnership%20Enquiry`}
              className="px-8 py-4 border-2 border-white text-white font-heading font-700 text-sm tracking-wide rounded hover:bg-white hover:text-primary transition-colors"
            >
              {donate.ctaSecondary}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function NewsGrid({ items }: { items: Publication[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((post, idx) => (
        <Link
          key={post.id}
          to={`/news/${post.id}`}
          className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <div className="aspect-video overflow-hidden">
            <img
              src={GALLERY_IMAGES[idx % GALLERY_IMAGES.length]}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6">
            <span className="font-heading font-700 text-xs tracking-widest uppercase text-accent">
              {post.publication_type}
            </span>
            <h3 className="font-heading font-700 text-gray-900 mt-2 mb-2 group-hover:text-primary transition-colors line-clamp-2 text-lg">
              {post.title}
            </h3>
            {post.summary && (
              <p className="font-body text-sm text-gray-500 line-clamp-2 mb-3">{post.summary}</p>
            )}
            <p className="font-body text-xs text-gray-400">
              {post.published_date ? formatDate(post.published_date) : formatDate(post.created_at)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function EventsGrid({ items }: { items: Event[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((event, idx) => (
        <Link
          key={event.id}
          to={`/events/${event.id}`}
          className="group bg-cream-100 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <div className="aspect-video overflow-hidden">
            <img
              src={GALLERY_IMAGES[idx % GALLERY_IMAGES.length]}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-accent text-xs font-heading font-700 tracking-wide mb-2 uppercase">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.starts_at)}
            </div>
            <h3 className="font-heading font-700 text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-lg">
              {event.title}
            </h3>
            {event.location && (
              <p className="font-body text-sm text-gray-500 mt-1">{event.location}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function NewsPlaceholder() {
  const items = [
    { title: "Violin Students Perform at National Music Festival", summary: "Twenty students from our partner schools took the stage for the first time at this year's national festival.", date: "15 Mar 2026", type: "Article", img: `${IMG}PXL_20260819_083303661.jpg` },
    { title: "New Piano Donated to Juba Primary School",           summary: "Thanks to our generous supporters, students in Juba now have access to their first full-size piano.",              date: "02 Mar 2026", type: "News",    img: `${IMG}PXL_20260903_091801514.jpg` },
    { title: "Annual Impact Report 2025 Released",                 summary: "Read about the progress we made across all our programmes last year and our plans for 2026.",                        date: "14 Feb 2026", type: "Report",  img: `${IMG}PXL_20260921_152223349.jpg` },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.title} className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="aspect-video overflow-hidden">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-6">
            <span className="font-heading font-700 text-xs tracking-widest uppercase text-accent">{item.type}</span>
            <h3 className="font-heading font-700 text-gray-900 mt-2 mb-2 line-clamp-2 text-lg">{item.title}</h3>
            <p className="font-body text-sm text-gray-500 line-clamp-2 mb-3">{item.summary}</p>
            <p className="font-body text-xs text-gray-400">{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventsPlaceholder() {
  const items = [
    { title: "Annual Gala Concert — Juba Grand Hall",   date: "12 Apr 2026", location: "Juba, South Sudan",  img: `${IMG}PXL_20260125_140446622.jpg` },
    { title: "School Outreach Day — Gudele Primary",    date: "26 Apr 2026", location: "Gudele, Juba",       img: `${IMG}PXL_20260914_144032186.jpg` },
    { title: "Fundraising Dinner — Supporters Evening", date: "10 May 2026", location: "Kampala, Uganda",    img: `${IMG}PXL_20260915_064538648.jpg` },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.title} className="bg-cream-100 rounded-lg overflow-hidden">
          <div className="aspect-video overflow-hidden">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-accent text-xs font-heading font-700 tracking-wide mb-2 uppercase">
              <Calendar className="w-3.5 h-3.5" />
              {item.date}
            </div>
            <h3 className="font-heading font-700 text-gray-900 line-clamp-2 text-lg">{item.title}</h3>
            <p className="font-body text-sm text-gray-500 mt-1">{item.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
