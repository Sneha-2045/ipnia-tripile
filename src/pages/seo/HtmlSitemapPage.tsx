import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight, Search } from "lucide-react";
import { SeoPageLayout } from "@/components/seo/SeoPageLayout";
import { seoAirlines } from "@/data/seo/airlines";
import { getSeoCountries } from "@/data/seo/countries";
import { seoDeals } from "@/data/seo/deals";
import { seoDestinations } from "@/data/seo/destinations";
import { seoRoutes } from "@/data/seo/routes";
import { buildSitemapUrls } from "@/lib/seo/sitemapRegistry";
import { Input } from "@/components/ui/input";

type DirectoryItem = { label: string; to: string; note?: string };
type AirlineTool = { airline: string; href: string };

const officialCheckIn: AirlineTool[] = [
  { airline: "Air India", href: "https://www.airindia.com/language-masters/en/manage/web-checkin.html" },
  { airline: "Air India Express", href: "https://www.airindiaexpress.com/checkin-home" },
  { airline: "Akasa Air", href: "https://www.akasaair.com/check-in/web-check-in" },
  { airline: "IndiGo", href: "https://www.goindigo.in/web-check-in.html" },
  { airline: "SpiceJet", href: "https://sod.spicejet.com/WebCheckIn/CheckIn" },
];

const officialBooking: AirlineTool[] = [
  { airline: "Air India", href: "https://www.airindia.com/in/en/manage/booking.html" },
  { airline: "Air India Express", href: "https://www.airindiaexpress.com/checkin-home" },
  { airline: "IndiGo", href: "https://www.goindigo.in/edit-booking.html" },
  { airline: "SpiceJet", href: "https://www.spicejet.com/" },
];

function DirectorySection({
  title,
  items,
  description,
}: {
  title: string;
  items: DirectoryItem[];
  description?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-[#17324d]">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li key={`${item.to}-${item.label}`}>
            <Link
              to={item.to}
              className="group flex min-h-10 items-center gap-2 rounded-lg px-1.5 py-2 text-sm text-slate-700 transition-colors hover:bg-amber-50 hover:text-[#805d12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600"
            >
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-700" />
              <span>{item.label}</span>
              {item.note && <span className="ml-auto text-xs text-slate-500">{item.note}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AirlineToolSection({
  title,
  items,
  description,
}: {
  title: string;
  items: AirlineTool[];
  description: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-[#17324d]">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ airline, href }) => (
          <li key={airline}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-10 items-center gap-2 rounded-lg px-1.5 py-2 text-sm text-slate-700 transition-colors hover:bg-amber-50 hover:text-[#805d12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600"
            >
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-700" />
              <span>{airline}</span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-slate-400" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function HtmlSitemapPage() {
  const [query, setQuery] = useState("");
  const urls = useMemo(() => buildSitemapUrls(), []);
  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return null;
    return urls
      .filter((url) => url.path.toLowerCase().includes(needle))
      .map((url) => ({ label: url.path, to: url.path }));
  }, [query, urls]);

  const quickLinks: DirectoryItem[] = [
    { label: "Home", to: "/" },
    { label: "Flights", to: "/flights/destinations" },
    { label: "Hotels", to: "/hotels/destinations" },
    { label: "Travel ecosystem", to: "/travel-ecosystem" },
    { label: "Business travel", to: "/business-travel" },
    { label: "Education travel", to: "/education-travel" },
    { label: "Experience travel", to: "/experience-travel" },
    { label: "Pilgrim travel", to: "/pilgrim-travel" },
    { label: "Forex", to: "/forex" },
    { label: "About IPNIA", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Pricing", to: "/pricing" },
    { label: "Privacy policy", to: "/privacy-policy" },
    { label: "Refund policy", to: "/refund-policy" },
    { label: "Terms and conditions", to: "/terms-and-conditions" },
  ];

  return (
    <SeoPageLayout
      title="Sitemap"
      description="Browse IPNIA’s city and destination guides, airline pages, flight routes, travel guides and important site links."
      path="/sitemap"
      keywords="IPNIA sitemap, city directory, airline directory, flight routes, travel guides"
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Sitemap" }]}
      headline="IPNIA sitemap"
      subhead={`${urls.length} indexable pages, organized by destination, airline, route and travel topic.`}
    >
      <div className="mb-6">
        <label className="sr-only" htmlFor="sitemap-search">Search sitemap URLs</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            id="sitemap-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cities, airlines or sitemap URLs…"
            className="h-12 border-slate-300 bg-white pl-10 text-[#17324d] placeholder:text-slate-500"
          />
        </div>
      </div>

      {filteredItems ? (
        <DirectorySection
          title={`Matching pages (${filteredItems.length})`}
          items={filteredItems.slice(0, 300)}
        />
      ) : (
        <div className="space-y-4">
          <DirectorySection
            title={`Popular Cities (${seoDestinations.length})`}
            description="Each city opens its canonical IPNIA destination guide, with links to relevant flight and hotel pages."
            items={seoDestinations.map((destination) => ({
              label: destination.name,
              to: `/destinations/${destination.slug}`,
              note: destination.countryName,
            }))}
          />
          <DirectorySection
            title={`Popular Airlines (${seoAirlines.length})`}
            items={seoAirlines.map((airline) => ({
              label: airline.name,
              to: `/flights/airlines/${airline.slug}`,
              note: airline.iata,
            }))}
          />
          <DirectorySection
            title="Popular Flight Routes"
            items={seoRoutes.map((route) => ({
              label: `${seoDestinations.find((destination) => destination.slug === route.fromSlug)?.name || route.fromSlug} → ${seoDestinations.find((destination) => destination.slug === route.toSlug)?.name || route.toSlug}`,
              to: `/flights/from/${route.fromSlug}/to/${route.toSlug}`,
            }))}
          />
          <DirectorySection
            title={`Popular Travel Guides (${seoDeals.length})`}
            description="Browse flight, hotel and travel planning guides."
            items={seoDeals.map((deal) => ({ label: deal.title, to: `/deals/${deal.slug}` }))}
          />
          <DirectorySection
            title="Blog Articles"
            description="Practical advice for planning and booking your next trip."
            items={[
              { label: "IPNIA Travel Blog", to: "/blog" },
              { label: "How to Find Cheap Flights in 2027: 12 Tips to Save Money", to: "/blog/how-to-find-cheap-flights" },
              { label: "15 Best Places to Travel in the USA for Every Type of Traveler", to: "/blog/best-places-to-travel-in-usa" },
              { label: "How to Find Cheap Hotels in the USA Without Sacrificing Comfort", to: "/blog/how-to-find-cheap-hotels" },
              { label: "Best All-Inclusive Resorts Near the USA for a Stress-Free Vacation", to: "/blog/best-all-inclusive-resorts" },
              { label: "Best Time to Book International Flights from the USA", to: "/blog/best-time-to-book-international-flights" },
              { label: "10 Best Road Trips in the USA for an Unforgettable Vacation", to: "/blog/best-road-trips-in-usa" },
              { label: "First-Time International Travel from the USA: The Complete Checklist", to: "/blog/international-travel-checklist" },
              { label: "Hotel vs. Airbnb: Which Is Better for Your Next Vacation?", to: "/blog/hotel-vs-airbnb" },
              { label: "Best Places to Travel in the USA by Month: A Month-by-Month Guide", to: "/blog/best-places-to-visit-usa-by-month" },
              { label: "How to Plan a Vacation on a Budget: Flights, Hotels, and Hidden Costs", to: "/blog/budget-vacation-planning" },
              { label: "How to Plan a Family Vacation: Flights, Hotels, and Activities", to: "/blog/family-vacation-planning" },
              { label: "Solo Travel Tips: How to Plan a Memorable Trip on Your Own", to: "/blog/solo-travel-tips" },
              { label: "Weekend Getaways in the USA: 10 Trip Ideas and Planning Tips", to: "/blog/weekend-getaways-usa" },
              { label: "Travel Packing Checklist: What to Pack for Your Next Trip", to: "/blog/travel-packing-checklist" },
              { label: "Airport Tips for a Smoother Trip: Check-In, Security, and Connections", to: "/blog/airport-travel-tips" },
            ]}
          />
          <AirlineToolSection
            title="Airlines Web Check-In"
            description="Continue to the airline’s official website to check in."
            items={officialCheckIn}
          />
          <AirlineToolSection
            title="Flights PNR Status and Manage Booking"
            description="Use the airline’s official booking reference or PNR service. These links leave IPNIA."
            items={officialBooking}
          />
          <DirectorySection title="Quick Links" items={quickLinks} />
          <DirectorySection
            title="Countries"
            items={getSeoCountries().map((country) => ({
              label: country.name,
              to: `/flights/countries/${country.slug}`,
            }))}
          />
        </div>
      )}

      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        Search results, live hotel listings and booking steps are not included as indexable sitemap pages. XML sitemap: {" "}
        <a className="font-medium text-[#805d12] underline underline-offset-2" href="/sitemap.xml">/sitemap.xml</a>
      </p>
    </SeoPageLayout>
  );
}
