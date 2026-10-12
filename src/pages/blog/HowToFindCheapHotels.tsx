import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

const articlePath = "/blog/how-to-find-cheap-hotels";
const articleTitle = "How to Find Cheap Hotels in the USA Without Sacrificing Comfort";
const metaTitle = "How to Find Cheap Hotels in the USA | IPNIA";
const metaDescription =
  "Learn how to find affordable hotels across the USA with smart comparison tips, location advice, and ways to avoid unexpected booking fees.";
const articleImage = "/assets/destinations/hotel-boutique.jpg";

const tips = [
  {
    title: "Compare the Total Price",
    description: "Don't judge a hotel by its nightly rate alone. Taxes, resort fees, parking, and other charges can increase the final cost. Compare the total amount payable for your complete stay whenever possible.",
  },
  {
    title: "Choose Your Location Carefully",
    description: "A hotel outside a popular tourist area may have a lower nightly rate. However, additional transportation expenses can reduce those savings. Consider public transportation, walking distances, airport transfers, and your planned activities.",
  },
  {
    title: "Compare Different Property Types",
    description: "Depending on your needs, consider budget hotels, extended-stay properties, boutique hotels, and vacation rentals. Families may value kitchen facilities and extra space, while solo travelers might prefer a centrally located room close to public transportation.",
  },
  {
    title: "Consider Flexible Travel Dates",
    description: "Accommodation prices often change with demand, local events, holidays, and seasonality. Compare nearby dates if your plans allow flexibility.",
  },
  {
    title: "Review Cancellation Policies",
    description: "A nonrefundable room may have a lower upfront price, but it can be costly if your plans change. Check the cancellation deadline and refund conditions before booking.",
  },
  {
    title: "Look Beyond the Star Rating",
    description: "A hotel's location, cleanliness, recent guest feedback, amenities, and service can be just as important as its star classification. Read recent reviews and look for recurring comments rather than relying on a single review.",
  },
  {
    title: "Check What Is Included",
    description: "Breakfast, Wi-Fi, parking, airport transfers, and gym access may or may not be included. Choose amenities that genuinely matter to your trip.",
  },
  {
    title: "Compare Hotel and Flight Costs Together",
    description: "Your destination and travel dates affect both airfare and hotel availability. Compare different date combinations and calculate the overall vacation cost before making a decision.",
  },
  {
    title: "Understand Deposit and Payment Rules",
    description: "Check whether the hotel requires a deposit, charges your card immediately, or collects payment at the property. Understand the property's incidental deposit policy as well.",
  },
  {
    title: "Book According to Your Needs",
    description: "The best hotel is the one that offers the right balance of location, comfort, amenities, flexibility, and total cost.",
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

export default function HowToFindCheapHotels() {
  return (
    <PageShell>
      <SEO
        title={metaTitle}
        description={metaDescription}
        path={articlePath}
        keywords="how to find cheap hotels, affordable hotels USA, budget hotel booking, compare hotel prices, hotel booking fees"
        image={articleImage}
        jsonLd={articleJsonLd}
      />

      <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={articleImage}
            alt="Bright boutique hotel lobby with indoor greenery"
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
                <li className="text-slate-700">Affordable hotels</li>
              </ol>
            </nav>

            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">IPNIA Travel Guide</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#17324d] sm:text-5xl">
                {articleTitle}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                Finding a comfortable hotel at a reasonable price can make a significant difference
                to your vacation budget. Whether you&apos;re visiting New York, Los Angeles, Orlando,
                or a smaller American destination, comparing accommodation options carefully can
                help you get better value.
              </p>
            </header>

            <div className="divide-y divide-slate-100">
              {tips.map((tip, index) => (
                <section key={tip.title} id={`tip-${index + 1}`} className="py-7 first:pt-8">
                  <h2 className="text-2xl font-bold text-[#17324d]">
                    {index + 1}. {tip.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-700">{tip.description}</p>
                  {index === 7 && (
                    <p className="mt-3 text-base leading-7 text-slate-700">
                      Use the{" "}
                      <Link to="/hotels/search" className="font-semibold text-[#805d12] underline underline-offset-4">
                        IPNIA hotel search page
                      </Link>{" "}
                      to explore available accommodation options.
                    </p>
                  )}
                </section>
              ))}
            </div>

            <section className="mt-3 border-t border-slate-100 py-7">
              <h2 className="text-2xl font-bold text-[#17324d]">Final Thoughts</h2>
              <p className="mt-3 leading-7 text-slate-700">
                Saving money on accommodation doesn&apos;t mean choosing the lowest-priced room
                available. Compare total costs, read recent reviews, check cancellation rules, and
                choose a property that fits your itinerary.
              </p>
              <p className="mt-3 leading-7 text-slate-700">
                Start comparing hotel options on IPNIA and plan a comfortable stay that works with
                your budget.
              </p>
              <Link
                to="/hotels/search"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e4b64f] px-5 py-2.5 font-semibold text-[#10243c] transition-colors hover:bg-[#f0c96b]"
              >
                Search hotels <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
