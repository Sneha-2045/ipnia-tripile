import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

const articlePath = "/blog/hotel-vs-airbnb";
const articleTitle = "Hotel vs. Airbnb: Which Is Better for Your Next Vacation?";
const metaTitle = "Hotel vs. Airbnb: Which Is Better for Your Vacation? | IPNIA";
const metaDescription =
  "Compare hotels and vacation rentals by price, amenities, location, privacy, and fees to choose the right accommodation for your trip.";
const articleImage = "/assets/destinations/hotel-heritage.jpg";

const comparisons = [
  {
    title: "Compare the Total Cost",
    description: "Hotels generally charge by room and night, while vacation rentals may offer a full property or multiple bedrooms. However, rental cleaning fees, service fees, taxes, deposits, and minimum-stay requirements can change the final cost. Compare the total price for the same dates and number of guests.",
  },
  {
    title: "Consider the Space You Need",
    description: "Vacation rentals may provide kitchens, living rooms, laundry facilities, and separate bedrooms. These features can be useful for families or longer stays. Hotels may be more convenient for short trips when you don't need additional space.",
  },
  {
    title: "Look at the Location",
    description: "A centrally located hotel may reduce transportation expenses. A rental farther away could offer more room but require additional travel time. Check public transportation, parking, walking distances, and access to your planned activities.",
  },
  {
    title: "Compare Services and Amenities",
    description: "Hotels may offer front-desk assistance, housekeeping, restaurants, fitness facilities, and luggage storage, depending on the property. Vacation rentals can provide a more residential experience, but services and amenities vary considerably.",
  },
  {
    title: "Review Safety and Guest Policies",
    description: "Check recent reviews, check-in procedures, cancellation terms, property rules, and available support if something goes wrong. For rentals, understand the check-in process and any cleaning or checkout requirements.",
  },
  {
    title: "Think About Your Trip Length",
    description: "For a short city break, a hotel near major attractions may be convenient. For a larger group or extended stay, a rental with multiple bedrooms and a kitchen may offer better value. Neither option is automatically cheaper in every destination.",
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

export default function HotelVsAirbnb() {
  return (
    <PageShell>
      <SEO
        title={metaTitle}
        description={metaDescription}
        path={articlePath}
        keywords="hotel vs Airbnb, hotels vs vacation rentals, compare accommodation, hotel or rental for vacation"
        image={articleImage}
        jsonLd={articleJsonLd}
      />

      <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={articleImage}
            alt="Elegant hotel courtyard with a reflecting pool and guest rooms"
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
                <li className="text-slate-700">Hotels vs. vacation rentals</li>
              </ol>
            </nav>

            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">IPNIA Travel Guide</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#17324d] sm:text-5xl">
                {articleTitle}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                Choosing where to stay can shape your entire travel experience. Hotels and vacation
                rentals each offer advantages, but the right choice depends on your destination,
                group size, trip duration, and budget.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Here&apos;s how to compare the two options.
              </p>
            </header>

            <div className="divide-y divide-slate-100">
              {comparisons.map((comparison, index) => (
                <section key={comparison.title} id={`comparison-${index + 1}`} className="py-7 first:pt-8">
                  <h2 className="text-2xl font-bold text-[#17324d]">
                    {index + 1}. {comparison.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-700">{comparison.description}</p>
                </section>
              ))}
            </div>

            <section className="border-t border-slate-100 py-7">
              <h2 className="text-2xl font-bold text-[#17324d]">Which Should You Choose?</h2>
              <ul className="mt-4 space-y-3 text-base leading-7 text-slate-700">
                <li className="rounded-xl bg-slate-50 px-4 py-3">
                  <strong className="text-[#17324d]">Choose a hotel if</strong> you value convenient
                  services, a predictable check-in process, and amenities offered by the property.
                </li>
                <li className="rounded-xl bg-slate-50 px-4 py-3">
                  <strong className="text-[#17324d]">Consider a vacation rental if</strong> you need
                  extra space, separate bedrooms, kitchen facilities, or a residential setting.
                </li>
              </ul>
            </section>

            <section className="mt-3 rounded-2xl bg-[#f4f7fa] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#17324d]">Final Thoughts</h2>
              <p className="mt-3 leading-7 text-slate-700">
                The best accommodation depends on what matters most to you. Compare the total price,
                location, amenities, cancellation policies, and recent reviews before deciding.
              </p>
              <p className="mt-3 leading-7 text-slate-700">
                Explore available hotel options on IPNIA and compare them against your itinerary and
                budget to make an informed choice.
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
