import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import { usePublications } from "../hooks/use-publications";
import { useCmsContent } from "../hooks/use-cms-content";
import type { Publication } from "@/services/generated/api-types";

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
  `${IMG}PXL_20260819_083303661.jpg`,
  `${IMG}PXL_20260903_091801514.jpg`,
  `${IMG}PXL_20260921_152223349.jpg`,
  `${IMG}PXL_20260914_094122842.jpg`,
  `${IMG}PXL_20260615_145606813.jpg`,
  `${IMG}PXL_20260616_090327932.jpg`,
];

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  report: "Report",
  newsletter: "Newsletter",
  policy: "Policy",
  research: "Research",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch { return iso; }
}

export function NewsPage() {
  const [page, setPage]   = useState(1);
  const [type, setType]   = useState<string | undefined>(undefined);
  const { data, isLoading, isError } = usePublications({ page, page_size: 9, publication_type: type });
  const { data: headerRaw } = useCmsContent("news-page/header");

  const headerKV      = parsePageHeader(headerRaw);
  const bannerEyebrow  = headerKV?.["Eyebrow"]   ?? "Stories & Updates";
  const bannerTitle    = headerKV?.["Title"]      ?? "News & Publications";
  const bannerSubtitle = headerKV?.["Subtitle"]   ?? "Dispatches from our programmes, impact stories, and the latest from Sound of Hope.";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero banner */}
      <div className="relative bg-gray-900 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`${IMG}PXL_20260506_115213817.jpg`}
            alt="Students in music class"
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
        {/* Type filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: "All",         value: undefined },
            { label: "Articles",    value: "article" },
            { label: "Reports",     value: "report" },
            { label: "Newsletters", value: "newsletter" },
            { label: "Research",    value: "research" },
          ].map((f) => (
            <button
              key={String(f.value)}
              onClick={() => { setType(f.value); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-heading font-600 border transition-all duration-200 hover:scale-105 active:scale-95 ${
                type === f.value
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary hover:shadow-sm"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading && <PublicationsGrid loading />}
        {isError && (
          <p className="text-center text-gray-500 py-16">Could not load publications. Please try again later.</p>
        )}
        {!isLoading && !isError && data && (
          <>
            {data.items.length === 0 ? (
              <div className="text-center py-24">
                <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">No publications found.</p>
              </div>
            ) : (
              <PublicationsGrid items={data.items} />
            )}
            {data.meta.total_pages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: data.meta.total_pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110 ${
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

function PublicationsGrid({ items, loading }: { items?: Publication[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <div className="p-5 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (!items) return null;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((post, idx) => (
        <Link
          key={post.id}
          to={`/news/${post.id}`}
          className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
        >
          <div className="aspect-video bg-gray-100 overflow-hidden">
            <img
              src={FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <span className="text-xs font-heading font-700 tracking-widest uppercase text-accent">
              {TYPE_LABELS[post.publication_type] ?? post.publication_type}
            </span>
            <h3 className="mt-1 font-heading font-700 text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-2 flex-1">
              {post.title}
            </h3>
            {post.summary && (
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.summary}</p>
            )}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {post.published_date ? formatDate(post.published_date) : formatDate(post.created_at)}
              </p>
              <span className="text-xs text-primary font-semibold flex items-center gap-0.5 group-hover:gap-2 transition-all duration-200">
                Read <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
