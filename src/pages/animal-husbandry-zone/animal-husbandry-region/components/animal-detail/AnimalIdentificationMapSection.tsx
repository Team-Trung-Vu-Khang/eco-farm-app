import type { Plant } from "../../../../region-chart/constants";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GoogleMap, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Maximize2 } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import treeMarkerIcon from "@/assets/tree.webp";

type Props = {
  plant: Plant;
  region?: { coordinates?: Array<{ lat: number; lng: number }> } | null;
  area?: { coordinates?: Array<{ lat: number; lng: number }> } | null;
  plot?: { coordinates?: Array<{ lat: number; lng: number }> } | null;
};

type LatLng = { lat: number; lng: number };

const mapContainerStyle = { width: "100%", height: "100%" };

const toClosedPath = (coordinates?: Array<{ lat: number; lng: number }>) => {
  if (!coordinates || coordinates.length < 3) return [];

  const path = coordinates.map(
    (coordinate) => ({ lat: coordinate.lat, lng: coordinate.lng }) as LatLng,
  );
  const first = path[0];
  const last = path[path.length - 1];

  if (first.lat !== last.lat || first.lng !== last.lng) {
    path.push({ lat: first.lat, lng: first.lng });
  }

  return path;
};

const getCenterFromPath = (path: LatLng[]) => {
  if (path.length === 0) return null;

  const lat = path.reduce((sum, point) => sum + point.lat, 0) / path.length;
  const lng = path.reduce((sum, point) => sum + point.lng, 0) / path.length;
  return { lat, lng } as LatLng;
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

  const plantCenter = useMemo<LatLng>(
    () => ({ lat: plant.coordinate.lat, lng: plant.coordinate.lng }),
    [plant.coordinate.lat, plant.coordinate.lng],
  );

  const mapCenter =
    getCenterFromPath(plotPath) ??
    getCenterFromPath(areaPath) ??
    getCenterFromPath(regionPath) ??
    plantCenter;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });

  const icon = useMemo(() => {
    if (!isLoaded) return undefined;
    return {
      url: treeMarkerIcon,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 32),
    };
  }, [isLoaded]);

  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      const points = [...plotPath, ...areaPath, ...regionPath];
      if (points.length >= 2) {
        const bounds = new google.maps.LatLngBounds();
        points.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds, 32);
      } else {
        map.setCenter(mapCenter);
        map.setZoom(18);
      }
    },
    [plotPath, areaPath, regionPath, mapCenter],
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
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={18}
            options={{ zoomControl: false }}
            onLoad={handleMapLoad}
          >
            {regionPath.length > 0 ? (
              <Polygon
                paths={regionPath}
                options={{
                  strokeColor: "#3b82f6",
                  strokeWeight: 2,
                  fillColor: "#3b82f6",
                  fillOpacity: 0.1,
                }}
              />
            ) : null}

            {areaPath.length > 0 ? (
              <Polygon
                paths={areaPath}
                options={{
                  strokeColor: "#10b981",
                  strokeWeight: 2,
                  fillColor: "#10b981",
                  fillOpacity: 0.2,
                }}
              />
            ) : null}

            {plotPath.length > 0 ? (
              <Polygon
                paths={plotPath}
                options={{
                  strokeColor: "#f59e0b",
                  strokeWeight: 2,
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
          </GoogleMap>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Đang tải bản đồ...
          </div>
        )}
      </div>
    </Card>
  );
};
