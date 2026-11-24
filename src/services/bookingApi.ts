import { Airport, searchAirports } from "@/data/airports";
import { Hotel, searchHotelDestinations, searchHotels, HotelDestination } from "@/data/hotels";

export type CabinClass = "economy" | "premium" | "business" | "first";
export type TripType = "oneway" | "roundtrip";

export type HotelSearchParams = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
};

/** Airport and hotel discovery helpers. Flight offers are fetched only through the Duffel API. */
export const bookingApi = {
  searchAirports(query: string): Promise<Airport[]> {
    return Promise.resolve(searchAirports(query));
  },

  searchHotelDestinations(query: string): Promise<HotelDestination[]> {
    return Promise.resolve(searchHotelDestinations(query));
  },

  async searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
    await delay(300);
    return searchHotels(params.destination);
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
