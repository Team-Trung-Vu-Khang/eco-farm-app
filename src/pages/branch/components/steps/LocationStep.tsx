import { useGeoProvinces, useGeoWards } from "@/features/master-data";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

import defaultMarkerIconUrl from "leaflet/dist/images/marker-icon.png";
import defaultMarkerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import defaultMarkerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import type { BranchFormData } from "../../types/types";

interface AddressSuggestion {
  id?: string;
  lat: number;
  lon: number;
  display_name: string;
  name?: string;
  addressText?: string;
  types?: string[];
  address?: {
    road?: string;
    street?: string;
    house_number?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    city_district?: string;
    county?: string;
    town?: string;
    city?: string;
    province?: string;
    state?: string;
    ward?: string;
    district?: string;
  };
}

interface LatLngLike {
  location?: unknown;
  latLng?: unknown;
  geometry?: {
    location?: unknown;
  };
  lat?: unknown;
  latitude?: unknown;
  lng?: unknown;
  lon?: unknown;
  longitude?: unknown;
  long?: unknown;
}

interface Map4DAutosuggestResponse {
  code: string;
  message?: string;
  result: Array<{
    id?: string | null;
    name: string;
    address: string;
    location: { lng: number; lat: number };
    types: string[];
  }> | null;
}

interface LocationStepProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
}

const defaultLeafletIcon = L.icon({
  iconUrl: defaultMarkerIconUrl,
  iconRetinaUrl: defaultMarkerIcon2xUrl,
  shadowUrl: defaultMarkerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultLeafletIcon;

const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009];

const MapCenterSync = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
};

const MapClickHandler = ({
  onPickLocation,
}: {
  onPickLocation: (lat: number, lon: number) => void;
}) => {
  useMapEvents({
    click(event) {
      onPickLocation(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

const DraggableLocationMarker = ({
  position,
  onPickLocation,
}: {
  position: [number, number];
  onPickLocation: (lat: number, lon: number) => void;
}) => {
  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (event) => {
          const marker = event.target as L.Marker;
          const next = marker.getLatLng();
          onPickLocation(next.lat, next.lng);
        },
      }}
    />
  );
};

export function LocationStep({ formData, updateFormData }: LocationStepProps) {
  const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
  const { toast } = useToast();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchAddress, setSearchAddress] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const skipNextSearchRef = useRef(false);

  const safeLatitude = Number.isFinite(formData.latitude)
    ? formData.latitude
    : DEFAULT_CENTER[0];
  const safeLongitude = Number.isFinite(formData.longitude)
    ? formData.longitude
    : DEFAULT_CENTER[1];
  const center: [number, number] = [safeLatitude, safeLongitude];

  const provincesQuery = useGeoProvinces({
    params: {
      page: 0,
      size: 100,
      status: "active",
    },
  });

  const selectedProvince = useMemo(
    () =>
      provincesQuery.items.find(
        (province) =>
          province.code === formData.city ||
          province.name === formData.city ||
          province.fullName === formData.city,
      ),
    [formData.city, provincesQuery.items],
  );

  const wardsQuery = useGeoWards({
    params: {
      provinceCode: selectedProvince?.code || "",
      page: 0,
      size: 100,
      status: "active",
    },
    enabled: Boolean(selectedProvince?.code),
  });

  const wardOptions = useMemo(() => {
    return wardsQuery.items.map((ward) => ({
      code: ward.code,
      name: ward.fullName || ward.name,
    }));
  }, [wardsQuery.items]);

  const selectedWard = useMemo(
    () =>
      wardOptions.find(
        (ward) =>
          ward.code === formData.ward ||
          ward.name === formData.ward ||
          ward.code === formData.district ||
          ward.name === formData.district,
      ),
    [formData.district, formData.ward, wardOptions],
  );

  const toLatLngLike = (value: unknown): LatLngLike | undefined => {
    if (!value || typeof value !== "object") {
      return undefined;
    }

    return value as LatLngLike;
  };

  const extractLatLng = useCallback((source: unknown): { lat: number; lon: number } | null => {
    const candidates: Array<LatLngLike | undefined> = [
      toLatLngLike(toLatLngLike(source)?.location),
      toLatLngLike(toLatLngLike(source)?.latLng),
      toLatLngLike(toLatLngLike(source)?.geometry?.location),
      toLatLngLike(source),
    ];

    for (const candidate of candidates) {
      const latRaw = candidate?.lat ?? candidate?.latitude;
      const lonRaw =
        candidate?.lng ??
        candidate?.lon ??
        candidate?.longitude ??
        candidate?.long;
      const lat = Number(latRaw);
      const lon = Number(lonRaw);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        return { lat, lon };
      }
    }

    return null;
  }, []);

  const normalizeMap4dSuggestion = useCallback(
    (
      item: NonNullable<Map4DAutosuggestResponse["result"]>[number],
    ): AddressSuggestion | null => {
      const point = extractLatLng(item.location);
      if (!point) return null;

      const name = item.name || "";
      const addressText = item.address || "";
      const displayName =
        [name, addressText].filter(Boolean).join(" - ") || name || addressText;

      return {
        id: item.id || undefined,
        lat: point.lat,
        lon: point.lon,
        display_name: displayName,
        name,
        addressText,
        types: Array.isArray(item.types) ? item.types : [],
        address: {
          road: item.address,
        },
      };
    },
    [extractLatLng],
  );

  const handlePickLocation = useCallback(
    (lat: number, lon: number) => {
      updateFormData({
        latitude: lat,
        longitude: lon,
      });
    },
    [updateFormData],
  );

  const handleSearchAddress = useCallback(
    async (query: string) => {
      if (!query || query.length < 3) {
        setAddressSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      if (!MAP4D_ACCESS_KEY) {
        setAddressSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const params = new URLSearchParams({
          key: MAP4D_ACCESS_KEY,
          text: query,
        });
        const response = await fetch(
          `https://api.map4d.vn/sdk/autosuggest?${params.toString()}`,
        );
        if (!response.ok) {
          setAddressSuggestions([]);
          setShowSuggestions(false);
          return;
        }
        const data: Map4DAutosuggestResponse = await response.json();
        if (data?.code !== "ok") {
          setAddressSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        const list = Array.isArray(data.result) ? data.result : [];
        const suggestions: AddressSuggestion[] = list
          .map(normalizeMap4dSuggestion)
          .filter((item): item is AddressSuggestion => item !== null);

        setAddressSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } catch (e) {
        console.error(e);
        setAddressSuggestions([]);
        setShowSuggestions(false);
        toast({
          title: "Lỗi tìm kiếm",
          description: "Không thể tìm địa chỉ lúc này.",
          variant: "destructive",
        });
      }
    },
    [MAP4D_ACCESS_KEY, normalizeMap4dSuggestion, toast],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsInputFocused(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (skipNextSearchRef.current) {
        skipNextSearchRef.current = false;
        return;
      }
      if (searchAddress && isInputFocused) handleSearchAddress(searchAddress);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchAddress, isInputFocused, handleSearchAddress]);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    const current = [formData.address, formData.ward, formData.district, formData.city]
      .filter(Boolean)
      .join(", ");
    setSearchAddress(current);
  }, [formData.address, formData.city, formData.district, formData.ward]);

  useEffect(() => {
    if (navigator.geolocation && !Number.isFinite(formData.latitude)) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateFormData({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          // Ignore geolocation errors and keep the default map position.
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  }, [formData.latitude, updateFormData]);

  const handleSelectAddress = (suggestion: AddressSuggestion) => {
    const address = suggestion.address || {};
    const road = address.road || address.street || "";
    const houseNumber = address.house_number || "";
    const streetAddress = houseNumber ? `${houseNumber} ${road}` : road;

    const selectedAddress =
      suggestion.addressText ||
      suggestion.name ||
      suggestion.display_name ||
      streetAddress;

    updateFormData({
      latitude: suggestion.lat,
      longitude: suggestion.lon,
      address: streetAddress || selectedAddress,
      ward:
        address.ward ||
        address.suburb ||
        address.neighbourhood ||
        address.quarter ||
        "",
      district:
        address.district ||
        address.city_district ||
        address.county ||
        address.town ||
        "",
      city: address.city || address.province || address.state || "",
    });

    skipNextSearchRef.current = true;
    setSearchAddress(selectedAddress);
    setShowSuggestions(false);
    setIsInputFocused(false);
    toast({
      title: "Thành công",
      description: "Đã tìm thấy địa chỉ trên bản đồ",
    });
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handlePickLocation(pos.coords.latitude, pos.coords.longitude);
          toast({ title: "Thành công", description: "Đã lấy vị trí hiện tại" });
        },
        () =>
          toast({
            title: "Lỗi",
            description: "Không thể lấy vị trí hiện tại",
            variant: "destructive",
          }),
      );
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-4">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Tìm kiếm địa chỉ trên bản đồ</h3>
        </div>

        <div className="relative" ref={searchContainerRef}>
          <Input
            value={searchAddress}
            onChange={(event) => {
              setSearchAddress(event.target.value);
              if (!event.target.value) setShowSuggestions(false);
            }}
            placeholder="Nhập địa chỉ để tìm kiếm..."
            onFocus={() => {
              setIsInputFocused(true);
              if (addressSuggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => {
              window.setTimeout(() => {
                const container = searchContainerRef.current;
                const activeEl = document.activeElement;
                if (!container || !activeEl || !container.contains(activeEl)) {
                  setIsInputFocused(false);
                  setShowSuggestions(false);
                }
              }, 0);
            }}
          />

          {showSuggestions && addressSuggestions.length > 0 && (
            <div className="absolute z-[99999] mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
              {addressSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="cursor-pointer border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-100"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelectAddress(suggestion)}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {suggestion.display_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-96 w-full overflow-hidden rounded-lg border">
          <MapContainer
            center={center}
            zoom={15}
            className="h-full w-full"
            zoomControl
            scrollWheelZoom
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapCenterSync center={center} />
            <MapClickHandler onPickLocation={handlePickLocation} />
            <DraggableLocationMarker
              position={center}
              onPickLocation={handlePickLocation}
            />
          </MapContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Vĩ độ</Label>
            <Input value={formData.latitude.toFixed(6)} disabled />
          </div>
          <div className="space-y-2">
            <Label>Kinh độ</Label>
            <Input value={formData.longitude.toFixed(6)} disabled />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleGetCurrentLocation}
          className="w-full"
          type="button"
        >
          <MapPin className="mr-2 h-4 w-4" /> Lấy vị trí hiện tại
        </Button>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-4 font-semibold">Địa chỉ chi tiết</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(event) => updateFormData({ address: event.target.value })}
              placeholder="Số nhà, tên đường"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Tỉnh / Thành phố</Label>
              <Select
                value={selectedProvince?.code || ""}
                onValueChange={(value) => {
                  const province = provincesQuery.items.find(
                    (item) => item.code === value,
                  );
                  updateFormData({
                    city: province?.fullName || province?.name || value,
                    ward: "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Tỉnh / Thành phố" />
                </SelectTrigger>
                <SelectContent className="max-h-80 overflow-y-auto">
                  {provincesQuery.items.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.fullName || province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ward">Phường / Xã</Label>
              <Select
                value={selectedWard?.code || ""}
                onValueChange={(value) => {
                  const ward = wardOptions.find((item) => item.code === value);
                  updateFormData({
                    ward: ward?.name || value,
                    district: ward?.name || value,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Phường / Xã" />
                </SelectTrigger>
                <SelectContent className="max-h-80 overflow-y-auto">
                  {wardOptions.map((ward) => (
                    <SelectItem key={ward.code} value={ward.code}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedWard && (
            <p className="text-xs text-muted-foreground">
              Đã chọn:{" "}
              {selectedProvince?.fullName ||
                selectedProvince?.name ||
                formData.city}
              {selectedWard?.name ? `, ${selectedWard.name}` : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
