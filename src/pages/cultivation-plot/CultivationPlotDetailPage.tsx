import { useMemo } from "react";
import { useLocation, useRoute, Link } from "wouter";
import {
  AdminLayout,
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronLeft,
  MapPin,
  Layers,
  Sprout,
  Calendar,
  User,
  Info,
  ExternalLink,
  Droplets,
  ClipboardList,
  Edit,
  Building2,
} from "lucide-react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import useCultivationPlotStore from "../../stores/useCultivationPlotStore";
import useRegionStore from "../../stores/useRegionStore";
import useEnterpriseStore from "../../stores/useEnterpriseStore";
import useFarmingMethodStore from "../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../stores/useIrrigationSystemStore";
import useVarietyStore from "../../stores/useVarietyStore";
import usePersonnelStore from "../../stores/usePersonnelStore";
import useEnterpriseCertificateStore from "../../stores/useEnterpriseCertificateStore";

// Map component to fly to the plot
const MapController = ({ center }: { center: L.LatLngExpression }) => {
  const map = useMap();
  map.setView(center, 18);
  return null;
};

const CultivationPlotDetailPage = () => {
  const [, params] = useRoute("/cultivation-plot/:id");
  const [, setLocation] = useLocation();
  const { getCultivationPlotById } = useCultivationPlotStore();
  const { regions } = useRegionStore();
  const { enterprises } = useEnterpriseStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { varieties } = useVarietyStore();
  const { personnel } = usePersonnelStore();
  const { standards } = useEnterpriseCertificateStore();

  const plotId = params?.id;
  const data = useMemo(() => {
    if (!plotId) return undefined;
    return getCultivationPlotById(plotId);
  }, [plotId, getCultivationPlotById]);

  // Find geometry from RegionStore
  const geometry = useMemo(() => {
    if (!data) return null;
    for (const region of regions) {
      for (const area of region.subAreas || []) {
        const found = (area.plots || []).find(
          (p: any) => p.id === data.plotId || p.id === data.id,
        );
        if (found) return found;
      }
    }
    return null;
  }, [data, regions]);

  if (!data) {
    return (
      <AdminLayout title="Chi tiết Lô canh tác" description="Đang tải...">
        <div className="p-12 text-center text-slate-500">
          Không tìm thấy thông tin lô canh tác
        </div>
      </AdminLayout>
    );
  }

  const enterprise = enterprises.find(
    (e: any) => e.id.toString() === data.enterpriseId,
  );
  const manager = personnel.find(
    (m: any) => m.id.toString() === data.managerId,
  );
  const farmingMethod = farmingMethods.find(
    (m: any) => m.id === data.farmingMethodId,
  );
  const irrigationSystem = irrigationSystems.find(
    (m: any) => m.id === data.irrigationMethodId,
  );

  const center = geometry?.coordinates?.[0]
    ? L.latLng(geometry.coordinates[0].lat, geometry.coordinates[0].lng)
    : L.latLng(11.54, 106.9);

  return (
    <AdminLayout
      title={data.name}
      description={`Cấu hình canh tác cho Lô #${data.id}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/cultivation-plot")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button
            onClick={() => setLocation(`/cultivation-plot/${data.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Map & Geometry */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-xl rounded-2xl">
            <div className="h-[400px] relative">
              <MapContainer
                center={center}
                zoom={18}
                className="h-full w-full"
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapController center={center} />
                {geometry?.coordinates && (
                  <Polygon
                    positions={geometry.coordinates.map((c: any) => [
                      c.lat,
                      c.lng,
                    ])}
                    pathOptions={{
                      color: "#10b981",
                      weight: 3,
                      fillColor: "#10b981",
                      fillOpacity: 0.2,
                    }}
                  />
                )}
              </MapContainer>

              <div className="absolute top-4 right-4 z-400 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Diện tích đo đạc
                </div>
                <div className="text-xl font-black text-primary flex items-baseline gap-1">
                  {geometry?.area?.toFixed(2) || data.configs?.["lot-config"]
                    ? "---"
                    : "---"}
                  <span className="text-xs font-medium text-slate-500">ha</span>
                </div>
              </div>
            </div>
            <CardContent className="bg-slate-50 p-6 flex flex-wrap gap-8 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Vùng trồng
                  </div>
                  <div className="font-bold text-slate-700">
                    {data.regionName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Khu vực
                  </div>
                  <div className="font-bold text-slate-700">
                    {data.areaName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quản lý
                  </div>
                  <div className="font-bold text-slate-700">
                    {manager?.fullName || "Chưa gán"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crops Table */}
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sprout className="w-5 h-5 text-primary" />
                Cơ cấu cây trồng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b">
                    <tr>
                      <th className="px-6 py-4">Giống cây</th>
                      <th className="px-6 py-4">Nhóm cây</th>
                      <th className="px-6 py-4">Nguồn giống</th>
                      <th className="px-6 py-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.selectedCrops.map((cropId) => {
                      const v = varieties.find((i) => i.id === cropId);
                      const seedIds = data.seedSelections?.[cropId] || [];
                      return (
                        <tr
                          key={cropId}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">
                              {v?.varietyName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono italic">
                              {v?.crop}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-100 uppercase text-[10px]"
                            >
                              Ăn quả
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {seedIds.length > 0 ? (
                                seedIds.map((sid) => (
                                  <Badge
                                    key={sid}
                                    variant="secondary"
                                    className="text-[10px] py-0 px-1.5 h-5"
                                  >
                                    #{sid}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-slate-400 italic text-xs">
                                  Mặc định
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              <span className="text-xs font-medium text-slate-600">
                                Đang trồng
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Sidebar Stats & Info */}
        <div className="space-y-6">
          {/* General Detail Card */}
          <Card className="border-none shadow-xl rounded-2xl bg-primary text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <Droplets size={120} />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                    Phương pháp canh tác
                  </div>
                  <div className="font-black text-lg leading-tight uppercase tracking-tight">
                    {farmingMethod?.name || "VietGAP"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-white/70 font-bold uppercase">
                      Hệ thống tưới
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-blue-300" />
                    <span className="text-sm font-bold truncate">
                      {irrigationSystem?.name || "Tưới nhỏ giọt Israel"}
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-white/70 font-bold uppercase">
                      Chứng nhận áp dụng
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.certificateIds.map((cid) => (
                      <Badge
                        key={cid}
                        className="bg-white/20 hover:bg-white/30 text-white border-none text-[10px]"
                      >
                        {standards.find((s) => s.code === cid)?.name || cid}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise details */}
          <Card className="border-none shadow-xl rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" />
                Đơn vị chủ quản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                  <img
                    src={enterprise?.image || "https://github.com/shadcn.png"}
                    alt="Enterprise"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 text-sm truncate">
                    {enterprise?.name}
                  </div>
                  <Link href={`/enterprise/${enterprise?.id}`}>
                    <a className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1 mt-1 uppercase">
                      Xem chi tiết <ExternalLink size={8} />
                    </a>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline / Additional info */}
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="p-5 border-b bg-slate-50/30">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Thông tin bổ sung
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                        Ngày tạo thiết lập
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {data.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                        Trạng thái lô
                      </p>
                      <Badge
                        variant={
                          data.status === "active" ? "default" : "secondary"
                        }
                        className="h-5 text-[10px] uppercase font-bold px-2"
                      >
                        {data.status === "active"
                          ? "Đang hoạt động"
                          : "Tạm ngưng"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ClipboardList className="w-3 h-3" />
                  Ghi chú
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  {data.note || "Không có ghi chú nào cho cấu hình này."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CultivationPlotDetailPage;
