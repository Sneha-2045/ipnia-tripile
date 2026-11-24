import type { Airport } from "@/data/airports";
import { getAirportByCode } from "@/data/airports";

export const LAST_FLIGHT_SEARCH_KEY = "ipnia_last_flight_search_v1";

export type LastFlightSearch = {
  from: string;
  to: string;
  departure: string;
  returnDate?: string;
  adults: string;
  children: string;
  infants: string;
  cabin: string;
  tripType: string;
  maxConnections?: string;
};

export function loadLastFlightSearch(): LastFlightSearch | null {
  try {
    const raw = sessionStorage.getItem(LAST_FLIGHT_SEARCH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastFlightSearch;
    if (!parsed?.from || !parsed?.to) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveLastFlightSearch(search: LastFlightSearch) {
  try {
    sessionStorage.setItem(LAST_FLIGHT_SEARCH_KEY, JSON.stringify(search));
  } catch {
    // ignore
  }
}

export function airportsFromLastSearch(): { from: Airport | null; to: Airport | null } {
  const last = loadLastFlightSearch();
  if (!last) return { from: null, to: null };
  return {
    from: getAirportByCode(last.from) ?? null,
    to: getAirportByCode(last.to) ?? null,
  };
}

export function todayISO() {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
}

export function plusDaysISO(days: number, from = todayISO()) {
  const [year, month, day] = from.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}
