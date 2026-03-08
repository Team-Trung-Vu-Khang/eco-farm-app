import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface CultivationPlotConfig {
  farmingMethodId: string;
  irrigationMethodId: string;
  selectedCrops: string[];
  seedSelections?: Record<string, string[]>;
}

export interface CultivationPlot {
  id: string;
  name: string;
  // Target: a SubArea within a Region, filtered by Enterprise
  regionId: string;
  regionName: string;
  areaId: string; // SubArea id
  areaName: string;
  plotId?: string;
  plotName?: string;
  enterpriseId: string;
  certificateIds: string[];
  managerId: string;
  note: string;
  farmingMethodId: string;
  irrigationMethodId: string;
  selectedCrops: string[];
  seedSelections?: Record<string, string[]>;
  configs?: Record<string, CultivationPlotConfig>;
  status: "active" | "inactive";
  createdAt: string;
}

interface CultivationPlotState {
  cultivationPlots: CultivationPlot[];
  isLoading: boolean;
  error: string | null;

  addCultivationPlot: (lot: Omit<CultivationPlot, "id" | "createdAt" | "status">) => void;
  updateCultivationPlot: (id: string, lot: Partial<CultivationPlot>) => void;
  deleteCultivationPlot: (id: string) => void;
  getCultivationPlotById: (id: string) => CultivationPlot | undefined;
}

const MOCK_DATA: CultivationPlot[] = [
  {
    id: "fl-1",
    name: "Lô canh tác Sầu riêng Dona - Khu A",
    regionId: "1",
    regionName: "Vùng Bình Phước Alpha",
    areaId: "sub-1-1",
    areaName: "Khu A - Sầu riêng Dona",
    enterpriseId: "1",
    certificateIds: ["Organic"],
    managerId: "1",
    note: "Khu vực canh tác hữu cơ, sử dụng phân bón vi sinh",
    farmingMethodId: "organic",
    irrigationMethodId: "drip",
    selectedCrops: ["1"],
    seedSelections: { "1": ["6"] },
    configs: {
      "lot-config": {
        farmingMethodId: "organic",
        irrigationMethodId: "drip",
        selectedCrops: ["1"],
        seedSelections: { "1": ["6"] },
      },
    },
    status: "active",
    createdAt: "2026-02-28",
  },
  {
    id: "fl-2",
    name: "Lô canh tác Sầu riêng Musang King - Khu B",
    regionId: "1",
    regionName: "Vùng Bình Phước Alpha",
    areaId: "sub-1-2",
    areaName: "Khu B - Sầu riêng Musang King",
    enterpriseId: "1",
    certificateIds: ["GlobalGAP"],
    managerId: "2",
    note: "Musang King xuất khẩu sang Singapore",
    farmingMethodId: "vietgap",
    irrigationMethodId: "drip",
    selectedCrops: ["4"],
    seedSelections: { "4": ["9"] },
    configs: {
      "lot-config": {
        farmingMethodId: "vietgap",
        irrigationMethodId: "drip",
        selectedCrops: ["4"],
        seedSelections: { "4": ["9"] },
      },
    },
    status: "active",
    createdAt: "2026-03-01",
  },
];

const useCultivationPlotStore = create<CultivationPlotState>()(
  devtools(
    persist(
      (set, get) => ({
        cultivationPlots: MOCK_DATA,
        isLoading: false,
        error: null,

        addCultivationPlot: (lotData) =>
          set((state) => {
            const newLot: CultivationPlot = {
              ...lotData,
              id: `fl-${Date.now()}`,
              status: "active",
              createdAt: new Date().toISOString().split("T")[0],
            };
            return {
              cultivationPlots: [newLot, ...state.cultivationPlots],
            };
          }),

        updateCultivationPlot: (id, lotData) =>
          set((state) => ({
            cultivationPlots: state.cultivationPlots.map((l) =>
              l.id === id ? { ...l, ...lotData } : l,
            ),
          })),

        deleteCultivationPlot: (id) =>
          set((state) => ({
            cultivationPlots: state.cultivationPlots.filter((l) => l.id !== id),
          })),

        getCultivationPlotById: (id) =>
          get().cultivationPlots.find((l) => l.id === id),
      }),
      {
        name: "cultivation-plot-storage",
      },
    ),
    { name: "CultivationPlotStore" },
  ),
);

export default useCultivationPlotStore;
