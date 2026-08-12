import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Compass,
  GraduationCap,
  Landmark,
  Plane,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import { BookingNav } from "@/components/layout/BookingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BookingSearchCard } from "@/components/booking/BookingSearchCard";
import SEO from "@/components/SEO";
import StickyCTA from "@/components/StickyCTA";
import { WhyBookWithUs } from "@/components/WhyBookWithUs";
import { Button } from "@/components/ui/button";
import { hotels } from "@/data/hotels";

const destinations = [
  { name: "New Delhi", image: "/assets/destinations/dest-delhi.jpg", code: "DEL" },
  { name: "Mumbai", image: "/assets/destinations/dest-mumbai.jpg", code: "BOM" },
  { name: "Dubai", image: "/assets/destinations/dest-dubai.jpg", code: "DXB" },
  { name: "London", image: "/assets/destinations/dest-london.jpg", code: "LHR" },
  { name: "Singapore", image: "/assets/destinations/dest-singapore.jpg", code: "SIN" },
  { name: "New York", image: "/assets/destinations/dest-newyork.jpg", code: "JFK" },
];

const routes = [
  { from: "DEL", to: "BOM", label: "Delhi → Mumbai", price: 5908 },
  { from: "BOM", to: "DEL", label: "Mumbai → Delhi", price: 6120 },
  { from: "DEL", to: "BLR", label: "Delhi → Bangalore", price: 6450 },
  { from: "BOM", to: "BLR", label: "Mumbai → Bangalore", price: 5380 },
  { from: "DEL", to: "DXB", label: "Delhi → Dubai", price: 14890 },
  { from: "BOM", to: "DXB", label: "Mumbai → Dubai", price: 13950 },
];

const verticals = [
  { title: "Business Travel", href: "/business-travel", icon: Briefcase, text: "China tours, Canton Fair & sourcing." },
  { title: "Education Travel", href: "/education-travel", icon: GraduationCap, text: "Learn beyond the classroom." },
  { title: "Experience Travel", href: "/experience-travel", icon: Compass, text: "Discover the world differently." },
  { title: "Pilgrim Travel", href: "/pilgrim-travel", icon: Landmark, text: "Journeys of faith and devotion." },
  { title: "Forex", href: "/forex", icon: Wallet, text: "Travel money made simple." },
];

const Index = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const departure = tomorrow.toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <SEO
        title="Book Flights & Hotels | IPNIA Travel"
        description="Book flights, hotels and plan your journey with IPNIA. Search domestic and international routes, compare fares, and explore IPNIA's complete travel ecosystem."
        path="/"
        keywords="IPNIA flights, book hotels India, flight search, hotel booking, travel booking IPNIA"
        image="/assets/destinations/hero-travel.jpg"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "IPNIA",
            url: typeof window !== "undefined" ? window.location.origin : "https://ipnia.com",
            potentialAction: {
              "@type": "SearchAction",
              target: `${typeof window !== "undefined" ? window.location.origin : "https://ipnia.com"}/flights/search?from={from}&to={to}`,
              "query-input": "required name=from",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "IPNIA",
            legalName: "Ipnia Services Pvt Ltd",
            url: typeof window !== "undefined" ? window.location.origin : "https://ipnia.com",
          },
        ]}
      />

      <BookingNav />

      {/* Hero + booking */}
      <section id="booking" className="relative overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/assets/destinations/hero-travel.jpg"
            alt="Your journey starts with IPNIA"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07111f] via-[#07111f]/75 to-[#07111f]/35" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4a853]">
              Flights · Hotels · Travel Services
            </p>
            <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">Your Journey Starts Here.</h1>
            <p className="mt-4 max-w-xl text-lg text-white/75">
              Flights, hotels and travel services — all in one place.
            </p>
            <p className="mt-3 max-w-lg text-sm text-white/55">
              Book with IPNIA and unlock business, education, experience, pilgrimage and forex
              support whenever you need it.
            </p>
          </div>
          <BookingSearchCard />
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-[#d4a853]/20 bg-[#07111f]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            "Multiple travel services",
            "Trusted travel support",
            "Competitive prices",
            "Secure booking",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-white/80">
              <ShieldCheck className="h-4 w-4 text-[#d4a853]" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Popular destinations */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Popular Destinations</h2>
        <p className="mt-2 text-white/60">Quick-start flight searches to cities travelers love.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((city) => (
            <Link
              key={city.code}
              to={`/flights/search?from=DEL&to=${city.code}&departure=${departure}&travellers=1&cabin=economy&tripType=oneway`}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10"
            >
              <img
                src={city.image}
                alt={city.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <p className="absolute bottom-4 left-4 text-xl font-bold text-white">{city.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular routes */}
      <section className="bg-[#07111f] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Popular Flight Routes</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <Link
                key={route.label}
                to={`/flights/search?from=${route.from}&to=${route.to}&departure=${departure}&travellers=1&cabin=economy&tripType=oneway`}
                className="rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e] p-5 transition hover:border-[#d4a853]/55"
              >
                <div className="mb-4 flex items-center gap-2 text-[#d4a853]">
                  <Plane className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Route</span>
                </div>
                <p className="text-lg font-bold text-white">{route.label}</p>
                <p className="mt-3 text-sm text-white/55">Starting from</p>
                <p className="text-2xl font-bold text-[#d4a853]">
                  ₹ {route.price.toLocaleString("en-IN")}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Popular Hotels</h2>
            <p className="mt-2 text-white/60">Handpicked stays with IPNIA travel support.</p>
          </div>
          <Button asChild variant="outline" className="hidden border-[#d4a853]/40 text-white sm:inline-flex">
            <Link to={`/hotels/search?destination=mumbai&checkIn=${departure}&checkOut=${departure}&guests=2&rooms=1`}>
              View all
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {hotels.slice(0, 3).map((hotel) => (
            <article
              key={hotel.id}
              className="overflow-hidden rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e]"
            >
              <div className="aspect-[16/10]">
                <img src={hotel.image} alt={hotel.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-white">{hotel.name}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#d4a853] px-2 py-0.5 text-xs font-bold text-[#0a1628]">
                    <Star className="h-3 w-3" /> {hotel.rating}
                  </span>
                </div>
                <p className="text-sm text-white/60">{hotel.location}</p>
                <p className="mt-3 text-sm text-white/50">Starting from</p>
                <p className="text-xl font-bold text-[#d4a853]">
                  ₹ {hotel.priceFrom.toLocaleString("en-IN")}
                </p>
                <Button asChild className="mt-4 w-full bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
                  <Link
                    to={`/hotels/search?destination=${hotel.city}&checkIn=${departure}&checkOut=${departure}&guests=2&rooms=1`}
                  >
                    View Hotel
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <WhyBookWithUs />

      {/* Explore verticals */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Explore IPNIA</h2>
        <p className="mt-2 text-white/60">Beyond booking — purpose-led travel verticals.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v) => (
            <Link
              key={v.href}
              to={v.href}
              className="rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e] p-5 transition hover:border-[#d4a853]/55"
            >
              <v.icon className="mb-3 h-6 w-6 text-[#d4a853]" />
              <h3 className="text-xl font-bold text-white">{v.title}</h3>
              <p className="mt-2 text-sm text-white/60">{v.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Ecosystem CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#d4a853]/40 bg-gradient-to-br from-[#0c1a2e] to-[#07111f] px-8 py-12 md:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4a853]">
            More Than Just Booking
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">
            Discover the complete IPNIA travel ecosystem
          </h2>
          <p className="mt-4 max-w-2xl text-white/65">
            IPNIA connects business, education, experiences, pilgrimage and forex services in one
            complete travel ecosystem.
          </p>
          <Button asChild size="lg" className="mt-8 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
            <Link to="/travel-ecosystem">
              Explore the IPNIA Travel Ecosystem <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
      <StickyCTA label="Plan Your Journey" to="/contact" />
    </div>
  );
};

export default Index;
