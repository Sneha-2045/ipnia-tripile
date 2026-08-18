import { slugify } from "@/lib/seo/site";
import { seoDestinations } from "./destinations";

export type SeoAirline = {
  slug: string;
  name: string;
  iata: string;
  countryName: string;
  countrySlug: string;
  alliance: string | null;
  blurb: string;
  hubSlugs: string[];
};

type AirlineInput = Omit<SeoAirline, "slug"> & { slug?: string };

function a(input: AirlineInput): SeoAirline {
  return { ...input, slug: input.slug || slugify(input.name) };
}

/**
 * Airline catalog for SEO pages. Expand as IPNIA coverage grows —
 * sitemaps pick these up automatically.
 */
export const seoAirlines: SeoAirline[] = [
  a({ name: "Air India", iata: "AI", countryName: "India", countrySlug: "india", alliance: "Star Alliance", blurb: "India’s flag carrier connecting domestic metros with long-haul destinations worldwide.", hubSlugs: ["new-delhi", "mumbai"] }),
  a({ name: "IndiGo", iata: "6E", countryName: "India", countrySlug: "india", alliance: null, blurb: "India’s largest airline by fleet, strong on domestic and short-haul international routes.", hubSlugs: ["new-delhi", "mumbai", "bangalore"] }),
  a({ name: "Vistara", iata: "UK", countryName: "India", countrySlug: "india", alliance: null, blurb: "Full-service Indian carrier known for premium cabins on key domestic and international routes.", hubSlugs: ["new-delhi", "mumbai"] }),
  a({ name: "Akasa Air", iata: "QP", countryName: "India", countrySlug: "india", alliance: null, blurb: "Modern Indian low-cost airline expanding across domestic corridors.", hubSlugs: ["mumbai", "bangalore"] }),
  a({ name: "SpiceJet", iata: "SG", countryName: "India", countrySlug: "india", alliance: null, blurb: "Indian low-cost carrier serving domestic and select international leisure markets.", hubSlugs: ["new-delhi", "hyderabad"] }),
  a({ name: "Emirates", iata: "EK", countryName: "United Arab Emirates", countrySlug: "uae", alliance: null, blurb: "Dubai-based global network airline with extensive India and long-haul connectivity.", hubSlugs: ["dubai"] }),
  a({ name: "Etihad Airways", iata: "EY", countryName: "United Arab Emirates", countrySlug: "uae", alliance: null, blurb: "Abu Dhabi flag carrier connecting India with Europe, US and Australia via AUH.", hubSlugs: ["abu-dhabi"] }),
  a({ name: "Qatar Airways", iata: "QR", countryName: "Qatar", countrySlug: "qatar", alliance: "oneworld", blurb: "Doha-based oneWorld airline and frequent Skytrax top-rated carrier.", hubSlugs: ["doha"] }),
  a({ name: "flydubai", iata: "FZ", countryName: "United Arab Emirates", countrySlug: "uae", alliance: null, blurb: "Dubai low-cost carrier with dense regional Middle East and South Asia network.", hubSlugs: ["dubai"] }),
  a({ name: "Singapore Airlines", iata: "SQ", countryName: "Singapore", countrySlug: "singapore", alliance: "Star Alliance", blurb: "Premium Singapore flag carrier linking India with Asia-Pacific and beyond.", hubSlugs: ["singapore"] }),
  a({ name: "Cathay Pacific", iata: "CX", countryName: "Hong Kong", countrySlug: "hong-kong", alliance: "oneworld", blurb: "Hong Kong’s flag carrier for Asia–Europe and Asia–North America travel.", hubSlugs: ["hong-kong"] }),
  a({ name: "Thai Airways", iata: "TG", countryName: "Thailand", countrySlug: "thailand", alliance: "Star Alliance", blurb: "Thailand’s flag carrier connecting Bangkok with India and global leisure markets.", hubSlugs: ["bangkok"] }),
  a({ name: "Malaysia Airlines", iata: "MH", countryName: "Malaysia", countrySlug: "malaysia", alliance: "oneworld", blurb: "Kuala Lumpur hub airline for ASEAN and long-haul connections.", hubSlugs: ["kuala-lumpur"] }),
  a({ name: "Garuda Indonesia", iata: "GA", countryName: "Indonesia", countrySlug: "indonesia", alliance: "SkyTeam", blurb: "Indonesia’s flag carrier serving Jakarta, Bali and regional Asia.", hubSlugs: ["jakarta", "bali"] }),
  a({ name: "Vietnam Airlines", iata: "VN", countryName: "Vietnam", countrySlug: "vietnam", alliance: "SkyTeam", blurb: "Vietnam flag carrier linking Hanoi and Ho Chi Minh City with Asia and Europe.", hubSlugs: ["hanoi", "ho-chi-minh-city"] }),
  a({ name: "Japan Airlines", iata: "JL", countryName: "Japan", countrySlug: "japan", alliance: "oneworld", blurb: "Japan’s premium carrier for Tokyo and Osaka long-haul services.", hubSlugs: ["tokyo", "osaka"] }),
  a({ name: "All Nippon Airways", iata: "NH", countryName: "Japan", countrySlug: "japan", alliance: "Star Alliance", blurb: "ANA connects Japan with India, North America and Europe via Tokyo.", hubSlugs: ["tokyo"] }),
  a({ name: "Korean Air", iata: "KE", countryName: "South Korea", countrySlug: "south-korea", alliance: "SkyTeam", blurb: "Seoul-based SkyTeam airline for Asia–US and Asia–Europe transfers.", hubSlugs: ["seoul"] }),
  a({ name: "Asiana Airlines", iata: "OZ", countryName: "South Korea", countrySlug: "south-korea", alliance: "Star Alliance", blurb: "South Korean Star Alliance carrier focused on Incheon connections.", hubSlugs: ["seoul"] }),
  a({ name: "China Eastern", iata: "MU", countryName: "China", countrySlug: "china", alliance: "SkyTeam", blurb: "Shanghai-based SkyTeam airline with dense China domestic and Asia network.", hubSlugs: ["shanghai", "beijing"] }),
  a({ name: "China Southern", iata: "CZ", countryName: "China", countrySlug: "china", alliance: null, blurb: "Guangzhou-based carrier important for Canton Fair and South China travel.", hubSlugs: ["guangzhou", "beijing"] }),
  a({ name: "Air China", iata: "CA", countryName: "China", countrySlug: "china", alliance: "Star Alliance", blurb: "Beijing flag carrier for China domestic and international Star Alliance links.", hubSlugs: ["beijing", "shanghai"] }),
  a({ name: "British Airways", iata: "BA", countryName: "United Kingdom", countrySlug: "united-kingdom", alliance: "oneworld", blurb: "UK flag carrier connecting London with India, US and global oneWorld partners.", hubSlugs: ["london"] }),
  a({ name: "Virgin Atlantic", iata: "VS", countryName: "United Kingdom", countrySlug: "united-kingdom", alliance: "SkyTeam", blurb: "UK long-haul airline focused on leisure and premium India–UK–US routes.", hubSlugs: ["london"] }),
  a({ name: "easyJet", iata: "U2", countryName: "United Kingdom", countrySlug: "united-kingdom", alliance: null, blurb: "European low-cost carrier for short-haul UK and Europe city breaks.", hubSlugs: ["london", "manchester"] }),
  a({ name: "Ryanair", iata: "FR", countryName: "Ireland", countrySlug: "ireland", alliance: null, blurb: "Europe’s ultra-low-cost network for short-haul leisure routes.", hubSlugs: ["dublin", "london"] }),
  a({ name: "Air France", iata: "AF", countryName: "France", countrySlug: "france", alliance: "SkyTeam", blurb: "French flag carrier via Paris CDG for Europe, Africa and Americas.", hubSlugs: ["paris"] }),
  a({ name: "KLM", iata: "KL", countryName: "Netherlands", countrySlug: "netherlands", alliance: "SkyTeam", blurb: "Dutch flag carrier hubbing through Amsterdam Schiphol.", hubSlugs: ["amsterdam"] }),
  a({ name: "Lufthansa", iata: "LH", countryName: "Germany", countrySlug: "germany", alliance: "Star Alliance", blurb: "German Star Alliance airline via Frankfurt and Munich hubs.", hubSlugs: ["frankfurt", "munich"] }),
  a({ name: "Swiss International Air Lines", iata: "LX", countryName: "Switzerland", countrySlug: "switzerland", alliance: "Star Alliance", blurb: "Swiss premium carrier connecting Zurich and Geneva worldwide.", hubSlugs: ["zurich", "geneva"] }),
  a({ name: "Austrian Airlines", iata: "OS", countryName: "Austria", countrySlug: "austria", alliance: "Star Alliance", blurb: "Vienna-based Star Alliance airline for Central and Eastern Europe.", hubSlugs: ["vienna"] }),
  a({ name: "Iberia", iata: "IB", countryName: "Spain", countrySlug: "spain", alliance: "oneworld", blurb: "Spanish flag carrier linking Madrid with Europe and Latin America.", hubSlugs: ["madrid"] }),
  a({ name: "Vueling", iata: "VY", countryName: "Spain", countrySlug: "spain", alliance: null, blurb: "Spanish low-cost airline strong on Barcelona and Madrid short-haul.", hubSlugs: ["barcelona", "madrid"] }),
  a({ slug: "ita-airways", name: "ITA Airways", iata: "AZ", countryName: "Italy", countrySlug: "italy", alliance: "SkyTeam", blurb: "Italy’s flag carrier connecting Rome and Milan with Europe and beyond.", hubSlugs: ["rome", "milan"] }),
  a({ name: "Turkish Airlines", iata: "TK", countryName: "Turkey", countrySlug: "turkey", alliance: "Star Alliance", blurb: "Istanbul hub airline with one of the world’s widest destination networks.", hubSlugs: ["istanbul"] }),
  a({ name: "Aegean Airlines", iata: "A3", countryName: "Greece", countrySlug: "greece", alliance: "Star Alliance", blurb: "Greek Star Alliance carrier for Athens and island connections.", hubSlugs: ["athens"] }),
  a({ name: "SAS", iata: "SK", countryName: "Sweden", countrySlug: "sweden", alliance: "SkyTeam", blurb: "Scandinavian airline connecting Nordic capitals with Europe and North America.", hubSlugs: ["stockholm", "copenhagen", "oslo"] }),
  a({ name: "Finnair", iata: "AY", countryName: "Finland", countrySlug: "finland", alliance: "oneworld", blurb: "Helsinki-based oneWorld airline specializing in Europe–Asia shortcuts.", hubSlugs: [] }),
  a({ name: "American Airlines", iata: "AA", countryName: "United States", countrySlug: "united-states", alliance: "oneworld", blurb: "Major US carrier with large domestic network and India–US partner options.", hubSlugs: ["dallas", "new-york", "miami", "chicago"] }),
  a({ name: "Delta Air Lines", iata: "DL", countryName: "United States", countrySlug: "united-states", alliance: "SkyTeam", blurb: "US SkyTeam airline hubbing through Atlanta, New York and Detroit.", hubSlugs: ["atlanta", "new-york", "boston"] }),
  a({ name: "United Airlines", iata: "UA", countryName: "United States", countrySlug: "united-states", alliance: "Star Alliance", blurb: "US Star Alliance carrier with major hubs in Chicago, Newark and San Francisco.", hubSlugs: ["chicago", "new-york", "san-francisco", "houston"] }),
  a({ name: "JetBlue", iata: "B6", countryName: "United States", countrySlug: "united-states", alliance: null, blurb: "US leisure-focused airline strong on East Coast and Caribbean routes.", hubSlugs: ["new-york", "boston", "orlando"] }),
  a({ name: "Southwest Airlines", iata: "WN", countryName: "United States", countrySlug: "united-states", alliance: null, blurb: "Largest US domestic low-cost carrier by passengers.", hubSlugs: ["dallas", "denver", "las-vegas"] }),
  a({ name: "Air Canada", iata: "AC", countryName: "Canada", countrySlug: "canada", alliance: "Star Alliance", blurb: "Canadian flag carrier linking Toronto, Vancouver and Montreal worldwide.", hubSlugs: ["toronto", "vancouver", "montreal"] }),
  a({ name: "WestJet", iata: "WS", countryName: "Canada", countrySlug: "canada", alliance: null, blurb: "Canadian leisure and domestic airline with seasonal sun destinations.", hubSlugs: ["calgary", "toronto", "vancouver"] }),
  a({ name: "Qantas", iata: "QF", countryName: "Australia", countrySlug: "australia", alliance: "oneworld", blurb: "Australian flag carrier for Sydney, Melbourne and Indo-Pacific routes.", hubSlugs: ["sydney", "melbourne"] }),
  a({ name: "Virgin Australia", iata: "VA", countryName: "Australia", countrySlug: "australia", alliance: null, blurb: "Australian domestic and regional leisure carrier.", hubSlugs: ["sydney", "brisbane", "melbourne"] }),
  a({ name: "Air New Zealand", iata: "NZ", countryName: "New Zealand", countrySlug: "new-zealand", alliance: "Star Alliance", blurb: "New Zealand flag carrier hubbing through Auckland.", hubSlugs: ["auckland"] }),
  a({ name: "Ethiopian Airlines", iata: "ET", countryName: "Ethiopia", countrySlug: "ethiopia", alliance: "Star Alliance", blurb: "Africa’s leading long-haul airline via Addis Ababa.", hubSlugs: [] }),
  a({ name: "EgyptAir", iata: "MS", countryName: "Egypt", countrySlug: "egypt", alliance: "Star Alliance", blurb: "Egyptian flag carrier connecting Cairo with Africa, Europe and Asia.", hubSlugs: ["cairo"] }),
  a({ name: "South African Airways", iata: "SA", countryName: "South Africa", countrySlug: "south-africa", alliance: "Star Alliance", blurb: "South African carrier for Johannesburg and Cape Town connections.", hubSlugs: ["johannesburg", "cape-town"] }),
  a({ name: "Kenya Airways", iata: "KQ", countryName: "Kenya", countrySlug: "kenya", alliance: "SkyTeam", blurb: "Nairobi-based SkyTeam airline for East Africa and long-haul Africa links.", hubSlugs: ["nairobi"] }),
  a({ name: "Saudia", iata: "SV", countryName: "Saudi Arabia", countrySlug: "saudi-arabia", alliance: "SkyTeam", blurb: "Saudi flag carrier for Riyadh, Jeddah and pilgrimage travel seasons.", hubSlugs: ["riyadh", "jeddah"] }),
  a({ name: "Gulf Air", iata: "GF", countryName: "Bahrain", countrySlug: "bahrain", alliance: null, blurb: "Bahrain’s airline connecting the Gulf with India and Europe.", hubSlugs: [] }),
  a({ name: "Oman Air", iata: "WY", countryName: "Oman", countrySlug: "oman", alliance: null, blurb: "Muscat-based carrier for India–Gulf and leisure routes.", hubSlugs: [] }),
  a({ name: "SriLankan Airlines", iata: "UL", countryName: "Sri Lanka", countrySlug: "sri-lanka", alliance: "oneworld", blurb: "Colombo hub airline linking South Asia with the Middle East and Europe.", hubSlugs: ["colombo"] }),
  a({ name: "Nepal Airlines", iata: "RA", countryName: "Nepal", countrySlug: "nepal", alliance: null, blurb: "Nepal’s national airline for Kathmandu regional connections.", hubSlugs: ["kathmandu"] }),
  a({ name: "LATAM Airlines", iata: "LA", countryName: "Chile", countrySlug: "chile", alliance: null, blurb: "Leading South American airline group via Santiago and São Paulo.", hubSlugs: ["santiago", "sao-paulo"] }),
  a({ name: "Avianca", iata: "AV", countryName: "Colombia", countrySlug: "colombia", alliance: "Star Alliance", blurb: "Colombian Star Alliance airline hubbing through Bogotá.", hubSlugs: ["bogota"] }),
  a({ name: "Aeromexico", iata: "AM", countryName: "Mexico", countrySlug: "mexico", alliance: "SkyTeam", blurb: "Mexican SkyTeam carrier connecting Mexico City with the Americas.", hubSlugs: ["mexico-city", "cancun"] }),
  a({ name: "Copa Airlines", iata: "CM", countryName: "Panama", countrySlug: "panama", alliance: "Star Alliance", blurb: "Panama Hub of the Americas airline for Latin America transfers.", hubSlugs: [] }),
].filter((x, i, arr) => arr.findIndex((y) => y.slug === x.slug) === i);

export function getAirlineBySlug(slug: string): SeoAirline | undefined {
  return seoAirlines.find((a) => a.slug === slug);
}

export function airlinesForDestination(destSlug: string): SeoAirline[] {
  return seoAirlines.filter((a) => a.hubSlugs.includes(destSlug)).slice(0, 8);
}

export function validHubSlugs(airline: SeoAirline) {
  return airline.hubSlugs.filter((s) => seoDestinations.some((d) => d.slug === s));
}
