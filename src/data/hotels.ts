export type HotelDestination = {
  id: string;
  name: string;
  type: "city" | "area" | "hotel";
  country: string;
  image?: string;
  blurb?: string;
};

export type Hotel = {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  image: string;
  tag: string;
  amenities: string[];
  description: string;
};

export const hotelDestinations: HotelDestination[] = [
  {
    id: "new-delhi",
    name: "New Delhi",
    type: "city",
    country: "India",
    image: "/assets/destinations/dest-delhi.jpg",
    blurb: "Capital stays near history & business hubs",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    type: "city",
    country: "India",
    image: "/assets/destinations/dest-mumbai.jpg",
    blurb: "Sea-facing luxury and city energy",
  },
  {
    id: "dubai",
    name: "Dubai",
    type: "city",
    country: "UAE",
    image: "/assets/destinations/dest-dubai.jpg",
    blurb: "Iconic skyline hotels & marina escapes",
  },
  {
    id: "london",
    name: "London",
    type: "city",
    country: "UK",
    image: "/assets/destinations/dest-london.jpg",
    blurb: "Classic European elegance",
  },
  {
    id: "singapore",
    name: "Singapore",
    type: "city",
    country: "Singapore",
    image: "/assets/destinations/dest-singapore.jpg",
    blurb: "Bayfront views & polished hospitality",
  },
  {
    id: "new-york",
    name: "New York",
    type: "city",
    country: "USA",
    image: "/assets/destinations/dest-newyork.jpg",
    blurb: "Skyline energy in the city that never sleeps",
  },
  {
    id: "goa",
    name: "Goa",
    type: "city",
    country: "India",
    image: "/assets/destinations/hotel-beach.jpg",
    blurb: "Beach resorts & coastal calm",
  },
  {
    id: "bangalore",
    name: "Bangalore",
    type: "city",
    country: "India",
    image: "/assets/destinations/hotel-boutique.jpg",
    blurb: "Garden-city business stays",
  },
  { id: "colaba", name: "Colaba, Mumbai", type: "area", country: "India" },
  { id: "connaught", name: "Connaught Place, New Delhi", type: "area", country: "India" },
];

export const hotels: Hotel[] = [
  {
    id: "taj-mumbai",
    name: "The Taj Mahal Palace",
    location: "Colaba, Mumbai",
    city: "mumbai",
    rating: 4.8,
    reviews: 2140,
    priceFrom: 18500,
    image: "/assets/destinations/hotel-heritage.jpg",
    tag: "Heritage Luxury",
    amenities: ["Sea view", "Spa", "Fine dining", "Butler service"],
    description: "An iconic waterfront palace stay with timeless hospitality in the heart of Mumbai.",
  },
  {
    id: "oberoi-delhi",
    name: "The Oberoi New Delhi",
    location: "Dr. Zakir Hussain Marg, New Delhi",
    city: "new-delhi",
    rating: 4.7,
    reviews: 1680,
    priceFrom: 16200,
    image: "/assets/destinations/hotel-luxury-1.jpg",
    tag: "City Luxury",
    amenities: ["Pool", "Business centre", "Airport transfer", "Club lounge"],
    description: "Refined luxury overlooking Delhi’s green corridors — ideal for business and leisure.",
  },
  {
    id: "marina-dubai",
    name: "Marina Horizon Dubai",
    location: "Dubai Marina, Dubai",
    city: "dubai",
    rating: 4.6,
    reviews: 980,
    priceFrom: 12800,
    image: "/assets/destinations/hotel-boutique.jpg",
    tag: "Skyline Stay",
    amenities: ["Infinity pool", "Gym", "Marina view", "Breakfast"],
    description: "Modern marina living with skyline views and easy access to Dubai’s attractions.",
  },
  {
    id: "singapore-bay",
    name: "Bayfront Grand Singapore",
    location: "Marina Bay, Singapore",
    city: "singapore",
    rating: 4.5,
    reviews: 1420,
    priceFrom: 14200,
    image: "/assets/destinations/dest-singapore.jpg",
    tag: "Bayfront",
    amenities: ["Harbour view", "Rooftop bar", "Concierge", "Spa"],
    description: "Polished bayfront hospitality steps from Singapore’s most photographed waterfront.",
  },
  {
    id: "london-park",
    name: "Park Lane Residences",
    location: "Mayfair, London",
    city: "london",
    rating: 4.4,
    reviews: 890,
    priceFrom: 17600,
    image: "/assets/destinations/dest-london.jpg",
    tag: "Boutique",
    amenities: ["Afternoon tea", "City tours desk", "Fitness", "Wi‑Fi"],
    description: "Elegant Mayfair address for travelers who want London within walking distance.",
  },
  {
    id: "goa-coast",
    name: "Coastal Haven Goa",
    location: "Candolim, Goa",
    city: "goa",
    rating: 4.5,
    reviews: 1260,
    priceFrom: 7200,
    image: "/assets/destinations/hotel-beach.jpg",
    tag: "Beach Resort",
    amenities: ["Private beach", "Pool", "Water sports", "Yoga"],
    description: "Sun, sand and slow mornings — a coastal escape curated for restful holidays.",
  },
  {
    id: "delhi-cp",
    name: "Connaught Crown",
    location: "Connaught Place, New Delhi",
    city: "new-delhi",
    rating: 4.3,
    reviews: 740,
    priceFrom: 8900,
    image: "/assets/destinations/dest-delhi.jpg",
    tag: "Business",
    amenities: ["Meeting rooms", "Restaurant", "Parking", "Wi‑Fi"],
    description: "Central Delhi convenience for shoppers, sightseers and corporate travelers.",
  },
  {
    id: "nyc-midtown",
    name: "Midtown Lights New York",
    location: "Midtown Manhattan, New York",
    city: "new-york",
    rating: 4.4,
    reviews: 1100,
    priceFrom: 19800,
    image: "/assets/destinations/dest-newyork.jpg",
    tag: "City Icon",
    amenities: ["Skyline view", "Gym", "24/7 desk", "Breakfast"],
    description: "Stay in the pulse of Manhattan with skyline energy and walkable attractions.",
  },
];

export const stayCategories = [
  {
    id: "luxury",
    title: "Luxury",
    text: "Five-star comfort, spa rituals and polished service.",
    image: "/assets/destinations/hotel-luxury-1.jpg",
  },
  {
    id: "beach",
    title: "Beach & Resort",
    text: "Ocean views, infinity pools and slow travel days.",
    image: "/assets/destinations/hotel-beach.jpg",
  },
  {
    id: "heritage",
    title: "Heritage",
    text: "Palace architecture and timeless Indian hospitality.",
    image: "/assets/destinations/hotel-heritage.jpg",
  },
  {
    id: "business",
    title: "Business",
    text: "Central locations with meeting-ready amenities.",
    image: "/assets/destinations/hotel-boutique.jpg",
  },
];

export function searchHotelDestinations(query: string): HotelDestination[] {
  const q = query.trim().toLowerCase();
  if (!q) return hotelDestinations.filter((d) => d.type === "city").slice(0, 6);
  return hotelDestinations.filter(
    (d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
  );
}

export function searchHotels(destination?: string | null): Hotel[] {
  if (!destination) return hotels;
  const q = destination.toLowerCase().replace(/\s+/g, "-");
  const matched = hotels.filter(
    (h) =>
      h.city.includes(q) ||
      h.city.replace(/-/g, " ").includes(destination.toLowerCase()) ||
      h.location.toLowerCase().includes(destination.toLowerCase()) ||
      h.name.toLowerCase().includes(destination.toLowerCase()) ||
      h.tag.toLowerCase().includes(destination.toLowerCase())
  );
  return matched.length > 0 ? matched : hotels;
}
