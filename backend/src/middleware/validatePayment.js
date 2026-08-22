function validateCreatePayment(req, res, next) {
  const errors = [];
  const { currency, customer, flightOfferId, hotelPlaceId } = req.body || {};

  // Amount is resolved server-side only. Client-supplied `amount` / `hotelAmount` are ignored.

  const curr = (currency || "INR").toUpperCase();
  if (curr !== "INR") {
    errors.push("only INR currency is supported currently");
  }

  const offerId = flightOfferId != null ? String(flightOfferId).trim() : "";
  const placeId = hotelPlaceId != null ? String(hotelPlaceId).trim() : "";
  if (!offerId && !placeId) {
    errors.push("flightOfferId or hotelPlaceId is required");
  }

  if (!customer || typeof customer !== "object") {
    errors.push("customer object is required");
  } else {
    if (!customer.name || String(customer.name).trim().length < 2) {
      errors.push("customer.name is required");
    }
    const email = String(customer.email || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("customer.email must be a valid email");
    }
    const phone = String(customer.phone || "").replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(phone)) {
      errors.push("customer.phone must be a valid 10-digit Indian mobile number");
    }
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body.currency = curr;
  req.body.flightOfferId = offerId || null;
  req.body.hotelPlaceId = placeId || null;
  req.body.customer = {
    name: String(customer.name).trim(),
    email: String(customer.email).trim().toLowerCase(),
    phone: String(customer.phone).replace(/\D/g, "").slice(-10),
  };

  return next();
}

module.exports = {
  validateCreatePayment,
};
