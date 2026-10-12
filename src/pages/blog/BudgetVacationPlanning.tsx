import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

const articlePath = "/blog/budget-vacation-planning";
const articleTitle = "How to Plan a Vacation on a Budget: Flights, Hotels, and Hidden Costs";
const metaTitle = "How to Plan a Vacation on a Budget | IPNIA";
const metaDescription = "Plan an affordable vacation with practical tips for flights, hotels, transportation, food, activities, and avoiding unexpected travel expenses.";
const articleImage = "/assets/blog/budget-vacation-planning-hero.png";

const tips = [
  { title: "Set Your Total Travel Budget", text: "Decide how much you can comfortably spend on the entire vacation. Divide your budget into categories such as transportation, accommodation, meals, activities, and emergency expenses. Include costs that are easy to overlook, such as airport transfers, parking, baggage fees, and local taxes." },
  { title: "Choose a Destination That Fits Your Budget", text: "Some destinations have affordable flights but expensive accommodation. Others may cost more to reach but offer less expensive lodging and food. Compare the overall cost rather than choosing a destination based on airfare alone." },
  { title: "Compare Flight Options", text: "Review multiple departure dates, airports, airlines, and itineraries. Consider baggage fees, layovers, and arrival times before selecting a ticket." },
  { title: "Find Accommodation That Offers Value", text: "Compare hotels by location, total price, amenities, and cancellation policies. Staying near public transportation may help reduce local transportation expenses. A room with a kitchen or included breakfast may also help you manage food costs." },
  { title: "Plan Transportation in Advance", text: "Research public transportation, airport transfers, rental cars, and walking options. Renting a car may be useful for a road trip but unnecessary for a city vacation. Account for fuel, parking, tolls, and insurance when estimating rental costs." },
  { title: "Prioritize Your Activities", text: "Make a list of the experiences you most want to enjoy. Research admission prices and reservation requirements, then balance paid attractions with free parks, walking tours, public spaces, and cultural sites." },
  { title: "Watch Out for Hidden Fees", text: "Read the details of flight tickets, hotel bookings, rental-car agreements, and attraction tickets. Check for optional add-ons and cancellation penalties before confirming a purchase." },
  { title: "Leave Room for Unexpected Expenses", text: "Keep part of your budget available for emergencies, travel disruptions, or unexpected transportation needs. Avoid planning every dollar so tightly that a small change disrupts your trip." },
  { title: "Compare the Whole Trip Before Booking", text: "A cheaper flight may arrive at an inconvenient time or require expensive transportation. A more expensive hotel may include amenities that reduce other expenses. Compare combinations of flights, accommodation, and transportation to understand the full cost." },
  { title: "Review Your Spending", text: "Track your expenses during the trip and adjust where needed. If one activity costs more than expected, consider lower-cost alternatives elsewhere rather than abandoning your plans." },
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

export default function BudgetVacationPlanning() {
  return (
    <PageShell>
      <SEO title={metaTitle} description={metaDescription} path={articlePath}
        keywords="budget vacation planning, affordable travel, vacation costs, save on flights and hotels"
        image={articleImage} jsonLd={articleJsonLd} />
      <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img src={articleImage} alt="Travel budget and trip essentials laid out beside an airport window" className="h-64 w-full object-cover sm:h-80 lg:h-[26rem]" fetchPriority="high" />
          <div className="px-5 py-8 sm:px-10 sm:py-12">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link to="/" className="hover:text-[#805d12]">Home</Link></li><li aria-hidden="true">/</li>
                <li><Link to="/blog" className="hover:text-[#805d12]">Blogs</Link></li><li aria-hidden="true">/</li>
                <li className="text-slate-700">Budget vacation planning</li>
              </ol>
            </nav>
            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">IPNIA Travel Guide</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#17324d] sm:text-5xl">{articleTitle}</h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">A memorable vacation doesn&apos;t have to exceed your budget. With careful planning, you can compare destinations, prioritize the experiences you value, and avoid unexpected expenses.</p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">The key is to estimate the full cost of your trip before booking.</p>
            </header>
            <div className="divide-y divide-slate-100">
              {tips.map((tip, index) => (
                <section key={tip.title} id={`tip-${index + 1}`} className="py-7 first:pt-8">
                  <h2 className="text-2xl font-bold text-[#17324d]">{index + 1}. {tip.title}</h2>
                  <p className="mt-3 text-base leading-7 text-slate-700">{tip.text}</p>
                  {index === 2 && <p className="mt-3 leading-7 text-slate-700">Start comparing available flights on the <Link to="/flights/search" className="font-semibold text-[#805d12] underline underline-offset-2">IPNIA flight search page</Link>.</p>}
                  {index === 3 && <p className="mt-3 leading-7 text-slate-700">Explore available stays with the <Link to="/hotels/search" className="font-semibold text-[#805d12] underline underline-offset-2">IPNIA hotel search page</Link>.</p>}
                </section>
              ))}
            </div>
            <section className="mt-3 rounded-2xl bg-[#f4f7fa] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#17324d]">Final Thoughts</h2>
              <p className="mt-3 leading-7 text-slate-700">Budget travel is about making informed choices, not missing out on everything you enjoy. Set a realistic spending limit, compare the complete cost of your itinerary, and prioritize the experiences that matter most.</p>
              <p className="mt-3 leading-7 text-slate-700">Start planning your next trip with IPNIA by comparing available flights and accommodation options that fit your budget.</p>
              <Link to="/flights/search" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e4b64f] px-5 py-2.5 font-semibold text-[#10243c] transition-colors hover:bg-[#f0c96b]">Compare flights <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
            </section>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
