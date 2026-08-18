import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadRecentHotelDestinations } from "@/lib/recentHotelDestinations";
import {
  autocompleteHotelDestinations,
  fetchPlaceDetails,
  type DestinationPrediction,
  type SelectedHotelDestination,
} from "@/services/hotelSearchApi";

type Props = {
  label?: string;
  /** Display text in the input */
  value?: string;
  /** Selected Google Place — source of truth for search */
  selected?: SelectedHotelDestination | null;
  onChange: (destination: SelectedHotelDestination | null) => void;
};

export function HotelDestinationAutocomplete({
  label = "Destination",
  value = "",
  selected = null,
  onChange,
}: Props) {
  const [query, setQuery] = useState(value || selected?.description || selected?.mainText || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");
  const [predictions, setPredictions] = useState<DestinationPrediction[]>([]);
  const [recent, setRecent] = useState<SelectedHotelDestination[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const labelText = selected?.description || selected?.mainText || value || "";
    setQuery(labelText);
  }, [value, selected]);

  useEffect(() => {
    if (!open) return;

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    const q = query.trim();
    // Don't search while showing an already-selected place label unchanged
    if (q.length < 2) {
      setPredictions([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    debounceRef.current = window.setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;
      autocompleteHotelDestinations(q, controller.signal)
        .then((list) => {
          setPredictions(list);
          if (!list.length) setError("");
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setPredictions([]);
          setError("Unable to load destinations. Please try again.");
        })
        .finally(() => setLoading(false));
    }, 320);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pickPrediction = async (item: DestinationPrediction) => {
    setOpen(false);
    setQuery(item.description || item.mainText);
    setResolving(true);
    setError("");
    try {
      const details = await fetchPlaceDetails(item.placeId || item.id);
      const dest: SelectedHotelDestination = {
        placeId: details.placeId || item.placeId || item.id,
        description: details.formattedAddress || item.description,
        mainText: details.name || item.mainText,
        secondaryText: [details.region, details.country].filter(Boolean).join(", ") || item.secondaryText,
        latitude: details.latitude,
        longitude: details.longitude,
        city: details.city,
        region: details.region,
        country: details.country,
      };
      onChange(dest);
      setQuery(dest.description || dest.mainText);
    } catch {
      // Still use prediction identity even if details fail
      onChange({
        placeId: item.placeId || item.id,
        description: item.description,
        mainText: item.mainText,
        secondaryText: item.secondaryText,
        latitude: null,
        longitude: null,
        city: item.mainText,
        region: null,
        country: item.secondaryText || null,
      });
    } finally {
      setResolving(false);
    }
  };

  const showPlacesDropdown = open && query.trim().length >= 2;
  const showRecentDropdown = open && query.trim().length < 2;

  return (
    <div ref={wrapRef} className="relative">
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
        {label}
      </Label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        {(loading || resolving) && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#d4a853]" />
        )}
        <Input
          value={query}
          placeholder="Search cities worldwide…"
          onFocus={() => {
            setRecent(loadRecentHotelDestinations());
            setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            // Clear selected place until user picks from Places suggestions
            onChange(null);
            setOpen(true);
          }}
          className="h-12 border-white/15 bg-[#07111f] pl-10 pr-10 text-white placeholder:text-white/35 focus-visible:ring-[#d4a853]"
          autoComplete="off"
        />
      </div>

      {showRecentDropdown && (
        <div className="absolute z-40 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-[#d4a853]/30 bg-[#0c1a2e] shadow-2xl">
          {recent.length > 0 ? (
            <>
              <p className="px-4 pt-3 text-[10px] font-bold uppercase tracking-wider text-[#d4a853]/80">
                Recent destinations
              </p>
              {recent.map((item) => (
                <button
                  key={item.placeId}
                  type="button"
                  className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#d4a853]/10"
                  onClick={() => {
                    setOpen(false);
                    setQuery(item.description || item.mainText);
                    onChange(item);
                  }}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d4a853]" />
                  <span>
                    <span className="block text-sm font-semibold text-white">
                      {item.mainText || item.description}
                    </span>
                    {(item.secondaryText || item.country) && (
                      <span className="block text-xs text-white/50">
                        {item.secondaryText || [item.region, item.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-3">
              <p className="text-sm text-white/60">Search destinations worldwide</p>
              <p className="mt-1 text-xs text-white/40">
                Type at least 2 letters for Google Places suggestions (cities, regions, countries).
              </p>
            </div>
          )}
        </div>
      )}

      {showPlacesDropdown && (
        <div className="absolute z-40 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-[#d4a853]/30 bg-[#0c1a2e] shadow-2xl">
          {loading && predictions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-white/50">Searching destinations...</p>
          ) : error ? (
            <p className="px-4 py-3 text-sm text-red-300">{error}</p>
          ) : predictions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-white/50">No destinations found</p>
          ) : (
            predictions.map((item) => (
              <button
                key={item.placeId || item.id}
                type="button"
                className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#d4a853]/10"
                onClick={() => pickPrediction(item)}
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d4a853]" />
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {item.mainText || item.description}
                  </span>
                  {item.secondaryText && (
                    <span className="block text-xs text-white/50">{item.secondaryText}</span>
                  )}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
