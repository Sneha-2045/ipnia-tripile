export type Airport = {
  code: string;
  city: string;
  name: string;
  country: string;
};

export const airports: Airport[] = [
  { code: "DEL", city: "New Delhi", name: "Indira Gandhi International Airport", country: "India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport", country: "India" },
  { code: "BLR", city: "Bangalore", name: "Kempegowda International Airport", country: "India" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International Airport", country: "India" },
  { code: "MAA", city: "Chennai", name: "Chennai International Airport", country: "India" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International Airport", country: "India" },
  { code: "GOI", city: "Goa", name: "Manohar International Airport", country: "India" },
  { code: "PNQ", city: "Pune", name: "Pune Airport", country: "India" },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel International Airport", country: "India" },
  { code: "COK", city: "Kochi", name: "Cochin International Airport", country: "India" },
  { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "UAE" },
  { code: "SIN", city: "Singapore", name: "Singapore Changi Airport", country: "Singapore" },
  { code: "LHR", city: "London", name: "Heathrow Airport", country: "UK" },
  { code: "LGW", city: "London", name: "Gatwick Airport", country: "UK" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International Airport", country: "USA" },
  { code: "EWR", city: "Newark", name: "Newark Liberty International Airport", country: "USA" },
  { code: "SNA", city: "Santa Ana", name: "John Wayne Airport", country: "USA" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International Airport", country: "USA" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International Airport", country: "USA" },
  { code: "ORD", city: "Chicago", name: "O'Hare International Airport", country: "USA" },
  { code: "AUH", city: "Abu Dhabi", name: "Abu Dhabi International Airport", country: "UAE" },
  { code: "DOH", city: "Doha", name: "Hamad International Airport", country: "Qatar" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle Airport", country: "France" },
  { code: "AMS", city: "Amsterdam", name: "Amsterdam Airport Schiphol", country: "Netherlands" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand" },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International Airport", country: "Hong Kong" },
  { code: "NRT", city: "Tokyo", name: "Narita International Airport", country: "Japan" },
  { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith Airport", country: "Australia" },
];

export const popularAirports = airports.filter((a) =>
  ["DEL", "BOM", "BLR", "HYD", "CCU", "DXB", "JFK", "LHR", "SIN"].includes(a.code)
);

export function searchAirports(query: string): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return popularAirports;
  return airports.filter(
    (a) =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  );
}

export function getAirportByCode(code?: string | null): Airport | undefined {
  if (!code) return undefined;
  return airports.find((a) => a.code.toUpperCase() === code.toUpperCase());
}
