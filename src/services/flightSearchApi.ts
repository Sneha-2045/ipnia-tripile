import type { FlightSearchRequest, FlightSearchResponse } from "@/types/duffelFlight";

function getApiBase() {
  const raw = String(import.meta.env.VITE_API_URL || "http://localhost:5001").trim();
  // Take first valid absolute URL if the env value was accidentally written with "||"
  const match = raw.match(/https?:\/\/[^\s|]+/i);
  return (match?.[0] || "http://localhost:5001").replace(/\/$/, "");
}

const API_BASE = getApiBase();

export async function searchFlightsViaApi(
  payload: FlightSearchRequest,
  signal?: AbortSignal
): Promise<FlightSearchResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/flights/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new Error("Unable to search flights right now.");
  }

  const data = (await res.json().catch(() => ({}))) as FlightSearchResponse & {
    errors?: string[];
  };

  if (!res.ok || data.success === false) {
    const message =
      data.message ||
      (res.status === 429
        ? "Too many flight searches. Please wait a moment and try again."
        : res.status >= 500
          ? "Unable to search flights right now."
          : "Unable to search flights right now.");
    throw new Error(message);
  }

  return {
    success: true,
    message: data.message,
    offerRequestId: data.offerRequestId,
    count: data.count ?? data.flights?.length ?? 0,
    flights: Array.isArray(data.flights) ? data.flights : [],
    meta: data.meta,
  };
}

export function formatMoney(amount: string | null, currency: string | null) {
  if (amount == null || amount === "") return "—";
  const num = Number(amount);
  if (!Number.isFinite(num)) return `${currency || ""} ${amount}`.trim();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currency || ""} ${num.toLocaleString()}`.trim();
  }
}

export function formatCabinLabel(cabin: string | null | undefined) {
  if (!cabin) return null;
  const map: Record<string, string> = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First",
  };
  return map[cabin] || cabin.replace(/_/g, " ");
}

export function formatDateTimeLocal(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
