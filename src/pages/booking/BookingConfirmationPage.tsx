import { Link, Navigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { BookingNav } from "@/components/layout/BookingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import { formatInr, travellerFullName } from "@/lib/bookingValidation";

const BookingConfirmationPage = () => {
  const { state } = useFlightBooking();

  if (!state.selectedFlight) {
    return <Navigate to="/flights/search" replace />;
  }
  if (state.paymentStatus !== "SUCCESS") {
    return <Navigate to="/booking/payment-status" replace />;
  }

  const flight = state.selectedFlight;
  const primary = state.travellers[0];

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <SEO
        title="Booking Confirmed | IPNIA"
        description="Your IPNIA booking payment was successful."
        path="/booking/confirmation"
      />
      <BookingNav />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <div className="rounded-2xl border border-[#d4a853]/30 bg-[#0c1a2e] p-8">
          <p className="text-4xl text-[#d4a853]">✓</p>
          <h1 className="mt-3 text-3xl font-bold">Booking Confirmed</h1>
          <p className="mt-2 text-white/60">Your payment was successful.</p>

          <p className="mt-6 text-sm text-white/50">IPNIA Booking Reference</p>
          <p className="text-xl font-semibold text-[#d4a853]">
            {state.bookingReference || state.cashfreeOrderId}
          </p>

          <section className="mt-8 border-t border-white/10 pt-6">
            <h2 className="font-semibold text-[#d4a853]">Flight</h2>
            <p className="mt-2">
              {flight.airline} · {flight.flightNumber}
            </p>
            <p className="text-white/70">
              {flight.origin} → {flight.destination}
            </p>
            <p className="text-white/70">
              {flight.departureDate || "Date TBC"} · {flight.departureTime} → {flight.arrivalTime}
            </p>
          </section>

          <section className="mt-6 border-t border-white/10 pt-6">
            <h2 className="font-semibold text-[#d4a853]">Traveller</h2>
            <p className="mt-2">{primary ? travellerFullName(primary) : "—"}</p>
            {state.travellers.length > 1 && (
              <p className="text-sm text-white/55">+ {state.travellers.length - 1} more</p>
            )}
          </section>

          {state.hotel && (
            <section className="mt-6 border-t border-white/10 pt-6">
              <h2 className="font-semibold text-[#d4a853]">Hotel</h2>
              <p className="mt-2">{state.hotel.name}</p>
              <p className="text-white/70">{state.hotel.roomType}</p>
              <p className="text-white/70">
                {state.hotel.checkIn} → {state.hotel.checkOut}
              </p>
            </section>
          )}

          <section className="mt-6 border-t border-white/10 pt-6">
            <h2 className="font-semibold text-[#d4a853]">Payment</h2>
            <p className="mt-2">Amount: {formatInr(state.priceBreakdown.grandTotal)}</p>
            <p className="text-white/70">Status: SUCCESS</p>
            {state.cashfreeOrderId && (
              <p className="text-sm text-white/50">Order: {state.cashfreeOrderId}</p>
            )}
          </section>

          <section className="mt-6 border-t border-white/10 pt-6">
            <h2 className="font-semibold text-[#d4a853]">PNR / Ticket</h2>
            <p className="mt-2 text-white/65">
              Ticket/PNR will be generated after flight booking confirmation.
            </p>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              onClick={() => window.print()}
              className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
            >
              Download / View Booking
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/5">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default BookingConfirmationPage;
