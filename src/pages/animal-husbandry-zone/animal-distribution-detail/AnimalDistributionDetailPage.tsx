import useAnimalDistributionStore from "@/stores/useAnimalDistributionStore";
import {
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
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Download,
  Edit,
  Layers,
  MapPin,
  Sprout,
  Sun,
  Target,
  Trees,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useLocation, useRoute } from "wouter";
import { MOCK_SEEDS } from "./constants";

import PageWrapper from "@/components/PageWrapper";
import defaultMarkerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import defaultMarkerIconUrl from "leaflet/dist/images/marker-icon.png";
import defaultMarkerShadowUrl from "leaflet/dist/images/marker-shadow.png";

// --- Mock Data ---

interface AnimalLocation {
  id: string;
  code: string;
  variety: string;
  status: "healthy" | "warning" | "critical";
  height: number; // cm
  animaledDate: string;
  coordinate: { lat: number; lng: number };
}

type LatLngTuple = [number, number];

const MOCK_DETAIL = {
  id: "dist-1",
  code: "DIST-001",
  name: "Phân bổ Sầu riêng Vùng Alpha",
  scope: "region",
  targetName: "Vùng Bình Phước Alpha",
  method: "zone",
  totalAnimals: 500,
  varieties: [
    { name: "Sầu riêng Ri6", count: 300, color: "#16a34a" },
    { name: "Sầu riêng Monthong", count: 200, color: "#ca8a04" },
  ],
  status: "active",
  animaledDate: "2024-01-15",
  expectedHarvest: "2028-01-15",
  areaSize: 2.5, // hecta
  healthScore: 98, // %
};

// Generate random animal locations
const generateMockAnimals = (count: number): AnimalLocation[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `p-${i}`,
    code: `PLANT-${String(i + 1).padStart(3, "0")}`,
    variety: i % 2 === 0 ? "Sầu riêng Ri6" : "Sầu riêng Monthong",
    status: Math.random() > 0.9 ? "warning" : "healthy",
    height: 80 + Math.floor(Math.random() * 40),
    animaledDate: "2024-01-15",
    coordinate: {
      lat: 11.558 + (Math.random() - 0.5) * 0.002,
      lng: 107.134 + (Math.random() - 0.5) * 0.002,
    },
  }));
};

interface HistoryLog {
  id: string;
  date: string;
  action: string;
  details: string;
  performedBy: string;
  type: "care" | "harvest" | "monitor" | "issue";
}

type HistoryAction = Pick<HistoryLog, "action" | "type" | "details">;

const defaultLeafletIcon = L.icon({
  iconUrl: defaultMarkerIconUrl,
  iconRetinaUrl: defaultMarkerIcon2xUrl,
  shadowUrl: defaultMarkerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapCenterSync = ({ center }: { center: LatLngTuple }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
};

const generateMockHistory = (count: number): HistoryLog[] => {
  const actions: HistoryAction[] = [
    { action: "Tưới nước", type: "care", details: "Tưới nhỏ giọt 30 phút" },
    { action: "Bón phân", type: "care", details: "Bón NPK 20-20-15" },
    { action: "Cắt tỉa", type: "care", details: "Cắt tỉa cành sâu bệnh" },
    {
      action: "Kiểm tra sâu bệnh",
      type: "monitor",
      details: "Phát hiện rệp sáp nhẹ",
    },
    {
      action: "Phun thuốc",
      type: "issue",
      details: "Phun thuốc trừ sâu sinh học",
    },
  ];
  const staff = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];

  return Array.from({ length: count }).map((_, i) => {
    const act = actions[Math.floor(Math.random() * actions.length)];
    const date = new Date();
    date.setDate(date.getDate() - i * 2);

    return {
      id: `h-${i}`,
      date: date.toISOString().split("T")[0],
      action: act.action,
      details: act.details,
      performedBy: staff[Math.floor(Math.random() * staff.length)],
      type: act.type,
    };
  });
};

const AnimalDistributionDetailPage = () => {
  const [, params] = useRoute("/animal-distribution-detail/:id");
  const [, setLocation] = useLocation();
  const { getRecordById, deleteRecord } = useAnimalDistributionStore();
  const [activeTab, setActiveTab] = useState("overview");

  const distributionId = params?.id;
  const detailData = distributionId ? getRecordById(distributionId) : undefined;

  const animals = useMemo<AnimalLocation[]>(() => {
    if (detailData?.animalLocations?.length) {
      return detailData.animalLocations.map((location) => {
        const seed = MOCK_SEEDS.find((item) => item.id === location.seedId);
        return {
          id: location.id,
          code: location.animalCode,
          variety: seed?.name || "Chưa xác định",
          status: "healthy" as const,
          height: 100,
          animaledDate: location.animaledDate,
          coordinate: location.coordinate,
        };
      });
    }
    return generateMockAnimals(50);
  }, [detailData]);

  const history = useMemo(() => generateMockHistory(15), []);

  const handleBack = () => {
    setLocation("/animal-distribution-detail");
  };

  const handleEdit = () => {
    if (!distributionId) return;
    setLocation(`/animal-distribution-detail/${distributionId}/edit`);
  };

  const handleDelete = () => {
    if (!distributionId) return;
    deleteRecord(distributionId);
    setLocation("/animal-distribution-detail");
  };

  if (!detailData) {
    return (
      <PageWrapper title="Không tìm thấy" description="Bản ghi không tồn tại">
        <div className="text-sm text-muted-foreground">
          Chưa có thông tin phân bổ.
        </div>
      </PageWrapper>
    );
  }

  const mapCenter = animals[0]?.coordinate
    ? ([animals[0].coordinate.lat, animals[0].coordinate.lng] as LatLngTuple)
    : ([11.558, 107.134] as LatLngTuple);

  const animalColumns: Column<AnimalLocation>[] = [
    {
      key: "code",
      label: "Mã con vật",
      render: (v: unknown) => (
        <span className="font-mono font-bold text-xs">{String(v)}</span>
      ),
    },
    {
      key: "variety",
      label: "Giống vật nuôi",
      render: (v: unknown) => (
        <Badge variant="secondary" className="font-normal text-xs">
          {String(v)}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Sức khỏe",
      render: (v: unknown) => {
        const status = v as AnimalLocation["status"];
        return (
          <Badge
            className={
              status === "healthy"
                ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200"
            }
            variant="outline"
          >
            {status === "healthy" ? "Tốt" : "Cần chú ý"}
          </Badge>
        );
      },
    },
    {
      key: "height",
      label: "Chiều cao",
      render: (v: unknown) => <span className="text-xs">{String(v)} cm</span>,
    },
    {
      key: "coordinate",
      label: "GPS",
      render: (v: unknown) => {
        const coordinate = v as AnimalLocation["coordinate"];
        return (
          <span className="text-[10px] font-mono text-muted-foreground">
            {coordinate.lat.toFixed(6)}, {coordinate.lng.toFixed(6)}
          </span>
        );
      },
    },
  ];

  const historyColumns: Column<HistoryLog>[] = [
    {
      key: "date",
      label: "Ngày thực hiện",
      render: (v: unknown) => (
        <span className="text-sm text-slate-600">{String(v)}</span>
      ),
    },
    {
      key: "action",
      label: "Hoạt động",
      render: (v: unknown, r: HistoryLog) => (
        <span className="font-medium flex items-center gap-2">
          {r.type === "issue" && (
            <span className="w-2 h-2 rounded-full bg-red-500" />
          )}
          {r.type === "care" && (
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          )}
          {r.type === "monitor" && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
          {String(v)}
        </span>
      ),
    },
    {
      key: "details",
      label: "Chi tiết",
      render: (v: unknown) => <span className="text-sm">{String(v)}</span>,
    },
    {
      key: "performedBy",
      label: "Người thực hiện",
      render: (v: unknown) => (
        <Badge variant="outline" className="font-normal">
          {String(v)}
        </Badge>
      ),
    },
  ];

  return (
    <PageWrapper
      title={detailData.name}
      description={`Mã: ${detailData.code} • Tạo ngày ${detailData.createdAt}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white"
            onClick={handleBack}
          >
            Thoát
          </Button>
          <Button variant="outline" size="sm" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button size="sm" className="shadow-sm" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            Xóa
          </Button>
        </div>
      }
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-slate-100 p-1 rounded-lg border border-slate-200">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Tổng quan
          </TabsTrigger>
          <TabsTrigger
            value="animals"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Danh sách vật nuôi
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Nhật ký chăn nuôi
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm bg-linear-to-br from-indigo-50 to-white ring-1 ring-indigo-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <Trees className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Tổng vật nuôi
                  </div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {detailData.totalAnimals}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-linear-to-br from-emerald-50 to-white ring-1 ring-emerald-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Diện tích phủ
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {MOCK_DETAIL.areaSize} ha
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-linear-to-br from-amber-50 to-white ring-1 ring-amber-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Sức khỏe chung
                  </div>
                  <div className="text-2xl font-bold text-amber-700">
                    {MOCK_DETAIL.healthScore}%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-linear-to-br from-cyan-50 to-white ring-1 ring-cyan-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-cyan-600 shadow-sm border border-cyan-100">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Độ chính xác GPS
                  </div>
                  <div className="text-2xl font-bold text-cyan-700">100%</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Map Visualization */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-lg ring-1 ring-slate-900/5 h-[500px] flex flex-col overflow-hidden">
                <CardHeader className="py-4 px-6 border-b bg-white flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-slate-800">
                      Bản đồ phân bổ
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                      Healthy
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>{" "}
                      Warning
                    </div>
                  </div>
                </CardHeader>
                <div className="flex-1 relative z-0">
                  <MapContainer
                    center={mapCenter}
                    zoom={17}
                    className="h-full w-full"
                    zoomControl={false}
                    scrollWheelZoom
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapCenterSync center={mapCenter} />

                    {animals.map((animal) => (
                      <Marker
                        key={animal.id}
                        position={[
                          animal.coordinate.lat,
                          animal.coordinate.lng,
                        ]}
                        icon={defaultLeafletIcon}
                        title={`${animal.code} - ${animal.variety}`}
                      />
                    ))}
                  </MapContainer>
                </div>
              </Card>
            </div>

            {/* Right Column: Variety AnimalDistribution & Info */}
            <div className="space-y-6">
              <Card className="border-none shadow-md ring-1 ring-slate-900/5">
                <CardHeader className="border-b py-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    Cơ cấu giống vật nuôi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {MOCK_DETAIL.varieties.map((v, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{v.name}</span>
                          <span className="text-muted-foreground">
                            {v.count} cây (
                            {(
                              (v.count / detailData.totalAnimals) *
                              100
                            ).toFixed(0)}
                            %)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(v.count / detailData.totalAnimals) * 100}%`,
                              backgroundColor: v.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md ring-1 ring-slate-900/5">
                <CardHeader className="border-b py-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Thông tin quản lý
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    <div className="p-3 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Phạm vi</span>
                      <Badge variant="outline">{detailData.scope}</Badge>
                    </div>
                    <div className="p-3 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Đối tượng</span>
                      <span className="font-medium text-right max-w-[150px] truncate">
                        {detailData.targetName}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Ngày xuống giống
                      </span>
                      <span className="font-medium">
                        {detailData.createdAt}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Thu hoạch dự kiến
                      </span>
                      <span className="font-medium">
                        {MOCK_DETAIL.expectedHarvest}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="animals">
          <DataTable columns={animalColumns} data={animals} />
        </TabsContent>

        <TabsContent value="history">
          <DataTable columns={historyColumns} data={history} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default AnimalDistributionDetailPage;
