import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapContainer, TileLayer } from "react-leaflet";
import { MapController } from "./DraggableRectangle";

interface RegionChartMapCardProps {
  title: ReactNode;
  center: [number, number];
  zoom: number;
  heightClassName?: string;
  children: ReactNode;
}

export function RegionChartMapCard({
  title,
  center,
  zoom,
  heightClassName = "h-[600px]",
  children,
}: RegionChartMapCardProps) {
  return (
    <Card className="flex h-full min-h-[500px] flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative flex-1 overflow-hidden rounded-b-lg p-0">
        <MapContainer
          center={center}
          zoom={zoom}
          className={`w-full ${heightClassName}`}
          scrollWheelZoom
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={center} />
          {children}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
