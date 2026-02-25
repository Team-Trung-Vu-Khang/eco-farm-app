import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tankhang1/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Activity,
  ChevronLeft,
  Edit,
  History,
  MapPin,
  Maximize2,
  Ruler,
  Sprout,
  Trees,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip as LeafletTooltip,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
} from "react-leaflet";
import { Link, useParams } from "wouter";
import usePlantStore from "../../../stores/usePlantStore";

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const HISTORY_DATA = [
  {
    id: 1,
    date: "20/02/2026",
    action: "Bón phân",
    details: "NPK 20-20-15",
    executor: "Nguyễn Văn A",
  },
  {
    id: 2,
    date: "15/02/2026",
    action: "Tưới nước",
    details: "Hệ thống tự động 30 phút",
    executor: "Trần Thị B",
  },
  {
    id: 3,
    date: "10/02/2026",
    action: "Kiểm tra định kỳ",
    details: "Cây phát triển tốt, không sâu bệnh",
    executor: "Lê Văn C",
  },
];

const PlantIdentificationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getPlantById } = usePlantStore();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const result = getPlantById(id);
      setData(result);
    }
  }, [id, getPlantById]);

  if (!data || !data.plant) {
    return (
      <AdminLayout
        title="Không tìm thấy cây"
        description="Dữ liệu không tồn tại"
      >
        <div className="p-12 text-center text-slate-400">
          <Trees className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Không tìm thấy thông tin định danh cho cây có ID này.</p>
          <Link href="/plant-identification">
            <Button variant="outline" className="mt-4">
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { plant, plot, area, region } = data;

  const historyColumns = [
    { key: "date", label: "Ngày" },
    { key: "action", label: "Hoạt động" },
    { key: "details", label: "Chi tiết" },
    { key: "executor", label: "Người thực hiện" },
  ];

  return (
    <AdminLayout
      title={`Thông tin cây: ${plant.code}`}
      description="Chi tiết định danh và vị trí địa lý của cây trồng"
      actions={
        <div className="flex gap-2">
          <Link href="/plant-identification">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Quay lại
            </Button>
          </Link>
          <Link href={`/plant-identification/${plant.id}/edit`}>
            <Button size="sm">
              <Edit className="w-4 h-4 mr-1" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Identity Card */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100 shrink-0">
                <Trees className="w-12 h-12" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {plant.name}
                    </h2>
                    <p className="text-slate-500 font-mono text-sm">
                      {plant.code}
                    </p>
                  </div>
                  <Badge
                    variant={
                      plant.status === "healthy" ? "default" : "secondary"
                    }
                  >
                    {plant.status === "healthy" ? "Khỏe mạnh" : "Cần chú ý"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Ngày trồng
                    </p>
                    <p className="text-sm font-semibold">{plant.plantedDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Độ tuổi
                    </p>
                    <p className="text-sm font-semibold">{plant.age}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Loại cây
                    </p>
                    <p className="text-sm font-semibold">{plant.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Vị trí GPS
                    </p>
                    <p className="text-sm font-mono">
                      {plant.coordinate.lat.toFixed(6)},{" "}
                      {plant.coordinate.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden h-125 flex flex-col">
              <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Vị trí địa lý & Phạm vi canh tác
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <div className="flex-1 z-0">
                <MapContainer
                  center={[plant.coordinate.lat, plant.coordinate.lng]}
                  zoom={18}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Esri"
                  />
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />

                  {/* Region Layer */}
                  {region && region.coordinates && (
                    <Polygon
                      positions={region.coordinates.map((c: any) => [
                        c.lat,
                        c.lng,
                      ])}
                      pathOptions={{
                        color: "#3b82f6",
                        weight: 2,
                        fillOpacity: 0.1,
                      }}
                    >
                      <LeafletTooltip permanent direction="center">
                        Vùng: {region.name}
                      </LeafletTooltip>
                    </Polygon>
                  )}

                  {/* Area Layer */}
                  {area && area.coordinates && (
                    <Polygon
                      positions={area.coordinates.map((c: any) => [
                        c.lat,
                        c.lng,
                      ])}
                      pathOptions={{
                        color: "#10b981",
                        weight: 2,
                        fillOpacity: 0.2,
                      }}
                    >
                      <LeafletTooltip direction="top">
                        Khu vực: {area.name}
                      </LeafletTooltip>
                    </Polygon>
                  )}

                  {/* Plot Layer */}
                  {plot && plot.coordinates && (
                    <Polygon
                      positions={plot.coordinates.map((c: any) => [
                        c.lat,
                        c.lng,
                      ])}
                      pathOptions={{
                        color: "#f59e0b",
                        weight: 2,
                        fillOpacity: 0.3,
                      }}
                    >
                      <LeafletTooltip direction="top">
                        Lô: {plot.name}
                      </LeafletTooltip>
                    </Polygon>
                  )}

                  {/* Plant Marker */}
                  <Marker
                    position={[plant.coordinate.lat, plant.coordinate.lng]}
                  >
                    <Popup>
                      <div className="text-xs p-1">
                        <p className="font-bold">{plant.code}</p>
                        <p>{plant.name}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Card>

            <Tabs defaultValue="history">
              <TabsList className="bg-slate-100 p-1 rounded-xl">
                <TabsTrigger
                  value="history"
                  className="rounded-lg px-4 flex gap-2"
                >
                  <History className="w-4 h-4" />
                  Nhật ký canh tác
                </TabsTrigger>
                <TabsTrigger
                  value="health"
                  className="rounded-lg px-4 flex gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Theo dõi sức khỏe
                </TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="m-0 mt-4">
                <DataTable columns={historyColumns} data={HISTORY_DATA} />
              </TabsContent>
              <Card className="mt-4 border-none shadow-sm rounded-2xl overflow-hidden">
                <TabsContent
                  value="health"
                  className="p-12 text-center text-slate-400"
                >
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">
                    Chưa có dữ liệu theo dõi sức khỏe chi tiết
                  </p>
                </TabsContent>
              </Card>
            </Tabs>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b py-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  Thông số sinh trưởng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  <div className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      Chiều cao
                    </span>
                    <span className="font-bold text-slate-900">
                      {plant.height}
                    </span>
                  </div>
                  <div className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <Maximize2 className="w-4 h-4" />
                      Độ rộng tán
                    </span>
                    <span className="font-bold text-slate-900">
                      {plant.canopy}
                    </span>
                  </div>
                  <div className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                      Phạm vi rễ
                    </span>
                    <span className="font-bold text-slate-900">
                      {plant.rootSpread}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-indigo-50/50 rounded-2xl overflow-hidden border border-indigo-100">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Quản lý địa lý
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    Vùng trồng
                  </p>
                  <p className="text-sm font-bold text-indigo-900">
                    {region?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    Khu vực
                  </p>
                  <p className="text-sm font-bold text-indigo-900">
                    {area?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    Lô trồng
                  </p>
                  <p className="text-sm font-bold text-indigo-900">
                    {plot?.name || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PlantIdentificationDetailPage;
