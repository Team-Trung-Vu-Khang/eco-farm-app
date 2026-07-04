import { useMemo, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useToast,
  Dialog,
  DialogContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, X, Maximize2 } from "lucide-react";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getBoundsFromPoints } from "../utils/map";

interface AreaMapStepProps {
  markerIcon: L.Icon;
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

const DEFAULT_POINTS = [
  L.latLng(11.53, 106.88),
  L.latLng(11.55, 106.88),
  L.latLng(11.55, 106.91),
  L.latLng(11.53, 106.91),
];

interface MapLayoutProps {
  center: L.LatLng;
  areaPoints: L.LatLng[];
  markerIcon: L.Icon;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
  handleMapClick: (latlng: L.LatLng) => void;
  handlePointDrag: (index: number, latlng: L.LatLng) => void;
  removePoint: (index: number) => void;
  handlePointInputChange: (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => void;
  handleAddPoint: () => void;
}

const MapLayout = ({
  center,
  areaPoints,
  markerIcon,
  isFullscreen,
  setIsFullscreen,
  handleMapClick,
  handlePointDrag,
  removePoint,
  handlePointInputChange,
  handleAddPoint,
}: MapLayoutProps) => {
  return (
    <div className="flex flex-1 gap-4 overflow-hidden p-4 h-full w-full">
      <div className="relative z-0 h-full flex-1 overflow-hidden rounded-lg border">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onClick={handleMapClick} />

          <Polygon
            positions={areaPoints}
            pathOptions={{ color: "blue", fillOpacity: 0.1 }}
          />

          {areaPoints.map((point, index) => (
            <Marker
              key={`point-${index}`}
              position={point}
              draggable={true}
              icon={markerIcon}
              eventHandlers={{
                drag: (event) => {
                  handlePointDrag(index, event.target.getLatLng());
                },
              }}
            />
          ))}
        </MapContainer>
      </div>

      <div className="flex h-full w-[300px] flex-col overflow-hidden rounded-lg border bg-slate-50">
        <div className="flex items-start justify-between border-b bg-white p-3">
          <div>
            <h4 className="text-sm font-semibold">Danh sách toạ độ</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Kéo thả điểm trên bản đồ hoặc click để thêm điểm mới.
            </p>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {areaPoints.map((point, index) => (
            <div
              key={index}
              className="relative flex flex-col gap-2 rounded border bg-white p-2 text-xs"
            >
              <div className="absolute right-2 top-2 flex gap-1">
                {areaPoints.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
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
                      handlePointInputChange(index, "lat", event.target.value)
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
                      handlePointInputChange(index, "lng", event.target.value)
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
            onClick={handleAddPoint}
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm điểm
          </Button>
        </div>
      </div>
    </div>
  );
};

export const AreaMapStep = ({ markerIcon }: AreaMapStepProps) => {
  const { watch, setValue } = useFormContext();
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const coordinates = watch("coordinates") || [];

  const areaPoints = useMemo(
    () => coordinates.map((c: any) => L.latLng(c.lat, c.lng)),
    [coordinates],
  );

  const setAreaPoints = useCallback(
    (points: L.LatLng[]) => {
      setValue(
        "coordinates",
        points.map((p) => ({ lat: p.lat, lng: p.lng })),
        { shouldValidate: true },
      );
    },
    [setValue],
  );

  const handleMapClick = useCallback(
    (latlng: L.LatLng) => {
      setAreaPoints([...areaPoints, latlng]);
    },
    [areaPoints, setAreaPoints],
  );

  const handlePointDrag = useCallback(
    (index: number, latlng: L.LatLng) => {
      const newPoints = [...areaPoints];
      newPoints[index] = latlng;
      setAreaPoints(newPoints);
    },
    [areaPoints, setAreaPoints],
  );

  const removePoint = useCallback(
    (index: number) => {
      if (areaPoints.length <= 3) {
        toast({
          title: "Không thể xóa",
          description: "Khu vực cần ít nhất 3 điểm để tạo thành hình",
          variant: "destructive",
        });
        return;
      }
      const newPoints = areaPoints.filter((_, i) => i !== index);
      setAreaPoints(newPoints);
    },
    [areaPoints, setAreaPoints, toast],
  );

  const handlePointInputChange = useCallback(
    (index: number, field: "lat" | "lng", value: string) => {
      const val = parseFloat(value);
      if (isNaN(val)) return;

      const newPoints = [...areaPoints];
      const currentPoint = newPoints[index];
      newPoints[index] = L.latLng(
        field === "lat" ? val : currentPoint.lat,
        field === "lng" ? val : currentPoint.lng,
      );
      setAreaPoints(newPoints);
    },
    [areaPoints, setAreaPoints],
  );

  const handleAddPoint = useCallback(() => {
    const mapCenter = getBoundsFromPoints(
      areaPoints,
      DEFAULT_POINTS,
    ).getCenter();
    setAreaPoints([
      ...areaPoints,
      L.latLng(mapCenter.lat + 0.005, mapCenter.lng + 0.005),
    ]);
  }, [areaPoints, setAreaPoints]);

  const center = useMemo(
    () => getBoundsFromPoints(areaPoints, DEFAULT_POINTS).getCenter(),
    [areaPoints],
  );

  return (
    <Card className="flex h-[750px] flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-0 pt-3 px-4 space-y-0">
        <CardTitle>Bản đồ vị trí</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(true)}
          title="Phóng to toàn màn hình"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        {!isFullscreen && (
          <MapLayout
            center={center}
            areaPoints={areaPoints}
            markerIcon={markerIcon}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
            handleMapClick={handleMapClick}
            handlePointDrag={handlePointDrag}
            removePoint={removePoint}
            handlePointInputChange={handlePointInputChange}
            handleAddPoint={handleAddPoint}
          />
        )}

        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-[95vw] h-[95vh] p-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Bản đồ vị trí</h2>
            </div>
            {isFullscreen && (
              <MapLayout
                center={center}
                areaPoints={areaPoints}
                markerIcon={markerIcon}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                handleMapClick={handleMapClick}
                handlePointDrag={handlePointDrag}
                removePoint={removePoint}
                handlePointInputChange={handlePointInputChange}
                handleAddPoint={handleAddPoint}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
