/**
 * BookingCheckoutPage — /book/:id/checkout
 */
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, CreditCard, Lock, CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import { ACTS } from "./BookingPage";
import type { Act } from "./BookingPage";

interface LocationState {
  act: { id: string; name: string; fee: number; currency: string };
  form: {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    eventDate: string;
    location: string;
    guestCount: string;
    duration: string;
    message: string;
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function BookingCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state    = location.state as LocationState | undefined;

  const [card, setCard]           = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [paying, setPaying]       = useState(false);
  const [paid, setPaid]           = useState(false);
  const [cardError, setCardError] = useState("");

  if (!state?.act) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <p>No booking details found.</p>
        <Link to="/book" className="text-primary font-semibold hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to booking
        </Link>
      </div>
    );
  }

  const { act, form } = state;
  const actData = ACTS.find((a) => a.id === act.id) as Act | undefined;

  function setCardField(k: keyof typeof card) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (k === "number") val = val.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();
      if (k === "expiry") val = val.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
      if (k === "cvv")    val = val.replace(/\D/g, "").slice(0, 4);
      setCard((c) => ({ ...c, [k]: val }));
    };
  }

  function validateCard(): boolean {
    if (card.number.replace(/\s/g, "").length < 16) { setCardError("Enter a valid 16-digit card number."); return false; }
    if (!card.name.trim())   { setCardError("Enter the name on the card."); return false; }
    if (card.expiry.length < 5) { setCardError("Enter a valid expiry date (MM/YY)."); return false; }
    if (card.cvv.length < 3)    { setCardError("Enter a valid CVV."); return false; }
    setCardError("");
    return true;
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!validateCard()) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 2500));
    setPaying(false);
    setPaid(true);
  }

  if (paid) {
    return <SuccessScreen act={act} form={form} onDone={() => navigate("/")} />;
  }

  const inputClass = "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link to={`/book/${act.id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to profile
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-heading font-800 text-base text-gray-900 mb-4">Booking summary</h3>
              {actData && (
                <div className="flex gap-3 mb-5 pb-5 border-b">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={actData.coverImage} alt={actData.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-heading font-700 text-gray-900">{actData.name}</p>
                    <p className="text-xs text-gray-500">{actData.role}</p>
                  </div>
                </div>
              )}
              <dl className="space-y-2 text-sm">
                {[
                  { label: "Booked by",  value: form.name },
                  { label: "Email",      value: form.email },
                  { label: "Event",      value: form.eventType },
                  { label: "Date",       value: formatDate(form.eventDate) },
                  { label: "Location",   value: form.location },
                  form.guestCount ? { label: "Guests",   value: form.guestCount } : null,
                  form.duration   ? { label: "Duration", value: `${form.duration} hrs` } : null,
                ].filter(Boolean).map((row) => (
                  <div key={row!.label} className="flex justify-between gap-4">
                    <dt className="text-gray-500">{row!.label}</dt>
                    <dd className="font-medium text-gray-900 text-right">{row!.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 pt-5 border-t flex justify-between items-center">
                <span className="font-heading font-700 text-gray-900">Booking fee</span>
                <span className="font-heading font-900 text-2xl text-primary">
                  ${act.fee.toLocaleString()} {act.currency}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 px-1">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              Payments are secured with 256-bit SSL encryption.
            </div>
          </div>

          {/* Payment form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-800 text-base text-gray-900">Payment details</h3>
              </div>
              <form onSubmit={handlePay} className="space-y-4">
                {cardError && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {cardError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
                  <input className={inputClass} value={card.number} onChange={setCardField("number")} placeholder="1234 5678 9012 3456" inputMode="numeric" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
                  <input className={inputClass} value={card.name} onChange={setCardField("name")} placeholder="Jane Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry date</label>
                    <input className={inputClass} value={card.expiry} onChange={setCardField("expiry")} placeholder="MM/YY" inputMode="numeric" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input className={inputClass} type="password" value={card.cvv} onChange={setCardField("cvv")} placeholder="•••" inputMode="numeric" maxLength={4} />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {["VISA", "MC", "AMEX", "MTN"].map((brand) => (
                    <span key={brand} className="text-[10px] font-heading font-700 tracking-widest border rounded px-2 py-0.5 text-gray-400 border-gray-200">
                      {brand}
                    </span>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={paying}
                  className="w-full py-3.5 bg-primary text-white font-heading font-700 text-sm rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {paying ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing payment…</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Pay ${act.fee.toLocaleString()} {act.currency}</>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400">
                  By paying you agree to our{" "}
                  <a href="#" className="underline hover:text-gray-600">Terms & Conditions</a>.
                  Your booking fee secures your date and will be deducted from the final invoice.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({
  act, form, onDone,
}: {
  act: { name: string; fee: number; currency: string };
  form: { name: string; email: string; eventDate: string; location: string };
  onDone: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-heading font-900 text-2xl text-gray-900 mb-2">Booking confirmed!</h1>
        <p className="text-gray-500 mb-6">
          Thank you, <strong>{form.name}</strong>. Your booking for{" "}
          <strong>{act.name}</strong> on <strong>{formatDate(form.eventDate)}</strong>
          {" "}in <strong>{form.location}</strong> has been received.
        </p>
        <div className="bg-green-50 rounded-xl p-4 mb-6 text-sm text-green-700">
          <p className="font-semibold mb-1">What happens next?</p>
          <p>
            A confirmation email has been sent to your address. Our team will contact you
            within 24 hours to confirm all details and arrange the final contract.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={onDone} className="w-full py-3 bg-primary text-white font-heading font-700 text-sm rounded-xl hover:bg-primary/90 transition-colors">
            Back to home
          </button>
          <Link to="/book" className="w-full py-3 border text-gray-700 font-heading font-600 text-sm rounded-xl hover:bg-gray-50 transition-colors block text-center">
            Book another musician
          </Link>
        </div>
      </div>
    </div>
  );
}
