import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

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

const mapContainerStyle = { width: "100%", height: "100%" };

export function LocationMapCard({ branch }: LocationMapCardProps) {
  const latitude = Number.isFinite(Number(branch.latitude))
    ? Number(branch.latitude)
    : 10.7769;
  const longitude = Number.isFinite(Number(branch.longitude))
    ? Number(branch.longitude)
    : 106.7009;
  const center = { lat: latitude, lng: longitude };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });

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
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
              options={{ zoomControl: false }}
            >
              <Marker
                position={center}
                title={`${branch.enterpriseName} - ${branch.name}`}
              />
            </GoogleMap>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
              Đang tải bản đồ...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
