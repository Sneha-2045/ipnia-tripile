import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

const articlePath = "/blog/best-places-to-visit-usa-by-month";
const articleTitle = "Best Places to Travel in the USA by Month: A Month-by-Month Guide";
const metaTitle = "Best Places to Visit in the USA by Month | IPNIA";
const metaDescription = "Discover US travel ideas for every month of the year, including winter escapes, spring city breaks, summer adventures, and fall foliage trips.";
const articleImage = "/assets/blog/usa-month-by-month-hero.png";

const months = [
  { month: 'January: Miami, Florida', description: 'Miami offers beaches, restaurants, cultural attractions, and warm-weather activities. Winter is a popular travel period, so compare accommodation prices before booking.' },
  { month: 'February: New Orleans, Louisiana', description: 'February can coincide with Mardi Gras celebrations, depending on the calendar. Expect busy periods and plan accommodation well in advance if you want to attend major events.' },
  { month: 'March: Washington, D.C.', description: "Spring brings opportunities to explore museums, monuments, and the city's famous cherry blossoms, whose timing varies with weather conditions." },
  { month: 'April: San Diego, California', description: 'Explore coastal neighborhoods, outdoor attractions, and waterfront areas. Check local event calendars when selecting travel dates.' },
  { month: 'May: Charleston, South Carolina', description: 'Charleston offers historic architecture, coastal excursions, gardens, and Southern cuisine.' },
  { month: 'June: Yellowstone National Park', description: 'Early summer can provide access to many park roads and outdoor activities, depending on current conditions. Check official park information before planning your visit.' },
  { month: 'July: Seattle, Washington', description: "Seattle offers waterfront activities, markets, and access to the Pacific Northwest's outdoor attractions. Summer is popular, so accommodation may require advance planning." },
  { month: 'August: Glacier National Park, Montana', description: 'Consider Glacier for mountain scenery and hiking. Research trail conditions, access restrictions, and any required vehicle reservations.' },
  { month: 'September: Boston, Massachusetts', description: "Early autumn can be a good time to explore Boston's history, neighborhoods, museums, and food scene." },
  { month: 'October: Vermont, New England', description: 'Autumn foliage attracts visitors to Vermont and neighboring New England states. Peak colors vary by location and weather, so check local foliage reports.' },
  { month: 'November: New York City, New York', description: "November is a popular time to experience seasonal events, museums, shopping, and the city's early holiday atmosphere. Prices and crowds vary around major holidays." },
  { month: 'December: Orlando, Florida', description: 'Orlando offers theme parks, seasonal events, and family attractions. Holiday periods can be especially busy, so compare tickets, hotels, and flights early.' }
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

export default function BestPlacesToVisitUSAByMonth() {
  return (
    <PageShell>
      <SEO title={metaTitle} description={metaDescription} path={articlePath}
        keywords="best places to visit in USA by month, USA travel by season, US vacation ideas"
        image={articleImage} jsonLd={articleJsonLd} />
      <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img src={articleImage} alt="A year of travel across the USA, from snowy mountains to fall foliage and sunny coastlines" className="h-64 w-full object-cover sm:h-80 lg:h-[26rem]" fetchPriority="high" />
          <div className="px-5 py-8 sm:px-10 sm:py-12">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link to="/" className="hover:text-[#805d12]">Home</Link></li><li aria-hidden="true">/</li>
                <li><Link to="/blog" className="hover:text-[#805d12]">Blogs</Link></li><li aria-hidden="true">/</li>
                <li className="text-slate-700">USA travel by month</li>
              </ol>
            </nav>
            <header className="border-b border-slate-200 pb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">IPNIA Travel Guide</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#17324d] sm:text-5xl">{articleTitle}</h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">The United States offers very different travel experiences throughout the year. Winter is ideal for some ski destinations and warm-weather escapes, while spring and autumn can be excellent for city breaks and outdoor adventures.</p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">Use this guide to find inspiration for your next vacation.</p>
            </header>
            <div className="divide-y divide-slate-100">
              {months.map((item, index) => <section key={item.month} id={`month-${index + 1}`} className="py-7 first:pt-8"><h2 className="text-2xl font-bold text-[#17324d]">{item.month}</h2><p className="mt-3 text-base leading-7 text-slate-700">{item.description}</p></section>)}
            </div>
            <section className="mt-3 border-t border-slate-100 py-7">
              <h2 className="text-2xl font-bold text-[#17324d]">How to Choose Your Travel Month</h2>
              <p className="mt-3 leading-7 text-slate-700">Consider weather, local events, school holidays, crowds, and your preferred activities. A destination that is ideal for outdoor recreation in one month may have limited access or uncomfortable weather in another.</p>
              <p className="mt-3 leading-7 text-slate-700">Compare travel dates before booking your flights and accommodation.</p>
            </section>
            <section className="mt-3 rounded-2xl bg-[#f4f7fa] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#17324d]">Final Thoughts</h2>
              <p className="mt-3 leading-7 text-slate-700">There is no single best month to visit every US destination. Match the season to your interests, research current local conditions, and build flexibility into your plans.</p>
              <p className="mt-3 leading-7 text-slate-700">Use IPNIA to explore flights and hotel options for your preferred destination and travel dates.</p>
              <Link to="/flights/search" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e4b64f] px-5 py-2.5 font-semibold text-[#10243c] transition-colors hover:bg-[#f0c96b]">Compare flights <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
            </section>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
