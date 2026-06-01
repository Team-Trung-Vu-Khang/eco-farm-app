import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface CultivationRegionConfig {
  farmingMethodId: string;
  irrigationMethodId: string;
  selectedCrops: string[];
  seedSelections?: Record<string, string[]>;
}

export interface CultivationRegion {
  id: string;
  name: string;
  scope: "region" | "area" | "plot";
  targetIds: string[]; // IDs of the selected regions, areas, or plots
  targetName: string;
  enterpriseId?: string;
  certificateIds: string[];
  managerIds: string[];
  note: string;
  farmingMethodId: string;
  irrigationMethodId: string;
  selectedCrops: string[];
  seedSelections?: Record<string, string[]>;
  configs?: Record<string, CultivationRegionConfig>;
  status: "active" | "inactive";
  createdAt: string;
}

interface CultivationRegionState {
  areas: CultivationRegion[];
  isLoading: boolean;
  error: string | null;

  addArea: (
    area: Omit<CultivationRegion, "id" | "createdAt" | "status">,
  ) => void;
  updateArea: (id: string, area: Partial<CultivationRegion>) => void;
  deleteArea: (id: string) => void;
  getAreaById: (id: string) => CultivationRegion | undefined;
}

const MOCK_DATA: CultivationRegion[] = [
  {
    name: "Vùng canh tác lúa chất lượng cao 3",
    scope: "area",
    targetIds: ["sub-1-1", "sub-1-2", "5"],
    targetName:
      "Khu A - Lúa ST25, Khu B - Lúa OM5451, Khu Phức hợp Nông nghiệp Công nghệ cao",
    enterpriseId: "1",
    certificateIds: ["ISO22000", "Organic"],
    managerIds: ["1", "2", "3", "4", "5"],
    note: "Mô hình canh tác lúa chất lượng cao, tối ưu nước tưới và truy xuất nguồn gốc theo từng khu vực.",
    farmingMethodId: "organic",
    irrigationMethodId: "drip",
    selectedCrops: ["5"],
    seedSelections: {
      "5": ["6", "9"],
    },
    configs: {
      "area-config": {
        farmingMethodId: "organic",
        selectedCrops: ["5"],
        seedSelections: {
          "5": ["6", "9"],
        },
        irrigationMethodId: "drip",
      },
    },
    id: "ca-1772278404110",
    status: "active",
    createdAt: "2026-02-28",
  },
  {
    name: "Vùng canh tác lúa công nghệ cao 2",
    scope: "region",
    targetIds: ["1", "3"],
    targetName: "Vùng Đồng Tháp Mười Alpha, Cánh đồng lúa Buôn Ma Thuột",
    enterpriseId: "1",
    certificateIds: ["GlobalGAP", "HACCP", "Organic"],
    managerIds: ["1"],
    note: "Vùng sản xuất lúa theo quy trình giảm phát thải, quản lý đồng ruộng bằng dữ liệu số.",
    farmingMethodId: "organic",
    irrigationMethodId: "drip",
    selectedCrops: ["5"],
    seedSelections: {
      "5": ["6", "7", "8"],
    },
    configs: {
      "area-config": {
        farmingMethodId: "organic",
        irrigationMethodId: "drip",
        selectedCrops: ["5"],
        seedSelections: {
          "5": ["6", "7", "8"],
        },
      },
    },
    id: "ca-1772278286585",
    status: "active",
    createdAt: "2026-02-28",
  },
  {
    id: "ca-1",
    name: "Canh tác Lúa Công nghệ cao",
    scope: "region",
    targetIds: ["1"],
    targetName: "Vùng Đồng Tháp Mười Alpha",
    certificateIds: ["VietGAP"],
    enterpriseId: "DN001",
    managerIds: ["1"],
    note: "Dự án thử nghiệm công nghệ 4.0 trong quản lý ruộng lúa, theo dõi sinh trưởng và cảnh báo sâu bệnh.",
    farmingMethodId: "greenhouse",
    irrigationMethodId: "drip",
    selectedCrops: ["5"],
    configs: {
      "region-main": {
        farmingMethodId: "greenhouse",
        irrigationMethodId: "drip",
        selectedCrops: ["5"],
      },
    },
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "ca-2",
    name: "Khu vực trồng Lúa ST25 Xuất khẩu",
    scope: "area",
    targetIds: ["sub-1-2"],
    targetName: "Khu vực B - Ruộng trũng ven kênh",
    certificateIds: ["Organic"],
    enterpriseId: "DN001",
    managerIds: ["2"],
    note: "Canh tác lúa thơm ST25 theo tiêu chuẩn hữu cơ, phục vụ thị trường xuất khẩu.",
    farmingMethodId: "organic",
    irrigationMethodId: "rain",
    selectedCrops: ["5"],
    configs: {
      "sub-1-2": {
        farmingMethodId: "organic",
        irrigationMethodId: "rain",
        selectedCrops: ["5"],
      },
    },
    status: "active",
    createdAt: "2024-02-05",
  },
  {
    id: "ca-3",
    name: "Lô trồng Lúa chất lượng cao",
    scope: "plot",
    targetIds: ["plot-1-1-1"],
    targetName: "Lô A1 - Cánh đồng mẫu lớn",
    certificateIds: ["GlobalGAP"],
    enterpriseId: "DN002",
    managerIds: ["3"],
    note: "Mô hình lúa - tôm kết hợp, ưu tiên giống lúa chịu mặn và quy trình canh tác bền vững.",
    farmingMethodId: "vietgap",
    irrigationMethodId: "flood",
    selectedCrops: ["5"],
    configs: {
      "plot-1-1-1": {
        farmingMethodId: "vietgap",
        irrigationMethodId: "flood",
        selectedCrops: ["5"],
      },
    },
    status: "active",
    createdAt: "2024-02-10",
  },
  {
    id: "ca-4",
    name: "Vườn ươm giống Lúa Japonica",
    scope: "area",
    targetIds: ["sub-1-3"],
    targetName: "Khu vực C - Vườn ươm mạ",
    certificateIds: ["HACCP"],
    enterpriseId: "DN003",
    managerIds: ["1"],
    note: "Khu vực ươm mạ, tuyển chọn và bảo tồn nguồn giống lúa Japonica chất lượng cao.",
    farmingMethodId: "greenhouse",
    irrigationMethodId: "manual",
    selectedCrops: ["5"],
    configs: {
      "sub-1-3": {
        farmingMethodId: "greenhouse",
        irrigationMethodId: "manual",
        selectedCrops: ["5"],
      },
    },
    status: "active",
    createdAt: "2024-02-15",
  },
];

const useCultivationRegionStore = create<CultivationRegionState>()(
  devtools(
    persist(
      (set, get) => ({
        areas: MOCK_DATA,
        isLoading: false,
        error: null,

        addArea: (areaData) =>
          set((state) => {
            const newArea: CultivationRegion = {
              ...areaData,
              id: `ca-${Date.now()}`,
              status: "active",
              createdAt: new Date().toISOString().split("T")[0],
            };
            return {
              areas: [newArea, ...state.areas],
            };
          }),

        updateArea: (id, areaData) =>
          set((state) => ({
            areas: state.areas.map((area) =>
              area.id === id ? { ...area, ...areaData } : area,
            ),
          })),

        deleteArea: (id) =>
          set((state) => ({
            areas: state.areas.filter((area) => area.id !== id),
          })),

        getAreaById: (id) => get().areas.find((area) => area.id === id),
      }),
      {
        name: "cultivation-region-storage",
      },
    ),
    { name: "CultivationRegionStore" },
  ),
);

export default useCultivationRegionStore;
