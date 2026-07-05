import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Activity,
  Battery,
  ChevronRight,
  Clock,
  Cpu,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  Signal,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  CartesianGrid,
  Tooltip as ChartTooltip,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// Import existing map data
import areaData from "../../../assets/map/area.json";
import plotData from "../../../assets/map/plot.json";
import zoneData from "../../../assets/map/zone.json";
import { MOCK_REGIONS } from "../../region-chart/constants";
import { generateIoTTelemetry, mockIoTDevices } from "../data/mapMockData";
import type { IoTDevice } from "../types";

// --- Helpers (Cloned from MapViewPage) ---

const isPointInPolygon = (point: [number, number], vs: [number, number][]) => {
  const x = point[0],
    y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0],
      yi = vs[i][1];
    const xj = vs[j][0],
      yj = vs[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const getLocationInfo = (lng: number, lat: number) => {
  const findContainer = (data: any) => {
    return data.features.find((f: any) => {
      if (f.geometry.type === "Polygon") {
        return isPointInPolygon([lng, lat], f.geometry.coordinates[0]);
      }
      if (f.geometry.type === "MultiPolygon") {
        return f.geometry.coordinates.some((poly: any[]) =>
          isPointInPolygon([lng, lat], poly[0]),
        );
      }
      return false;
    });
  };

  const zone = findContainer(zoneData);
  const area = findContainer(areaData);
  const plot = findContainer(plotData);

  return {
    zoneName: zone?.properties?.name,
    areaName: area?.properties?.name,
    plotName: plot?.properties?.name,
  };
};

const MapUpdater = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const ZoomListener = ({ onChange }: { onChange: (zoom: number) => void }) => {
  useMapEvents({
    zoomend: (e) => {
      onChange(e.target.getZoom());
    },
  });
  return null;
};

// --- Custom Icons for IoT ---

const getIoTIcon = (type: string, status: string) => {
  let color = "#10b981"; // online
  if (status === "offline") color = "#ef4444";
  if (status === "low_battery") color = "#f59e0b";
  if (status === "alarm") color = "#8b5cf6";

  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      ${
        type === "Gateway"
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'
          : type === "Actuator"
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 22v-4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M22 12h-4"/><path d="m19.07 4.93-2.83 2.83"/></svg>'
      }
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "custom-iot-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const IoTMapViewPage = () => {
  const isFullScreenParam =
    new URLSearchParams(window.location.search).get("fullscreen") === "true";

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    11.558, 107.134,
  ]);
  const [mapZoom, setMapZoom] = useState(15);
  const [visibleLayers, setVisibleLayers] = useState({
    zone: true,
    area: false,
    plot: false,
    device: true,
  });

  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Filter Logic
  const filteredDevices = useMemo(() => {
    return mockIoTDevices.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.mac.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || d.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: mockIoTDevices.length,
      online: mockIoTDevices.filter((d) => d.status === "online").length,
      offline: mockIoTDevices.filter((d) => d.status === "offline").length,
      gateways: mockIoTDevices.filter((d) => d.type === "Gateway").length,
      sensors: mockIoTDevices.filter((d) => d.type === "Sensor").length,
    };
  }, []);

  // Handle Zoom change for layers
  const onZoomChange = (zoom: number) => {
    setMapZoom(zoom);
    if (zoom < 14) {
      setVisibleLayers({ zone: true, area: false, plot: false, device: false });
    } else if (zoom >= 14 && zoom < 16) {
      setVisibleLayers({ zone: false, area: true, plot: false, device: true });
    } else if (zoom >= 16) {
      setVisibleLayers({ zone: true, area: true, plot: true, device: true });
    }
  };

  const handlePing = async (id: string) => {
    setIsPinging(true);
    toast.info("Đang gửi lệnh Ping tới thiết bị...");
    await new Promise((r) => setTimeout(r, 1500));
    setIsPinging(false);
    toast.success("Thiết bị phản hồi tốt! (Latency: 45ms)");
  };

  // Mock Telemetry Data
  const telemetry = useMemo(() => generateIoTTelemetry(40, 10), []);

  return (
    <AdminLayout
      title="Bản đồ Giám sát IoT"
      description="Theo dõi vị trí và trạng thái thiết bị thời gian thực"
    >
      <div
        className={cn(
          "flex flex-col relative w-full",
          isFullScreenParam ? "h-screen w-screen" : "h-[calc(100vh-140px)]",
        )}
      >
        {/* TOP BAR: Stats & Filters */}
        <div className="bg-white border-b px-6 py-4 shadow-sm z-30 shrink-0">
          <div className="flex flex-col gap-4">
            {/* Row 1: Overview and Stats Cards (Distributed & Enlarged Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {/* Total Devices Card */}
              <div className="bg-white hover:bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center gap-4 cursor-pointer hover:-translate-y-1 group">
                <div className="bg-slate-100 group-hover:bg-primary/10 p-3 rounded-xl transition-colors shrink-0">
                  <Cpu className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    Tổng thiết bị
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-tight">
                    {stats.total}
                  </div>
                </div>
              </div>

              {/* Online Devices Card */}
              <div className="bg-emerald-50/30 hover:bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-lg hover:shadow-emerald-100/30 transition-all duration-300 flex items-center gap-4 cursor-pointer hover:-translate-y-1 group">
                <div className="bg-emerald-100/80 p-3 rounded-xl relative shrink-0">
                  <Wifi className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <div className="text-xs text-emerald-600/80 font-bold uppercase tracking-wider mb-0.5">
                    Trực tuyến
                  </div>
                  <div className="text-2xl font-black text-emerald-700 leading-tight">
                    {stats.online}
                  </div>
                </div>
              </div>

              {/* Gateways Card */}
              <div className="bg-white hover:bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center gap-4 cursor-pointer hover:-translate-y-1 group">
                <div className="bg-amber-50 group-hover:bg-amber-100 p-3 rounded-xl transition-colors shrink-0">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    Gateway
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-tight">
                    {stats.gateways}
                  </div>
                </div>
              </div>

              {/* Sensors Card */}
              <div className="bg-white hover:bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center gap-4 cursor-pointer hover:-translate-y-1 group">
                <div className="bg-blue-50 group-hover:bg-blue-100 p-3 rounded-xl transition-colors shrink-0">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    Cảm biến
                  </div>
                  <div className="text-2xl font-black text-slate-800 leading-tight">
                    {stats.sensors}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100/80 my-0.5 hidden md:block" />

            {/* Row 2: Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between w-full">
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Tìm tên, MAC, IMEI..."
                  className="pl-10 h-10 border-slate-200 focus:ring-primary shadow-xs rounded-xl bg-slate-50/30 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Selects Container */}
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                {/* Status Select */}
                <div className="w-full sm:w-[180px]">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full h-10 border-slate-200 rounded-xl shadow-xs bg-slate-50/30 pr-2">
                      <span
                        style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                          minWidth: 0,
                          textAlign: "left",
                        }}
                      >
                        <SelectValue placeholder="Trạng thái mạng" />
                      </span>
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="online">
                        Trực tuyến (Online)
                      </SelectItem>
                      <SelectItem value="offline">
                        Ngoại tuyến (Offline)
                      </SelectItem>
                      <SelectItem value="low_battery">Pin yếu</SelectItem>
                      <SelectItem value="alarm">Cảnh báo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Region Select */}
                <div className="w-full sm:w-[220px]">
                  <Select
                    value={filterRegion}
                    onValueChange={(val) => {
                      setFilterRegion(val);
                      const reg = MOCK_REGIONS.find(
                        (r) => r.id.toString() === val,
                      );
                      if (reg)
                        setMapCenter([
                          reg.coordinates[0].lat,
                          reg.coordinates[0].lng,
                        ]);
                    }}
                  >
                    <SelectTrigger className="w-full h-10 border-slate-200 rounded-xl shadow-xs bg-slate-50/30 pr-2">
                      <span
                        style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                          minWidth: 0,
                          textAlign: "left",
                        }}
                      >
                        <SelectValue placeholder="Chọn vùng trồng" />
                      </span>
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="all">Tất cả vùng trồng</SelectItem>
                      {MOCK_REGIONS.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BODY: Sidebar + Map */}
        <div className="flex flex-1 relative w-full overflow-hidden">
          {/* Left Sidebar: ONLY Device List */}
          <div className="w-80 shrink-0 border-r bg-card flex flex-col h-full shadow-lg z-20">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Danh sách thiết bị ({filteredDevices.length})
                </h4>
                {filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className={cn(
                      "p-3 rounded-xl border transition-all cursor-pointer group",
                      selectedDevice?.id === device.id
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-white border-slate-100 hover:border-primary/30",
                    )}
                    onClick={() => {
                      setSelectedDevice(device);
                      setMapCenter([device.lat, device.lng]);
                      setMapZoom(18);
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">
                        {device.name}
                      </div>
                      <Badge
                        variant={
                          device.status === "online" ? "default" : "destructive"
                        }
                        className="text-[9px] h-4 px-1"
                      >
                        {device.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {device.mac}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-600">
                        <Battery
                          className={cn(
                            "w-3 h-3",
                            device.batteryLevel < 20
                              ? "text-rose-500"
                              : "text-emerald-500",
                          )}
                        />
                        {device.batteryLevel}%
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-600">
                        <Wifi className="w-3 h-3 text-blue-500" />
                        {device.rssi} dBm
                      </div>
                    </div>
                  </div>
                ))}
                {filteredDevices.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    Không tìm thấy thiết bị nào phù hợp.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Center: Map */}
          <div className="flex-1 relative">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapUpdater center={mapCenter} zoom={mapZoom} />
              <ZoomListener onChange={onZoomChange} />

              {visibleLayers.zone && (
                <GeoJSON
                  data={zoneData as any}
                  style={{
                    color: "#2b8cbe",
                    weight: 2,
                    fillOpacity: 0.1,
                    dashArray: "5, 5",
                  }}
                />
              )}
              {visibleLayers.area && (
                <GeoJSON
                  data={areaData as any}
                  style={{ color: "#f03b20", weight: 2, fillOpacity: 0.05 }}
                />
              )}
              {visibleLayers.plot && (
                <GeoJSON
                  data={plotData as any}
                  style={{ color: "#31a354", weight: 2, fillOpacity: 0.1 }}
                />
              )}

              {visibleLayers.device &&
                filteredDevices.map((device) => (
                  <Marker
                    key={device.id}
                    position={[device.lat, device.lng]}
                    icon={getIoTIcon(device.type, device.status)}
                    eventHandlers={{
                      click: () => setSelectedDevice(device),
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[260px]">
                        <div className="font-bold text-primary text-base mb-2 border-b pb-1">
                          {device.name}
                        </div>
                        <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-2 text-xs">
                          <span className="text-slate-500">MAC:</span>
                          <span className="font-mono font-bold text-slate-700 break-all text-right">
                            {device.mac}
                          </span>

                          <span className="text-slate-500">Trạng thái:</span>
                          <span
                            className={cn(
                              "font-bold text-right",
                              device.status === "online"
                                ? "text-emerald-600"
                                : "text-rose-600",
                            )}
                          >
                            {device.status.toUpperCase()}
                          </span>

                          <span className="text-slate-500">Pin:</span>
                          <span className="font-bold text-right text-slate-700">
                            {device.batteryLevel}%
                          </span>
                        </div>

                        <Separator className="my-3" />

                        <Button
                          size="sm"
                          className="w-full h-9 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none"
                          onClick={() =>
                            window.open(`/iot-device/${device.id}`, "_blank")
                          }
                        >
                          Xem chi tiết kỹ thuật
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>

            {/* Map Controls (Absolute) */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
              <Button
                size="icon"
                className="shadow-md"
                onClick={() => setMapZoom((z) => z + 1)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="shadow-md"
                onClick={() => setMapZoom((z) => z - 1)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="shadow-md"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Legend (Bottom Right) */}
            <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-slate-200 min-w-[180px]">
              <h5 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">
                Chú thích thiết bị
              </h5>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />{" "}
                  Online / Ổn định
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-rose-500" /> Offline
                  / Mất kết nối
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-fuchsia-500" /> Cảnh
                  báo hệ thống
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-amber-500" /> Pin yếu
                  (&lt; 20%)
                </div>
                <Separator className="my-2" />
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Cpu className="w-3 h-3" /> Gateway Trung tâm
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Zap className="w-3 h-3" /> Cảm biến / Van
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Device Details */}
          {selectedDevice && (
            <div className="w-96 shrink-0 border-l bg-slate-50 flex flex-col h-full animate-in slide-in-from-right-5 fade-in z-20">
              <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Signal className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">
                      Thông số kỹ thuật
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {selectedDevice.imei}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDevice(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  {/* Status Overview Card */}
                  <Card className="border-none shadow-sm overflow-hidden bg-white">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase mb-1">
                            Thiết bị
                          </div>
                          <h4 className="text-lg font-bold text-slate-800">
                            {selectedDevice.name}
                          </h4>
                        </div>
                        <Badge
                          className={cn(
                            "px-2 py-1",
                            selectedDevice.status === "online"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700",
                          )}
                        >
                          {selectedDevice.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-1">
                            <Battery className="w-3 h-3" /> Năng lượng
                          </div>
                          <div className="text-xl font-bold text-slate-700">
                            {selectedDevice.batteryLevel}%
                          </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-1">
                            <Wifi className="w-3 h-3" /> Tín hiệu
                          </div>
                          <div className="text-xl font-bold text-slate-700">
                            {selectedDevice.rssi}{" "}
                            <span className="text-xs font-normal">dBm</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Telemetry Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Dữ liệu đo đạc (Telemetry)
                    </h4>
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                      <CardContent className="p-0">
                        <div className="h-48 w-full pt-4 pr-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={telemetry}
                              margin={{
                                top: 5,
                                right: 5,
                                left: -20,
                                bottom: 0,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f1f5f9"
                                vertical={false}
                              />
                              <XAxis
                                dataKey="time"
                                stroke="#94a3b8"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                interval={6}
                              />
                              <YAxis
                                stroke="#94a3b8"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                              />
                              <ChartTooltip
                                contentStyle={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "8px",
                                  fontSize: "10px",
                                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="value"
                                name="Giá trị"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="p-4 border-t bg-slate-50/50">
                          <Button
                            variant="ghost"
                            className="w-full text-xs h-8 text-primary font-bold"
                            onClick={() =>
                              window.open(
                                `/iot-device/${selectedDevice.id}`,
                                "_blank",
                              )
                            }
                          >
                            Xem báo cáo phân tích sâu
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button
                      className="bg-primary text-white hover:bg-primary/90"
                      disabled={isPinging}
                      onClick={() => handlePing(selectedDevice.id)}
                    >
                      {isPinging ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wifi className="w-4 h-4 mr-2" />
                      )}
                      Ping Test
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-200"
                      onClick={() =>
                        window.open(
                          `/iot-device/${selectedDevice.id}`,
                          "_blank",
                        )
                      }
                    >
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Cấu hình
                    </Button>
                  </div>

                  {/* Location Info */}
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                    <div className="text-[10px] font-bold text-blue-500 uppercase mb-2">
                      Vị trí thực địa
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs flex justify-between">
                        <span className="text-slate-500">Tọa độ:</span>
                        <span className="font-mono">
                          {selectedDevice.lat.toFixed(6)},{" "}
                          {selectedDevice.lng.toFixed(6)}
                        </span>
                      </div>
                      {(() => {
                        const loc = getLocationInfo(
                          selectedDevice.lng,
                          selectedDevice.lat,
                        );
                        return (
                          <>
                            {loc.zoneName && (
                              <div className="text-xs flex justify-between">
                                <span className="text-slate-500">Vùng:</span>
                                <span className="font-bold">
                                  {loc.zoneName}
                                </span>
                              </div>
                            )}
                            {loc.plotName && (
                              <div className="text-xs flex justify-between">
                                <span className="text-slate-500">Lô:</span>
                                <span className="font-bold">
                                  {loc.plotName}
                                </span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default IoTMapViewPage;
