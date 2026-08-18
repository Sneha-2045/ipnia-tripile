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

async function googleGet(pathname, params, { allowInvalidRequest = false } = {}) {
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
    const okStatuses = ["OK", "ZERO_RESULTS"];
    if (allowInvalidRequest) okStatuses.push("INVALID_REQUEST");
    if (data.status && !okStatuses.includes(data.status)) {
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function textSearchLodging({ query, location, pageToken }) {
  if (pageToken) {
    // Google requires a short delay before next_page_token becomes valid
    let data = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await sleep(attempt === 0 ? 2000 : 1500);
      data = await googleGet(
        "textsearch",
        { pagetoken: pageToken },
        { allowInvalidRequest: true }
      );
      if (data.status === "OK" || data.status === "ZERO_RESULTS") return data;
    }
    throw new GooglePlacesError("Unable to load more hotels. Please try again.", {
      status: 502,
      code: "PLACES_PAGE_TOKEN",
    });
  }

  const params = {
    query: query || "hotels",
    type: "lodging",
  };
  if (location?.lat != null && location?.lng != null) {
    params.location = `${location.lat},${location.lng}`;
    params.radius = "50000";
  }
  return googleGet("textsearch", params);
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
      "address_component",
    ].join(","),
  });
  return data.result || null;
}

/**
 * Search lodging via Google Places Text Search (full page, no artificial slice).
 * Supports pagination via next_page_token (Google returns up to ~20 per page, ~60 total).
 */
async function searchHotelsPlaces({
  destination,
  placeId,
  latitude,
  longitude,
  pageToken,
  checkIn,
  checkOut,
  guests,
  rooms,
  apiBaseUrl,
}) {
  const started = Date.now();
  const destinationLabel = String(destination || "").trim();
  if (!destinationLabel && !pageToken) {
    throw new GooglePlacesError("Destination is required", { status: 400, code: "INVALID_DESTINATION" });
  }

  const query = `hotels in ${destinationLabel.replace(/-/g, " ")}`;
  const text = await textSearchLodging({
    query,
    location:
      latitude != null && longitude != null
        ? { lat: Number(latitude), lng: Number(longitude) }
        : null,
    pageToken: pageToken || null,
  });

  // Use the full page Google returns — do NOT artificially slice
  const basics = Array.isArray(text.results) ? text.results : [];

  const details = await Promise.all(
    basics.map(async (item) => {
      try {
        const detail = await fetchPlaceDetails(item.place_id);
        if (!detail) return item;
        if ((!detail.photos || !detail.photos.length) && item.photos?.length) {
          detail.photos = item.photos;
        }
        return detail;
      } catch {
        return item;
      }
    })
  );

  const resolvedApiBase =
    apiBaseUrl ||
    process.env.API_PUBLIC_URL ||
    `http://localhost:${process.env.PORT || 5001}`;

  const ctx = {
    destinationLabel: destinationLabel.replace(/-/g, " "),
    checkIn: checkIn || null,
    checkOut: checkOut || null,
    guests: guests ?? null,
    rooms: rooms ?? null,
    apiBaseUrl: String(resolvedApiBase).replace(/\/$/, ""),
  };

  const hotels = details.map((p) => mapPlaceToHotel(p, ctx)).filter(Boolean);
  const nextPageToken = text.next_page_token || null;

  console.info("[places] hotel search ok", {
    destination: destinationLabel,
    placeId: placeId || null,
    query,
    pageCount: hotels.length,
    hasMore: Boolean(nextPageToken),
    durationMs: Date.now() - started,
  });

  return {
    count: hotels.length,
    hotels,
    nextPageToken,
    hasMore: Boolean(nextPageToken),
    // Google Text Search does not return a reliable grand total across pages
    totalResults: null,
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
  if (!String(contentType).startsWith("image/")) {
    throw new GooglePlacesError("Photo unavailable", { status: 404 });
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  if (!buffer.length) {
    throw new GooglePlacesError("Photo unavailable", { status: 404 });
  }
  return { buffer, contentType };
}

async function autocompleteHotelDestinations(input) {
  const q = String(input || "").trim();
  if (q.length < 2) {
    return { predictions: [] };
  }

  // Broad worldwide predictions (cities, regions, countries) — not a hardcoded list
  const data = await googleGet("autocomplete", {
    input: q,
    types: "(regions)",
  });

  const predictions = Array.isArray(data.predictions)
    ? data.predictions.map((p) => ({
        id: p.place_id,
        placeId: p.place_id,
        description: p.description || "",
        mainText: p.structured_formatting?.main_text || p.description || "",
        secondaryText: p.structured_formatting?.secondary_text || "",
        types: Array.isArray(p.types) ? p.types : [],
      }))
    : [];

  return { predictions };
}

async function getDestinationPlaceDetails(placeId) {
  const id = String(placeId || "").trim();
  if (!id) {
    throw new GooglePlacesError("placeId is required", { status: 400, code: "INVALID_PLACE_ID" });
  }
  const detail = await fetchPlaceDetails(id);
  if (!detail) {
    throw new GooglePlacesError("Place not found", { status: 404, code: "PLACE_NOT_FOUND" });
  }

  const components = Array.isArray(detail.address_components) ? detail.address_components : [];
  const find = (type) =>
    components.find((c) => Array.isArray(c.types) && c.types.includes(type))?.long_name || null;

  return {
    placeId: detail.place_id,
    name: detail.name || null,
    formattedAddress: detail.formatted_address || null,
    latitude: detail.geometry?.location?.lat ?? null,
    longitude: detail.geometry?.location?.lng ?? null,
    city: find("locality") || find("postal_town") || find("administrative_area_level_2"),
    region: find("administrative_area_level_1"),
    country: find("country"),
  };
}

module.exports = {
  searchHotelsPlaces,
  fetchPlacePhoto,
  autocompleteHotelDestinations,
  getDestinationPlaceDetails,
  GooglePlacesError,
};
