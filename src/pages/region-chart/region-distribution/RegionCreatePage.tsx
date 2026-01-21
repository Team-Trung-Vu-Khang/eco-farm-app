import { useState } from "react";
import { useLocation } from "wouter";
import {
  AdminLayout,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StepperForm,
  type Step,
  Button,
} from "@tankhang1/eco-shared-ui";
import { MapContainer, TileLayer, Rectangle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Plus, Edit, Trash2, ChevronLeft } from "lucide-react";

import {
  type Region,
  type SubArea,
  PROVINCES,
  DISTRICTS,
  ENTERPRISES,
  LAND_TYPES,
  TERRAIN_TYPES,
} from "../constants";
import {
  DraggableRectangle,
  MapController,
} from "../components/DraggableRectangle";

const RegionCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Form State
  const defaultBounds = L.latLngBounds(
    [11.53, 106.88], // SW
    [11.55, 106.91], // NE
  );

  const [formData, setFormData] = useState<Partial<Region>>({
    code: "",
    name: "",
    status: "active",
    subAreas: [],
    coordinates: [],
    provinceId: "",
    districtId: "",
    address: "",
    enterpriseId: "",
    area: 0,
    landType: "",
    terrain: "",
    note: "",
  });

  const [currentBounds, setCurrentBounds] =
    useState<L.LatLngBounds>(defaultBounds);

  // Sub-area State
  const [editingSubArea, setEditingSubArea] = useState<Partial<SubArea> | null>(
    null,
  );
  const [subAreaBounds, setSubAreaBounds] =
    useState<L.LatLngBounds>(defaultBounds);

  // --- Handlers ---

  const handleSubmit = () => {
    // Save map bounds to coordinates if not already saved or updated
    // For simplicity, we recalculate here just to be safe
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

    const finalData = {
      ...formData,
      coordinates: newCoords,
      createdAt: new Date().toISOString(),
    };

    console.log("Submitting:", finalData);
    toast({
      title: "Thành công",
      description: "Đã tạo mới vùng trồng thành công",
    });
    setLocation("/region-distribution");
  };

  const addSubArea = () => {
    const newSub: SubArea = {
      id: `sub-${Date.now()}`,
      name: "Khu vực mới",
      area: 0,
      landType: "",
      coordinates: [],
    };
    setEditingSubArea(newSub);
    setSubAreaBounds(currentBounds);
  };

  const saveSubArea = () => {
    if (!editingSubArea) return;

    const sw = subAreaBounds.getSouthWest();
    const ne = subAreaBounds.getNorthEast();
    const nw = L.latLng(ne.lat, sw.lng);
    const se = L.latLng(sw.lat, ne.lng);
    const fullCoords = [
      { lat: sw.lat, lng: sw.lng },
      { lat: nw.lat, lng: nw.lng },
      { lat: ne.lat, lng: ne.lng },
      { lat: se.lat, lng: se.lng },
    ];

    const updatedSub = {
      ...editingSubArea,
      coordinates: fullCoords,
    } as SubArea;

    const currentSubs = formData.subAreas || [];
    const index = currentSubs.findIndex((s) => s.id === updatedSub.id);

    let newSubs;
    if (index >= 0) {
      newSubs = [...currentSubs];
      newSubs[index] = updatedSub;
    } else {
      newSubs = [...currentSubs, updatedSub];
    }

    setFormData({ ...formData, subAreas: newSubs });
    setEditingSubArea(null);
  };

  const removeSubArea = (id: string) => {
    setFormData({
      ...formData,
      subAreas: (formData.subAreas || []).filter((s) => s.id !== id),
    });
  };

  // --- Render Steps ---
  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Mã, tên, địa chỉ vùng",
      isValid: !!formData.code && !!formData.name,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Mã vùng <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: REG-001"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Tên vùng <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Tên vùng trồng"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tỉnh / Thành</Label>
                <Select
                  value={formData.provinceId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, provinceId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh thành" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quận / Huyện</Label>
                <Select
                  value={formData.districtId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, districtId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Địa chỉ chi tiết</Label>
              <Input
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Số nhà, đường, thôn/xóm..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Doanh nghiệp / Nông hộ</Label>
                <Select
                  value={formData.enterpriseId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, enterpriseId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTERPRISES.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại đất</Label>
                <Select
                  value={formData.landType}
                  onValueChange={(v) =>
                    setFormData({ ...formData, landType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại đất" />
                  </SelectTrigger>
                  <SelectContent>
                    {LAND_TYPES.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Địa hình</Label>
                <Select
                  value={formData.terrain}
                  onValueChange={(v) =>
                    setFormData({ ...formData, terrain: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn địa hình" />
                  </SelectTrigger>
                  <SelectContent>
                    {TERRAIN_TYPES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.note || ""}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "map",
      title: "Bản đồ vùng trồng",
      description: "Xác định vị trí trên bản đồ",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Bản đồ vị trí</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[500px] w-full rounded-lg border overflow-hidden relative z-0">
              <MapContainer
                center={[
                  currentBounds.getCenter().lat,
                  currentBounds.getCenter().lng,
                ]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
            <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md mb-4">
              <strong>Hướng dẫn:</strong> Kéo thả các điểm đánh dấu trên bản đồ
              hoặc nhập trực tiếp toạ độ bên dưới để xác định phạm vi vùng
              trồng.
              <br />
              Toạ độ hiện tại: {currentBounds
                .getSouthWest()
                .lat.toFixed(4)}, {currentBounds.getSouthWest().lng.toFixed(4)}{" "}
              - {currentBounds.getNorthEast().lat.toFixed(4)},{" "}
              {currentBounds.getNorthEast().lng.toFixed(4)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* SW */}
              <div className="space-y-2">
                <Label>Điểm 1 (Tây Nam)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Lat"
                    value={currentBounds.getSouthWest().lat || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      const ne = currentBounds.getNorthEast();
                      const sw = currentBounds.getSouthWest();
                      setCurrentBounds(
                        L.latLngBounds(L.latLng(val, sw.lng), ne),
                      );
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Lng"
                    value={currentBounds.getSouthWest().lng || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      const ne = currentBounds.getNorthEast();
                      const sw = currentBounds.getSouthWest();
                      setCurrentBounds(
                        L.latLngBounds(L.latLng(sw.lat, val), ne),
                      );
                    }}
                  />
                </div>
              </div>

              {/* NW */}
              <div className="space-y-2">
                <Label>Điểm 2 (Tây Bắc)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Lat"
                    value={currentBounds.getNorthEast().lat || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      const sw = currentBounds.getSouthWest();
                      const ne = currentBounds.getNorthEast();
                      setCurrentBounds(
                        L.latLngBounds(sw, L.latLng(val, ne.lng)),
                      );
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Lng"
                    value={currentBounds.getSouthWest().lng || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      const sw = currentBounds.getSouthWest();
                      const ne = currentBounds.getNorthEast();
                      setCurrentBounds(
                        L.latLngBounds(L.latLng(sw.lat, val), ne),
                      );
                    }}
                  />
                </div>
              </div>

              {/* NE */}
              <div className="space-y-2">
                <Label>Điểm 3 (Đông Bắc)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Lat"
                    value={currentBounds.getNorthEast().lat || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      const sw = currentBounds.getSouthWest();
                      const ne = currentBounds.getNorthEast();
                      setCurrentBounds(
                        L.latLngBounds(sw, L.latLng(val, ne.lng)),
                      );
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Lng"
                    value={currentBounds.getNorthEast().lng || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      const sw = currentBounds.getSouthWest();
                      const ne = currentBounds.getNorthEast();
                      setCurrentBounds(
                        L.latLngBounds(sw, L.latLng(ne.lat, val)),
                      );
                    }}
                  />
                </div>
              </div>

              {/* SE */}
              <div className="space-y-2">
                <Label>Điểm 4 (Đông Nam)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Lat"
                    value={currentBounds.getSouthWest().lat || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      const ne = currentBounds.getNorthEast();
                      const sw = currentBounds.getSouthWest();
                      setCurrentBounds(
                        L.latLngBounds(L.latLng(val, sw.lng), ne),
                      );
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Lng"
                    value={currentBounds.getNorthEast().lng || 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) return;
                      const sw = currentBounds.getSouthWest();
                      const ne = currentBounds.getNorthEast();
                      setCurrentBounds(
                        L.latLngBounds(sw, L.latLng(ne.lat, val)),
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
      id: "subarea",
      title: "Phân chia khu vực",
      description: "Tạo các lô/khu vực con",
      content: (
        <Card className="h-[750px] flex flex-col">
          <CardHeader>
            <CardTitle>Phân chia khu vực con</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              <div className="lg:col-span-3 h-full rounded-lg border overflow-hidden relative">
                <MapContainer
                  center={[
                    currentBounds.getCenter().lat,
                    currentBounds.getCenter().lng,
                  ]}
                  zoom={14}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* Main Region Boundary (Static Reference) */}
                  <Rectangle
                    bounds={currentBounds}
                    pathOptions={{
                      color: "blue",
                      fill: false,
                      dashArray: "5, 5",
                    }}
                  />

                  {/* Existing Sub Areas (Static Reference) */}
                  {formData.subAreas?.map((sub) => {
                    // Don't show the one currently being edited as a static rect
                    if (editingSubArea && sub.id === editingSubArea.id)
                      return null;

                    if (!sub.coordinates || sub.coordinates.length < 2)
                      return null;
                    const lats = sub.coordinates.map((c) => c.lat);
                    const lngs = sub.coordinates.map((c) => c.lng);
                    const b = [
                      [Math.min(...lats), Math.min(...lngs)],
                      [Math.max(...lats), Math.max(...lngs)],
                    ];
                    return (
                      <Rectangle
                        key={sub.id}
                        bounds={b as any}
                        pathOptions={{ color: "green", weight: 2 }}
                        eventHandlers={{
                          click: () => {
                            // Optional: Click to edit?
                            setEditingSubArea(sub);
                            if (
                              sub.coordinates &&
                              sub.coordinates.length >= 2
                            ) {
                              const lats = sub.coordinates.map((c) => c.lat);
                              const lngs = sub.coordinates.map((c) => c.lng);
                              setSubAreaBounds(
                                L.latLngBounds(
                                  [Math.min(...lats), Math.min(...lngs)],
                                  [Math.max(...lats), Math.max(...lngs)],
                                ),
                              );
                            }
                          },
                        }}
                      ></Rectangle>
                    );
                  })}

                  {/* Editing Sub Area (Draggable) */}
                  {editingSubArea && (
                    <DraggableRectangle
                      bounds={subAreaBounds}
                      setBounds={setSubAreaBounds}
                      color="#22c55e" // green
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
                {editingSubArea ? (
                  // EDIT MODE
                  <div className="flex flex-col h-full gap-4 overflow-y-auto pr-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-semibold">
                        {editingSubArea.id?.startsWith("sub-")
                          ? "Thêm khu vực mới"
                          : "Chỉnh sửa khu vực"}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSubArea(null)}
                      >
                        Hủy
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Tên khu vực</Label>
                        <Input
                          value={editingSubArea.name || ""}
                          onChange={(e) =>
                            setEditingSubArea({
                              ...editingSubArea,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Diện tích (ha)</Label>
                        <Input
                          type="number"
                          value={editingSubArea.area || ""}
                          onChange={(e) =>
                            setEditingSubArea({
                              ...editingSubArea,
                              area: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label>Loại đất</Label>
                        <Select
                          value={editingSubArea.landType}
                          onValueChange={(v) =>
                            setEditingSubArea({
                              ...editingSubArea,
                              landType: v,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại đất" />
                          </SelectTrigger>
                          <SelectContent>
                            {LAND_TYPES.map((l) => (
                              <SelectItem key={l.id} value={l.id}>
                                {l.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* MANUAL COORDINATES INPUTS */}
                    <div className="space-y-3 bg-muted/30 p-3 rounded-lg border">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground">
                        Toạ độ (Kéo thả hoặc nhập)
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {/* SW */}
                        <div className="space-y-1">
                          <Label className="text-[10px]">1. Tây Nam</Label>
                          <div className="flex gap-1">
                            <Input
                              className="h-7 text-xs px-1"
                              placeholder="Lat"
                              type="number"
                              value={subAreaBounds.getSouthWest().lat || 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                const ne = subAreaBounds.getNorthEast();
                                const sw = subAreaBounds.getSouthWest();
                                setSubAreaBounds(
                                  L.latLngBounds(L.latLng(val, sw.lng), ne),
                                );
                              }}
                            />
                            <Input
                              className="h-7 text-xs px-1"
                              placeholder="Lng"
                              type="number"
                              value={subAreaBounds.getSouthWest().lng || 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                const ne = subAreaBounds.getNorthEast();
                                const sw = subAreaBounds.getSouthWest();
                                setSubAreaBounds(
                                  L.latLngBounds(L.latLng(sw.lat, val), ne),
                                );
                              }}
                            />
                          </div>
                        </div>
                        {/* NW */}
                        <div className="space-y-1">
                          <Label className="text-[10px]">2. Tây Bắc</Label>
                          <div className="flex gap-1">
                            <Input
                              className="h-7 text-xs px-1"
                              placeholder="Lat"
                              type="number"
                              value={subAreaBounds.getNorthEast().lat || 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                const sw = subAreaBounds.getSouthWest();
                                const ne = subAreaBounds.getNorthEast();
                                setSubAreaBounds(
                                  L.latLngBounds(sw, L.latLng(val, ne.lng)),
                                );
                              }}
                            />
                            <Input
                              className="h-7 text-xs px-1"
                              placeholder="Lng"
                              type="number"
                              value={subAreaBounds.getSouthWest().lng || 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                const sw = subAreaBounds.getSouthWest();
                                const ne = subAreaBounds.getNorthEast();
                                setSubAreaBounds(
                                  L.latLngBounds(L.latLng(sw.lat, val), ne),
                                );
                              }}
                            />
                          </div>
                        </div>
                        {/* NE */}
                        <div className="space-y-1">
                          <Label className="text-[10px]">3. Đông Bắc</Label>
                          <div className="flex gap-1">
                            <Input
                              className="h-7 text-xs px-1"
                              placeholder="Lat"
                              type="number"
                              value={subAreaBounds.getNorthEast().lat || 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                const sw = subAreaBounds.getSouthWest();
                                const ne = subAreaBounds.getNorthEast();
                                setSubAreaBounds(
                                  L.latLngBounds(sw, L.latLng(val, ne.lng)),
                                );
                              }}
                            />
                            <Input
                              className="h-7 text-xs px-1"
                              placeholder="Lng"
                              type="number"
                              value={subAreaBounds.getNorthEast().lng || 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                const sw = subAreaBounds.getSouthWest();
                                const ne = subAreaBounds.getNorthEast();
                                setSubAreaBounds(
                                  L.latLngBounds(sw, L.latLng(ne.lat, val)),
                                );
                              }}
                            />
                          </div>
                        </div>
                        {/* SE */}
                        <div className="space-y-1">
                          <Label className="text-[10px]">4. Đông Nam</Label>
                          <div className="flex gap-1">
                            <Input
                              className="h-7 text-xs px-1"
                              placeholder="Lat"
                              type="number"
                              value={subAreaBounds.getSouthWest().lat || 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                const ne = subAreaBounds.getNorthEast();
                                const sw = subAreaBounds.getSouthWest();
                                setSubAreaBounds(
                                  L.latLngBounds(L.latLng(val, sw.lng), ne),
                                );
                              }}
                            />
                            <Input
                              className="h-7 text-xs px-1"
                              placeholder="Lng"
                              type="number"
                              value={subAreaBounds.getNorthEast().lng || 0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                const sw = subAreaBounds.getSouthWest();
                                const ne = subAreaBounds.getNorthEast();
                                setSubAreaBounds(
                                  L.latLngBounds(sw, L.latLng(ne.lat, val)),
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t flex gap-3">
                      <Button className="flex-1" onClick={saveSubArea}>
                        Lưu khu vực
                      </Button>
                    </div>
                  </div>
                ) : (
                  // LIST MODE
                  <div className="flex flex-col h-full gap-4">
                    <Button onClick={addSubArea} className="w-full">
                      <Plus className="w-4 h-4 mr-2" /> Thêm khu vực mới
                    </Button>

                    {!formData.subAreas || formData.subAreas.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10 p-4 text-center">
                        <p>Danh sách trống.</p>
                        <p className="text-sm">Hãy thêm khu vực đầu tiên.</p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {formData.subAreas.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors flex flex-col gap-2 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="font-medium">{sub.name}</span>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    setEditingSubArea(sub);
                                    if (
                                      sub.coordinates &&
                                      sub.coordinates.length >= 2
                                    ) {
                                      const lats = sub.coordinates.map(
                                        (c) => c.lat,
                                      );
                                      const lngs = sub.coordinates.map(
                                        (c) => c.lng,
                                      );
                                      setSubAreaBounds(
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
                                  onClick={() => removeSubArea(sub.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                              <span>DT: {sub.area} ha</span>
                              <span>
                                {LAND_TYPES.find((l) => l.id === sub.landType)
                                  ?.name || "-"}
                              </span>
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
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Thông tin chung
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Mã vùng:</span>
                    <span className="col-span-2 font-medium">
                      {formData.code}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Tên vùng:</span>
                    <span className="col-span-2 font-medium">
                      {formData.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Diện tích:</span>
                    <span className="col-span-2 font-medium">
                      {formData.area} ha
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Địa chỉ:</span>
                    <span className="col-span-2 font-medium">
                      {formData.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Vị trí & Phân bố
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Toạ độ:</span>
                    <span className="col-span-2 font-medium truncate">
                      {currentBounds.getSouthWest().lat.toFixed(4)},{" "}
                      {currentBounds.getSouthWest().lng.toFixed(4)} ...
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Khu vực con:</span>
                    <span className="col-span-2 font-medium">
                      {formData.subAreas?.length || 0} khu vực
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-muted/10">
              <h4 className="font-medium mb-3">Danh sách khu vực con</h4>
              {!formData.subAreas || formData.subAreas.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Chưa có khu vực con nào.
                </p>
              ) : (
                <div className="space-y-2">
                  {formData.subAreas.map((sub, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm border-b last:border-0 pb-2 last:pb-0"
                    >
                      <span>{sub.name}</span>
                      <span className="text-muted-foreground">
                        {sub.area} ha
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Thêm mới vùng trồng"
      description="Tạo vùng trồng mới theo quy trình từng bước"
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/region-distribution")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto pb-10">
        <StepperForm
          steps={steps}
          onComplete={handleSubmit}
          onCancel={() => setLocation("/region-distribution")}
          completeLabel="Tạo vùng trồng"
        />
      </div>
    </AdminLayout>
  );
};

export default RegionCreatePage;
