import { getApiBase } from "@/lib/apiBase";
import type { HotelSearchRequest, HotelSearchResponse, NormalizedHotel } from "@/types/hotel";

const FALLBACK_IMAGE = "/assets/destinations/hotel-luxury-1.jpg";

export function resolveHotelMediaUrl(path: string | null | undefined): string {
  if (!path) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/assets/")) return path;
  try {
    return `${getApiBase()}${path.startsWith("/") ? path : `/${path}`}`;
  } catch {
    return FALLBACK_IMAGE;
  }
}

export function withResolvedHotelMedia(hotel: NormalizedHotel): NormalizedHotel {
  const images = (hotel.images || []).map((img) => ({
    ...img,
    url: resolveHotelMediaUrl(img.url),
    thumbUrl: resolveHotelMediaUrl(img.thumbUrl || img.url),
  }));
  return {
    ...hotel,
    images,
    image: resolveHotelMediaUrl(hotel.image || images[0]?.url || null),
  };
}

export async function searchHotelsViaApi(
  payload: HotelSearchRequest,
  signal?: AbortSignal
): Promise<HotelSearchResponse> {
  const url = `${getApiBase()}/api/hotels/search`;
  console.log("Hotel search API URL:", url);
  console.log("Hotel search payload:", payload);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new Error("Unable to reach hotel search API.");
  }

  const data = (await res.json().catch(() => ({}))) as HotelSearchResponse;
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Hotel search failed (${res.status}).`);
  }

  const hotels = (data.hotels || []).map(withResolvedHotelMedia);
  return {
    success: true,
    message: data.message,
    count: data.count ?? hotels.length,
    hotels,
  };
}

export function formatHotelPrice(amount: number | null, currency: string | null) {
  if (amount == null || !Number.isFinite(amount)) return null;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

export function priceLevelLabel(level: number | null) {
  if (level == null || !Number.isFinite(level)) return null;
  return "₹".repeat(Math.min(4, Math.max(1, level + 1)));
}
