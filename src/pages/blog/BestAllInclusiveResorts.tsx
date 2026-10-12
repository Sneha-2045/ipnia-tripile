import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

const articlePath = "/blog/best-all-inclusive-resorts";
const articleTitle = "Best All-Inclusive Resorts Near the USA for a Stress-Free Vacation";
const metaTitle = "Best All-Inclusive Resorts for Your Next Vacation | IPNIA";
const metaDescription =
  "Explore popular all-inclusive vacation destinations in Mexico and the Caribbean, with tips for choosing resorts for couples and families.";
const articleImage = "/assets/destinations/hotel-beach.jpg";

const destinations = [
  {
    name: "Cancun, Mexico",
    description: "Cancun offers white-sand beaches, resort properties, water activities, and access to historic sites in the Yucatán Peninsula. It can suit couples, families, and groups looking for a beach-focused getaway.",
  },
  {
    name: "Riviera Maya, Mexico",
    description: "Riviera Maya combines coastal resorts with opportunities to explore cenotes, archaeological sites, and natural attractions. Consider transfer times when comparing properties.",
  },
  {
    name: "Punta Cana, Dominican Republic",
    description: "Punta Cana is known for its beach resorts and vacation packages. It's worth considering for travelers who want to spend much of their trip relaxing at the property.",
  },
  {
    name: "Montego Bay, Jamaica",
    description: "Montego Bay offers Caribbean beaches, cultural experiences, and resorts catering to different types of travelers. Compare airport transfers and the excursions available outside the resort.",
  },
  {
    name: "Aruba",
    description: "Aruba combines beaches, outdoor activities, and a sunny Caribbean setting. Check whether an all-inclusive package offers better value than booking accommodation and meals separately.",
  },
  {
    name: "Puerto Vallarta, Mexico",
    description: "Puerto Vallarta blends Pacific coast scenery, resort stays, local cuisine, and a lively town atmosphere.",
  },
];

const resortTips = [
  {
    title: "Compare What's Included",
    description: "Some packages include most meals and activities, while others charge separately for premium restaurants, excursions, spa services, or airport transfers.",
  },
  {
    title: "Check the Location",
    description: "A resort close to the airport may save transportation time. A more remote property may offer greater seclusion but require additional planning.",
  },
  {
    title: "Choose the Right Property for Your Group",
    description: "Families may prefer kids' clubs and family pools, while couples might prioritize quiet areas, adults-only facilities, and dining experiences.",
  },
  {
    title: "Calculate the Complete Cost",
    description: "Include flights, accommodation, transfers, travel insurance, tips, and any activities that aren't part of the package.",
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

export default function BestAllInclusiveResorts() {
  return (
    <PageShell>
      <SEO
        title={metaTitle}
        description={metaDescription}
        path={articlePath}
        keywords="best all-inclusive resorts, all-inclusive vacations near USA, Mexico resorts, Caribbean resorts, family all-inclusive resorts, couples resorts"
        image={articleImage}
        jsonLd={articleJsonLd}
      />

      <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={articleImage}
            alt="Beachfront resort pool overlooking the Caribbean at sunset"
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
                <li className="text-slate-700">All-inclusive resorts</li>
              </ol>
            </nav>

            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">IPNIA Travel Guide</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#17324d] sm:text-5xl">
                {articleTitle}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                An all-inclusive vacation can simplify trip planning by combining accommodation,
                meals, drinks, and selected activities into one package. For travelers departing
                from the United States, Mexico and the Caribbean offer a wide range of resort
                experiences.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Before choosing a resort, compare the inclusions, location, flight options, and total
                trip price.
              </p>
            </header>

            <div className="divide-y divide-slate-100">
              {destinations.map((destination, index) => (
                <section key={destination.name} id={`destination-${index + 1}`} className="py-7 first:pt-8">
                  <h2 className="text-2xl font-bold text-[#17324d]">
                    {index + 1}. {destination.name}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-700">{destination.description}</p>
                </section>
              ))}
            </div>

            <section className="border-t border-slate-100 py-7">
              <h2 className="text-2xl font-bold text-[#17324d]">How to Choose an All-Inclusive Resort</h2>
              <div className="mt-4 space-y-6">
                {resortTips.map((tip) => (
                  <section key={tip.title}>
                    <h3 className="text-lg font-bold text-[#17324d]">{tip.title}</h3>
                    <p className="mt-2 leading-7 text-slate-700">{tip.description}</p>
                  </section>
                ))}
              </div>
            </section>

            <section className="border-t border-slate-100 py-7">
              <h2 className="text-2xl font-bold text-[#17324d]">When Should You Book?</h2>
              <p className="mt-3 leading-7 text-slate-700">
                Prices and availability depend on destination, season, departure city, and resort
                demand. Compare multiple travel dates and review cancellation policies before paying.
              </p>
            </section>

            <section className="mt-3 rounded-2xl bg-[#f4f7fa] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#17324d]">Plan Your All-Inclusive Escape</h2>
              <p className="mt-3 leading-7 text-slate-700">
                The right resort should match your preferred atmosphere, budget, and travel style.
                Compare available flights and accommodation on IPNIA before deciding which
                destination is best for your next vacation.
              </p>
              <Link
                to="/hotels/search"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e4b64f] px-5 py-2.5 font-semibold text-[#10243c] transition-colors hover:bg-[#f0c96b]"
              >
                Explore hotels <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
