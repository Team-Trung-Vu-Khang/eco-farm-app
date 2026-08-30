import AddressSearchInput from "@/components/AddressSearchInput";
import { Button, Input, Label, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useCallback, useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

import defaultMarkerIconUrl from "leaflet/dist/images/marker-icon.png";
import defaultMarkerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import defaultMarkerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import type { BranchFormData } from "../../types/types";

interface BranchLocationMapProps {
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

export function BranchLocationMap({
  formData,
  updateFormData,
}: BranchLocationMapProps) {
  const { toast } = useToast();

  const safeLatitude = Number.isFinite(formData.latitude)
    ? formData.latitude
    : DEFAULT_CENTER[0];
  const safeLongitude = Number.isFinite(formData.longitude)
    ? formData.longitude
    : DEFAULT_CENTER[1];
  const center: [number, number] = [safeLatitude, safeLongitude];

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
