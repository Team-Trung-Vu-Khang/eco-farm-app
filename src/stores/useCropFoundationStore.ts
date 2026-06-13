import { create } from "zustand";
import type { CropFoundation } from "../pages/crop-foundation/types/types";
import { initialData } from "../pages/crop-foundation/data/mocks";

export interface CropFoundationStore {
  cropFoundations: CropFoundation[];

  // CRUD operations
  getCropFoundations: () => CropFoundation[];
  getCropFoundationById: (id: number) => CropFoundation | undefined;
  addCropFoundation: (cropFoundation: Omit<CropFoundation, "id">) => void;
  updateCropFoundation: (id: number, cropFoundation: Partial<CropFoundation>) => void;
  deleteCropFoundation: (id: number) => void;
}

const useCropFoundationStore = create<CropFoundationStore>((set, get) => ({
  // Initial data from mocks
  cropFoundations: initialData as unknown as CropFoundation[],

  // Get all cropFoundations
  getCropFoundations: () => get().cropFoundations,

  // Get cropFoundation by ID
  getCropFoundationById: (id: number) => {
    return get().cropFoundations.find((cropFoundation) => cropFoundation.id === id);
  },

  // Add new cropFoundation
  addCropFoundation: (cropFoundation: Omit<CropFoundation, "id">) => {
    set((state) => {
      const newId =
        state.cropFoundations.length > 0
          ? Math.max(...state.cropFoundations.map((c) => c.id)) + 1
          : 1;
      return {
        cropFoundations: [...state.cropFoundations, { ...cropFoundation, id: newId }],
      };
    });
  },

  // Update existing cropFoundation
  updateCropFoundation: (id: number, cropFoundationUpdate: Partial<CropFoundation>) => {
    set((state) => ({
      cropFoundations: state.cropFoundations.map((cropFoundation) =>
        cropFoundation.id === id ? { ...cropFoundation, ...cropFoundationUpdate } : cropFoundation,
      ),
    }));
  },

  // Delete cropFoundation
  deleteCropFoundation: (id: number) => {
    set((state) => ({
      cropFoundations: state.cropFoundations.filter((cropFoundation) => cropFoundation.id !== id),
    }));
  },
}));

export default useCropFoundationStore;
