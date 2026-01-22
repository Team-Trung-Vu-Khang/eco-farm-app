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
import { ChevronLeft, Check, Plus, Trash2, Edit } from "lucide-react";

import {
  MOCK_REGIONS,
  MOCK_AREAS,
  type Area,
  type Plot,
  LAND_TYPES,
  TERRAIN_TYPES,
} from "../constants";
import {
  DraggableRectangle,
  MapController,
} from "../components/DraggableRectangle";

const AreaCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/area-distribution/edit/:id");
  const isEditMode = match && !!params?.id;

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

  const defaultBounds = L.latLngBounds([11.53, 106.88], [11.55, 106.91]);
  const [currentBounds, setCurrentBounds] =
    useState<L.LatLngBounds>(defaultBounds);

  // Plot Editing
  const [plotBounds, setPlotBounds] = useState<L.LatLngBounds>(defaultBounds);
  const [editingPlot, setEditingPlot] = useState<Partial<Plot> | null>(null);

  useEffect(() => {
    if (isEditMode && params?.id) {
      const id = parseInt(params.id);
      const found = MOCK_AREAS.find((a) => a.id === id);
      if (found) {
        setFormData(found);
        setSelectedRegionId(found.regionId);
        if (found.coordinates && found.coordinates.length >= 2) {
          const lats = found.coordinates.map((c) => c.lat);
          const lngs = found.coordinates.map((c) => c.lng);
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

  // When region changes, update bounds and auto-fill details
  useEffect(() => {
    if (selectedRegionId) {
      const region = MOCK_REGIONS.find((r) => r.id === selectedRegionId);
      if (region) {
        setFormData((prev) => ({
          ...prev,
          regionId: region.id,
          landType: region.landType,
          terrain: region.terrain,
        }));

        // Update map bounds to region's bounds if available
        if (region.coordinates && region.coordinates.length >= 2) {
          const lats = region.coordinates.map((c) => c.lat);
          const lngs = region.coordinates.map((c) => c.lng);
          setCurrentBounds(
            L.latLngBounds(
              [Math.min(...lats), Math.min(...lngs)],
              [Math.max(...lats), Math.max(...lngs)],
            ),
          );
        }
      }
    }
  }, [selectedRegionId]);

  const handleSubmit = () => {
    // Convert bounds to coords
    const sw = currentBounds.getSouthWest();
    const ne = currentBounds.getNorthEast();
    const nw = L.latLng(ne.lat, sw.lng);
    const se = L.latLng(sw.lat, ne.lng);

    const newCoords = [
      { lat: sw.lat, lng: sw.lng },
      { lat: nw.lat, lng: nw.lng },
      { lat: ne.lat, lng: ne.lng },
      { lat: se.lat, lng: se.lng },
    ];

    console.log("Submitting Area:", { ...formData, coordinates: newCoords });
    toast({
      title: "Thành công",
      description: isEditMode
        ? "Cập nhật khu vực thành công"
        : "Tạo khu vực mới thành công",
    });
    setLocation("/area-distribution");
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
    setPlotBounds(currentBounds);
  };

  const savePlot = () => {
    if (!editingPlot) return;
    const sw = plotBounds.getSouthWest();
    const ne = plotBounds.getNorthEast();
    const nw = L.latLng(ne.lat, sw.lng);
    const se = L.latLng(sw.lat, ne.lng);

    const fullCoords = [
      { lat: sw.lat, lng: sw.lng },
      { lat: nw.lat, lng: nw.lng },
      { lat: ne.lat, lng: ne.lng },
      { lat: se.lat, lng: se.lng },
    ];

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-1">
                {MOCK_REGIONS.map((region) => (
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
              </div>
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
                <Label>Loại đất (Tự động)</Label>
                <Input
                  readOnly
                  disabled
                  value={
                    LAND_TYPES.find((l) => l.id === formData.landType)?.name ||
                    formData.landType ||
                    ""
                  }
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Địa hình (Tự động)</Label>
                <Input
                  readOnly
                  disabled
                  value={
                    TERRAIN_TYPES.find((t) => t.id === formData.terrain)
                      ?.name ||
                    formData.terrain ||
                    ""
                  }
                  className="bg-muted"
                />
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
        <Card>
          <CardHeader>
            <CardTitle>Định vị khu vực trên bản đồ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg border overflow-hidden relative">
              <MapContainer
                center={[
                  currentBounds.getCenter().lat,
                  currentBounds.getCenter().lng,
                ]}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableRectangle
                  bounds={currentBounds}
                  setBounds={setCurrentBounds}
                  color="blue"
                />
                <MapController
                  center={[
                    currentBounds.getCenter().lat,
                    currentBounds.getCenter().lng,
                  ]}
                />
              </MapContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Kéo thả khung hình chữ nhật màu xanh để xác định vị trí của khu
              vực này trong vùng trồng.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
              {/* Point 1: SW */}
              <div className="space-y-2">
                <Label>Góc Tây Nam (SW)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    step="0.000001"
                    value={currentBounds.getSouth()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setCurrentBounds(
                          L.latLngBounds(
                            [val, currentBounds.getWest()],
                            currentBounds.getNorthEast(),
                          ),
                        );
                      }
                    }}
                    placeholder="Lat"
                  />
                  <Input
                    type="number"
                    step="0.000001"
                    value={currentBounds.getWest()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setCurrentBounds(
                          L.latLngBounds(
                            [currentBounds.getSouth(), val],
                            currentBounds.getNorthEast(),
                          ),
                        );
                      }
                    }}
                    placeholder="Lng"
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
                    value={currentBounds.getNorth()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setCurrentBounds(
                          L.latLngBounds(currentBounds.getSouthWest(), [
                            val,
                            currentBounds.getEast(),
                          ]),
                        );
                      }
                    }}
                    placeholder="Lat"
                  />
                  <Input
                    type="number"
                    step="0.000001"
                    value={currentBounds.getWest()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setCurrentBounds(
                          L.latLngBounds(
                            [currentBounds.getSouth(), val],
                            currentBounds.getNorthEast(),
                          ),
                        );
                      }
                    }}
                    placeholder="Lng"
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
                    value={currentBounds.getNorth()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setCurrentBounds(
                          L.latLngBounds(currentBounds.getSouthWest(), [
                            val,
                            currentBounds.getEast(),
                          ]),
                        );
                      }
                    }}
                    placeholder="Lat"
                  />
                  <Input
                    type="number"
                    step="0.000001"
                    value={currentBounds.getEast()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setCurrentBounds(
                          L.latLngBounds(currentBounds.getSouthWest(), [
                            currentBounds.getNorth(),
                            val,
                          ]),
                        );
                      }
                    }}
                    placeholder="Lng"
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
                    value={currentBounds.getSouth()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setCurrentBounds(
                          L.latLngBounds(
                            [val, currentBounds.getWest()],
                            currentBounds.getNorthEast(),
                          ),
                        );
                      }
                    }}
                    placeholder="Lat"
                  />
                  <Input
                    type="number"
                    step="0.000001"
                    value={currentBounds.getEast()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setCurrentBounds(
                          L.latLngBounds(currentBounds.getSouthWest(), [
                            currentBounds.getNorth(),
                            val,
                          ]),
                        );
                      }
                    }}
                    placeholder="Lng"
                  />
                </div>
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
                    currentBounds.getCenter().lat,
                    currentBounds.getCenter().lng,
                  ]}
                  zoom={15}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* Area Boundary */}
                  <Rectangle
                    bounds={currentBounds}
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
                    if (!plot.coordinates || plot.coordinates.length < 2)
                      return null;

                    const lats = plot.coordinates.map((c) => c.lat);
                    const lngs = plot.coordinates.map((c) => c.lng);
                    const b = [
                      [Math.min(...lats), Math.min(...lngs)],
                      [Math.max(...lats), Math.max(...lngs)],
                    ];
                    return (
                      <Rectangle
                        key={plot.id}
                        bounds={b as any}
                        pathOptions={{ color: "orange", weight: 2 }}
                      />
                    );
                  })}

                  {/* Editing Plot */}
                  {editingPlot && (
                    <DraggableRectangle
                      bounds={plotBounds}
                      setBounds={setPlotBounds}
                      color="orange"
                    />
                  )}
                  <MapController
                    center={[
                      currentBounds.getCenter().lat,
                      currentBounds.getCenter().lng,
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
                        />
                      </div>
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
                          placeholder="VD: 150"
                        />
                      </div>

                      <div className="space-y-3 pt-2 border-t">
                        <Label>Tọa độ (4 góc)</Label>
                        <div className="grid grid-cols-1 gap-3">
                          {/* SW */}
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground font-semibold">
                              Tây Nam (SW)
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="Lat"
                                value={plotBounds.getSouth()}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val))
                                    setPlotBounds(
                                      L.latLngBounds(
                                        [val, plotBounds.getWest()],
                                        plotBounds.getNorthEast(),
                                      ),
                                    );
                                }}
                              />
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="Lng"
                                value={plotBounds.getWest()}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val))
                                    setPlotBounds(
                                      L.latLngBounds(
                                        [plotBounds.getSouth(), val],
                                        plotBounds.getNorthEast(),
                                      ),
                                    );
                                }}
                              />
                            </div>
                          </div>

                          {/* NW */}
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground font-semibold">
                              Tây Bắc (NW)
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="Lat"
                                value={plotBounds.getNorth()}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val))
                                    setPlotBounds(
                                      L.latLngBounds(
                                        plotBounds.getSouthWest(),
                                        [val, plotBounds.getEast()],
                                      ),
                                    );
                                }}
                              />
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="Lng"
                                value={plotBounds.getWest()}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val))
                                    setPlotBounds(
                                      L.latLngBounds(
                                        [plotBounds.getSouth(), val],
                                        plotBounds.getNorthEast(),
                                      ),
                                    );
                                }}
                              />
                            </div>
                          </div>

                          {/* NE */}
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground font-semibold">
                              Đông Bắc (NE)
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="Lat"
                                value={plotBounds.getNorth()}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val))
                                    setPlotBounds(
                                      L.latLngBounds(
                                        plotBounds.getSouthWest(),
                                        [val, plotBounds.getEast()],
                                      ),
                                    );
                                }}
                              />
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="Lng"
                                value={plotBounds.getEast()}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val))
                                    setPlotBounds(
                                      L.latLngBounds(
                                        plotBounds.getSouthWest(),
                                        [plotBounds.getNorth(), val],
                                      ),
                                    );
                                }}
                              />
                            </div>
                          </div>

                          {/* SE */}
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground font-semibold">
                              Đông Nam (SE)
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="Lat"
                                value={plotBounds.getSouth()}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val))
                                    setPlotBounds(
                                      L.latLngBounds(
                                        [val, plotBounds.getWest()],
                                        plotBounds.getNorthEast(),
                                      ),
                                    );
                                }}
                              />
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="Lng"
                                value={plotBounds.getEast()}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val))
                                    setPlotBounds(
                                      L.latLngBounds(
                                        plotBounds.getSouthWest(),
                                        [plotBounds.getNorth(), val],
                                      ),
                                    );
                                }}
                              />
                            </div>
                          </div>
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
                  <div className="flex flex-col h-full gap-4">
                    <Button onClick={addPlot} className="w-full">
                      <Plus className="w-4 h-4 mr-2" /> Thêm lô mới
                    </Button>

                    {!formData.plots || formData.plots.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10 p-4 text-center">
                        <p>Danh sách trống.</p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {formData.plots.map((plot) => (
                          <div
                            key={plot.id}
                            className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors flex flex-col gap-2 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                <span className="font-medium">{plot.name}</span>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    setEditingPlot(plot);
                                    if (
                                      plot.coordinates &&
                                      plot.coordinates.length >= 2
                                    ) {
                                      const lats = plot.coordinates.map(
                                        (c) => c.lat,
                                      );
                                      const lngs = plot.coordinates.map(
                                        (c) => c.lng,
                                      );
                                      setPlotBounds(
                                        L.latLngBounds(
                                          [
                                            Math.min(...lats),
                                            Math.min(...lngs),
                                          ],
                                          [
                                            Math.max(...lats),
                                            Math.max(...lngs),
                                          ],
                                        ),
                                      );
                                    }
                                  }}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  onClick={() => removePlot(plot.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span>DT: {plot.area} ha</span>
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
                  {MOCK_REGIONS.find((r) => r.id === selectedRegionId)?.name ||
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
