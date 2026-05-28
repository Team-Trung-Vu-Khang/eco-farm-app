import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  PLANT_DISTRIBUTION_MOCK_DATA,
  type PlantDistributionListItem,
} from "@/pages/cultivation-zone/distribution-detail/data/constants";
import type {
  DistributionMethod,
  DistributionScope,
  PlantEntry,
  PlantLocation,
  RowConfig,
} from "@/pages/cultivation-zone/distribution-detail/constants";

export interface PlantDistributionRecord extends PlantDistributionListItem {
  selectedRegionId: string;
  selectedAreaIds: string[];
  selectedPlotIds: string[];
  selectedSeedIds: string[];
  plantEntries: PlantEntry[];
  rowConfigs: RowConfig[];
  plantLocations: PlantLocation[];
}

interface PlantDistributionState {
  records: PlantDistributionRecord[];
  addRecord: (
    payload: Omit<PlantDistributionRecord, "id" | "code" | "createdAt">,
  ) => PlantDistributionRecord;
  updateRecord: (id: string, payload: Partial<PlantDistributionRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordById: (id: string) => PlantDistributionRecord | undefined;
}

const toInitialRecords = (): PlantDistributionRecord[] =>
  PLANT_DISTRIBUTION_MOCK_DATA.map((item) => ({
    ...item,
    selectedRegionId: "",
    selectedAreaIds: [],
    selectedPlotIds: [],
    selectedSeedIds: [],
    plantEntries: [],
    rowConfigs: [],
    plantLocations: [],
  }));

const usePlantDistributionStore = create<PlantDistributionState>()(
  devtools(
    persist(
      (set, get) => ({
        records: toInitialRecords(),

        addRecord: (payload) => {
          const state = get();
          const maxId = state.records
            .map((r) => Number(r.id.replace("dist-", "")))
            .filter((n) => !Number.isNaN(n))
            .reduce((m, n) => Math.max(m, n), 0);

          const nextNumber = maxId + 1;
          const newRecord: PlantDistributionRecord = {
            ...payload,
            id: `dist-${nextNumber}`,
            code: `DIST-${String(nextNumber).padStart(3, "0")}`,
            createdAt: new Date().toISOString().split("T")[0],
          };

          set(
            (prev) => ({ records: [newRecord, ...prev.records] }),
            false,
            "plantDistribution/addRecord",
          );

          return newRecord;
        },

        updateRecord: (id, payload) =>
          set(
            (prev) => ({
              records: prev.records.map((item) =>
                item.id === id ? { ...item, ...payload } : item,
              ),
            }),
            false,
            "plantDistribution/updateRecord",
          ),

        deleteRecord: (id) =>
          set(
            (prev) => ({ records: prev.records.filter((item) => item.id !== id) }),
            false,
            "plantDistribution/deleteRecord",
          ),

        getRecordById: (id) => get().records.find((item) => item.id === id),
      }),
      {
        name: "plant-distribution-storage",
        partialize: (state) => ({ records: state.records }),
      },
    ),
  ),
);

export default usePlantDistributionStore;
