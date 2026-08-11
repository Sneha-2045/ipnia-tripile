import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Compass,
  Landmark,
  Wallet,
  Globe2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import SEO from "@/components/SEO";
import StickyCTA from "@/components/StickyCTA";
import SignUpSection from "@/components/SignUpSection";
import { Button } from "@/components/ui/button";

const segments = [
  {
    title: "Business Travel",
    description: "Travel with a business purpose.",
    cta: "Explore Business Travel",
    href: "/business-travel",
    icon: Briefcase,
    image: "/assets/ipnia/china-business-tour.jpg",
  },
  {
    title: "Education Travel",
    description: "Learn beyond the classroom.",
    cta: "Explore Education Travel",
    href: "/education-travel",
    icon: GraduationCap,
    image: "/assets/ipnia/education-travel.jpg",
  },
  {
    title: "Experience Travel",
    description: "Discover the world differently.",
    cta: "Explore Experiences",
    href: "/experience-travel",
    icon: Compass,
    image: "/assets/ipnia/experience-travel.jpg",
  },
  {
    title: "Pilgrim Travel",
    description: "Journeys of faith and devotion.",
    cta: "Explore Pilgrimage",
    href: "/pilgrim-travel",
    icon: Landmark,
    image: "/assets/ipnia/pilgrim-travel.jpg",
  },
  {
    title: "Forex Travel",
    description: "Travel money made simple.",
    cta: "Explore Forex",
    href: "/forex",
    icon: Wallet,
    image: "/assets/ipnia/forex-travel.jpg",
  },
];

const chinaCreatives = [
  {
    src: "/assets/ipnia/china-business-tour.jpg",
    label: "China Business Tours",
    href: "/business-travel#china-business-tours",
  },
  {
    src: "/assets/ipnia/canton-fair-2026.jpg",
    label: "Canton Fair 2026",
    href: "/business-travel#canton-fair",
  },
  {
    src: "/assets/ipnia/supplier-verification.jpg",
    label: "Supplier Verification",
    href: "/business-travel#supplier-verification",
  },
  {
    src: "/assets/ipnia/business-delegation.jpg",
    label: "Business Delegations",
    href: "/business-travel#business-delegations",
  },
  {
    src: "/assets/ipnia/china-usa-dropshipping.jpg",
    label: "USA Dropshipping",
    href: "/business-travel#usa-dropshipping",
  },
  {
    src: "/assets/ipnia/china-factory.jpg",
    label: "Factory Visits & Sourcing",
    href: "/business-travel#factory-visits",
  },
  {
    src: "/assets/ipnia/china-business-networking.jpg",
    label: "China–USA Trade Journey",
    href: "/business-travel#usa-dropshipping",
  },
];

const Index = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "IPNIA",
      legalName: "Ipnia Services Pvt Ltd",
      url: typeof window !== "undefined" ? window.location.origin : "https://ipnia.com",
      email: "Help@ipnia.com",
      telephone: "01145534440",
      address: {
        "@type": "PostalAddress",
        streetAddress: "A199 Gujranwala Town Part 01",
        addressLocality: "Delhi",
        postalCode: "110009",
        addressCountry: "IN",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "IPNIA",
      url: typeof window !== "undefined" ? window.location.origin : "https://ipnia.com",
      description:
        "IPNIA connects people, businesses, students and travelers with meaningful journeys across business, education, experience, pilgrimage and forex.",
    },
  ];

  return (
    <PageShell>
      <SEO
        title="IPNIA — One Platform. Every Journey."
        description="IPNIA connects people, businesses, students and travelers with meaningful journeys, global experiences and complete travel support across business, education, experience, pilgrimage and forex."
        path="/"
        keywords="IPNIA travel, business travel India, China business tours, education travel, pilgrimage tours, forex travel"
        image="/assets/ipnia/china-business-tour.jpg"
        jsonLd={jsonLd}
      />

      {/* Hero — copy + full creative, no overlay crop */}
      <section className="border-b border-[#d4a853]/20 bg-[#07111f]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#d4a853]">
              India&apos;s Complete Travel Ecosystem
            </p>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white md:text-6xl">
              ONE PLATFORM.
              <br />
              <span className="text-[#d4a853]">EVERY JOURNEY.</span>
            </h1>
            <p className="mt-5 text-lg font-medium text-white/90 md:text-2xl">
              Business. Education. Experience. Pilgrimage. Forex.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              IPNIA connects people, businesses, students and travelers with meaningful journeys,
              global experiences and complete travel support.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#d4a853] px-8 font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
              >
                <Link to="/contact">
                  Plan Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#d4a853]/50 bg-transparent px-8 text-white hover:bg-[#d4a853]/10 hover:text-white"
              >
                <a href="#services">Explore Our Services</a>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#d4a853]/35 bg-[#0a1628]">
            <img
              src="/assets/ipnia/experience-travel.jpg"
              alt="IPNIA — every journey, one platform"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Segment cards */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold text-white md:text-5xl">Five ways to travel with IPNIA</h2>
          <p className="mt-3 text-white/65">
            Choose the journey that matches your purpose — each vertical is designed with dedicated
            expertise, partners and support.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            const wide = index === 0;
            return (
              <Link
                key={segment.href}
                to={segment.href}
                className={`segment-card group ${wide ? "md:col-span-2 xl:col-span-1" : ""}`}
              >
                <div className="mb-5 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-[#07111f]">
                  <img
                    src={segment.image}
                    alt={segment.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="mb-3 flex items-center gap-2 text-[#d4a853]">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Vertical</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{segment.title}</h3>
                <p className="mt-2 text-white/65">{segment.description}</p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#d4a853]">
                  {segment.cta} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[#d4a853]/20 bg-[#07111f]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            {
              icon: Globe2,
              title: "Global Coordination",
              text: "End-to-end planning across borders, fairs, campuses and sacred destinations.",
            },
            {
              icon: ShieldCheck,
              title: "Trusted Partners",
              text: "Verified networks for sourcing, education, hospitality and travel money support.",
            },
            {
              icon: Users,
              title: "Purpose-Led Travel",
              text: "Every vertical is built around outcomes — business, learning, experience or faith.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <item.icon className="mt-1 h-6 w-6 shrink-0 text-[#d4a853]" />
              <div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Business spotlight */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-[#d4a853]/30 bg-[#07111f]">
            <img
              src="/assets/ipnia/canton-fair-2026.jpg"
              alt="China Business Travel with IPNIA"
              loading="lazy"
              className="mx-auto block h-auto w-full object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4a853]">
              Featured Vertical
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">
              Go beyond buying from China.
            </h2>
            <p className="mt-4 text-white/65">
              Meet manufacturers. Verify suppliers. Visit factories. Attend Canton Fair. IPNIA
              coordinates complete China business journeys for Indian entrepreneurs and trade teams.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/75">
              <li>• Canton Fair 2026 assistance</li>
              <li>• Factory visits & supplier verification</li>
              <li>• Business delegations & USA dropshipping support</li>
            </ul>
            <Button
              asChild
              className="mt-8 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
            >
              <Link to="/business-travel">
                Explore Business Travel <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* All China business creatives kept on homepage */}
      <section className="border-t border-[#d4a853]/20 bg-[#07111f] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4a853]">
              Business Travel Gallery
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              China business creatives
            </h2>
            <p className="mt-3 text-white/60">
              Full promotional visuals for tours, Canton Fair, verification, delegations and
              dropshipping — each linked to its Business Travel section.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {chinaCreatives.map((item) => (
              <Link
                key={item.src}
                to={item.href}
                className="group overflow-hidden rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e] transition-all hover:-translate-y-1 hover:border-[#d4a853]/55"
              >
                <div className="bg-[#07111f]">
                  <img
                    src={item.src}
                    alt={item.label}
                    loading="lazy"
                    className="mx-auto block h-auto w-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <p className="font-semibold text-white">{item.label}</p>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#d4a853] transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lead capture — preserve existing SignUpSection */}
      <section id="signup" className="pb-24 md:pb-16">
        <SignUpSection />
      </section>

      <StickyCTA />
    </PageShell>
  );
};

export default Index;
