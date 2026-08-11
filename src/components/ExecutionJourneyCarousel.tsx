import React, { useEffect, useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const slides = [
  {
    headline: "Start Strong with Practical Learning",
    subtext: "Build execution-first skills through expert-curated playbooks and hands-on sprints.",
    highlights: [
      "40+ practical modules",
      "AI-powered guidance",
      "Peer collaboration rooms"
    ],
    illustration: "/learn_by_doing.svg",
    visualAlt: "Person coding with sticky notes and planning board",
    cta: "Start Learning →"
  },
  {
    headline: "Turn Concepts into Impact",
    subtext: "Apply your skills in real-world projects and build a portfolio that stands out.",
    highlights: [
      "Live startup challenges",
      "Real client deliverables",
      "Showcase progress with dashboards"
    ],
    illustration: "/execute_projects.svg",
    visualAlt: "People brainstorming in a workspace with project milestone cards",
    cta: "Work on Projects →"
  },
  {
    headline: "Work Where It Matters",
    subtext: "Secure internships with top companies after completing key execution milestones.",
    highlights: [
      "Guaranteed internship pathways",
      "AI Career Match",
      "Resume & Portfolio Builder"
    ],
    illustration: "/career_boost.svg",
    visualAlt: "Career dashboard mockup with job titles and company logos",
    cta: "Explore Internships →"
  },
  {
    headline: "Your Work, Your Recognition",
    subtext: "Showcase your portfolio to global recruiters and scale your career beyond limits.",
    highlights: [
      "Global Demo Day",
      "IPNIA Power Score portfolio",
      "Mentorship for scaling ideas"
    ],
    illustration: "/showcase_scale.svg",
    visualAlt: "Person presenting on stage with project metrics and achievement badges",
    cta: "Showcase Your Work →"
  }
];

export default function ExecutionJourneyCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide every 7s
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [active]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((prev) => (prev + 1) % slides.length);
      if (e.key === "ArrowLeft") setActive((prev) => (prev - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section className="relative py-20 px-2 sm:px-4 lg:px-8 bg-gradient-to-br from-[#181A20] to-[#23263A]">
      <div className="max-w-5xl mx-auto">
        <Carousel opts={{ loop: true }}>
          <CarouselContent className="transition-all duration-500">
            {slides.map((slide, idx) => (
              <CarouselItem key={idx} className={idx === active ? "block" : "hidden"}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 min-h-[400px]">
                  {/* Illustration */}
                  <div className="flex-1 flex justify-center items-center">
                    <img src={slide.illustration} alt={slide.visualAlt} className="w-[320px] h-[240px] object-contain rounded-xl shadow-lg bg-white/10" />
                  </div>
                  {/* Text Content */}
                  <div className="flex-1 flex flex-col items-start md:items-start gap-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{slide.headline}</h3>
                    <p className="text-lg text-gray-200 mb-2">{slide.subtext}</p>
                    <ul className="mb-4 space-y-2">
                      {slide.highlights.map((h, i) => (
                        <li key={i} className="flex items-center text-base text-white"><CheckCircle className="text-green-400 mr-2 w-5 h-5" /> {h}</li>
                      ))}
                    </ul>
                    <Button size="lg" className="mt-2 bg-primary text-white shadow-lg">
                      {slide.cta}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Progress Dots */}
          <div className="flex justify-center mt-8 gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`w-4 h-4 rounded-full border-2 ${active === idx ? "bg-primary border-primary" : "bg-gray-700 border-gray-500"}`}
                onClick={() => setActive(idx)}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
          {/* Navigation Arrows */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 shadow-lg z-10"
            onClick={() => setActive((active - 1 + slides.length) % slides.length)}
            aria-label="Previous step"
          >
            <ArrowRight className="rotate-180 w-6 h-6 text-white" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 shadow-lg z-10"
            onClick={() => setActive((active + 1) % slides.length)}
            aria-label="Next step"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </Carousel>
      </div>
    </section>
  );
} 