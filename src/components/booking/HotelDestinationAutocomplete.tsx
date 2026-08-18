import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  autocompleteHotelDestinations,
  type DestinationPrediction,
} from "@/services/hotelSearchApi";
import { hotelDestinations } from "@/data/hotels";

type Props = {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
};

const POPULAR = hotelDestinations.filter((d) => d.type === "city").slice(0, 8);

export function HotelDestinationAutocomplete({
  label = "Destination",
  value = "",
  onChange,
}: Props) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<DestinationPrediction[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    if (!open) return;

    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    const q = query.trim();
    if (q.length < 2) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = window.setTimeout(() => {
      const controller = new AbortController();
      autocompleteHotelDestinations(q, controller.signal)
        .then((list) => setPredictions(list))
        .catch(() => setPredictions([]))
        .finally(() => setLoading(false));
    }, 280);

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

  const showPopular = open && query.trim().length < 2;
  const showApi = open && query.trim().length >= 2;

  return (
    <div ref={wrapRef} className="relative">
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
        {label}
      </Label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        {loading && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#d4a853]" />
        )}
        <Input
          value={query}
          placeholder="Search cities worldwide…"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          className="h-12 border-white/15 bg-[#07111f] pl-10 pr-10 text-white placeholder:text-white/35 focus-visible:ring-[#d4a853]"
          autoComplete="off"
        />
      </div>

      {showPopular && (
        <div className="absolute z-40 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-[#d4a853]/30 bg-[#0c1a2e] shadow-2xl">
          <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#d4a853]/90">
            Popular destinations
          </p>
          {POPULAR.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#d4a853]/10"
              onClick={() => {
                setQuery(item.name);
                onChange(item.name);
                setOpen(false);
              }}
            >
              <span>
                <span className="block text-sm font-semibold text-white">{item.name}</span>
                <span className="block text-xs text-white/50">{item.country}</span>
              </span>
            </button>
          ))}
          <p className="border-t border-white/10 px-4 py-2 text-[11px] text-white/40">
            Type at least 2 letters for live Google Places cities
          </p>
        </div>
      )}

      {showApi && (
        <div className="absolute z-40 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-[#d4a853]/30 bg-[#0c1a2e] shadow-2xl">
          {loading && predictions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-white/50">Searching places…</p>
          ) : predictions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-white/50">No places found</p>
          ) : (
            predictions.map((item) => (
              <button
                key={item.id}
                type="button"
                className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#d4a853]/10"
                onClick={() => {
                  const label = item.mainText || item.description;
                  setQuery(label);
                  // Search hotels using the city/place name from Places API
                  onChange(label);
                  setOpen(false);
                }}
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
