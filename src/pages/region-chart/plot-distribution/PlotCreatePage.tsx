import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  StepperForm,
  type Step,
  useToast,
} from "@tankhang1/eco-shared-ui";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, ChevronLeft, Plus, X } from "lucide-react";

// Fix Leaflet Default Icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

import {
  MOCK_REGIONS,
  MOCK_AREAS,
  MOCK_PLOTS,
  type Plot,
  ENTERPRISES,
} from "../constants";
import { MapController } from "../components/DraggableRectangle";

const MapClickHandler = ({
  onClick,
}: {
  onClick: (latlng: L.LatLng) => void;
}) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const getBoundsFromPoints = (points: L.LatLng[]): L.LatLngBounds => {
  if (points.length === 0) return L.latLngBounds([0, 0], [0, 0]);
  return L.latLngBounds(points);
};

const PlotCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/plot-distribution/edit/:id");
  const isEditMode = match && !!params?.id;

  // Form State
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Partial<Plot>>({
    name: "",
    area: 0,
    contour: "",
    altitude: 0,
    coordinates: [],
  });

  const [currentPoints, setCurrentPoints] = useState<L.LatLng[]>([]);
  const [areaPolygon, setAreaPolygon] = useState<L.LatLng[]>([]);

  // Filtered Areas
  const filteredAreas = MOCK_AREAS.filter(
    (a) => a.regionId === selectedRegionId,
  );

  // Handle Edit Mode Data Loading
  useEffect(() => {
    if (isEditMode && params?.id) {
      // In a real app, fetch from API. Here find in MOCK_PLOTS.
      // However, MOCK_PLOTS is in constants.ts.
      // We need to import it first.
      const plot = MOCK_PLOTS.find((p) => p.id === params.id);
      if (plot) {
        // Find parent area
        const parentArea = MOCK_AREAS.find((a) =>
          a.plots?.some((p) => p.id === plot.id),
        );
        const parentRegion = parentArea
          ? MOCK_REGIONS.find((r) => r.id === parentArea.regionId)
          : null;

        if (parentRegion) setSelectedRegionId(parentRegion.id);
        if (parentArea) setSelectedAreaId(parentArea.id);

        setFormData({
          name: plot.name,
          area: plot.area,
          contour: plot.contour,
          altitude: plot.altitude,
          coordinates: plot.coordinates,
        });

        if (plot.coordinates && plot.coordinates.length >= 3) {
          setCurrentPoints(plot.coordinates.map((c) => L.latLng(c.lat, c.lng)));
        }
      }
    }
  }, [isEditMode, params?.id]);

  // Handle Region/Area Selection to set bounds (Only if NOT in edit mode initial load, or if user changes area)
  // We need to be careful not to overwrite bounds when loading edit data.
  // But the dependency on `selectedAreaId` will trigger.
  // Creating a flag or checking if bounds are already set might be needed,
  // but for simplicity, let's just let user re-center if they change area.
  // However, we must ensure the `useEffect` above runs AFTER or we handle the conflict.
  // Actually, setting `selectedAreaId` triggers the below effect.
  // We can add a check: if formData has coordinates and we represent the SAME area, maybe don't reset?
  // Or better, just let the below effect run but we guard it.

  useEffect(() => {
    if (selectedAreaId) {
      const area = MOCK_AREAS.find((a) => a.id === selectedAreaId);
      if (area && area.coordinates && area.coordinates.length >= 2) {
        const points = area.coordinates.map((c) => L.latLng(c.lat, c.lng));
        setAreaPolygon(points);
        const bounds = L.latLngBounds(points);

        if (!formData.coordinates || formData.coordinates.length === 0) {
          const center = bounds.getCenter();
          setCurrentPoints([
            L.latLng(center.lat - 0.001, center.lng - 0.001),
            L.latLng(center.lat + 0.001, center.lng),
            L.latLng(center.lat - 0.001, center.lng + 0.001),
          ]);
        }
      }
    }
  }, [selectedAreaId]);

  // --- Map Handlers ---
  const handlePointDrag = (index: number, latlng: L.LatLng) => {
    const newPoints = [...currentPoints];
    newPoints[index] = latlng;
    setCurrentPoints(newPoints);
  };

  const handleMapClick = (latlng: L.LatLng) => {
    setCurrentPoints([...currentPoints, latlng]);
  };

  const removePoint = (index: number) => {
    if (currentPoints.length <= 3) {
      toast({
        title: "Lỗi",
        description: "Cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    setCurrentPoints(currentPoints.filter((_, i) => i !== index));
  };

  const handlePointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const newPoints = [...currentPoints];
    const currentPoint = newPoints[index];
    newPoints[index] = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setCurrentPoints(newPoints);
  };

  const handleAddPoint = () => {
    if (currentPoints.length === 0) return;
    const center = getBoundsFromPoints(currentPoints).getCenter();
    setCurrentPoints([
      ...currentPoints,
      L.latLng(center.lat + 0.001, center.lng + 0.001),
    ]);
  };

  const handleSubmit = () => {
    // Process coordinates
    if (currentPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Lô cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }

    const coords = currentPoints.map((p) => ({ lat: p.lat, lng: p.lng }));

    console.log("Submitting Plot:", {
      ...formData,
      coordinates: coords,
      regionId: selectedRegionId,
      areaId: selectedAreaId,
    });

    toast({
      title: "Thành công",
      description: isEditMode ? "Đã cập nhật lô" : "Đã tạo lô mới",
    });
    setLocation("/plot-distribution");
  };

  const steps: Step[] = [
    {
      id: "selection",
      title: "Chọn khu vực",
      description: "Chọn vùng trồng và khu vực",
      isValid: !!selectedRegionId && !!selectedAreaId,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Vị trí lô</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Region Selection */}
            <div className="space-y-2">
              <Label>
                Chọn vùng trồng <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[250px] overflow-y-auto p-1">
                {MOCK_REGIONS.map((region) => (
                  <div
                    key={region.id}
                    onClick={() => {
                      setSelectedRegionId(region.id);
                      setSelectedAreaId(null); // Reset area
                    }}
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                      selectedRegionId === region.id
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                        : "bg-card"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">
                        {region.code}
                      </span>
                      {selectedRegionId === region.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="font-medium truncate">{region.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {
                        ENTERPRISES.find((e) => e.id === region.enterpriseId)
                          ?.name
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Area Selection */}
            {selectedRegionId && (
              <div className="space-y-2">
                <Label>
                  Chọn khu vực <span className="text-red-500">*</span>
                </Label>
                {filteredAreas.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Không có khu vực nào trong vùng này.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[250px] overflow-y-auto p-1">
                    {filteredAreas.map((area) => (
                      <div
                        key={area.id}
                        onClick={() => setSelectedAreaId(area.id)}
                        className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                          selectedAreaId === area.id
                            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                            : "bg-card"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-sm">
                            {area.code}
                          </span>
                          {selectedAreaId === area.id && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="font-medium truncate">{area.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {area.area} ha
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: "info",
      title: "Thông tin lô",
      description: "Điền thông tin chi tiết lô",
      isValid: !!formData.name && !!formData.area,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Tên lô <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ví dụ: Lô Sầu Riêng 1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>
                  Diện tích (ha) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.area || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      area: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Đường bình độ</Label>
                <Input
                  value={formData.contour || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contour: e.target.value })
                  }
                  placeholder="100m"
                />
              </div>
              <div className="space-y-2">
                <Label>Độ cao (m)</Label>
                <Input
                  type="number"
                  value={formData.altitude || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      altitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "map",
      title: "Bản đồ",
      description: "Xác định vị trí trên bản đồ",
      content: (
        <Card className="h-[750px] flex flex-col">
          <CardHeader>
            <CardTitle>Định vị lô đất</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden flex gap-4">
            <div className="flex-1 h-full rounded-lg border overflow-hidden relative">
              <MapContainer
                center={[
                  getBoundsFromPoints(
                    areaPolygon.length ? areaPolygon : currentPoints,
                  ).getCenter().lat,
                  getBoundsFromPoints(
                    areaPolygon.length ? areaPolygon : currentPoints,
                  ).getCenter().lng,
                ]}
                zoom={16}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler onClick={handleMapClick} />

                {/* Parent Area Polygon */}
                {areaPolygon.length > 0 && (
                  <Polygon
                    positions={areaPolygon}
                    pathOptions={{
                      color: "blue",
                      fill: false,
                      dashArray: "5, 5",
                    }}
                  />
                )}

                {/* Current Plot Polygon */}
                <Polygon
                  positions={currentPoints}
                  pathOptions={{ color: "orange", fillOpacity: 0.2 }}
                />

                {currentPoints.map((point, idx) => (
                  <Marker
                    key={`pt-${idx}`}
                    position={point}
                    draggable={true}
                    icon={customIcon}
                    eventHandlers={{
                      drag: (e) => handlePointDrag(idx, e.target.getLatLng()),
                    }}
                  />
                ))}

                <MapController
                  center={[
                    getBoundsFromPoints(
                      currentPoints.length ? currentPoints : areaPolygon,
                    ).getCenter().lat,
                    getBoundsFromPoints(
                      currentPoints.length ? currentPoints : areaPolygon,
                    ).getCenter().lng,
                  ]}
                />
              </MapContainer>
            </div>

            <div className="w-[300px] flex flex-col h-full bg-slate-50 border rounded-lg overflow-hidden">
              <div className="p-3 border-b bg-white">
                <h4 className="font-semibold text-sm">Danh sách toạ độ</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Kéo thả hoặc click bản đồ để thêm.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {currentPoints.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-2 bg-white rounded border text-xs relative"
                  >
                    <div className="absolute top-2 right-2 flex gap-1">
                      {currentPoints.length > 3 && (
                        <button
                          onClick={() => removePoint(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <span className="font-semibold">Điểm {i + 1}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-500">Lat</label>
                        <input
                          className="w-full border rounded px-1 py-0.5"
                          type="number"
                          value={p.lat}
                          onChange={(e) =>
                            handlePointInputChange(i, "lat", e.target.value)
                          }
                          step="0.0001"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500">Lng</label>
                        <input
                          className="w-full border rounded px-1 py-0.5"
                          type="number"
                          value={p.lng}
                          onChange={(e) =>
                            handlePointInputChange(i, "lng", e.target.value)
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
                  <Plus className="w-4 h-4 mr-2" /> Thêm điểm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Xác nhận thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Vùng trồng</Label>
                <p className="font-medium">
                  {MOCK_REGIONS.find((r) => r.id === selectedRegionId)?.name}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Khu vực</Label>
                <p className="font-medium">
                  {MOCK_AREAS.find((a) => a.id === selectedAreaId)?.name}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tên lô</Label>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Diện tích</Label>
                <p className="font-medium">{formData.area} ha</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Đường bình độ</Label>
                <p className="font-medium">{formData.contour || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Độ cao</Label>
                <p className="font-medium">{formData.altitude || "-"} m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <AdminLayout
      title={isEditMode ? "Chỉnh sửa lô" : "Thêm lô mới"}
      description={
        isEditMode ? "Cập nhật thông tin lô" : "Tạo lô đất mới vào khu vực"
      }
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/plot-distribution")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <StepperForm
        steps={steps}
        onComplete={handleSubmit}
        completeLabel={isEditMode ? "Cập nhật" : "Tạo mới"}
        onCancel={() => setLocation("/plot-distribution")}
      />
    </AdminLayout>
  );
};
export default PlotCreatePage;
