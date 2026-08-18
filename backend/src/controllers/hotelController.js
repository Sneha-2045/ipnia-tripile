const {
  searchHotelsPlaces,
  fetchPlacePhoto,
  autocompleteHotelDestinations,
  getDestinationPlaceDetails,
  GooglePlacesError,
} = require("../services/googlePlacesService");

async function searchHotels(req, res, next) {
  try {
    const body = req.body || {};
    const destination = String(body.destination || "").trim();
    const placeId = body.placeId ? String(body.placeId).trim() : null;
    const pageToken = body.pageToken ? String(body.pageToken).trim() : null;
    const latitude =
      body.latitude != null && body.latitude !== "" ? Number(body.latitude) : null;
    const longitude =
      body.longitude != null && body.longitude !== "" ? Number(body.longitude) : null;
    const checkIn = body.checkIn ? String(body.checkIn).trim() : null;
    const checkOut = body.checkOut ? String(body.checkOut).trim() : null;
    const guests = body.guests != null ? Number(body.guests) : 2;
    const rooms = body.rooms != null ? Number(body.rooms) : 1;

    if (!destination && !placeId && !pageToken) {
      return res.status(400).json({ success: false, message: "Destination is required" });
    }

    let resolvedDestination = destination;
    let resolvedLat = Number.isFinite(latitude) ? latitude : null;
    let resolvedLng = Number.isFinite(longitude) ? longitude : null;

    // Prefer Place Details as source of truth when placeId is provided
    if (placeId && (!resolvedDestination || resolvedLat == null || resolvedLng == null)) {
      try {
        const details = await getDestinationPlaceDetails(placeId);
        if (!resolvedDestination) {
          resolvedDestination = details.formattedAddress || details.name || "";
        }
        if (resolvedLat == null && details.latitude != null) resolvedLat = details.latitude;
        if (resolvedLng == null && details.longitude != null) resolvedLng = details.longitude;
      } catch {
        // Fall through with whatever the client sent
      }
    }

    if (!resolvedDestination && !pageToken) {
      return res.status(400).json({ success: false, message: "Destination is required" });
    }

    const apiBaseUrl =
      process.env.API_PUBLIC_URL || `${req.protocol}://${req.get("host")}`;

    const result = await searchHotelsPlaces({
      destination: resolvedDestination,
      placeId,
      latitude: resolvedLat,
      longitude: resolvedLng,
      pageToken,
      checkIn,
      checkOut,
      guests: Number.isFinite(guests) ? guests : 2,
      rooms: Number.isFinite(rooms) ? rooms : 1,
      apiBaseUrl,
    });

    if (!result.hotels.length && !result.hasMore) {
      return res.status(200).json({
        success: true,
        message: "No hotels found for this destination and dates.",
        count: 0,
        hotels: [],
        nextPageToken: null,
        hasMore: false,
        totalResults: null,
      });
    }

    return res.status(200).json({
      success: true,
      count: result.count,
      hotels: result.hotels,
      nextPageToken: result.nextPageToken,
      hasMore: result.hasMore,
      totalResults: result.totalResults,
      meta: { durationMs: result.durationMs, source: "google_places" },
    });
  } catch (err) {
    if (err instanceof GooglePlacesError) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
        code: err.code,
      });
    }
    return next(err);
  }
}

async function hotelPhoto(req, res, next) {
  try {
    const ref = String(req.query.ref || "");
    const w = Number(req.query.w || 1200);
    const { buffer, contentType } = await fetchPlacePhoto({ ref, maxWidth: w });
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(buffer);
  } catch (err) {
    if (err instanceof GooglePlacesError) {
      return res.status(err.status).json({ success: false, message: err.message });
    }
    return next(err);
  }
}

async function autocompleteDestinations(req, res, next) {
  try {
    const q = String(req.query.q || req.query.input || "").trim();
    const result = await autocompleteHotelDestinations(q);
    return res.status(200).json({
      success: true,
      count: result.predictions.length,
      predictions: result.predictions,
    });
  } catch (err) {
    if (err instanceof GooglePlacesError) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
        code: err.code,
        predictions: [],
      });
    }
    return next(err);
  }
}

async function placeDetails(req, res, next) {
  try {
    const placeId = String(req.query.placeId || req.params.placeId || "").trim();
    const details = await getDestinationPlaceDetails(placeId);
    return res.status(200).json({ success: true, place: details });
  } catch (err) {
    if (err instanceof GooglePlacesError) {
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
  searchHotels,
  hotelPhoto,
  autocompleteDestinations,
  placeDetails,
};
