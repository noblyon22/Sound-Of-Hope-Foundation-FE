/**
 * MusicianProfilePage — /book/:id
 */
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, CheckCircle, ExternalLink } from "lucide-react";
import { ACTS } from "./BookingPage";
import type { Act } from "./BookingPage";

/* ── Spotify & YouTube SVG icons ─────────────────────────────────────── */
function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.52 17.31a.75.75 0 01-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 01-.34-1.46c4.57-1.04 8.49-.59 11.67 1.34a.75.75 0 01.25 1.03zm1.47-3.27a.94.94 0 01-1.29.31c-3.23-1.98-8.15-2.56-11.97-1.4a.94.94 0 01-.54-1.8c4.36-1.32 9.78-.68 13.49 1.6a.94.94 0 01.31 1.29zm.13-3.4C15.3 8.4 9.3 8.2 5.9 9.24a1.12 1.12 0 01-.65-2.15C9.4 5.88 16.08 6.1 20.1 8.44a1.12 1.12 0 01-1.08 1.96v.24z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.38.55A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14C4.48 20.5 12 20.5 12 20.5s7.52 0 9.38-.55a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

export function MusicianProfilePage() {
  const { id }  = useParams<{ id: string }>();
  const act     = ACTS.find((a) => a.id === id) as Act | undefined;

  if (!act) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-lg">Musician not found.</p>
        <Link
          to="/book"
          className="text-primary font-semibold hover:text-primary/80 hover:underline underline-offset-4 flex items-center gap-1 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to booking
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <HeroSection act={act} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <AboutSection act={act} />
            {(act.spotifyUrl || act.youtubeUrl) && <ListenSection act={act} />}
            <GallerySection act={act} />
          </div>
          <div>
            <BookingForm act={act} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */
function HeroSection({ act }: { act: Act }) {
  const { icon: Icon } = act;
  return (
    <div className="relative h-80 sm:h-[26rem] overflow-hidden">
      <img
        src={act.coverImage}
        alt={act.name}
        className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[6000ms]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Link
          to="/book"
          className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-4 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          All musicians
        </Link>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 bg-primary/80 text-white text-xs font-heading font-700 tracking-wide px-3 py-1 rounded-full mb-3">
              <Icon className="w-3.5 h-3.5" />
              {act.role}
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-900 text-white">{act.name}</h1>
            <p className="text-white/70 font-heading mt-1">{act.tagline}</p>
            {/* Stream links in hero — visible immediately */}
            {(act.spotifyUrl || act.youtubeUrl) && (
              <div className="flex items-center gap-3 mt-3">
                {act.spotifyUrl && (
                  <a
                    href={act.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 bg-[#1DB954] text-white text-xs font-heading font-700 px-3 py-1.5 rounded-full hover:bg-[#1aa34a] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  >
                    <SpotifyIcon className="w-3.5 h-3.5" />
                    Listen on Spotify
                  </a>
                )}
                {act.youtubeUrl && (
                  <a
                    href={act.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 bg-[#FF0000] text-white text-xs font-heading font-700 px-3 py-1.5 rounded-full hover:bg-[#cc0000] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  >
                    <YouTubeIcon className="w-3.5 h-3.5" />
                    Watch on YouTube
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-white/60 text-sm">Booking fee from</p>
            <p className="text-3xl text-white">
              ${act.fee.toLocaleString()}
              <span className="text-base font-normal text-white/60 ml-1">{act.currency}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── About ────────────────────────────────────────────────────────────── */
function AboutSection({ act }: { act: Act }) {
  return (
    <div>
      <h2 className="font-heading font-900 text-2xl text-gray-900 mb-4">About</h2>
      <p className="text-gray-600 leading-relaxed mb-6">{act.description}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-5 transition-all duration-200 hover:bg-primary/5 hover:shadow-sm hover:-translate-y-0.5">
          <p className="font-heading font-700 text-sm text-gray-900 mb-3 uppercase tracking-wide">Highlights</p>
          <ul className="space-y-2">
            {act.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 transition-all duration-200 hover:bg-primary/5 hover:shadow-sm hover:-translate-y-0.5">
          <p className="font-heading font-700 text-sm text-gray-900 mb-3 uppercase tracking-wide">Genres</p>
          <div className="flex flex-wrap gap-2">
            {act.genres.map((g) => (
              <span
                key={g}
                className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium hover:bg-primary/20 transition-colors duration-200 cursor-default"
              >
                {g}
              </span>
            ))}
          </div>
          <div className="mt-5">
            <p className="font-heading font-700 text-sm text-gray-900 mb-2 uppercase tracking-wide">Booking fee</p>
            <p className="text-2xl text-gray-900">
              ${act.fee.toLocaleString()}
              <span className="text-base font-normal text-gray-500 ml-1">{act.currency}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Minimum booking deposit to confirm your date</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Listen section — only rendered when streaming links exist ────────── */
function ListenSection({ act }: { act: Act }) {
  return (
    <div>
      <h2 className="font-heading font-900 text-2xl text-gray-900 mb-4">Listen</h2>
      <p className="text-sm text-gray-500 mb-5">
        Explore {act.name}'s music before you book — hear the voice and style that will make your event unforgettable.
      </p>
      <div className="flex flex-wrap gap-4">
        {act.spotifyUrl && (
          <a
            href={act.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-4 hover:border-[#1DB954] hover:shadow-lg hover:-translate-y-1 transition-all duration-250"
          >
            <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
              <SpotifyIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-heading font-600 uppercase tracking-wide">Stream on</p>
              <p className="font-heading font-700 text-gray-900 group-hover:text-[#1DB954] transition-colors duration-200">Spotify</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1DB954] ml-2 transition-colors duration-200" />
          </a>
        )}
        {act.youtubeUrl && (
          <a
            href={act.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-4 hover:border-[#FF0000] hover:shadow-lg hover:-translate-y-1 transition-all duration-250"
          >
            <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
              <YouTubeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-heading font-600 uppercase tracking-wide">Watch on</p>
              <p className="font-heading font-700 text-gray-900 group-hover:text-[#FF0000] transition-colors duration-200">YouTube</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#FF0000] ml-2 transition-colors duration-200" />
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Gallery ──────────────────────────────────────────────────────────── */
function GallerySection({ act }: { act: Act }) {
  return (
    <div>
      <h2 className="font-heading font-900 text-2xl text-gray-900 mb-4">Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {act.profileImages.map((src, i) => (
          <div
            key={i}
            className={`rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${i === 0 ? "col-span-2 sm:col-span-1 aspect-square" : "aspect-square"}`}
          >
            <img
              src={src}
              alt={`${act.name} ${i + 1}`}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Booking form ─────────────────────────────────────────────────────── */
interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount: string;
  duration: string;
  message: string;
}

function BookingForm({ act }: { act: Act }) {
  const navigate = useNavigate();
  const [form, setForm] = useState<BookingFormData>({
    name: "", email: "", phone: "", eventType: "",
    eventDate: "", location: "", guestCount: "", duration: "", message: "",
  });
  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  function set(k: keyof BookingFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  function validate(): boolean {
    const e: Partial<BookingFormData> = {};
    if (!form.name.trim())      e.name      = "Name is required";
    if (!form.email.trim())     e.email     = "Email is required";
    if (!form.eventDate.trim()) e.eventDate = "Event date is required";
    if (!form.eventType.trim()) e.eventType = "Event type is required";
    if (!form.location.trim())  e.location  = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    navigate(`/book/${act.id}/checkout`, {
      state: { act: { id: act.id, name: act.name, fee: act.fee, currency: act.currency }, form },
    });
  }

  const inputClass = "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 hover:border-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errClass   = "text-xs text-red-500 mt-0.5";

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 sticky top-6 transition-shadow duration-300 hover:shadow-md">
      <h3 className="font-heading font-900 text-lg text-gray-900 mb-1">Book {act.name}</h3>
      <p className="text-sm text-gray-500 mb-5">
        Fill in your event details and proceed to pay the booking fee of{" "}
        <span className="text-primary">${act.fee.toLocaleString()} {act.currency}</span>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Your full name *</label>
          <input className={inputClass} value={form.name} onChange={set("name")} placeholder="Jane Doe" />
          {errors.name && <p className={errClass}>{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass}>Email address *</label>
          <input type="email" className={inputClass} value={form.email} onChange={set("email")} placeholder="jane@example.com" />
          {errors.email && <p className={errClass}>{errors.email}</p>}
        </div>
        <div>
          <label className={labelClass}>Phone number</label>
          <input type="tel" className={inputClass} value={form.phone} onChange={set("phone")} placeholder="+256 700 000 000" />
        </div>
        <div>
          <label className={labelClass}>Event type *</label>
          <select className={inputClass} value={form.eventType} onChange={set("eventType")}>
            <option value="">Select event type</option>
            <option>Wedding ceremony</option>
            <option>Corporate event</option>
            <option>Fundraising gala</option>
            <option>Concert / festival</option>
            <option>Private party</option>
            <option>Church / worship service</option>
            <option>Other</option>
          </select>
          {errors.eventType && <p className={errClass}>{errors.eventType}</p>}
        </div>
        <div>
          <label className={labelClass}>Event date *</label>
          <input type="date" className={inputClass} value={form.eventDate} onChange={set("eventDate")} />
          {errors.eventDate && <p className={errClass}>{errors.eventDate}</p>}
        </div>
        <div>
          <label className={labelClass}>Event location *</label>
          <input className={inputClass} value={form.location} onChange={set("location")} placeholder="City, Venue" />
          {errors.location && <p className={errClass}>{errors.location}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Guests</label>
            <input type="number" min="1" className={inputClass} value={form.guestCount} onChange={set("guestCount")} placeholder="50" />
          </div>
          <div>
            <label className={labelClass}>Duration (hrs)</label>
            <input type="number" min="1" step="0.5" className={inputClass} value={form.duration} onChange={set("duration")} placeholder="2" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Additional notes</label>
          <textarea rows={3} className={inputClass + " resize-none"} value={form.message} onChange={set("message")} placeholder="Repertoire requests, special requirements…" />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-primary text-white font-heading font-700 text-sm rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          Continue to payment <ChevronRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
