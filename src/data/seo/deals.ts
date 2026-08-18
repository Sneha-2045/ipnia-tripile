export type SeoDeal = {
  slug: string;
  title: string;
  category: "flights" | "hotels" | "travel";
  headline: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaPath: string;
  relatedPaths: { label: string; path: string }[];
};

/**
 * Deal / category SEO pages with real CTAs into search experiences.
 * Only pages with meaningful guidance — not date spam.
 */
export const seoDeals: SeoDeal[] = [
  {
    slug: "cheap-flights",
    title: "Cheap Flights",
    category: "flights",
    headline: "Find flexible cheap flights with IPNIA",
    description:
      "Compare live flight offers across domestic India and international routes. Use flexible dates, fewer stops and mid-week departures to unlock better fares.",
    bullets: [
      "Search live Duffel-powered flight offers",
      "Compare one-way and round-trip options",
      "Filter by cabin, stops and schedule",
      "Continue into IPNIA’s secure booking flow",
    ],
    ctaLabel: "Search cheap flights",
    ctaPath: "/flights/search",
    relatedPaths: [
      { label: "Domestic flights", path: "/deals/domestic-flights" },
      { label: "International flights", path: "/deals/international-flights" },
      { label: "Flight destinations", path: "/flights/destinations" },
    ],
  },
  {
    slug: "last-minute-flights",
    title: "Last-Minute Flights",
    category: "flights",
    headline: "Last-minute flights when plans change",
    description:
      "Need to travel soon? Search near-term departures and compare remaining inventory across major airlines.",
    bullets: [
      "Search for near-term departure dates",
      "Prioritise direct or one-stop options",
      "Check baggage and fare rules carefully",
      "Pair with hotel search for same-city arrivals",
    ],
    ctaLabel: "Search last-minute flights",
    ctaPath: "/flights/search",
    relatedPaths: [
      { label: "Cheap flights", path: "/deals/cheap-flights" },
      { label: "One-way flights", path: "/deals/one-way-flights" },
    ],
  },
  {
    slug: "round-trip-flights",
    title: "Round-Trip Flights",
    category: "flights",
    headline: "Book round-trip flights in one search",
    description:
      "Round-trip itineraries often simplify pricing and scheduling. Search outbound and return together on IPNIA.",
    bullets: [
      "Select round-trip in flight search",
      "Compare total journey duration",
      "Look for aligned airline partnerships",
      "Add hotel nights for the destination stay",
    ],
    ctaLabel: "Search round-trip flights",
    ctaPath: "/flights/search",
    relatedPaths: [
      { label: "One-way flights", path: "/deals/one-way-flights" },
      { label: "Popular routes", path: "/flights/destinations" },
    ],
  },
  {
    slug: "one-way-flights",
    title: "One-Way Flights",
    category: "flights",
    headline: "Flexible one-way flight tickets",
    description:
      "One-way tickets suit open returns, multi-city trips and relocation travel. Search any supported city pair on IPNIA.",
    bullets: [
      "Ideal for open-jaw and multi-city trips",
      "Compare cabin options independently",
      "Useful for student and relocation travel",
      "Combine with destination hotel search",
    ],
    ctaLabel: "Search one-way flights",
    ctaPath: "/flights/search",
    relatedPaths: [
      { label: "Round-trip flights", path: "/deals/round-trip-flights" },
      { label: "Student flights", path: "/deals/student-flights" },
    ],
  },
  {
    slug: "business-class-flights",
    title: "Business Class Flights",
    category: "flights",
    headline: "Business class for long-haul comfort",
    description:
      "Filter for business cabin when searching long-haul routes from India to the Gulf, Europe, US and Asia-Pacific.",
    bullets: [
      "Select business cabin in search filters",
      "Compare lie-flat and premium product notes",
      "Useful for corporate and China business travel",
      "Talk to IPNIA for complex itineraries",
    ],
    ctaLabel: "Search business class",
    ctaPath: "/flights/search",
    relatedPaths: [
      { label: "First class flights", path: "/deals/first-class-flights" },
      { label: "Business travel", path: "/business-travel" },
    ],
  },
  {
    slug: "first-class-flights",
    title: "First Class Flights",
    category: "flights",
    headline: "First class long-haul experiences",
    description:
      "Explore first and premium cabins on select international routes. Availability varies by airline and date.",
    bullets: [
      "Premium cabin inventory is limited",
      "Best searched early for peak seasons",
      "Pair with luxury hotel recommendations",
      "Ask IPNIA for bespoke itinerary support",
    ],
    ctaLabel: "Search premium flights",
    ctaPath: "/flights/search",
    relatedPaths: [
      { label: "Business class", path: "/deals/business-class-flights" },
      { label: "Luxury hotels", path: "/deals/luxury-hotels" },
    ],
  },
  {
    slug: "international-flights",
    title: "International Flights",
    category: "flights",
    headline: "International flights from India and beyond",
    description:
      "Search worldwide destinations — Gulf, Europe, North America, ASEAN and more — with live airline offers.",
    bullets: [
      "Passport details required for international bookings",
      "Compare hub airlines like Emirates, Qatar and Singapore Airlines",
      "Check visa and transit rules separately",
      "Add hotels at your destination",
    ],
    ctaLabel: "Search international flights",
    ctaPath: "/flights/search",
    relatedPaths: [
      { label: "Countries", path: "/flights/countries" },
      { label: "Airlines", path: "/flights/airlines" },
    ],
  },
  {
    slug: "domestic-flights",
    title: "Domestic Flights",
    category: "flights",
    headline: "Domestic flights within India",
    description:
      "Book India domestic routes such as Delhi–Mumbai, Bangalore, Hyderabad, Goa and more. Passport is not required for India–India journeys on IPNIA.",
    bullets: [
      "No passport step for India domestic bookings",
      "Carry a valid government photo ID",
      "Frequent daily flights on metro routes",
      "Combine with domestic hotel search",
    ],
    ctaLabel: "Search domestic flights",
    ctaPath: "/flights/search",
    relatedPaths: [
      { label: "Flights to Mumbai", path: "/flights/to/mumbai" },
      { label: "Flights to New Delhi", path: "/flights/to/new-delhi" },
      { label: "Hotels in India", path: "/hotels/countries/india" },
    ],
  },
  {
    slug: "student-flights",
    title: "Student Flights",
    category: "flights",
    headline: "Student flight planning with IPNIA",
    description:
      "Planning university travel? Search one-way and long-stay friendly itineraries, then explore IPNIA Education Travel for immersion programmes.",
    bullets: [
      "Prefer flexible one-way tickets",
      "Check baggage allowances for long stays",
      "Explore education travel programmes",
      "Ask IPNIA for multi-city student itineraries",
    ],
    ctaLabel: "Search student-friendly flights",
    ctaPath: "/flights/search",
    relatedPaths: [
      { label: "Education Travel", path: "/education-travel" },
      { label: "One-way flights", path: "/deals/one-way-flights" },
    ],
  },
  {
    slug: "family-travel",
    title: "Family Travel",
    category: "travel",
    headline: "Family flights and hotel stays",
    description:
      "Coordinate flights and hotels for family trips — domestic holidays, Gulf visits and long-haul reunions.",
    bullets: [
      "Search multi-passenger flight offers",
      "Choose family-friendly hotel destinations",
      "Consider daytime arrivals with children",
      "Contact IPNIA for bespoke family planning",
    ],
    ctaLabel: "Start family trip search",
    ctaPath: "/flights/search",
    relatedPaths: [
      { label: "Hotel deals", path: "/deals/hotel-deals" },
      { label: "Experience Travel", path: "/experience-travel" },
    ],
  },
  {
    slug: "hotels",
    title: "Hotel Deals",
    category: "hotels",
    headline: "Search hotels worldwide with IPNIA",
    description:
      "Find lodging via Google Places–powered hotel search. Explore city pages for destination context, then search live availability.",
    bullets: [
      "Search any supported city worldwide",
      "Browse photos, ratings and map details",
      "Filter by amenities and property type",
      "Enquire with IPNIA for curated shortlists",
    ],
    ctaLabel: "Search hotels",
    ctaPath: "/hotels/search",
    relatedPaths: [
      { label: "Hotel destinations", path: "/hotels/destinations" },
      { label: "Luxury hotels", path: "/deals/luxury-hotels" },
    ],
  },
  {
    slug: "cheap-hotels",
    title: "Cheap Hotels",
    category: "hotels",
    headline: "Value hotel stays by destination",
    description:
      "Start from a destination page, then search live hotels and sort by guest ratings and property type to find value options.",
    bullets: [
      "Use destination hotel pages for context",
      "Compare guest ratings and review counts",
      "Look at popular areas for better value",
      "Ask IPNIA for budget shortlists",
    ],
    ctaLabel: "Browse hotel destinations",
    ctaPath: "/hotels/destinations",
    relatedPaths: [
      { label: "Hotel deals", path: "/deals/hotel-deals" },
      { label: "Hotels under guidance", path: "/deals/hotels-under-200" },
    ],
  },
  {
    slug: "luxury-hotels",
    title: "Luxury Hotels",
    category: "hotels",
    headline: "Luxury and premium hotel planning",
    description:
      "Explore premium destinations and high-rated properties. IPNIA can help shortlist luxury stays for business or leisure.",
    bullets: [
      "Target highly rated city properties",
      "Pair with business or first-class flights",
      "Consider iconic areas (Mayfair, Marina, Marina Bay)",
      "Contact IPNIA for concierge-style planning",
    ],
    ctaLabel: "Search luxury destinations",
    ctaPath: "/hotels/destinations",
    relatedPaths: [
      { label: "Experience Travel", path: "/experience-travel" },
      { label: "Hotels in Dubai", path: "/hotels/dubai" },
      { label: "Hotels in London", path: "/hotels/london" },
    ],
  },
  {
    slug: "hotel-deals",
    title: "Hotel Deals Overview",
    category: "hotels",
    headline: "Hotel deals and destination guides",
    description:
      "Use IPNIA hotel destination pages for neighbourhood context, then run a live Places search for current listings.",
    bullets: [
      "Destination pages explain areas and attractions",
      "Live search shows current lodging inventory",
      "No temporary search URLs are indexed",
      "Enquire for negotiated or curated stays",
    ],
    ctaLabel: "Explore hotel destinations",
    ctaPath: "/hotels/destinations",
    relatedPaths: [
      { label: "Cheap hotels", path: "/deals/cheap-hotels" },
      { label: "Luxury hotels", path: "/deals/luxury-hotels" },
    ],
  },
  {
    slug: "hotels-under-100",
    title: "Value Hotels Guide",
    category: "hotels",
    headline: "Planning stays on a tighter budget",
    description:
      "Google Places listings vary by market and season. Use destination guides and filters to shortlist value-friendly areas, then confirm live rates with IPNIA.",
    bullets: [
      "Prices vary by city and season",
      "Focus on well-reviewed midscale areas",
      "Compare multiple neighbourhoods",
      "IPNIA can help validate value shortlists",
    ],
    ctaLabel: "Search hotels",
    ctaPath: "/hotels/search",
    relatedPaths: [
      { label: "Cheap hotels", path: "/deals/cheap-hotels" },
      { label: "Hotels under 200 guide", path: "/deals/hotels-under-200" },
    ],
  },
  {
    slug: "hotels-under-200",
    title: "Mid-Range Hotels Guide",
    category: "hotels",
    headline: "Mid-range hotel planning tips",
    description:
      "Balance location, ratings and amenities for mid-range stays. Start with a destination page, then search live hotels for your dates.",
    bullets: [
      "Prioritise guest rating and review volume",
      "Stay near transit for city itineraries",
      "Check property type and amenities",
      "Combine with flight search for full trips",
    ],
    ctaLabel: "Browse destinations",
    ctaPath: "/hotels/destinations",
    relatedPaths: [
      { label: "Hotel deals", path: "/deals/hotel-deals" },
      { label: "Family travel", path: "/deals/family-travel" },
    ],
  },
];

export function getDealBySlug(slug: string): SeoDeal | undefined {
  return seoDeals.find((d) => d.slug === slug);
}

export function dealsByCategory(category: SeoDeal["category"]) {
  return seoDeals.filter((d) => d.category === category);
}
