import { Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const GOONG_API_URL = "https://rsapi.goong.io";

interface SearchResult {
  place_id: string;
  description: string;
}

/** Response của Goong Place AutoComplete API */
interface GoongAutoCompleteResponse {
  predictions?: SearchResult[];
}

/** Response của Goong Place Detail API */
interface GoongPlaceDetailResponse {
  result?: {
    formatted_address?: string;
    geometry?: { location?: { lat: number; lng: number } };
  };
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

const buildGoongUrl = (path: string, params: Record<string, string>) => {
  const url = new URL(`${GOONG_API_URL}${path}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );
  const apiKey = import.meta.env.VITE_GOONG_API_KEY?.trim();
  if (apiKey) url.searchParams.set("api_key", apiKey);
  return url;
};

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
  const selectedQueryRef = useRef(value);
  const userTypedQueryRef = useRef(value);

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

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const url = buildGoongUrl("/Place/AutoComplete", { input: query });
        const response = await fetch(url, { signal: controller.signal });
        const data = (await response.json()) as GoongAutoCompleteResponse;
        setResults((data.predictions ?? []).slice(0, 5));
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 600);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  // AutoComplete không trả tọa độ → lấy từ Place Detail khi chọn
  const selectResult = async (result: SearchResult) => {
    setResults([]);
    selectedQueryRef.current = result.description;
    onChange(result.description);
    setIsSearching(true);
    try {
      const url = buildGoongUrl("/Place/Detail", { place_id: result.place_id });
      const response = await fetch(url);
      const data = (await response.json()) as GoongPlaceDetailResponse;
      const location = data.result?.geometry?.location;
      if (
        !location ||
        !Number.isFinite(location.lat) ||
        !Number.isFinite(location.lng)
      ) {
        return;
      }
      onSelectLocation({
        address: result.description,
        latitude: location.lat,
        longitude: location.lng,
      });
    } catch {
      // Giữ địa chỉ đã chọn, không cập nhật tọa độ khi lỗi mạng
    } finally {
      setIsSearching(false);
    }
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
              key={result.place_id}
              type="button"
              className="flex w-full items-start gap-2 rounded px-3 py-2 text-left text-sm hover:bg-slate-100"
              onPointerDown={(event) => {
                event.preventDefault();
                void selectResult(result);
              }}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{result.description}</span>
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
