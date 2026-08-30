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

interface GoogleMapsPlace {
  formatted_address?: string;
  name?: string;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface GoogleMapsAutocomplete {
  addListener: (
    eventName: string,
    callback: () => void,
  ) => { remove: () => void };
  getPlace: () => GoogleMapsPlace;
}

interface GoogleMapsAutocompleteConstructor {
  new (
    input: HTMLInputElement,
    options?: {
      componentRestrictions?: { country: string | string[] };
      fields?: string[];
      types?: string[];
    },
  ): GoogleMapsAutocomplete;
}

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: GoogleMapsAutocompleteConstructor;
        };
      };
    };
  }
}

let googleMapsScriptPromise: Promise<void> | undefined;

function loadGooglePlaces(apiKey: string) {
  if (window.google?.maps?.places?.Autocomplete) return Promise.resolve();
  if (googleMapsScriptPromise) return googleMapsScriptPromise;

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const url = new URL("https://maps.googleapis.com/maps/api/js");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("libraries", "places");
    url.searchParams.set("language", "vi");
    url.searchParams.set("region", "VN");
    script.src = url.toString();
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Không thể tải Google Places"));
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
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
  const [googlePlacesUnavailable, setGooglePlacesUnavailable] = useState(false);
  const selectedQueryRef = useRef(value);
  const userTypedQueryRef = useRef(value);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const onSelectLocationRef = useRef(onSelectLocation);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onSelectLocationRef.current = onSelectLocation;
    onChangeRef.current = onChange;
  }, [onChange, onSelectLocation]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
    if (!apiKey) return;

    let disposed = false;
    let listener: { remove?: () => void } | undefined;

    void loadGooglePlaces(apiKey)
      .then(() => {
        if (disposed) return;
        const input = inputWrapperRef.current?.querySelector("input");
        const Autocomplete = window.google?.maps?.places?.Autocomplete;
        if (!input || !Autocomplete) return;

        const autocomplete = new Autocomplete(input, {
          componentRestrictions: { country: "vn" },
          fields: ["formatted_address", "geometry", "name"],
          types: ["geocode"],
        });
        listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const latFn = place.geometry?.location?.lat;
          const lngFn = place.geometry?.location?.lng;
          const latitude = typeof latFn === "function" ? latFn() : undefined;
          const longitude = typeof lngFn === "function" ? lngFn() : undefined;
          const address = place.formatted_address || place.name;
          if (
            !address ||
            latitude === undefined ||
            longitude === undefined ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
          ) {
            return;
          }

          selectedQueryRef.current = address;
          onChangeRef.current(address);
          onSelectLocationRef.current({ address, latitude, longitude });
        });
        setGooglePlacesUnavailable(false);
      })
      .catch(() => {
        // Keep the existing geocoding search available when Google is not configured correctly.
        if (!disposed) setGooglePlacesUnavailable(true);
      });

    return () => {
      disposed = true;
      listener?.remove?.();
    };
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() &&
      !googlePlacesUnavailable
    ) {
      setResults([]);
      return;
    }
    // If the value changed from an external source (autofill/prop update), skip searching
    if (value !== userTypedQueryRef.current) {
      userTypedQueryRef.current = value;
      selectedQueryRef.current = value;
      setResults([]);
      return;
    }
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
  }, [value, googlePlacesUnavailable]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
    <div ref={inputWrapperRef} className="relative">
      <Input
        value={value}
        onChange={(event) => {
          selectedQueryRef.current = "";
          userTypedQueryRef.current = event.target.value;
          onChange(event.target.value);
        }}
        placeholder={placeholder}
      />
      {isSearching && (
        <Loader2 className="absolute right-8 top-3 h-4 w-4 animate-spin text-slate-400" />
      )}
      {results.length > 0 && (
        <div className="absolute z-[9999] mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white p-1 shadow-lg">
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
