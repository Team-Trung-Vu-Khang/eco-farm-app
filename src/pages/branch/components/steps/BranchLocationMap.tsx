import AddressSearchInput from "@/components/AddressSearchInput";
import {
  findAddressComponent,
  reverseGeocode as reverseGeocodeAddress,
} from "@/shared/lib/googleGeocode";
import { Button, Input, Label, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import type { BranchFormData } from "../../types/types";

interface BranchLocationMapProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
}

const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009];

const mapContainerStyle = { width: "100%", height: "100%" };
const googleMapsLibraries: "places"[] = ["places"];

export function BranchLocationMap({
  formData,
  updateFormData,
}: BranchLocationMapProps) {
  const { toast } = useToast();
  const latestLocationRequestRef = useRef(0);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
    libraries: googleMapsLibraries,
  });

  const safeLatitude = Number.isFinite(formData.latitude)
    ? formData.latitude
    : DEFAULT_CENTER[0];
  const safeLongitude = Number.isFinite(formData.longitude)
    ? formData.longitude
    : DEFAULT_CENTER[1];
  const center = { lat: safeLatitude, lng: safeLongitude };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.panTo(center);
  }, [center.lat, center.lng]);

  const reverseGeocode = useCallback(async (lat: number, lon: number) => {
    try {
      const result = await reverseGeocodeAddress(lat, lon);
      if (!result) return null;
      const { address_components: components, display_name } = result;

      const streetNumber = findAddressComponent(components, ["street_number"]);
      const route = findAddressComponent(components, ["route"]);
      const ward = findAddressComponent(components, [
        "sublocality_level_1",
        "sublocality",
        "neighborhood",
      ]);
      const district = findAddressComponent(components, [
        "administrative_area_level_2",
      ]);
      const city = findAddressComponent(components, [
        "administrative_area_level_1",
      ]);

      const detailedAddress =
        [streetNumber, route].filter(Boolean).join(" ").trim() || display_name;

      return {
        address: detailedAddress || undefined,
        ward,
        district,
        city,
      };
    } catch {
      return null;
    }
  }, []);

  const handlePickLocation = useCallback(
    async (lat: number, lon: number) => {
      const requestId = ++latestLocationRequestRef.current;
      updateFormData({
        latitude: lat,
        longitude: lon,
      });

      const resolved = await reverseGeocode(lat, lon);
      if (!resolved) return;
      if (requestId !== latestLocationRequestRef.current) return;

      updateFormData(resolved);
    },
    [reverseGeocode, updateFormData],
  );

  useEffect(() => {
    if (navigator.geolocation && !Number.isFinite(formData.latitude)) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          void handlePickLocation(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Ignore geolocation errors and keep the default map position.
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  }, [formData.latitude, handlePickLocation]);

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
    <div className="space-y-4">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Tìm kiếm địa chỉ trên bản đồ</h3>
      </div>

      <AddressSearchInput
        value={formData.address}
        onChange={(address) => updateFormData({ address })}
        onSelectLocation={({ address, latitude, longitude }) =>
          updateFormData({ address, latitude, longitude })
        }
        latitude={formData.latitude}
        longitude={formData.longitude}
        placeholder="Tìm kiếm địa chỉ bằng Google Maps..."
      />

      <div className="h-96 w-full overflow-hidden rounded-lg border">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            options={{ zoomControl: true }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            onClick={(event) => {
              if (!event.latLng) return;
              void handlePickLocation(event.latLng.lat(), event.latLng.lng());
            }}
          >
            <Marker
              position={center}
              draggable
              onDragEnd={(event) => {
                if (!event.latLng) return;
                void handlePickLocation(event.latLng.lat(), event.latLng.lng());
              }}
            />
          </GoogleMap>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
            Đang tải bản đồ...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
  );
}
