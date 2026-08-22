import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { BookingPageShell } from "@/components/booking/BookingPageShell";
import { Button } from "@/components/ui/button";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import { formatInr, travellerFullName, validateTravelDocuments, validateTravellerBasics } from "@/lib/bookingValidation";
import { createPaymentOrder, openCashfreeCheckout } from "@/lib/paymentApi";

const BookingPaymentPage = () => {
  const navigate = useNavigate();
  const { state, setPaymentInfo, isInternational, isHotelOnly, grandTotal } = useFlightBooking();
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");

  const flight = state.selectedFlight;
  const hotel = state.hotel;
  const primary = state.travellers.find((t) => (t.type || "adult") === "adult") || state.travellers[0];
  const pb = state.priceBreakdown;

  const onPay = async () => {
    setError("");
    if (!state.reviewConsent) {
      setError("Please confirm details on the review page first.");
      return;
    }
    if (!primary) {
      setError("Primary guest details are missing.");
      return;
    }
    const basicErr = validateTravellerBasics(state.travellers);
    if (Object.keys(basicErr).length) {
      setError("Traveller details are incomplete.");
      navigate("/booking/traveller-details");
      return;
    }
    if (!isHotelOnly && isInternational && flight) {
      const docErr = validateTravelDocuments(state.travellers, flight.departureDate, true);
      if (Object.keys(docErr).length) {
        setError("Passport details are incomplete.");
        navigate("/booking/travel-documents");
        return;
      }
    }
    if (!flight?.id && !hotel?.placeId) {
      setError("Invalid booking — missing flight or hotel reference.");
      return;
    }

    setBusy(true);
    try {
      setStatusMsg("Creating secure payment...");
      // Amount is calculated on the server from the flight offer or hotel deposit.
      const order = await createPaymentOrder({
        flightOfferId: flight?.id || null,
        hotelPlaceId: !flight?.id ? hotel?.placeId || hotel?.id || null : null,
        currency: "INR",
        customer: {
          name: travellerFullName(primary),
          email: primary.email.trim(),
          phone: primary.phone.replace(/\D/g, "").slice(-10),
        },
      });

      setPaymentInfo({
        cashfreeOrderId: order.orderId,
        paymentSessionId: order.paymentSessionId,
        paymentStatus: "PENDING",
      });

      sessionStorage.setItem("ipnia_pending_order_id", order.orderId);

      setStatusMsg("Opening secure checkout...");
      await openCashfreeCheckout(order.paymentSessionId);
      navigate(`/booking/payment-status?order_id=${encodeURIComponent(order.orderId)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment could not be started");
      setBusy(false);
      setStatusMsg("");
    }
  };

  const travellerLabel = (count: number) => {
    if (isHotelOnly) return `Guest${count > 1 ? "s" : ""}: ${count}`;
    return `Traveller${count > 1 ? "s" : ""}: ${count}`;
  };

  return (
    <BookingPageShell
      step={5}
      require="payment"
      title="Complete Your Payment"
      subtitle="Pay securely via Cashfree hosted checkout."
    >
      <SEO title="Payment | IPNIA" description="Complete your IPNIA booking payment securely." path="/booking/payment" />

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-5 md:p-6">
          <h2 className="text-lg font-semibold text-[#d4a853]">Trip Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            {flight && (
              <>
                <p className="text-base font-medium text-white">
                  {flight.airline} · {flight.flightNumber}
                </p>
                <p>
                  {flight.origin} → {flight.destination}
                </p>
                <p>
                  {flight.departureTime} → {flight.arrivalTime}
                </p>
                <p>{travellerLabel(flight.travellerCount)}</p>
              </>
            )}
            {hotel && (
              <div className={flight ? "mt-4 border-t border-white/10 pt-4" : undefined}>
                <p className="font-medium text-white">{hotel.name}</p>
                <p>
                  {hotel.checkIn} → {hotel.checkOut}
                </p>
                <p>{travellerLabel(hotel.guests)}</p>
                {hotel.isDeposit && (
                  <p className="mt-2 text-xs text-white/45">
                    Payable now: booking confirmation deposit. Remaining stay amount is confirmed by IPNIA.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e] p-5 md:p-6">
          <h2 className="text-lg font-semibold text-[#d4a853]">Payment Summary</h2>
          <dl className="mt-4 space-y-2 text-sm text-white/70">
            {flight && (
              <>
                <div className="flex justify-between">
                  <dt>Flight fare</dt>
                  <dd>{formatInr(pb.flightFare)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Taxes & fees</dt>
                  <dd>{formatInr(pb.flightTaxes)}</dd>
                </div>
              </>
            )}
            {hotel && (
              <>
                <div className="flex justify-between">
                  <dt>{hotel.isDeposit ? "Hotel booking deposit" : "Hotel price"}</dt>
                  <dd>{formatInr(pb.hotelRoom)}</dd>
                </div>
                {!hotel.isDeposit && (
                  <div className="flex justify-between">
                    <dt>Hotel taxes</dt>
                    <dd>{formatInr(pb.hotelTaxes)}</dd>
                  </div>
                )}
              </>
            )}
            <div className="border-t border-white/15 pt-4">
              <p className="text-sm text-white/50">
                {flight ? "TOTAL (charged from live offer)" : "DEPOSIT DUE NOW"}
              </p>
              <p className="mt-1 text-4xl font-bold text-[#d4a853]">
                {formatInr(flight ? pb.flightFare + pb.flightTaxes : grandTotal)}
              </p>
              {flight && hotel && !hotel.isDeposit && (
                <p className="mt-2 text-xs text-white/45">
                  Hotel amount is arranged with IPNIA after flight payment confirmation.
                </p>
              )}
            </div>
          </dl>

          <Button
            disabled={busy}
            onClick={onPay}
            className="mt-6 w-full bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a] disabled:opacity-50"
          >
            {busy ? statusMsg || "Processing…" : "Proceed to Secure Payment"}
          </Button>
          <p className="mt-3 text-center text-xs text-white/45">Secure payment powered by Cashfree</p>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </section>
      </div>
    </BookingPageShell>
  );
};

export default BookingPaymentPage;
