export type DuffelCarrier = {
  id: string | null;
  name: string | null;
  iataCode: string | null;
  logoSymbolUrl: string | null;
  logoLockupUrl: string | null;
};

export type DuffelPlace = {
  iataCode: string | null;
  name: string | null;
  cityName: string | null;
  countryCode: string | null;
  terminal: string | null;
  type: string | null;
};

export type DuffelDuration = {
  iso: string;
  hours: number;
  minutes: number;
  label: string;
  totalMinutes: number;
};

export type DuffelAircraft = {
  name: string | null;
  iataCode: string | null;
};

export type DuffelBaggage = {
  available: boolean;
  carryOn: number | null;
  checked: number | null;
  summary: string | null;
};

export type DuffelAmenity = {
  key: string;
  label: string;
};

export type DuffelCondition = {
  allowed: boolean;
  penaltyAmount: string | null;
  penaltyCurrency: string | null;
  label: string;
};

export type DuffelSegment = {
  id: string | null;
  flightNumber: string | null;
  marketingCarrierFlightNumber: string | null;
  operatingCarrierFlightNumber: string | null;
  operatingCarrier: DuffelCarrier | null;
  marketingCarrier: DuffelCarrier | null;
  displayCarrier: DuffelCarrier | null;
  logoUrl: string | null;
  origin: DuffelPlace | null;
  destination: DuffelPlace | null;
  departingAt: string | null;
  arrivingAt: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
  duration: DuffelDuration | null;
  aircraft: DuffelAircraft | null;
  cabinClass: string | null;
  cabinMarketingName: string | null;
  baggage: DuffelBaggage;
  amenities: DuffelAmenity[];
  distance: string | null;
};

export type DuffelSlice = {
  id: string | null;
  origin: DuffelPlace | null;
  destination: DuffelPlace | null;
  duration: DuffelDuration | null;
  fareBrandName: string | null;
  segments: DuffelSegment[];
  stops: number;
  stopsLabel: string;
  connectionAirports: Array<{
    iataCode: string | null;
    cityName: string | null;
    name: string | null;
  }>;
  layovers: Array<{
    afterSegmentIndex: number;
    airport: DuffelPlace | null;
    durationMinutes: number;
    label: string;
  }>;
  conditions: {
    changeBeforeDeparture: DuffelCondition | null;
    refundBeforeDeparture: DuffelCondition | null;
  };
};

export type NormalizedFlightOffer = {
  id: string;
  offerRequestId: string | null;
  liveMode: boolean;
  totalAmount: string | null;
  totalCurrency: string | null;
  baseAmount: string | null;
  taxAmount: string | null;
  airlines: DuffelCarrier[];
  slices: DuffelSlice[];
  stops: number;
  stopsLabel: string | null;
  durationMinutes: number | null;
  durationLabel: string | null;
  cabinClass: string | null;
  fareBrandName: string | null;
  baggage: DuffelBaggage;
  conditions: {
    changeBeforeDeparture: DuffelCondition | null;
    refundBeforeDeparture: DuffelCondition | null;
  };
  paymentRequirements: {
    paymentRequiredBy: string | null;
    priceGuaranteeExpiresAt: string | null;
    requiresInstantPayment: boolean;
  } | null;
  expiresAt: string | null;
  primaryCarrier: DuffelCarrier | null;
  primaryLogoUrl: string | null;
  primaryFlightNumber: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
  origin: DuffelPlace | null;
  destination: DuffelPlace | null;
};

export type FlightSearchRequest = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string | null;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  maxConnections: number | null;
};

export type FlightSearchResponse = {
  success: boolean;
  message?: string;
  code?: string;
  offerRequestId?: string | null;
  count: number;
  flights: NormalizedFlightOffer[];
  meta?: {
    liveMode?: boolean;
    durationMs?: number;
    cabinClass?: string;
  };
};
