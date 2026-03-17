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

  addArea: (area: Omit<CultivationRegion, "id" | "createdAt" | "status">) => void;
  updateArea: (id: string, area: Partial<CultivationRegion>) => void;
  deleteArea: (id: string) => void;
  getAreaById: (id: string) => CultivationRegion | undefined;
}

const MOCK_DATA: CultivationRegion[] = [
  {
    name: "Vùng canh tác sầu riêng công nghệ cao 3",
    scope: "area",
    targetIds: ["sub-1-1", "sub-1-2", "5"],
    targetName:
      "Khu A - Sầu riêng Dona, Khu B - Sầu riêng Musang King, Khu Phức hợp Nông nghiệp Công nghệ cao",
    enterpriseId: "1",
    certificateIds: ["ISO22000", "Organic"],
    managerIds: ["1"],
    note: "",
    farmingMethodId: "organic",
    irrigationMethodId: "drip",
    selectedCrops: ["1", "4"],
    seedSelections: {
      "1": ["6"],
      "4": ["9"],
    },
    configs: {
      "area-config": {
        farmingMethodId: "organic",
        selectedCrops: ["1", "4"],
        seedSelections: {
          "1": ["6"],
          "4": ["9"],
        },
        irrigationMethodId: "drip",
      },
    },
    id: "ca-1772278404110",
    status: "active",
    createdAt: "2026-02-28",
  },
  {
    name: "Vùng canh tác sầu riêng công nghệ cao 2",
    scope: "region",
    targetIds: ["1", "3"],
    targetName: "Vùng Bình Phước Alpha, Đồi Cà phê Buôn Ma Thuột",
    enterpriseId: "1",
    certificateIds: ["GlobalGAP", "HACCP", "Organic"],
    managerIds: ["1"],
    note: "",
    farmingMethodId: "organic",
    irrigationMethodId: "drip",
    selectedCrops: ["1", "2", "3"],
    seedSelections: {
      "1": ["6"],
      "2": ["7"],
      "3": ["8"],
    },
    configs: {
      "area-config": {
        farmingMethodId: "organic",
        irrigationMethodId: "drip",
        selectedCrops: ["1", "2", "3"],
        seedSelections: {
          "1": ["6"],
          "2": ["7"],
          "3": ["8"],
        },
      },
    },
    id: "ca-1772278286585",
    status: "active",
    createdAt: "2026-02-28",
  },
  {
    id: "ca-1",
    name: "Canh tác Sầu riêng Công nghệ cao",
    scope: "region",
    targetIds: ["1"],
    targetName: "Vùng Bình Phước Alpha",
    certificateIds: ["VietGAP"],
    enterpriseId: "DN001",
    managerIds: ["1"],
    note: "Dự án thử nghiệm công nghệ 4.0",
    farmingMethodId: "greenhouse",
    irrigationMethodId: "drip",
    selectedCrops: ["1", "3"],
    configs: {
      "region-main": {
        farmingMethodId: "greenhouse",
        irrigationMethodId: "drip",
        selectedCrops: ["1", "3"],
      },
    },
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "ca-2",
    name: "Khu vực trồng Sầu riêng Dona Xuất khẩu",
    scope: "area",
    targetIds: ["sub-1-2"],
    targetName: "Khu vực B - Đồi thấp",
    certificateIds: ["Organic"],
    enterpriseId: "DN001",
    managerIds: ["2"],
    note: "Canh tác theo tiêu chuẩn hữu cơ EU",
    farmingMethodId: "organic",
    irrigationMethodId: "rain",
    selectedCrops: ["2"],
    configs: {
      "sub-1-2": {
        farmingMethodId: "organic",
        irrigationMethodId: "rain",
        selectedCrops: ["2"],
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
    note: "Mô hình lúa tôm kết hợp",
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
    name: "Vườn ươm giống Sầu riêng Black Thorn",
    scope: "area",
    targetIds: ["sub-1-3"],
    targetName: "Khu vực C - Vườn ươm",
    certificateIds: ["HACCP"],
    enterpriseId: "DN003",
    managerIds: ["1"],
    note: "Khu vực nhân giống và bảo tồn gen",
    farmingMethodId: "greenhouse",
    irrigationMethodId: "manual",
    selectedCrops: ["4"],
    configs: {
      "sub-1-3": {
        farmingMethodId: "greenhouse",
        irrigationMethodId: "manual",
        selectedCrops: ["4"],
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
