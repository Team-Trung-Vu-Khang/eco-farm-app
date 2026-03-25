import type { PathOptions } from "leaflet";
import type {
  SelectedSoilFeature,
  SoilData,
  SoilFeatureProperties,
  SoilGeoCollection,
  SoilLayerVisibility,
  SoilMetric,
  SoilMetricAnalysis,
  SoilMetricConfigItem,
} from "./types";

const COLOR_GOOD = "#22c55e";
const COLOR_BAD = "#ef4444";
const COLOR_WARNING = "#f97316";

export const DEFAULT_MAP_VIEW = {
  center: [11.558, 107.134] as [number, number],
  zoom: 13,
};

export const PLAN_METRICS: SoilMetric[] = [
  "ph",
  "nitrogen",
  "phosphorus",
  "moisture",
];

export const SUGGESTION_METRICS: SoilMetric[] = [
  "ph",
  "nitrogen",
  "phosphorus",
  "potassium",
  "moisture",
  "compaction",
];

export const METRIC_OPTIONS: { value: SoilMetric; label: string }[] = [
  { value: "ph", label: "Độ pH" },
  { value: "moisture", label: "Độ ẩm" },
  { value: "nitrogen", label: "Nitrogen (N)" },
  { value: "phosphorus", label: "Phosphorus (P)" },
  { value: "potassium", label: "Potassium (K)" },
  { value: "ec", label: "Độ dẫn điện (EC)" },
  { value: "temperature", label: "Nhiệt độ đất" },
  { value: "compaction", label: "Độ nén đất" },
];

export function getMetricAnalysis(
  metric: SoilMetric,
  value: number,
): SoilMetricAnalysis {
  switch (metric) {
    case "ph":
      if (value < 5.5) {
        return {
          status: "bad",
          message: "Đất chua mạnh (Nguy cơ ngộ độc Al, Mn)",
          action: "Bón vôi (CaCO3) hoặc Dolomite. Kiểm tra thoát nước.",
        };
      }
      if (value > 7.5) {
        return {
          status: "bad",
          message: "Đất kiềm (Khó hấp thu vi lượng)",
          action: "Bón lưu huỳnh, thạch cao (Gypsum). Giảm bón vôi.",
        };
      }
      if (value < 6.0) {
        return {
          status: "warning",
          message: "Đất hơi chua",
          action: "Cân nhắc bón lót vôi nhẹ.",
        };
      }
      return {
        status: "good",
        message: "pH tối ưu cho cây trồng (6.0 - 7.5)",
        action: null,
      };
    case "moisture":
      if (value < 40) {
        return {
          status: "warning",
          message: "Thiếu nước (Héo nhẹ)",
          action: "Tưới bổ sung ngay. Kiểm tra hệ thống tưới.",
        };
      }
      if (value > 85) {
        return {
          status: "bad",
          message: "Ngập úng (Thiếu khí)",
          action: "Ngưng tưới, khơi thông rãnh thoát nước.",
        };
      }
      return { status: "good", message: "Độ ẩm lý tưởng", action: null };
    case "nitrogen":
      if (value < 20) {
        return {
          status: "bad",
          message: "Thiếu Đạm (Cây vàng lá)",
          action: "Bón thúc đạm (Ure/SA) hoặc phân hữu cơ hoai mục.",
        };
      }
      if (value > 60) {
        return {
          status: "warning",
          message: "Thừa Đạm",
          action: "Ngưng bón đạm. Tăng Kali để cân đối.",
        };
      }
      return { status: "good", message: "Mức Đạm phù hợp", action: null };
    case "phosphorus":
      if (value < 20) {
        return {
          status: "bad",
          message: "Thiếu Lân (Rễ kém)",
          action: "Bón Super Lân hoặc DAP. Bón lót sâu.",
        };
      }
      return { status: "good", message: "Mức Lân ổn định", action: null };
    case "potassium":
      if (value < 100) {
        return {
          status: "warning",
          message: "Thiếu Kali (Mép lá cháy)",
          action: "Bón bổ sung Kali (KCI/K2SO4).",
        };
      }
      if (value > 300) {
        return {
          status: "bad",
          message: "Thừa Kali (Đối kháng Mg, Ca)",
          action: "Ngưng bón Kali, rửa đất nếu cần.",
        };
      }
      return { status: "good", message: "Mức Kali ổn định", action: null };
    case "compaction":
      if (value > 300) {
        return {
          status: "bad",
          message: "Đất nén chặt nghiêm trọng",
          action: "Cày sâu (sub-soiling), trồng cây che phủ rễ cọc.",
        };
      }
      if (value > 200) {
        return {
          status: "warning",
          message: "Đất bắt đầu bị nén",
          action: "Hạn chế cơ giới hóa nặng. Bổ sung hữu cơ.",
        };
      }
      return { status: "good", message: "Độ tơi xốp tốt", action: null };
    case "ec":
      if (value > 1.5 && value <= 3) {
        return {
          status: "warning",
          message: "Đất hơi mặn",
          action: "Rửa mặn, tưới dư nước.",
        };
      }
      if (value > 3) {
        return {
          status: "bad",
          message: "Đất mặn (Gây hại)",
          action: "Rửa mặn tích cực. Chọn giống chịu mặn.",
        };
      }
      return { status: "good", message: "Không nhiễm mặn", action: null };
    case "temperature":
      if (value < 20) {
        return {
          status: "warning",
          message: "Nhiệt độ thấp (Kém hoạt động vi sinh)",
          action: "Phủ màng phủ nông nghiệp, ủ gốc.",
        };
      }
      if (value > 35) {
        return {
          status: "bad",
          message: "Nhiệt độ cao (Hại rễ)",
          action: "Tưới mát, trồng cây che bóng, phủ rơm rạ.",
        };
      }
      return { status: "good", message: "Nhiệt độ đất tối ưu", action: null };
    default:
      return { status: "good", message: "Chỉ số ổn định", action: null };
  }
}

function getColorByStatus(status: SoilMetricAnalysis["status"]) {
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
}

export const METRIC_CONFIG: Record<SoilMetric, SoilMetricConfigItem> = {
  ph: {
    label: "Độ pH",
    unit: "",
    range: [3, 9],
    description: "Chỉ số độ chua/kiềm ảnh hưởng mức độ hấp thu dinh dưỡng.",
    thresholds: [5.5, 7.0],
    colorScale: (value) => getColorByStatus(getMetricAnalysis("ph", value).status),
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
    colorScale: (value) =>
      getColorByStatus(getMetricAnalysis("moisture", value).status),
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
    colorScale: (value) =>
      getColorByStatus(getMetricAnalysis("nitrogen", value).status),
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
    colorScale: (value) =>
      getColorByStatus(getMetricAnalysis("phosphorus", value).status),
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
    colorScale: (value) =>
      getColorByStatus(getMetricAnalysis("potassium", value).status),
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
    colorScale: (value) => getColorByStatus(getMetricAnalysis("ec", value).status),
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
    colorScale: (value) =>
      getColorByStatus(getMetricAnalysis("temperature", value).status),
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
    colorScale: (value) =>
      getColorByStatus(getMetricAnalysis("compaction", value).status),
    details: {
      ideal: "< 200 psi",
      lowEffect: "Đất quá tơi (hiếm khi là vấn đề, trừ khi xói mòn).",
      highEffect: "Nén chặt >300psi ngăn cản rễ phát triển, kém thoát nước.",
    },
  },
};

export function createRandomSoilData(): SoilData {
  return {
    ph: Number((5.0 + Math.random() * 3).toFixed(1)),
    moisture: Math.floor(40 + Math.random() * 50),
    nitrogen: Math.floor(15 + Math.random() * 60),
    phosphorus: Math.floor(10 + Math.random() * 50),
    potassium: Math.floor(80 + Math.random() * 200),
    ec: Number((0.1 + Math.random() * 2.5).toFixed(2)),
    temperature: Number((22 + Math.random() * 10).toFixed(1)),
    compaction: Math.floor(100 + Math.random() * 250),
    texture: ["Sét pha thịt", "Thịt pha cát", "Đất đỏ Bazan", "Phù sa cổ"][
      Math.floor(Math.random() * 4)
    ],
    organicMatter: Number((1.5 + Math.random() * 3.5).toFixed(1)),
    lastUpdated: new Date().toLocaleDateString("vi-VN"),
  };
}

export function buildSoilDataMap(
  collections: SoilGeoCollection[],
): Map<string, SoilData> {
  const dataMap = new Map<string, SoilData>();

  collections.forEach((collection) => {
    collection.features.forEach((feature, index) => {
      const id = getFeatureId(feature.properties, index);
      dataMap.set(id, createRandomSoilData());
    });
  });

  return dataMap;
}

export function getVisibleLayersByZoom(zoom: number): SoilLayerVisibility {
  if (zoom < 14) {
    return { zone: true, area: false, plot: false };
  }

  if (zoom < 16) {
    return { zone: false, area: true, plot: false };
  }

  return { zone: false, area: false, plot: true };
}

export function getFeatureId(
  properties: SoilFeatureProperties | undefined,
  fallbackIndex = 0,
) {
  return properties?.id?.toString() ?? `auto-${fallbackIndex}`;
}

export function getFeatureName(properties: SoilFeatureProperties | undefined) {
  return properties?.name?.trim() || "Khu vực không tên";
}

export function getFeatureTypeLabel(
  properties: SoilFeatureProperties | undefined,
) {
  if (properties?.areaId) {
    return "Lô canh tác";
  }
  if (properties?.zoneId) {
    return "Khu vực canh tác";
  }
  return "Vùng trồng";
}

export function createSelectedFeature(
  properties: SoilFeatureProperties | undefined,
  data: SoilData,
  fallbackIndex = 0,
): SelectedSoilFeature {
  return {
    id: getFeatureId(properties, fallbackIndex),
    name: getFeatureName(properties),
    type: getFeatureTypeLabel(properties),
    data,
  };
}

export function createFeatureStyle(
  metric: SoilMetric,
  dataMap: Map<string, SoilData>,
  properties: SoilFeatureProperties | undefined,
  fallbackIndex = 0,
): PathOptions {
  const id = getFeatureId(properties, fallbackIndex);
  const data = dataMap.get(id);
  const fillColor = data
    ? METRIC_CONFIG[metric].colorScale(data[metric])
    : "#cccccc";

  return {
    fillColor,
    weight: 1,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

export function createTooltipHtml(
  name: string,
  metric: SoilMetric,
  data: SoilData,
) {
  return `
    <div class="text-sm font-bold">${name}</div>
    <div class="text-xs">
      ${METRIC_CONFIG[metric].label}: ${data[metric]} ${METRIC_CONFIG[metric].unit}
    </div>
  `;
}

export function getFeatureIssues(selectedFeature: SelectedSoilFeature) {
  return PLAN_METRICS.map((metric) => ({
    metric,
    analysis: getMetricAnalysis(metric, selectedFeature.data[metric]),
  })).filter((item) => item.analysis.status !== "good");
}

export function getSuggestionItems(selectedFeature: SelectedSoilFeature) {
  return SUGGESTION_METRICS.map((metric) => ({
    metric,
    analysis: getMetricAnalysis(metric, selectedFeature.data[metric]),
    value: selectedFeature.data[metric],
  })).filter((item) => item.analysis.status !== "good");
}

export function hasOnlyHealthyMetrics(selectedFeature: SelectedSoilFeature) {
  return Object.entries(METRIC_CONFIG).every(([metric]) => {
    const typedMetric = metric as SoilMetric;
    return (
      getMetricAnalysis(typedMetric, selectedFeature.data[typedMetric]).status ===
      "good"
    );
  });
}

export function getGeneratedPlanActions(selectedFeature: SelectedSoilFeature) {
  return PLAN_METRICS.map((metric) =>
    getMetricAnalysis(metric, selectedFeature.data[metric]).action,
  )
    .filter((action): action is string => Boolean(action))
    .map((action) => `- ${action}`)
    .join("\n");
}

export function createPlanIssuesSummary(selectedFeature: SelectedSoilFeature) {
  return getFeatureIssues(selectedFeature)
    .map(({ metric, analysis }) => `${METRIC_CONFIG[metric].label}: ${analysis.message}`)
    .join("; ");
}
