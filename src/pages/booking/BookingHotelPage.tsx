import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { BookingPageShell } from "@/components/booking/BookingPageShell";
import { FlightSummaryCard } from "@/components/booking/FlightSummaryCard";
import { Button } from "@/components/ui/button";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import { hotels } from "@/data/hotels";
import { formatInr } from "@/lib/bookingValidation";
import type { SelectedHotelBooking } from "@/types/booking";

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 1;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

const BookingHotelPage = () => {
  const navigate = useNavigate();
  const { state, setHotel, skipHotel } = useFlightBooking();
  const [wantsHotel, setWantsHotel] = useState<boolean | null>(state.hotel ? true : null);

  const checkIn = state.selectedFlight?.departureDate || "";
  const checkOut = useMemo(() => {
    if (!checkIn) return "";
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  }, [checkIn]);

  const cityHotels = useMemo(() => {
    const city = state.selectedFlight?.destinationCity || "";
    const filtered = hotels.filter((h) => h.city.toLowerCase().includes(city.toLowerCase().split(" ")[0] || ""));
    return filtered.length ? filtered.slice(0, 4) : hotels.slice(0, 4);
  }, [state.selectedFlight?.destinationCity]);

  const selectHotel = (hotelId: string) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    if (!hotel || !state.selectedFlight) return;
    const nights = nightsBetween(checkIn, checkOut);
    const roomPrice = hotel.priceFrom * nights;
    const taxes = Math.round(roomPrice * 0.12);
    const booking: SelectedHotelBooking = {
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      roomType: "Deluxe Room",
      checkIn,
      checkOut,
      guests: state.selectedFlight.travellerCount,
      nights,
      roomPrice,
      taxes,
      totalPrice: roomPrice + taxes,
    };
    setHotel(booking);
  };

  const onSkip = () => {
    skipHotel();
    navigate("/booking/review");
  };

  const onContinue = () => {
    if (!state.hotel) return;
    navigate("/booking/review");
  };

  return (
    <BookingPageShell
      step={3}
      require="documents"
      title="Complete Your Trip"
      subtitle="Would you like to add a hotel to your stay?"
    >
      <SEO title="Add Hotel | IPNIA" description="Optionally add a hotel to your IPNIA trip." path="/booking/hotel" />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {wantsHotel === null && (
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setWantsHotel(true)}
                className="rounded-2xl border border-[#d4a853]/40 bg-[#0c1a2e] p-6 text-left transition hover:border-[#d4a853]"
              >
                <p className="text-lg font-semibold text-[#d4a853]">Yes, Add a Hotel</p>
                <p className="mt-2 text-sm text-white/55">Browse stays near your destination.</p>
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="rounded-2xl border border-white/15 bg-[#0c1a2e] p-6 text-left transition hover:border-white/30"
              >
                <p className="text-lg font-semibold text-white">No, Continue Without Hotel</p>
                <p className="mt-2 text-sm text-white/55">Skip to review your flight booking.</p>
              </button>
            </div>
          )}

          {wantsHotel === true && (
            <div className="space-y-4">
              <p className="text-sm text-white/55">
                Sample hotel options for planning. Live availability will connect when the hotel API is ready.
              </p>
              {cityHotels.map((hotel) => {
                const selected = state.hotel?.id === hotel.id;
                const nights = nightsBetween(checkIn, checkOut);
                const room = hotel.priceFrom * nights;
                const taxes = Math.round(room * 0.12);
                return (
                  <article
                    key={hotel.id}
                    className={`rounded-2xl border p-5 ${
                      selected ? "border-[#d4a853] bg-[#d4a853]/10" : "border-white/10 bg-[#0c1a2e]"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-white">{hotel.name}</p>
                        <p className="text-sm text-white/55">{hotel.location}</p>
                        <p className="mt-2 text-sm text-white/45">
                          Deluxe Room · {nights} night{nights > 1 ? "s" : ""} · {checkIn || "Check-in TBC"} →{" "}
                          {checkOut || "Check-out TBC"}
                        </p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-xl font-bold text-[#d4a853]">{formatInr(room + taxes)}</p>
                        <p className="text-xs text-white/45">incl. taxes</p>
                        <Button
                          type="button"
                          onClick={() => selectHotel(hotel.id)}
                          className="mt-2 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
                        >
                          {selected ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSkip}
                  className="border-white/20 bg-transparent text-white hover:bg-white/5"
                >
                  Continue Without Hotel
                </Button>
                <Button
                  type="button"
                  disabled={!state.hotel}
                  onClick={onContinue}
                  className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a] disabled:opacity-40"
                >
                  Continue to Review
                </Button>
              </div>
            </div>
          )}
        </div>
        {state.selectedFlight && <FlightSummaryCard flight={state.selectedFlight} />}
      </div>
    </BookingPageShell>
  );
};

export default BookingHotelPage;
