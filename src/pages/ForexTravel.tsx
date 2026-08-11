import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, Banknote, RefreshCw, Globe2, Wallet, MessageCircle } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import SEO from "@/components/SEO";
import StickyCTA from "@/components/StickyCTA";
import { Button } from "@/components/ui/button";

const offerings = [
  { title: "Forex Cards", icon: CreditCard, text: "Travel card guidance for international trips." },
  { title: "Foreign Currency", icon: Banknote, text: "Support for major travel currencies you may need abroad." },
  { title: "Currency Exchange", icon: RefreshCw, text: "Clear direction on exchanging travel money responsibly." },
  { title: "International Payments", icon: Globe2, text: "Help understanding payment options while travelling." },
  { title: "Travel Money", icon: Wallet, text: "Plan how much to carry across card, cash and backups." },
  { title: "Currency Guidance", icon: MessageCircle, text: "Practical advice before you depart — without hype." },
];

const ForexTravel = () => {
  return (
    <PageShell>
      <SEO
        title="Forex & Travel Money Assistance | IPNIA"
        description="IPNIA Forex Travel helps travelers plan forex cards, foreign currency, exchange and travel money with clear, trustworthy guidance — no unsupported financial claims."
        path="/forex"
        keywords="forex travel India, travel money, forex card assistance, currency exchange travel, foreign currency"
        image="/assets/ipnia/forex-travel.jpg"
      />

      <section className="border-b border-white/10 bg-gradient-to-b from-[#0a1628] to-[#07111f]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
              Forex Travel
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold text-white md:text-6xl">
              TRAVEL THE WORLD.
              <br />
              <span className="text-emerald-300">CARRY YOUR MONEY WITH CONFIDENCE.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/65">
              Practical travel-money assistance for Indian travelers — guidance you can act on before
              you fly.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-white/45">
              IPNIA provides informational assistance and coordination support. Currency rates, product
              availability and eligibility depend on partner providers and applicable regulations.
            </p>
            <Button asChild className="mt-8 bg-emerald-400 font-semibold text-[#0a1628] hover:bg-emerald-300">
              <Link to="/contact">
                Get Forex Assistance <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-emerald-400/30">
            <img
              src="/assets/ipnia/forex-travel.jpg"
              alt="Travel money and forex assistance"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white">What we help with</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-emerald-400/20 bg-white/[0.03] p-6"
            >
              <item.icon className="mb-3 h-6 w-6 text-emerald-300" />
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#07111f] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-white">Three simple steps</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { step: "1", title: "Choose Currency", text: "Tell us your destination and preferred currencies." },
              { step: "2", title: "Get Forex", text: "We guide you through suitable travel-money options." },
              { step: "3", title: "Travel", text: "Leave with a clearer plan for cards, cash and payments." },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-emerald-400/25 bg-[#0c1a2e] p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/40 text-lg font-bold text-emerald-300">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Need travel money guidance?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/60">
          Share your trip details and we&apos;ll help you prepare with confidence.
        </p>
        <Button asChild size="lg" className="mt-8 bg-emerald-400 font-semibold text-[#0a1628] hover:bg-emerald-300">
          <Link to="/contact">Get Forex Assistance</Link>
        </Button>
      </section>

      <StickyCTA label="Get Forex Assistance" to="/contact" />
    </PageShell>
  );
};

export default ForexTravel;
