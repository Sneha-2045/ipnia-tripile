import { Airport, getAirportByCode, searchAirports } from "@/data/airports";
import { Hotel, searchHotelDestinations, searchHotels, HotelDestination } from "@/data/hotels";

export type CabinClass = "economy" | "premium" | "business" | "first";
export type TripType = "oneway" | "roundtrip";

export type FlightSearchParams = {
  from: string;
  to: string;
  departure: string;
  returnDate?: string;
  travellers: number;
  cabin: CabinClass;
  tripType: TripType;
};

export type HotelSearchParams = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
};

export type FlightResult = {
  id: string;
  airline: string;
  flightNumber: string;
  from: Airport;
  to: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  cabin: CabinClass;
};

/** Separated API layer — swap mock implementation for real providers later */
export const bookingApi = {
  searchAirports(query: string): Promise<Airport[]> {
    return Promise.resolve(searchAirports(query));
  },

  searchHotelDestinations(query: string): Promise<HotelDestination[]> {
    return Promise.resolve(searchHotelDestinations(query));
  },

  async searchFlights(params: FlightSearchParams): Promise<FlightResult[]> {
    await delay(350);
    const from = getAirportByCode(params.from);
    const to = getAirportByCode(params.to);
    if (!from || !to) return [];

    const airlines = [
      { name: "IndiGo", code: "6E" },
      { name: "Air India", code: "AI" },
      { name: "Vistara", code: "UK" },
      { name: "Akasa Air", code: "QP" },
    ];

    const base = 4500 + Math.abs(from.code.charCodeAt(0) - to.code.charCodeAt(0)) * 120;
    return airlines.map((airline, i) => {
      const depHour = 6 + i * 3;
      const durationHrs = 1.5 + (i % 3) * 0.75;
      const arrHour = depHour + Math.floor(durationHrs);
      const priceMultiplier =
        params.cabin === "business" ? 2.8 : params.cabin === "premium" ? 1.6 : params.cabin === "first" ? 4 : 1;

      return {
        id: `${airline.code}-${from.code}${to.code}-${i}`,
        airline: airline.name,
        flightNumber: `${airline.code} ${200 + i * 11}`,
        from,
        to,
        departureTime: `${String(depHour).padStart(2, "0")}:${i % 2 === 0 ? "05" : "40"}`,
        arrivalTime: `${String(arrHour).padStart(2, "0")}:${i % 2 === 0 ? "20" : "55"}`,
        duration: `${Math.floor(durationHrs)}h ${durationHrs % 1 === 0 ? "00" : "45"}m`,
        stops: i === 2 ? 1 : 0,
        price: Math.round((base + i * 850) * priceMultiplier * params.travellers),
        cabin: params.cabin,
      };
    });
  },

  async searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
    await delay(300);
    return searchHotels(params.destination);
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
