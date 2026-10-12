import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

const articlePath = "/blog/best-places-to-travel-in-usa";
const articleTitle = "15 Best Places to Travel in the USA for Every Type of Traveler";
const metaTitle = "15 Best Places to Visit in the USA | IPNIA";
const metaDescription =
  "Explore 15 amazing places to visit in the USA, from iconic cities to national parks, beach destinations, and unforgettable road trips.";
const articleImage = "/assets/destinations/dest-newyork.jpg";

const destinations = [
  {
    name: "New York City, New York",
    description: "Explore Times Square, Central Park, Broadway, world-class museums, and diverse neighborhoods. New York is an excellent choice for first-time visitors who enjoy culture, shopping, and city life.",
  },
  {
    name: "Orlando, Florida",
    description: "Orlando is known for its theme parks, family attractions, and resort hotels. It's a popular choice for families planning a multi-day vacation.",
  },
  {
    name: "Las Vegas, Nevada",
    description: "Beyond its famous entertainment and nightlife, Las Vegas provides convenient access to desert landscapes and day trips to nearby natural attractions.",
  },
  {
    name: "San Diego, California",
    description: "Enjoy beaches, waterfront neighborhoods, outdoor activities, and a relaxed Southern California atmosphere.",
  },
  {
    name: "San Francisco, California",
    description: "Visit the Golden Gate Bridge, explore waterfront areas, and discover the city's distinctive neighborhoods and food scene.",
  },
  {
    name: "Honolulu, Hawaii",
    description: "Hawaii offers tropical beaches, hiking, ocean activities, and opportunities to experience local culture. Plan transportation and accommodation costs carefully.",
  },
  {
    name: "Miami, Florida",
    description: "Miami combines beaches, art, nightlife, and distinctive Latin American and Caribbean influences.",
  },
  {
    name: "Washington, D.C.",
    description: "Explore national museums, monuments, historic sites, and government landmarks. Many Smithsonian museums offer free admission.",
  },
  {
    name: "Chicago, Illinois",
    description: "Discover architecture, lakefront parks, museums, music, and a celebrated food scene.",
  },
  {
    name: "New Orleans, Louisiana",
    description: "Experience live music, historic architecture, distinctive cuisine, and cultural traditions.",
  },
  {
    name: "Seattle, Washington",
    description: "Seattle offers waterfront attractions, coffee culture, markets, and access to beautiful outdoor destinations.",
  },
  {
    name: "Yellowstone National Park",
    description: "Yellowstone is ideal for travelers interested in wildlife, geothermal features, and scenic landscapes. Check seasonal road access and park advisories before visiting.",
  },
  {
    name: "Grand Canyon National Park, Arizona",
    description: "The Grand Canyon offers spectacular viewpoints, hiking opportunities, and unforgettable desert scenery. Choose activities according to your fitness and the season.",
  },
  {
    name: "Nashville, Tennessee",
    description: "Music venues, Southern food, and cultural attractions make Nashville a popular destination for groups and weekend travelers.",
  },
  {
    name: "Boston, Massachusetts",
    description: "Boston combines American history, walkable neighborhoods, museums, and excellent opportunities for food and cultural exploration.",
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

export default function BestPlacesToTravelInUSA() {
  return (
    <PageShell>
      <SEO
        title={metaTitle}
        description={metaDescription}
        path={articlePath}
        keywords="best places to visit in the USA, USA travel destinations, US vacation destinations, places to travel in America"
        image={articleImage}
        jsonLd={articleJsonLd}
      />

      <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={articleImage}
            alt="New York City skyline at sunset"
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
                <li className="text-slate-700">USA destinations</li>
              </ol>
            </nav>

            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">IPNIA Travel Guide</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#17324d] sm:text-5xl">
                {articleTitle}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                The United States offers an incredible variety of travel experiences, from vibrant
                cities and scenic coastlines to mountains, deserts, and national parks. Whether
                you&apos;re planning a weekend getaway, a family vacation, or a longer adventure,
                there&apos;s a destination to suit your interests and budget.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Here are 15 destinations worth considering for your next American vacation.
              </p>
            </header>

            <div className="divide-y divide-slate-100">
              {destinations.map((destination, index) => (
                <section key={destination.name} id={`place-${index + 1}`} className="py-7 first:pt-8">
                  <h2 className="text-2xl font-bold text-[#17324d]">
                    {index + 1}. {destination.name}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-700">{destination.description}</p>
                </section>
              ))}
            </div>

            <section className="mt-3 border-t border-slate-100 py-7">
              <h2 className="text-2xl font-bold text-[#17324d]">How to Choose the Right Destination</h2>
              <p className="mt-3 leading-7 text-slate-700">
                Start with your budget, preferred weather, trip duration, and interests. City
                vacations can reduce the need for a rental car, while national park trips may require
                advance transportation and accommodation planning.
              </p>
              <p className="mt-3 leading-7 text-slate-700">
                Compare airfare and hotel options before selecting your destination. A less expensive
                flight may not mean a cheaper trip if lodging and transportation costs are high.
              </p>
            </section>

            <section className="mt-3 rounded-2xl bg-[#f4f7fa] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#17324d]">Plan Your Next US Vacation</h2>
              <p className="mt-3 leading-7 text-slate-700">
                From exciting cities to remarkable natural landscapes, the USA offers something for
                nearly every traveler. Compare flight options and accommodation choices on IPNIA to
                start organizing your next getaway.
              </p>
              <Link
                to="/flights/search"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e4b64f] px-5 py-2.5 font-semibold text-[#10243c] transition-colors hover:bg-[#f0c96b]"
              >
                Compare flights <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
