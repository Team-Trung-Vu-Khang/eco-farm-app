import {
  Button,
  Card,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin, Maximize2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "../../components/plant-detail/leafletIconSetup";
import {
  Tooltip as LeafletTooltip,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
} from "react-leaflet";
import type { Plant, Region, SubArea } from "../../../../region-chart/constants";

type PlotLike = {
  id: string;
  name: string;
  coordinates: Array<{ lat: number; lng: number }>;
};

type Props = {
  plant: Plant;
  region?: Region | null;
  area?: SubArea | null;
  plot?: PlotLike | null;
};

export const PlantIdentificationMapSection = ({
  plant,
  region,
  area,
  plot,
}: Props) => {
  return (
    <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden h-125 flex flex-col">
      <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Vị trí địa lý & Phạm vi canh tác
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <div className="flex-1 z-0">
        <MapContainer
          center={[plant.coordinate.lat, plant.coordinate.lng]}
          zoom={18}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Esri"
          />
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />

          {region?.coordinates && (
            <Polygon
              positions={region.coordinates.map((coordinate) => [
                coordinate.lat,
                coordinate.lng,
              ])}
              pathOptions={{ color: "#3b82f6", weight: 2, fillOpacity: 0.1 }}
            >
              <LeafletTooltip permanent direction="center">
                Vùng: {region.name}
              </LeafletTooltip>
            </Polygon>
          )}

          {area?.coordinates && (
            <Polygon
              positions={area.coordinates.map((coordinate) => [
                coordinate.lat,
                coordinate.lng,
              ])}
              pathOptions={{ color: "#10b981", weight: 2, fillOpacity: 0.2 }}
            >
              <LeafletTooltip direction="top">Khu vực: {area.name}</LeafletTooltip>
            </Polygon>
          )}

          {plot?.coordinates && (
            <Polygon
              positions={plot.coordinates.map((coordinate) => [
                coordinate.lat,
                coordinate.lng,
              ])}
              pathOptions={{ color: "#f59e0b", weight: 2, fillOpacity: 0.3 }}
            >
              <LeafletTooltip direction="top">Lô: {plot.name}</LeafletTooltip>
            </Polygon>
          )}

          <Marker position={[plant.coordinate.lat, plant.coordinate.lng]}>
            <Popup>
              <div className="text-xs p-1">
                <p className="font-bold">{plant.code}</p>
                <p>{plant.name}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </Card>
  );
};
