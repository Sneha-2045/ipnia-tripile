import type { FlightSearchRequest, FlightSearchResponse } from "@/types/duffelFlight";
import { getApiBase, getFlightSearchUrl } from "@/lib/apiBase";

export async function searchFlightsViaApi(
  payload: FlightSearchRequest,
  signal?: AbortSignal
): Promise<FlightSearchResponse> {
  const url = getFlightSearchUrl();

  // Temporary diagnostics for production verification
  console.log("Flight search API URL:", `${import.meta.env.VITE_API_URL}/api/flights/search`);
  console.log("Flight search resolved URL:", url);
  console.log("Flight search payload:", payload);
  console.log("VITE_API_URL raw:", import.meta.env.VITE_API_URL);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    const detail = err instanceof Error ? err.message : "Network error";
    console.error("[IPNIA] Flight search network failure:", detail, { url, apiBase: getApiBase() });
    throw new Error(`Unable to reach flight search API (${detail}).`);
  }

  const data = (await res.json().catch(() => ({}))) as FlightSearchResponse & {
    errors?: string[];
    code?: string;
  };

  if (!res.ok || data.success === false) {
    const backendMessage =
      (typeof data.message === "string" && data.message.trim()) ||
      (Array.isArray(data.errors) && data.errors[0]) ||
      null;

    console.error("[IPNIA] Flight search API error:", {
      status: res.status,
      message: backendMessage,
      code: data.code,
      body: data,
    });

    throw new Error(
      backendMessage ||
        (res.status === 429
          ? "Too many flight searches. Please wait a moment and try again."
          : `Flight search failed (${res.status}).`)
    );
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
  if (!Number.isFinite(num)) return amount;
  // IPNIA flight search always presents fares in INR
  const code = (currency || "INR").toUpperCase() === "INR" ? "INR" : currency || "INR";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: code === "INR" ? "INR" : code,
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `₹${num.toLocaleString("en-IN")}`;
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
