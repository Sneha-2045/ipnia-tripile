import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building,
  FlaskConical,
  Globe,
  GraduationCap,
  MapPin,
  Presentation,
  Users,
  Briefcase,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import SEO from "@/components/SEO";
import StickyCTA from "@/components/StickyCTA";
import SignUpSection from "@/components/SignUpSection";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const sections = [
  { title: "Educational Tours", icon: GraduationCap, text: "Purpose-built itineraries that blend learning outcomes with destination discovery." },
  { title: "University Visits", icon: Building, text: "Campus tours, faculty interactions and pathway conversations at leading institutions." },
  { title: "Industry Visits", icon: Briefcase, text: "See how companies operate — from labs and studios to boardrooms and factories." },
  { title: "International Immersion", icon: Globe, text: "Live, learn and collaborate in global cities with structured cultural orientation." },
  { title: "Student Exchange", icon: Users, text: "Guided exchange experiences that build confidence, networks and academic exposure." },
  { title: "Corporate Exposure", icon: Presentation, text: "Mentorship, workshops and professional shadowing for career-ready learners." },
  { title: "STEM Experiences", icon: FlaskConical, text: "Hands-on STEM labs, maker spaces and innovation-focused site visits." },
  { title: "Conferences & Competitions", icon: MapPin, text: "Travel support for academic conferences, olympiads and global competitions." },
];

const destinations = ["USA", "UK", "UAE", "Singapore", "Japan", "Europe", "India"];

const EducationTravel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToProgram = (course: string) => {
    if (!user) {
      navigate("/login", { state: { redirectTo: `/payment/${course}` } });
      return;
    }
    navigate(`/payment/${course}`);
  };

  return (
    <PageShell>
      <SEO
        title="Educational Tours & International Student Travel | IPNIA"
        description="IPNIA Education Travel combines travel, global exposure and practical learning — university visits, industry immersion, STEM experiences and student journeys across USA, UK, UAE, Singapore, Japan, Europe and India."
        path="/education-travel"
        keywords="education travel India, educational tours abroad, university visits, student immersion programs, STEM travel"
        image="/assets/ipnia/education-travel.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${window.location.origin}/` },
            {
              "@type": "ListItem",
              position: 2,
              name: "Education Travel",
              item: `${window.location.origin}/education-travel`,
            },
          ],
        }}
      />

      <section className="border-b border-white/10 bg-[#07111f]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
              Education Travel
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold text-white md:text-6xl">
              LEARN THE WORLD.
              <br />
              <span className="text-sky-300">NOT JUST THE CLASSROOM.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/70">
              Educational journeys that combine travel, global exposure, practical learning and
              real-world experiences.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-sky-400 font-semibold text-[#0a1628] hover:bg-sky-300">
                <Link to="/contact">
                  Plan an Educational Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-sky-400/40 bg-transparent text-white hover:bg-sky-400/10 hover:text-white"
              >
                <a href="#programs">View Learning Programs</a>
              </Button>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-sky-400/30">
            <img
              src="/assets/ipnia/education-travel.jpg"
              alt="Education travel — campus and global learning"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white md:text-4xl">What education travel includes</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-sky-400/20 bg-white/5 p-5 transition-all hover:-translate-y-1 hover:border-sky-300/50"
            >
              <item.icon className="mb-3 h-6 w-6 text-sky-300" />
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#07111f] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Destinations</h2>
          <p className="mt-2 text-white/60">Immersion-ready cities and regions for student and institutional journeys.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {destinations.map((place) => (
              <div
                key={place}
                className="rounded-xl border border-white/10 bg-[#0c1a2e] px-4 py-6 text-center"
              >
                <p className="text-lg font-bold text-sky-300">{place}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preserve existing program/payment paths */}
      <section id="programs" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white">IPNIA Learning Programs</h2>
        <p className="mt-2 max-w-2xl text-white/60">
          Continue with existing IPNIA education offerings — including immersive and global tracks
          available through our current enrollment flow.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { title: "AI Foundations", course: "ai-course", blurb: "Core AI learning with practical projects." },
            { title: "Applied ML Track", course: "ml-course", blurb: "Deeper machine learning immersion." },
            { title: "Global Exposure", course: "global-course", blurb: "Travel-linked global learning experience." },
          ].map((program) => (
            <div key={program.course} className="rounded-2xl border border-sky-400/25 bg-[#0c1a2e] p-6">
              <h3 className="text-xl font-bold text-white">{program.title}</h3>
              <p className="mt-2 text-sm text-white/60">{program.blurb}</p>
              <Button
                className="mt-5 bg-sky-400 font-semibold text-[#0a1628] hover:bg-sky-300"
                onClick={() => goToProgram(program.course)}
              >
                Enroll / Pay
              </Button>
            </div>
          ))}
        </div>
        <Link to="/pricing" className="mt-4 inline-block text-sm font-semibold text-sky-300 hover:underline">
          View full pricing →
        </Link>
      </section>

      <section id="signup" className="pb-24 md:pb-12">
        <SignUpSection />
      </section>

      <StickyCTA label="Plan an Educational Tour" to="/contact" />
    </PageShell>
  );
};

export default EducationTravel;
