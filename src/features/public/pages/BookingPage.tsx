/**
 * BookingPage — /book
 */
import { Link } from "react-router-dom";
import { Music2, Users, Mic2, ChevronRight } from "lucide-react";

const IMG = "/images/Sound Of Hope Foundation/";

export const ACTS = [
  {
    id: "lufafa-noah",
    name: "Lufafa Noah",
    role: "Vocalist & Musician",
    tagline: "Vocalist · Composer · Sound of Hope Alumnus",
    description:
      "Lufafa Noah is an experienced vocalist and musician whose soulful sound blends Afro-fusion, gospel, and contemporary styles. A proud Sound of Hope Foundation alumnus, he has performed across East Africa and his music is available on Spotify and YouTube — a testament to an artist who has taken his craft to the world stage.",
    fee: 2000,
    currency: "USD",
    icon: Mic2,
    coverImage: `${IMG}PXL_20260214_152202208.PORTRAIT.jpg`,
    profileImages: [
      `${IMG}PXL_20260214_150457608.PORTRAIT.jpg`,
      `${IMG}PXL_20260214_150654422.PORTRAIT.jpg`,
      `${IMG}PXL_20260214_151150029.PORTRAIT.jpg`,
      `${IMG}PXL_20260214_153030095.PORTRAIT.jpg`,
      `${IMG}PXL_20260214_153543553.PORTRAIT.jpg`,
    ],
    genres: ["Afro-fusion", "Gospel", "Contemporary", "R&B"],
    highlights: [
      "Experienced vocalist with an international following",
      "Music available on Spotify and YouTube",
      "Sound of Hope Foundation alumnus",
      "Available for concerts, weddings, worship services and corporate events",
    ],
    spotifyUrl: "https://open.spotify.com/search/Lufafa%20Noah",
    youtubeUrl: "https://www.youtube.com/@lufafa_music",
  },
  {
    id: "orchestra",
    name: "Sound of Hope Orchestra",
    role: "Orchestra",
    tagline: "20-piece · Full String & Wind Ensemble",
    description:
      "The Sound of Hope Orchestra brings together our most talented young musicians in a full 20-piece ensemble. From classical symphonies to African arrangements, the orchestra delivers performances that move audiences and celebrate the power of collective music-making.",
    fee: 1200,
    currency: "USD",
    icon: Music2,
    coverImage: `${IMG}PXL_20260125_193744148.jpg`,
    profileImages: [
      `${IMG}PXL_20260125_193023249.jpg`,
      `${IMG}PXL_20260125_193253477.jpg`,
      `${IMG}PXL_20260125_193548735.jpg`,
      `${IMG}PXL_20260125_194239165.jpg`,
      `${IMG}PXL_20260125_194516636.jpg`,
    ],
    genres: ["Classical", "African Arrangements", "Contemporary"],
    highlights: [
      "20 musicians — strings, winds, percussion",
      "Full concert programme available",
      "Performed at national and international festivals",
      "Available for galas, ceremonies and large events",
    ],
    spotifyUrl: null,
    youtubeUrl: null,
  },
  {
    id: "live-band",
    name: "Sound of Hope Live Band",
    role: "Live Band",
    tagline: "7-piece · Afrobeats · Jazz · Gospel",
    description:
      "The Sound of Hope Live Band is a high-energy 7-piece group covering Afrobeats, jazz, gospel and popular music. They bring electricity to any event — from intimate fundraising dinners to open-air community celebrations.",
    fee: 600,
    currency: "USD",
    icon: Users,
    coverImage: `${IMG}PXL_20260915_064538648.jpg`,
    profileImages: [
      `${IMG}PXL_20260914_094122842.jpg`,
      `${IMG}PXL_20260914_144032186.jpg`,
      `${IMG}PXL_20260916_150404019.jpg`,
      `${IMG}PXL_20260921_152223349.jpg`,
      `${IMG}PXL_20260924_082444328.jpg`,
    ],
    genres: ["Afrobeats", "Jazz", "Gospel", "Pop"],
    highlights: [
      "7 musicians — full rhythm section and vocals",
      "Extensive repertoire across genres",
      "Ideal for weddings, dinners and outdoor events",
      "Sound equipment included in booking",
    ],
    spotifyUrl: null,
    youtubeUrl: null,
  },
] satisfies Act[];

export interface Act {
  id: string;
  name: string;
  role: string;
  tagline: string;
  description: string;
  fee: number;
  currency: string;
  icon: React.ComponentType<{ className?: string }>;
  coverImage: string;
  profileImages: string[];
  genres: string[];
  highlights: string[];
  spotifyUrl: string | null;
  youtubeUrl: string | null;
}

export type ActId = Act["id"];

export function BookingPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero banner */}
      <div className="relative bg-gray-900 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`${IMG}PXL_20260125_140446622.jpg`}
            alt="Musicians performing"
            className="w-full h-full object-cover opacity-30 scale-105 hover:scale-100 transition-transform duration-[8000ms]"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block font-heading font-700 text-xs tracking-widest uppercase text-primary mb-3 opacity-0 animate-[fade-up_0.5s_ease-out_0.1s_forwards]">
            Hire World-Class Talent
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-900 text-white leading-tight opacity-0 animate-[fade-up_0.6s_ease-out_0.2s_forwards]">
            Book a Musician
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto opacity-0 animate-[fade-up_0.6s_ease-out_0.35s_forwards]">
            From intimate solo performances to full orchestra experiences — book directly
            and support the next generation of East African musicians.
          </p>
        </div>
      </div>

      {/* Acts grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ACTS.map((act) => (
            <ActCard key={act.id} act={act} />
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-primary/5 border border-primary/10 p-8 text-center transition-all duration-300 hover:bg-primary/10 hover:border-primary/20 hover:shadow-md">
          <p className="font-heading font-700 text-gray-800 mb-2 text-lg">
            All booking fees go directly to supporting our musicians and programmes.
          </p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Sound of Hope Foundation is a registered NGO. When you book a musician you are
            investing in music education and community development across East Africa.
          </p>
        </div>
      </div>
    </div>
  );
}

function ActCard({ act }: { act: Act }) {
  const { icon: Icon } = act;
  return (
    <Link
      to={`/book/${act.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-primary/20 flex flex-col cursor-pointer"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={act.coverImage}
          alt={act.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent group-hover:from-gray-900/80 transition-all duration-300" />
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-heading font-700 tracking-wide px-3 py-1 rounded-full group-hover:bg-primary/70 transition-colors duration-300">
            <Icon className="w-3.5 h-3.5" />
            {act.role}
          </span>
        </div>
        {/* Stream badges — shown on hover for acts that have them */}
        {(act.spotifyUrl || act.youtubeUrl) && (
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {act.spotifyUrl && (
              <span className="bg-[#1DB954] text-white text-[10px] font-heading font-700 tracking-wide px-2 py-0.5 rounded-full">
                Spotify
              </span>
            )}
            {act.youtubeUrl && (
              <span className="bg-[#FF0000] text-white text-[10px] font-heading font-700 tracking-wide px-2 py-0.5 rounded-full">
                YouTube
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h2 className="font-heading font-900 text-gray-900 text-xl mb-1 group-hover:text-primary transition-colors duration-200">
          {act.name}
        </h2>
        <p className="text-xs font-heading font-600 tracking-wide text-gray-500 mb-3">
          {act.tagline}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
          {act.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {act.genres.map((g) => (
            <span
              key={g}
              className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium transition-colors duration-200 group-hover:bg-primary/20"
            >
              {g}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Booking fee from</p>
            <p className="text-xl text-gray-900">
              ${act.fee.toLocaleString()} <span className="text-sm text-gray-500">{act.currency}</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-heading font-700 text-primary group-hover:gap-2.5 transition-all duration-200">
            Book now <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
        </div>
      </div>
    </Link>
  );
}
