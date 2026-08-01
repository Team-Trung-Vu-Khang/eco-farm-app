import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Building2,
  Calendar,
  ChevronLeft,
  ClipboardList,
  Droplets,
  Edit,
  ExternalLink,
  Info,
  Layers,
  MapPin,
  Sprout,
  User,
} from "lucide-react";
import { MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";
import { Link } from "wouter";

import { useCultivationAreaDetailPage } from "./hooks/useCultivationAreaDetailPage";

// Map component to fly to the area
const MapController = ({ center }: { center: L.LatLngExpression }) => {
  const map = useMap();
  map.setView(center, 16);
  return null;
};

const CultivationAreaDetailPage = () => {
  const {
    data,
    geometry,
    enterprise,
    manager,
    farmingMethod,
    irrigationSystem,
    varieties,
    standards,
    center,
    goBack,
    goToEdit,
  } = useCultivationAreaDetailPage();

  if (!data) {
    return (
      <PageWrapper title="Chi tiết Khu vực canh tác" description="Đang tải...">
        <div className="p-12 text-center text-slate-500">
          Không tìm thấy thông tin khu vực canh tác
        </div>
      </PageWrapper>
    );
  }
  return (
    <PageWrapper
      title={data.name}
      description={`Cấu hình canh tác cho Khu vực #${data.id}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button onClick={goToEdit}>
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
                zoom={16}
                className="h-full w-full"
                zoomControl={false}
              >
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                <MapController center={center} />
                {geometry?.coordinates && (
                  <Polygon
                    positions={geometry.coordinates.map((coordinate) => [
                      coordinate.lat,
                      coordinate.lng,
                    ])}
                    pathOptions={{
                      color: "#10b981",
                      weight: 3,
                      fillColor: "#10b981",
                      fillOpacity: 0.15,
                    }}
                  />
                )}
              </MapContainer>

              <div className="absolute top-4 right-4 z-400 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Tổng diện tích khu vực
                </div>
                <div className="text-xl font-black text-primary flex items-baseline gap-1">
                  {geometry?.area?.toFixed(2) || "---"}
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
                    Vùng trồng cha
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
                    Mã khu vực
                  </div>
                  <div className="font-bold text-slate-700">{data.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quản lý khu vực
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
            <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sprout className="w-5 h-5 text-primary" />
                Danh mục cây trồng trong khu vực
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-primary/5 text-primary border-primary/20"
              >
                {data.selectedCrops.length} loại cây
              </Badge>
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
                              {v?.seedType || "Ăn quả"}
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
                                Đang canh tác
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
          <Card className="border-none shadow-xl rounded-2xl bg-slate-900 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <Droplets size={120} />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <Droplets className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                    Tiêu chuẩn canh tác
                  </div>
                  <div className="font-black text-lg leading-tight uppercase tracking-tight text-primary">
                    {farmingMethod?.name || "Organic Standard"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-white/50 font-bold uppercase">
                      Hệ thống cấp nước
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-sm font-bold truncate">
                      {irrigationSystem?.name || "Hệ thống tưới tự động"}
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-white/50 font-bold uppercase">
                      Chứng nhận khu vực
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.certificateIds.map((cid) => (
                      <Badge
                        key={cid}
                        className="bg-primary/20 hover:bg-primary/30 text-primary border-none text-[10px]"
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
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" />
                Đơn vị quản lý
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                  <img
                    src={enterprise?.image || "https://github.com/shadcn.png"}
                    alt="Enterprise"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800 text-sm truncate">
                    {enterprise?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {enterprise?.address || "Khu vực kinh doanh"}
                  </div>
                  <Link href={`/enterprise/${enterprise?.id}`}>
                    <a className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1 mt-2 uppercase">
                      Xem chi tiết đơn vị sở hữu <ExternalLink size={8} />
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
                  Lịch sử & Trạng thái
                </div>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1.5">
                        Ngày khởi tạo vùng
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {data.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1.5">
                        Trạng thái hiện tại
                      </p>
                      <Badge
                        variant={
                          data.status === "active" ? "default" : "secondary"
                        }
                        className="h-5 text-[10px] uppercase font-bold px-2 bg-emerald-500"
                      >
                        {data.status === "active"
                          ? "Đang hoạt động"
                          : "Tạm ngưng"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-amber-50/20">
                <div className="text-[10px] font-black text-amber-600/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ClipboardList className="w-3.5 h-3.5" />
                  Ghi chú khu vực
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-amber-200 pl-3">
                  {data.note || "Không có ghi chú đặc biệt cho khu vực này."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CultivationAreaDetailPage;
