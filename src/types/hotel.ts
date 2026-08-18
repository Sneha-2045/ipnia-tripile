export type HotelImage = {
  reference: string;
  width: number | null;
  height: number | null;
  attributions: string[];
  url: string;
  thumbUrl: string;
  index: number;
};

export type NormalizedHotel = {
  id: string;
  placeId: string;
  name: string;
  images: HotelImage[];
  image: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  starRating: number | null;
  guestRating: number | null;
  reviewCount: number | null;
  ratingLabel: string | null;
  propertyType: string | null;
  categories: string[];
  amenities: string[];
  phone: string | null;
  website: string | null;
  googleMapsUri: string | null;
  businessStatus: string | null;
  openingHours: string[] | null;
  openNow: boolean | null;
  price: number | null;
  currency: string | null;
  originalPrice: number | null;
  discount: number | null;
  pricePerNight: number | null;
  totalPrice: number | null;
  taxes: number | null;
  fees: number | null;
  priceLevel: number | null;
  priceBadge: string | null;
  rooms: unknown[];
  cancellationPolicy: string | null;
  mealPlan: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number | null;
  roomsCount: number | null;
  nights: number | null;
  source: string;
};

export type HotelSearchRequest = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
};

export type HotelSearchResponse = {
  success: boolean;
  message?: string;
  code?: string;
  count: number;
  hotels: NormalizedHotel[];
};
