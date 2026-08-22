import type { CabinClass } from "@/services/bookingApi";

export type TravellerTitle = "Mr" | "Mrs" | "Ms" | "Other";
export type Gender = "Male" | "Female" | "Other" | "";

export type SelectedFlight = {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  originCountry: string;
  destinationCountry: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  cabin: CabinClass;
  fare: number;
  taxes: number;
  totalAmount: number;
  travellerCount: number;
  adults: number;
  children: number;
  infants: number;
  isInternational: boolean;
};

export type TravelDocument = {
  passportNumber: string;
  issuingCountry: string;
  issueDate: string;
  expiryDate: string;
  nationality: string;
};

export type TravellerType = "adult" | "child" | "infant";

export type Traveller = {
  id: string;
  type: TravellerType;
  title: TravellerTitle;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  email: string;
  phone: string;
  document: TravelDocument;
};

export type SelectedHotelBooking = {
  id: string;
  name: string;
  location: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  roomPrice: number;
  taxes: number;
  totalPrice: number;
  /** Google Place id when booking from hotel search (server uses deposit). */
  placeId?: string | null;
  /** When true, payable amount is server deposit rather than room estimate. */
  isDeposit?: boolean;
} | null;


export type PriceBreakdown = {
  flightFare: number;
  flightTaxes: number;
  hotelRoom: number;
  hotelTaxes: number;
  discount: number;
  grandTotal: number;
};

export type FlightBookingState = {
  selectedFlight: SelectedFlight | null;
  travellers: Traveller[];
  hotelSkipped: boolean;
  hotel: SelectedHotelBooking;
  reviewConsent: boolean;
  priceBreakdown: PriceBreakdown;
  cashfreeOrderId: string | null;
  paymentSessionId: string | null;
  paymentStatus: "IDLE" | "PENDING" | "SUCCESS" | "FAILED" | "USER_DROPPED" | "UNKNOWN";
  bookingReference: string | null;
};

export const BOOKING_STORAGE_KEY = "ipnia_flight_booking_v1";

export function emptyTraveller(index = 0, type: TravellerType = "adult"): Traveller {
  return {
    id: `traveller-${index + 1}-${Date.now()}`,
    type,
    title: type === "infant" ? "Other" : "Mr",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "India",
    email: "",
    phone: "",
    document: {
      passportNumber: "",
      issuingCountry: "India",
      issueDate: "",
      expiryDate: "",
      nationality: "India",
    },
  };
}

export function buildTravellersFromCounts(adults: number, children: number, infants: number): Traveller[] {
  const list: Traveller[] = [];
  let index = 0;
  for (let i = 0; i < Math.max(0, adults); i += 1) list.push(emptyTraveller(index++, "adult"));
  for (let i = 0; i < Math.max(0, children); i += 1) list.push(emptyTraveller(index++, "child"));
  for (let i = 0; i < Math.max(0, infants); i += 1) list.push(emptyTraveller(index++, "infant"));
  return list.length ? list : [emptyTraveller(0, "adult")];
}

export function computePriceBreakdown(
  flight: SelectedFlight | null,
  hotel: SelectedHotelBooking
): PriceBreakdown {
  const flightFare = flight?.fare ?? 0;
  const flightTaxes = flight?.taxes ?? 0;
  const hotelRoom = hotel?.roomPrice ?? 0;
  const hotelTaxes = hotel?.taxes ?? 0;
  const discount = 0;
  return {
    flightFare,
    flightTaxes,
    hotelRoom,
    hotelTaxes,
    discount,
    grandTotal: flightFare + flightTaxes + hotelRoom + hotelTaxes - discount,
  };
}

export function splitFare(total: number) {
  const fare = Math.round(total * 0.84);
  const taxes = Math.max(0, total - fare);
  return { fare, taxes };
}
