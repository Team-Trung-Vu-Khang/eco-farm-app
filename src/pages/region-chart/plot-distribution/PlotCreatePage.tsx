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
import { MapContainer, TileLayer, Rectangle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, ChevronLeft } from "lucide-react";

import {
  MOCK_REGIONS,
  MOCK_AREAS,
  MOCK_PLOTS,
  type Plot,
  ENTERPRISES,
} from "../constants";
import {
  DraggableRectangle,
  MapController,
} from "../components/DraggableRectangle";

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

  const defaultBounds = L.latLngBounds([11.53, 106.88], [11.55, 106.91]);
  const [currentBounds, setCurrentBounds] =
    useState<L.LatLngBounds>(defaultBounds);
  const [areaBounds, setAreaBounds] = useState<L.LatLngBounds | null>(null);

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

        if (plot.coordinates && plot.coordinates.length >= 2) {
          const lats = plot.coordinates.map((c) => c.lat);
          const lngs = plot.coordinates.map((c) => c.lng);
          setCurrentBounds(
            L.latLngBounds(
              [Math.min(...lats), Math.min(...lngs)],
              [Math.max(...lats), Math.max(...lngs)],
            ),
          );
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
        const lats = area.coordinates.map((c) => c.lat);
        const lngs = area.coordinates.map((c) => c.lng);
        const bounds = L.latLngBounds(
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        );
        setAreaBounds(bounds);

        // If creating new, default plot bounds to center of area
        // If Edit mode, we Only reset if we haven't loaded coords yet OR if user explicitly changed area (which implies New location)
        // This is tricky.
        // Simple heuristic: If formData has no coordinates, use area center.
        if (!formData.coordinates || formData.coordinates.length === 0) {
          const center = bounds.getCenter();
          const size = 0.002;
          setCurrentBounds(
            L.latLngBounds(
              [center.lat - size / 2, center.lng - size / 2],
              [center.lat + size / 2, center.lng + size / 2],
            ),
          );
        }
      }
    }
  }, [selectedAreaId]);

  const handleSubmit = () => {
    // Process coordinates
    const sw = currentBounds.getSouthWest();
    const ne = currentBounds.getNorthEast();
    const nw = L.latLng(ne.lat, sw.lng);
    const se = L.latLng(sw.lat, ne.lng);

    const coords = [
      { lat: sw.lat, lng: sw.lng },
      { lat: nw.lat, lng: nw.lng },
      { lat: ne.lat, lng: ne.lng },
      { lat: se.lat, lng: se.lng },
    ];

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
        <Card>
          <CardHeader>
            <CardTitle>Định vị lô đất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg border overflow-hidden relative">
              <MapContainer
                center={[
                  currentBounds.getCenter().lat,
                  currentBounds.getCenter().lng,
                ]}
                zoom={16}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {areaBounds && (
                  <Rectangle
                    bounds={areaBounds}
                    pathOptions={{
                      color: "blue",
                      fill: false,
                      dashArray: "5, 5",
                    }}
                  />
                )}
                <DraggableRectangle
                  bounds={currentBounds}
                  setBounds={setCurrentBounds}
                  color="orange"
                />
                <MapController
                  center={[
                    currentBounds.getCenter().lat,
                    currentBounds.getCenter().lng,
                  ]}
                />
              </MapContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
              {/* Point 1: SW */}
              <div className="space-y-2">
                <Label>Góc Tây Nam (SW)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lat"
                    value={currentBounds.getSouth()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val))
                        setCurrentBounds(
                          L.latLngBounds(
                            [val, currentBounds.getWest()],
                            currentBounds.getNorthEast(),
                          ),
                        );
                    }}
                  />
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lng"
                    value={currentBounds.getWest()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val))
                        setCurrentBounds(
                          L.latLngBounds(
                            [currentBounds.getSouth(), val],
                            currentBounds.getNorthEast(),
                          ),
                        );
                    }}
                  />
                </div>
              </div>

              {/* Point 2: NW */}
              <div className="space-y-2">
                <Label>Góc Tây Bắc (NW)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lat"
                    value={currentBounds.getNorth()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val))
                        setCurrentBounds(
                          L.latLngBounds(currentBounds.getSouthWest(), [
                            val,
                            currentBounds.getEast(),
                          ]),
                        );
                    }}
                  />
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lng"
                    value={currentBounds.getWest()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val))
                        setCurrentBounds(
                          L.latLngBounds(
                            [currentBounds.getSouth(), val],
                            currentBounds.getNorthEast(),
                          ),
                        );
                    }}
                  />
                </div>
              </div>

              {/* Point 3: NE */}
              <div className="space-y-2">
                <Label>Góc Đông Bắc (NE)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lat"
                    value={currentBounds.getNorth()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val))
                        setCurrentBounds(
                          L.latLngBounds(currentBounds.getSouthWest(), [
                            val,
                            currentBounds.getEast(),
                          ]),
                        );
                    }}
                  />
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lng"
                    value={currentBounds.getEast()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val))
                        setCurrentBounds(
                          L.latLngBounds(currentBounds.getSouthWest(), [
                            currentBounds.getNorth(),
                            val,
                          ]),
                        );
                    }}
                  />
                </div>
              </div>

              {/* Point 4: SE */}
              <div className="space-y-2">
                <Label>Góc Đông Nam (SE)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lat"
                    value={currentBounds.getSouth()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val))
                        setCurrentBounds(
                          L.latLngBounds(
                            [val, currentBounds.getWest()],
                            currentBounds.getNorthEast(),
                          ),
                        );
                    }}
                  />
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lng"
                    value={currentBounds.getEast()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val))
                        setCurrentBounds(
                          L.latLngBounds(currentBounds.getSouthWest(), [
                            currentBounds.getNorth(),
                            val,
                          ]),
                        );
                    }}
                  />
                </div>
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
