import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap, Globe2, Landmark, Wallet } from "lucide-react";

const AboutUs = () => {
  return (
    <PageShell>
      <SEO
        title="About IPNIA"
        description="IPNIA is a complete Indian travel ecosystem spanning business, education, experience, pilgrimage and forex — connecting people and enterprises with meaningful journeys."
        path="/about"
        keywords="about IPNIA, Ipnia Services, Indian travel company, business travel China"
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d4a853]">About IPNIA</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-6xl">One platform. Every journey.</h1>
        <p className="mt-4 max-w-3xl text-lg text-white/70">
          Ipnia Services Pvt Ltd builds purposeful travel across five verticals — helping Indian
          businesses source globally, students learn through immersion, travelers experience the
          world, pilgrims travel with care, and every journey stay financially prepared.
        </p>

        <div className="mt-10 aspect-[21/9] overflow-hidden rounded-2xl border border-[#d4a853]/30 bg-[#07111f]">
          <img
            src="/assets/ipnia/experience-travel.jpg"
            alt="IPNIA travel ecosystem"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Briefcase, title: "Business Travel", text: "China tours, Canton Fair, factories and sourcing." },
            { icon: GraduationCap, title: "Education Travel", text: "Immersive learning beyond the classroom." },
            { icon: Globe2, title: "Experience Travel", text: "Adventure, culture, food and curated moments." },
            { icon: Landmark, title: "Pilgrim Travel", text: "Faith journeys planned with respect and comfort." },
            { icon: Wallet, title: "Forex Travel", text: "Travel money guidance for confident departures." },
          ].map((item) => (
            <Card key={item.title} className="border-[#d4a853]/25 bg-[#0c1a2e] text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <item.icon className="mr-2 h-5 w-5 text-[#d4a853]" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/65">{item.text}</CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-[#d4a853]/25 bg-[#0c1a2e] text-white">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-white/70">
            <p>Help@ipnia.com</p>
            <p>01145534440</p>
            <p>A199 Gujranwala Town Part 01, Delhi 110009</p>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
};

export default AboutUs;
