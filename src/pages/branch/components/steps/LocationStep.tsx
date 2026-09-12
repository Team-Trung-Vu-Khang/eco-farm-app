import AddressSearchInput from "@/components/AddressSearchInput";
import { AddressRemoteCombobox } from "@/components/AddressRemoteCombobox";
import { Button, Input, Label, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import type { BranchFormData } from "../../types/types";

interface LocationStepProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
}

const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009];

const mapContainerStyle = { width: "100%", height: "100%" };
const googleMapsLibraries: "places"[] = ["places"];

export function LocationStep({ formData, updateFormData }: LocationStepProps) {
  const { toast } = useToast();
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

  const handlePickLocation = useCallback(
    (lat: number, lon: number) => {
      updateFormData({
        latitude: lat,
        longitude: lon,
      });
    },
    [updateFormData],
  );

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
                handlePickLocation(event.latLng.lat(), event.latLng.lng());
              }}
            >
              <Marker
                position={center}
                draggable
                onDragEnd={(event) => {
                  if (!event.latLng) return;
                  handlePickLocation(event.latLng.lat(), event.latLng.lng());
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

      <div className="border-t pt-4">
        <h3 className="mb-4 font-semibold">Địa chỉ chi tiết</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(event) =>
                updateFormData({ address: event.target.value })
              }
              placeholder="Số nhà, tên đường"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Tỉnh / Thành phố</Label>
              <AddressRemoteCombobox
                type="province"
                value={formData.city}
                onChange={(value) =>
                  updateFormData({ city: value, district: "", ward: "" })
                }
                placeholder="Chọn Tỉnh / Thành phố"
                searchPlaceholder="Tìm tỉnh thành..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ward">Phường / Xã</Label>
              <AddressRemoteCombobox
                type="ward"
                value={formData.ward}
                onChange={(value) =>
                  updateFormData({ ward: value, district: value })
                }
                provinceCode={formData.city}
                placeholder={
                  formData.city
                    ? "Chọn Phường / Xã"
                    : "Chọn Tỉnh / Thành phố trước"
                }
                searchPlaceholder="Tìm phường xã..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
