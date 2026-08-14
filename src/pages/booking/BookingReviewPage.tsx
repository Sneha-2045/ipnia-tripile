import { Link, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { BookingPageShell } from "@/components/booking/BookingPageShell";
import { Button } from "@/components/ui/button";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import { formatInr, travellerFullName } from "@/lib/bookingValidation";

const BookingReviewPage = () => {
  const navigate = useNavigate();
  const { state, setReviewConsent, isInternational } = useFlightBooking();
  const flight = state.selectedFlight!;
  const pb = state.priceBreakdown;

  const onContinue = () => {
    if (!state.reviewConsent) return;
    navigate("/booking/payment");
  };

  return (
    <BookingPageShell
      step={4}
      require="hotel"
      title="Review Your Trip"
      subtitle="Verify every detail before you pay."
    >
      <SEO title="Review Booking | IPNIA" description="Review your IPNIA flight booking before payment." path="/booking/review" />

      <div className="space-y-6">
        <section className="rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e] p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#d4a853]">Flight</h2>
          </div>
          <p className="mt-3 text-xl font-semibold">
            {flight.airline} · {flight.flightNumber}
          </p>
          <p className="mt-1 text-white/70">
            {flight.origin} → {flight.destination}
          </p>
          <p className="mt-2 text-lg">
            {flight.departureTime} → {flight.arrivalTime}
          </p>
          <p className="text-sm text-white/50">
            {flight.duration} · {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop(s)`}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-white/65 sm:grid-cols-2">
            <p>Date: {flight.departureDate || "TBC"}</p>
            <p>Cabin: {flight.cabin}</p>
            <p>
              Travellers: {flight.travellerCount}
            </p>
            <p>Fare: {formatInr(flight.fare)}</p>
            <p>Taxes & Fees: {formatInr(flight.taxes)}</p>
            <p className="font-semibold text-[#d4a853]">Total: {formatInr(flight.totalAmount)}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#d4a853]">Travellers</h2>
            <Link to="/booking/traveller-details" className="text-sm text-[#d4a853] hover:underline">
              Edit
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {state.travellers.map((t, i) => (
              <div key={t.id} className="border-t border-white/10 pt-4 first:border-0 first:pt-0">
                <p className="font-medium">{travellerFullName(t)}</p>
                <p className="mt-1 text-sm text-white/55">DOB: {t.dateOfBirth}</p>
                <p className="text-sm text-white/55">Nationality: {t.nationality}</p>
                <p className="text-sm text-white/55">
                  {t.email} · {t.phone}
                </p>
                {isInternational && (
                  <p className="mt-1 text-sm text-white/55">
                    Passport {t.document.passportNumber} · {t.document.issuingCountry} · Exp{" "}
                    {t.document.expiryDate}
                  </p>
                )}
                <p className="mt-1 text-xs text-white/40">Traveller {i + 1}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#d4a853]">Hotel</h2>
            {!state.hotel && (
              <Link to="/booking/hotel" className="text-sm text-[#d4a853] hover:underline">
                Add Hotel
              </Link>
            )}
          </div>
          {state.hotel ? (
            <div className="mt-3 space-y-1 text-sm text-white/70">
              <p className="text-base font-medium text-white">{state.hotel.name}</p>
              <p>{state.hotel.location}</p>
              <p>Room: {state.hotel.roomType}</p>
              <p>
                {state.hotel.checkIn} → {state.hotel.checkOut} · {state.hotel.nights} night
                {state.hotel.nights > 1 ? "s" : ""} · {state.hotel.guests} guest
                {state.hotel.guests > 1 ? "s" : ""}
              </p>
              <p>Room: {formatInr(state.hotel.roomPrice)} · Taxes: {formatInr(state.hotel.taxes)}</p>
              <p className="font-semibold text-[#d4a853]">Total: {formatInr(state.hotel.totalPrice)}</p>
            </div>
          ) : (
            <p className="mt-3 text-white/55">Hotel not added</p>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-5 md:p-6">
          <h2 className="text-lg font-semibold text-[#d4a853]">Price Breakdown</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Flight" value={formatInr(pb.flightFare)} />
            <Row label="Taxes & Fees" value={formatInr(pb.flightTaxes)} />
            {state.hotel && (
              <>
                <Row label="Hotel" value={formatInr(pb.hotelRoom)} />
                <Row label="Hotel Taxes" value={formatInr(pb.hotelTaxes)} />
              </>
            )}
            {pb.discount > 0 && <Row label="Discount" value={`−${formatInr(pb.discount)}`} />}
            <div className="border-t border-white/15 pt-3">
              <Row label="Grand Total" value={formatInr(pb.grandTotal)} strong />
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-5 md:p-6">
          <h2 className="text-lg font-semibold text-[#d4a853]">Important Information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/65">
            <li>Please verify that all traveller names and travel document details are correct before continuing.</li>
            {isInternational && (
              <li>Passport details must match the travel document used for travel.</li>
            )}
            <li>Flight tickets and PNR will be issued after supplier confirmation (not generated at payment alone).</li>
          </ul>
        </section>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-[#0c1a2e] p-5">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[#d4a853]"
            checked={state.reviewConsent}
            onChange={(e) => setReviewConsent(e.target.checked)}
          />
          <span className="text-sm text-white/80">
            I confirm that the traveller and booking details entered above are correct.
          </span>
        </label>

        <Button
          disabled={!state.reviewConsent}
          onClick={onContinue}
          className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a] disabled:opacity-40"
        >
          Continue to Payment
        </Button>
      </div>
    </BookingPageShell>
  );
};

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "text-lg font-bold text-[#d4a853]" : "text-white/70"}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default BookingReviewPage;
