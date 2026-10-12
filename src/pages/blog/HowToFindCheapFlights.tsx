import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

const articlePath = "/blog/how-to-find-cheap-flights";
const articleTitle = "How to Find Cheap Flights in 2027: 12 Tips to Save Money";
const metaDescription =
  "Discover 12 practical ways to find cheap flights in 2027, compare airfare, choose flexible dates, and save money on your next trip.";
const articleImage = "/assets/destinations/hero-travel.jpg";

const tips = [
  {
    title: "Be Flexible With Your Travel Dates",
    body: (
      <>
        Flight prices can vary significantly depending on the date, season, and demand. If your
        schedule allows, compare several departure and return dates rather than committing to one
        specific itinerary. Traveling outside major holidays and school vacation periods may give
        you access to more affordable options.
      </>
    ),
  },
  {
    title: "Compare Multiple Airlines",
    body: (
      <>
        Don&apos;t assume your usual airline always offers the best fare. Compare available airlines,
        flight durations, baggage allowances, and connections before booking. Use the{" "}
        <Link className="font-semibold text-[#805d12] underline underline-offset-4" to="/flights/search">
          IPNIA flight search page
        </Link>{" "}
        to begin comparing available travel options.
      </>
    ),
  },
  {
    title: "Consider Nearby Airports",
    body: (
      <>
        If you live near multiple airports, compare their fares. A nearby alternative may offer
        cheaper flights, although transportation costs and travel time should be included in your
        calculation.
      </>
    ),
  },
  {
    title: "Check the Total Ticket Cost",
    body: (
      <>
        A low advertised fare may not include checked baggage, seat selection, or other optional
        services. Compare the final price rather than just the initial ticket price.
      </>
    ),
  },
  {
    title: "Consider Connecting Flights",
    body: (
      <>
        Nonstop flights are convenient, but connecting itineraries can sometimes be less expensive.
        Check the total journey time, connection duration, and whether your itinerary is protected
        if a connection is missed.
      </>
    ),
  },
  {
    title: "Book Around Your Travel Needs",
    body: (
      <>
        There is no universal day or number of days in advance that guarantees the cheapest airfare.
        Start comparing prices early, monitor your preferred routes, and book when an available fare
        fits your budget and schedule.
      </>
    ),
  },
  {
    title: "Travel During Shoulder Seasons",
    body: (
      <>
        Many destinations are less crowded during the periods between peak and off-peak seasons.
        Depending on the destination, these periods may offer a better balance of weather, prices,
        and availability.
      </>
    ),
  },
  {
    title: "Compare One-Way and Round-Trip Tickets",
    body: (
      <>
        Sometimes a round-trip ticket is the best value. In other cases, separate one-way tickets or
        different airlines may offer a competitive total price. Always check baggage rules and
        connection risks.
      </>
    ),
  },
  {
    title: "Review Fare Restrictions",
    body: (
      <>
        Before purchasing a ticket, understand its change and cancellation rules. A slightly more
        expensive flexible fare may be worthwhile if your plans are uncertain.
      </>
    ),
  },
  {
    title: "Avoid Unnecessary Fees",
    body: (
      <>
        Review baggage limits, payment fees, and other charges before checkout. Choosing the right
        fare from the beginning can prevent unexpected expenses.
      </>
    ),
  },
  {
    title: "Use Price Alerts When Available",
    body: (
      <>
        Price alerts can help you notice fare changes without checking the same route repeatedly.
        Treat alerts as useful signals, not guarantees that prices will fall.
      </>
    ),
  },
  {
    title: "Compare Flights Before You Commit",
    body: (
      <>
        The best flight is not always the cheapest one. Consider arrival times, airport locations,
        layovers, baggage, and the overall convenience of the journey.
      </>
    ),
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

export default function HowToFindCheapFlights() {
  return (
    <PageShell>
      <SEO
        title="How to Find Cheap Flights in 2027 | IPNIA"
        description={metaDescription}
        path={articlePath}
        keywords="how to find cheap flights, cheap flights 2027, save money on flights, compare airfare, affordable flights"
        image={articleImage}
        jsonLd={articleJsonLd}
      />

      <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={articleImage}
            alt="Airplane wing above the clouds at sunset"
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
                <li className="text-slate-700">Cheap flights</li>
              </ol>
            </nav>

            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">IPNIA Travel Guide</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#17324d] sm:text-5xl">
                {articleTitle}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                Planning a vacation doesn&apos;t have to mean spending a fortune on airfare. Whether
                you&apos;re flying across the United States or planning an international adventure,
                knowing how to compare flights can help you make smarter travel decisions.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                In this guide, we&apos;ll explore practical ways to find affordable airfare, avoid
                unnecessary fees, and plan your next trip with confidence.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
                2027 flight planning guide
              </p>
            </header>

            <div className="divide-y divide-slate-100">
              {tips.map((tip, index) => (
                <section key={tip.title} id={`tip-${index + 1}`} className="py-7 first:pt-8">
                  <h2 className="text-2xl font-bold text-[#17324d]">
                    {index + 1}. {tip.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-700">{tip.body}</p>
                </section>
              ))}
            </div>

            <section className="mt-3 rounded-2xl bg-[#f4f7fa] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#17324d]">Final Thoughts</h2>
              <p className="mt-3 leading-7 text-slate-700">
                Finding cheap flights takes a little research, flexibility, and attention to the
                total cost. Compare multiple itineraries, understand fare restrictions, and choose
                the option that best matches your budget.
              </p>
              <p className="mt-3 leading-7 text-slate-700">
                Ready to plan your next trip? Start comparing available routes on IPNIA and find a
                flight that works for your travel plans.
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
