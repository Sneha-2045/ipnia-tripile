const { createOfferRequest, DuffelApiError } = require("../services/duffelService");

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

module.exports = {
  searchFlights,
};
