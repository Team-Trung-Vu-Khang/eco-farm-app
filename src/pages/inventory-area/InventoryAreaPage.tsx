import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  DeleteDialog,
  Input,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Box,
  Edit,
  Layers,
  Lock,
  Map as MapIcon,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  ThermometerSnowflake,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import useWarehouseStore from "../../stores/useWarehouseStore";

// Leaflet imports
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

// Leaflet default icon setup
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

const MapCenterSync = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

export default function InventoryAreaPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { areas, allocations, deleteArea } = useWarehouseStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(
    areas[0]?.id || null,
  );

  // Delete State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const selectedArea = areas.find((a) => a.id === selectedAreaId) || areas[0];
  const selectedAllocations = allocations.filter(
    (al) => al.areaId === (selectedArea?.id || ""),
  );

  const filteredAreas = areas.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteArea(deleteTargetId);
      toast({ title: "Thành công", description: "Đã xóa khu vực kho" });
      if (selectedAreaId === deleteTargetId) {
        setSelectedAreaId(areas[0]?.id || null);
      }
    }
    setDeleteOpen(false);
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

  const getStorageIcon = (type: string) => {
    switch (type) {
      case "General":
        return <Box className="w-4 h-4 text-slate-500" />;
      case "Acidic_Fertilizer":
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case "Pesticide":
        return <Box className="w-4 h-4 text-emerald-500" />; // Or Droplet, let's keep it safe
      case "Cold_Storage":
        return <ThermometerSnowflake className="w-4 h-4 text-blue-500" />;
      case "Locked_Cabinet":
        return <Lock className="w-4 h-4 text-red-500" />;
      default:
        return <Box className="w-4 h-4 text-slate-500" />;
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

  return (
    <PageWrapper
      title="Quản lý khu vực kho"
      description="Xem bản đồ vị trí các kho, quản lý phân vùng, kệ tủ chứa chi tiết"
      actions={
        <Button
          onClick={() => setLocation("/inventory-area/create")}
          data-testid="add-warehouse-area"
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm khu vực kho
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Warehouse List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm kho..."
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
              {filteredAreas.map((area) => (
                <div
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    selectedAreaId === area.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-xs"
                      : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {area.code}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-white">
                      {allocations.filter((al) => al.areaId === area.id).length}{" "}
                      phân vùng
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-800">
                    {area.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    {area.address}
                  </p>
                </div>
              ))}

              {filteredAreas.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Không tìm thấy khu vực kho nào.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Warehouse Details & Map */}
        <div className="lg:col-span-2 space-y-6">
          {selectedArea ? (
            <div className="space-y-6">
              {/* Warehouse safety alerts */}
              {selectedArea.safetyDistanceWater !== undefined &&
                selectedArea.safetyDistanceWater < 20 && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-start gap-3 shadow-xs">
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-sm">
                        Vi phạm khoảng cách an toàn nguồn nước!
                      </h5>
                      <p className="text-xs mt-1 leading-relaxed">
                        Khoảng cách đo được hiện tại là{" "}
                        <strong>{selectedArea.safetyDistanceWater}m</strong>{" "}
                        (yêu cầu tối thiểu <strong>20m</strong> đối với lưu trữ
                        Thuốc BVTV theo QCVN 01-143:2013/BNNPTNT). Vui lòng điều
                        chỉnh định vị kho hoặc ngưng bố trí kệ chứa thuốc BVTV
                        tại đây.
                      </p>
                    </div>
                  </div>
                )}

              {/* Warehouse Details card */}
              <Card className="border-none shadow-md bg-white overflow-hidden">
                <div className="bg-linear-to-r from-emerald-50 to-teal-50 p-6 flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-white px-2 py-0.5 rounded border font-mono text-xs font-semibold">
                        {selectedArea.code}
                      </span>
                      <span className="text-xs text-slate-500">
                        Thành lập: {selectedArea.createdAt}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedArea.name}
                    </h2>
                    <p className="text-sm text-slate-700 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      {selectedArea.address}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setLocation(`/inventory-area/${selectedArea.id}/edit`)
                      }
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" /> Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteClick(selectedArea.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Virtual Shelving list (Geographical Selection style) */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-primary" /> Phân vùng & Ô
                      chứa nội bộ ({selectedAllocations.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto">
                      {selectedAllocations.map((alloc) => (
                        <div
                          key={alloc.id}
                          className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-all"
                        >
                          <div className="p-2 rounded-lg bg-white border shadow-2xs">
                            {getStorageIcon(alloc.storageType)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm text-slate-800">
                                {alloc.name}
                              </span>
                              <Badge
                                className={`text-[9px] border px-1.5 py-0.5 rounded-full ${getStorageBadgeColor(alloc.storageType)}`}
                              >
                                {getStorageTypeText(alloc.storageType)}
                              </Badge>
                            </div>
                            {alloc.notes && (
                              <p className="text-xs text-muted-foreground">
                                {alloc.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {selectedAllocations.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground text-xs border border-dashed rounded-xl bg-slate-50/50">
                          Chưa phân bổ ô chứa/kệ hàng.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Satellite Location Map */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <MapIcon className="w-4 h-4 text-primary" /> Định vị địa
                      điểm
                    </h3>
                    <div className="relative h-60 w-full rounded-xl overflow-hidden border shadow-inner z-0">
                      <MapContainer
                        center={[selectedArea.latitude, selectedArea.longitude]}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={false}
                        doubleClickZoom={false}
                        scrollWheelZoom={false}
                        dragging={false}
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[
                            selectedArea.latitude,
                            selectedArea.longitude,
                          ]}
                          icon={defaultLeafletIcon}
                        />
                        <MapCenterSync
                          center={[
                            selectedArea.latitude,
                            selectedArea.longitude,
                          ]}
                        />
                      </MapContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-none shadow-md bg-white p-12 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
              <Box className="w-12 h-12 text-slate-200" />
              <div>
                <h4 className="font-semibold text-slate-600">
                  Chưa có khu vực kho
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Vui lòng khởi tạo một khu vực kho mới.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
