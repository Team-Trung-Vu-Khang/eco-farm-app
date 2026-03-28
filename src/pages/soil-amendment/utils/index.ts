import type {
  AllocationItem,
  AmendmentPlan,
} from "../../../stores/useAmendmentPlanStore";
import type { Regimen } from "../../../stores/useRegimenStore";
import type {
  AmendmentPlanFormData,
  AmendmentProcess,
  GeographicalSelection,
  SelectionSummaryGroup,
  SoilAmendmentRegion,
  StatusConfig,
} from "../types";

export const AMENDMENT_PROCESSES: AmendmentProcess[] = [
  {
    id: "proc-phen",
    name: "Cải tạo đất nhiễm phèn (Tiêu chuẩn)",
    type: "Hóa học + Thủy lợi",
    duration: 30,
    stages: [
      "Thau chua rửa mặn",
      "Bón vôi",
      "Cày ải phơi đất",
      "Bón lót hữu cơ",
    ],
  },
  {
    id: "proc-bacmau",
    name: "Phục hồi đất bạc màu",
    type: "Hữu cơ + Sinh học",
    duration: 45,
    stages: ["Cày sâu", "Trồng cây phân xanh", "Cày vùi", "Bổ sung vi sinh"],
  },
  {
    id: "proc-man",
    name: "Xử lý đất nhiễm mặn",
    type: "Thủy lợi",
    duration: 25,
    stages: ["Rửa mặn", "Bón vôi", "Nghỉ đất"],
  },
];

export const MATERIAL_TYPES = [
  { value: "Phân bón", label: "Phân bón" },
  { value: "Thuốc BVTV", label: "Thuốc BVTV" },
  { value: "Giống", label: "Giống cây trồng" },
  { value: "Nông cụ", label: "Nông cụ & Thiết bị" },
  { value: "Vật tư khác", label: "Vật tư khác" },
] as const;

export const MATERIAL_OPTIONS: Record<
  string,
  { value: string; label: string; unit: string }[]
> = {
  "Phân bón": [
    { value: "Vôi bột", label: "Vôi bột (Xử lý pH)", unit: "kg" },
    { value: "Lân nung chảy", label: "Lân nung chảy (Khử phèn)", unit: "kg" },
    {
      value: "Phân chuồng hoai mục",
      label: "Phân chuồng hoai mục (Hữu cơ)",
      unit: "tấn",
    },
    { value: "Trichoderma", label: "Trichoderma (Nấm đối kháng)", unit: "kg" },
    { value: "Humic Acid", label: "Humic Acid (Kích rễ)", unit: "lít" },
    { value: "Kali Humate", label: "Kali Humate (Giảm mặn)", unit: "lít" },
    { value: "Ure", label: "Phân Ure", unit: "kg" },
    { value: "DAP", label: "Phân DAP", unit: "kg" },
  ],
  "Thuốc BVTV": [
    { value: "Mancozeb", label: "Mancozeb (Trừ nấm)", unit: "kg" },
    { value: "Metalaxyl", label: "Metalaxyl (Trừ nấm đất)", unit: "gói" },
    { value: "Glyphosate", label: "Glyphosate (Trừ cỏ)", unit: "lít" },
    { value: "Abamectin", label: "Abamectin (Trừ sâu)", unit: "chai" },
  ],
  Giống: [
    { value: "Cây giống chịu mặn", label: "Cây giống chịu mặn", unit: "cây" },
    {
      value: "Cây phân xanh",
      label: "Cây phân xanh (Cải tạo đất)",
      unit: "kg",
    },
  ],
  "Nông cụ": [
    { value: "Máy bơm nước", label: "Máy bơm nước", unit: "cái" },
    { value: "Máy cày", label: "Máy cày", unit: "cái" },
    { value: "Cuốc", label: "Cuốc", unit: "cái" },
    { value: "Xẻng", label: "Xẻng", unit: "cái" },
    { value: "Bình xịt", label: "Bình xịt thuốc", unit: "cái" },
  ],
  "Vật tư khác": [
    { value: "Bạt ngăn mặn", label: "Bạt ngăn mặn", unit: "m2" },
    { value: "Ống nước", label: "Ống dẫn nước", unit: "m" },
    { value: "Lưới lọc", label: "Lưới lọc nước", unit: "m2" },
  ],
};

export const MATERIAL_UNITS: Record<string, string[]> = {
  "Phân bón": ["kg", "tấn", "bao", "lít", "can"],
  "Thuốc BVTV": ["lít", "ml", "chai", "gói"],
  Giống: ["cây", "kg", "hom"],
  "Nông cụ": ["cái", "bộ"],
  "Vật tư khác": ["kg", "cái", "cuộn", "m", "m2"],
};

export const TASK_OPTIONS = [
  { value: "Cày sâu 30cm", label: "Cày sâu 30cm" },
  { value: "Bón vôi rải mặt", label: "Bón vôi rải mặt" },
  { value: "Bơm thoát nước", label: "Bơm thoát nước" },
  { value: "Đánh rãnh thoát phèn", label: "Đánh rãnh thoát phèn" },
  { value: "Trồng cây che phủ", label: "Trồng cây che phủ" },
  { value: "Kiểm tra pH đất", label: "Kiểm tra pH đất (Định kỳ)" },
  { value: "Cày xới đất", label: "Cày xới đất" },
  { value: "Bón lót", label: "Bón lót" },
  { value: "Tưới xả phèn", label: "Tưới xả phèn" },
  { value: "Rải vôi", label: "Rải vôi" },
  { value: "Phun chế phẩm sinh học", label: "Phun chế phẩm sinh học" },
  { value: "Vệ sinh đồng ruộng", label: "Vệ sinh đồng ruộng" },
];

export const LABOR_OPTIONS = [
  { value: "1 người", label: "1 người" },
  { value: "2 người", label: "2 người" },
  { value: "3-5 người", label: "3-5 người" },
  { value: "5-10 người", label: "5-10 người" },
  { value: "Cơ giới hóa", label: "Cơ giới hóa (Máy móc)" },
  { value: "Khoán trọn gói", label: "Khoán trọn gói" },
];

export function createInitialAmendmentPlanFormData(): AmendmentPlanFormData {
  return {
    code: "",
    name: "",
    technician: "",
    priority: "medium",
    description: "",
    seasonId: "",
    selectedRegionId: "",
    selectedZoneIds: [],
    crop: "",
    variety: "",
    selectedPlotIds: [],
    currentPH: "",
    targetPH: "",
    targetIssue: "",
    purpose: "amendment",
    processId: "",
    regimenId: "",
    selectedStages: [],
    allocations: [],
    startDate: "",
    endDate: "",
    budget: "",
  };
}

export function deriveSelectionState(
  selections: GeographicalSelection[],
  regions: SoilAmendmentRegion[],
  currentCrop: string,
  currentVariety: string,
) {
  const regionIds = new Set<string>();
  const zoneIds = new Set<string>();
  const plotIds = new Set<string>();
  let crop = currentCrop;
  let variety = currentVariety;

  selections.forEach((selection) => {
    const region = regions.find(
      (item) => String(item.id) === String(selection.regionId),
    );
    if (!region) return;

    if (region.cropVarieties?.length) {
      crop = region.cropVarieties[0].name;
      variety = region.cropVarieties[0].variety;
    }

    regionIds.add(String(region.id));

    if (selection.type === "region") {
      region.subAreas?.forEach((area) => {
        zoneIds.add(String(area.id));
        area.plots?.forEach((plot) => plotIds.add(String(plot.id)));
      });
      return;
    }

    const area = region.subAreas?.find(
      (item) => String(item.id) === String(selection.areaId),
    );
    if (!area) return;

    zoneIds.add(String(area.id));

    if (selection.type === "area") {
      area.plots?.forEach((plot) => plotIds.add(String(plot.id)));
      return;
    }

    if (selection.plotId) {
      plotIds.add(String(selection.plotId));
    }
  });

  return {
    selectedRegionId: Array.from(regionIds)[0] || "",
    selectedZoneIds: Array.from(zoneIds),
    selectedPlotIds: Array.from(plotIds),
    crop,
    variety,
  };
}

export function buildSelectionSummary(
  selections: GeographicalSelection[],
  regions: SoilAmendmentRegion[],
): SelectionSummaryGroup[] {
  const summary: SelectionSummaryGroup[] = [];

  selections.forEach((selection) => {
    const region = regions.find(
      (item) => String(item.id) === String(selection.regionId),
    );
    if (!region) return;

    let group = summary.find(
      (item) => item.regionId === String(selection.regionId),
    );
    if (!group) {
      group = {
        regionId: String(region.id),
        regionName: region.name,
        items: [],
      };
      summary.push(group);
    }

    if (selection.type === "region") {
      group.items.push({
        type: "region",
        id: String(region.id),
        name: "Toàn bộ vùng",
      });
      return;
    }

    const area = region.subAreas?.find(
      (item) => String(item.id) === String(selection.areaId),
    );

    if (selection.type === "area" && area) {
      group.items.push({
        type: "area",
        id: String(area.id),
        name: area.name,
      });
      return;
    }

    const plot = area?.plots?.find(
      (item) => String(item.id) === String(selection.plotId),
    );
    if (plot) {
      group.items.push({
        type: "plot",
        id: String(plot.id),
        name: plot.name,
        parentName: area?.name,
      });
    }
  });

  return summary;
}

export function calculateSelectedArea(
  regions: SoilAmendmentRegion[],
  plotIds: string[],
) {
  const selectedPlotIds = new Set(plotIds.map(String));
  let totalArea = 0;

  regions.forEach((region) => {
    region.subAreas?.forEach((area) => {
      area.plots?.forEach((plot) => {
        if (selectedPlotIds.has(String(plot.id))) {
          totalArea += plot.area || 0;
        }
      });
    });
  });

  return totalArea.toFixed(1);
}

export function buildSelectionsFromPlan(
  plan: AmendmentPlan,
  regions: SoilAmendmentRegion[],
) {
  if (!plan.selectedRegionId || !plan.selectedPlotIds?.length) {
    return {
      selectedEnterpriseId: "",
      selections: [] as GeographicalSelection[],
    };
  }

  const region = regions.find(
    (item) => String(item.id) === String(plan.selectedRegionId),
  );
  if (!region) {
    return {
      selectedEnterpriseId: "",
      selections: [] as GeographicalSelection[],
    };
  }

  const zoneIds = plan.selectedZoneIds || [];
  const plotIds = plan.selectedPlotIds || [];
  const selections: GeographicalSelection[] = [];
  const regionZoneIds = region.subAreas?.map((area) => area.id) || [];
  const isWholeRegion =
    regionZoneIds.length > 0 &&
    regionZoneIds.every((zoneId) => zoneIds.includes(zoneId));

  if (isWholeRegion) {
    selections.push({
      id: `region-${plan.selectedRegionId}`,
      type: "region",
      regionId: plan.selectedRegionId,
    });
  } else {
    region.subAreas?.forEach((area) => {
      if (!zoneIds.includes(area.id)) return;

      const areaPlotIds = area.plots?.map((plot) => plot.id) || [];
      const isWholeArea =
        areaPlotIds.length > 0 &&
        areaPlotIds.every((plotId) => plotIds.includes(plotId));

      if (isWholeArea) {
        selections.push({
          id: `area-${area.id}`,
          type: "area",
          regionId: plan.selectedRegionId!,
          areaId: area.id,
        });
        return;
      }

      area.plots?.forEach((plot) => {
        if (!plotIds.includes(plot.id)) return;
        selections.push({
          id: `plot-${plot.id}`,
          type: "plot",
          regionId: plan.selectedRegionId!,
          areaId: area.id,
          plotId: plot.id,
        });
      });
    });
  }

  return {
    selectedEnterpriseId: region.enterpriseId || "",
    selections,
  };
}

export function getSelectedStages(
  processId: string,
  regimenId: string,
  regimens: Regimen[],
) {
  if (processId) {
    return AMENDMENT_PROCESSES.find((item) => item.id === processId)?.stages || [];
  }

  if (regimenId) {
    const regimen = regimens.find((item) => item.id === regimenId);
    return regimen ? [regimen.name] : [];
  }

  return [];
}

export function createAllocationItem(
  item: Omit<AllocationItem, "id">,
): AllocationItem {
  return { id: Date.now(), ...item };
}

export function getStatusConfig(status: string): StatusConfig {
  switch (status) {
    case "planning":
      return {
        label: "Đang lập kế hoạch",
        variant: "outline",
        className: "text-blue-600 border-blue-200 bg-blue-50",
      };
    case "in_progress":
      return {
        label: "Đang thực hiện",
        variant: "default",
        className: "bg-green-600 hover:bg-green-700",
      };
    case "completed":
      return {
        label: "Hoàn thành",
        variant: "secondary",
        className: "bg-slate-100 text-slate-600",
      };
    case "cancelled":
      return {
        label: "Đã hủy",
        variant: "destructive",
        className: "",
      };
    default:
      return {
        label: "Không xác định",
        variant: "outline",
        className: "",
      };
  }
}

export function buildFilterOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).map((value) => ({
    label: value,
    value,
  }));
}
