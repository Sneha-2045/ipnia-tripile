/**
 * Normalize Google Places lodging results into IPNIA hotel cards.
 * Never invent prices, amenities, or ratings — only map real fields.
 */

function ratingLabel(rating) {
  if (rating == null || !Number.isFinite(Number(rating))) return null;
  const r = Number(rating);
  if (r >= 4.5) return "Excellent";
  if (r >= 4.0) return "Very Good";
  if (r >= 3.5) return "Good";
  if (r >= 3.0) return "Average";
  return null;
}

function uniqueStrings(list) {
  return Array.from(new Set((list || []).filter((x) => typeof x === "string" && x.trim())));
}

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const a = new Date(`${checkIn}T00:00:00Z`);
  const b = new Date(`${checkOut}T00:00:00Z`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b <= a) return null;
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function mapPlaceToHotel(place, ctx = {}) {
  if (!place || !place.place_id) return null;

  const apiBase = String(ctx.apiBaseUrl || "")
    .trim()
    .replace(/\/$/, "");

  const photos = Array.isArray(place.photos)
    ? place.photos
        .map((p, index) => {
          if (!p?.photo_reference) return null;
          const qs = `ref=${encodeURIComponent(p.photo_reference)}`;
          const path1200 = `/api/hotels/photo?${qs}&w=1200`;
          const path400 = `/api/hotels/photo?${qs}&w=400`;
          return {
            reference: p.photo_reference,
            width: p.width || null,
            height: p.height || null,
            attributions: Array.isArray(p.html_attributions) ? p.html_attributions : [],
            // Absolute URLs so the browser always hits the IPNIA API (never localhost / relative Vite)
            url: apiBase ? `${apiBase}${path1200}` : path1200,
            thumbUrl: apiBase ? `${apiBase}${path400}` : path400,
            index,
          };
        })
        .filter(Boolean)
    : [];

  const guestRating = place.rating != null ? Number(place.rating) : null;
  const reviewCount = place.user_ratings_total != null ? Number(place.user_ratings_total) : null;
  const types = uniqueStrings(place.types);
  const primaryType =
    types.find((t) =>
      ["lodging", "hotel", "resort_hotel", "motel", "guest_house", "hostel", "apartment_hotel"].includes(t)
    ) ||
    types[0] ||
    null;

  const amenities = [];
  if (place.wheelchair_accessible_entrance) amenities.push("Wheelchair accessible");
  if (place.delivery) amenities.push("Delivery");
  if (place.dine_in) amenities.push("Dine-in");
  if (place.takeout) amenities.push("Takeout");
  if (place.reservable) amenities.push("Reservable");
  if (Array.isArray(place.types)) {
    if (place.types.includes("spa")) amenities.push("Spa");
    if (place.types.includes("gym")) amenities.push("Gym");
    if (place.types.includes("parking")) amenities.push("Parking");
    if (place.types.includes("restaurant")) amenities.push("Restaurant");
    if (place.types.includes("bar")) amenities.push("Bar");
  }

  const nights = nightsBetween(ctx.checkIn, ctx.checkOut);

  // Places does not return bookable room rates — never fabricate prices
  const priceLevel = place.price_level != null ? Number(place.price_level) : null;

  return {
    id: place.place_id,
    placeId: place.place_id,
    name: place.name || "Hotel",
    images: photos,
    image: photos[0]?.url || null,
    address: place.formatted_address || place.vicinity || null,
    city: ctx.destinationLabel || null,
    state: null,
    country: null,
    postalCode: null,
    latitude: place.geometry?.location?.lat ?? null,
    longitude: place.geometry?.location?.lng ?? null,
    description: place.editorial_summary?.overview || null,
    starRating: null, // Google Places does not provide official hotel star class
    guestRating: Number.isFinite(guestRating) ? guestRating : null,
    reviewCount: Number.isFinite(reviewCount) ? reviewCount : null,
    ratingLabel: ratingLabel(guestRating),
    propertyType: primaryType ? primaryType.replace(/_/g, " ") : null,
    categories: types.map((t) => t.replace(/_/g, " ")),
    amenities: uniqueStrings(amenities),
    phone: place.formatted_phone_number || place.international_phone_number || null,
    website: place.website || null,
    googleMapsUri: place.url || null,
    businessStatus: place.business_status || null,
    openingHours: place.opening_hours?.weekday_text || null,
    openNow: typeof place.opening_hours?.open_now === "boolean" ? place.opening_hours.open_now : null,
    // Pricing: only real API fields (price_level is relative, not a fare)
    price: null,
    currency: null,
    originalPrice: null,
    discount: null,
    pricePerNight: null,
    totalPrice: null,
    taxes: null,
    fees: null,
    priceLevel,
    priceBadge: null,
    rooms: [],
    cancellationPolicy: null,
    mealPlan: null,
    checkIn: ctx.checkIn || null,
    checkOut: ctx.checkOut || null,
    guests: ctx.guests ?? null,
    roomsCount: ctx.rooms ?? null,
    nights,
    source: "google_places",
  };
}

module.exports = {
  mapPlaceToHotel,
  nightsBetween,
};
