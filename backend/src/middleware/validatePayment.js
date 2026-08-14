function validateCreatePayment(req, res, next) {
  const errors = [];
  const { amount, currency, customer, bookingId } = req.body || {};

  // Amount validation — later this may be overwritten from a booking record
  if (amount === undefined || amount === null || amount === "") {
    errors.push("amount is required");
  } else if (typeof amount !== "number" || Number.isNaN(amount)) {
    errors.push("amount must be a number");
  } else if (amount < 1) {
    errors.push("amount must be at least 1");
  } else if (amount > 500000) {
    errors.push("amount exceeds allowed maximum");
  }

  const curr = (currency || "INR").toUpperCase();
  if (curr !== "INR") {
    errors.push("only INR currency is supported currently");
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

  if (bookingId !== undefined && bookingId !== null && typeof bookingId !== "string") {
    errors.push("bookingId must be a string when provided");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Normalize
  req.body.currency = curr;
  req.body.customer = {
    name: String(customer.name).trim(),
    email: String(customer.email).trim().toLowerCase(),
    phone: String(customer.phone).replace(/\D/g, "").slice(-10),
  };
  req.body.amount = Number(amount);

  return next();
}

module.exports = {
  validateCreatePayment,
};
