function getDuffelConfig() {
  const apiKey = process.env.DUFFEL_API_KEY || "";
  const baseUrl = process.env.DUFFEL_API_BASE_URL || "https://api.duffel.com";
  const version = process.env.DUFFEL_VERSION || "v2";
  // Keep below typical client/proxy timeouts so partial results can still return
  const supplierTimeoutMs = Number(process.env.DUFFEL_SUPPLIER_TIMEOUT_MS || 15000);
  const httpTimeoutMs = Number(process.env.DUFFEL_HTTP_TIMEOUT_MS || 25000);

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
    version,
    supplierTimeoutMs: Number.isFinite(supplierTimeoutMs) ? supplierTimeoutMs : 15000,
    httpTimeoutMs: Number.isFinite(httpTimeoutMs) ? httpTimeoutMs : 25000,
    isConfigured: Boolean(apiKey),
    isTestKey: apiKey.startsWith("duffel_test_"),
  };
}

module.exports = {
  getDuffelConfig,
};
