function getDuffelConfig() {
  const apiKey = process.env.DUFFEL_API_KEY || "";
  const baseUrl = process.env.DUFFEL_API_BASE_URL || "https://api.duffel.com";
  const version = process.env.DUFFEL_VERSION || "v2";
  const configuredSupplierTimeout = Number(process.env.DUFFEL_SUPPLIER_TIMEOUT_MS || 20000);
  const supplierTimeoutMs = Number.isFinite(configuredSupplierTimeout)
    ? Math.max(2000, Math.min(60000, configuredSupplierTimeout))
    : 20000;
  const configuredHttpTimeout = Number(process.env.DUFFEL_HTTP_TIMEOUT_MS || 30000);
  // Duffel recommends that its HTTP client timeout exceed supplier_timeout.
  const httpTimeoutMs = Math.max(
    Number.isFinite(configuredHttpTimeout) ? configuredHttpTimeout : 30000,
    supplierTimeoutMs + 5000
  );

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
    version,
    supplierTimeoutMs,
    httpTimeoutMs,
    isConfigured: Boolean(apiKey),
    isTestKey: apiKey.startsWith("duffel_test_"),
  };
}

module.exports = {
  getDuffelConfig,
};
