import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import { MFMap, MFMarker } from "react-map4d-map";

interface LocationMapCardProps {
  branch: {
    address: string;
    ward?: string;
    district?: string;
    city?: string;
    latitude?: string;
    longitude?: string;
    name: string;
    enterpriseName: string;
  };
}

export function LocationMapCard({ branch }: LocationMapCardProps) {
  const latitude = branch.latitude ? parseFloat(branch.latitude) : 10.7769;
  const longitude = branch.longitude ? parseFloat(branch.longitude) : 106.7009;

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
          <MFMap
            center={{ lat: latitude, lng: longitude }}
            zoom={15}
            accessKey="37b541da761a2896d03951cf69bc989e"
            options={{ mapType: "raster", controlOptions: {} }}
            version="2.5"
          >
            <MFMarker
              position={{ lat: latitude, lng: longitude }}
              label={""}
              title={`${branch.enterpriseName} - ${branch.name}`}
            />
          </MFMap>
        </div>
      </CardContent>
    </Card>
  );
}
