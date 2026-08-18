import { getDestinationBySlug } from "./destinations";

export type SeoRoute = {
  fromSlug: string;
  toSlug: string;
  blurb: string;
};

/**
 * Curated popular routes only — each maps to a real /flights/from/:from/to/:to page.
 * Do NOT auto-generate every origin×destination combination.
 */
export const seoRoutes: SeoRoute[] = [
  { fromSlug: "new-delhi", toSlug: "mumbai", blurb: "India’s busiest domestic corridor for business and leisure." },
  { fromSlug: "mumbai", toSlug: "new-delhi", blurb: "Return metro shuttle between India’s financial and political capitals." },
  { fromSlug: "new-delhi", toSlug: "bangalore", blurb: "Capital-to-tech-hub route popular with corporate travellers." },
  { fromSlug: "mumbai", toSlug: "bangalore", blurb: "West–South India business corridor with frequent daily flights." },
  { fromSlug: "new-delhi", toSlug: "dubai", blurb: "High-demand India–Gulf route for work, family and stopovers." },
  { fromSlug: "mumbai", toSlug: "dubai", blurb: "Classic Mumbai–Dubai corridor with multiple daily options." },
  { fromSlug: "new-delhi", toSlug: "london", blurb: "Flagship India–UK long-haul route for diaspora and business travel." },
  { fromSlug: "mumbai", toSlug: "london", blurb: "West India to UK long-haul favourite." },
  { fromSlug: "new-delhi", toSlug: "singapore", blurb: "India–ASEAN gateway for stopovers and onward Asia travel." },
  { fromSlug: "mumbai", toSlug: "singapore", blurb: "Popular leisure and transit route via Changi." },
  { fromSlug: "new-delhi", toSlug: "bangkok", blurb: "India–Thailand leisure corridor with competitive fares." },
  { fromSlug: "bangalore", toSlug: "dubai", blurb: "Tech-city to Gulf route for professionals and families." },
  { fromSlug: "hyderabad", toSlug: "dubai", blurb: "Strong diaspora and business demand on Hyd–DXB." },
  { fromSlug: "kochi", toSlug: "dubai", blurb: "Kerala–Gulf corridor with year-round demand." },
  { fromSlug: "new-delhi", toSlug: "new-york", blurb: "India–US East Coast long-haul for business and family visits." },
  { fromSlug: "mumbai", toSlug: "new-york", blurb: "Major India–US route via JFK/EWR options." },
  { fromSlug: "new-delhi", toSlug: "san-francisco", blurb: "India–Bay Area corridor for tech travel." },
  { fromSlug: "bangalore", toSlug: "san-francisco", blurb: "Tech hubs connected across India and California." },
  { fromSlug: "new-delhi", toSlug: "toronto", blurb: "India–Canada route popular with students and families." },
  { fromSlug: "mumbai", toSlug: "toronto", blurb: "West India to Canada long-haul demand route." },
  { fromSlug: "new-delhi", toSlug: "paris", blurb: "India–France leisure and business long-haul." },
  { fromSlug: "new-delhi", toSlug: "frankfurt", blurb: "India–Germany transfer and business corridor." },
  { fromSlug: "new-delhi", toSlug: "amsterdam", blurb: "Schiphol transfer favourite from India." },
  { fromSlug: "mumbai", toSlug: "amsterdam", blurb: "West India to Netherlands long-haul option." },
  { fromSlug: "dubai", toSlug: "london", blurb: "Gulf–UK leisure and transit corridor." },
  { fromSlug: "dubai", toSlug: "new-york", blurb: "Long-haul Gulf–US route via Dubai hub." },
  { fromSlug: "london", toSlug: "new-york", blurb: "Classic transatlantic city pair." },
  { fromSlug: "london", toSlug: "paris", blurb: "Short-haul Europe classic for city breaks." },
  { fromSlug: "new-york", toSlug: "london", blurb: "US East Coast to UK flagship route." },
  { fromSlug: "los-angeles", toSlug: "tokyo", blurb: "Pacific long-haul leisure and business corridor." },
  { fromSlug: "singapore", toSlug: "sydney", blurb: "ASEAN–Australia leisure and transit route." },
  { fromSlug: "new-delhi", toSlug: "sydney", blurb: "India–Australia long-haul for diaspora and tourism." },
  { fromSlug: "mumbai", toSlug: "sydney", blurb: "West India to Australia travel corridor." },
  { fromSlug: "new-delhi", toSlug: "doha", blurb: "India–Qatar hub route for global connections." },
  { fromSlug: "mumbai", toSlug: "doha", blurb: "Mumbai–Doha corridor via Hamad International." },
  { fromSlug: "new-delhi", toSlug: "abu-dhabi", blurb: "India–Abu Dhabi route for Etihad connections." },
  { fromSlug: "chennai", toSlug: "singapore", blurb: "South India–ASEAN leisure and business route." },
  { fromSlug: "chennai", toSlug: "dubai", blurb: "Chennai–Gulf corridor with frequent services." },
  { fromSlug: "kolkata", toSlug: "bangkok", blurb: "East India–Thailand leisure route." },
  { fromSlug: "goa", toSlug: "new-delhi", blurb: "Beach getaway domestic route from the capital." },
  { fromSlug: "goa", toSlug: "mumbai", blurb: "Popular west-coast leisure hop." },
  { fromSlug: "jaipur", toSlug: "new-delhi", blurb: "Heritage Golden Triangle domestic hop." },
].filter((r) => getDestinationBySlug(r.fromSlug) && getDestinationBySlug(r.toSlug));

export function getRoute(fromSlug: string, toSlug: string): SeoRoute | undefined {
  return seoRoutes.find((r) => r.fromSlug === fromSlug && r.toSlug === toSlug);
}

export function routesTo(destSlug: string): SeoRoute[] {
  return seoRoutes.filter((r) => r.toSlug === destSlug);
}

export function routesFrom(destSlug: string): SeoRoute[] {
  return seoRoutes.filter((r) => r.fromSlug === destSlug);
}
