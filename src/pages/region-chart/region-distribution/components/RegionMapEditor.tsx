import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, X } from "lucide-react";
import { MapContainer, Marker, Polygon, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getBoundsFromPoints } from "../utils";

interface RegionMapEditorProps {
  regionPoints: L.LatLng[];
  defaultPoints: L.LatLng[];
  markerIcon: L.Icon;
  onMapClick: (latlng: L.LatLng) => void;
  onPointDrag: (index: number, latlng: L.LatLng) => void;
  onRemovePoint: (index: number) => void;
  onPointInputChange: (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => void;
  onAddPoint: () => void;
}

const MapClickHandler = ({
  onClick,
}: {
  onClick: (latlng: L.LatLng) => void;
}) => {
  useMapEvents({
    click(event) {
      onClick(event.latlng);
    },
  });
  return null;
};

export const RegionMapEditor = ({
  regionPoints,
  defaultPoints,
  markerIcon,
  onMapClick,
  onPointDrag,
  onRemovePoint,
  onPointInputChange,
  onAddPoint,
}: RegionMapEditorProps) => {
  const center = getBoundsFromPoints(regionPoints, defaultPoints).getCenter();

  return (
    <Card className="flex h-[750px] flex-col">
      <CardHeader>
        <CardTitle>Bản đồ vị trí</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 gap-4 overflow-hidden p-4">
        <div className="relative z-0 h-full flex-1 overflow-hidden rounded-lg border">
          <MapContainer center={[center.lat, center.lng]} zoom={14} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onClick={onMapClick} />

            <Polygon
              positions={regionPoints}
              pathOptions={{ color: "blue", fillOpacity: 0.1 }}
            />

            {regionPoints.map((point, index) => (
              <Marker
                key={`point-${index}`}
                position={point}
                draggable={true}
                icon={markerIcon}
                eventHandlers={{
                  drag: (event) => {
                    onPointDrag(index, event.target.getLatLng());
                  },
                }}
              />
            ))}
          </MapContainer>
        </div>

        <div className="flex h-full w-[300px] flex-col overflow-hidden rounded-lg border bg-slate-50">
          <div className="border-b bg-white p-3">
            <h4 className="text-sm font-semibold">Danh sách toạ độ</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Kéo thả điểm trên bản đồ hoặc click để thêm điểm mới.
            </p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {regionPoints.map((point, index) => (
              <div
                key={index}
                className="relative flex flex-col gap-2 rounded border bg-white p-2 text-xs"
              >
                <div className="absolute right-2 top-2 flex gap-1">
                  {regionPoints.length > 3 && (
                    <button
                      type="button"
                      onClick={() => onRemovePoint(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <span className="font-semibold">Điểm {index + 1}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500">Lat</label>
                    <input
                      className="w-full rounded border px-1 py-0.5"
                      type="number"
                      value={point.lat}
                      onChange={(event) =>
                        onPointInputChange(index, "lat", event.target.value)
                      }
                      step="0.0001"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500">Lng</label>
                    <input
                      className="w-full rounded border px-1 py-0.5"
                      type="number"
                      value={point.lng}
                      onChange={(event) =>
                        onPointInputChange(index, "lng", event.target.value)
                      }
                      step="0.0001"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed"
              onClick={onAddPoint}
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm điểm
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
