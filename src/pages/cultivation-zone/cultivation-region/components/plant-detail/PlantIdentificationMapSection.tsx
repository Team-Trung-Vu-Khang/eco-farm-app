import {
  Button,
  Card,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin, Maximize2 } from "lucide-react";
import { MFMap, MFMarker, MFPolygon } from "react-map4d-map";
import type {
  Plant,
  Region,
  SubArea,
} from "../../../../region-chart/constants";

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
  const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
  const toClosedPath = (coordinates?: Array<{ lat: number; lng: number }>) => {
    if (!coordinates || coordinates.length < 3) return [];

    const path = coordinates.map((coordinate) => ({
      lat: coordinate.lat,
      lng: coordinate.lng,
    }));
    const first = path[0];
    const last = path[path.length - 1];

    if (first.lat !== last.lat || first.lng !== last.lng) {
      path.push({ ...first });
    }

    return path;
  };

  const regionPath = toClosedPath(region?.coordinates);
  const areaPath = toClosedPath(area?.coordinates);
  const plotPath = toClosedPath(plot?.coordinates);

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
        <MFMap
          center={{ lat: plant.coordinate.lat, lng: plant.coordinate.lng }}
          zoom={18}
          accessKey={MAP4D_ACCESS_KEY}
          options={{ mapType: "raster", controlOptions: {} }}
          version="2.5"
        >
          {regionPath.length > 0 && (
            <MFPolygon
              paths={[regionPath]}
              strokeColor="#3b82f6"
              strokeWidth={2}
              fillColor="#3b82f6"
              fillOpacity={0.1}
            />
          )}

          {areaPath.length > 0 && (
            <MFPolygon
              paths={[areaPath]}
              strokeColor="#10b981"
              strokeWidth={2}
              fillColor="#10b981"
              fillOpacity={0.2}
            />
          )}

          {plotPath.length > 0 && (
            <MFPolygon
              paths={[plotPath]}
              strokeColor="#f59e0b"
              strokeWidth={2}
              fillColor="#f59e0b"
              fillOpacity={0.3}
            />
          )}

          <MFMarker
            position={{ lat: plant.coordinate.lat, lng: plant.coordinate.lng }}
            title={`${plant.code} - ${plant.name}`}
            label={""}
            clickable
          />
        </MFMap>
      </div>
    </Card>
  );
};
