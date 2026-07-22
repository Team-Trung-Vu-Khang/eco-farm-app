import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  PLANT_DISTRIBUTION_MOCK_DATA,
  type AnimalDistributionListItem,
} from "@/pages/animal-husbandry-zone/animal-distribution-detail/data/constants";
import type {
  AnimalEntry,
  AnimalLocation,
  RowConfig,
} from "@/pages/animal-husbandry-zone/animal-distribution-detail/constants";

export interface AnimalDistributionRecord extends AnimalDistributionListItem {
  selectedRegionId: string;
  selectedAreaIds: string[];
  selectedPlotIds: string[];
  selectedSeedIds: string[];
  animalEntries: AnimalEntry[];
  rowConfigs: RowConfig[];
  animalLocations: AnimalLocation[];
}

interface AnimalDistributionState {
  records: AnimalDistributionRecord[];
  addRecord: (
    payload: Omit<AnimalDistributionRecord, "id" | "code" | "createdAt">,
  ) => AnimalDistributionRecord;
  updateRecord: (id: string, payload: Partial<AnimalDistributionRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordById: (id: string) => AnimalDistributionRecord | undefined;
}

const toInitialRecords = (): AnimalDistributionRecord[] =>
  PLANT_DISTRIBUTION_MOCK_DATA.map((item) => ({
    ...item,
    selectedRegionId: "",
    selectedAreaIds: [],
    selectedPlotIds: [],
    selectedSeedIds: [],
    animalEntries: [],
    rowConfigs: [],
    animalLocations: [],
  }));

const useAnimalDistributionStore = create<AnimalDistributionState>()(
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
          const newRecord: AnimalDistributionRecord = {
            ...payload,
            id: `dist-${nextNumber}`,
            code: `DIST-${String(nextNumber).padStart(3, "0")}`,
            createdAt: new Date().toISOString().split("T")[0],
          };

          set(
            (prev) => ({ records: [newRecord, ...prev.records] }),
            false,
            "animalDistribution/addRecord",
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
            "animalDistribution/updateRecord",
          ),

        deleteRecord: (id) =>
          set(
            (prev) => ({ records: prev.records.filter((item) => item.id !== id) }),
            false,
            "animalDistribution/deleteRecord",
          ),

        getRecordById: (id) => get().records.find((item) => item.id === id),
      }),
      {
        name: "animal-distribution-storage",
        partialize: (state) => ({ records: state.records }),
      },
    ),
  ),
);

export default useAnimalDistributionStore;
