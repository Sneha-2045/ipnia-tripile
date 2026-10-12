import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

const articlePath = "/blog/best-road-trips-in-usa";
const articleTitle = "10 Best Road Trips in the USA for an Unforgettable Vacation";
const metaTitle = "10 Best Road Trips in the USA for Your Next Adventure | IPNIA";
const metaDescription =
  "Discover 10 scenic American road trips, from California's coastline to Utah's national parks, with planning tips for your next getaway.";
const articleImage = "/assets/blog/usa-road-trip-hero.png";

const roadTrips = [
  {
    name: "Pacific Coast Highway, California",
    description: "Enjoy coastal views, seaside towns, and scenic stops along California's Pacific coastline. Check road conditions before traveling, as sections can occasionally close because of landslides or construction.",
  },
  {
    name: "Route 66",
    description: "The historic Route 66 journey passes through communities, roadside attractions, and landscapes across several states. Plan your route in advance because the original highway does not always follow modern road alignments.",
  },
  {
    name: "Utah's Mighty Five",
    description: "Explore Zion, Bryce Canyon, Capitol Reef, Canyonlands, and Arches national parks. Allow enough time for driving, hiking, and seasonal weather conditions.",
  },
  {
    name: "Florida's Coastal Routes",
    description: "Combine beach towns, waterfront stops, and attractions along Florida's coastline. The Florida Keys offer a particularly memorable drive over bridges surrounded by water.",
  },
  {
    name: "Blue Ridge Parkway",
    description: "This scenic route through Virginia and North Carolina is known for mountain views, overlooks, and outdoor recreation. Fall colors can attract heavy visitor traffic.",
  },
  {
    name: "New England in Autumn",
    description: "Explore parts of Vermont, New Hampshire, and Massachusetts during the fall foliage season. Book accommodation early for popular weekends.",
  },
  {
    name: "The Great River Road",
    description: "Follow sections of the Mississippi River through historic towns, cultural attractions, and riverfront communities.",
  },
  {
    name: "Yellowstone and Grand Teton",
    description: "Combine dramatic mountain scenery, wildlife viewing, and geothermal features. Check park access, road conditions, and accommodation availability before departing.",
  },
  {
    name: "Alaska's Scenic Highways",
    description: "Alaska offers vast landscapes, mountain views, and opportunities for outdoor exploration. Distances can be long, so plan fuel stops and accommodation carefully.",
  },
  {
    name: "The Oregon Coast",
    description: "Discover beaches, coastal viewpoints, small towns, and scenic state parks along Oregon's Pacific shoreline.",
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

export default function BestRoadTripsInUSA() {
  return (
    <PageShell>
      <SEO
        title={metaTitle}
        description={metaDescription}
        path={articlePath}
        keywords="best road trips in USA, American road trips, scenic drives USA, Pacific Coast Highway, Route 66, Utah national parks"
        image={articleImage}
        jsonLd={articleJsonLd}
      />

      <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={articleImage}
            alt="A winding road through red-rock canyons in the American Southwest at sunset"
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
                <li className="text-slate-700">USA road trips</li>
              </ol>
            </nav>

            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">IPNIA Travel Guide</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#17324d] sm:text-5xl">
                {articleTitle}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                A road trip offers the freedom to explore at your own pace, discover smaller towns,
                and enjoy landscapes that are easy to miss when traveling by air alone.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Here are ten road trip ideas to inspire your next American adventure.
              </p>
            </header>

            <div className="divide-y divide-slate-100">
              {roadTrips.map((trip, index) => (
                <section key={trip.name} id={`road-trip-${index + 1}`} className="py-7 first:pt-8">
                  <h2 className="text-2xl font-bold text-[#17324d]">
                    {index + 1}. {trip.name}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-700">{trip.description}</p>
                </section>
              ))}
            </div>

            <section className="border-t border-slate-100 py-7">
              <h2 className="text-2xl font-bold text-[#17324d]">How to Plan a Road Trip</h2>
              <p className="mt-3 leading-7 text-slate-700">
                Start by estimating driving distances and realistic daily travel times. Reserve
                accommodation where necessary, check rental-car policies, and budget for fuel,
                parking, meals, and attraction fees.
              </p>
              <p className="mt-3 leading-7 text-slate-700">
                Download offline maps for areas with limited connectivity and keep an eye on local
                weather and road advisories.
              </p>
            </section>

            <section className="border-t border-slate-100 py-7">
              <h2 className="text-2xl font-bold text-[#17324d]">Consider Flying to Your Starting Point</h2>
              <p className="mt-3 leading-7 text-slate-700">
                If your road trip begins far from home, compare flights to the nearest convenient
                airport and check rental-car availability. One-way rental fees can affect the total
                cost.
              </p>
              <Link to="/flights/search" className="mt-3 inline-flex font-semibold text-[#805d12] underline underline-offset-4">
                Compare flights on IPNIA
              </Link>
            </section>

            <section className="mt-3 rounded-2xl bg-[#f4f7fa] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#17324d]">Final Thoughts</h2>
              <p className="mt-3 leading-7 text-slate-700">
                The best road trip is one that leaves enough time to enjoy the journey rather than
                rushing between destinations. Choose a route that matches your interests, budget,
                and available vacation days, then build in time for unexpected discoveries.
              </p>
              <Link
                to="/flights/search"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e4b64f] px-5 py-2.5 font-semibold text-[#10243c] transition-colors hover:bg-[#f0c96b]"
              >
                Plan your journey <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
