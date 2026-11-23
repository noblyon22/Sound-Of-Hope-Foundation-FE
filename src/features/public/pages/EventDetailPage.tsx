import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { useEvent } from "../hooks/use-events";

const IMG = "/images/Sound Of Hope Foundation/";

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
  catch { return iso; }
}
function formatTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, isError } = useEvent(id ?? "");

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded w-3/4" />
        <div className="aspect-video bg-gray-200 rounded-2xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-lg">Event not found.</p>
        <Link
          to="/events"
          className="text-primary font-semibold hover:text-primary/80 hover:underline underline-offset-4 flex items-center gap-1 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Events
        </Link>
      </div>
    );
  }

  const coverImage = `${IMG}PXL_20260914_094122842.jpg`;
  const isUpcoming = !event.is_published;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero image */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src={coverImage}
          alt={event.title}
          className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[6000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
        <div className="absolute bottom-0 max-w-3xl mx-auto w-full left-0 right-0 px-4 sm:px-6 pb-6">
          <span className={`text-xs font-semibold capitalize px-3 py-1 rounded-full ${event.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
            {event.is_published ? "Published" : "Upcoming"}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Events
        </Link>

        <h1 className="text-3xl sm:text-4xl font-heading font-900 text-gray-900 mb-6 leading-tight">
          {event.title}
        </h1>

        {/* Meta cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Calendar, label: "Date",     value: formatDate(event.starts_at) },
            { icon: Clock,    label: "Time",     value: `${formatTime(event.starts_at)} – ${formatTime(event.ends_at)}` },
            ...(event.location ? [{ icon: MapPin, label: "Location", value: event.location }] : []),
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 transition-all duration-200 hover:bg-primary/5 hover:shadow-sm hover:-translate-y-0.5"
            >
              <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-heading font-700 tracking-widest uppercase text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-heading font-600 text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {event.description && (
          event.description.startsWith("<") ? (
            <div className="prose prose-gray max-w-none font-body" dangerouslySetInnerHTML={{ __html: event.description }} />
          ) : (
            <p className="text-gray-700 font-body leading-relaxed whitespace-pre-wrap">{event.description}</p>
          )
        )}

        {isUpcoming && (
          <div className="mt-10 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center transition-all duration-300 hover:bg-primary/10 hover:border-primary/20 hover:shadow-md">
            <p className="font-heading font-700 text-gray-800 mb-2">Interested in attending?</p>
            <p className="text-sm font-body text-gray-500 mb-4">
              Contact us for tickets, sponsorship, or to get involved as a volunteer.
            </p>
            <a
              href="mailto:info@soundofhope.org?subject=Event%20Enquiry"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
