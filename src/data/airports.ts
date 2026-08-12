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
  { code: "JFK", city: "New York", name: "John F. Kennedy International Airport", country: "USA" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand" },
];

export const popularAirports = airports.filter((a) =>
  ["DEL", "BOM", "BLR", "HYD", "CCU", "DXB"].includes(a.code)
);

export function searchAirports(query: string): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return popularAirports;
  return airports.filter(
    (a) =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
  );
}

export function getAirportByCode(code?: string | null): Airport | undefined {
  if (!code) return undefined;
  return airports.find((a) => a.code.toUpperCase() === code.toUpperCase());
}
