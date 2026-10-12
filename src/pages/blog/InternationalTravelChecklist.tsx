import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

const articlePath = "/blog/international-travel-checklist";
const articleTitle = "First-Time International Travel from the USA: The Complete Checklist";
const metaTitle = "International Travel Checklist: A Guide for First-Time Travelers | IPNIA";
const metaDescription =
  "Prepare for your first international trip with this practical checklist covering passports, visas, flights, accommodation, money, and packing.";
const articleImage = "/assets/blog/international-checklist-hero.png";

const checklist = [
  {
    title: "Check Your Passport",
    description: "Confirm that your passport is valid for your destination and travel dates. Some countries require additional validity beyond your planned departure date.",
  },
  {
    title: "Review Visa and Entry Requirements",
    description: "Entry requirements depend on your citizenship, destination, and transit countries. Check official government guidance and confirm whether a visa or electronic travel authorization is required.",
  },
  {
    title: "Book Your Flights",
    description: "Compare available routes, baggage allowances, layovers, arrival times, and fare restrictions. Leave enough time for connections, especially when your itinerary involves immigration, security screening, or separate tickets.",
  },
  {
    title: "Reserve Accommodation",
    description: "Choose a hotel based on location, transportation access, reviews, cancellation conditions, and total price. Keep your booking confirmation and the property's address accessible offline.",
  },
  {
    title: "Purchase Appropriate Travel Insurance",
    description: "Consider coverage for medical emergencies, trip interruption, cancellations, and baggage issues. Review exclusions and coverage limits before purchasing a policy.",
  },
  {
    title: "Prepare Your Money",
    description: "Check foreign transaction fees, ATM charges, payment options, and currency exchange arrangements. Carry a backup payment method securely.",
  },
  {
    title: "Plan Phone Connectivity",
    description: "Research international roaming, local SIM cards, and eSIM options compatible with your device. Download maps, travel documents, and important addresses before leaving home.",
  },
  {
    title: "Pack for the Destination",
    description: "Check the weather forecast and expected activities. Pack suitable clothing, medication you normally use, chargers, and any essential travel accessories. Confirm airline baggage restrictions before packing.",
  },
  {
    title: "Understand Local Customs and Transportation",
    description: "Research local etiquette, transportation options, emergency contacts, and basic phrases if you are visiting a country where you don't speak the local language.",
  },
  {
    title: "Keep Important Documents Accessible",
    description: "Store copies of travel documents securely and share your itinerary with someone you trust. Keep originals protected and follow local guidance if anything is lost.",
  },
  {
    title: "Check Before Leaving for the Airport",
    description: "Review your flight status, terminal, check-in deadline, baggage requirements, and airport transportation. Arrive with sufficient time for the airline's check-in and security procedures.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: articleTitle,
  description: metaDescription,
  image: `${SITE_ORIGIN}${articleImage}`,
  mainEntityOfPage: `${SITE_ORIGIN}${articlePath}`,
  author: { "@type": "Organization", name: "IPNIA" },
  publisher: {
    "@type": "Organization",
    name: "Ipnia Services Pvt Ltd",
    logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/ipnia-logo.png` },
  },
};

export default function InternationalTravelChecklist() {
  return (
    <PageShell>
      <SEO
        title={metaTitle}
        description={metaDescription}
        path={articlePath}
        keywords="international travel checklist, first international trip, passport and visa checklist, international travel from USA"
        image={articleImage}
        jsonLd={articleJsonLd}
      />

      <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={articleImage}
            alt="Passport, travel essentials, luggage, and phone prepared by an airport window"
            className="h-64 w-full object-cover sm:h-80 lg:h-[26rem]"
            fetchPriority="high"
          />
          <div className="px-5 py-8 sm:px-10 sm:py-12">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link to="/" className="hover:text-[#805d12]">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link to="/blog" className="hover:text-[#805d12]">Blogs</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-700">International travel checklist</li>
              </ol>
            </nav>

            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">IPNIA Travel Guide</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#17324d] sm:text-5xl">
                {articleTitle}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                Your first international trip can be exciting, but preparing for a journey abroad
                requires more than booking a flight. From travel documents to accommodation and
                local transportation, a little organization can make the experience smoother.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Use this checklist to prepare before departure.
              </p>
            </header>

            <div className="divide-y divide-slate-100">
              {checklist.map((item, index) => (
                <section key={item.title} id={`checklist-${index + 1}`} className="py-7 first:pt-8">
                  <h2 className="text-2xl font-bold text-[#17324d]">
                    {index + 1}. {item.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-700">{item.description}</p>
                  {index === 2 && (
                    <Link to="/flights/search" className="mt-3 inline-flex font-semibold text-[#805d12] underline underline-offset-4">
                      Compare flights on IPNIA
                    </Link>
                  )}
                  {index === 3 && (
                    <Link to="/hotels/search" className="mt-3 inline-flex font-semibold text-[#805d12] underline underline-offset-4">
                      Explore hotels on IPNIA
                    </Link>
                  )}
                </section>
              ))}
            </div>

            <section className="mt-3 rounded-2xl bg-[#f4f7fa] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#17324d]">Final Thoughts</h2>
              <p className="mt-3 leading-7 text-slate-700">
                Successful international travel starts with preparation. Check your documents,
                understand your destination&apos;s entry rules, compare flights and accommodation,
                and keep essential information accessible.
              </p>
              <p className="mt-3 leading-7 text-slate-700">
                With the right preparation, you can spend less time worrying about logistics and
                more time enjoying your trip.
              </p>
              <Link
                to="/flights/search"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e4b64f] px-5 py-2.5 font-semibold text-[#10243c] transition-colors hover:bg-[#f0c96b]"
              >
                Explore flights <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
