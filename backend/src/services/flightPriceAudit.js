const crypto = require("node:crypto");
const { getJwtSecret } = require("./authToken");

function signFlightPriceSnapshot(offer) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const parsedExpiry = offer.expires_at ? Math.floor(new Date(offer.expires_at).getTime() / 1000) : NaN;
  const expirySeconds = Number.isInteger(parsedExpiry) ? parsedExpiry : nowSeconds + 20 * 60;
  const payload = {
    source: "duffel_api",
    offerId: String(offer.id),
    amount: String(offer.total_amount),
    currency: String(offer.total_currency).toUpperCase(),
    baseAmount: offer.base_amount == null ? null : String(offer.base_amount),
    baseCurrency: offer.base_currency || offer.total_currency || null,
    taxAmount: offer.tax_amount == null ? null : String(offer.tax_amount),
    taxCurrency: offer.tax_currency || offer.total_currency || null,
    issuedAt: nowSeconds,
    expiresAt: expirySeconds,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifyFlightPriceSnapshot(token) {
  const [encodedPayload, receivedSignature, extra] = String(token || "").split(".");
  if (!encodedPayload || !receivedSignature || extra) return null;
  const expectedSignature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(encodedPayload)
    .digest();
  let suppliedSignature;
  try {
    suppliedSignature = Buffer.from(receivedSignature, "base64url");
  } catch {
    return null;
  }
  if (suppliedSignature.length !== expectedSignature.length || !crypto.timingSafeEqual(suppliedSignature, expectedSignature)) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (payload.source !== "duffel_api" || !payload.offerId || !/^[A-Z]{3}$/.test(payload.currency)) return null;
    if (!/^\d+(?:\.\d+)?$/.test(payload.amount) || Number(payload.amount) <= 0) return null;
    if (!Number.isInteger(payload.expiresAt) || payload.expiresAt < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

module.exports = { signFlightPriceSnapshot, verifyFlightPriceSnapshot };
