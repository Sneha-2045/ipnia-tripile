const IATA_RE = /^[A-Za-z]{3}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateString(value) {
  if (!DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function validateFlightSearch(req, res, next) {
  const body = req.body || {};
  const errors = [];

  const origin = String(body.origin || "").trim().toUpperCase();
  const destination = String(body.destination || "").trim().toUpperCase();
  const departureDate = String(body.departureDate || "").trim();
  const returnDateRaw = body.returnDate;
  const returnDate =
    returnDateRaw === null || returnDateRaw === undefined || returnDateRaw === ""
      ? null
      : String(returnDateRaw).trim();

  const adults = Number(body.adults ?? 1);
  const children = Number(body.children ?? 0);
  const infants = Number(body.infants ?? 0);
  const cabinClass = String(body.cabinClass || "economy").toLowerCase();
  const maxConnections =
    body.maxConnections === undefined || body.maxConnections === null || body.maxConnections === ""
      ? null
      : Number(body.maxConnections);

  if (!IATA_RE.test(origin)) errors.push("origin must be a 3-letter IATA code");
  if (!IATA_RE.test(destination)) errors.push("destination must be a 3-letter IATA code");
  if (origin && destination && origin === destination) {
    errors.push("origin and destination must be different");
  }
  if (!isValidDateString(departureDate)) errors.push("departureDate must be YYYY-MM-DD");
  if (returnDate !== null && !isValidDateString(returnDate)) {
    errors.push("returnDate must be YYYY-MM-DD or null");
  }
  if (returnDate && departureDate && returnDate < departureDate) {
    errors.push("returnDate must not be before departureDate");
  }
  if (!Number.isInteger(adults) || adults < 1 || adults > 9) {
    errors.push("adults must be an integer between 1 and 9");
  }
  if (!Number.isInteger(children) || children < 0 || children > 8) {
    errors.push("children must be an integer between 0 and 8");
  }
  if (!Number.isInteger(infants) || infants < 0 || infants > adults) {
    errors.push("infants must be between 0 and the number of adults");
  }
  if (adults + children + infants > 9) {
    errors.push("total passengers cannot exceed 9");
  }

  const allowedCabins = new Set([
    "economy",
    "premium",
    "premium_economy",
    "business",
    "first",
  ]);
  if (!allowedCabins.has(cabinClass)) {
    errors.push("cabinClass is invalid");
  }

  if (maxConnections !== null && (![0, 1, 2].includes(maxConnections) || !Number.isInteger(maxConnections))) {
    errors.push("maxConnections must be 0, 1, 2, or null");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  req.flightSearch = {
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    cabinClass,
    maxConnections,
  };
  return next();
}

module.exports = {
  validateFlightSearch,
};
