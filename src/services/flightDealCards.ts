import { getApiBase } from "@/lib/apiBase";
import type { FlightSearchRequest, FlightSearchResponse, NormalizedFlightOffer } from "@/types/duffelFlight";

export type MonthlyFlightDeal = {
  origin: string;
  destination: string;
  month: string;
  searchedDates: string[];
  date: string;
  offer: NormalizedFlightOffer;
};
export type DailyFlightDeal = {
  origin: string;
  destination: string;
  date: string;
  offers: NormalizedFlightOffer[];
  offerRequestId: string | null;
};
export type FlightDealCardsResponse = {
  success: boolean;
  liveMode: boolean;
  monthlyDeals: MonthlyFlightDeal[];
  dailyDeals: DailyFlightDeal[];
  failedSearchCount: number;
  cached: boolean;
  generatedAt: string;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
let cachedValue: FlightDealCardsResponse | null = null;
let cacheExpiresAt = 0;
let inFlight: Promise<FlightDealCardsResponse> | null = null;
const resultsCache = new Map<string, { response: FlightSearchResponse; expiresAt: number }>();

function offerIsCurrent(offer: NormalizedFlightOffer) {
  return !offer.expiresAt || new Date(offer.expiresAt).getTime() > Date.now();
}

function resultKey(request: FlightSearchRequest) {
  return JSON.stringify({ ...request, origin: request.origin.toUpperCase(), destination: request.destination.toUpperCase() });
}

export function getFeaturedFlightDealCards(): Promise<FlightDealCardsResponse> {
  if (cachedValue && cacheExpiresAt > Date.now()) {
    const offers = [...cachedValue.monthlyDeals.map((deal) => deal.offer), ...cachedValue.dailyDeals.flatMap((deal) => deal.offers)];
    if (offers.every(offerIsCurrent)) return Promise.resolve({ ...cachedValue, cached: true });
    cachedValue = null;
    cacheExpiresAt = 0;
  }
  if (inFlight) return inFlight;
  inFlight = fetch(`${getApiBase()}/api/flights/deals`)
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok || !data.success || data.liveMode !== true) {
        throw new Error(data.message || "Live flight deals are temporarily unavailable.");
      }
      const deals = data as FlightDealCardsResponse;
      for (const deal of deals.dailyDeals) {
        if (!deal.offers.length) continue;
        const request: FlightSearchRequest = {
          origin: deal.origin,
          destination: deal.destination,
          departureDate: deal.date,
          returnDate: null,
          adults: 1,
          children: 0,
          infants: 0,
          cabinClass: "economy",
          maxConnections: null,
        };
        resultsCache.set(resultKey(request), {
          expiresAt: Date.now() + CACHE_TTL_MS,
          response: {
            success: true,
            offerRequestId: deal.offerRequestId,
            count: deal.offers.length,
            flights: deal.offers,
            meta: { liveMode: true, priceSource: "duffel_live_api", cacheStatus: "calendar_cached" },
          },
        });
      }
      cachedValue = deals;
      cacheExpiresAt = Date.now() + CACHE_TTL_MS;
      return deals;
    })
    .finally(() => { inFlight = null; });
  return inFlight;
}

export function readCachedDealSearch(request: FlightSearchRequest): FlightSearchResponse | null {
  const entry = resultsCache.get(resultKey(request));
  if (!entry || entry.expiresAt <= Date.now()) return null;
  const flights = entry.response.flights.filter(offerIsCurrent);
  return flights.length ? { ...entry.response, count: flights.length, flights } : null;
}
