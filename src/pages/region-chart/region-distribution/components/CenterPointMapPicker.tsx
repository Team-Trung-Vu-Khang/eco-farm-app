import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  Input,
  Button,
  Label,
  useToast,
  Dialog,
  DialogContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, Maximize2 } from "lucide-react";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { RegionFormValues } from "../data/region-form.schema";

const customIcon = getMarkerIcon("blue");

const DEFAULT_CENTER: [number, number] = [11.54, 106.895];

const formatCoordinate = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") return "--";
  const parsed = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(parsed)) return "--";
  return parsed.toFixed(6);
};

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const MapEvents = ({ onChange }: { onChange: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });
  return null;
};

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface PickerContentProps {
  isLarge?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  handleAddressSearch: (query: string, isExplicit?: boolean) => void;
  searchResults: SearchResult[];
  onSelectResult: (item: SearchResult) => void;
  markerPosition: [number, number];
  markerRef: React.RefObject<L.Marker | null>;
  handleMarkerDrag: () => void;
  handleMapClick: (latlng: L.LatLng) => void;
  lat: number | string | undefined;
  lng: number | string | undefined;
}

const PickerContent = ({
  isLarge = false,
  searchQuery,
  setSearchQuery,
  isSearching,
  handleAddressSearch,
  searchResults,
  onSelectResult,
  markerPosition,
  markerRef,
  handleMarkerDrag,
  handleMapClick,
  lat,
  lng,
}: PickerContentProps) => {
  return (
    <div
      className={`space-y-4 ${
        isLarge ? "p-6 pt-0 flex flex-col h-full overflow-y-auto" : ""
      }`}
    >
      {/* Address Search Bar */}
      <div className="space-y-2 relative">
        <Label className="text-sm font-medium">Địa chỉ</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Nhập địa chỉ cần xác định (ví dụ: Bảo Lộc, Lâm Đồng)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddressSearch(searchQuery, true);
              }
            }}
            clearable={true}
            className="flex-1"
          />
        </div>
        <Button
          type="button"
          onClick={() => handleAddressSearch(searchQuery, true)}
          disabled={isSearching}
          variant="secondary"
          className="w-full flex items-center justify-center gap-1"
        >
          <Search className="w-4 h-4" />
          {isSearching ? "Đang xác định..." : "Xác định vị trí trên bản đồ"}
        </Button>

        {/* Search Results Dropdown List */}
        {searchResults.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto border border-slate-200 bg-white rounded-md shadow-lg z-[1000] divide-y divide-slate-100 text-xs">
            {searchResults.map((item) => (
              <button
                key={item.place_id}
                type="button"
                className="w-full px-3 py-2.5 text-left hover:bg-slate-50 text-slate-700 transition-colors flex flex-col gap-0.5"
                onClick={() => onSelectResult(item)}
              >
                <span className="font-medium text-slate-800 line-clamp-2">
                  {item.display_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Coordinates Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Vĩ độ (Latitude) <span className="text-red-500">*</span>
          </Label>
          <div className="min-h-10 rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700">
            {formatCoordinate(lat)}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Kinh độ (Longitude) <span className="text-red-500">*</span>
          </Label>
          <div className="min-h-10 rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700">
            {formatCoordinate(lng)}
          </div>
        </div>
      </div>

      {/* Leaflet Map Picker */}
      <div
        className={`space-y-2 ${isLarge ? "flex-1 flex flex-col min-h-0" : ""}`}
      >
        <Label className="text-sm font-medium">
          Chọn vị trí trực quan trên bản đồ (Click hoặc Kéo thả ghim)
        </Label>
        <div
          className={`rounded-lg border overflow-hidden relative z-0 ${
            isLarge ? "flex-1 min-h-[350px]" : "h-72"
          }`}
        >
          <MapContainer
            center={markerPosition}
            zoom={12}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={markerPosition} />
            <MapEvents onChange={handleMapClick} />
            <Marker
              position={markerPosition}
              icon={customIcon}
              draggable={true}
              ref={markerRef}
              eventHandlers={{
                dragend: handleMarkerDrag,
              }}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export const CenterPointMapPicker = () => {
  const { watch, setValue } = useFormContext<RegionFormValues>();
  const { toast } = useToast();

  const lat = watch("centerPoint.lat");
  const lng = watch("centerPoint.lng");
  const metadataAddress = watch("metadataJson.address") as string | undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const isSearchingRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const lastSelectedQueryRef = useRef("");

  useEffect(() => {
    if (metadataAddress && !searchQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery(metadataAddress);
      lastSelectedQueryRef.current = metadataAddress;
    }
  }, [metadataAddress, searchQuery]);

  const markerPosition: [number, number] = useMemo(() => {
    const parsedLat = typeof lat === "number" ? lat : parseFloat(lat || "");
    const parsedLng = typeof lng === "number" ? lng : parseFloat(lng || "");
    return !isNaN(parsedLat) && !isNaN(parsedLng)
      ? [parsedLat, parsedLng]
      : DEFAULT_CENTER;
  }, [lat, lng]);

  const markerRef = useRef<L.Marker>(null);
  const markerRefLarge = useRef<L.Marker>(null);

  const handleMarkerDrag = useCallback(() => {
    const marker = markerRef.current;
    if (marker != null) {
      const latlng = marker.getLatLng();
      setValue("centerPoint.lat", parseFloat(latlng.lat.toFixed(6)), {
        shouldValidate: true,
      });
      setValue("centerPoint.lng", parseFloat(latlng.lng.toFixed(6)), {
        shouldValidate: true,
      });
    }
  }, [setValue]);

  const handleMarkerDragLarge = useCallback(() => {
    const marker = markerRefLarge.current;
    if (marker != null) {
      const latlng = marker.getLatLng();
      setValue("centerPoint.lat", parseFloat(latlng.lat.toFixed(6)), {
        shouldValidate: true,
      });
      setValue("centerPoint.lng", parseFloat(latlng.lng.toFixed(6)), {
        shouldValidate: true,
      });
    }
  }, [setValue]);

  const handleMapClick = useCallback(
    (latlng: L.LatLng) => {
      setValue("centerPoint.lat", parseFloat(latlng.lat.toFixed(6)), {
        shouldValidate: true,
      });
      setValue("centerPoint.lng", parseFloat(latlng.lng.toFixed(6)), {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const handleAddressSearch = useCallback(
    async (query: string, isExplicit = false) => {
      if (!query.trim() || isSearchingRef.current) return;
      isSearchingRef.current = true;
      setIsSearching(true);
      try {
        const apiKey = import.meta.env.VITE_GEOCODE_API_KEY?.trim();
        const url = new URL("https://geocode.maps.co/search");
        url.searchParams.set("q", query);
        if (apiKey) {
          url.searchParams.set("api_key", apiKey);
        }
        const response = await fetch(url.toString());
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
          if (isExplicit) {
            toast({
              title: "Không tìm thấy địa điểm",
              description: "Vui lòng nhập địa chỉ cụ thể hơn",
              variant: "destructive",
            });
          }
        }
      } catch (err) {
        console.error(err);
        setSearchResults([]);
        if (isExplicit) {
          toast({
            title: "Lỗi kết nối",
            description: "Đã xảy ra lỗi khi tìm kiếm địa chỉ",
            variant: "destructive",
          });
        }
      } finally {
        isSearchingRef.current = false;
        setIsSearching(false);
      }
    },
    [toast],
  );

  const handleSelectResult = useCallback(
    (item: SearchResult) => {
      const searchLat = parseFloat(item.lat);
      const searchLng = parseFloat(item.lon);
      setValue("centerPoint.lat", parseFloat(searchLat.toFixed(6)), {
        shouldValidate: true,
      });
      setValue("centerPoint.lng", parseFloat(searchLng.toFixed(6)), {
        shouldValidate: true,
      });
      setValue("metadataJson.address", item.display_name, {
        shouldValidate: true,
      });
      lastSelectedQueryRef.current = item.display_name;
      setSearchQuery(item.display_name);
      setSearchResults([]);
      toast({
        title: "Định vị thành công",
        description: item.display_name,
      });
    },
    [setValue, toast],
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 800);

  useEffect(() => {
    const query = debouncedSearchQuery.trim();
    if (!query) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults([]);
      return;
    }
    if (query === lastSelectedQueryRef.current) {
      return;
    }
    handleAddressSearch(query, false);
  }, [debouncedSearchQuery, handleAddressSearch]);

  return (
    <div className="space-y-4 border p-4 rounded-lg bg-slate-50/50">
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <h3 className="font-semibold text-sm text-slate-800">
          Vị trí vùng trồng
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(true)}
          className="h-8 w-8 text-slate-500 hover:text-slate-900"
          title="Mở rộng bản đồ"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      <PickerContent
        isLarge={false}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        handleAddressSearch={handleAddressSearch}
        searchResults={searchResults}
        onSelectResult={handleSelectResult}
        markerPosition={markerPosition}
        markerRef={markerRef}
        handleMarkerDrag={handleMarkerDrag}
        handleMapClick={handleMapClick}
        lat={lat}
        lng={lng}
      />

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] w-[800px] h-[85vh] p-0 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Bản đồ vị trí vùng trồng
            </h2>
          </div>
          {isFullscreen && (
            <PickerContent
              isLarge={true}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearching={isSearching}
              handleAddressSearch={handleAddressSearch}
              searchResults={searchResults}
              onSelectResult={handleSelectResult}
              markerPosition={markerPosition}
              markerRef={markerRefLarge}
              handleMarkerDrag={handleMarkerDragLarge}
              handleMapClick={handleMapClick}
              lat={lat}
              lng={lng}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
