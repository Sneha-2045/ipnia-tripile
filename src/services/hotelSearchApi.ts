import { getApiBase } from "@/lib/apiBase";
import type { HotelImage, HotelSearchRequest, HotelSearchResponse, NormalizedHotel } from "@/types/hotel";

const FALLBACK_IMAGE = "/assets/destinations/hotel-luxury-1.jpg";

/** Always build photo URLs against the configured API host from Places photo_reference */
export function hotelPhotoUrl(reference: string | null | undefined, width = 1200): string | null {
  if (!reference) return null;
  try {
    const base = getApiBase();
    return `${base}/api/hotels/photo?ref=${encodeURIComponent(reference)}&w=${width}`;
  } catch {
    return null;
  }
}

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

function rebuildImagesFromReferences(hotel: NormalizedHotel): HotelImage[] {
  const images = Array.isArray(hotel.images) ? hotel.images : [];
  return images
    .map((img, index) => {
      const fromRef = hotelPhotoUrl(img.reference, 1200);
      const thumbFromRef = hotelPhotoUrl(img.reference, 400);
      const url = fromRef || resolveHotelMediaUrl(img.url);
      const thumbUrl = thumbFromRef || resolveHotelMediaUrl(img.thumbUrl || img.url);
      if (!url) return null;
      return {
        ...img,
        index,
        url,
        thumbUrl: thumbUrl || url,
      };
    })
    .filter(Boolean) as HotelImage[];
}

export function withResolvedHotelMedia(hotel: NormalizedHotel): NormalizedHotel {
  const images = rebuildImagesFromReferences(hotel);
  const primary =
    images[0]?.url ||
    hotelPhotoUrl(hotel.images?.[0]?.reference) ||
    resolveHotelMediaUrl(hotel.image);
  return {
    ...hotel,
    images,
    image: primary || FALLBACK_IMAGE,
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

export type DestinationPrediction = {
  id: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
};

export async function autocompleteHotelDestinations(
  query: string,
  signal?: AbortSignal
): Promise<DestinationPrediction[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = `${getApiBase()}/api/hotels/autocomplete?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { signal });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) return [];
  return Array.isArray(data.predictions) ? data.predictions : [];
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
