import type { SeoDestination } from "@/data/seo/destinations";

/** Build flight search deep-link using primary airport codes when available. */
export function flightSearchPath(fromCode?: string, toCode?: string) {
  const params = new URLSearchParams();
  if (fromCode) params.set("from", fromCode);
  if (toCode) params.set("to", toCode);
  const qs = params.toString();
  return qs ? `/flights/search?${qs}` : "/flights/search";
}

export function hotelSearchPath(destinationName: string) {
  const params = new URLSearchParams({ destination: destinationName });
  return `/hotels/search?${params.toString()}`;
}

export function primaryAirport(dest: SeoDestination): string | undefined {
  return dest.airportCodes[0];
}

export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
