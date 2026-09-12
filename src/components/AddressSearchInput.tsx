import { Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { searchAddress } from "@/shared/lib/googleGeocode";

interface GeocodeResult {
  kind: "geocode";
  id: string;
  label: string;
  lat: number;
  lng: number;
}

interface GooglePredictionResult {
  kind: "google";
  id: string;
  label: string;
  prediction: google.maps.places.PlacePrediction;
}

type SearchResult = GeocodeResult | GooglePredictionResult;

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

let googleMapsScriptPromise: Promise<void> | undefined;

function isGoogleMapsScriptLoaded(): boolean {
  return Boolean(
    (window as unknown as { google?: { maps?: { importLibrary?: unknown } } })
      .google?.maps?.importLibrary,
  );
}

function loadGoogleMapsBootstrap(apiKey: string) {
  if (isGoogleMapsScriptLoaded()) return Promise.resolve();
  if (googleMapsScriptPromise) return googleMapsScriptPromise;

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const url = new URL("https://maps.googleapis.com/maps/api/js");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("loading", "async");
    url.searchParams.set("language", "vi");
    url.searchParams.set("region", "VN");
    script.src = url.toString();
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Không thể tải Google Maps"));
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
  const placesLibraryRef = useRef<google.maps.PlacesLibrary | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(
    null,
  );

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
    if (!apiKey) {
      setGooglePlacesUnavailable(true);
      return;
    }

    let disposed = false;
    void loadGoogleMapsBootstrap(apiKey)
      .then(
        () =>
          window.google.maps.importLibrary(
            "places",
          ) as Promise<google.maps.PlacesLibrary>,
      )
      .then((library) => {
        if (disposed) return;
        placesLibraryRef.current = library;
        sessionTokenRef.current = new library.AutocompleteSessionToken();
        setGooglePlacesUnavailable(false);
      })
      .catch(() => {
        if (!disposed) setGooglePlacesUnavailable(true);
      });

    return () => {
      disposed = true;
    };
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
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
      setIsSearching(true);
      try {
        const library = placesLibraryRef.current;
        if (library && !googlePlacesUnavailable) {
          const { suggestions } =
            await library.AutocompleteSuggestion.fetchAutocompleteSuggestions({
              input: query,
              sessionToken: sessionTokenRef.current ?? undefined,
              includedRegionCodes: ["vn"],
            });
          setResults(
            suggestions
              .map((suggestion) => suggestion.placePrediction)
              .filter((prediction): prediction is google.maps.places.PlacePrediction =>
                prediction !== null,
              )
              .slice(0, 5)
              .map((prediction, index) => ({
                kind: "google" as const,
                id: `google-${index}-${prediction.text.text}`,
                label: prediction.text.text,
                prediction,
              })),
          );
          return;
        }

        const data = await searchAddress(query);
        setResults(
          data.slice(0, 5).map((item) => ({
            kind: "geocode" as const,
            id: String(item.place_id),
            label: item.display_name,
            lat: Number(item.lat),
            lng: Number(item.lon),
          })),
        );
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [value, googlePlacesUnavailable]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const selectResult = async (result: SearchResult) => {
    if (result.kind === "geocode") {
      if (!Number.isFinite(result.lat) || !Number.isFinite(result.lng)) return;
      selectedQueryRef.current = result.label;
      onChange(result.label);
      onSelectLocation({
        address: result.label,
        latitude: result.lat,
        longitude: result.lng,
      });
      setResults([]);
      return;
    }

    const place = result.prediction.toPlace();
    await place.fetchFields({ fields: ["formattedAddress", "location", "displayName"] });
    const location = place.location;
    const address = place.formattedAddress || place.displayName || result.label;
    if (!location) return;
    const latitude = location.lat();
    const longitude = location.lng();
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    selectedQueryRef.current = address;
    onChange(address);
    onSelectLocation({ address, latitude, longitude });
    setResults([]);

    const library = placesLibraryRef.current;
    if (library) sessionTokenRef.current = new library.AutocompleteSessionToken();
  };

  return (
    <div className="relative">
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
              key={result.id}
              type="button"
              className="flex w-full items-start gap-2 rounded px-3 py-2 text-left text-sm hover:bg-slate-100"
              onPointerDown={(event) => {
                event.preventDefault();
                void selectResult(result);
              }}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{result.label}</span>
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
