import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Factory,
  Handshake,
  Plane,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import SEO from "@/components/SEO";
import StickyCTA from "@/components/StickyCTA";
import { Button } from "@/components/ui/button";

const services = [
  "China Business Tours",
  "Canton Fair",
  "Factory Visits",
  "Supplier Meetings",
  "Product Sourcing",
  "Supplier Verification",
  "Business Delegations",
  "Business Networking",
  "Visa Assistance",
  "Hotel & Transportation",
  "Interpreter Support",
];

/** Full promotional creative — never cropped, never overlaid */
function CreativeFrame({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#d4a853]/35 bg-[#07111f] shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="mx-auto block h-auto w-full max-w-full object-contain"
      />
    </div>
  );
}

const BusinessTravel = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${window.location.origin}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Business Travel",
          item: `${window.location.origin}/business-travel`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "China Business Travel",
      provider: { "@type": "Organization", name: "IPNIA" },
      description:
        "China business tours, Canton Fair assistance, factory visits, supplier verification and sourcing support for Indian entrepreneurs.",
      areaServed: ["India", "China", "USA"],
    },
  ];

  return (
    <PageShell>
      <SEO
        title="China Business Travel & Canton Fair Tours | IPNIA"
        description="IPNIA China business travel for Indian entrepreneurs — Canton Fair 2026, factory visits, supplier verification, product sourcing, business delegations and USA dropshipping support."
        path="/business-travel"
        keywords="China business travel, Canton Fair 2026, factory visits China, supplier verification, China sourcing India, business delegations"
        image="/assets/ipnia/china-business-tour.jpg"
        jsonLd={jsonLd}
      />

      {/* Hero — copy separate from full creative */}
      <section className="border-b border-[#d4a853]/20 bg-[#07111f]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#d4a853]">
              Business Travel
            </p>
            <h1 className="text-4xl font-bold text-white md:text-6xl">CHINA BUSINESS TRAVEL</h1>
            <p className="mt-4 text-2xl font-semibold text-[#d4a853]">Go Beyond Buying From China.</p>
            <p className="mt-3 text-lg text-white/80">Meet. Verify. Source. Build.</p>
            <p className="mt-5 max-w-xl text-white/65">
              IPNIA is your China sourcing and business travel partner for Indian entrepreneurs,
              importers, exporters and business leaders.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
                <Link to="/contact">
                  Book a Business Tour <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#d4a853]/50 bg-transparent text-white hover:bg-[#d4a853]/10 hover:text-white"
              >
                <a href="#canton-fair">Explore Canton Fair 2026</a>
              </Button>
            </div>
          </div>
          <CreativeFrame
            src="/assets/ipnia/china-business-tour.jpg"
            alt="China Business Tour 2026 — IPNIA promotional creative"
          />
        </div>
      </section>

      {/* Services strip */}
      <section className="border-b border-[#d4a853]/25 bg-[#0a1628]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Complete business coordination</h2>
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-[#d4a853]/30 bg-[#0c1a2e] px-3 py-1.5 text-xs font-medium text-white/85"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* China Business Tours */}
      <section
        id="china-business-tours"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4a853]">
              China Business Tours
            </p>
            <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">
              Structured tours built for outcomes
            </h2>
            <p className="mt-4 text-white/65">
              From itinerary design to supplier meetings, IPNIA coordinates China business tours so
              you focus on negotiation, quality and partnerships — not logistics.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/75">
              {[
                "7 nights / 8 days and shorter focused itineraries",
                "Trade fair access with curated factory visits",
                "Interpreter, hotel and local transport support",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#d4a853]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-[#d4a853]/30 bg-[#0c1a2e] p-5">
              <p className="text-sm font-semibold text-[#d4a853]">Tour focus</p>
              <p className="mt-2 text-sm text-white/75">
                Visit Canton Fair · Factory Visits · Supplier Meetings · Complete Business
                Coordination
              </p>
            </div>
            <Button asChild className="mt-8 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </div>
          <div className="lg:col-span-7">
            <CreativeFrame
              src="/assets/ipnia/china-factory.jpg"
              alt="China Business Tour collage — Canton Fair, factories and trade"
            />
          </div>
        </div>
      </section>

      {/* Canton Fair */}
      <section id="canton-fair" className="scroll-mt-24 bg-[#07111f] py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <CreativeFrame
            src="/assets/ipnia/canton-fair-2026.jpg"
            alt="Canton Fair 2026 China Business Trip with IPNIA"
          />
          <div className="flex flex-col justify-center rounded-2xl border border-[#d4a853]/30 bg-[#0c1a2e] p-8 lg:p-10">
            <Building2 className="mb-4 h-8 w-8 text-[#d4a853]" />
            <h2 className="text-4xl font-bold text-white">Canton Fair 2026</h2>
            <p className="mt-4 text-white/65">
              Access the world&apos;s largest trade platform with IPNIA assistance — planning,
              meetings and on-ground coordination so your fair visit converts into real sourcing
              opportunities.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/75">
              <li>• Fair registration and visit planning support</li>
              <li>• Supplier shortlisting before you arrive</li>
              <li>• Meeting management and interpreter support</li>
            </ul>
            <Button
              asChild
              className="mt-8 w-fit bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
            >
              <Link to="/contact">Talk to an Expert</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Factory Visits */}
      <section
        id="factory-visits"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mb-8 max-w-2xl">
          <div className="mb-3 flex items-center gap-3 text-[#d4a853]">
            <Factory className="h-7 w-7" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em]">Factory Visits</p>
          </div>
          <h2 className="text-4xl font-bold text-white">See production before you commit</h2>
          <p className="mt-4 text-white/65">
            Walk production lines, assess quality systems and meet the teams behind the catalog — so
            sourcing decisions are grounded in reality.
          </p>
        </div>
        <CreativeFrame
          src="/assets/ipnia/china-factory.jpg"
          alt="Factory visits and China business tour visual"
          className="max-w-4xl"
        />
      </section>

      {/* Supplier Verification */}
      <section id="supplier-verification" className="scroll-mt-24 bg-[#07111f] py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-[#d4a853]/30 bg-[#0c1a2e] p-8 lg:order-2 lg:p-10">
            <ShieldCheck className="mb-3 h-7 w-7 text-[#d4a853]" />
            <h2 className="text-3xl font-bold text-white md:text-4xl">Supplier Verification</h2>
            <p className="mt-4 text-white/65">
              Don&apos;t just buy from China. Know your supplier. IPNIA helps Indian businesses move
              from marketplace listings to verified on-site meetings.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/75">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#d4a853]" /> Factory verified
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#d4a853]" /> Quality checked
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#d4a853]" /> On-site meetings
              </li>
            </ul>
            <Button asChild className="mt-8 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
              <Link to="/contact">Request Verification Support</Link>
            </Button>
          </div>
          <div className="lg:order-1">
            <CreativeFrame
              src="/assets/ipnia/supplier-verification.jpg"
              alt="Know your supplier — online search vs real factory"
            />
          </div>
        </div>
      </section>

      {/* Product Sourcing */}
      <section
        id="product-sourcing"
        className="scroll-mt-24 border-y border-[#d4a853]/20 bg-[#0a1628] py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4a853]">
                Product Sourcing
              </p>
              <h2 className="mt-2 text-4xl font-bold text-white">Source with clarity</h2>
            </div>
            <p className="max-w-md text-sm text-white/60">
              From category research to sample review, IPNIA supports product sourcing journeys that
              connect Indian demand with Chinese manufacturing capacity.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Category Mapping",
                text: "Identify suppliers aligned to your product brief.",
              },
              {
                icon: Handshake,
                title: "Supplier Meetings",
                text: "Structured conversations with decision makers.",
              },
              {
                icon: Plane,
                title: "Travel Coordination",
                text: "Visa, hotels, transport and interpreters handled.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e] p-6"
              >
                <card.icon className="mb-4 h-6 w-6 text-[#d4a853]" />
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-white/60">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Delegations */}
      <section
        id="business-delegations"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <Users className="mb-4 h-8 w-8 text-[#d4a853]" />
            <h2 className="text-4xl font-bold text-white">Business Delegations</h2>
            <p className="mt-4 text-white/65">
              Join curated delegations designed for Indian business minds — real access, real
              connections and real commercial outcomes.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { stat: "500+", label: "Verified Suppliers" },
                { stat: "1000+", label: "Business Connections" },
                { stat: "VIP", label: "Canton Fair Access" },
                { stat: "End-to-End", label: "Travel & Visa Support" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#d4a853]/30 bg-[#0c1a2e] p-4"
                >
                  <p className="text-2xl font-bold text-[#d4a853]">{item.stat}</p>
                  <p className="text-sm text-white/70">{item.label}</p>
                </div>
              ))}
            </div>
            <Button asChild className="mt-8 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
              <Link to="/contact">Join the Delegation</Link>
            </Button>
          </div>
          <CreativeFrame
            src="/assets/ipnia/business-delegation.jpg"
            alt="IPNIA business delegations — numbers and outcomes"
          />
        </div>
      </section>

      {/* USA Dropshipping */}
      <section id="usa-dropshipping" className="scroll-mt-24 bg-[#07111f] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-4xl font-bold text-white">
              USA Dropshipping / China-to-USA Sourcing
            </h2>
            <p className="mt-4 text-lg text-[#d4a853]">Your product. Made in China. Sold in America.</p>
            <p className="mt-3 text-white/65">
              Build your brand without holding inventory. IPNIA helps coordinate China sourcing
              journeys aligned to USA market fulfilment models — with clear guidance and travel
              support for founders and operators.
            </p>
            <Button asChild className="mt-8 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
              <Link to="/contact">
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <CreativeFrame
              src="/assets/ipnia/china-usa-dropshipping.jpg"
              alt="IPNIA USA Dropshipping Program"
            />
            <CreativeFrame
              src="/assets/ipnia/china-business-networking.jpg"
              alt="China to USA sourcing journey"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#d4a853]/40 bg-[#0c1a2e] px-8 py-12 text-center md:px-16">
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            Ready to source with confidence?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/65">
            Tell us your category, timeline and goals — we&apos;ll propose a China business travel
            plan around Canton Fair, factories and verified meetings.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
            >
              <Link to="/contact">Book a Business Tour</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#d4a853]/50 bg-transparent text-white hover:bg-[#d4a853]/10 hover:text-white"
            >
              <a href="tel:01145534440">Call 01145534440</a>
            </Button>
          </div>
        </div>
      </section>

      <StickyCTA label="Book a Business Tour" to="/contact" />
    </PageShell>
  );
};

export default BusinessTravel;
