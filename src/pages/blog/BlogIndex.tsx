import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { PageShell } from "@/components/layout/PageShell";
import { SITE_ORIGIN } from "@/lib/seo/site";

const posts = [
  {
    title: "How to Find Cheap Flights in 2027: 12 Tips to Save Money",
    description: "Discover practical ways to compare airfare, choose flexible dates, and save on your next trip.",
    image: "/assets/destinations/hero-travel.jpg",
    imageAlt: "Airplane wing above the clouds at sunset",
    path: "/blog/how-to-find-cheap-flights",
  },
  {
    title: "15 Best Places to Travel in the USA for Every Type of Traveler",
    description: "Explore iconic cities, national parks, beaches, and unforgettable US vacation destinations.",
    image: "/assets/destinations/dest-newyork.jpg",
    imageAlt: "New York City skyline at sunset",
    path: "/blog/best-places-to-travel-in-usa",
  },
  {
    title: "How to Find Cheap Hotels in the USA Without Sacrificing Comfort",
    description: "Learn to compare hotel costs, choose the right location, and avoid unexpected fees when booking a stay.",
    image: "/assets/destinations/hotel-boutique.jpg",
    imageAlt: "Bright boutique hotel lobby with indoor greenery",
    path: "/blog/how-to-find-cheap-hotels",
  },
  {
    title: "Best All-Inclusive Resorts Near the USA for a Stress-Free Vacation",
    description: "Explore resort destinations in Mexico and the Caribbean, plus tips for choosing an all-inclusive stay.",
    image: "/assets/destinations/hotel-beach.jpg",
    imageAlt: "Beachfront resort pool overlooking the sea at sunset",
    path: "/blog/best-all-inclusive-resorts",
  },
  {
    title: "Best Time to Book International Flights from the USA",
    description: "Learn how seasonality, flexible dates, and fare rules can help you compare international flight options.",
    image: "/assets/destinations/dest-singapore.jpg",
    imageAlt: "Singapore skyline and waterfront at dusk",
    path: "/blog/best-time-to-book-international-flights",
  },
  {
    title: "10 Best Road Trips in the USA for an Unforgettable Vacation",
    description: "Discover scenic American routes from the Pacific Coast to national parks, with practical planning tips.",
    image: "/assets/blog/usa-road-trip-hero.png",
    imageAlt: "A winding road through red-rock canyons in the American Southwest at sunset",
    path: "/blog/best-road-trips-in-usa",
  },
  {
    title: "First-Time International Travel from the USA: The Complete Checklist",
    description: "Prepare for your first trip abroad with practical advice on travel documents, flights, accommodation, money, and packing.",
    image: "/assets/blog/international-checklist-hero.png",
    imageAlt: "Passport and travel essentials prepared near an airport window",
    path: "/blog/international-travel-checklist",
  },
  {
    title: "Hotel vs. Airbnb: Which Is Better for Your Next Vacation?",
    description: "Compare accommodation costs, space, location, amenities, and policies to choose what suits your trip.",
    image: "/assets/destinations/hotel-heritage.jpg",
    imageAlt: "Elegant hotel courtyard with a reflecting pool and guest rooms",
    path: "/blog/hotel-vs-airbnb",
  },
  {
    title: "Best Places to Travel in the USA by Month: A Month-by-Month Guide",
    description: "Find seasonal US travel inspiration for every month, from winter escapes and spring city breaks to summer adventures and fall foliage.",
    image: "/assets/blog/usa-month-by-month-hero.png",
    imageAlt: "Seasonal USA travel landscapes across the year",
    path: "/blog/best-places-to-visit-usa-by-month",
  },
  {
    title: "How to Plan a Vacation on a Budget: Flights, Hotels, and Hidden Costs",
    description: "Plan an affordable vacation with practical advice for comparing transportation, accommodation, activities, and trip expenses.",
    image: "/assets/blog/budget-vacation-planning-hero.png",
    imageAlt: "Travel budget and trip essentials beside an airport window",
    path: "/blog/budget-vacation-planning",
  },
  {
    title: "How to Plan a Family Vacation: Flights, Hotels, and Activities",
    description: "Plan a family trip with advice on choosing a destination, comparing travel options, and building a relaxed itinerary.",
    image: "/assets/blog/family-vacation-hero.png",
    imageAlt: "A family enjoying a seaside holiday together",
    path: "/blog/family-vacation-planning",
  },
  {
    title: "Solo Travel Tips: How to Plan a Memorable Trip on Your Own",
    description: "Prepare for solo travel with practical planning tips for your destination, flights, accommodation, and itinerary.",
    image: "/assets/blog/solo-travel-hero.png",
    imageAlt: "A solo traveler looking out over a historic city",
    path: "/blog/solo-travel-tips",
  },
  {
    title: "Weekend Getaways in the USA: 10 Trip Ideas and Planning Tips",
    description: "Explore US weekend break ideas, from city escapes to coastal and mountain trips, with tips for making short trips count.",
    image: "/assets/blog/weekend-getaways-hero.png",
    imageAlt: "A scenic American road trip at a mountain overlook",
    path: "/blog/weekend-getaways-usa",
  },
  {
    title: "Travel Packing Checklist: What to Pack for Your Next Trip",
    description: "Organize travel documents, clothes, toiletries, medication, electronics, and carry-on essentials with this practical packing guide.",
    image: "/assets/blog/packing-checklist-hero.png",
    imageAlt: "A suitcase organized with clothes and travel essentials",
    path: "/blog/travel-packing-checklist",
  },
  {
    title: "Airport Tips for a Smoother Trip: Check-In, Security, and Connections",
    description: "Prepare for check-in, baggage, screening, flight connections, delays, and navigating the airport with practical travel tips.",
    image: "/assets/blog/airport-tips-hero.png",
    imageAlt: "A traveler checking flight details in an airport terminal",
    path: "/blog/airport-travel-tips",
  },
];

const blogIndexJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "IPNIA Travel Blog",
  url: `${SITE_ORIGIN}/blog`,
  publisher: { "@type": "Organization", name: "Ipnia Services Pvt Ltd" },
};

export default function BlogIndex() {
  return (
    <PageShell>
      <SEO
        title="IPNIA Travel Blog | Flight and Destination Guides"
        description="Explore IPNIA travel guides with practical flight booking advice and destination inspiration for your next trip."
        path="/blog"
        keywords="IPNIA travel blog, flight guides, travel tips, destination guides"
        image="/assets/destinations/hero-travel.jpg"
        jsonLd={blogIndexJsonLd}
      />
      <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-9 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#946b19]">Travel inspiration</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-[#17324d] sm:text-5xl">IPNIA Travel Blog</h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Practical flight advice and destination guides to help you plan your next journey.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post.path} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <Link to={post.path} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600">
                  <img src={post.image} alt={post.imageAlt} className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#17324d] group-hover:text-[#805d12]">{post.title}</h2>
                    <p className="mt-3 leading-7 text-slate-600">{post.description}</p>
                    <span className="mt-5 inline-flex font-semibold text-[#805d12]">Read guide <span aria-hidden="true" className="ml-2">→</span></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
