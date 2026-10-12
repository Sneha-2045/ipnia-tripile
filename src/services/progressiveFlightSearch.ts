import type { FlightSearchRequest, FlightSearchResponse } from "@/types/duffelFlight";
import { getFlightSearchStreamUrl } from "@/lib/apiBase";

type OfferEvent = { type: "offers"; flights: FlightSearchResponse["flights"]; count: number; remainingBatches: number; totalBatches: number };
type ProgressEvent = { type: "started" } | OfferEvent;
type StreamEvent = ProgressEvent | { type: "done"; success: true; message?: string; offerRequestId?: string | null; count: number; meta?: FlightSearchResponse["meta"] } | { type: "error"; message: string; code?: string; partialCount?: number };
type Subscriber = {
  onOffers: (event: OfferEvent) => void;
  onProgress: (event: ProgressEvent) => void;
  resolve: (response: FlightSearchResponse) => void;
  reject: (error: Error) => void;
  signal?: AbortSignal;
  abortListener?: () => void;
};
type SharedSearch = { controller: AbortController; subscribers: Set<Subscriber>; cancelTimer?: ReturnType<typeof setTimeout> };

const activeSearches = new Map<string, SharedSearch>();
const makeAbortError = () => new DOMException("The flight search was cancelled.", "AbortError");

function unsubscribe(key: string, search: SharedSearch, subscriber: Subscriber) {
  if (!search.subscribers.delete(subscriber)) return;
  if (subscriber.signal && subscriber.abortListener) subscriber.signal.removeEventListener("abort", subscriber.abortListener);
  if (!search.subscribers.size && activeSearches.get(key) === search) {
    // Defer cancellation briefly so React StrictMode remounts can join the same request.
    search.cancelTimer = setTimeout(() => {
      if (!search.subscribers.size && activeSearches.get(key) === search) {
        activeSearches.delete(key);
        search.controller.abort();
      }
    }, 0);
  }
}

async function consume(key: string, search: SharedSearch, payload: FlightSearchRequest) {
  const startedAt = performance.now();
  let firstResultMs: number | null = null;
  let observedCount = 0;
  try {
    const response = await fetch(getFlightSearchStreamUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify(payload),
      signal: search.controller.signal,
    });
    if (!response.ok || !response.body) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Flight search failed (${response.status}).`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let completed: FlightSearchResponse | null = null;
    const handle = (raw: string) => {
      if (!raw.trim()) return;
      const event = JSON.parse(raw) as StreamEvent;
      if (event.type === "started") {
        search.subscribers.forEach((subscriber) => subscriber.onProgress(event));
      } else if (event.type === "offers") {
        if (firstResultMs === null && event.flights.length) firstResultMs = performance.now() - startedAt;
        observedCount = event.count;
        search.subscribers.forEach((subscriber) => {
          subscriber.onOffers(event);
          subscriber.onProgress(event);
        });
      } else if (event.type === "done") {
        completed = { success: true, message: event.message, offerRequestId: event.offerRequestId, count: event.count, flights: [], meta: event.meta };
      } else if (event.type === "error") {
        throw new Error(event.message || "Unable to search flights right now.");
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      let boundary = buffer.indexOf("\n\n");
      while (boundary >= 0) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const data = frame.split(/\r?\n/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
        if (data) handle(data);
        boundary = buffer.indexOf("\n\n");
      }
      if (done) break;
    }
    if (!completed) throw new Error("Flight search ended before results were complete.");
    console.info("[flight-search] browser metrics", {
      timeToFirstResultMs: firstResultMs === null ? null : Math.round(firstResultMs),
      totalDurationMs: Math.round(performance.now() - startedAt),
      resultCount: completed.count,
      providerLatencyMs: completed.meta?.providerLatencyMs ?? null,
      errors: 0,
    });
    search.subscribers.forEach((subscriber) => subscriber.resolve(completed!));
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unable to search flights right now.");
    if (err.name !== "AbortError") console.error("[flight-search] browser request failed", { totalDurationMs: Math.round(performance.now() - startedAt), resultCount: observedCount, errors: 1, message: err.message });
    search.subscribers.forEach((subscriber) => subscriber.reject(err));
  } finally {
    if (activeSearches.get(key) === search) activeSearches.delete(key);
    search.subscribers.forEach((subscriber) => {
      if (subscriber.signal && subscriber.abortListener) subscriber.signal.removeEventListener("abort", subscriber.abortListener);
    });
    search.subscribers.clear();
  }
}

/** Share identical active requests and emit live Duffel batches as they arrive. */
export function searchFlightsProgressively(
  payload: FlightSearchRequest,
  signal: AbortSignal | undefined,
  onOffers: Subscriber["onOffers"],
  onProgress: Subscriber["onProgress"]
): Promise<FlightSearchResponse> {
  if (signal?.aborted) return Promise.reject(makeAbortError());
  const key = JSON.stringify(payload);
  let search = activeSearches.get(key);
  const isNew = !search;
  if (!search) {
    search = { controller: new AbortController(), subscribers: new Set() };
    activeSearches.set(key, search);
  }
  if (search.cancelTimer) clearTimeout(search.cancelTimer);

  return new Promise((resolve, reject) => {
    const current = search!;
    const subscriber: Subscriber = { onOffers, onProgress, resolve, reject, signal };
    current.subscribers.add(subscriber);
    if (signal) {
      subscriber.abortListener = () => {
        unsubscribe(key, current, subscriber);
        reject(makeAbortError());
      };
      signal.addEventListener("abort", subscriber.abortListener, { once: true });
    }
    if (isNew) void consume(key, current, payload);
  });
}
