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

/** Google next_page_token is briefly invalid — retry until OK. */
async function fetchWithPageToken(pathname, pageToken) {
  let data = null;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await sleep(attempt === 0 ? 2000 : 1500);
    data = await googleGet(pathname, { pagetoken: pageToken }, { allowInvalidRequest: true });
    if (data.status === "OK" || data.status === "ZERO_RESULTS") return data;
  }
  throw new GooglePlacesError("Unable to load more hotels. Please try again.", {
    status: 502,
    code: "PLACES_PAGE_TOKEN",
  });
}

/**
 * Nearby Search (lodging) — best when we have lat/lng.
 * Do NOT combine Text Search type=lodging + location bias; that combo often returns only ~5–6 hits.
 */
async function nearbySearchLodging({ location, pageToken, radius = 25000 }) {
  if (pageToken) {
    return fetchWithPageToken("nearbysearch", pageToken);
  }
  if (location?.lat == null || location?.lng == null) {
    throw new GooglePlacesError("Location is required for nearby hotel search", {
      status: 400,
      code: "INVALID_LOCATION",
    });
  }
  return googleGet("nearbysearch", {
    location: `${location.lat},${location.lng}`,
    radius: String(radius),
    type: "lodging",
  });
}

/**
 * Text Search for hotels — query only (no location+type bias).
 * Returns up to ~20 per page with next_page_token.
 */
async function textSearchHotels({ query, pageToken }) {
  if (pageToken) {
    return fetchWithPageToken("textsearch", pageToken);
  }
  return googleGet("textsearch", {
    query: query || "hotels",
  });
}

/** Collect up to 3 Google pages (~60 results) for a search mode. */
async function collectAllPages(fetchPage, { maxPages = 3 } = {}) {
  const all = [];
  let pageToken = null;
  let pages = 0;
  let lastStatus = "ZERO_RESULTS";

  while (pages < maxPages) {
    const data = await fetchPage(pageToken);
    lastStatus = data.status || lastStatus;
    const batch = Array.isArray(data.results) ? data.results : [];
    all.push(...batch);
    pages += 1;
    pageToken = data.next_page_token || null;
    if (!pageToken || !batch.length) break;
  }

  return { results: all, pages, exhausted: !pageToken, status: lastStatus };
}

async function mapWithOptionalDetails(basics, ctx) {
  // Map list results from Nearby/Text Search fields directly.
  // Avoid N Place Details calls (rate limits + multi-second delays) so all pages stay usable.
  return basics
    .map((item) => {
      if (!item) return null;
      // Nearby Search uses vicinity instead of formatted_address
      if (!item.formatted_address && item.vicinity) {
        return { ...item, formatted_address: item.vicinity };
      }
      return item;
    })
    .map((p) => mapPlaceToHotel(p, ctx))
    .filter(Boolean);
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
 * Search lodging via Google Places.
 * - With coordinates: Nearby Search (lodging) — full local inventory (~20/page)
 * - Without: Text Search "hotels in {destination}" (no location+type combo)
 * Auto-fetches all available Google pages (max ~60) so the UI is not stuck on 5–6 hotels.
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

  const hasCoords = latitude != null && longitude != null && Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));
  const location = hasCoords ? { lat: Number(latitude), lng: Number(longitude) } : null;
  // Prefer a short city-style label for text queries (avoid ultra-long formatted addresses)
  const shortLabel = destinationLabel
    .replace(/-/g, " ")
    .split(",")
    .slice(0, 2)
    .join(",")
    .trim();
  const textQuery = `hotels in ${shortLabel || destinationLabel.replace(/-/g, " ")}`;

  let basics = [];
  let mode = "text";

  // Client-driven single-page pagination (Load More) — keep for compatibility
  if (pageToken) {
    const data = hasCoords
      ? await nearbySearchLodging({ location, pageToken })
      : await textSearchHotels({ query: textQuery, pageToken });
    basics = Array.isArray(data.results) ? data.results : [];
    const resolvedApiBase =
      apiBaseUrl ||
      process.env.API_PUBLIC_URL ||
      `http://localhost:${process.env.PORT || 5001}`;
    const ctx = {
      destinationLabel: shortLabel || destinationLabel.replace(/-/g, " "),
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      guests: guests ?? null,
      rooms: rooms ?? null,
      apiBaseUrl: String(resolvedApiBase).replace(/\/$/, ""),
    };
    const hotels = await mapWithOptionalDetails(basics, ctx);
    const next = data.next_page_token || null;
    return {
      count: hotels.length,
      hotels,
      nextPageToken: next,
      hasMore: Boolean(next),
      totalResults: null,
      durationMs: Date.now() - started,
    };
  }

  // Initial search: pull all Google pages so users see the full Places inventory
  if (hasCoords) {
    mode = "nearby";
    const nearby = await collectAllPages(
      (token) => nearbySearchLodging({ location, pageToken: token, radius: 25000 }),
      { maxPages: 3 }
    );
    basics = nearby.results;

    // If nearby was thin, supplement with text search (dedupe later)
    if (basics.length < 20) {
      const text = await collectAllPages(
        (token) => textSearchHotels({ query: textQuery, pageToken: token }),
        { maxPages: 3 }
      );
      basics = [...basics, ...text.results];
      mode = "nearby+text";
    }
  } else {
    mode = "text";
    const text = await collectAllPages(
      (token) => textSearchHotels({ query: textQuery, pageToken: token }),
      { maxPages: 3 }
    );
    basics = text.results;
  }

  // Dedupe by place_id — never invent or duplicate hotels
  const seen = new Set();
  const uniqueBasics = [];
  for (const item of basics) {
    const id = item?.place_id;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    uniqueBasics.push(item);
  }

  const resolvedApiBase =
    apiBaseUrl ||
    process.env.API_PUBLIC_URL ||
    `http://localhost:${process.env.PORT || 5001}`;

  const ctx = {
    destinationLabel: shortLabel || destinationLabel.replace(/-/g, " "),
    checkIn: checkIn || null,
    checkOut: checkOut || null,
    guests: guests ?? null,
    rooms: rooms ?? null,
    apiBaseUrl: String(resolvedApiBase).replace(/\/$/, ""),
  };

  const hotels = await mapWithOptionalDetails(uniqueBasics, ctx);

  console.info("[places] hotel search ok", {
    destination: destinationLabel,
    placeId: placeId || null,
    mode,
    query: textQuery,
    pageCount: hotels.length,
    hasMore: false,
    durationMs: Date.now() - started,
  });

  return {
    count: hotels.length,
    hotels,
    // All Google pages already fetched for initial search
    nextPageToken: null,
    hasMore: false,
    totalResults: hotels.length,
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
