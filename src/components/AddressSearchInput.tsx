import { Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  place_id: number | string;
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectLocation: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  latitude?: number;
  longitude?: number;
  placeholder?: string;
}

export default function AddressSearchInput({
  value,
  onChange,
  onSelectLocation,
  latitude,
  longitude,
  placeholder = "Tìm kiếm địa chỉ...",
}: AddressSearchInputProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const selectedQueryRef = useRef("");

  useEffect(() => {
    const query = value.trim();
    if (query.length < 3 || query === selectedQueryRef.current) {
      setResults([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      const apiKey = import.meta.env.VITE_GEOCODE_API_KEY?.trim();
      const controller = new AbortController();
      setIsSearching(true);
      try {
        const url = new URL("https://geocode.maps.co/search");
        url.searchParams.set("q", query);
        url.searchParams.set("format", "json");
        if (apiKey) url.searchParams.set("api_key", apiKey);
        const response = await fetch(url, { signal: controller.signal });
        const data = (await response.json()) as SearchResult[];
        setResults(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [value]);

  const selectResult = (result: SearchResult) => {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    selectedQueryRef.current = result.display_name;
    onChange(result.display_name);
    onSelectLocation({
      address: result.display_name,
      latitude,
      longitude,
    });
    setResults([]);
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(event) => {
          selectedQueryRef.current = "";
          onChange(event.target.value);
        }}
        placeholder={placeholder}
      />
      {isSearching && (
        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-slate-400" />
      )}
      {results.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white p-1 shadow-lg">
          {results.map((result) => (
            <button
              key={result.place_id}
              type="button"
              className="flex w-full items-start gap-2 rounded px-3 py-2 text-left text-sm hover:bg-slate-100"
              onPointerDown={(event) => {
                event.preventDefault();
                selectResult(result);
              }}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{result.display_name}</span>
            </button>
          ))}
        </div>
      )}
      {Number.isFinite(latitude) && Number.isFinite(longitude) && (
        <p className="mt-1 text-xs text-slate-500">
          Tọa độ: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
        </p>
      )}
    </div>
  );
}
