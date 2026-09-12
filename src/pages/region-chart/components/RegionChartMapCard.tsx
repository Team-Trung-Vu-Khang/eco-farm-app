import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { MapController } from "./DraggableRectangle";

const mapContainerStyle = { width: "100%", height: "100%" };

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
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });

  const centerObj = { lat: center[0], lng: center[1] };

  return (
    <Card className="flex h-full min-h-[500px] flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative flex-1 overflow-hidden rounded-b-lg p-0">
        {isLoaded ? (
          <div className={`w-full ${heightClassName}`}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={centerObj}
              zoom={zoom}
            >
              <MapController center={centerObj} />
              {children}
            </GoogleMap>
          </div>
        ) : (
          <div
            className={`flex w-full items-center justify-center text-sm text-muted-foreground ${heightClassName}`}
          >
            Đang tải bản đồ...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
