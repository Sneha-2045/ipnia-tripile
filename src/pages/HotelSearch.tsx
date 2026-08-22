import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Coffee,
  ShieldCheck,
  Sparkles,
  Wifi,
  ConciergeBell,
  MapPin,
} from "lucide-react";
import { BookingNav } from "@/components/layout/BookingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BookingSearchCard } from "@/components/booking/BookingSearchCard";
import { HotelCard } from "@/components/hotels/HotelCard";
import { HotelDetailsModal } from "@/components/hotels/HotelDetailsModal";
import {
  applyHotelFilters,
  defaultHotelFilters,
  HotelFiltersBar,
  type HotelFiltersState,
} from "@/components/hotels/HotelFilters";
import SEO from "@/components/SEO";
import StickyCTA from "@/components/StickyCTA";
import { WhyBookWithUs } from "@/components/WhyBookWithUs";
import { Button } from "@/components/ui/button";
import { useFlightBooking } from "@/contexts/FlightBookingContext";
import { stayCategories } from "@/data/hotels";
import { HOTEL_BOOKING_DEPOSIT_INR } from "@/lib/hotelBooking";
import { loadRecentHotelDestinations } from "@/lib/recentHotelDestinations";
import { searchHotelsViaApi, type SelectedHotelDestination } from "@/services/hotelSearchApi";
import type { SelectedHotelBooking } from "@/types/booking";
import type { NormalizedHotel } from "@/types/hotel";

function formatLabel(value: string) {
  return value.replace(/-/g, " ");
}

function defaultDates() {
  const inDate = new Date();
  inDate.setDate(inDate.getDate() + 1);
  const outDate = new Date();
  outDate.setDate(outDate.getDate() + 3);
  return {
    checkIn: inDate.toISOString().slice(0, 10),
    checkOut: outDate.toISOString().slice(0, 10),
  };
}

function tonightISO() {
  return new Date().toISOString().slice(0, 10);
}

function plusDaysISO(days: number, from = tonightISO()) {
  const d = new Date(`${from}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return null;
  const a = new Date(`${checkIn}T00:00:00`);
  const b = new Date(`${checkOut}T00:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b <= a) return null;
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

/** Clamp URL dates so check-in is never in the past and check-out is after check-in. */
function sanitizeStayDates(checkIn: string, checkOut: string) {
  const today = tonightISO();
  let inDate = checkIn || plusDaysISO(1);
  let outDate = checkOut || plusDaysISO(3);
  if (inDate < today) inDate = today;
  if (outDate <= inDate) outDate = plusDaysISO(1, inDate);
  return { checkIn: inDate, checkOut: outDate };
}

function scrollToHotelSearch() {
  document.getElementById("hotel-search-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

const HotelSearch = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { startHotelBooking } = useFlightBooking();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<NormalizedHotel[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [filters, setFilters] = useState<HotelFiltersState>(defaultHotelFilters);
  const [selected, setSelected] = useState<NormalizedHotel | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [recentDestinations, setRecentDestinations] = useState<SelectedHotelDestination[]>([]);
  const defaults = useMemo(() => defaultDates(), []);
  const searchKeyRef = useRef("");

  const query = useMemo(() => {
    const latRaw = params.get("lat");
    const lngRaw = params.get("lng");
    const lat = latRaw != null && latRaw !== "" ? Number(latRaw) : null;
    const lng = lngRaw != null && lngRaw !== "" ? Number(lngRaw) : null;
    const dates = sanitizeStayDates(
      params.get("checkIn") || defaults.checkIn,
      params.get("checkOut") || defaults.checkOut
    );
    return {
      destination: params.get("destination") || "",
      placeId: params.get("placeId") || null,
      latitude: Number.isFinite(lat) ? lat : null,
      longitude: Number.isFinite(lng) ? lng : null,
      city: params.get("city") || null,
      country: params.get("country") || null,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      guests: Math.max(1, Number(params.get("guests") || 2) || 2),
      rooms: Math.max(1, Number(params.get("rooms") || 1) || 1),
    };
  }, [params, defaults]);

  const hasSearch = Boolean(params.get("destination") || params.get("placeId"));
  const cityLabel = query.destination
    ? formatLabel(query.destination)
    : query.city || "your next stay";
  const nights = nightsBetween(query.checkIn, query.checkOut);

  // Rewrite URL if past / invalid stay dates were shared
  useEffect(() => {
    const rawIn = params.get("checkIn");
    const rawOut = params.get("checkOut");
    if (!rawIn && !rawOut) return;
    const fixed = sanitizeStayDates(rawIn || defaults.checkIn, rawOut || defaults.checkOut);
    if (rawIn === fixed.checkIn && rawOut === fixed.checkOut) return;
    const next = new URLSearchParams(params);
    next.set("checkIn", fixed.checkIn);
    next.set("checkOut", fixed.checkOut);
    navigate(`/hotels/search?${next.toString()}`, { replace: true });
  }, [params, defaults, navigate]);

  useEffect(() => {
    setRecentDestinations(loadRecentHotelDestinations());
  }, [hasSearch, query.placeId]);

  useEffect(() => {
    if (!hasSearch) {
      setResults([]);
      setLoading(false);
      setLoadingMore(false);
      setError("");
      setNextPageToken(null);
      setHasMore(false);
      setTotalResults(null);
      return;
    }

    const searchKey = [
      query.destination,
      query.placeId,
      query.latitude,
      query.longitude,
      query.checkIn,
      query.checkOut,
      query.guests,
      query.rooms,
    ].join("|");
    searchKeyRef.current = searchKey;

    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    setFilters(defaultHotelFilters);
    setResults([]);
    setNextPageToken(null);
    setHasMore(false);
    setTotalResults(null);

    searchHotelsViaApi(
      {
        destination: query.destination,
        placeId: query.placeId,
        latitude: query.latitude,
        longitude: query.longitude,
        checkIn: query.checkIn,
        checkOut: query.checkOut,
        guests: query.guests,
        rooms: query.rooms,
      },
      controller.signal
    )
      .then((res) => {
        if (!active || searchKeyRef.current !== searchKey) return;
        setResults(res.hotels);
        setNextPageToken(res.nextPageToken || null);
        setHasMore(Boolean(res.hasMore));
        setTotalResults(res.totalResults ?? null);
        if (!res.hotels.length) {
          setError(res.message || "No hotels found for this destination and dates.");
        }
      })
      .catch((err) => {
        if (!active || searchKeyRef.current !== searchKey) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResults([]);
        setNextPageToken(null);
        setHasMore(false);
        setTotalResults(null);
        setError(err instanceof Error ? err.message : "Unable to load hotels. Please try again.");
      })
      .finally(() => {
        if (active && searchKeyRef.current === searchKey) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [hasSearch, query]);

  const loadMore = useCallback(async () => {
    if (!nextPageToken || loadingMore || loading) return;
    setLoadingMore(true);
    setError("");
    try {
      const res = await searchHotelsViaApi({
        destination: query.destination,
        placeId: query.placeId,
        latitude: query.latitude,
        longitude: query.longitude,
        checkIn: query.checkIn,
        checkOut: query.checkOut,
        guests: query.guests,
        rooms: query.rooms,
        pageToken: nextPageToken,
      });
      setResults((prev) => {
        const seen = new Set(prev.map((h) => h.placeId || h.id));
        const appended = res.hotels.filter((h) => !seen.has(h.placeId || h.id));
        return [...prev, ...appended];
      });
      setNextPageToken(res.nextPageToken || null);
      setHasMore(Boolean(res.hasMore));
      if (res.totalResults != null) setTotalResults(res.totalResults);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setError(err instanceof Error ? err.message : "Unable to load hotels. Please try again.");
      }
    } finally {
      setLoadingMore(false);
    }
  }, [nextPageToken, loadingMore, loading, query]);

  const filtered = useMemo(() => applyHotelFilters(results, filters), [results, filters]);

  const filtersActive = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(defaultHotelFilters);
  }, [filters]);

  const resultCountLabel = useMemo(() => {
    if (loading) return "Searching hotels…";
    if (totalResults != null && Number.isFinite(totalResults)) {
      const dest = cityLabel !== "your next stay" ? ` in ${cityLabel}` : "";
      return `${totalResults} hotel${totalResults === 1 ? "" : "s"} found${dest}`;
    }
    if (results.length === 0) return "Hotels available";
    if (filtersActive && filtered.length !== results.length) {
      return `Showing ${filtered.length} of ${results.length} loaded · Hotels available`;
    }
    if (hasMore) {
      return `Hotels available · showing ${results.length}`;
    }
    return `${results.length} hotel${results.length === 1 ? "" : "s"} found${
      cityLabel !== "your next stay" ? ` in ${cityLabel}` : ""
    }`;
  }, [
    loading,
    totalResults,
    cityLabel,
    results.length,
    filtered.length,
    filtersActive,
    hasMore,
  ]);

  const propertyTypes = useMemo(() => {
    const set = new Set<string>();
    results.forEach((h) => {
      if (h.propertyType) set.add(h.propertyType);
      h.categories.forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, [results]);

  const amenities = useMemo(() => {
    const set = new Set<string>();
    results.forEach((h) => h.amenities.forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, [results]);

  const statuses = useMemo(() => {
    const set = new Set<string>();
    results.forEach((h) => {
      if (h.businessStatus) set.add(h.businessStatus);
    });
    return Array.from(set).sort();
  }, [results]);

  const goBookHotel = (hotel: NormalizedHotel) => {
    const stayNights = nightsBetween(query.checkIn, query.checkOut) || 1;
    const perNight = hotel.pricePerNight ?? hotel.price;
    const hasLiveRate = perNight != null && Number.isFinite(Number(perNight)) && Number(perNight) > 0;
    // Live inventory rates are not yet bookable online — charge a confirmation deposit.
    const roomPrice = hasLiveRate
      ? Math.round(Number(perNight) * stayNights)
      : HOTEL_BOOKING_DEPOSIT_INR;
    const taxes = hasLiveRate ? Math.round(roomPrice * 0.12) : 0;
    const booking: NonNullable<SelectedHotelBooking> = {
      id: hotel.placeId || hotel.id,
      placeId: hotel.placeId || hotel.id,
      name: hotel.name,
      location: hotel.address || [hotel.city, hotel.country].filter(Boolean).join(", ") || "Stay",
      roomType: "Standard Room",
      checkIn: query.checkIn,
      checkOut: query.checkOut,
      guests: query.guests,
      nights: stayNights,
      roomPrice: hasLiveRate ? roomPrice : HOTEL_BOOKING_DEPOSIT_INR,
      taxes,
      totalPrice: hasLiveRate ? roomPrice + taxes : HOTEL_BOOKING_DEPOSIT_INR,
      isDeposit: true,
    };
    startHotelBooking(booking, query.guests);
    navigate("/booking/traveller-details");
  };

  const searchFromRecent = (dest: SelectedHotelDestination) => {
    const p = new URLSearchParams({
      destination: dest.description || dest.mainText,
      placeId: dest.placeId,
      checkIn: query.checkIn,
      checkOut: query.checkOut,
      guests: String(query.guests),
      rooms: String(query.rooms),
    });
    if (dest.latitude != null) p.set("lat", String(dest.latitude));
    if (dest.longitude != null) p.set("lng", String(dest.longitude));
    if (dest.city) p.set("city", dest.city);
    if (dest.country) p.set("country", dest.country);
    navigate(`/hotels/search?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <SEO
        title={
          query.destination
            ? `Hotels in ${formatLabel(query.destination)} | IPNIA`
            : "Book Hotels Worldwide | IPNIA"
        }
        description={`Discover hotels with IPNIA. Search ${cityLabel}, compare ratings and enquire with trusted travel support.`}
        path="/hotels/search"
        keywords={`hotels ${cityLabel}, IPNIA hotel booking`}
        image="/assets/destinations/hotel-luxury-1.jpg"
      />
      <BookingNav />

      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/assets/destinations/hotel-luxury-1.jpg"
            alt="Book beautiful hotel stays with IPNIA"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07111f] via-[#07111f]/85 to-[#07111f]/40" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#d4a853]">
              <ConciergeBell className="h-3.5 w-3.5" /> Hotels by IPNIA
            </p>
            <h1 className="mt-4 text-4xl font-bold capitalize md:text-6xl">
              {hasSearch ? `Stays in ${cityLabel}` : "Stay beautifully. Anywhere."}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/75">
              {hasSearch
                ? `${query.checkIn} → ${query.checkOut} · ${query.guests} guests · ${query.rooms} room${query.rooms > 1 ? "s" : ""}`
                : "Search live hotel listings powered by Google Places — rich details, maps and guest ratings."}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              {[
                "Live lodging results with photos & reviews",
                "Maps, contact details and property types",
                "IPNIA support for enquiries and trip planning",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#d4a853]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div id="hotel-search-form">
            <BookingSearchCard defaultMode="hotels" />
          </div>
        </div>
      </section>

      <section className="border-y border-[#d4a853]/20 bg-[#07111f]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: ShieldCheck, text: "Trusted stay partners" },
            { icon: Sparkles, text: "Curated luxury & comfort" },
            { icon: Wifi, text: "Modern amenities" },
            { icon: Coffee, text: "Breakfast & guest perks*" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-sm text-white/80">
              <item.icon className="h-4 w-4 text-[#d4a853]" />
              {item.text}
            </div>
          ))}
        </div>
      </section>

      <main className="pb-24">
        {!hasSearch && (
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold md:text-4xl">Stay your way</h2>
            <p className="mt-2 text-white/60">
              Browse by mood — then search any destination worldwide via Google Places.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stayCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={scrollToHotelSearch}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#d4a853]/25 text-left"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <h3 className="text-2xl font-bold">{cat.title}</h3>
                    <p className="mt-1 text-sm text-white/75">{cat.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {hasSearch && (
          <section className="bg-slate-100 py-10 text-slate-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-[#d4a853]">Your search</p>
                <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
                  <p>
                    <span className="text-slate-500">Destination:</span>{" "}
                    <span className="font-semibold capitalize">{cityLabel}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">Check-in:</span> {query.checkIn}
                  </p>
                  <p>
                    <span className="text-slate-500">Check-out:</span> {query.checkOut}
                  </p>
                  {nights != null && (
                    <p>
                      <span className="text-slate-500">Nights:</span> {nights}
                    </p>
                  )}
                  <p>
                    <span className="text-slate-500">Guests:</span> {query.guests}
                  </p>
                  <p>
                    <span className="text-slate-500">Rooms:</span> {query.rooms}
                  </p>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Edit your search using the form above — results update automatically.
                </p>
              </div>

              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Available stays</h2>
                  <p className="mt-1 text-slate-600">{resultCountLabel}</p>
                </div>
              </div>

              {!loading && results.length > 0 && (
                <div className="mb-6">
                  <HotelFiltersBar
                    filters={filters}
                    onChange={setFilters}
                    propertyTypes={propertyTypes}
                    amenities={amenities}
                    statuses={statuses}
                  />
                </div>
              )}

              <div>
                {loading ? (
                  <div className="space-y-5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[320px_1fr]"
                      >
                        <div className="aspect-[16/10] animate-pulse bg-slate-200 md:aspect-auto md:min-h-[220px]" />
                        <div className="space-y-3 p-5">
                          <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200" />
                          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                          <div className="h-16 animate-pulse rounded bg-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error && results.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <p className="text-lg font-semibold text-slate-900">{error}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Try another destination or dates, then search again.
                    </p>
                    <Button
                      type="button"
                      className="mt-4 bg-[#d4a853] text-[#0a1628] hover:bg-[#e0b96a]"
                      onClick={scrollToHotelSearch}
                    >
                      Modify Search
                    </Button>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <p className="text-lg font-semibold text-slate-900">
                      No hotels found for this destination and dates.
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Modify destination, dates, guests, or filters and search again.
                    </p>
                    <Button
                      type="button"
                      className="mt-4 bg-[#d4a853] text-[#0a1628] hover:bg-[#e0b96a]"
                      onClick={scrollToHotelSearch}
                    >
                      Modify Search
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filtered.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        onViewDetails={() => {
                          setSelected(hotel);
                          setDetailsOpen(true);
                        }}
                        onSelect={() => goBookHotel(hotel)}
                      />
                    ))}
                    {hasMore && nextPageToken && (
                      <div className="flex justify-center pt-2">
                        <Button
                          type="button"
                          disabled={loadingMore}
                          className="bg-[#0a1628] text-white hover:bg-[#13233d]"
                          onClick={loadMore}
                        >
                          {loadingMore ? "Loading more hotels…" : "Load more hotels"}
                        </Button>
                      </div>
                    )}
                    {error && results.length > 0 && (
                      <p className="text-center text-sm text-red-600">{error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">Popular destinations</h2>
          <p className="mt-2 text-white/60">
            {recentDestinations.length
              ? "Based on your recent Google Places searches — search any city worldwide above."
              : "Search any city, region or country worldwide with Google Places — your recent picks will appear here."}
          </p>
          {recentDestinations.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentDestinations.slice(0, 8).map((dest) => (
                <button
                  key={dest.placeId}
                  type="button"
                  onClick={() => searchFromRecent(dest)}
                  className="rounded-2xl border border-white/10 bg-[#0c1a2e] p-5 text-left transition hover:border-[#d4a853]/40 hover:bg-[#102038]"
                >
                  <MapPin className="h-5 w-5 text-[#d4a853]" />
                  <p className="mt-3 text-lg font-bold">{dest.mainText || dest.description}</p>
                  <p className="mt-1 text-sm text-white/55">
                    {dest.secondaryText ||
                      [dest.city, dest.region, dest.country].filter(Boolean).join(", ") ||
                      dest.description}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#d4a853]/30 bg-[#0c1a2e]/60 px-6 py-10 text-center">
              <p className="text-white/70">No recent destinations yet.</p>
              <Button
                type="button"
                className="mt-4 bg-[#d4a853] text-[#0a1628] hover:bg-[#e0b96a]"
                onClick={scrollToHotelSearch}
              >
                Search destinations worldwide
              </Button>
            </div>
          )}
        </section>

        <WhyBookWithUs />

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#d4a853]/40 bg-gradient-to-br from-[#0c1a2e] to-[#07111f] px-8 py-12 md:flex md:items-center md:justify-between md:gap-8 md:px-12">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Need a stay planned for you?</h2>
              <p className="mt-3 max-w-xl text-white/65">
                Share your destination, dates and budget — IPNIA will help shortlist hotels and
                coordinate the rest of your journey.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0 md:flex-col">
              <Button asChild className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
                <Link to="/contact">
                  Talk to an Expert <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#d4a853]/40 bg-transparent text-white hover:bg-[#d4a853]/10 hover:text-white"
              >
                <Link to="/travel-ecosystem">Explore Travel Ecosystem</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <HotelDetailsModal
        hotel={selected}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onSelect={() => selected && goBookHotel(selected)}
      />
      <SiteFooter />
      <StickyCTA label="Enquire About Stays" to="/contact" />
    </div>
  );
};

export default HotelSearch;
