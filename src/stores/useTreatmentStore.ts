import { create } from "zustand";
import { initialTreatments } from "../pages/treatment/data/treatment.data";
import type { Treatment } from "../pages/treatment/types/treatment.types";

interface TreatmentStore {
  treatments: Treatment[];
  addTreatment: (treatment: Treatment) => void;
  updateTreatment: (id: number, treatment: Partial<Treatment>) => void;
  deleteTreatment: (id: number) => void;
  getTreatmentById: (id: number) => Treatment | undefined;
}

export const useTreatmentStore = create<TreatmentStore>((set, get) => ({
  treatments: initialTreatments,

  addTreatment: (treatment) =>
    set((state) => ({
      treatments: [treatment, ...state.treatments],
    })),

  updateTreatment: (id, updatedFields) =>
    set((state) => ({
      treatments: state.treatments.map((t) =>
        t.id === id ? { ...t, ...updatedFields } : t
      ),
    })),

  deleteTreatment: (id) =>
    set((state) => ({
      treatments: state.treatments.filter((t) => t.id !== id),
    })),

  getTreatmentById: (id) => get().treatments.find((t) => t.id === id),
}));
