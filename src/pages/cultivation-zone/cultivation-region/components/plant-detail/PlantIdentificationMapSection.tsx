import type { Plant } from "../../../../region-chart/constants";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Maximize2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polygon, TileLayer, useMap } from "react-leaflet";
import treeMarkerIcon from "@/assets/tree.webp";

type Props = {
  plant: Plant;
  region?: { coordinates?: Array<{ lat: number; lng: number }> } | null;
  area?: { coordinates?: Array<{ lat: number; lng: number }> } | null;
  plot?: { coordinates?: Array<{ lat: number; lng: number }> } | null;
};

type LatLngTuple = [number, number];

const toClosedPath = (coordinates?: Array<{ lat: number; lng: number }>) => {
  if (!coordinates || coordinates.length < 3) return [];

  const path = coordinates.map(
    (coordinate) => [coordinate.lat, coordinate.lng] as LatLngTuple,
  );
  const [firstLat, firstLng] = path[0];
  const [lastLat, lastLng] = path[path.length - 1];

  if (firstLat !== lastLat || firstLng !== lastLng) {
    path.push([firstLat, firstLng]);
  }

  return path;
};

const getCenterFromPath = (path: LatLngTuple[]) => {
  if (path.length === 0) return null;

  const lat = path.reduce((sum, point) => sum + point[0], 0) / path.length;
  const lng = path.reduce((sum, point) => sum + point[1], 0) / path.length;
  return [lat, lng] as LatLngTuple;
};

const MapBoundsSync = ({
  paths,
  center,
}: {
  paths: LatLngTuple[][];
  center: LatLngTuple;
}) => {
  const map = useMap();

  useEffect(() => {
    const points = paths.flat();
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [32, 32], animate: true });
        return;
      }
    }

    map.setView(center, 18, { animate: true });
  }, [center, map, paths]);

  return null;
};

export const PlantIdentificationMapSection = ({
  plant,
  region,
  area,
  plot,
}: Props) => {
  const regionPath = useMemo(() => toClosedPath(region?.coordinates), [region]);
  const areaPath = useMemo(() => toClosedPath(area?.coordinates), [area]);
  const plotPath = useMemo(() => toClosedPath(plot?.coordinates), [plot]);

  const plantCenter = useMemo<LatLngTuple>(
    () => [plant.coordinate.lat, plant.coordinate.lng],
    [plant.coordinate.lat, plant.coordinate.lng],
  );

  const mapCenter =
    getCenterFromPath(plotPath) ??
    getCenterFromPath(areaPath) ??
    getCenterFromPath(regionPath) ??
    plantCenter;

  const icon = useMemo(
    () =>
      L.icon({
        iconUrl: treeMarkerIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30],
      }),
    [],
  );

  return (
    <Card className="flex h-125 flex-col overflow-hidden rounded-2xl border-none bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <MapPin className="h-4 w-4 text-primary" />
          Vị trí địa lý & Phạm vi canh tác
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <div className="relative flex-1">
        <MapContainer
          center={mapCenter}
          zoom={18}
          className="h-full w-full"
          scrollWheelZoom
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapBoundsSync
            paths={[plotPath, areaPath, regionPath].filter((path) => path.length > 0)}
            center={mapCenter}
          />

          {regionPath.length > 0 ? (
            <Polygon
              positions={regionPath}
              pathOptions={{
                color: "#3b82f6",
                weight: 2,
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
              }}
            />
          ) : null}

          {areaPath.length > 0 ? (
            <Polygon
              positions={areaPath}
              pathOptions={{
                color: "#10b981",
                weight: 2,
                fillColor: "#10b981",
                fillOpacity: 0.2,
              }}
            />
          ) : null}

          {plotPath.length > 0 ? (
            <Polygon
              positions={plotPath}
              pathOptions={{
                color: "#f59e0b",
                weight: 2,
                fillColor: "#f59e0b",
                fillOpacity: 0.3,
              }}
            />
          ) : null}

          <Marker
            position={plantCenter}
            icon={icon}
            title={`${plant.code} - ${plant.name}`}
          />
        </MapContainer>
      </div>
    </Card>
  );
};
