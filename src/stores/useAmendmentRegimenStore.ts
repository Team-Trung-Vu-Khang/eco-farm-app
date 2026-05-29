import { create } from "zustand";
import { initialTreatmentPlans } from "../pages/soil-amendment/data/soilAmendmentTreatmentData";

interface AmendmentRegimenStore {
  regimens: any[];
  getRegimenById: (id: number) => any | undefined;
}

export const useAmendmentRegimenStore = create<AmendmentRegimenStore>((set, get) => ({
  regimens: initialTreatmentPlans,
  getRegimenById: (id) => get().regimens.find((r) => r.id === id),
}));
