import type { CabinClass } from "@/services/bookingApi";
import type { SelectedFlight } from "@/types/booking";
import { splitFare } from "@/types/booking";
import type { NormalizedFlightOffer } from "@/types/duffelFlight";

function mapCabin(cabin: string | null | undefined): CabinClass {
  const c = String(cabin || "economy").toLowerCase();
  if (c === "premium_economy" || c === "premium") return "premium";
  if (c === "business") return "business";
  if (c === "first") return "first";
  return "economy";
}

function dateFromIso(iso: string | null | undefined, fallback = "") {
  if (!iso) return fallback;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toISOString().slice(0, 10);
}

/**
 * Map a Duffel offer into the existing IPNIA booking pipeline flight shape.
 * Does not create a Duffel order — payment/booking uses the IPNIA Cashfree flow.
 */
export function mapDuffelOfferToSelectedFlight(
  offer: NormalizedFlightOffer,
  opts: {
    departureDate?: string;
    travellerCount: number;
  }
): SelectedFlight {
  const outbound = offer.slices[0];
  const firstSeg = outbound?.segments[0];
  const lastSeg = outbound?.segments[(outbound?.segments.length || 1) - 1];

  const totalAmount = Number(offer.totalAmount);
  const safeTotal = Number.isFinite(totalAmount) && totalAmount > 0 ? totalAmount : 0;

  let fare = Number(offer.baseAmount);
  let taxes = Number(offer.taxAmount);
  if (!Number.isFinite(fare) || !Number.isFinite(taxes) || fare < 0 || taxes < 0) {
    const split = splitFare(safeTotal);
    fare = split.fare;
    taxes = split.taxes;
  } else if (Math.abs(fare + taxes - safeTotal) > 1) {
    // Prefer explicit total; keep base/tax as provided when they roughly match
    const split = splitFare(safeTotal);
    fare = split.fare;
    taxes = split.taxes;
  }

  const originCountry = firstSeg?.origin?.countryCode || outbound?.origin?.countryCode || "";
  const destCountry =
    lastSeg?.destination?.countryCode || outbound?.destination?.countryCode || "";
  const isInternational =
    originCountry && destCountry ? originCountry !== destCountry : true;

  const airline =
    offer.primaryCarrier?.name ||
    firstSeg?.displayCarrier?.name ||
    firstSeg?.operatingCarrier?.name ||
    firstSeg?.marketingCarrier?.name ||
    "Airline";

  return {
    id: offer.id,
    airline,
    flightNumber: offer.primaryFlightNumber || firstSeg?.flightNumber || "",
    origin: outbound?.origin?.iataCode || firstSeg?.origin?.iataCode || "",
    originCity: outbound?.origin?.cityName || firstSeg?.origin?.cityName || "",
    destination: outbound?.destination?.iataCode || lastSeg?.destination?.iataCode || "",
    destinationCity: outbound?.destination?.cityName || lastSeg?.destination?.cityName || "",
    originCountry: originCountry || "Unknown",
    destinationCountry: destCountry || "Unknown",
    departureDate:
      opts.departureDate ||
      dateFromIso(firstSeg?.departingAt, ""),
    departureTime: offer.departureTime || firstSeg?.departureTime || "",
    arrivalTime: offer.arrivalTime || lastSeg?.arrivalTime || "",
    duration: offer.durationLabel || outbound?.duration?.label || "",
    stops: offer.stops ?? outbound?.stops ?? 0,
    cabin: mapCabin(offer.cabinClass || firstSeg?.cabinClass),
    fare,
    taxes,
    totalAmount: safeTotal,
    travellerCount: Math.max(1, opts.travellerCount),
    isInternational,
  };
}
