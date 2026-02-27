import React, { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Combobox,
  type ComboboxOption,
} from "@tankhang1/eco-shared-ui";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronLeft, Plus, Trash2, Edit, X } from "lucide-react";

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

import { type SubArea as Area, type Plot } from "../constants";
import { MapController } from "../components/DraggableRectangle";
import useRegionStore from "../../../stores/useRegionStore";
import useTerrainStore from "@/stores/useTerrainStore";
import useLandStore from "@/stores/useLandStore";

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

const AreaCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/area-distribution/edit/:id");
  const isEditMode = match && !!params?.id;
  const { lands } = useLandStore();
  const { terrains } = useTerrainStore();
  // States
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Area>>({
    code: "",
    name: "",
    area: 0,
    landType: "",
    terrain: "",
    status: "active",
    plots: [],
  });

  const [areaPoints, setAreaPoints] = useState<L.LatLng[]>([
    L.latLng(11.53, 106.88),
    L.latLng(11.55, 106.91),
    L.latLng(11.53, 106.91),
  ]);

  // Plot Editing
  const [plotPoints, setPlotPoints] = useState<L.LatLng[]>([]);
  const [editingPlot, setEditingPlot] = useState<Partial<Plot> | null>(null);

  const { regions, upsertSubArea, getAreaById } = useRegionStore();

  const currentRegion = React.useMemo(() => {
    return regions.find((r) => r.id === selectedRegionId);
  }, [regions, selectedRegionId]);

  const regionOptions: ComboboxOption[] = React.useMemo(() => {
    return regions.map((region) => ({
      label: region.name,
      value: region.id?.toString(),
    }));
  }, [regions]);

  useEffect(() => {
    if (isEditMode && params?.id) {
      const found = getAreaById(String(params.id));
      if (found) {
        setFormData(found);
        setSelectedRegionId(found.regionId);
        if (found.coordinates && found.coordinates.length >= 3) {
          setAreaPoints(
            found.coordinates.map((c: any) => L.latLng(c.lat, c.lng)),
          );
        }
      }
    }
  }, [isEditMode, params?.id, getAreaById]);

  // When region changes, update bounds and auto-fill details
  useEffect(() => {
    if (selectedRegionId) {
      const region = regions.find((r) => r.id === selectedRegionId);
      if (region) {
        setFormData((prev) => ({
          ...prev,
          regionId: region.id,
          landType: region.landType,
          terrain: region.terrain,
        }));

        // If creating new area and region has coords, use region center
        if (
          !isEditMode &&
          region.coordinates &&
          region.coordinates.length > 0
        ) {
          const points = region.coordinates.map((c: any) =>
            L.latLng(c.lat, c.lng),
          );
          const center = L.latLngBounds(points).getCenter();
          // Default triangle at center
          setAreaPoints([
            L.latLng(center.lat - 0.005, center.lng - 0.005),
            L.latLng(center.lat + 0.005, center.lng),
            L.latLng(center.lat - 0.005, center.lng + 0.005),
          ]);
        }
      }
    }
  }, [selectedRegionId, regions, isEditMode]);

  // --- Handlers ---

  const handlePointDrag = (index: number, latlng: L.LatLng) => {
    const newPoints = [...areaPoints];
    newPoints[index] = latlng;
    setAreaPoints(newPoints);
  };

  const handleMapClick = (latlng: L.LatLng) => {
    setAreaPoints([...areaPoints, latlng]);
  };

  const removePoint = (index: number) => {
    if (areaPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Khu vực cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    const newPoints = areaPoints.filter((_, i) => i !== index);
    setAreaPoints(newPoints);
  };

  const handlePointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const newPoints = [...areaPoints];
    const currentPoint = newPoints[index];
    newPoints[index] = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setAreaPoints(newPoints);
  };

  const handleAddPoint = () => {
    const center = getBoundsFromPoints(areaPoints).getCenter();
    setAreaPoints([
      ...areaPoints,
      L.latLng(center.lat + 0.002, center.lng + 0.002),
    ]);
  };

  const handleSubmit = () => {
    if (areaPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Khu vực cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRegionId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn vùng trồng",
        variant: "destructive",
      });
      return;
    }

    const areaData: Omit<Area, "id"> = {
      code: formData.code || "",
      name: formData.name || "",
      regionId: selectedRegionId,
      area: formData.area || 0,
      landType: formData.landType || "",
      terrain: formData.terrain || "",
      status: (formData.status as "active" | "inactive") || "active",
      plots: (formData.plots as Plot[]) || [],
      coordinates: areaPoints.map((p) => ({ lat: p.lat, lng: p.lng })),
      createdAt:
        isEditMode && formData.createdAt
          ? formData.createdAt
          : new Date().toISOString(),
    };

    let finalAreaId =
      isEditMode && params?.id
        ? String(params.id)
        : `sub-${selectedRegionId}-${Date.now()}`;

    // Upsert only the current area to the selected region in Region Store
    upsertSubArea(selectedRegionId, {
      ...areaData,
      id: finalAreaId,
    });

    toast({
      title: "Thành công",
      description: isEditMode
        ? "Cập nhật khu vực thành công"
        : "Tạo khu vực mới thành công",
    });
    setLocation("/area-distribution");
  };

  const handlePlotPointDrag = (index: number, latlng: L.LatLng) => {
    const newPoints = [...plotPoints];
    newPoints[index] = latlng;
    setPlotPoints(newPoints);
  };

  const handlePlotMapClick = (latlng: L.LatLng) => {
    if (editingPlot) {
      setPlotPoints([...plotPoints, latlng]);
    }
  };

  const handleAddPlotPoint = () => {
    const center = getBoundsFromPoints(plotPoints).getCenter();
    setPlotPoints([
      ...plotPoints,
      L.latLng(center.lat + 0.002, center.lng + 0.002),
    ]);
  };

  const removePlotPoint = (index: number) => {
    if (plotPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Lô cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    const newPoints = plotPoints.filter((_, i) => i !== index);
    setPlotPoints(newPoints);
  };

  const handlePlotPointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const newPoints = [...plotPoints];
    const currentPoint = newPoints[index];
    newPoints[index] = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setPlotPoints(newPoints);
  };

  const addPlot = () => {
    const newPlot: Plot = {
      id: `plot-${Date.now()}`,
      name: "Lô mới",
      area: 0,
      coordinates: [],
      contour: "",
      altitude: 0,
    };
    setEditingPlot(newPlot);
    const center = getBoundsFromPoints(areaPoints).getCenter();
    setPlotPoints([
      L.latLng(center.lat - 0.002, center.lng - 0.002),
      L.latLng(center.lat + 0.002, center.lng - 0.002),
      L.latLng(center.lat + 0.002, center.lng + 0.002),
      L.latLng(center.lat - 0.002, center.lng + 0.002),
    ]);
  };

  const savePlot = () => {
    if (!editingPlot) return;

    if (plotPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Lô cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }

    const fullCoords = plotPoints.map((p) => ({ lat: p.lat, lng: p.lng }));

    const updatedPlot = { ...editingPlot, coordinates: fullCoords } as Plot;

    const currentPlots = formData.plots || [];
    const index = currentPlots.findIndex((p) => p.id === updatedPlot.id);
    let newPlots;

    if (index >= 0) {
      newPlots = [...currentPlots];
      newPlots[index] = updatedPlot;
    } else {
      newPlots = [...currentPlots, updatedPlot];
    }

    setFormData({ ...formData, plots: newPlots });
    setEditingPlot(null);
  };

  const removePlot = (id: string) => {
    setFormData({
      ...formData,
      plots: (formData.plots || []).filter((p) => p.id !== id),
    });
  };

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Chọn vùng và thông tin cơ bản",
      isValid: !!selectedRegionId && !!formData.code && !!formData.name,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khu vực</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>
                Chọn vùng trồng <span className="text-red-500">*</span>
              </Label>

              <Combobox
                options={regionOptions}
                placeholder="Chọn vùng trồng"
                value={selectedRegionId?.toString() ?? ""}
                onChange={(value) => setSelectedRegionId(Number(value))}
              />

              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-1">
                {regions.map((region) => (
                  <div
                    key={region.id}
                    onClick={() => setSelectedRegionId(region.id)}
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
                      {region.area} ha
                    </p>
                  </div>
                ))}
              </div> */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Mã khu vực <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: KHU-A"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Tên khu vực <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Tên khu vực"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Diện tích (ha)</Label>
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
                <Label>Loại đất</Label>
                <Select
                  value={formData.landType || ""}
                  onValueChange={(v) =>
                    setFormData({ ...formData, landType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại đất" />
                  </SelectTrigger>
                  <SelectContent>
                    {lands.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Địa hình</Label>
                <Select
                  value={formData.terrain || ""}
                  onValueChange={(v) =>
                    setFormData({ ...formData, terrain: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn địa hình" />
                  </SelectTrigger>
                  <SelectContent>
                    {terrains.map((t) => (
                      <SelectItem key={t.code} value={t.code}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "map",
      title: "Bản đồ khu vực",
      description: "Xác định vị trí khu vực",
      content: (
        <Card className="h-[750px] flex flex-col">
          <CardHeader>
            <CardTitle>Định vị khu vực trên bản đồ</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden flex gap-4">
            <div className="flex-1 h-full rounded-lg border overflow-hidden relative">
              <MapContainer
                center={[
                  getBoundsFromPoints(areaPoints).getCenter().lat,
                  getBoundsFromPoints(areaPoints).getCenter().lng,
                ]}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler onClick={handleMapClick} />

                {/* Region Boundary */}
                {selectedRegionId && (
                  <Polygon
                    positions={
                      regions
                        .find((r) => r.id === selectedRegionId)
                        ?.coordinates.map((c: any) => [c.lat, c.lng]) || []
                    }
                    pathOptions={{
                      color: "green",
                      fill: false,
                      dashArray: "5, 5",
                      weight: 2,
                    }}
                  />
                )}

                {/* Existing Areas from Region Store (Read-only) */}
                {currentRegion?.subAreas
                  .filter((a) => !isEditMode || a.id !== String(params?.id))
                  .map((area) => (
                    <Polygon
                      key={`existing-${area.id}`}
                      positions={area.coordinates.map((c: any) => [
                        c.lat,
                        c.lng,
                      ])}
                      pathOptions={{
                        color: "gray",
                        fillColor: "gray",
                        fillOpacity: 0.1,
                        weight: 1,
                      }}
                    >
                      <Tooltip sticky direction="top">
                        {area.name} (Sẵn có)
                      </Tooltip>
                    </Polygon>
                  ))}

                <Polygon
                  positions={areaPoints}
                  pathOptions={{ color: "blue", fillOpacity: 0.1 }}
                />

                {areaPoints.map((point, idx) => (
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
                    getBoundsFromPoints(areaPoints).getCenter().lat,
                    getBoundsFromPoints(areaPoints).getCenter().lng,
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
                {areaPoints.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-2 bg-white rounded border text-xs relative"
                  >
                    <div className="absolute top-2 right-2 flex gap-1">
                      {areaPoints.length > 3 && (
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
      id: "plots",
      title: "Phân chia lô",
      description: "Tạo các lô trong khu vực",
      content: (
        <Card className="h-[750px] flex flex-col">
          <CardHeader>
            <CardTitle>Danh sách lô ({formData.plots?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              <div className="lg:col-span-3 h-full rounded-lg border overflow-hidden relative">
                <MapContainer
                  center={[
                    getBoundsFromPoints(areaPoints).getCenter().lat,
                    getBoundsFromPoints(areaPoints).getCenter().lng,
                  ]}
                  zoom={14}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapClickHandler onClick={handlePlotMapClick} />

                  {/* Area Boundary */}
                  <Polygon
                    positions={areaPoints}
                    pathOptions={{
                      color: "blue",
                      fill: false,
                      dashArray: "5, 5",
                    }}
                  />

                  {/* Existing Plots */}
                  {formData.plots?.map((plot) => {
                    // Hide if currently editing
                    if (editingPlot && plot.id === editingPlot.id) return null;
                    if (!plot.coordinates || plot.coordinates.length < 3)
                      return null;

                    const positions = plot.coordinates.map((c) => [
                      c.lat,
                      c.lng,
                    ]);

                    return (
                      <Polygon
                        key={plot.id}
                        positions={positions as any}
                        pathOptions={{ color: "orange", weight: 2 }}
                        eventHandlers={{
                          click: () => {
                            setEditingPlot(plot);
                            if (
                              plot.coordinates &&
                              plot.coordinates.length >= 3
                            ) {
                              setPlotPoints(
                                plot.coordinates.map((c) =>
                                  L.latLng(c.lat, c.lng),
                                ),
                              );
                            }
                          },
                        }}
                      />
                    );
                  })}

                  {/* Editing Plot */}
                  {editingPlot && (
                    <>
                      <Polygon
                        positions={plotPoints}
                        pathOptions={{
                          color: "orange",
                          weight: 2,
                          fillOpacity: 0.2,
                        }}
                      />
                      {plotPoints.map((point, idx) => (
                        <Marker
                          key={`plot-point-${idx}`}
                          position={point}
                          draggable={true}
                          icon={customIcon}
                          eventHandlers={{
                            drag: (e) => {
                              handlePlotPointDrag(idx, e.target.getLatLng());
                            },
                          }}
                        />
                      ))}
                    </>
                  )}
                  <MapController
                    center={[
                      getBoundsFromPoints(areaPoints).getCenter().lat,
                      getBoundsFromPoints(areaPoints).getCenter().lng,
                    ]}
                  />
                </MapContainer>
              </div>

              <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
                {editingPlot ? (
                  // EDIT MODE
                  <div className="flex flex-col h-full gap-4 overflow-y-auto pr-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-semibold">
                        {editingPlot.id?.startsWith("plot-")
                          ? "Thêm lô mới"
                          : "Chỉnh sửa lô"}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPlot(null)}
                      >
                        Hủy
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label>Tên lô</Label>
                        <Input
                          value={editingPlot.name || ""}
                          onChange={(e) =>
                            setEditingPlot({
                              ...editingPlot,
                              name: e.target.value,
                            })
                          }
                          placeholder="Nhập tên lô..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>Diện tích (ha)</Label>
                          <Input
                            type="number"
                            value={editingPlot.area || ""}
                            onChange={(e) =>
                              setEditingPlot({
                                ...editingPlot,
                                area: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Độ cao (m)</Label>
                          <Input
                            type="number"
                            value={editingPlot.altitude || ""}
                            onChange={(e) =>
                              setEditingPlot({
                                ...editingPlot,
                                altitude: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label>Đường đồng mức</Label>
                        <Input
                          value={editingPlot.contour || ""}
                          onChange={(e) =>
                            setEditingPlot({
                              ...editingPlot,
                              contour: e.target.value,
                            })
                          }
                          placeholder="VD: 100m"
                        />
                      </div>

                      <div className="w-full flex flex-col bg-slate-50 border rounded-lg overflow-hidden mt-2">
                        <div className="p-3 border-b bg-white">
                          <h4 className="font-semibold text-sm">
                            Danh sách toạ độ
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Kéo thả điểm hoặc click bản đồ để thêm.
                          </p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[300px]">
                          {plotPoints.map((p, i) => (
                            <div
                              key={i}
                              className="flex flex-col gap-2 p-2 bg-white rounded border text-xs relative"
                            >
                              <div className="absolute top-2 right-2 flex gap-1">
                                {plotPoints.length > 3 && (
                                  <button
                                    onClick={() => removePlotPoint(i)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              <span className="font-semibold">
                                Điểm {i + 1}
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-gray-500">
                                    Lat
                                  </label>
                                  <input
                                    className="w-full border rounded px-1 py-0.5"
                                    type="number"
                                    value={p.lat}
                                    onChange={(e) =>
                                      handlePlotPointInputChange(
                                        i,
                                        "lat",
                                        e.target.value,
                                      )
                                    }
                                    step="0.0001"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-500">
                                    Lng
                                  </label>
                                  <input
                                    className="w-full border rounded px-1 py-0.5"
                                    type="number"
                                    value={p.lng}
                                    onChange={(e) =>
                                      handlePlotPointInputChange(
                                        i,
                                        "lng",
                                        e.target.value,
                                      )
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
                            onClick={handleAddPlotPoint}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Thêm điểm
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t flex gap-3">
                      <Button className="flex-1" onClick={savePlot}>
                        Lưu lô
                      </Button>
                    </div>
                  </div>
                ) : (
                  // LIST MODE
                  <div className="flex flex-col h-full bg-slate-50 border rounded-lg">
                    <div className="flex items-center justify-between p-3 border-b bg-white">
                      <h4 className="font-semibold text-sm">Danh sách lô</h4>
                      <Button size="sm" onClick={addPlot}>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm lô mới
                      </Button>
                    </div>

                    {!formData.plots || formData.plots.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                        <p>Danh sách trống.</p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-3 p-3">
                        {formData.plots.map((plot) => (
                          <div
                            key={plot.id}
                            className="bg-white p-3 border rounded-lg hover:border-orange-300 transition-colors shadow-sm group"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                <span className="font-medium">{plot.name}</span>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setEditingPlot(plot);
                                    if (
                                      plot.coordinates &&
                                      plot.coordinates.length >= 3
                                    ) {
                                      setPlotPoints(
                                        plot.coordinates.map((c) =>
                                          L.latLng(c.lat, c.lng),
                                        ),
                                      );
                                    }
                                  }}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removePlot(plot.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                              <span>DT: {plot.area} ha</span>
                              <span>Độ cao: {plot.altitude}m</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại thông tin",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Xác nhận thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Vùng trồng:</Label>
                <div className="font-medium">
                  {regions.find((r) => r.id === selectedRegionId)?.name ||
                    "Chưa chọn"}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Tên khu vực:</Label>
                <div className="font-medium">{formData.name}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Diện tích:</Label>
                <div className="font-medium">{formData.area} ha</div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Số lượng lô:</Label>
                <div className="font-medium">
                  {formData.plots?.length || 0} lô
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <AdminLayout
      title={isEditMode ? "Cập nhật khu vực" : "Thêm mới khu vực"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin khu vực"
          : "Tạo khu vực mới theo quy trình từng bước"
      }
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/area-distribution")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <div className="max-w-5xl mx-auto pb-10">
        <StepperForm
          steps={steps}
          onComplete={handleSubmit}
          onCancel={() => setLocation("/area-distribution")}
          completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo khu vực"}
        />
      </div>
    </AdminLayout>
  );
};

export default AreaCreatePage;
