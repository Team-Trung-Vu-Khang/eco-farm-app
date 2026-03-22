import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronLeft,
  Edit,
  Download,
  MapPin,
  Trees,
  Sprout,
  Calendar,
  MoreVertical,
  Target,
  Layers,
  Search,
  Filter,
  Droplets,
  Sun,
  Plus,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Mock Data ---

// Fix Leaflet default marker
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface PlantLocation {
  id: string;
  code: string;
  variety: string;
  status: "healthy" | "warning" | "critical";
  height: number; // cm
  plantedDate: string;
  coordinate: { lat: number; lng: number };
}

const MOCK_DETAIL = {
  id: "dist-1",
  code: "DIST-001",
  name: "Phân bổ Sầu riêng Vùng Alpha",
  scope: "region",
  targetName: "Vùng Bình Phước Alpha",
  method: "zone",
  totalPlants: 500,
  varieties: [
    { name: "Sầu riêng Ri6", count: 300, color: "#16a34a" },
    { name: "Sầu riêng Monthong", count: 200, color: "#ca8a04" },
  ],
  status: "active",
  plantedDate: "2024-01-15",
  expectedHarvest: "2028-01-15",
  areaSize: 2.5, // hecta
  healthScore: 98, // %
};

// Generate random plant locations
const generateMockPlants = (count: number): PlantLocation[] => {
  return Array.from({ length: 50 }).map((_, i) => ({
    id: `p-${i}`,
    code: `PLANT-${String(i + 1).padStart(3, "0")}`,
    variety: i % 2 === 0 ? "Sầu riêng Ri6" : "Sầu riêng Monthong",
    status: Math.random() > 0.9 ? "warning" : "healthy",
    height: 80 + Math.floor(Math.random() * 40),
    plantedDate: "2024-01-15",
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

const generateMockHistory = (count: number): HistoryLog[] => {
  const actions = [
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
      type: act.type as any,
    };
  });
};

const DistributionDetailPage = () => {
  const [, params] = useRoute("/distribution-detail/:id");
  const [, setLocation] = useLocation();
  const [plants, setPlants] = useState<PlantLocation[]>([]);
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate fetching data
    setPlants(generateMockPlants(50));
    setHistory(generateMockHistory(15));
  }, []);

  const handleBack = () => {
    setLocation("/distribution-detail");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Custom Icon for Map
  const createCustomIcon = (status: string) => {
    const color = status === "healthy" ? "#22c55e" : "#f59e0b";
    return L.divIcon({
      html: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="${color}" stroke="white" stroke-width="2"/></svg>`,
      className: "bg-transparent",
      iconSize: [12, 12],
    });
  };

  const plantColumns = [
    {
      key: "code",
      label: "Mã cây",
      render: (v: string) => (
        <span className="font-mono font-bold text-xs">{v}</span>
      ),
    },
    {
      key: "variety",
      label: "Giống cây",
      render: (v: string) => (
        <Badge variant="secondary" className="font-normal text-xs">
          {v}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Sức khỏe",
      render: (v: string) => (
        <Badge
          className={
            v === "healthy"
              ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
              : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200"
          }
          variant="outline"
        >
          {v === "healthy" ? "Tốt" : "Cần chú ý"}
        </Badge>
      ),
    },
    {
      key: "height",
      label: "Chiều cao",
      render: (v: number) => <span className="text-xs">{v} cm</span>,
    },
    {
      key: "coordinate",
      label: "GPS",
      render: (v: any) => (
        <span className="text-[10px] font-mono text-muted-foreground">
          {v.lat.toFixed(6)}, {v.lng.toFixed(6)}
        </span>
      ),
    },
  ];

  const historyColumns = [
    {
      key: "date",
      label: "Ngày thực hiện",
      render: (v: string) => (
        <span className="text-sm text-slate-600">{v}</span>
      ),
    },
    {
      key: "action",
      label: "Hoạt động",
      render: (v: string, r: HistoryLog) => (
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
          {v}
        </span>
      ),
    },
    {
      key: "details",
      label: "Chi tiết",
      render: (v: string) => <span className="text-sm">{v}</span>,
    },
    {
      key: "performedBy",
      label: "Người thực hiện",
      render: (v: string) => (
        <Badge variant="outline" className="font-normal">
          {v}
        </Badge>
      ),
    },
  ];

  return (
    <AdminLayout
      title={MOCK_DETAIL.name}
      description={`Mã: ${MOCK_DETAIL.code} • Tạo ngày ${MOCK_DETAIL.plantedDate}`}
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
          <Button size="sm" className="shadow-sm">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
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
            value="plants"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Danh sách cây trồng
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Nhật ký canh tác
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
                    Tổng cây trồng
                  </div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {MOCK_DETAIL.totalPlants}
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
                    center={[11.558, 107.134]}
                    zoom={17}
                    style={{ height: "100%", width: "100%" }}
                    className="z-0"
                  >
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution="Esri"
                    />
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />
                    {plants.map((plant) => (
                      <Marker
                        key={plant.id}
                        position={[plant.coordinate.lat, plant.coordinate.lng]}
                        icon={createCustomIcon(plant.status)}
                      >
                        <Popup>
                          <div className="p-1">
                            <div className="font-bold text-sm mb-1">
                              {plant.code}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {plant.variety}
                            </div>
                            <div
                              className={`text-xs mt-1 font-medium ${plant.status === "healthy" ? "text-green-600" : "text-amber-600"}`}
                            >
                              Status: {plant.status}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </Card>
            </div>

            {/* Right Column: Variety Distribution & Info */}
            <div className="space-y-6">
              <Card className="border-none shadow-md ring-1 ring-slate-900/5">
                <CardHeader className="border-b py-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-green-600" />
                    Cơ cấu giống cây
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
                              (v.count / MOCK_DETAIL.totalPlants) *
                              100
                            ).toFixed(0)}
                            %)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(v.count / MOCK_DETAIL.totalPlants) * 100}%`,
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
                      <Badge variant="outline">{MOCK_DETAIL.scope}</Badge>
                    </div>
                    <div className="p-3 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Đối tượng</span>
                      <span className="font-medium text-right max-w-[150px] truncate">
                        {MOCK_DETAIL.targetName}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Ngày xuống giống
                      </span>
                      <span className="font-medium">
                        {MOCK_DETAIL.plantedDate}
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

        <TabsContent value="plants">
          <DataTable columns={plantColumns} data={plants} />
        </TabsContent>

        <TabsContent value="history">
          <DataTable columns={historyColumns} data={history} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default DistributionDetailPage;
