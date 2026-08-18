const { getGooglePlacesConfig } = require("../config/googlePlaces");
const { mapPlaceToHotel } = require("./mapGooglePlaceHotel");

class GooglePlacesError extends Error {
  constructor(message, { status = 502, code = "PLACES_ERROR" } = {}) {
    super(message);
    this.name = "GooglePlacesError";
    this.status = status;
    this.code = code;
  }
}

async function googleGet(pathname, params) {
  const { apiKey } = getGooglePlacesConfig();
  if (!apiKey) {
    throw new GooglePlacesError("Hotel search is not configured", {
      status: 503,
      code: "PLACES_NOT_CONFIGURED",
    });
  }

  const qs = new URLSearchParams({ ...params, key: apiKey });
  const url = `https://maps.googleapis.com/maps/api/place/${pathname}/json?${qs.toString()}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    if (!res.ok) {
      throw new GooglePlacesError("Unable to search hotels right now.", { status: 502 });
    }
    if (data.status && !["OK", "ZERO_RESULTS"].includes(data.status)) {
      console.error("[places] upstream status", {
        status: data.status,
        error_message: data.error_message,
        pathname,
      });
      if (data.status === "OVER_QUERY_LIMIT" || data.status === "RESOURCE_EXHAUSTED") {
        throw new GooglePlacesError("Hotel search is temporarily busy. Please try again.", {
          status: 429,
          code: "PLACES_RATE_LIMIT",
        });
      }
      if (data.status === "REQUEST_DENIED") {
        throw new GooglePlacesError("Unable to search hotels right now.", {
          status: 502,
          code: "PLACES_DENIED",
        });
      }
      throw new GooglePlacesError("Unable to search hotels right now.", { status: 502 });
    }
    return data;
  } catch (err) {
    if (err instanceof GooglePlacesError) throw err;
    if (err.name === "AbortError") {
      throw new GooglePlacesError("Hotel search timed out. Please try again.", {
        status: 504,
        code: "PLACES_TIMEOUT",
      });
    }
    throw new GooglePlacesError("Unable to search hotels right now.", {
      status: 502,
      code: "PLACES_NETWORK",
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchPlaceDetails(placeId) {
  const data = await googleGet("details", {
    place_id: placeId,
    fields: [
      "place_id",
      "name",
      "formatted_address",
      "geometry",
      "rating",
      "user_ratings_total",
      "photos",
      "types",
      "business_status",
      "formatted_phone_number",
      "international_phone_number",
      "website",
      "url",
      "opening_hours",
      "price_level",
      "editorial_summary",
      "wheelchair_accessible_entrance",
      "reservable",
    ].join(","),
  });
  return data.result || null;
}

/**
 * Search lodging via Google Places Text Search, then enrich with Place Details.
 */
async function searchHotelsPlaces({
  destination,
  checkIn,
  checkOut,
  guests,
  rooms,
}) {
  const started = Date.now();
  const destinationLabel = String(destination || "").trim();
  if (!destinationLabel) {
    throw new GooglePlacesError("Destination is required", { status: 400, code: "INVALID_DESTINATION" });
  }

  const query = `hotels in ${destinationLabel.replace(/-/g, " ")}`;
  const text = await googleGet("textsearch", {
    query,
    type: "lodging",
  });

  const basics = Array.isArray(text.results) ? text.results : [];
  const limited = basics.slice(0, 16);

  const details = await Promise.all(
    limited.map(async (item) => {
      try {
        const detail = await fetchPlaceDetails(item.place_id);
        return detail || item;
      } catch {
        return item;
      }
    })
  );

  const ctx = {
    destinationLabel: destinationLabel.replace(/-/g, " "),
    checkIn: checkIn || null,
    checkOut: checkOut || null,
    guests: guests ?? null,
    rooms: rooms ?? null,
  };

  const hotels = details.map((p) => mapPlaceToHotel(p, ctx)).filter(Boolean);

  console.info("[places] hotel search ok", {
    destination: destinationLabel,
    query,
    count: hotels.length,
    durationMs: Date.now() - started,
  });

  return {
    count: hotels.length,
    hotels,
    nextPageToken: text.next_page_token || null,
    durationMs: Date.now() - started,
  };
}

async function fetchPlacePhoto({ ref, maxWidth = 1200 }) {
  const { apiKey } = getGooglePlacesConfig();
  if (!apiKey) {
    throw new GooglePlacesError("Photo service is not configured", { status: 503 });
  }
  if (!ref) {
    throw new GooglePlacesError("Missing photo reference", { status: 400 });
  }

  const qs = new URLSearchParams({
    photo_reference: ref,
    maxwidth: String(Math.min(1600, Math.max(100, Number(maxWidth) || 1200))),
    key: apiKey,
  });
  const url = `https://maps.googleapis.com/maps/api/place/photo?${qs.toString()}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new GooglePlacesError("Photo unavailable", { status: 404 });
  }
  const contentType = res.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await res.arrayBuffer());
  return { buffer, contentType };
}

module.exports = {
  searchHotelsPlaces,
  fetchPlacePhoto,
  GooglePlacesError,
};
