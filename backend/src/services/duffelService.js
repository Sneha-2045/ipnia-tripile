const { getDuffelConfig } = require("../config/duffel");
const { mapDuffelOfferToFlight } = require("./mapDuffelOffer");

class DuffelApiError extends Error {
  constructor(message, { status = 502, code = "DUFFEL_ERROR", details = null } = {}) {
    super(message);
    this.name = "DuffelApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function mapCabinClass(cabinClass) {
  const raw = String(cabinClass || "economy").toLowerCase().replace(/\s+/g, "_");
  if (raw === "premium" || raw === "premium_economy") return "premium_economy";
  if (raw === "business") return "business";
  if (raw === "first") return "first";
  return "economy";
}

function buildPassengers({ adults = 1, children = 0, infants = 0 }) {
  const passengers = [];
  for (let i = 0; i < adults; i += 1) passengers.push({ type: "adult" });
  for (let i = 0; i < children; i += 1) passengers.push({ type: "child" });
  for (let i = 0; i < infants; i += 1) passengers.push({ type: "infant_without_seat" });
  return passengers;
}

function buildSlices({ origin, destination, departureDate, returnDate }) {
  const slices = [
    {
      origin: String(origin).toUpperCase(),
      destination: String(destination).toUpperCase(),
      departure_date: departureDate,
    },
  ];
  if (returnDate) {
    slices.push({
      origin: String(destination).toUpperCase(),
      destination: String(origin).toUpperCase(),
      departure_date: returnDate,
    });
  }
  return slices;
}

async function createOfferRequest(searchParams) {
  const config = getDuffelConfig();
  if (!config.isConfigured) {
    throw new DuffelApiError("Flight search is not configured", {
      status: 503,
      code: "DUFFEL_NOT_CONFIGURED",
    });
  }

  const cabin_class = mapCabinClass(searchParams.cabinClass);
  const passengers = buildPassengers(searchParams);
  const slices = buildSlices(searchParams);

  const body = {
    data: {
      slices,
      passengers,
      cabin_class,
    },
  };

  if (
    searchParams.maxConnections !== undefined &&
    searchParams.maxConnections !== null &&
    searchParams.maxConnections !== ""
  ) {
    const max = Number(searchParams.maxConnections);
    if (Number.isFinite(max) && max >= 0 && max <= 2) {
      body.data.max_connections = max;
    }
  } else {
    // "Any" stops — allow up to 2 connections
    body.data.max_connections = 2;
  }

  const qs = new URLSearchParams({
    return_offers: "true",
    view: "offers",
    supplier_timeout: String(config.supplierTimeoutMs),
  });

  const url = `${config.baseUrl}/air/offer_requests?${qs.toString()}`;
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.httpTimeoutMs);

  let response;
  let payload;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "Content-Type": "application/json",
        "Duffel-Version": config.version,
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    payload = await response.json().catch(() => ({}));
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new DuffelApiError("Flight search timed out. Please try again.", {
        status: 504,
        code: "DUFFEL_TIMEOUT",
      });
    }
    throw new DuffelApiError("Unable to search flights right now.", {
      status: 502,
      code: "DUFFEL_NETWORK",
      details: err.message,
    });
  } finally {
    clearTimeout(timer);
  }

  const durationMs = Date.now() - started;

  if (!response.ok) {
    const duffelErrors = Array.isArray(payload?.errors) ? payload.errors : [];
    const first = duffelErrors[0];
    const status = response.status;

    // Log server-side only (never include Authorization / API key)
    console.error("[duffel] offer_request failed", {
      status,
      durationMs,
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: searchParams.departureDate,
      code: first?.code,
      title: first?.title,
      message: first?.message,
    });

    if (status === 401 || status === 403) {
      throw new DuffelApiError("Unable to search flights right now.", {
        status: 502,
        code: "DUFFEL_AUTH",
      });
    }
    if (status === 429) {
      throw new DuffelApiError("Too many flight searches. Please wait a moment and try again.", {
        status: 429,
        code: "DUFFEL_RATE_LIMIT",
      });
    }
    if (status === 400) {
      throw new DuffelApiError(
        first?.message || "Invalid flight search. Please check airports and dates.",
        { status: 400, code: first?.code || "DUFFEL_BAD_REQUEST" }
      );
    }
    throw new DuffelApiError("Unable to search flights right now.", {
      status: 502,
      code: "DUFFEL_UPSTREAM",
    });
  }

  const data = payload?.data || {};
  const rawOffers = Array.isArray(data.offers) ? data.offers : [];
  const flights = rawOffers.map(mapDuffelOfferToFlight).filter(Boolean);

  console.info("[duffel] offer_request ok", {
    offerRequestId: data.id,
    origin: searchParams.origin,
    destination: searchParams.destination,
    departureDate: searchParams.departureDate,
    returnDate: searchParams.returnDate || null,
    passengers: passengers.length,
    cabin_class,
    max_connections: body.data.max_connections ?? null,
    offers: flights.length,
    durationMs,
    liveMode: data.live_mode,
  });

  return {
    offerRequestId: data.id || null,
    liveMode: Boolean(data.live_mode),
    cabinClass: data.cabin_class || cabin_class,
    passengers: data.passengers || passengers,
    slices: data.slices || slices,
    count: flights.length,
    flights,
    durationMs,
  };
}

module.exports = {
  createOfferRequest,
  DuffelApiError,
  mapCabinClass,
};
