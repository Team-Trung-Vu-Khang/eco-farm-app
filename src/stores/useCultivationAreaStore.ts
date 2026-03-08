import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface CultivationAreaConfig {
  farmingMethodId: string;
  irrigationMethodId: string;
  selectedCrops: string[];
  seedSelections?: Record<string, string[]>;
}

export interface CultivationArea {
  id: string;
  name: string;
  // Target: a single Region from useRegionStore
  regionId: string;
  regionName: string;
  areaId?: string;
  areaName?: string;
  enterpriseId: string;
  certificateIds: string[];
  managerId: string;
  note: string;
  farmingMethodId: string;
  irrigationMethodId: string;
  selectedCrops: string[];
  seedSelections?: Record<string, string[]>;
  configs?: Record<string, CultivationAreaConfig>;
  status: "active" | "inactive";
  createdAt: string;
}

interface CultivationAreaState {
  cultivationAreas: CultivationArea[];
  isLoading: boolean;
  error: string | null;

  addCultivationArea: (
    region: Omit<CultivationArea, "id" | "createdAt" | "status">,
  ) => void;
  updateCultivationArea: (id: string, region: Partial<CultivationArea>) => void;
  deleteCultivationArea: (id: string) => void;
  getCultivationAreaById: (id: string) => CultivationArea | undefined;
}

const MOCK_DATA: CultivationArea[] = [
  {
    id: "fr-1",
    name: "Vùng canh tác Sầu riêng Alpha",
    regionId: "1",
    regionName: "Vùng Bình Phước Alpha",
    enterpriseId: "1",
    certificateIds: ["VietGAP", "Organic"],
    managerId: "1",
    note: "Vùng canh tác trọng điểm cho sầu riêng xuất khẩu",
    farmingMethodId: "organic",
    irrigationMethodId: "drip",
    selectedCrops: ["1", "4"],
    seedSelections: { "1": ["6"], "4": ["9"] },
    configs: {
      "region-config": {
        farmingMethodId: "organic",
        irrigationMethodId: "drip",
        selectedCrops: ["1", "4"],
        seedSelections: { "1": ["6"], "4": ["9"] },
      },
    },
    status: "active",
    createdAt: "2026-02-28",
  },
  {
    id: "fr-2",
    name: "Vùng canh tác Cà Phê Đắk Lắk",
    regionId: "3",
    regionName: "Đồi Cà phê Buôn Ma Thuột",
    enterpriseId: "1",
    certificateIds: ["GlobalGAP"],
    managerId: "2",
    note: "Canh tác cà phê robusta xuất khẩu",
    farmingMethodId: "vietgap",
    irrigationMethodId: "rain",
    selectedCrops: ["2"],
    seedSelections: { "2": ["7"] },
    configs: {
      "region-config": {
        farmingMethodId: "vietgap",
        irrigationMethodId: "rain",
        selectedCrops: ["2"],
        seedSelections: { "2": ["7"] },
      },
    },
    status: "active",
    createdAt: "2026-03-01",
  },
];

const useCultivationAreaStore = create<CultivationAreaState>()(
  devtools(
    persist(
      (set, get) => ({
        cultivationAreas: MOCK_DATA,
        isLoading: false,
        error: null,

        addCultivationArea: (regionData) =>
          set((state) => {
            const newRegion: CultivationArea = {
              ...regionData,
              id: `fr-${Date.now()}`,
              status: "active",
              createdAt: new Date().toISOString().split("T")[0],
            };
            return {
              cultivationAreas: [newRegion, ...state.cultivationAreas],
            };
          }),

        updateCultivationArea: (id, regionData) =>
          set((state) => ({
            cultivationAreas: state.cultivationAreas.map((r) =>
              r.id === id ? { ...r, ...regionData } : r,
            ),
          })),

        deleteCultivationArea: (id) =>
          set((state) => ({
            cultivationAreas: state.cultivationAreas.filter((r) => r.id !== id),
          })),

        getCultivationAreaById: (id) =>
          get().cultivationAreas.find((r) => r.id === id),
      }),
      {
        name: "cultivation-area-storage",
      },
    ),
    { name: "CultivationAreaStore" },
  ),
);

export default useCultivationAreaStore;
