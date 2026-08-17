/**
 * Backend API base URL for the IPNIA frontend.
 * Never falls back to localhost — production must call the Render API.
 */
const PRODUCTION_API_URL = "https://ipnia-tripile.onrender.com";

function isLocalhostUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url);
  }
}

export function getApiBase(): string {
  const raw = String(import.meta.env.VITE_API_URL || "").trim();
  const match = raw.match(/https?:\/\/[^\s|]+/i);
  let base = (match?.[0] || raw || PRODUCTION_API_URL).replace(/\/$/, "");

  if (!/^https?:\/\//i.test(base)) {
    base = PRODUCTION_API_URL;
  }

  // Never allow localhost / loopback in the browser bundle
  if (isLocalhostUrl(base)) {
    console.warn(
      "[IPNIA] VITE_API_URL pointed at localhost; using production API instead:",
      PRODUCTION_API_URL
    );
    base = PRODUCTION_API_URL;
  }

  return base;
}

export function getFlightSearchUrl() {
  return `${getApiBase()}/api/flights/search`;
}
