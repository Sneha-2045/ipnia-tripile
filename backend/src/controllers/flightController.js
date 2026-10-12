const { createOfferRequest, streamBatchOfferRequest, DuffelApiError } = require("../services/duffelService");

async function searchFlights(req, res, next) {
  try {
    const result = await createOfferRequest(req.flightSearch);

    if (!result.flights.length) {
      return res.status(200).json({
        success: true,
        message: "No flights found for this route and date.",
        offerRequestId: result.offerRequestId,
        count: 0,
        flights: [],
        meta: {
          liveMode: result.liveMode,
          durationMs: result.durationMs,
          cabinClass: result.cabinClass,
        },
      });
    }

    return res.status(200).json({
      success: true,
      offerRequestId: result.offerRequestId,
      count: result.count,
      flights: result.flights,
      meta: {
        liveMode: result.liveMode,
        durationMs: result.durationMs,
        cabinClass: result.cabinClass,
      },
    });
  } catch (err) {
    if (err instanceof DuffelApiError) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
        code: err.code,
      });
    }
    return next(err);
  }
}

async function streamFlights(req, res) {
  const startedAt = Date.now();
  const controller = new AbortController();
  let disconnected = false;
  const onClose = () => {
    if (!res.writableEnded) {
      disconnected = true;
      controller.abort();
    }
  };
  res.on("close", onClose);
  res.status(200);
  res.set({
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders?.();
  const send = (event) => {
    if (!disconnected && !res.writableEnded) res.write(`data: ${JSON.stringify(event)}\n\n`);
  };
  const heartbeat = setInterval(() => {
    if (!disconnected && !res.writableEnded) res.write(": keep-alive\n\n");
  }, 12000);
  let count = 0;
  const seen = new Set();

  try {
    send({ type: "started" });
    let result;
    try {
      result = await streamBatchOfferRequest(req.flightSearch, {
        signal: controller.signal,
        onBatch: (batch) => {
          const flights = batch.flights.filter((flight) => !seen.has(flight.id));
          flights.forEach((flight) => seen.add(flight.id));
          if (!flights.length) return;
          for (let offset = 0; offset < flights.length; offset += 24) {
            const page = flights.slice(offset, offset + 24);
            count += page.length;
            send({ type: "offers", flights: page, count, remainingBatches: batch.remainingBatches, totalBatches: batch.totalBatches });
          }
        },
      });
    } catch (err) {
      // Retain compatibility with Duffel accounts/environments where batch search is unavailable.
      if (controller.signal.aborted) return;
      if (![404, 405].includes(err.status) || count > 0) throw err;
      console.warn("[flight-search] batch endpoint unavailable; using standard offer request", { status: err.status, code: err.code });
      const fallback = await createOfferRequest(req.flightSearch);
      const flights = fallback.flights.filter((flight) => !seen.has(flight.id));
      flights.forEach((flight) => seen.add(flight.id));
      count += flights.length;
      if (flights.length) send({ type: "offers", flights, count, remainingBatches: 0, totalBatches: 1 });
      result = { ...fallback, count };
    }

    send({
      type: "done",
      success: true,
      message: count ? undefined : "No flights found for this route and date.",
      offerRequestId: result.offerRequestId,
      count,
      meta: {
        liveMode: result.liveMode,
        durationMs: Date.now() - startedAt,
        providerLatencyMs: result.providerLatencyMs ?? result.durationMs,
        cabinClass: result.cabinClass,
      },
    });
  } catch (err) {
    if (!controller.signal.aborted) {
      console.error("[flight-search] stream failed", { durationMs: Date.now() - startedAt, count, code: err.code || "DUFFEL_ERROR" });
      send({ type: "error", message: err.message || "Unable to search flights right now.", code: err.code || "DUFFEL_ERROR", partialCount: count });
    }
  } finally {
    clearInterval(heartbeat);
    res.off("close", onClose);
    if (!res.writableEnded) res.end();
  }
}

module.exports = {
  searchFlights,
  streamFlights,
};
