import type { SelectedHotelDestination } from "@/services/hotelSearchApi";

const STORAGE_KEY = "ipnia_recent_hotel_destinations";
const MAX_RECENT = 8;

export function loadRecentHotelDestinations(): SelectedHotelDestination[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SelectedHotelDestination[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((d) => d && typeof d.placeId === "string" && d.placeId.length > 0);
  } catch {
    return [];
  }
}

export function saveRecentHotelDestination(dest: SelectedHotelDestination) {
  if (!dest?.placeId) return;
  try {
    const existing = loadRecentHotelDestinations().filter((d) => d.placeId !== dest.placeId);
    const next = [dest, ...existing].slice(0, MAX_RECENT);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
}
