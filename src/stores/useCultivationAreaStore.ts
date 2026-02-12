import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface CultivationAreaConfig {
  farmingMethodId: string;
  irrigationMethodId: string;
  selectedCrops: string[];
}

export interface CultivationArea {
  id: string;
  name: string;
  scope: "region" | "area" | "plot";
  targetIds: string[]; // IDs of the selected regions, areas, or plots
  targetName: string;
  enterpriseId?: string;
  certificateId: string;
  managerId: string;
  note: string;
  configs: Record<string, CultivationAreaConfig>;
  status: "active" | "inactive";
  createdAt: string;
}

interface CultivationAreaState {
  areas: CultivationArea[];
  isLoading: boolean;
  error: string | null;

  addArea: (area: Omit<CultivationArea, "id" | "createdAt" | "status">) => void;
  updateArea: (id: string, area: Partial<CultivationArea>) => void;
  deleteArea: (id: string) => void;
  getAreaById: (id: string) => CultivationArea | undefined;
}

const MOCK_DATA: CultivationArea[] = [
  {
    id: "ca-1",
    name: "Canh tác Sầu riêng Công nghệ cao",
    scope: "region",
    targetIds: ["1"],
    targetName: "Vùng Bình Phước Alpha",
    certificateId: "VietGAP",
    enterpriseId: "DN001",
    managerId: "1",
    note: "Dự án thử nghiệm công nghệ 4.0",
    configs: {
      "region-main": {
        farmingMethodId: "greenhouse", // Nhà kính
        irrigationMethodId: "drip", // Tưới nhỏ giọt
        selectedCrops: ["1", "3"], // Ri6, Musang King
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
    certificateId: "Organic",
    enterpriseId: "DN001",
    managerId: "2",
    note: "Canh tác theo tiêu chuẩn hữu cơ EU",
    configs: {
      "sub-1-2": {
        farmingMethodId: "organic", // Hữu cơ
        irrigationMethodId: "rain", // Tưới phun
        selectedCrops: ["2"], // Dona
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
    certificateId: "GlobalGAP",
    enterpriseId: "DN002",
    managerId: "3",
    note: "Mô hình lúa tôm kết hợp",
    configs: {
      "plot-1-1-1": {
        farmingMethodId: "vietgap", // VietGAP
        irrigationMethodId: "flood", // Tưới tràn
        selectedCrops: ["5"], // Lúa OM5451
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
    certificateId: "HACCP",
    enterpriseId: "DN003",
    managerId: "1",
    note: "Khu vực nhân giống và bảo tồn gen",
    configs: {
      "sub-1-3": {
        farmingMethodId: "greenhouse",
        irrigationMethodId: "manual", // Tưới thủ công
        selectedCrops: ["4"], // Black Thorn
      },
    },
    status: "active",
    createdAt: "2024-02-15",
  },
];

const useCultivationAreaStore = create<CultivationAreaState>()(
  devtools(
    persist(
      (set, get) => ({
        areas: MOCK_DATA,
        isLoading: false,
        error: null,

        addArea: (areaData) =>
          set((state) => {
            const newArea: CultivationArea = {
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
        name: "cultivation-area-storage",
      },
    ),
    { name: "CultivationAreaStore" },
  ),
);

export default useCultivationAreaStore;
