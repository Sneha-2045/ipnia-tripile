import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Palette, Utensils, Gem, Trees, Ticket, Heart, MapPinned } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import SEO from "@/components/SEO";
import StickyCTA from "@/components/StickyCTA";
import { Button } from "@/components/ui/button";

const categories = [
  { title: "Adventure", icon: Mountain, text: "Trails, expeditions and adrenaline with expert local partners." },
  { title: "Culture", icon: Palette, text: "Heritage walks, artisan studios and living traditions." },
  { title: "Food", icon: Utensils, text: "Culinary trails, markets and chef-led tastings." },
  { title: "Luxury", icon: Gem, text: "Refined stays, private access and considered pacing." },
  { title: "Nature", icon: Trees, text: "Landscapes, wildlife and slow travel in wild places." },
  { title: "Events", icon: Ticket, text: "Festivals, premieres and once-a-year gatherings." },
  { title: "Wellness", icon: Heart, text: "Retreats, recovery and mindful movement." },
  { title: "Local Experiences", icon: MapPinned, text: "Neighborhood stories, hosts and everyday beauty." },
];

const ExperienceTravel = () => {
  return (
    <PageShell>
      <SEO
        title="Experiential Travel & Unique Journeys | IPNIA"
        description="IPNIA Experience Travel designs immersive journeys across adventure, culture, food, luxury, nature, events, wellness and local experiences — travel that is more than a destination."
        path="/experience-travel"
        keywords="experiential travel India, adventure travel, cultural tours, luxury experiences, wellness travel"
        image="/assets/ipnia/experience-travel.jpg"
      />

      <section className="border-b border-[#d4a853]/20 bg-[#07111f]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4a853]">
              Experience Travel
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold text-white md:text-6xl">
              TRAVEL IS MORE THAN A DESTINATION.
              <br />
              <span className="text-[#d4a853]">IT&apos;S AN EXPERIENCE.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/75">
              We design journeys around feeling, place and people — not generic packages.
            </p>
            <Button asChild className="mt-8 w-fit bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
              <Link to="/contact">
                Build My Experience <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#d4a853]/35 bg-[#0a1628]">
            <img
              src="/assets/ipnia/experience-travel.jpg"
              alt="Experiential travel with IPNIA"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white md:text-5xl">Experience categories</h2>
        <p className="mt-3 max-w-2xl text-white/60">
          Mix categories into a single itinerary or go deep on one — IPNIA crafts the flow.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-[#d4a853]/50"
            >
              <cat.icon className="mb-4 h-7 w-7 text-[#d4a853] transition-transform group-hover:scale-110" />
              <h3 className="text-xl font-bold text-white">{cat.title}</h3>
              <p className="mt-2 text-sm text-white/60">{cat.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#07111f] py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            {
              title: "Immersive destinations",
              text: "Editorial city breaks and countryside escapes designed around pace and presence.",
              img: "/assets/ipnia/experience-travel.jpg",
            },
            {
              title: "Local access",
              text: "Hosts, makers and guides who open doors beyond the standard tourist circuit.",
              img: "/assets/ipnia/pilgrim-travel.jpg",
            },
            {
              title: "Curated moments",
              text: "Private dinners, sunrise rituals, workshops and event access — intentional highlights.",
              img: "/assets/ipnia/education-travel.jpg",
            },
          ].map((card) => (
            <article key={card.title} className="overflow-hidden rounded-2xl border border-[#d4a853]/25 bg-[#0c1a2e]">
              <div className="aspect-[16/10] bg-[#07111f]">
                <img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-white/65">{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white md:text-5xl">Tell us how you want to feel</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          Share your dates, companions and must-haves — we&apos;ll shape an experience around them.
        </p>
        <Button asChild size="lg" className="mt-8 bg-[#d4a853] font-semibold text-[#0a1628] hover:bg-[#e0b96a]">
          <Link to="/contact">Build My Experience</Link>
        </Button>
      </section>

      <StickyCTA label="Build My Experience" to="/contact" />
    </PageShell>
  );
};

export default ExperienceTravel;
