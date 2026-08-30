import useAquacultureDistributionStore from "@/stores/useAquacultureDistributionStore";
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
  Droplets,
  Edit,
  Fish,
  Gauge,
  MapPin,
  Target,
  Waves,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useLocation, useRoute } from "wouter";

import PageWrapper from "@/components/PageWrapper";
import defaultMarkerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import defaultMarkerIconUrl from "leaflet/dist/images/marker-icon.png";
import defaultMarkerShadowUrl from "leaflet/dist/images/marker-shadow.png";

type LatLngTuple = [number, number];

export type AquacultureStatus = "healthy" | "warning" | "critical";

export type AquacultureUnit = {
  id: string;
  code: string;
  name: string;
  species: string;
  status: AquacultureStatus;
  weight: number;
  stockedDate: string;
  coordinate: { lat: number; lng: number };
};

export type HistoryLog = {
  id: string;
  date: string;
  action: string;
  details: string;
  performedBy: string;
  type: "feeding" | "monitor" | "treatment" | "care";
};

type HistoryAction = Pick<HistoryLog, "action" | "type" | "details">;

export type AquacultureDistribution = {
  id: string;
  code: string;
  name: string;
  scope: string;
  targetName: string;
  method: string;
  totalStock: number;
  status: "active" | "monitoring";
  stockedDate: string;
  expectedHarvest: string;
  areaSize: number;
  healthScore: number;
  waterTemp: number;
  salinity: number;
  varieties: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  units: AquacultureUnit[];
  center: LatLngTuple;
  polygon: LatLngTuple[];
};

const defaultLeafletIcon = L.icon({
  iconUrl: defaultMarkerIconUrl,
  iconRetinaUrl: defaultMarkerIcon2xUrl,
  shadowUrl: defaultMarkerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const MOCK_DISTRIBUTIONS: AquacultureDistribution[] = [
  {
    id: "aq-dist-1",
    code: "AQD-001",
    name: "Phân bổ tôm thẻ Cần Giờ",
    scope: "Vùng nuôi tôm Cần Giờ",
    targetName: "Khu nuôi tôm Cần Giờ",
    method: "Nuôi thâm canh tuần hoàn",
    totalStock: 48000,
    status: "active",
    stockedDate: "2026-03-12",
    expectedHarvest: "2026-10-20",
    areaSize: 2.5,
    healthScore: 97,
    waterTemp: 29.1,
    salinity: 16.8,
    varieties: [
      { name: "Tôm thẻ chân trắng", count: 32000, color: "#16a34a" },
      { name: "Tôm sú giống", count: 16000, color: "#ca8a04" },
    ],
    center: [10.403, 106.804],
    polygon: [
      [10.399, 106.799],
      [10.399, 106.809],
      [10.407, 106.81],
      [10.408, 106.801],
    ],
    units: [
      {
        id: "aq-unit-1",
        code: "AQU-001",
        name: "Ao nuôi số 1",
        species: "Tôm thẻ chân trắng",
        status: "healthy",
        weight: 18,
        stockedDate: "2026-03-12",
        coordinate: { lat: 10.4028, lng: 106.8035 },
      },
      {
        id: "aq-unit-2",
        code: "AQU-002",
        name: "Ao nuôi số 2",
        species: "Tôm thẻ chân trắng",
        status: "healthy",
        weight: 17,
        stockedDate: "2026-03-14",
        coordinate: { lat: 10.404, lng: 106.8052 },
      },
      {
        id: "aq-unit-3",
        code: "AQU-003",
        name: "Ao ươm giống",
        species: "Tôm sú giống",
        status: "warning",
        weight: 9,
        stockedDate: "2026-04-02",
        coordinate: { lat: 10.4052, lng: 106.8029 },
      },
    ],
  },
  {
    id: "aq-dist-2",
    code: "AQD-002",
    name: "Phân bổ cá rô phi Long Sơn",
    scope: "Khu nuôi thủy sản Long Sơn",
    targetName: "Ao nuôi số 2",
    method: "Nuôi bán thâm canh",
    totalStock: 36000,
    status: "monitoring",
    stockedDate: "2026-04-20",
    expectedHarvest: "2026-11-15",
    areaSize: 3.1,
    healthScore: 89,
    waterTemp: 28.4,
    salinity: 11.2,
    varieties: [
      { name: "Cá rô phi đơn tính", count: 24000, color: "#0ea5e9" },
      { name: "Cá mú chấm nâu", count: 12000, color: "#7c3aed" },
    ],
    center: [10.457, 106.85],
    polygon: [
      [10.454, 106.846],
      [10.455, 106.855],
      [10.46, 106.857],
      [10.462, 106.848],
    ],
    units: [
      {
        id: "aq-unit-4",
        code: "AQU-004",
        name: "Bè nuôi số 4",
        species: "Cá rô phi đơn tính",
        status: "healthy",
        weight: 22,
        stockedDate: "2026-04-20",
        coordinate: { lat: 10.4562, lng: 106.8492 },
      },
      {
        id: "aq-unit-5",
        code: "AQU-005",
        name: "Bè nuôi số 5",
        species: "Cá mú chấm nâu",
        status: "critical",
        weight: 19,
        stockedDate: "2026-04-22",
        coordinate: { lat: 10.4578, lng: 106.8507 },
      },
    ],
  },
];

const MapSync = ({ center }: { center: LatLngTuple }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
};

const buildClosedPath = (coordinates: LatLngTuple[]) => {
  if (coordinates.length < 3) return [];
  const path = [...coordinates];
  const [firstLat, firstLng] = path[0];
  const [lastLat, lastLng] = path[path.length - 1];
  if (firstLat !== lastLat || firstLng !== lastLng) {
    path.push([firstLat, firstLng]);
  }
  return path;
};

const generateMockHistory = (count: number): HistoryLog[] => {
  const actions: HistoryAction[] = [
    {
      action: "Cho ăn",
      type: "feeding",
      details: "Cho ăn theo khẩu phần buổi sáng",
    },
    {
      action: "Kiểm tra chất lượng nước",
      type: "monitor",
      details: "Đo pH, oxy hòa tan và độ mặn",
    },
    {
      action: "Sục khí",
      type: "care",
      details: "Bật quạt nước trong 45 phút",
    },
    {
      action: "Xử lý ao",
      type: "treatment",
      details: "Bổ sung khoáng và men vi sinh",
    },
  ];
  const staff = ["Nguyễn Văn Hải", "Trần Thị Mai", "Lê Minh Khoa"];

  return Array.from({ length: count }).map((_, index) => {
    const action = actions[index % actions.length];
    const date = new Date();
    date.setDate(date.getDate() - index * 2);

    return {
      id: `aq-h-${index}`,
      date: date.toISOString().split("T")[0],
      action: action.action,
      details: action.details,
      performedBy: staff[index % staff.length],
      type: action.type,
    };
  });
};

const AquacultureDistributionDetailPage = () => {
  const [, params] = useRoute("/aquaculture-distribution-detail/:id");
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { getRecordById, deleteRecord } = useAquacultureDistributionStore();

  const distributionId = params?.id;
  const detailData = useMemo(() => {
    if (!distributionId) return MOCK_DISTRIBUTIONS[0];
    return getRecordById(distributionId) || MOCK_DISTRIBUTIONS[0];
  }, [distributionId, getRecordById]);

  const units = useMemo(() => detailData?.units || [], [detailData]);
  const history = useMemo(() => generateMockHistory(15), []);

  const handleBack = () => {
    setLocation("/aquaculture-distribution-detail");
  };

  const handleEdit = () => {
    if (!distributionId) return;
    setLocation("/aquaculture-distribution-detail/create");
  };

  const handleDelete = () => {
    if (!distributionId) return;
    deleteRecord(distributionId);
    setLocation("/aquaculture-distribution-detail");
  };

  if (!detailData) {
    return (
      <PageWrapper title="Không tìm thấy" description="Bản ghi không tồn tại">
        <div className="text-sm text-muted-foreground">
          Chưa có thông tin phân bổ thủy sản.
        </div>
      </PageWrapper>
    );
  }

  const mapCenter = detailData.center;
  const polygonPath = buildClosedPath(detailData.polygon);

  const unitColumns: Column<AquacultureUnit>[] = [
    {
      key: "code",
      label: "Mã ô",
      render: (value: unknown) => (
        <span className="font-mono font-bold text-xs">{String(value)}</span>
      ),
    },
    {
      key: "name",
      label: "Tên ô nuôi",
      render: (value: unknown, item: AquacultureUnit) => (
        <div>
          <div className="font-semibold text-slate-800 text-sm">
            {String(value)}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {item.species}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value: unknown) => {
        const status = value as AquacultureUnit["status"];
        const meta: Record<
          AquacultureUnit["status"],
          { label: string; className: string }
        > = {
          healthy: {
            label: "Tốt",
            className:
              "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
          },
          warning: {
            label: "Theo dõi",
            className:
              "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
          },
          critical: {
            label: "Cảnh báo",
            className:
              "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
          },
        };

        return (
          <Badge className={meta[status].className} variant="outline">
            {meta[status].label}
          </Badge>
        );
      },
    },
    {
      key: "weight",
      label: "Cỡ trung bình",
      render: (value: unknown) => (
        <span className="text-xs">{String(value)} g</span>
      ),
    },
    {
      key: "coordinate",
      label: "GPS",
      render: (value: unknown) => {
        const coordinate = value as AquacultureUnit["coordinate"];
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
      render: (value: unknown) => (
        <span className="text-sm text-slate-600">{String(value)}</span>
      ),
    },
    {
      key: "action",
      label: "Hoạt động",
      render: (value: unknown, record: HistoryLog) => (
        <span className="font-medium flex items-center gap-2">
          {record.type === "treatment" && (
            <span className="w-2 h-2 rounded-full bg-red-500" />
          )}
          {record.type === "feeding" && (
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          )}
          {record.type === "monitor" && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
          {record.type === "care" && (
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
          )}
          {String(value)}
        </span>
      ),
    },
    {
      key: "details",
      label: "Chi tiết",
      render: (value: unknown) => (
        <span className="text-sm">{String(value)}</span>
      ),
    },
    {
      key: "performedBy",
      label: "Người thực hiện",
      render: (value: unknown) => (
        <Badge variant="outline" className="font-normal">
          {String(value)}
        </Badge>
      ),
    },
  ];

  return (
    <PageWrapper
      title={detailData.name}
      description={`Mã: ${detailData.code} • Tạo ngày ${detailData.stockedDate}`}
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
            value="units"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Danh sách ô nuôi
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Nhật ký nuôi trồng
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm bg-linear-to-br from-indigo-50 to-white ring-1 ring-indigo-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <Fish className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Tổng con giống
                  </div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {detailData.totalStock.toLocaleString("vi-VN")}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-linear-to-br from-emerald-50 to-white ring-1 ring-emerald-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Diện tích ao nuôi
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {detailData.areaSize} ha
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-linear-to-br from-amber-50 to-white ring-1 ring-amber-50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Sức khỏe chung
                  </div>
                  <div className="text-2xl font-bold text-amber-700">
                    {detailData.healthScore}%
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
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Healthy
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
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
                    <MapSync center={mapCenter} />
                    {polygonPath.length > 0 ? (
                      <Polygon
                        positions={polygonPath}
                        pathOptions={{
                          color: "#0ea5e9",
                          weight: 3,
                          fillColor: "#0ea5e9",
                          fillOpacity: 0.12,
                        }}
                      />
                    ) : null}
                    {units.map((unit) => (
                      <Marker
                        key={unit.id}
                        position={[unit.coordinate.lat, unit.coordinate.lng]}
                        icon={defaultLeafletIcon}
                        title={`${unit.code} - ${unit.name}`}
                      />
                    ))}
                  </MapContainer>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-md ring-1 ring-slate-900/5">
                <CardHeader className="border-b py-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Waves className="w-4 h-4 text-cyan-600" />
                    Cơ cấu giống thủy sản
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {detailData.varieties.map((variety, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{variety.name}</span>
                          <span className="text-muted-foreground">
                            {variety.count.toLocaleString("vi-VN")} con (
                            {(
                              (variety.count / detailData.totalStock) *
                              100
                            ).toFixed(0)}
                            %)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(variety.count / detailData.totalStock) * 100}%`,
                              backgroundColor: variety.color,
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
                        Ngày thả giống
                      </span>
                      <span className="font-medium">
                        {detailData.stockedDate}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Thu hoạch dự kiến
                      </span>
                      <span className="font-medium">
                        {detailData.expectedHarvest}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Nhiệt độ nước
                      </span>
                      <span className="font-medium">
                        {detailData.waterTemp} °C
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Độ mặn</span>
                      <span className="font-medium">
                        {detailData.salinity} ppt
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="units">
          <DataTable columns={unitColumns} data={units} />
        </TabsContent>

        <TabsContent value="history">
          <DataTable columns={historyColumns} data={history} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default AquacultureDistributionDetailPage;
