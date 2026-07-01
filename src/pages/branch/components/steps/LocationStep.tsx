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
import { MapPin } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MFMap, MFMarker } from "react-map4d-map";
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

interface Map4DMapLike {
  setCenter?: (center: { lat: number; lng: number }) => void;
  setZoom?: (zoom: number) => void;
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

export function LocationStep({ formData, updateFormData }: LocationStepProps) {
  const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
  const { toast } = useToast();
  const mapRef = useRef<Map4DMapLike | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchAddress, setSearchAddress] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const didInitCurrentLocationRef = useRef(false);
  const skipNextSearchRef = useRef(false);
  const safeLatitude = Number.isFinite(formData.latitude)
    ? formData.latitude
    : 10.7769;
  const safeLongitude = Number.isFinite(formData.longitude)
    ? formData.longitude
    : 106.7009;

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

  const extractLatLng = useCallback(
    (source: unknown): { lat: number; lon: number } | null => {
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
    },
    [],
  );

  const moveMapTo = (lat: number, lon: number) => {
    const map = mapRef.current;
    if (!map) return;
    if (typeof map.setCenter === "function") {
      map.setCenter({ lat, lng: lon });
    }
    if (typeof map.setZoom === "function") {
      map.setZoom(15);
    }
  };

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
        toast({
          title: "Thiếu cấu hình Map4D",
          description: "Chưa có VITE_MAP4D_ACCESS_KEY trong file .env",
          variant: "destructive",
        });
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
          toast({
            title: "Lỗi tìm kiếm",
            description: "Map4D Autosuggest không phản hồi.",
            variant: "destructive",
          });
          return;
        }
        const data: Map4DAutosuggestResponse = await response.json();
        if (data?.code !== "ok") {
          setAddressSuggestions([]);
          setShowSuggestions(false);
          toast({
            title: "Lỗi tìm kiếm",
            description: data?.message || "Map4D Autosuggest trả về lỗi.",
            variant: "destructive",
          });
          return;
        }

        const list = Array.isArray(data.result) ? data.result : [];
        const suggestions: AddressSuggestion[] = list
          .map(normalizeMap4dSuggestion)
          .filter((item): item is AddressSuggestion => item !== null);

        setAddressSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
        if (suggestions.length === 0) {
          toast({
            title: "Không tìm thấy",
            description: "Không có gợi ý địa chỉ phù hợp.",
          });
        }
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
    }, 500);
    return () => clearTimeout(timer);
  }, [searchAddress, isInputFocused, handleSearchAddress]);

  useEffect(() => {
    if (didInitCurrentLocationRef.current) return;
    if (!navigator.geolocation) {
      didInitCurrentLocationRef.current = true;
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateFormData({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        didInitCurrentLocationRef.current = true;
      },
      () => {
        didInitCurrentLocationRef.current = true;
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [updateFormData]);

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

    moveMapTo(suggestion.lat, suggestion.lon);
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
          moveMapTo(pos.coords.latitude, pos.coords.longitude);
          updateFormData({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    moveMapTo(safeLatitude, safeLongitude);
  }, [safeLatitude, safeLongitude]);

  useEffect(() => {
    if (!MAP4D_ACCESS_KEY || isMapReady) return;
    const timer = window.setTimeout(() => {
      if (!isMapReady) {
        toast({
          title: "Map4D chưa sẵn sàng",
          description:
            "Kiểm tra lại Access Key và restart dev server sau khi sửa .env.",
          variant: "destructive",
        });
      }
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [MAP4D_ACCESS_KEY, isMapReady, toast]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Tìm kiếm địa chỉ trên bản đồ</h3>
        </div>

        <div className="relative" ref={searchContainerRef}>
          <Input
            value={searchAddress}
            onChange={(e) => {
              setSearchAddress(e.target.value);
              if (!e.target.value) setShowSuggestions(false);
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
            <div className="absolute z-[99999] w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {addressSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelectAddress(suggestion)}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.display_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-96 w-full rounded-lg overflow-hidden border">
          {!MAP4D_ACCESS_KEY ? (
            <div className="h-full w-full grid place-items-center bg-slate-50 text-sm text-slate-500">
              Thiếu VITE_MAP4D_ACCESS_KEY trong .env
            </div>
          ) : (
            <MFMap
              accessKey={MAP4D_ACCESS_KEY}
              version="2.5"
              options={{
                center: { lat: safeLatitude, lng: safeLongitude },
                zoom: 15,
                controls: true,
              }}
              onMapReady={(map) => {
                mapRef.current = map;
                setIsMapReady(true);
                window.setTimeout(() => {
                  window.dispatchEvent(new Event("resize"));
                  if (typeof map?.setCenter === "function") {
                    map.setCenter({ lat: safeLatitude, lng: safeLongitude });
                  }
                  if (typeof map?.setZoom === "function") {
                    map.setZoom(15);
                  }
                }, 150);
              }}
              onClickLocation={(event: unknown) => {
                const point = extractLatLng(event);
                if (point) {
                  updateFormData({ latitude: point.lat, longitude: point.lon });
                }
              }}
            >
              <MFMarker
                position={{ lat: safeLatitude, lng: safeLongitude }}
                draggable
                title="Vị trí chi nhánh"
                label={""}
                onDragEnd={(event: unknown) => {
                  const point = extractLatLng(event);
                  if (point) {
                    updateFormData({
                      latitude: point.lat,
                      longitude: point.lon,
                    });
                  }
                }}
              />
            </MFMap>
          )}
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
          <MapPin className="w-4 h-4 mr-2" /> Lấy vị trí hiện tại
        </Button>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-semibold mb-4">Địa chỉ chi tiết</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              placeholder="Số nhà, tên đường"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Tỉnh / Thành phố</Label>
              <Select
                value={selectedProvince?.code || ""}
                onValueChange={(val) => {
                  const province = provincesQuery.items.find(
                    (item) => item.code === val,
                  );
                  updateFormData({
                    city: province?.fullName || province?.name || val,
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
                onValueChange={(val) => {
                  const ward = wardOptions.find((item) => item.code === val);
                  updateFormData({
                    ward: ward?.name || val,
                    district: ward?.name || val,
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
