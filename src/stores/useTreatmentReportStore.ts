import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { TreatmentReportEntry } from "@/pages/treatment-report/types";

interface TreatmentReportStore {
  entries: TreatmentReportEntry[];
  addEntry: (entry: Omit<TreatmentReportEntry, "id" | "createdAt">) => void;
  getEntriesByPlan: (planId: number) => TreatmentReportEntry[];
  clearEntriesByPlan: (planId: number) => void;
}

const createId = () =>
  `tr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const useTreatmentReportStore = create<TreatmentReportStore>()(
  devtools(
    persist(
      (set, get) => ({
        entries: [],

        addEntry: (entry) => {
          const newEntry: TreatmentReportEntry = {
            ...entry,
            id: createId(),
            createdAt: new Date().toISOString(),
          };

          set(
            (state) => ({ entries: [newEntry, ...state.entries] }),
            false,
            "addTreatmentReportEntry",
          );
        },

        getEntriesByPlan: (planId) =>
          get().entries.filter((entry) => entry.planId === planId),

        clearEntriesByPlan: (planId) => {
          set(
            (state) => ({
              entries: state.entries.filter((entry) => entry.planId !== planId),
            }),
            false,
            "clearTreatmentReportEntriesByPlan",
          );
        },
      }),
      { name: "treatment-report-storage" },
    ),
    { name: "TreatmentReportStore" },
  ),
);

export default useTreatmentReportStore;
