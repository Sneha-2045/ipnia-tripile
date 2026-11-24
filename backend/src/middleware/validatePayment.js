function validateCreatePayment(req, res, next) {
  const errors = [];
  const { currency, customer, flightOfferId, hotelPlaceId, priceAuditToken } = req.body || {};

  // Amount is resolved server-side only. Client-supplied `amount` / `hotelAmount` are ignored.

  const offerId = flightOfferId != null ? String(flightOfferId).trim() : "";
  const placeId = hotelPlaceId != null ? String(hotelPlaceId).trim() : "";
  if (!offerId && !placeId) {
    errors.push("flightOfferId or hotelPlaceId is required");
  }

  const curr = String(currency || "INR").toUpperCase();
  if (offerId) {
    if (!/^[A-Z]{3}$/.test(curr)) {
      errors.push("expectedProviderCurrency must be an ISO currency code");
    }
    if (typeof priceAuditToken !== "string" || priceAuditToken.length < 20 || priceAuditToken.length > 2000) {
      errors.push("A valid signed flight price snapshot is required");
    }
  } else if (curr !== "INR") {
    errors.push("hotel deposits are charged in INR");
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
  req.body.priceAuditToken = priceAuditToken == null ? null : String(priceAuditToken);
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
