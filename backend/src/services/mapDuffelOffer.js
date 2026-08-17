/**
 * Normalize Duffel offer objects into a UI-friendly shape.
 * Only maps fields that exist — never invents airline/baggage/price data.
 */

function parseIsoDuration(iso) {
  if (!iso || typeof iso !== "string") return null;
  const match = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i);
  if (!match) return null;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  return {
    iso,
    hours,
    minutes,
    label: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
    totalMinutes: hours * 60 + minutes,
  };
}

function formatClock(isoDateTime) {
  if (!isoDateTime) return null;
  const d = new Date(isoDateTime);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function mapPlace(place) {
  if (!place || typeof place !== "object") return null;
  return {
    iataCode: place.iata_code || null,
    name: place.name || null,
    cityName: place.city_name || place.city?.name || null,
    countryCode: place.iata_country_code || place.city?.iata_country_code || null,
    terminal: place.terminal || null,
    type: place.type || null,
  };
}

function mapCarrier(carrier) {
  if (!carrier || typeof carrier !== "object") return null;
  return {
    id: carrier.id || null,
    name: carrier.name || null,
    iataCode: carrier.iata_code || null,
    logoSymbolUrl: carrier.logo_symbol_url || null,
    logoLockupUrl: carrier.logo_lockup_url || null,
  };
}

function mapAircraft(aircraft) {
  if (!aircraft || typeof aircraft !== "object") return null;
  if (!aircraft.name && !aircraft.iata_code) return null;
  return {
    name: aircraft.name || null,
    iataCode: aircraft.iata_code || null,
  };
}

function mapPassengerBaggage(passengers) {
  if (!Array.isArray(passengers) || passengers.length === 0) {
    return { available: false, carryOn: null, checked: null, summary: null };
  }

  // Aggregate first passenger segment baggages (typical offer presentation)
  const bags = passengers[0]?.baggages;
  if (!Array.isArray(bags) || bags.length === 0) {
    return { available: false, carryOn: null, checked: null, summary: null };
  }

  let carryOn = 0;
  let checked = 0;
  for (const bag of bags) {
    const qty = Number(bag.quantity || 0);
    if (bag.type === "carry_on") carryOn += qty;
    if (bag.type === "checked") checked += qty;
  }

  const parts = [];
  if (carryOn > 0) parts.push(`${carryOn} carry-on`);
  if (checked > 0) parts.push(`${checked} checked bag${checked > 1 ? "s" : ""}`);

  return {
    available: parts.length > 0,
    carryOn: carryOn || null,
    checked: checked || null,
    summary: parts.length ? parts.map((p) => `✓ ${p}`).join(" · ") : null,
  };
}

function mapAmenities(passenger) {
  const amenities = passenger?.cabin?.amenities;
  if (!amenities || typeof amenities !== "object") return [];

  const out = [];
  const wifi = amenities.wifi;
  if (wifi && wifi.available) {
    out.push({
      key: "wifi",
      label: wifi.cost === "free" ? "Wi-Fi (free)" : wifi.cost === "paid" ? "Wi-Fi (paid)" : "Wi-Fi",
    });
  }
  const power = amenities.power;
  if (power && power.available) {
    out.push({ key: "power", label: "Power" });
  }
  const seat = amenities.seat;
  if (seat?.pitch) {
    out.push({ key: "legroom", label: `Seat pitch ${seat.pitch}` });
  }
  if (seat?.type) {
    out.push({ key: "seat", label: String(seat.type).replace(/_/g, " ") });
  }
  return out;
}

function mapCondition(condition) {
  if (!condition || typeof condition !== "object") return null;
  const allowed = condition.allowed;
  if (typeof allowed !== "boolean") return null;
  const penalty = condition.penalty_amount;
  const currency = condition.penalty_currency;
  return {
    allowed,
    penaltyAmount: penalty != null ? String(penalty) : null,
    penaltyCurrency: currency || null,
    label: allowed
      ? penalty != null && Number(penalty) > 0
        ? `Allowed (fee ${currency || ""} ${penalty})`.trim()
        : "Allowed"
      : "Not available",
  };
}

function mapSegment(segment) {
  const operating = mapCarrier(segment.operating_carrier);
  const marketing = mapCarrier(segment.marketing_carrier);
  const displayCarrier = operating?.name ? operating : marketing;

  const passengers = Array.isArray(segment.passengers) ? segment.passengers : [];
  const primaryPassenger = passengers[0] || null;
  const cabinClass = primaryPassenger?.cabin_class || null;
  const cabinMarketingName = primaryPassenger?.cabin_class_marketing_name || null;
  const baggage = mapPassengerBaggage(passengers);
  const amenities = mapAmenities(primaryPassenger);
  const duration = parseIsoDuration(segment.duration);

  const flightNumber =
    segment.marketing_carrier_flight_number ||
    segment.operating_carrier_flight_number ||
    null;

  return {
    id: segment.id || null,
    flightNumber,
    marketingCarrierFlightNumber: segment.marketing_carrier_flight_number || null,
    operatingCarrierFlightNumber: segment.operating_carrier_flight_number || null,
    operatingCarrier: operating,
    marketingCarrier: marketing,
    displayCarrier,
    logoUrl: displayCarrier?.logoSymbolUrl || displayCarrier?.logoLockupUrl || null,
    origin: mapPlace(segment.origin),
    destination: mapPlace(segment.destination),
    departingAt: segment.departing_at || null,
    arrivingAt: segment.arriving_at || null,
    departureTime: formatClock(segment.departing_at),
    arrivalTime: formatClock(segment.arriving_at),
    duration,
    aircraft: mapAircraft(segment.aircraft),
    cabinClass,
    cabinMarketingName,
    baggage,
    amenities,
    distance: segment.distance || null,
  };
}

function mapSlice(slice) {
  const segments = Array.isArray(slice.segments) ? slice.segments.map(mapSegment) : [];
  const stops = Math.max(0, segments.length - 1);
  const connectionAirports = [];
  for (let i = 0; i < segments.length - 1; i += 1) {
    const dest = segments[i].destination;
    if (dest?.iataCode) {
      connectionAirports.push({
        iataCode: dest.iataCode,
        cityName: dest.cityName,
        name: dest.name,
      });
    }
  }

  const layovers = [];
  for (let i = 0; i < segments.length - 1; i += 1) {
    const arrive = segments[i].arrivingAt ? new Date(segments[i].arrivingAt) : null;
    const depart = segments[i + 1].departingAt ? new Date(segments[i + 1].departingAt) : null;
    if (arrive && depart && !Number.isNaN(arrive.getTime()) && !Number.isNaN(depart.getTime())) {
      const mins = Math.max(0, Math.round((depart.getTime() - arrive.getTime()) / 60000));
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      layovers.push({
        afterSegmentIndex: i,
        airport: segments[i].destination,
        durationMinutes: mins,
        label: h > 0 ? `${h}h ${m}m layover` : `${m}m layover`,
      });
    }
  }

  return {
    id: slice.id || null,
    origin: mapPlace(slice.origin),
    destination: mapPlace(slice.destination),
    duration: parseIsoDuration(slice.duration),
    fareBrandName: slice.fare_brand_name || null,
    segments,
    stops,
    stopsLabel: stops === 0 ? "Non-stop" : `${stops} stop${stops > 1 ? "s" : ""}`,
    connectionAirports,
    layovers,
    conditions: {
      changeBeforeDeparture: mapCondition(slice.conditions?.change_before_departure),
      refundBeforeDeparture: mapCondition(slice.conditions?.refund_before_departure),
    },
  };
}

function collectAirlines(slices) {
  const map = new Map();
  for (const slice of slices) {
    for (const seg of slice.segments) {
      const c = seg.displayCarrier || seg.operatingCarrier || seg.marketingCarrier;
      if (c?.name) {
        const key = c.iataCode || c.name;
        if (!map.has(key)) map.set(key, c);
      }
    }
  }
  return Array.from(map.values());
}

function mapDuffelOfferToFlight(offer) {
  if (!offer || typeof offer !== "object") return null;

  const slices = Array.isArray(offer.slices) ? offer.slices.map(mapSlice) : [];
  const firstSlice = slices[0] || null;
  const firstSeg = firstSlice?.segments?.[0] || null;
  const lastSeg =
    firstSlice?.segments?.[firstSlice.segments.length - 1] || null;

  const change = mapCondition(offer.conditions?.change_before_departure);
  const refund = mapCondition(offer.conditions?.refund_before_departure);

  const paymentRequirements = offer.payment_requirements
    ? {
        paymentRequiredBy: offer.payment_requirements.payment_required_by || null,
        priceGuaranteeExpiresAt:
          offer.payment_requirements.price_guarantee_expires_at || null,
        requiresInstantPayment: Boolean(offer.payment_requirements.requires_instant_payment),
      }
    : null;

  const totalMinutes = slices.reduce(
    (sum, s) => sum + (s.duration?.totalMinutes || 0),
    0
  );

  return {
    id: offer.id,
    offerRequestId: offer.offer_request_id || null,
    liveMode: Boolean(offer.live_mode),
    totalAmount: offer.total_amount != null ? String(offer.total_amount) : null,
    totalCurrency: offer.total_currency || null,
    baseAmount: offer.base_amount != null ? String(offer.base_amount) : null,
    taxAmount: offer.tax_amount != null ? String(offer.tax_amount) : null,
    airlines: collectAirlines(slices),
    slices,
    stops: firstSlice?.stops ?? 0,
    stopsLabel: firstSlice?.stopsLabel || null,
    durationMinutes: totalMinutes || firstSlice?.duration?.totalMinutes || null,
    durationLabel: firstSlice?.duration?.label || null,
    cabinClass: firstSeg?.cabinClass || null,
    fareBrandName: firstSlice?.fareBrandName || null,
    baggage: firstSeg?.baggage || { available: false, carryOn: null, checked: null, summary: null },
    conditions: {
      changeBeforeDeparture: change,
      refundBeforeDeparture: refund,
    },
    paymentRequirements,
    expiresAt: offer.expires_at || null,
    // Convenience fields for list cards
    primaryCarrier: firstSeg?.displayCarrier || null,
    primaryLogoUrl: firstSeg?.logoUrl || null,
    primaryFlightNumber: firstSeg?.flightNumber || null,
    departureTime: firstSeg?.departureTime || null,
    arrivalTime: lastSeg?.arrivalTime || null,
    origin: firstSlice?.origin || null,
    destination: firstSlice?.destination || null,
  };
}

module.exports = {
  mapDuffelOfferToFlight,
  parseIsoDuration,
};
