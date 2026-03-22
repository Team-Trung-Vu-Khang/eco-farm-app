import { useState, useMemo, useEffect } from "react";
import {
  AdminLayout,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Label,
  Input,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui"; // Assuming Dialog components exist or I will fallback to simple UI if not.
// Checking imports, Dialog might be in ui/dialog. If not in shared-ui export, I will stick to sidebar expansion.
// The user imports suggest @Team-Trung-Vu-Khang/eco-shared-ui has basic components. I'll check if Dialog is available.
// If not, I'll use a simple conditional rendering for a modal or just expanding the sidebar content.
// "Label" was removed previously, I should re-add it if I use it. I'll assume standard components.

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Feature } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FlaskConical,
  Maximize2,
  Minimize2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sprout,
  ClipboardList,
} from "lucide-react";

// ... (Imports data) ...
// Import GeoJSON data directly
import zoneData from "../../../assets/map/zone.json";
import areaData from "../../../assets/map/area.json";
import plotData from "../../../assets/map/plot.json";

// ... (Types & Interfaces) ...
type SoilMetric =
  | "ph"
  | "moisture"
  | "nitrogen"
  | "phosphorus"
  | "potassium"
  | "ec"
  | "temperature"
  | "compaction";

interface SoilData {
  ph: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ec: number;
  temperature: number;
  compaction: number;
  texture: string;
  organicMatter: number;
  lastUpdated: string;
}

// ... (Helpers - getSuggestion logic) ...
const MapUpdater = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

const ZoomListener = ({ onChange }: { onChange: (zoom: number) => void }) => {
  const map = useMapEvents({
    zoomend: () => onChange(map.getZoom()),
  });
  return null;
};

// Colors based on User Request
// Tốt: Xanh (Green)
// Xấu: Cam (Orange)
// Cảnh báo: Cam đỏ (Red-Orange)
const COLOR_GOOD = "#22c55e"; // Green-500
const COLOR_BAD = "#ef4444"; // Orange-500
const COLOR_WARNING = "#f97316"; // Red-500 (Cam đỏ - Red)

const getMetricAnalysis = (metric: SoilMetric, value: number) => {
  switch (metric) {
    case "ph":
      if (value < 5.5)
        return {
          status: "bad",
          message: "Đất chua mạnh (Nguy cơ ngộ độc Al, Mn)",
          action: "Bón vôi (CaCO3) hoặc Dolomite. Kiểm tra thoát nước.",
        };
      if (value > 7.5)
        return {
          status: "bad",
          message: "Đất kiềm (Khó hấp thu vi lượng)",
          action: "Bón lưu huỳnh, thạch cao (Gypsum). Giảm bón vôi.",
        };
      if (value < 6.0)
        return {
          status: "warning",
          message: "Đất hơi chua",
          action: "Cân nhắc bón lót vôi nhẹ.",
        };
      return {
        status: "good",
        message: "pH tối ưu cho cây trồng (6.0 - 7.5)",
        action: null,
      };
    case "moisture":
      if (value < 40)
        return {
          status: "warning",
          message: "Thiếu nước (Héo nhẹ)",
          action: "Tưới bổ sung ngay. Kiểm tra hệ thống tưới.",
        };
      if (value > 85)
        return {
          status: "bad",
          message: "Ngập úng (Thiếu khí)",
          action: "Ngưng tưới, khơi thông rãnh thoát nước.",
        };
      return { status: "good", message: "Độ ẩm lý tưởng", action: null };
    case "nitrogen":
      if (value < 20)
        return {
          status: "bad",
          message: "Thiếu Đạm (Cây vàng lá)",
          action: "Bón thúc đạm (Ure/SA) hoặc phân hữu cơ hoai mục.",
        };
      if (value > 60)
        return {
          status: "warning",
          message: "Thừa Đạm",
          action: "Ngưng bón đạm. Tăng Kali để cân đối.",
        };
      return { status: "good", message: "Mức Đạm phù hợp", action: null };
    case "phosphorus":
      if (value < 20)
        return {
          status: "bad",
          message: "Thiếu Lân (Rễ kém)",
          action: "Bón Super Lân hoặc DAP. Bón lót sâu.",
        };
      return { status: "good", message: "Mức Lân ổn định", action: null }; // P toxicity rare
    case "potassium":
      if (value < 100)
        return {
          status: "warning",
          message: "Thiếu Kali (Mép lá cháy)",
          action: "Bón bổ sung Kali (KCI/K2SO4).",
        };
      if (value > 300)
        return {
          status: "bad",
          message: "Thừa Kali (Đối kháng Mg, Ca)",
          action: "Ngưng bón Kali, rửa đất nếu cần.",
        };
      return { status: "good", message: "Mức Kali ổn định", action: null };
    case "compaction":
      if (value > 300)
        return {
          status: "bad",
          message: "Đất nén chặt nghiêm trọng",
          action: "Cày sâu (sub-soiling), trồng cây che phủ rễ cọc.",
        };
      if (value > 200)
        return {
          status: "warning",
          message: "Đất bắt đầu bị nén",
          action: "Hạn chế cơ giới hóa nặng. Bổ sung hữu cơ.",
        };
      return { status: "good", message: "Độ tơi xốp tốt", action: null };
    case "ec":
      if (value > 1.5 && value <= 3)
        return {
          status: "warning",
          message: "Đất hơi mặn",
          action: "Rửa mặn, tưới dư nước.",
        };
      if (value > 3)
        return {
          status: "bad",
          message: "Đất mặn (Gây hại)",
          action: "Rửa mặn tích cực. Chọn giống chịu mặn.",
        };
      return { status: "good", message: "Không nhiễm mặn", action: null };
    case "temperature":
      if (value < 20)
        return {
          status: "warning",
          message: "Nhiệt độ thấp (Kém hoạt động vi sinh)",
          action: "Phủ màng phủ nông nghiệp, ủ gốc.",
        };
      if (value > 35)
        return {
          status: "bad",
          message: "Nhiệt độ cao (Hại rễ)",
          action: "Tưới mát, trồng cây che bóng, phủ rơm rạ.",
        };
      return { status: "good", message: "Nhiệt độ đất tối ưu", action: null };
    default:
      return { status: "good", message: "Chỉ số ổn định", action: null };
  }
};

const getColorByStatus = (status: string) => {
  switch (status) {
    case "good":
      return COLOR_GOOD;
    case "bad":
      return COLOR_BAD;
    case "warning":
      return COLOR_WARNING;
    default:
      return COLOR_GOOD;
  }
};

const METRIC_CONFIG: Record<
  SoilMetric,
  {
    label: string;
    unit: string;
    range: [number, number];
    colorScale: (val: number) => string;
    description: string;
    thresholds?: number[]; // [low, high]
    // Research-based details
    details: {
      ideal: string;
      lowEffect: string;
      highEffect: string;
      source?: string;
    };
  }
> = {
  ph: {
    label: "Độ pH",
    unit: "",
    range: [3, 9],
    description: "Chỉ số độ chua/kiềm ảnh hưởng mức độ hấp thu dinh dưỡng.",
    thresholds: [5.5, 7.0],
    colorScale: (val) => getColorByStatus(getMetricAnalysis("ph", val).status),
    details: {
      ideal: "6.0 - 7.0 (Trung tính)",
      lowEffect:
        "Ngộ độc Nhôm (Al), Mangan (Mn); thiếu Lân (P), Canxi (Ca), Magie (Mg).",
      highEffect: "Thiếu vi lượng (Fe, Mn, Zn, Cu, B); đất bị kiềm hóa.",
      source: "USDA/Agricultural Ext.",
    },
  },
  moisture: {
    label: "Độ ẩm",
    unit: "%",
    range: [0, 100],
    description: "Tỷ lệ nước trong đất (so với dung tích ruộng).",
    thresholds: [50, 80],
    colorScale: (val) =>
      getColorByStatus(getMetricAnalysis("moisture", val).status),
    details: {
      ideal: "60% - 80% dung tích ruộng",
      lowEffect: "Cây héo, giảm quang hợp, rối loạn vận chuyển dinh dưỡng.",
      highEffect: "Ngạt rễ, thối rễ, phát sinh nấm bệnh.",
    },
  },
  nitrogen: {
    label: "Nitrogen (N)",
    unit: "ppm",
    range: [0, 100],
    description: "Hàm lượng Đạm dễ tiêu (NO3- + NH4+).",
    thresholds: [20, 50],
    colorScale: (val) =>
      getColorByStatus(getMetricAnalysis("nitrogen", val).status),
    details: {
      ideal: "20 - 50 ppm",
      lowEffect: "Cây còi cọc, lá vàng (chlorosis), giảm năng suất.",
      highEffect: "Cây phát triển vống, yếu, dễ đổ, chậm ra hoa/quả.",
    },
  },
  phosphorus: {
    label: "Phosphorus (P)",
    unit: "ppm",
    range: [0, 100],
    description: "Hàm lượng Lân dễ tiêu (Bray P1/Olsen).",
    thresholds: [20, 50],
    colorScale: (val) =>
      getColorByStatus(getMetricAnalysis("phosphorus", val).status),
    details: {
      ideal: "20 - 50 ppm",
      lowEffect: "Rễ kém phát triển, lá tím/đỏ, chậm trưởng thành.",
      highEffect: "Cản trở hấp thu Kẽm (Zn), Sắt (Fe).",
    },
  },
  potassium: {
    label: "Potassium (K)",
    unit: "ppm",
    range: [0, 400],
    description: "Hàm lượng Kali dễ tiêu.",
    thresholds: [100, 200],
    colorScale: (val) =>
      getColorByStatus(getMetricAnalysis("potassium", val).status),
    details: {
      ideal: "100 - 200 ppm",
      lowEffect: "Mép lá cháy, cây yếu, dễ nhiễm bệnh/sâu hại.",
      highEffect: "Cản trở hấp thu Magie (Mg), Canxi (Ca).",
    },
  },
  ec: {
    label: "Độ dẫn điện (EC)",
    unit: "dS/m",
    range: [0, 4],
    description: "Độ mặn/Tổng muối tan trong đất.",
    thresholds: [0, 1.2],
    colorScale: (val) => getColorByStatus(getMetricAnalysis("ec", val).status),
    details: {
      ideal: "< 1.2 dS/m (không mặn)",
      lowEffect: "Thường không hại (trừ khi thiếu dinh dưỡng khoáng).",
      highEffect:
        "Gây áp suất thẩm thấu cao, cây không hút được nước (hạn sinh lý).",
    },
  },
  temperature: {
    label: "Nhiệt độ đất",
    unit: "°C",
    range: [10, 50],
    description: "Nhiệt độ tầng đất mặt (0-10cm).",
    thresholds: [20, 32],
    colorScale: (val) =>
      getColorByStatus(getMetricAnalysis("temperature", val).status),
    details: {
      ideal: "20°C - 30°C",
      lowEffect: "Giảm hoạt động vi sinh vật, rễ kém hấp thu P.",
      highEffect: "Phân hủy hữu cơ quá nhanh, chết rễ non.",
    },
  },
  compaction: {
    label: "Độ nén",
    unit: "psi",
    range: [0, 500],
    description: "Độ cứng của đất (Cone Index).",
    thresholds: [0, 200],
    colorScale: (val) =>
      getColorByStatus(getMetricAnalysis("compaction", val).status),
    details: {
      ideal: "< 200 psi",
      lowEffect: "Đất quá tơi (hiếm khi là vấn đề, trừ khi xói mòn).",
      highEffect: "Nén chặt >300psi ngăn cản rễ phát triển, kém thoát nước.",
    },
  },
};

const getRandomSoilData = (): SoilData => {
  // Generate realistic distributions (mostly normal/good range)
  return {
    ph: Number((5.0 + Math.random() * 3).toFixed(1)), // 5.0 - 8.0
    moisture: Math.floor(40 + Math.random() * 50), // 40 - 90 %
    nitrogen: Math.floor(15 + Math.random() * 60), // 15 - 75 ppm
    phosphorus: Math.floor(10 + Math.random() * 50), // 10 - 60 ppm
    potassium: Math.floor(80 + Math.random() * 200), // 80 - 280 ppm
    ec: Number((0.1 + Math.random() * 2.5).toFixed(2)), // 0.1 - 2.6
    temperature: Number((22 + Math.random() * 10).toFixed(1)), // 22 - 32 C
    compaction: Math.floor(100 + Math.random() * 250), // 100 - 350 psi
    texture: ["Sét pha thịt", "Thịt pha cát", "Đất đỏ Bazan", "Phù sa cổ"][
      Math.floor(Math.random() * 4)
    ],
    organicMatter: Number((1.5 + Math.random() * 3.5).toFixed(1)),
    lastUpdated: new Date().toLocaleDateString("vi-VN"),
  };
};

const SoilAmendmentMapPage = () => {
  // Check for fullscreen param
  const isFullScreenParam =
    new URLSearchParams(window.location.search).get("fullscreen") === "true";

  // ... use existing state ...
  const [activeMetric, setActiveMetric] = useState<SoilMetric>("ph");
  const [mapViewState] = useState<{ center: [number, number]; zoom: number }>({
    center: [11.558, 107.134],
    zoom: 13,
  });

  // Plan Management State
  const [createdPlans, setCreatedPlans] = useState<
    {
      id: string;
      regionId: string;
      regionName: string;
      issues: string;
      actions: string;
      startDate: string;
      assignedTo: string;
      status: "planned" | "in_progress" | "completed";
      createdAt: string;
    }[]
  >([]);

  const [planForm, setPlanForm] = useState({
    startDate: new Date().toISOString().split("T")[0],
    assignedTo: "",
    customAction: "",
  });
  const [selectedFeature, setSelectedFeature] = useState<{
    id: string;
    name: string;
    type: string;
    data: SoilData;
  } | null>(null);
  const [visibleLayers, setVisibleLayers] = useState({
    zone: true,
    area: true,
    plot: true,
  });

  // Plan Creation Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleFullScreen = () => {
    if (isFullScreenParam) {
      // If already in new tab fullscreen, maybe close it? Or just do nothing.
      window.close();
    } else {
      // Open new tab
      window.open(
        `${window.location.pathname}?fullscreen=true`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  // Force map resize when sidebar toggles
  useEffect(() => {
    const timers = [100, 300, 500].map((t) =>
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, t),
    );
    return () => timers.forEach(clearTimeout);
  }, [isSidebarCollapsed]);

  // ... useMemo for soilDataMap ...
  const soilDataMap = useMemo(() => {
    const map = new Map<string, SoilData>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [
      ...((zoneData as any).features || []),
      ...((areaData as any).features || []),
      ...((plotData as any).features || []),
    ].forEach((f: any, index) => {
      const id = f.properties?.id
        ? f.properties.id.toString()
        : `auto-${index}`;
      if (!f.properties) f.properties = {};
      if (!f.properties.id) f.properties.id = id;
      map.set(id, getRandomSoilData());
    });
    return map;
  }, []);

  // ... onZoomChange ...
  const onZoomChange = (zoom: number) => {
    if (zoom < 14) {
      setVisibleLayers({ zone: true, area: false, plot: false });
    } else if (zoom >= 14 && zoom < 16) {
      setVisibleLayers({ zone: false, area: true, plot: false });
    } else {
      setVisibleLayers({ zone: false, area: false, plot: true });
    }
  };

  // ... getStyle ...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStyle = (feature: any) => {
    const id = feature.properties?.id?.toString();
    const data = id ? soilDataMap.get(id) : undefined;
    const config = METRIC_CONFIG[activeMetric];
    let fillColor = "#cccccc";
    if (data) {
      // @ts-ignore
      fillColor = config.colorScale(data[activeMetric]);
    }
    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  // ... onEachFeature ...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = soilDataMap.get((feature.properties as any)?.id?.toString());
    if (data) {
      layer.bindTooltip(
        `
            <div class="text-sm font-bold">${feature.properties?.name}</div>
            <div class="text-xs">
              ${METRIC_CONFIG[activeMetric].label}: ${data[activeMetric as keyof SoilData]} ${METRIC_CONFIG[activeMetric].unit}
            </div>
          `,
        { sticky: true, direction: "top" },
      );
    }
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.8,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.7,
        });
      },
      click: (e) => {
        L.DomEvent.stopPropagation(e);
        if (data) {
          setSelectedFeature({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: (feature.properties as any)?.id,
            name: feature.properties?.name || "Khu vực không tên",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: (feature.properties as any)?.regionId
              ? "Khu vực canh tác"
              : "Vùng trồng",
            data: data,
          });
        }
      },
    });
  };

  const handleCreatePlan = () => {
    if (!selectedFeature) return;

    // Calculate issues
    const metrics: SoilMetric[] = ["ph", "nitrogen", "phosphorus", "moisture"];
    const issues = metrics
      .map((m) => {
        // @ts-ignore
        const analysis = getMetricAnalysis(m, selectedFeature.data[m]);
        return { metric: m, analysis };
      })
      .filter((item) => item.analysis.status !== "good")
      .map(
        (item) =>
          `${METRIC_CONFIG[item.metric].label}: ${item.analysis.message}`,
      )
      .join("; ");

    const newPlan = {
      id: `plan-${Date.now()}`,
      regionId: selectedFeature.id,
      regionName: selectedFeature.name,
      issues,
      actions: planForm.customAction,
      startDate: planForm.startDate,
      assignedTo: planForm.assignedTo,
      status: "planned" as const,
      createdAt: new Date().toISOString(),
    };

    setCreatedPlans([...createdPlans, newPlan]);
    setIsPlanModalOpen(false);
    alert(`Đã tạo kế hoạch cải tạo cho ${selectedFeature.name} thành công!`);

    // Reset form (keep date)
    setPlanForm((prev) => ({
      ...prev,
      customAction: "",
      assignedTo: "",
    }));
  };

  // Populate form when modal opens
  useEffect(() => {
    if (isPlanModalOpen && selectedFeature) {
      const generatedActions = (
        ["ph", "nitrogen", "phosphorus", "moisture"] as SoilMetric[]
      )
        // @ts-ignore
        .map((m) => getMetricAnalysis(m, selectedFeature.data[m]).action)
        .filter(Boolean)
        .map((a) => `- ${a}`)
        .join("\n");

      setPlanForm((prev) => ({
        ...prev,
        customAction: generatedActions,
      }));
    }
  }, [isPlanModalOpen, selectedFeature]);

  // Controls Component
  const MapControls = () => (
    <div className="flex gap-2 bg-white/50 backdrop-blur p-1 rounded-lg border shadow-sm">
      <Select
        value={activeMetric}
        onValueChange={(v) => setActiveMetric(v as SoilMetric)}
      >
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Chọn chỉ số" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ph">Độ pH</SelectItem>
          <SelectItem value="moisture">Độ ẩm</SelectItem>
          <SelectItem value="nitrogen">Nitrogen (N)</SelectItem>
          <SelectItem value="phosphorus">Phosphorus (P)</SelectItem>
          <SelectItem value="potassium">Potassium (K)</SelectItem>
          <SelectItem value="ec">Độ dẫn điện (EC)</SelectItem>
          <SelectItem value="temperature">Nhiệt độ đất</SelectItem>
          <SelectItem value="compaction">Độ nén đất</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={handleFullScreen}>
        {isFullScreenParam ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  const MainContent = (
    <div
      className={`flex bg-background relative group ${
        isFullScreenParam ? "h-screen w-screen" : "h-[calc(100vh-140px)]"
      }`}
    >
      {/* Sidebar Info */}
      <div
        className={`shrink-0 border-r bg-card flex flex-col h-full transition-all duration-300 ${
          isSidebarCollapsed ? "w-0 border-none overflow-hidden" : "w-[350px]"
        }`}
      >
        <Card
          className={`h-full border-none shadow-md bg-white/80 backdrop-blur flex flex-col transition-all duration-300 ${!selectedFeature ? "opacity-50 pointer-events-none grayscale" : ""}`}
        >
          {/* Header */}
          <div className="p-4 border-b bg-muted/30">
            {selectedFeature ? (
              <>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-background">
                    {selectedFeature.type}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground bg-white px-2 py-1 rounded-full border">
                    ID: {selectedFeature.id}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground leading-tight">
                  {selectedFeature.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ClipboardList className="w-3 h-3" />
                  Cập nhật: {selectedFeature.data.lastUpdated}
                </p>
              </>
            ) : (
              <div className="h-16 flex items-center justify-center text-muted-foreground">
                Select a region
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 p-4">
            {selectedFeature && (
              <div className="space-y-6">
                {/* Active Metric Analysis */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Chỉ số đang xem
                    </Label>
                    {/* @ts-ignore */}
                    <StatusBadge
                      analysis={getMetricAnalysis(
                        activeMetric,
                        selectedFeature.data[activeMetric],
                      )}
                    />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <FlaskConical className="w-16 h-16" />
                    </div>
                    <div className="relative z-10000">
                      <div className="text-3xl font-black text-slate-800">
                        {/* @ts-ignore */}
                        {selectedFeature.data[activeMetric]}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          {METRIC_CONFIG[activeMetric].unit}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-slate-600 mb-1">
                        {METRIC_CONFIG[activeMetric].label}
                      </div>
                      {/* Analysis Text */}
                      {/* @ts-ignore */}
                      <p className="text-xs text-slate-500 mt-2 p-2 bg-white/50 rounded-lg border border-slate-100">
                        {/* @ts-ignore */}
                        {
                          getMetricAnalysis(
                            activeMetric,
                            selectedFeature.data[activeMetric],
                          ).message
                        }
                      </p>
                    </div>
                  </div>

                  {/* Research Details Block */}
                  <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50 text-xs text-slate-600">
                    <div className="font-semibold text-blue-700 mb-2 flex items-center gap-1.5 border-b border-blue-100 pb-1">
                      <ClipboardList className="w-3.5 h-3.5" /> Tham chiếu chuẩn
                      (Research)
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Ngưỡng tối ưu:
                        </span>
                        <span className="font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-blue-100">
                          {METRIC_CONFIG[activeMetric].details.ideal}
                        </span>
                      </div>
                      <div className="grid gap-1.5 pt-1">
                        <div className="flex gap-2 items-start">
                          <span className="text-amber-600 font-medium whitespace-nowrap w-12 shrink-0">
                            Thấp:
                          </span>
                          <span className="leading-tight">
                            {METRIC_CONFIG[activeMetric].details.lowEffect}
                          </span>
                        </div>
                        <div className="flex gap-2 items-start">
                          <span className="text-red-500 font-medium whitespace-nowrap w-12 shrink-0">
                            Cao:
                          </span>
                          <span className="leading-tight">
                            {METRIC_CONFIG[activeMetric].details.highEffect}
                          </span>
                        </div>
                      </div>
                      {METRIC_CONFIG[activeMetric].details.source && (
                        <div className="text-[10px] text-right text-muted-foreground mt-1 italic">
                          Nguồn: {METRIC_CONFIG[activeMetric].details.source}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detailed Suggestions */}
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <Sprout className="w-4 h-4 text-green-600" />
                    Đề xuất cải tạo
                  </h3>
                  <div className="space-y-2">
                    {(
                      [
                        "ph",
                        "nitrogen",
                        "phosphorus",
                        "potassium",
                        "moisture",
                        "compaction",
                      ] as SoilMetric[]
                    ).map((metric) => {
                      // @ts-ignore
                      const analysis = getMetricAnalysis(
                        metric,
                        selectedFeature.data[metric],
                      );
                      if (analysis.status === "good") return null;
                      return (
                        <div
                          key={metric}
                          className="flex gap-3 items-start p-3 rounded-lg border bg-amber-50/50 border-amber-100"
                        >
                          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs font-bold text-slate-700 flex justify-between">
                              {METRIC_CONFIG[metric].label}
                              {/* @ts-ignore */}
                              <span className="font-normal text-slate-500">
                                ({selectedFeature.data[metric]})
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              {analysis.message}
                            </div>
                            {analysis.action && (
                              <div className="mt-2 text-xs font-medium text-amber-700 bg-amber-100/50 px-2 py-1 rounded inline-flex items-center gap-1">
                                <ArrowRight className="w-3 h-3" />
                                {analysis.action}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Fallback if everything is good */}
                    {/* @ts-ignore */}
                    {Object.keys(selectedFeature.data).every((k) => {
                      const metricKey = k as SoilMetric;
                      if (!METRIC_CONFIG[metricKey]) return true;
                      return (
                        getMetricAnalysis(
                          metricKey,
                          selectedFeature.data[metricKey] as number,
                        ).status === "good"
                      );
                    }) && (
                      <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Chất lượng đất rất tốt! Không cần cải tạo.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-4 border-t bg-slate-50">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 shadow-lg transition-all hover:scale-[1.02]"
              onClick={() => setIsPlanModalOpen(true)}
            >
              <Sprout className="w-4 h-4 mr-2" />
              Tạo kế hoạch cải tạo
            </Button>
          </div>
        </Card>
      </div>

      {/* Map View */}
      <div className="flex-1 relative bg-slate-100 z-0 group/map">
        {/* Fullscreen Param: Overlay Controls */}
        {isFullScreenParam && (
          <div className="absolute top-3 right-22 z-500">
            <MapControls />
          </div>
        )}

        {/* Stable Overlay Container for Toggle Sidebar Button when Fullscreen (Collapsible) */}
        {!isFullScreenParam && (
          <div className="absolute top-4 right-16 z-500 pointer-events-none">
            {isSidebarCollapsed && (
              <Button
                variant="secondary"
                size="icon"
                className="shadow-md bg-white/90 backdrop-blur pointer-events-auto"
                onClick={() => setIsSidebarCollapsed(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Collapsible Sidebar Toggle (Optional enhancement) */}
        {isFullScreenParam && isSidebarCollapsed && (
          <div className="absolute top-4 left-4 z-500">
            <Button
              variant="secondary"
              onClick={() => setIsSidebarCollapsed(false)}
            >
              Show Sidebar
            </Button>
          </div>
        )}

        <MapContainer
          center={mapViewState.center}
          zoom={mapViewState.zoom}
          className="h-full w-full bg-slate-100 z-0"
        >
          <MapUpdater center={mapViewState.center} zoom={mapViewState.zoom} />
          <ZoomListener onChange={onZoomChange} />
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Bản đồ chuẩn">
              <TileLayer
                attribution="&copy; Check"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Vệ tinh">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </LayersControl.BaseLayer>
            {/* Dynamic Data Layers */}
            {visibleLayers.zone && (
              <LayersControl.Overlay checked name="Vùng (Zone)">
                {/* @ts-ignore */}
                <GeoJSON
                  key={`zone-${activeMetric}`}
                  data={zoneData as any}
                  style={getStyle}
                  onEachFeature={onEachFeature}
                />
              </LayersControl.Overlay>
            )}
            {visibleLayers.area && (
              <LayersControl.Overlay checked name="Khu vực (Area)">
                {/* @ts-ignore */}
                <GeoJSON
                  key={`area-${activeMetric}`}
                  data={areaData as any}
                  style={getStyle}
                  onEachFeature={onEachFeature}
                />
              </LayersControl.Overlay>
            )}
            {visibleLayers.plot && (
              <LayersControl.Overlay checked name="Lô (Plot)">
                {/* @ts-ignore */}
                <GeoJSON
                  key={`plot-${activeMetric}`}
                  data={plotData as any}
                  style={getStyle}
                  onEachFeature={onEachFeature}
                />
              </LayersControl.Overlay>
            )}
          </LayersControl>
          {/* Legend Overlay - Kept simple from previous steps */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg z-100000 border border-border w-48">
            <h4 className="font-bold text-xs mb-1 uppercase tracking-wider text-muted-foreground">
              {METRIC_CONFIG[activeMetric].label}
            </h4>
            <p className="text-[10px] text-muted-foreground mb-2 leading-tight">
              {METRIC_CONFIG[activeMetric].description}
            </p>
            <div className="flex justify-between text-[10px] font-medium mb-1">
              <span>{METRIC_CONFIG[activeMetric].range[0]}</span>
              <span>
                {METRIC_CONFIG[activeMetric].range[1]}{" "}
                {METRIC_CONFIG[activeMetric].unit}
              </span>
            </div>
            <div className="h-3 w-full rounded-full border border-black/5 relative overflow-hidden">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(to right, ${METRIC_CONFIG[activeMetric].colorScale(METRIC_CONFIG[activeMetric].range[0])}, ${METRIC_CONFIG[activeMetric].colorScale((METRIC_CONFIG[activeMetric].range[0] + METRIC_CONFIG[activeMetric].range[1]) / 2)}, ${METRIC_CONFIG[activeMetric].colorScale(METRIC_CONFIG[activeMetric].range[1])})`,
                }}
              ></div>
            </div>
          </div>
        </MapContainer>
      </div>
    </div>
  );

  // If FullScreen Param is set, render without Admin Layout
  if (isFullScreenParam) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-background">
        {MainContent}

        {/* Plan Creation Dialog (Copy from below or extract) */}
        {/* We need to render the dialog here too */}
        <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {/* Same content as below */}
            <DialogHeader>
              <DialogTitle>Tạo kế hoạch cải tạo đất</DialogTitle>
              <DialogDescription>
                Lập kế hoạch dựa trên phân tích số liệu của khu vực{" "}
                <strong>{selectedFeature?.name}</strong>.
              </DialogDescription>
            </DialogHeader>
            {selectedFeature && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Vấn đề chính</Label>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-sm text-amber-800">
                    <ul className="list-disc pl-4 space-y-1">
                      {(
                        [
                          "ph",
                          "nitrogen",
                          "phosphorus",
                          "moisture",
                        ] as SoilMetric[]
                      ).map((m) => {
                        // @ts-ignore
                        const a = getMetricAnalysis(m, selectedFeature.data[m]);
                        if (a.status !== "good")
                          return (
                            <li key={m}>
                              <strong>{METRIC_CONFIG[m].label}:</strong>{" "}
                              {a.message}
                            </li>
                          );
                        return null;
                      })}
                    </ul>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Hành động đề xuất</Label>
                  <Textarea
                    className="h-24"
                    value={planForm.customAction}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, customAction: e.target.value })
                    }
                    placeholder="Nhập các hành động cải tạo..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ngày bắt đầu dự kiến</Label>
                    <Input
                      type="date"
                      value={planForm.startDate}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Người phụ trách</Label>
                    <Select
                      value={planForm.assignedTo}
                      onValueChange={(v) =>
                        setPlanForm({ ...planForm, assignedTo: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhân sự" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Nguyễn Văn A</SelectItem>
                        <SelectItem value="2">Trần Thị B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPlanModalOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreatePlan}>Xác nhận tạo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <AdminLayout
      title="Bản đồ cải tạo đất"
      description="Phân tích chất lượng đất và kế hoạch cải tạo"
      actions={<MapControls />}
    >
      {MainContent}

      {/* Plan Creation Dialog */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tạo kế hoạch cải tạo đất</DialogTitle>
            <DialogDescription>
              Lập kế hoạch dựa trên phân tích số liệu của khu vực{" "}
              <strong>{selectedFeature?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          {selectedFeature && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Vấn đề chính</Label>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-sm text-amber-800">
                  <ul className="list-disc pl-4 space-y-1">
                    {(
                      [
                        "ph",
                        "nitrogen",
                        "phosphorus",
                        "moisture",
                      ] as SoilMetric[]
                    ).map((m) => {
                      // @ts-ignore
                      const a = getMetricAnalysis(m, selectedFeature.data[m]);
                      if (a.status !== "good")
                        return (
                          <li key={m}>
                            <strong>{METRIC_CONFIG[m].label}:</strong>{" "}
                            {a.message}
                          </li>
                        );
                      return null;
                    })}
                  </ul>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hành động đề xuất</Label>
                <Textarea
                  className="h-24"
                  value={planForm.customAction}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, customAction: e.target.value })
                  }
                  placeholder="Nhập các hành động cải tạo..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày bắt đầu dự kiến</Label>
                  <Input
                    type="date"
                    value={planForm.startDate}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Người phụ trách</Label>
                  <Select
                    value={planForm.assignedTo}
                    onValueChange={(v) =>
                      setPlanForm({ ...planForm, assignedTo: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhân sự" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Nguyễn Văn A</SelectItem>
                      <SelectItem value="2">Trần Thị B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreatePlan}>Xác nhận tạo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

// Simple Component for Status Badge
const StatusBadge = ({
  analysis,
}: {
  analysis: { status: string; message: string };
}) => {
  if (analysis.status === "good")
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200 gap-1"
      >
        <CheckCircle2 className="w-3 h-3" /> Tốt
      </Badge>
    );
  if (analysis.status === "warning")
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-amber-700 border-red-200 gap-1"
      >
        <AlertCircle className="w-3 h-3" /> Cảnh báo
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="bg-amber-50 text-red-700 border-amber-200 gap-1"
    >
      <AlertCircle className="w-3 h-3" /> Xấu
    </Badge>
  );
};

export default SoilAmendmentMapPage;
