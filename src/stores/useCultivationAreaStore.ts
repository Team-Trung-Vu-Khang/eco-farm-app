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
    certificateId: "cert-1",
    managerId: "man-1",
    note: "Dự án thử nghiệm",
    configs: {
      "region-main": {
        farmingMethodId: "vietgap",
        irrigationMethodId: "drip",
        selectedCrops: ["crop-1", "crop-4"],
      },
    },
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "ca-2",
    name: "Khu vực trồng Bơ 034",
    scope: "area",
    targetIds: ["sub-1-2"],
    targetName: "Khu vực B - Bơ sáp",
    certificateId: "cert-3",
    managerId: "man-2",
    note: "Khu vực bơ sáp hữu cơ",
    configs: {
      "sub-1-2": {
        farmingMethodId: "organic",
        irrigationMethodId: "rain",
        selectedCrops: ["crop-5"],
      },
    },
    status: "active",
    createdAt: "2024-02-05",
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
