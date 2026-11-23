import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ChevronRight, Clock } from "lucide-react";
import { useEvents } from "../hooks/use-events";
import { useCmsContent } from "../hooks/use-cms-content";
import type { Event } from "@/services/generated/api-types";

function parsePageHeader(raw: string | null | undefined) {
  if (!raw) return null;
  const map: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    map[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return map;
}

const IMG = "/images/Sound Of Hope Foundation/";
const FALLBACK_IMAGES = [
  `${IMG}PXL_20260125_140446622.jpg`,
  `${IMG}PXL_20260914_144032186.jpg`,
  `${IMG}PXL_20260915_064538648.jpg`,
  `${IMG}PXL_20260916_150404019.jpg`,
  `${IMG}PXL_20260924_082444328.jpg`,
  `${IMG}PXL_20261015_112354027.jpg`,
];

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
}
function formatTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
}

export function EventsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useEvents({ page, page_size: 9 });
  const { data: headerRaw } = useCmsContent("events-page/header");

  const headerKV      = parsePageHeader(headerRaw);
  const bannerEyebrow  = headerKV?.["Eyebrow"]   ?? "Connect & Celebrate";
  const bannerTitle    = headerKV?.["Title"]      ?? "Events";
  const bannerSubtitle = headerKV?.["Subtitle"]   ?? "Concerts, workshops, outreach days, and fundraising events — come be part of the story.";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero banner */}
      <div className="relative bg-gray-900 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`${IMG}PXL_20260125_140446622.jpg`}
            alt="Concert performance"
            className="w-full h-full object-cover opacity-30 scale-105 hover:scale-100 transition-transform duration-[8000ms]"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block font-heading font-700 text-xs tracking-widest uppercase text-primary mb-3 opacity-0 animate-[fade-up_0.5s_ease-out_0.1s_forwards]">
            {bannerEyebrow}
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-900 text-white leading-tight opacity-0 animate-[fade-up_0.6s_ease-out_0.2s_forwards]">
            {bannerTitle}
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto opacity-0 animate-[fade-up_0.6s_ease-out_0.35s_forwards]">
            {bannerSubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {isLoading && <EventsGrid loading />}
        {isError && (
          <p className="text-center text-gray-500 py-16">Could not load events. Please try again later.</p>
        )}
        {!isLoading && !isError && data && (
          <>
            {data.items.length === 0 ? (
              <div className="text-center py-24">
                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">No events found.</p>
              </div>
            ) : (
              <EventsGrid items={data.items} />
            )}
            {data.meta.total_pages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: data.meta.total_pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-full text-sm font-heading font-600 transition-all duration-200 hover:scale-110 ${
                      p === page ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EventsGrid({ items, loading }: { items?: Event[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <div className="p-5 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (!items) return null;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((event, idx) => (
        <Link
          key={event.id}
          to={`/events/${event.id}`}
          className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
        >
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            <img
              src={FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize transition-transform duration-300 group-hover:scale-105 ${event.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
              {event.is_published ? "Published" : "Upcoming"}
            </span>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 text-accent text-xs font-heading font-700 tracking-widest uppercase mb-2">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.starts_at)}
              <span className="text-gray-400 flex items-center gap-1 ml-1">
                <Clock className="w-3 h-3" />
                {formatTime(event.starts_at)}
              </span>
            </div>
            <h3 className="font-heading font-700 text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2 text-base">
              {event.title}
            </h3>
            {event.location && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-auto">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                {event.location}
              </p>
            )}
            <div className="mt-3 flex items-center justify-end">
              <span className="text-xs text-primary font-semibold flex items-center gap-0.5 group-hover:gap-2 transition-all duration-200">
                Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
