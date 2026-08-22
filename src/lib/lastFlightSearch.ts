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
  return new Date().toISOString().slice(0, 10);
}

export function plusDaysISO(days: number, from = todayISO()) {
  const d = new Date(`${from}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
