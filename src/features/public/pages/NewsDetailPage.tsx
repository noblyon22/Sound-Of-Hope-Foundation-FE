import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { usePublication } from "../hooks/use-publications";

const IMG = "/images/Sound Of Hope Foundation/";
const FALLBACK_IMAGE = `${IMG}PXL_20260615_110953667.jpg`;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch { return iso; }
}

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, isError } = usePublication(id ?? "");

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded w-3/4" />
        <div className="aspect-video bg-gray-200 rounded-2xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-lg">Article not found.</p>
        <Link
          to="/news"
          className="text-primary font-semibold hover:text-primary/80 hover:underline underline-offset-4 flex items-center gap-1 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Cover image */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src={FALLBACK_IMAGE}
          alt={post.title}
          className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[6000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
        <div className="absolute bottom-0 max-w-3xl mx-auto w-full left-0 right-0 px-4 sm:px-6 pb-8">
          <span className="text-primary text-xs font-heading font-700 tracking-widest uppercase bg-white/90 px-3 py-1 rounded-full capitalize">
            {post.publication_type}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/news"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to News
        </Link>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-body mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            {post.published_date ? formatDate(post.published_date) : formatDate(post.created_at)}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-900 text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {post.summary && (
          <p className="text-lg text-gray-500 border-l-4 border-primary pl-4 mb-8 italic leading-relaxed">
            {post.summary}
          </p>
        )}

        {post.body ? (
          post.body.startsWith("<") ? (
            <div
              className="prose prose-gray max-w-none font-body"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <div className="prose prose-gray max-w-none font-body whitespace-pre-wrap text-gray-700 leading-relaxed">
              {post.body}
            </div>
          )
        ) : (
          <p className="text-gray-400 italic">Full content not available.</p>
        )}

        {/* Donate CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center transition-all duration-300 hover:bg-primary/10 hover:border-primary/20 hover:shadow-md">
          <p className="font-heading font-700 text-gray-800 mb-2">Want to support our work?</p>
          <p className="text-sm text-gray-500 mb-4">
            Your contribution directly funds music lessons, instruments, and opportunities for children across East Africa.
          </p>
          <a
            href="mailto:info@soundofhope.org?subject=Donation%20Enquiry"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Donate Now
          </a>
        </div>
      </div>
    </div>
  );
}
