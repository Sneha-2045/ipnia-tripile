function getCashfreeConfig() {
  const env = (process.env.CASHFREE_ENV || "sandbox").toLowerCase();
  const isProduction = env === "production" || env === "prod";

  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  const apiVersion = process.env.CASHFREE_API_VERSION || "2025-01-01";
  const webhookSecret =
    process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET are required");
  }

  return {
    env: isProduction ? "production" : "sandbox",
    baseUrl: isProduction
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg",
    clientId,
    clientSecret,
    apiVersion,
    webhookSecret,
  };
}

module.exports = {
  getCashfreeConfig,
};
