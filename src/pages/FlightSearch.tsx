import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BookingNav } from "@/components/layout/BookingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BookingSearchCard } from "@/components/booking/BookingSearchCard";
import { FlightOfferCard } from "@/components/flights/FlightOfferCard";
import { FlightOfferDetailsModal } from "@/components/flights/FlightOfferDetailsModal";
import {
  applyFlightFilters,
  defaultFlightFilters,
  FlightSearchFilters,
  type FlightFiltersState,
} from "@/components/flights/FlightSearchFilters";
import SEO from "@/components/SEO";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import { getAirportByCode } from "@/data/airports";
import { mapDuffelOfferToSelectedFlight } from "@/lib/mapOfferToBooking";
import { searchFlightsViaApi, formatCabinLabel } from "@/services/flightSearchApi";
import type { NormalizedFlightOffer } from "@/types/duffelFlight";

const FlightSearch = () => {
  const navigate = useNavigate();
  const { setSelectedFlight } = useFlightBooking();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offers, setOffers] = useState<NormalizedFlightOffer[]>([]);
  const [filters, setFilters] = useState<FlightFiltersState>(defaultFlightFilters);
  const [selected, setSelected] = useState<NormalizedFlightOffer | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const query = useMemo(() => {
    const adults = Math.max(1, Number(params.get("adults") || 1));
    const children = Math.max(0, Number(params.get("children") || 0));
    const infants = Math.max(0, Number(params.get("infants") || 0));
    const maxConnectionsRaw = params.get("maxConnections");
    const maxConnections =
      maxConnectionsRaw === null || maxConnectionsRaw === "" || maxConnectionsRaw === "any"
        ? null
        : Number(maxConnectionsRaw);

    const from = (params.get("from") || "").toUpperCase();
    const to = (params.get("to") || "").toUpperCase();

    return {
      origin: from,
      destination: to,
      departureDate: params.get("departure") || "",
      returnDate: params.get("return") || null,
      adults,
      children,
      infants,
      cabinClass: params.get("cabin") || "economy",
      maxConnections: Number.isFinite(maxConnections as number) ? maxConnections : null,
      tripType: params.get("tripType") || (params.get("return") ? "roundtrip" : "oneway"),
      hasRoute: Boolean(from && to),
    };
  }, [params]);

  const fromCity = query.origin ? getAirportByCode(query.origin)?.city || query.origin : "";
  const toCity = query.destination
    ? getAirportByCode(query.destination)?.city || query.destination
    : "";

  useEffect(() => {
    if (!query.hasRoute) {
      setLoading(false);
      setOffers([]);
      setError("Select origin and destination airports to search flights.");
      return;
    }
    if (!query.departureDate) {
      setLoading(false);
      setOffers([]);
      setError("Please choose a departure date to search flights.");
      return;
    }

    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    setOffers([]);
    setFilters(defaultFlightFilters);

    searchFlightsViaApi(
      {
        origin: query.origin,
        destination: query.destination,
        departureDate: query.departureDate,
        returnDate: query.tripType === "roundtrip" ? query.returnDate : null,
        adults: query.adults,
        children: query.children,
        infants: query.infants,
        cabinClass: query.cabinClass,
        maxConnections: query.maxConnections,
      },
      controller.signal
    )
      .then((res) => {
        if (!active) return;
        setOffers(res.flights);
        if (!res.flights.length) {
          setError(res.message || "No flights found for this route and date.");
        }
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setOffers([]);
        setError(err instanceof Error ? err.message : "Unable to search flights right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [query]);

  const filtered = useMemo(() => applyFlightFilters(offers, filters), [offers, filters]);

  const airlineOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const offer of offers) {
      for (const a of offer.airlines) {
        const value = a.iataCode || a.name || "";
        if (!value) continue;
        map.set(value, a.name ? `${a.name}${a.iataCode ? ` (${a.iataCode})` : ""}` : value);
      }
    }
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [offers]);

  const cabinOptions = useMemo(() => {
    const set = new Set<string>();
    for (const o of offers) {
      if (o.cabinClass) set.add(o.cabinClass);
    }
    return Array.from(set).map((value) => ({
      value,
      label: formatCabinLabel(value) || value,
    }));
  }, [offers]);

  const passengerLabel = [
    `${query.adults} adult${query.adults > 1 ? "s" : ""}`,
    query.children ? `${query.children} child${query.children > 1 ? "ren" : ""}` : null,
    query.infants ? `${query.infants} infant${query.infants > 1 ? "s" : ""}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const travellerCount = Math.max(1, query.adults + query.children + query.infants);

  const handleBookNow = (offer: NormalizedFlightOffer) => {
    const flight = mapDuffelOfferToSelectedFlight(offer, {
      departureDate: query.departureDate,
      travellerCount,
      adults: query.adults,
      children: query.children,
      infants: query.infants,
    });
    setSelectedFlight(flight);
    navigate("/booking/traveller-details");
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <SEO
        title={`Flights from ${fromCity} to ${toCity} | IPNIA`}
        description={`Search live flights from ${fromCity} to ${toCity} with IPNIA powered by Duffel.`}
        path="/flights/search"
        keywords={`flights ${fromCity} to ${toCity}, IPNIA flight search`}
      />
      <BookingNav />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4a853]">
            Flight Search
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">
            {query.hasRoute ? `${fromCity} → ${toCity}` : "Search flights"}
          </h1>
          <p className="mt-2 text-white/60">
            {query.hasRoute
              ? `${query.departureDate || "Select dates"}${
                  query.returnDate ? ` → ${query.returnDate}` : ""
                } · ${passengerLabel} · ${formatCabinLabel(query.cabinClass) || query.cabinClass}`
              : "Choose origin, destination and dates using the search form below."}
          </p>
        </div>

        <div className="mb-10 max-w-3xl">
          <BookingSearchCard defaultMode="flights" />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e] p-8">
            <p className="text-lg font-semibold text-[#d4a853]">Searching airlines...</p>
            <p className="mt-2 text-white/60">Finding available flights for your route.</p>
          </div>
        ) : (
          <>
            {!error && offers.length > 0 && (
              <div className="mb-4 space-y-4">
                <p className="text-white/70">
                  {filtered.length === offers.length
                    ? `${offers.length} flight${offers.length === 1 ? "" : "s"} found`
                    : `${filtered.length} of ${offers.length} flights`}
                </p>
                <FlightSearchFilters
                  filters={filters}
                  onChange={setFilters}
                  airlineOptions={airlineOptions}
                  cabinOptions={cabinOptions}
                />
              </div>
            )}

            {error && offers.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-8">
                <p className="text-white/70">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-8">
                <p className="text-white/70">
                  No flights match your filters. Try adjusting stops, airline, or price.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((offer) => (
                  <FlightOfferCard
                    key={offer.id}
                    offer={offer}
                    onViewDetails={() => {
                      setSelected(offer);
                      setDetailsOpen(true);
                    }}
                    onBookNow={() => handleBookNow(offer)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-10">
          <Link to="/travel-ecosystem" className="text-sm font-semibold text-[#d4a853] hover:underline">
            Explore IPNIA Travel Ecosystem →
          </Link>
        </div>
      </main>

      <FlightOfferDetailsModal
        offer={selected}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <SiteFooter />
    </div>
  );
};

export default FlightSearch;
