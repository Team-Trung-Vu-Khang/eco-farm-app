import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
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
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
import { Plus, Edit, Trash2, ChevronLeft, X } from "lucide-react";

import {
  type Region,
  type SubArea,
  PROVINCES,
  DISTRICTS,
  ENTERPRISES,
  LAND_TYPES,
  TERRAIN_TYPES,
} from "../constants";
import { MapController } from "../components/DraggableRectangle";
import useRegionStore from "../../../stores/useRegionStore";

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

const RegionCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/region-distribution/edit/:id");
  const isEditMode = match && !!params?.id;

  // Form State
  const defaultPoints = [
    L.latLng(11.53, 106.88),
    L.latLng(11.55, 106.88),
    L.latLng(11.55, 106.91),
    L.latLng(11.53, 106.91),
  ];

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

  const [regionPoints, setRegionPoints] = useState<L.LatLng[]>(defaultPoints);

  const { addRegion, updateRegion, getRegionById } = useRegionStore();

  useEffect(() => {
    if (isEditMode && params?.id) {
      const regionId = parseInt(params.id);
      const found = getRegionById(regionId);
      if (found) {
        setFormData(found);
        if (found.coordinates && found.coordinates.length >= 3) {
          setRegionPoints(found.coordinates.map((c) => L.latLng(c.lat, c.lng)));
        }
      }
    }
  }, [isEditMode, params?.id, getRegionById]);

  // Sub-area State
  const [editingSubArea, setEditingSubArea] = useState<Partial<SubArea> | null>(
    null,
  );

  const getBoundsFromPoints = (points: L.LatLng[]) => {
    if (points.length === 0) return L.latLngBounds(defaultPoints);
    return L.latLngBounds(points);
  };

  const [subAreaPoints, setSubAreaPoints] = useState<L.LatLng[]>([]);

  // --- Handlers ---

  const handlePointDrag = (index: number, latlng: L.LatLng) => {
    const newPoints = [...regionPoints];
    newPoints[index] = latlng;
    setRegionPoints(newPoints);
  };

  const handleSubAreaPointDrag = (index: number, latlng: L.LatLng) => {
    const newPoints = [...subAreaPoints];
    newPoints[index] = latlng;
    setSubAreaPoints(newPoints);
  };

  const handleAddPoint = () => {
    const center = getBoundsFromPoints(regionPoints).getCenter();
    setRegionPoints([
      ...regionPoints,
      L.latLng(center.lat + 0.005, center.lng + 0.005),
    ]);
  };

  const handleAddSubAreaPoint = () => {
    const center = getBoundsFromPoints(subAreaPoints).getCenter();
    setSubAreaPoints([
      ...subAreaPoints,
      L.latLng(center.lat + 0.002, center.lng + 0.002),
    ]);
  };

  const handleMapClick = (latlng: L.LatLng) => {
    setRegionPoints([...regionPoints, latlng]);
  };

  const handleSubAreaMapClick = (latlng: L.LatLng) => {
    if (editingSubArea) {
      setSubAreaPoints([...subAreaPoints, latlng]);
    }
  };

  const removePoint = (index: number) => {
    if (regionPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Vùng trồng cần ít nhất 3 điểm để tạo thành hình",
        variant: "destructive",
      });
      return;
    }
    const newPoints = regionPoints.filter((_, i) => i !== index);
    setRegionPoints(newPoints);
  };

  const removeSubAreaPoint = (index: number) => {
    if (subAreaPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Khu vực cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    const newPoints = subAreaPoints.filter((_, i) => i !== index);
    setSubAreaPoints(newPoints);
  };

  const handlePointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const newPoints = [...regionPoints];
    const currentPoint = newPoints[index];
    newPoints[index] = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setRegionPoints(newPoints);
  };

  const handleSubAreaPointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const newPoints = [...subAreaPoints];
    const currentPoint = newPoints[index];
    newPoints[index] = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setSubAreaPoints(newPoints);
  };

  const handleSubmit = () => {
    if (regionPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất 3 điểm cho vùng trồng",
        variant: "destructive",
      });
      return;
    }

    const regionData: Omit<Region, "id"> = {
      code: formData.code || "",
      name: formData.name || "",
      provinceId: formData.provinceId || "",
      districtId: formData.districtId || "",
      address: formData.address || "",
      enterpriseId: formData.enterpriseId || "",
      area: formData.area || 0,
      landType: formData.landType || "",
      terrain: formData.terrain || "",
      note: formData.note || "",
      status: (formData.status as "active" | "inactive") || "active",
      subAreas: (formData.subAreas as SubArea[]) || [],
      coordinates: regionPoints.map((p) => ({ lat: p.lat, lng: p.lng })),
      createdAt:
        isEditMode && formData.createdAt
          ? formData.createdAt
          : new Date().toISOString(),
    };

    if (isEditMode && params?.id) {
      updateRegion(parseInt(params.id), regionData);
    } else {
      addRegion(regionData);
    }

    toast({
      title: "Thành công",
      description: isEditMode
        ? "Cập nhật vùng trồng thành công"
        : "Đã tạo mới vùng trồng thành công",
    });
    setLocation("/region-distribution");
  };

  const addSubArea = () => {
    const newSub: SubArea = {
      area: 0,
      code: "",
      plots: [],
      landType: "",
      coordinates: [],
      status: "active",
      name: "Khu vực mới",
      id: `sub-${Date.now()}`,
      regionId: formData.id!,
      terrain: formData.terrain || "",
      createdAt: new Date().toISOString(),
    };
    setEditingSubArea(newSub);
    const center = getBoundsFromPoints(regionPoints).getCenter();
    setSubAreaPoints([
      L.latLng(center.lat - 0.002, center.lng - 0.002),
      L.latLng(center.lat + 0.002, center.lng - 0.002),
      L.latLng(center.lat + 0.002, center.lng + 0.002),
      L.latLng(center.lat - 0.002, center.lng + 0.002),
    ]);
  };

  const saveSubArea = () => {
    if (!editingSubArea) return;

    if (subAreaPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất 3 điểm cho khu vực",
        variant: "destructive",
      });
      return;
    }

    const fullCoords = subAreaPoints.map((p) => ({ lat: p.lat, lng: p.lng }));

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
                        <div className="flex items-center gap-2">
                          <img
                            src={e.image}
                            alt={e.name}
                            className="w-5 h-5 rounded-full object-cover border"
                          />
                          <span>{e.name}</span>
                        </div>
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
        <Card className="h-[750px] flex flex-col">
          <CardHeader>
            <CardTitle>Bản đồ vị trí</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden flex gap-4">
            <div className="flex-1 h-full rounded-lg border overflow-hidden relative z-0">
              <MapContainer
                center={[
                  getBoundsFromPoints(regionPoints).getCenter().lat,
                  getBoundsFromPoints(regionPoints).getCenter().lng,
                ]}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler onClick={handleMapClick} />

                <Polygon
                  positions={regionPoints}
                  pathOptions={{ color: "blue", fillOpacity: 0.1 }}
                />

                {regionPoints.map((point, idx) => (
                  <Marker
                    key={`point-${idx}`}
                    position={point}
                    draggable={true}
                    icon={customIcon}
                    eventHandlers={{
                      drag: (e) => {
                        handlePointDrag(idx, e.target.getLatLng());
                      },
                    }}
                  />
                ))}

                <MapController
                  center={[
                    getBoundsFromPoints(regionPoints).getCenter().lat,
                    getBoundsFromPoints(regionPoints).getCenter().lng,
                  ]}
                />
              </MapContainer>
            </div>

            <div className="w-[300px] flex flex-col h-full bg-slate-50 border rounded-lg overflow-hidden">
              <div className="p-3 border-b bg-white">
                <h4 className="font-semibold text-sm">Danh sách toạ độ</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Kéo thả điểm trên bản đồ hoặc click để thêm điểm mới.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {regionPoints.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-2 bg-white rounded border text-xs relative"
                  >
                    <div className="absolute top-2 right-2 flex gap-1">
                      {regionPoints.length > 3 && (
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
      id: "subarea",
      title: "Phân chia khu vực",
      description: "Tạo khu vực con",
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
                    getBoundsFromPoints(regionPoints).getCenter().lat,
                    getBoundsFromPoints(regionPoints).getCenter().lng,
                  ]}
                  zoom={14}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapClickHandler onClick={handleSubAreaMapClick} />

                  {/* Main Region Boundary (Dynamic Polygon) */}
                  <Polygon
                    positions={regionPoints}
                    pathOptions={{
                      color: "blue",
                      fill: false,
                      dashArray: "5, 5",
                    }}
                  />

                  {/* Existing Sub Areas (Static) */}
                  {formData.subAreas?.map((sub) => {
                    // Don't show the one currently being edited as a static poly
                    if (editingSubArea && sub.id === editingSubArea.id)
                      return null;

                    if (!sub.coordinates || sub.coordinates.length < 3)
                      return null;

                    const positions = sub.coordinates.map((c) =>
                      L.latLng(c.lat, c.lng),
                    );

                    return (
                      <Polygon
                        key={sub.id}
                        positions={positions}
                        pathOptions={{ color: "green", weight: 2 }}
                        eventHandlers={{
                          click: () => {
                            setEditingSubArea(sub);
                            if (
                              sub.coordinates &&
                              sub.coordinates.length >= 3
                            ) {
                              setSubAreaPoints(
                                sub.coordinates.map((c) =>
                                  L.latLng(c.lat, c.lng),
                                ),
                              );
                            }
                          },
                        }}
                      />
                    );
                  })}

                  {/* Editing Sub Area (Dynamic) */}
                  {editingSubArea && (
                    <>
                      <Polygon
                        positions={subAreaPoints}
                        pathOptions={{
                          color: "#22c55e",
                          weight: 2,
                          fillOpacity: 0.2,
                        }}
                      />
                      {subAreaPoints.map((point, idx) => (
                        <Marker
                          key={`sub-point-${idx}`}
                          position={point}
                          draggable={true}
                          icon={customIcon}
                          eventHandlers={{
                            drag: (e) => {
                              handleSubAreaPointDrag(idx, e.target.getLatLng());
                            },
                          }}
                        />
                      ))}
                    </>
                  )}
                  <MapController
                    center={[
                      getBoundsFromPoints(regionPoints).getCenter().lat,
                      getBoundsFromPoints(regionPoints).getCenter().lng,
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
                          value={editingSubArea.landType || formData.landType}
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
                        {subAreaPoints.map((p, i) => (
                          <div
                            key={i}
                            className="flex flex-col gap-2 p-2 bg-white rounded border text-xs relative"
                          >
                            <div className="absolute top-2 right-2 flex gap-1">
                              {subAreaPoints.length > 3 && (
                                <button
                                  onClick={() => removeSubAreaPoint(i)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <span className="font-semibold">Điểm {i + 1}</span>
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
                                    handleSubAreaPointInputChange(
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
                                    handleSubAreaPointInputChange(
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
                          onClick={handleAddSubAreaPoint}
                        >
                          <Plus className="w-4 h-4 mr-2" /> Thêm điểm
                        </Button>
                      </div>
                    </div>

                    {/* Actions */}
                    <Button className="w-full mt-4" onClick={saveSubArea}>
                      Lưu và Đóng
                    </Button>
                  </div>
                ) : (
                  // LIST MODE
                  <div className="flex flex-col h-full bg-slate-50 border rounded-lg">
                    <div className="flex items-center justify-between p-3 border-b bg-white">
                      <h4 className="font-semibold text-sm">
                        Danh sách khu vực
                      </h4>
                      <Button size="sm" onClick={addSubArea}>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm khu vực
                      </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {!formData.subAreas || formData.subAreas.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          Chưa có khu vực con nào được tạo.
                        </div>
                      ) : (
                        formData.subAreas.map((sub) => (
                          <div
                            key={sub.id}
                            className="bg-white p-3 rounded-lg border shadow-sm group hover:border-blue-300 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-medium text-sm text-blue-700">
                                  {sub.name}
                                </h5>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {sub.area} ha •{" "}
                                  {
                                    LAND_TYPES.find(
                                      (l) => l.id === sub.landType,
                                    )?.name
                                  }
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setEditingSubArea(sub);
                                    if (
                                      sub.coordinates &&
                                      sub.coordinates.length >= 3
                                    ) {
                                      setSubAreaPoints(
                                        sub.coordinates.map((c) =>
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
                                  onClick={() => removeSubArea(sub.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                              <div className="bg-slate-50 p-1 rounded">
                                {sub.coordinates?.length || 0} điểm toạ độ
                              </div>
                              {sub.coordinates &&
                                sub.coordinates.length > 0 && (
                                  <div className="bg-slate-50 p-1 rounded truncate">
                                    {sub.coordinates[0].lat.toFixed(4)},{" "}
                                    {sub.coordinates[0].lng.toFixed(4)}
                                  </div>
                                )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
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
                      {regionPoints.length > 0
                        ? regionPoints[0].lat.toFixed(4)
                        : "0"}
                      ,{" "}
                      {regionPoints.length > 0
                        ? regionPoints[0].lng.toFixed(4)
                        : "0"}{" "}
                      ...
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
      title={isEditMode ? "Cập nhật vùng trồng" : "Thêm mới vùng trồng"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin vùng trồng"
          : "Tạo vùng trồng mới theo quy trình từng bước"
      }
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
          completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo vùng trồng"}
        />
      </div>
    </AdminLayout>
  );
};

export default RegionCreatePage;
