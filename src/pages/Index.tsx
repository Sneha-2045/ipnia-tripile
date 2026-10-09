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

const cityImage: Record<string, string> = {
  DEL: "/assets/destinations/dest-delhi.jpg",
  BOM: "/assets/destinations/dest-mumbai.jpg",
  BLR: "/assets/destinations/dest-mumbai.jpg",
  DXB: "/assets/destinations/dest-dubai.jpg",
  LHR: "/assets/destinations/dest-london.jpg",
  SIN: "/assets/destinations/dest-singapore.jpg",
  JFK: "/assets/destinations/dest-newyork.jpg",
};

const routes = [
  { from: "DEL", to: "BOM", label: "Delhi → Mumbai", price: 5908 },
  { from: "BOM", to: "DEL", label: "Mumbai → Delhi", price: 6120 },
  { from: "DEL", to: "BLR", label: "Delhi → Bangalore", price: 6450 },
  { from: "BOM", to: "BLR", label: "Mumbai → Bangalore", price: 5380 },
  { from: "DEL", to: "DXB", label: "Delhi → Dubai", price: 14890 },
  { from: "BOM", to: "DXB", label: "Mumbai → Dubai", price: 13950 },
];

const verticals = [
  {
    title: "Business Travel",
    href: "/business-travel",
    icon: Briefcase,
    text: "China tours, Canton Fair & sourcing.",
    image: "/assets/destinations/dest-singapore.jpg",
  },
  {
    title: "Education Travel",
    href: "/education-travel",
    icon: GraduationCap,
    text: "Learn beyond the classroom.",
    image: "/assets/destinations/dest-london.jpg",
  },
  {
    title: "Experience Travel",
    href: "/experience-travel",
    icon: Compass,
    text: "Discover the world differently.",
    image: "/assets/destinations/dest-dubai.jpg",
  },
  {
    title: "Pilgrim Travel",
    href: "/pilgrim-travel",
    icon: Landmark,
    text: "Journeys of faith and devotion.",
    image: "/assets/destinations/dest-delhi.jpg",
  },
  {
    title: "Forex",
    href: "/forex",
    icon: Wallet,
    text: "Travel money made simple.",
    image: "/assets/destinations/dest-mumbai.jpg",
  },
];

const Index = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const departure = tomorrow.toISOString().slice(0, 10);

  return (
    <div className="ipnia-page">
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

      <section id="booking" className="relative min-h-[92vh] overflow-hidden pt-[4.25rem]">
        <div className="absolute inset-0">
          <img
            src="/assets/destinations/hero-travel.jpg"
            alt="Your journey starts with IPNIA"
            className="ken-burns h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/86 via-white/66 to-[#edf3f8]/38" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(226,181,82,0.10),transparent_55%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f4f7fb] to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.15fr] lg:items-center lg:gap-12 lg:px-8 lg:py-24">
          <div className="fade-in-up">
            <p className="ipnia-eyebrow">Flights · Hotels · Travel Services</p>
            <h1 className="mt-5 font-heading text-5xl font-bold leading-[1.05] text-[#17324d] md:text-6xl lg:text-7xl">
              Your Journey Starts Here.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[#324b65] md:text-xl">
              Flights, hotels and travel services — all in one place.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#40566e] md:text-base">
              Book with IPNIA and unlock business, education, experience, pilgrimage and forex
              support whenever you need it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs text-[#30465d]">
              {[
                "Domestic & international",
                "Secure checkout",
                "Expert travel support",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/70 bg-white/75 px-3 py-1.5 shadow-sm backdrop-blur transition hover:border-[#f0ca72]/60 hover:text-[#805d12]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="fade-in-up stagger-2">
            <BookingSearchCard />
          </div>
        </div>
      </section>

      <section className="travel-bg-section relative border-y border-[#e2b552]/15 py-10">
        <div className="travel-bg-media">
          <img src="/assets/destinations/dest-dubai.jpg" alt="" aria-hidden className="ken-burns" />
        </div>
        <div className="travel-bg-overlay" />
        <div className="ipnia-section relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {[
            "Multiple travel services",
            "Trusted travel support",
            "Competitive prices",
            "Secure booking",
          ].map((item) => (
            <div
              key={item}
              className="travel-hover flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0c1a2e]/70 px-4 py-3.5 text-sm text-white/85 backdrop-blur-md"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e2b552]/15">
                <ShieldCheck className="h-4 w-4 text-[#e2b552]" />
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="ipnia-section reveal-on-scroll py-20">
        <div className="mb-10 max-w-2xl">
          <p className="ipnia-eyebrow">Explore</p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-white md:text-5xl">
            Popular Destinations
          </h2>
          <p className="mt-3 ipnia-subcopy">Quick-start flight searches to cities travelers love.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((city) => (
            <Link
              key={city.code}
              to={`/flights/search?from=DEL&to=${city.code}&departure=${departure}&travellers=1&cabin=economy&tripType=oneway`}
              className="travel-dest-card group aspect-[16/10]"
            >
              <img
                src={city.image}
                alt={city.name}
                loading="lazy"
                className="img-zoom h-full w-full object-cover"
              />
              <div className="travel-shine" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/82 via-[#071426]/18 to-transparent transition duration-500 group-hover:from-[#071426]/88" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <p className="font-heading text-2xl font-bold text-white md:text-3xl">{city.name}</p>
                  <p className="mt-1 text-xs text-white/80 opacity-0 transition group-hover:opacity-100">
                    Search flights from Delhi
                  </p>
                </div>
                <span className="translate-y-2 rounded-full bg-[#e2b552] px-2.5 py-1 text-[11px] font-bold text-[#0a1628] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {city.code}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="travel-bg-section reveal-on-scroll relative py-20">
        <div className="travel-bg-media">
          <img src="/assets/destinations/dest-singapore.jpg" alt="" aria-hidden className="ken-burns" />
        </div>
        <div className="travel-bg-overlay" />
        <div className="ipnia-section relative z-10">
          <div className="mb-10 max-w-2xl">
            <p className="ipnia-eyebrow">Flights</p>
            <h2 className="mt-3 font-heading text-4xl font-bold text-white md:text-5xl">
              Popular Flight Routes
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <Link
                key={route.label}
                to={`/flights/search?from=${route.from}&to=${route.to}&departure=${departure}&travellers=1&cabin=economy&tripType=oneway`}
                className="travel-route-card group"
              >
                <img
                  src={cityImage[route.to] || cityImage[route.from]}
                  alt=""
                  className="img-zoom absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/88 via-[#10233a]/68 to-[#10233a]/22" />
                <div className="relative z-10 flex h-full flex-col justify-between p-6">
                  <div className="flex items-center gap-2 text-[#e2b552]">
                    <span className="route-plane flex h-9 w-9 items-center justify-center rounded-full bg-[#e2b552]/15">
                      <Plane className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Route</span>
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-bold text-white">{route.label}</p>
                    <p className="mt-3 text-sm text-white/75">Starting from</p>
                    <p className="text-2xl font-bold text-[#e2b552]">
                      ₹ {route.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ipnia-section reveal-on-scroll py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="ipnia-eyebrow">Stays</p>
            <h2 className="mt-3 font-heading text-4xl font-bold text-white md:text-5xl">Popular Hotels</h2>
            <p className="mt-3 ipnia-subcopy">Handpicked stays with IPNIA travel support.</p>
          </div>
          <Button asChild variant="outline" className="ipnia-btn-navy hidden rounded-full sm:inline-flex">
            <Link to="/hotels/search">View all</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hotels.slice(0, 3).map((hotel) => (
            <article
              key={hotel.id}
              className="travel-hover group overflow-hidden rounded-2xl border border-white/15 bg-[#142a44]/95 shadow-travel"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  loading="lazy"
                  className="img-zoom h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-heading text-2xl font-bold text-white">{hotel.name}</h3>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e2b552] px-2.5 py-1 text-xs font-bold text-[#0a1628]">
                    <Star className="h-3 w-3" /> {hotel.rating}
                  </span>
                </div>
                <p className="text-sm text-white/80">{hotel.location}</p>
                <p className="mt-4 text-sm text-white/75">Starting from</p>
                <p className="text-2xl font-bold text-[#e2b552]">
                  ₹ {hotel.priceFrom.toLocaleString("en-IN")}
                </p>
                <Button asChild className="ipnia-btn-gold mt-5 w-full rounded-xl">
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

      <section className="ipnia-section reveal-on-scroll py-20">
        <div className="mb-10 max-w-2xl">
          <p className="ipnia-eyebrow">Ecosystem</p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-white md:text-5xl">Explore IPNIA</h2>
          <p className="mt-3 ipnia-subcopy">Beyond booking — purpose-led travel verticals.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v) => (
            <Link
              key={v.href}
              to={v.href}
              className="travel-dest-card group relative min-h-[240px]"
            >
              <img src={v.image} alt="" className="img-zoom absolute inset-0 h-full w-full object-cover" />
              <div className="travel-shine" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/90 via-[#10233a]/60 to-[#10233a]/12 transition group-hover:via-[#10233a]/48" />
              <div className="relative z-10 flex h-full min-h-[240px] flex-col justify-end p-6">
                <v.icon className="mb-3 h-6 w-6 text-[#e2b552] transition group-hover:scale-110" />
                <h3 className="font-heading text-2xl font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-white/85">{v.text}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-[#e2b552]">
                  Explore{" "}
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="ipnia-section reveal-on-scroll pb-24">
        <div className="ecosystem-cta travel-hover group relative overflow-hidden rounded-[1.75rem] border border-[#e2b552]/30 px-8 py-14 md:px-14 md:py-16">
          <div className="absolute inset-0">
            <img
              src="/assets/destinations/hotel-beach.jpg"
              alt=""
              className="img-zoom h-full w-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1d32]/90 via-[#10243b]/78 to-[#10243b]/45" />
          </div>
          <div className="relative max-w-2xl">
            <p className="ipnia-eyebrow">More Than Just Booking</p>
            <h2 className="mt-4 font-heading text-4xl font-bold text-white md:text-5xl">
              Discover the complete IPNIA travel ecosystem
            </h2>
            <p className="mt-4 text-white/85 md:text-lg">
              IPNIA connects business, education, experiences, pilgrimage and forex services in one
              complete travel ecosystem.
            </p>
            <Button asChild size="lg" className="ipnia-btn-gold mt-8 rounded-full px-8">
              <Link to="/travel-ecosystem">
                Explore the IPNIA Travel Ecosystem <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
      <StickyCTA label="Plan Your Journey" to="/contact" />
    </div>
  );
};

export default Index;
