import type { NormalizedHotel } from "@/types/hotel";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type HotelSort =
  | "recommended"
  | "rating"
  | "reviews"
  | "name"
  | "price_level_asc"
  | "price_level_desc";

export type HotelFiltersState = {
  sort: HotelSort;
  minRating: string;
  propertyType: string;
  amenity: string;
  status: string;
  openNow: boolean;
};

export const defaultHotelFilters: HotelFiltersState = {
  sort: "recommended",
  minRating: "any",
  propertyType: "any",
  amenity: "any",
  status: "any",
  openNow: false,
};

export function applyHotelFilters(hotels: NormalizedHotel[], filters: HotelFiltersState) {
  let list = [...hotels];

  if (filters.minRating !== "any") {
    const min = Number(filters.minRating);
    list = list.filter((h) => (h.guestRating ?? 0) >= min);
  }
  if (filters.propertyType !== "any") {
    list = list.filter(
      (h) =>
        h.propertyType?.toLowerCase() === filters.propertyType.toLowerCase() ||
        h.categories.some((c) => c.toLowerCase() === filters.propertyType.toLowerCase())
    );
  }
  if (filters.amenity !== "any") {
    list = list.filter((h) =>
      h.amenities.some((a) => a.toLowerCase() === filters.amenity.toLowerCase())
    );
  }
  if (filters.status !== "any") {
    list = list.filter(
      (h) => (h.businessStatus || "").toUpperCase() === filters.status.toUpperCase()
    );
  }
  if (filters.openNow) {
    list = list.filter((h) => h.openNow === true);
  }

  list.sort((a, b) => {
    if (filters.sort === "rating") return (b.guestRating ?? 0) - (a.guestRating ?? 0);
    if (filters.sort === "reviews") return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    if (filters.sort === "name") return a.name.localeCompare(b.name);
    if (filters.sort === "price_level_asc") {
      return (a.priceLevel ?? 99) - (b.priceLevel ?? 99);
    }
    if (filters.sort === "price_level_desc") {
      return (b.priceLevel ?? -1) - (a.priceLevel ?? -1);
    }
    // recommended: rating * log reviews
    const score = (h: NormalizedHotel) =>
      (h.guestRating ?? 0) * Math.log10(Math.max(10, h.reviewCount ?? 10));
    return score(b) - score(a);
  });

  return list;
}

export function HotelFiltersPanel({
  filters,
  onChange,
  propertyTypes,
  amenities,
  statuses,
}: {
  filters: HotelFiltersState;
  onChange: (next: HotelFiltersState) => void;
  propertyTypes: string[];
  amenities: string[];
  statuses: string[];
}) {
  const set = <K extends keyof HotelFiltersState>(key: K, value: HotelFiltersState[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-[#d4a853]">Filters</p>

      <div>
        <Label className="text-slate-600">Sort by</Label>
        <Select value={filters.sort} onValueChange={(v) => set("sort", v as HotelSort)}>
          <SelectTrigger className="mt-1 border-slate-200 bg-white text-slate-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="rating">Guest rating</SelectItem>
            <SelectItem value="reviews">Most reviewed</SelectItem>
            <SelectItem value="name">Name A–Z</SelectItem>
            <SelectItem value="price_level_asc">Price level: Low to High</SelectItem>
            <SelectItem value="price_level_desc">Price level: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-slate-600">Min guest rating</Label>
        <Select value={filters.minRating} onValueChange={(v) => set("minRating", v)}>
          <SelectTrigger className="mt-1 border-slate-200 bg-white text-slate-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="3">3.0+</SelectItem>
            <SelectItem value="3.5">3.5+</SelectItem>
            <SelectItem value="4">4.0+</SelectItem>
            <SelectItem value="4.5">4.5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-slate-600">Property type</Label>
        <Select value={filters.propertyType} onValueChange={(v) => set("propertyType", v)}>
          <SelectTrigger className="mt-1 border-slate-200 bg-white text-slate-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {propertyTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {amenities.length > 0 && (
        <div>
          <Label className="text-slate-600">Amenity</Label>
          <Select value={filters.amenity} onValueChange={(v) => set("amenity", v)}>
            <SelectTrigger className="mt-1 border-slate-200 bg-white text-slate-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {amenities.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {statuses.length > 0 && (
        <div>
          <Label className="text-slate-600">Status</Label>
          <Select value={filters.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className="mt-1 border-slate-200 bg-white text-slate-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          className="accent-[#d4a853]"
          checked={filters.openNow}
          onChange={(e) => set("openNow", e.target.checked)}
        />
        Open now
      </label>

      <button
        type="button"
        className="text-sm font-semibold text-[#1d4ed8] hover:underline"
        onClick={() => onChange(defaultHotelFilters)}
      >
        Reset filters
      </button>
    </div>
  );
}
