import type { CabinClass } from "@/services/bookingApi";
import type { SelectedFlight } from "@/types/booking";
import { splitFare } from "@/types/booking";
import type { NormalizedFlightOffer } from "@/types/duffelFlight";
import { getAirportByCode } from "@/data/airports";

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

/** India ISO / name variants used by Duffel and our airport list */
export function isIndiaCountry(value: string | null | undefined): boolean {
  const v = String(value || "")
    .trim()
    .toLowerCase();
  return v === "in" || v === "ind" || v === "india";
}

function resolveCountryCode(iata: string | null | undefined, fromOffer: string | null | undefined): string {
  const offered = String(fromOffer || "").trim();
  if (offered) return offered;
  const airport = iata ? getAirportByCode(iata) : undefined;
  return airport?.country || "";
}

/**
 * Passport required when origin OR destination is outside India.
 * Domestic India↔India does not require passport details.
 */
export function isInternationalIndiaRoute(
  originCountry: string | null | undefined,
  destinationCountry: string | null | undefined
): boolean {
  return !(isIndiaCountry(originCountry) && isIndiaCountry(destinationCountry));
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
    adults?: number;
    children?: number;
    infants?: number;
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
    const split = splitFare(safeTotal);
    fare = split.fare;
    taxes = split.taxes;
  }

  const originIata = outbound?.origin?.iataCode || firstSeg?.origin?.iataCode || "";
  const destIata =
    outbound?.destination?.iataCode || lastSeg?.destination?.iataCode || "";

  const originCountry = resolveCountryCode(
    originIata,
    firstSeg?.origin?.countryCode || outbound?.origin?.countryCode || ""
  );
  const destCountry = resolveCountryCode(
    destIata,
    lastSeg?.destination?.countryCode || outbound?.destination?.countryCode || ""
  );

  const isInternational = isInternationalIndiaRoute(originCountry, destCountry);

  const adults = Math.max(1, opts.adults ?? opts.travellerCount);
  const children = Math.max(0, opts.children ?? 0);
  const infants = Math.max(0, opts.infants ?? 0);
  const travellerCount = Math.max(1, adults + children + infants);

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
    origin: originIata,
    originCity: outbound?.origin?.cityName || firstSeg?.origin?.cityName || "",
    destination: destIata,
    destinationCity: outbound?.destination?.cityName || lastSeg?.destination?.cityName || "",
    originCountry: originCountry || "Unknown",
    destinationCountry: destCountry || "Unknown",
    departureDate: opts.departureDate || dateFromIso(firstSeg?.departingAt, ""),
    departureTime: offer.departureTime || firstSeg?.departureTime || "",
    arrivalTime: offer.arrivalTime || lastSeg?.arrivalTime || "",
    duration: offer.durationLabel || outbound?.duration?.label || "",
    stops: offer.stops ?? outbound?.stops ?? 0,
    cabin: mapCabin(offer.cabinClass || firstSeg?.cabinClass),
    fare,
    taxes,
    totalAmount: safeTotal,
    travellerCount,
    adults,
    children,
    infants,
    isInternational,
  };
}
