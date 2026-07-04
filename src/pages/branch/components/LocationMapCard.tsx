import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import defaultMarkerIconUrl from "leaflet/dist/images/marker-icon.png";
import defaultMarkerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import defaultMarkerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import type { BranchDetailView } from "../hooks/useBranchDetail";

interface LocationMapCardProps {
  branch: Pick<
    BranchDetailView,
    | "address"
    | "ward"
    | "district"
    | "city"
    | "latitude"
    | "longitude"
    | "name"
    | "enterpriseName"
  >;
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

const MapCenterSync = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
};

export function LocationMapCard({ branch }: LocationMapCardProps) {
  const latitude = Number.isFinite(Number(branch.latitude))
    ? Number(branch.latitude)
    : 10.7769;
  const longitude = Number.isFinite(Number(branch.longitude))
    ? Number(branch.longitude)
    : 106.7009;
  const center: [number, number] = [latitude, longitude];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Định vị & Địa chỉ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted/20 rounded-lg flex items-start gap-3 border">
          <MapPin className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">{branch.address}</p>
            <p className="text-sm text-muted-foreground">
              {branch.ward && `${branch.ward}, `}
              {branch.district && `${branch.district}, `}
              {branch.city}
            </p>
          </div>
        </div>

        <div className="h-64 w-full rounded-lg overflow-hidden border z-0 relative">
          <MapContainer
            center={center}
            zoom={15}
            className="h-full w-full"
            zoomControl={false}
            scrollWheelZoom
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapCenterSync center={center} />
            <Marker
              position={center}
              icon={defaultLeafletIcon}
              title={`${branch.enterpriseName} - ${branch.name}`}
            />
          </MapContainer>
        </div>
      </CardContent>

      <style>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          font-family: inherit;
          background: #e2e8f0;
        }
      `}</style>
    </Card>
  );
}
