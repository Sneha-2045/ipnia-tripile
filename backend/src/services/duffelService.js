const { getDuffelConfig } = require("../config/duffel");
const { getJwtSecret } = require("./authToken");
const { mapDuffelOfferToFlight } = require("./mapDuffelOffer");
const { randomUUID } = require("node:crypto");
let featuredDealsCache = null;
let featuredDealsExpiresAt = 0;
let featuredDealsInFlight = null;

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

function buildOfferRequestBody(searchParams) {
  const cabin_class = mapCabinClass(searchParams.cabinClass);
  const passengers = buildPassengers(searchParams);
  const slices = buildSlices(searchParams);
  const body = { data: { slices, passengers, cabin_class } };
  if (searchParams.maxConnections !== undefined && searchParams.maxConnections !== null && searchParams.maxConnections !== "") {
    const max = Number(searchParams.maxConnections);
    if (Number.isFinite(max) && max >= 0 && max <= 2) body.data.max_connections = max;
  }
  return { body, cabin_class, passengers, slices };
}

function getRemainingBatches(data, stage) {
  const remaining = data?.remaining_batches;
  if (!Number.isInteger(remaining) || remaining < 0) {
    throw new DuffelApiError(`Duffel returned an invalid batch completion state (${stage}).`, {
      status: 502,
      code: "DUFFEL_INVALID_BATCH_STATE",
    });
  }
  return remaining;
}

function duffelHeaders(config, json = false) {
  return {
    Accept: "application/json",
    "Accept-Encoding": "gzip",
    "Duffel-Version": config.version,
    Authorization: `Bearer ${config.apiKey}`,
    ...(json ? { "Content-Type": "application/json" } : {}),
  };
}

async function requestDuffel(config, url, { method = "GET", body, signal, searchId = null, offerRequestId = null } = {}) {
  const requestStartedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.httpTimeoutMs);
  const abortFromCaller = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", abortFromCaller, { once: true });
  }
  try {
    const response = await fetch(url, {
      method,
      headers: duffelHeaders(config, body !== undefined),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const first = Array.isArray(payload?.errors) ? payload.errors[0] : null;
      throw new DuffelApiError(first?.message || "Duffel flight search failed.", {
        status: response.status,
        code: first?.code || "DUFFEL_UPSTREAM",
        details: { title: first?.title },
      });
    }
    console.info("[duffel] request ok", {
      searchId,
      offerRequestId,
      method,
      endpoint: new URL(url).pathname,
      status: response.status,
      durationMs: Date.now() - requestStartedAt,
    });
    return payload;
  } catch (err) {
    if (err instanceof DuffelApiError) throw err;
    if (signal?.aborted) throw err;
    if (err.name === "AbortError") {
      throw new DuffelApiError("Flight search timed out. Please try again.", { status: 504, code: "DUFFEL_TIMEOUT" });
    }
    throw new DuffelApiError("Unable to search flights right now.", { status: 502, code: "DUFFEL_NETWORK" });
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener("abort", abortFromCaller);
  }
}

/** Stream Duffel batch results as airlines return them. Batch resources expire after one minute. */
async function streamBatchOfferRequest(searchParams, { signal, onBatch }) {
  const config = getDuffelConfig();
  if (!config.isConfigured) throw new DuffelApiError("Flight search is not configured", { status: 503, code: "DUFFEL_NOT_CONFIGURED" });

  const { body, cabin_class, passengers } = buildOfferRequestBody(searchParams);
  const supplierTimeoutMs = Math.max(2000, Math.min(60000, config.supplierTimeoutMs));
  const createUrl = `${config.baseUrl}/air/batch_offer_requests?supplier_timeout=${supplierTimeoutMs}`;
  const searchId = randomUUID();
  const startedAt = Date.now();
  let providerLatencyMs = 0;
  let batchId = null;
  let totalOffers = 0;
  let providerOfferCount = 0;
  let mappedOfferCount = 0;
  let firstOfferMs = null;
  let totalBatches = 0;
  let remainingBatches = null;
  let supplierErrors = [];
  let pollCount = 0;
  const seen = new Set();

  try {
    const createStarted = Date.now();
    const created = await requestDuffel(config, createUrl, { method: "POST", body, signal, searchId });
    providerLatencyMs += Date.now() - createStarted;
    const initial = created?.data || {};
    batchId = initial.id;
    if (!batchId) throw new DuffelApiError("Duffel did not return a batch request ID.", { status: 502, code: "DUFFEL_INVALID_RESPONSE" });

    remainingBatches = getRemainingBatches(initial, "create");
    totalBatches = Number.isInteger(initial.total_batches) ? initial.total_batches : 0;
    const batchDeadline = startedAt + 55000;
    while (remainingBatches > 0 && pollCount < 60 && Date.now() < batchDeadline && !signal?.aborted) {
      pollCount += 1;
      const pollStarted = Date.now();
      const response = await requestDuffel(
        config,
        `${config.baseUrl}/air/batch_offer_requests/${encodeURIComponent(batchId)}?view=offers`,
        { signal, searchId, offerRequestId: batchId }
      );
      providerLatencyMs += Date.now() - pollStarted;
      const data = response?.data || {};
      remainingBatches = getRemainingBatches(data, "poll");
      totalBatches = Number.isInteger(data.total_batches) ? data.total_batches : totalBatches;
      supplierErrors = Array.isArray(data.errors)
        ? data.errors.map((error) => ({ code: error?.code || null, title: error?.title || null })).slice(0, 20)
        : supplierErrors;
      const batchOffers = Array.isArray(data.offers) ? data.offers : Array.isArray(data) ? data : [];
      providerOfferCount += batchOffers.length;
      const normalized = batchOffers.map(mapDuffelOfferToFlight).filter((flight) => flight && flight.id);
      mappedOfferCount += normalized.length;
      const mapped = normalized.filter((flight) => !seen.has(flight.id));
      mapped.forEach((flight) => seen.add(flight.id));
      if (mapped.length) {
        totalOffers += mapped.length;
        if (firstOfferMs === null) firstOfferMs = Date.now() - startedAt;
        onBatch({ flights: mapped, batchId, remainingBatches, totalBatches });
      }
    }
    if (remainingBatches > 0 && !signal?.aborted) {
      throw new DuffelApiError("Some airline results are taking too long. Retry to search again.", {
        status: 504,
        code: "DUFFEL_PARTIAL_RESULTS",
      });
    }

    const durationMs = Date.now() - startedAt;
    console.info("[flight-search] completed", {
      provider: "duffel",
      searchId,
      offerRequestId: batchId,
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: searchParams.departureDate,
      returnDate: searchParams.returnDate || null,
      cabinClass: cabin_class,
      passengerCount: passengers.length,
      supplierTimeoutMs,
      totalBatches,
      finalRemainingBatches: remainingBatches,
      supplierErrors,
      finalStatus: totalOffers ? "offers_returned" : "completed_no_offers",
      durationMs,
      timeToFirstOfferMs: firstOfferMs,
      providerLatencyMs,
      resultCount: totalOffers,
      providerOfferCount,
      mappedOfferCount,
      droppedOfferCount: Math.max(0, providerOfferCount - mappedOfferCount),
      duplicateOfferCount: Math.max(0, mappedOfferCount - totalOffers),
      pollCount,
      errors: 0,
    });
    return {
      searchId,
      offerRequestId: batchId,
      liveMode: Boolean(initial.live_mode),
      cabinClass: cabin_class,
      supplierTimeoutMs,
      durationMs,
      providerLatencyMs,
      count: totalOffers,
      providerOfferCount,
      mappedOfferCount,
      droppedOfferCount: Math.max(0, providerOfferCount - mappedOfferCount),
      duplicateOfferCount: Math.max(0, mappedOfferCount - totalOffers),
      pollCount,
      totalBatches,
      searchComplete: remainingBatches === 0,
    };
  } catch (err) {
    if (signal?.aborted) throw err;
    console.error("[flight-search] failed", {
      provider: "duffel",
      searchId,
      offerRequestId: batchId,
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: searchParams.departureDate,
      returnDate: searchParams.returnDate || null,
      cabinClass: cabin_class,
      passengerCount: passengers.length,
      supplierTimeoutMs,
      totalBatches,
      finalRemainingBatches: remainingBatches,
      supplierErrors,
      pollCount,
      finalStatus: "failed",
      durationMs: Date.now() - startedAt,
      timeToFirstOfferMs: firstOfferMs,
      providerLatencyMs,
      resultCount: totalOffers,
      providerOfferCount,
      mappedOfferCount,
      droppedOfferCount: Math.max(0, providerOfferCount - mappedOfferCount),
      duplicateOfferCount: Math.max(0, mappedOfferCount - totalOffers),
      errors: 1,
      code: err.code || "DUFFEL_ERROR",
      status: err.status || 502,
      supplierError: err.code || "DUFFEL_ERROR",
    });
    throw err;
  }
}

async function createOfferRequest(searchParams) {
  const config = getDuffelConfig();
  if (!config.isConfigured) {
    throw new DuffelApiError("Flight search is not configured", {
      status: 503,
      code: "DUFFEL_NOT_CONFIGURED",
    });
  }

  const { body, cabin_class, passengers, slices } = buildOfferRequestBody(searchParams);
  const searchId = randomUUID();

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
      searchId,
      status,
      durationMs,
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: searchParams.departureDate,
      cabinClass: cabin_class,
      passengerCount: passengers.length,
      supplierTimeoutMs: config.supplierTimeoutMs,
      maxConnections: body.data.max_connections ?? null,
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
    searchId,
    status: response.status,
    offerRequestId: data.id,
    origin: searchParams.origin,
    destination: searchParams.destination,
    departureDate: searchParams.departureDate,
    returnDate: searchParams.returnDate || null,
    passengers: passengers.length,
    cabin_class,
    supplierTimeoutMs: config.supplierTimeoutMs,
    providerOfferCount: rawOffers.length,
    mappedOfferCount: flights.length,
    droppedOfferCount: Math.max(0, rawOffers.length - flights.length),
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
    providerOfferCount: rawOffers.length,
    mappedOfferCount: flights.length,
    droppedOfferCount: Math.max(0, rawOffers.length - flights.length),
    duplicateOfferCount: 0,
    searchComplete: true,
    flights,
    durationMs,
  };
}

/** Shared card-feed data: sampled future dates, grouped into real monthly and daily offers. */
async function getFeaturedFlightDeals() {
  const config = getDuffelConfig();
  if (!config.isConfigured || config.isTestKey) {
    throw new DuffelApiError("Live flight deals are not configured.", { status: 503, code: "DUFFEL_LIVE_NOT_CONFIGURED" });
  }
  try {
    getJwtSecret();
  } catch {
    throw new DuffelApiError("Live flight price verification is not configured.", { status: 503, code: "FLIGHT_PRICE_VERIFICATION_NOT_CONFIGURED" });
  }
  const cachedOffersCurrent = featuredDealsCache && [
    ...featuredDealsCache.monthlyDeals.map((deal) => deal.offer),
    ...featuredDealsCache.dailyDeals.flatMap((deal) => deal.offers),
  ].every((offer) => !offer.expiresAt || new Date(offer.expiresAt).getTime() > Date.now());
  if (featuredDealsCache && featuredDealsExpiresAt > Date.now() && cachedOffersCurrent) return { ...featuredDealsCache, cached: true };
  if (featuredDealsInFlight) return featuredDealsInFlight;

  featuredDealsInFlight = (async () => {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
    const [currentYear, currentMonth] = today.split("-").map(Number);
    const routes = [{ origin: "DEL", destination: "BOM" }, { origin: "DEL", destination: "DXB" }];
    const searchedDates = [15, 28];
    const requests = [];
    for (let offset = 0; offset < 3; offset += 1) {
      const date = new Date(Date.UTC(currentYear, currentMonth - 1 + offset, 1));
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const monthKey = `${year}-${String(month).padStart(2, "0")}`;
      const lastDay = new Date(year, month, 0).getDate();
      for (const route of routes) {
        for (const day of searchedDates) {
          if (day > lastDay) continue;
          const departureDate = `${monthKey}-${String(day).padStart(2, "0")}`;
          if (departureDate < today) continue;
          requests.push({ ...route, departureDate, month: monthKey, returnDate: null, adults: 1, children: 0, infants: 0, cabinClass: "economy", maxConnections: null });
        }
      }
    }

    const results = new Array(requests.length);
    let nextSearch = 0;
    const workers = Array.from({ length: Math.min(4, requests.length) }, async () => {
      while (nextSearch < requests.length) {
        const index = nextSearch++;
        const request = requests[index];
        let errorCode = null;
        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            const response = await createOfferRequest(request);
            const offers = response.liveMode
              ? response.flights.filter((offer) => offer.liveMode).sort((a, b) => {
                if (a.providerCurrency !== b.providerCurrency) return a.providerCurrency.localeCompare(b.providerCurrency);
                return Number(a.providerAmount) - Number(b.providerAmount);
              })
              : [];
            results[index] = { request, offerRequestId: response.offerRequestId, offers, error: response.liveMode ? null : "NON_LIVE_MODE" };
            errorCode = null;
            break;
          } catch (error) {
            errorCode = error.code || "DUFFEL_SEARCH_FAILED";
            if (error.status !== 429 || attempt === 2) break;
            await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }
        if (!results[index]) results[index] = { request, offerRequestId: null, offers: [], error: errorCode };
      }
    });
    await Promise.all(workers);

    if (results.length && results.every((result) => result.error)) {
      throw new DuffelApiError("Unable to load live flight deals right now.", { status: 502, code: "DUFFEL_DEALS_FAILED" });
    }
    const dailyDeals = [];
    const monthlyGroups = new Map();
    for (const result of results) {
      if (result.error || !result.offers.length) continue;
      const { origin, destination, departureDate, month } = result.request;
      const offers = result.offers.slice(0, 8);
      const groupKey = `${origin}-${destination}-${month}-${offers[0].providerCurrency}`;
      dailyDeals.push({ origin, destination, date: departureDate, offers, offerRequestId: result.offerRequestId });
      const group = monthlyGroups.get(groupKey) || { origin, destination, month, checked: [] };
      group.checked.push({ date: departureDate, offer: offers[0] });
      monthlyGroups.set(groupKey, group);
    }
    const monthlyDeals = Array.from(monthlyGroups.values()).map((group) => {
      const cheapest = group.checked.sort((a, b) => {
        if (a.offer.providerCurrency !== b.offer.providerCurrency) return a.offer.providerCurrency.localeCompare(b.offer.providerCurrency);
        return Number(a.offer.providerAmount) - Number(b.offer.providerAmount);
      })[0];
      return { origin: group.origin, destination: group.destination, month: group.month, searchedDates: group.checked.map((item) => item.date), date: cheapest.date, offer: cheapest.offer };
    }).sort((a, b) => a.month.localeCompare(b.month) || a.origin.localeCompare(b.origin));
    dailyDeals.sort((a, b) => a.date.localeCompare(b.date) || a.origin.localeCompare(b.origin) || Number(a.offers[0].providerAmount) - Number(b.offers[0].providerAmount));
    const failedSearchCount = results.filter((result) => result.error).length;
    const value = { success: true, liveMode: true, monthlyDeals, dailyDeals, failedSearchCount, cached: false, generatedAt: new Date().toISOString() };
    featuredDealsCache = value;
    featuredDealsExpiresAt = Date.now() + 10 * 60 * 1000;
    console.info("[flight-deals] refreshed", {
      searches: requests.length,
      datesWithOffers: dailyDeals.length,
      monthlyDealCount: monthlyDeals.length,
      failedSearchCount,
      generatedAt: value.generatedAt,
    });
    return value;
  })();
  try { return await featuredDealsInFlight; }
  finally { featuredDealsInFlight = null; }
}

async function getOfferById(offerId) {
  const config = getDuffelConfig();
  if (!config.isConfigured) {
    throw new DuffelApiError("Flight search is not configured", {
      status: 503,
      code: "DUFFEL_NOT_CONFIGURED",
    });
  }
  const id = String(offerId || "").trim();
  if (!id) {
    throw new DuffelApiError("Offer id is required", { status: 400, code: "INVALID_OFFER_ID" });
  }

  const url = `${config.baseUrl}/air/offers/${encodeURIComponent(id)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.httpTimeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "Duffel-Version": config.version,
        Authorization: `Bearer ${config.apiKey}`,
      },
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new DuffelApiError("Unable to verify flight offer price.", {
        status: response.status === 404 ? 404 : 502,
        code: "DUFFEL_OFFER_FETCH",
        details: payload,
      });
    }
    return payload?.data || null;
  } catch (err) {
    if (err instanceof DuffelApiError) throw err;
    if (err.name === "AbortError") {
      throw new DuffelApiError("Flight offer verification timed out.", {
        status: 504,
        code: "DUFFEL_TIMEOUT",
      });
    }
    throw new DuffelApiError("Unable to verify flight offer price.", {
      status: 502,
      code: "DUFFEL_NETWORK",
    });
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  createOfferRequest,
  streamBatchOfferRequest,
  getFeaturedFlightDeals,
  getOfferById,
  DuffelApiError,
  mapCabinClass,
};
