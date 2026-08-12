import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Coffee,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Wifi,
  ConciergeBell,
} from "lucide-react";
import { BookingNav } from "@/components/layout/BookingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BookingSearchCard } from "@/components/booking/BookingSearchCard";
import SEO from "@/components/SEO";
import StickyCTA from "@/components/StickyCTA";
import { WhyBookWithUs } from "@/components/WhyBookWithUs";
import { Button } from "@/components/ui/button";
import { Hotel, hotelDestinations, hotels, stayCategories } from "@/data/hotels";
import { bookingApi } from "@/services/bookingApi";

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

const HotelSearch = () => {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Hotel[]>([]);
  const [sort, setSort] = useState<"recommended" | "price" | "rating">("recommended");
  const defaults = useMemo(() => defaultDates(), []);

  const query = useMemo(
    () => ({
      destination: params.get("destination") || "",
      checkIn: params.get("checkIn") || defaults.checkIn,
      checkOut: params.get("checkOut") || defaults.checkOut,
      guests: Number(params.get("guests") || 2),
      rooms: Number(params.get("rooms") || 1),
    }),
    [params, defaults]
  );

  const hasSearch = Boolean(params.get("destination") || params.get("checkIn"));
  const cityLabel = query.destination ? formatLabel(query.destination) : "your next stay";

  useEffect(() => {
    let active = true;
    setLoading(true);
    bookingApi.searchHotels(query).then((list) => {
      if (!active) return;
      setResults(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [query]);

  const sortedResults = useMemo(() => {
    const list = [...results];
    if (sort === "price") list.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [results, sort]);

  const featuredCities = hotelDestinations.filter((d) => d.type === "city" && d.image);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <SEO
        title={
          query.destination
            ? `Hotels in ${formatLabel(query.destination)} | IPNIA`
            : "Book Hotels Worldwide | IPNIA"
        }
        description={`Discover luxury hotels, beach resorts and city stays with IPNIA. Search ${cityLabel}, compare ratings and book with trusted travel support.`}
        path="/hotels/search"
        keywords={`hotels ${cityLabel}, IPNIA hotel booking, luxury stays, beach resorts`}
        image="/assets/destinations/hotel-luxury-1.jpg"
      />
      <BookingNav />

      {/* Hero */}
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
                : "Luxury hotels, beach resorts and city escapes — curated with IPNIA travel support."}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              {[
                "Handpicked stays across India & global cities",
                "Flexible dates and guest-friendly options",
                "Support beyond booking — journeys, transfers & more",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#d4a853]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <BookingSearchCard defaultMode="hotels" />
        </div>
      </section>

      {/* Trust strip */}
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
        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">Stay your way</h2>
          <p className="mt-2 text-white/60">Browse by mood — from heritage palaces to beach mornings.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stayCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/hotels/search?destination=${cat.id === "beach" ? "goa" : cat.id === "heritage" ? "mumbai" : cat.id === "business" ? "new-delhi" : "dubai"}&checkIn=${query.checkIn}&checkOut=${query.checkOut}&guests=${query.guests}&rooms=${query.rooms}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#d4a853]/25"
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
              </Link>
            ))}
          </div>
        </section>

        {/* Results */}
        <section className="bg-[#07111f] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">
                  {hasSearch ? "Available stays" : "Featured hotels"}
                </h2>
                <p className="mt-2 text-white/60">
                  {loading
                    ? "Searching hotels…"
                    : `${sortedResults.length} stay${sortedResults.length === 1 ? "" : "s"} to explore`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["recommended", "Recommended"],
                    ["price", "Price"],
                    ["rating", "Rating"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSort(value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      sort === value
                        ? "bg-[#d4a853] text-[#0a1628]"
                        : "border border-white/15 text-white/70 hover:border-[#d4a853]/40"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 animate-pulse rounded-2xl bg-white/5" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedResults.map((hotel) => (
                  <article
                    key={hotel.id}
                    className="group overflow-hidden rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e] transition-all hover:-translate-y-1 hover:border-[#d4a853]/55 hover:shadow-xl hover:shadow-[#d4a853]/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-[#0a1628]/85 px-3 py-1 text-xs font-semibold text-[#d4a853] backdrop-blur">
                        {hotel.tag}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold leading-tight">{hotel.name}</h3>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#d4a853] px-2 py-0.5 text-xs font-bold text-[#0a1628]">
                          <Star className="h-3 w-3" /> {hotel.rating}
                        </span>
                      </div>
                      <p className="mt-2 flex items-center gap-1 text-sm text-white/60">
                        <MapPin className="h-3.5 w-3.5" /> {hotel.location}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-white/65">{hotel.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {hotel.amenities.slice(0, 3).map((a) => (
                          <span
                            key={a}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                        <div>
                          <p className="text-xs text-white/45">{hotel.reviews.toLocaleString()} reviews</p>
                          <p className="text-sm text-white/55">Starting from</p>
                          <p className="text-2xl font-bold text-[#d4a853]">
                            ₹ {hotel.priceFrom.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <Button
                          asChild
                          className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
                        >
                          <Link to="/contact">Enquire</Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Cities */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">Popular hotel cities</h2>
          <p className="mt-2 text-white/60">Jump into a destination and start planning your stay.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCities.map((city) => (
              <Link
                key={city.id}
                to={`/hotels/search?destination=${city.id}&checkIn=${query.checkIn}&checkOut=${query.checkOut}&guests=2&rooms=1`}
                className="group relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/10"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <p className="text-xl font-bold">{city.name}</p>
                  <p className="text-xs text-white/70">{city.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <WhyBookWithUs />

        {/* All hotels teaser when filtered */}
        {hasSearch && results.length < hotels.length && (
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold">More stays travelers love</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hotels
                .filter((h) => !results.some((r) => r.id === h.id))
                .slice(0, 4)
                .map((hotel) => (
                  <Link
                    key={hotel.id}
                    to={`/hotels/search?destination=${hotel.city}&checkIn=${query.checkIn}&checkOut=${query.checkOut}&guests=${query.guests}&rooms=${query.rooms}`}
                    className="overflow-hidden rounded-xl border border-white/10 bg-[#0c1a2e]"
                  >
                    <div className="aspect-[16/10]">
                      <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold">{hotel.name}</p>
                      <p className="text-xs text-white/55">{hotel.location}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* CTA */}
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

      <SiteFooter />
      <StickyCTA label="Enquire About Stays" to="/contact" />
    </div>
  );
};

export default HotelSearch;
