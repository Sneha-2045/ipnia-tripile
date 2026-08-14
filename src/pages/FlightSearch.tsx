import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Plane } from "lucide-react";
import { BookingNav } from "@/components/layout/BookingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BookingSearchCard } from "@/components/booking/BookingSearchCard";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import { bookingApi, CabinClass, FlightResult, TripType } from "@/services/bookingApi";
import { getAirportByCode } from "@/data/airports";
import { splitFare } from "@/types/booking";

const FlightSearch = () => {
  const navigate = useNavigate();
  const { setSelectedFlight } = useFlightBooking();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<FlightResult[]>([]);

  const query = useMemo(
    () => ({
      from: (params.get("from") || "DEL").toUpperCase(),
      to: (params.get("to") || "BOM").toUpperCase(),
      departure: params.get("departure") || "",
      returnDate: params.get("return") || undefined,
      travellers: Number(params.get("travellers") || 1),
      cabin: (params.get("cabin") || "economy") as CabinClass,
      tripType: (params.get("tripType") || "oneway") as TripType,
    }),
    [params]
  );

  const fromCity = getAirportByCode(query.from)?.city || query.from;
  const toCity = getAirportByCode(query.to)?.city || query.to;

  useEffect(() => {
    let active = true;
    setLoading(true);
    bookingApi.searchFlights(query).then((list) => {
      if (!active) return;
      setResults(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [query]);

  const handleSelect = (flight: FlightResult) => {
    const { fare, taxes } = splitFare(flight.price);
    const isInternational =
      flight.from.country !== "India" || flight.to.country !== "India";

    setSelectedFlight({
      id: flight.id,
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      origin: flight.from.code,
      originCity: flight.from.city,
      destination: flight.to.code,
      destinationCity: flight.to.city,
      originCountry: flight.from.country,
      destinationCountry: flight.to.country,
      departureDate: query.departure,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      duration: flight.duration,
      stops: flight.stops,
      cabin: flight.cabin,
      fare,
      taxes,
      totalAmount: flight.price,
      travellerCount: Math.max(1, query.travellers),
      isInternational,
    });
    navigate("/booking/traveller-details");
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <SEO
        title={`Flights from ${fromCity} to ${toCity} | IPNIA`}
        description={`Search and compare flights from ${fromCity} to ${toCity} with IPNIA. Mock inventory ready for real airline API integration.`}
        path="/flights/search"
        keywords={`flights ${fromCity} to ${toCity}, IPNIA flight search`}
      />
      <BookingNav />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4a853]">Flight Search</p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">
            {fromCity} → {toCity}
          </h1>
          <p className="mt-2 text-white/60">
            {query.departure || "Flexible dates"} · {query.travellers} traveller
            {query.travellers > 1 ? "s" : ""} · {query.cabin}
          </p>
        </div>

        <div className="mb-10 max-w-3xl">
          <BookingSearchCard defaultMode="flights" />
        </div>

        {loading ? (
          <p className="text-white/60">Searching flights…</p>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-8">
            <p className="text-white/70">No flights found for this route. Try different airports or dates.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((flight) => (
              <article
                key={flight.id}
                className="rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e] p-5 md:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#d4a853]">
                      {flight.airline} · {flight.flightNumber}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <div>
                        <p className="text-2xl font-bold">{flight.departureTime}</p>
                        <p className="text-sm text-white/55">{flight.from.code}</p>
                      </div>
                      <div className="text-center text-xs text-white/45">
                        <Plane className="mx-auto mb-1 h-4 w-4 text-[#d4a853]" />
                        {flight.duration}
                        <p>{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{flight.arrivalTime}</p>
                        <p className="text-sm text-white/55">{flight.to.code}</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p className="text-sm text-white/50">Total</p>
                    <p className="text-3xl font-bold text-[#d4a853]">
                      ₹ {flight.price.toLocaleString("en-IN")}
                    </p>
                    <Button
                      type="button"
                      onClick={() => handleSelect(flight)}
                      className="mt-3 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
                    >
                      Select <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
            <p className="pt-2 text-xs text-white/40">
              Showing sample fares. Connect a live flight API in <code>bookingApi</code> when ready.
            </p>
          </div>
        )}

        <div className="mt-10">
          <Link to="/travel-ecosystem" className="text-sm font-semibold text-[#d4a853] hover:underline">
            Explore IPNIA Travel Ecosystem →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default FlightSearch;
