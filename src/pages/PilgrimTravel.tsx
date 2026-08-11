import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, Hotel, Bus, Users, UserRound, Map, Sparkles, HandHeart } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import SEO from "@/components/SEO";
import StickyCTA from "@/components/StickyCTA";
import { Button } from "@/components/ui/button";

const destinations = [
  { name: "Char Dham", note: "Sacred Himalayan circuit" },
  { name: "Ayodhya", note: "Devotional city journeys" },
  { name: "Varanasi", note: "Ganga aarti & spiritual immersion" },
  { name: "Vaishno Devi", note: "Guided hill shrine travel" },
  { name: "Tirupati", note: "Darshan coordination support" },
  { name: "Golden Temple", note: "Amritsar seva & heritage" },
  { name: "Bodh Gaya", note: "Buddhist pilgrimage centre" },
  { name: "Buddhist Circuits", note: "Multi-site mindful routes" },
  { name: "International Pilgrimages", note: "Faith journeys beyond India" },
];

const services = [
  { title: "Complete pilgrimage packages", icon: Sparkles },
  { title: "Hotels", icon: Hotel },
  { title: "Transportation", icon: Bus },
  { title: "Darshan assistance", icon: HandHeart },
  { title: "Group tours", icon: Users },
  { title: "Senior citizen assistance", icon: UserRound },
  { title: "Local guides", icon: Map },
  { title: "Customized itineraries", icon: HeartHandshake },
];

const PilgrimTravel = () => {
  return (
    <PageShell className="bg-[#12150f]">
      <SEO
        title="Pilgrimage Tours & Religious Travel | IPNIA"
        description="IPNIA Pilgrim Travel offers respectful pilgrimage journeys across Char Dham, Ayodhya, Varanasi, Vaishno Devi, Tirupati, Golden Temple, Bodh Gaya, Buddhist circuits and international faith travel."
        path="/pilgrim-travel"
        keywords="pilgrimage tours India, Char Dham yatra, Ayodhya tour, Varanasi pilgrimage, Vaishno Devi package, Tirupati darshan"
        image="/assets/ipnia/pilgrim-travel.jpg"
      />

      <section className="border-b border-amber-200/15 bg-[#12150f]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/80">
              Pilgrim Travel
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold text-[#f7f1e4] md:text-6xl">
              JOURNEYS OF FAITH.
              <br />
              <span className="text-amber-200">MEMORIES FOR A LIFETIME.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#f7f1e4]/70">
              Peaceful, well-coordinated pilgrimages with care for comfort, timing, darshan and the
              people you travel with.
            </p>
            <Button
              asChild
              className="mt-8 bg-amber-200 font-semibold text-[#1a1f14] hover:bg-amber-100"
            >
              <Link to="/contact">
                Plan My Pilgrimage <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-amber-200/25">
            <img
              src="/assets/ipnia/pilgrim-travel.jpg"
              alt="Pilgrimage journeys of faith"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#f7f1e4] md:text-4xl">Sacred destinations</h2>
        <p className="mt-3 max-w-2xl text-[#f7f1e4]/65">
          Domestic and international pilgrimage routes planned with reverence and practical support.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <div
              key={d.name}
              className="rounded-2xl border border-amber-200/20 bg-[#1a1f14] px-5 py-6 transition-colors hover:border-amber-200/45"
            >
              <h3 className="text-xl font-bold text-amber-100">{d.name}</h3>
              <p className="mt-1 text-sm text-[#f7f1e4]/60">{d.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-amber-200/15 bg-[#0e120c] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#f7f1e4]">Pilgrimage services</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-amber-200/15 bg-[#1a1f14]/80 p-5"
              >
                <s.icon className="mb-3 h-6 w-6 text-amber-200" />
                <h3 className="text-base font-semibold text-[#f7f1e4]">{s.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-200/25 bg-[#1a1f14] px-8 py-12 md:px-12">
          <h2 className="text-3xl font-bold text-[#f7f1e4] md:text-4xl">Travel with care and clarity</h2>
          <p className="mt-4 max-w-2xl text-[#f7f1e4]/65">
            Share your preferred shrines, travel dates and group needs — including senior citizen
            support — and we&apos;ll propose a respectful itinerary.
          </p>
          <Button
            asChild
            className="mt-8 bg-amber-200 font-semibold text-[#1a1f14] hover:bg-amber-100"
          >
            <Link to="/contact">Plan My Pilgrimage</Link>
          </Button>
        </div>
      </section>

      <StickyCTA label="Plan My Pilgrimage" to="/contact" />
    </PageShell>
  );
};

export default PilgrimTravel;
