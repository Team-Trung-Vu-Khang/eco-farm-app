import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Box,
  ChevronLeft,
  Layers,
  Map as MapIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import useWarehouseStore, {
  type AreaAllocation,
} from "../../stores/useWarehouseStore";

// Leaflet imports
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

// Leaflet default icon setup to prevent asset resolution errors
import defaultMarkerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import defaultMarkerIconUrl from "leaflet/dist/images/marker-icon.png";
import defaultMarkerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultLeafletIcon = L.icon({
  iconUrl: defaultMarkerIconUrl,
  iconRetinaUrl: defaultMarkerIcon2xUrl,
  shadowUrl: defaultMarkerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map helper to sync center when inputs change
const MapCenterSync = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export default function InventoryAreaCreatePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const {
    areas,
    allocations,
    addArea,
    updateArea,
    addAllocation,
    deleteAllocation,
  } = useWarehouseStore();

  // Check if we are in Edit mode
  const [isEdit, editParams] = useRoute("/inventory-area/:id/edit");
  const editId = editParams?.id;
  const editingArea = useMemo(() => {
    return editId ? areas.find((a) => a.id === editId) : null;
  }, [editId, areas]);

  const [areaForm, setAreaForm] = useState({
    code: "",
    name: "",
    address: "",
    latitude: 10.8077699,
    longitude: 106.6632456,
    safetyDistanceWater: 20,
  });

  const [tempAllocations, setTempAllocations] = useState<
    Omit<AreaAllocation, "id" | "areaId">[]
  >([]);
  const [newAlloc, setNewAlloc] = useState({
    name: "",
    notes: "",
    storageType: "General" as AreaAllocation["storageType"],
  });

  // Populate data in edit mode
  useEffect(() => {
    if (editingArea) {
      setAreaForm({
        code: editingArea.code,
        name: editingArea.name,
        address: editingArea.address,
        latitude: editingArea.latitude,
        longitude: editingArea.longitude,
        safetyDistanceWater: editingArea.safetyDistanceWater || 20,
      });
      const existingAllocations = allocations.filter(
        (a) => a.areaId === editingArea.id,
      );
      setTempAllocations(
        existingAllocations.map((a) => ({
          name: a.name,
          notes: a.notes,
          storageType: a.storageType,
          isActive: a.isActive,
        })),
      );
    }
  }, [editingArea, allocations]);

  const handleAddTempAlloc = () => {
    if (!newAlloc.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên phân bổ chi tiết",
        variant: "destructive",
      });
      return;
    }
    setTempAllocations([...tempAllocations, { ...newAlloc, isActive: true }]);
    setNewAlloc({ name: "", notes: "", storageType: "General" });
  };

  const handleRemoveTempAlloc = (index: number) => {
    setTempAllocations(tempAllocations.filter((_, idx) => idx !== index));
  };

  const handleComplete = () => {
    if (!areaForm.code || !areaForm.name || !areaForm.address) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ Mã, Tên và Địa chỉ kho",
        variant: "destructive",
      });
      return;
    }

    if (editingArea) {
      updateArea(editingArea.id, areaForm);

      // Sync allocations (re-create for simplicity)
      const oldAllocs = allocations.filter(
        (al) => al.areaId === editingArea.id,
      );
      oldAllocs.forEach((al) => deleteAllocation(al.id));
      tempAllocations.forEach((temp) => {
        addAllocation({
          areaId: editingArea.id,
          name: temp.name,
          notes: temp.notes,
          storageType: temp.storageType,
          isActive: temp.isActive,
        });
      });

      toast({ title: "Thành công", description: "Đã cập nhật khu vực kho" });
    } else {
      const areaId = addArea(areaForm);
      tempAllocations.forEach((temp) => {
        addAllocation({
          areaId,
          name: temp.name,
          notes: temp.notes,
          storageType: temp.storageType,
          isActive: temp.isActive,
        });
      });
      toast({ title: "Thành công", description: "Đã thêm khu vực kho mới" });
    }
    setLocation("/inventory-area");
  };

  // Click on Leaflet Map to update pin coordinates
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setAreaForm((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });
    return null;
  };

  const getStorageBadgeColor = (type: string) => {
    switch (type) {
      case "General":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "Acidic_Fertilizer":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Pesticide":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Cold_Storage":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Locked_Cabinet":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStorageTypeText = (type: string) => {
    switch (type) {
      case "General":
        return "Vật tư thông thường";
      case "Acidic_Fertilizer":
        return "Phân bón Axit";
      case "Pesticide":
        return "Thuốc bảo vệ thực vật";
      case "Cold_Storage":
        return "Kho lạnh";
      case "Locked_Cabinet":
        return "Tủ khóa bảo mật";
      default:
        return "Chưa phân loại";
    }
  };

  const mapCenter: [number, number] = [areaForm.latitude, areaForm.longitude];

  const steps = [
    {
      id: "info",
      title: "Thông tin chung",
      content: (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>
                Mã kho <span className="text-red-500">*</span>
              </Label>
              <Input
                value={areaForm.code}
                onChange={(e) =>
                  setAreaForm({ ...areaForm, code: e.target.value })
                }
                placeholder="VD: KHO-HCM"
              />
            </div>
            <div className="space-y-1">
              <Label>
                Tên kho <span className="text-red-500">*</span>
              </Label>
              <Input
                value={areaForm.name}
                onChange={(e) =>
                  setAreaForm({ ...areaForm, name: e.target.value })
                }
                placeholder="VD: Kho hàng Miền Đông"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>
              Địa chỉ thực tế <span className="text-red-500">*</span>
            </Label>
            <Input
              value={areaForm.address}
              onChange={(e) =>
                setAreaForm({ ...areaForm, address: e.target.value })
              }
              placeholder="Nhập địa điểm tìm kiếm..."
            />
          </div>
          <div className="space-y-1">
            <Label>
              Khoảng cách nguồn nước sinh hoạt (mét){" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={areaForm.safetyDistanceWater}
              onChange={(e) =>
                setAreaForm({
                  ...areaForm,
                  safetyDistanceWater: Number(e.target.value),
                })
              }
              placeholder="20"
            />
            <p className="text-[11px] text-muted-foreground">
              Kho bán lẻ lưu trữ Thuốc BVTV cần đảm bảo khoảng cách tối thiểu
              20m so với nguồn nước.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "gps",
      title: "Định vị GPS (Bản đồ Leaflet)",
      content: (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Vĩ độ (Latitude)</Label>
              <Input
                type="number"
                step="any"
                value={areaForm.latitude}
                onChange={(e) =>
                  setAreaForm({ ...areaForm, latitude: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Kinh độ (Longitude)</Label>
              <Input
                type="number"
                step="any"
                value={areaForm.longitude}
                onChange={(e) =>
                  setAreaForm({
                    ...areaForm,
                    longitude: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Fully functional Leaflet Map integration */}
          <div className="relative h-72 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm z-0">
            <MapContainer
              center={mapCenter}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={mapCenter}
                icon={defaultLeafletIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    setAreaForm((prev) => ({
                      ...prev,
                      latitude: position.lat,
                      longitude: position.lng,
                    }));
                  },
                }}
              />
              <MapEvents />
              <MapCenterSync center={mapCenter} />
            </MapContainer>

            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm border text-xs flex items-center gap-1.5 font-medium">
              <MapIcon className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>Click bản đồ hoặc kéo marker để định vị</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "allocations",
      title: "Phân bổ chi tiết",
      content: (
        <div className="space-y-4 pt-2">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Vị trí lưu trữ nội bộ ({tempAllocations.length})
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
              {tempAllocations.map((alloc, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-800">
                        {alloc.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0.5 rounded border ${getStorageBadgeColor(alloc.storageType)}`}
                      >
                        {getStorageTypeText(alloc.storageType)}
                      </Badge>
                    </div>
                    {alloc.notes && (
                      <p className="text-[10px] text-muted-foreground">
                        {alloc.notes}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveTempAlloc(idx)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
              {tempAllocations.length === 0 && (
                <div className="col-span-2 py-6 text-center border border-dashed rounded-xl bg-slate-50/50 text-xs text-slate-400 flex flex-col items-center justify-center gap-1">
                  <Box className="w-6 h-6 text-slate-300" />
                  <span>Chưa cấu hình phân bổ nào.</span>
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h4 className="font-semibold text-xs text-slate-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-primary" /> Thêm vị trí mới
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px]">
                  Tên phân bổ <span className="text-red-500">*</span>
                </Label>
                <Input
                  size="sm"
                  value={newAlloc.name}
                  onChange={(e) =>
                    setNewAlloc({ ...newAlloc, name: e.target.value })
                  }
                  placeholder="VD: Kệ A1, Tủ thuốc 1..."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Loại lưu trữ đặc thù</Label>
                <Select
                  value={newAlloc.storageType}
                  onValueChange={(val) =>
                    setNewAlloc({ ...newAlloc, storageType: val as any })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Chọn đặc thù" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">Hàng thông thường</SelectItem>
                    <SelectItem value="Acidic_Fertilizer">
                      Phân bón tính Axit
                    </SelectItem>
                    <SelectItem value="Pesticide">Thuốc BVTV</SelectItem>
                    <SelectItem value="Cold_Storage">
                      Kho bảo quản lạnh
                    </SelectItem>
                    <SelectItem value="Locked_Cabinet">
                      Tủ an toàn có khóa
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Ghi chú/Mô tả</Label>
              <Input
                size="sm"
                value={newAlloc.notes}
                onChange={(e) =>
                  setNewAlloc({ ...newAlloc, notes: e.target.value })
                }
                placeholder="VD: Chứa hạt giống cây trồng nhiệt đới..."
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="w-full h-8"
              onClick={handleAddTempAlloc}
            >
              Bổ sung phân bổ
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      title={isEdit ? "Cập nhật khu vực kho" : "Khởi tạo khu vực kho mới"}
      description={
        isEdit
          ? `Chỉnh sửa cấu hình kho ${areaForm.name}`
          : "Quy trình thiết lập kho bãi lưu trữ và định vị địa lý"
      }
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/inventory-area")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <Card className="max-w-3xl mx-auto border-none shadow-xl bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b py-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-primary" /> Thiết lập các bước cấu
            hình kho
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/inventory-area")}
            completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Khởi tạo"}
          />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
