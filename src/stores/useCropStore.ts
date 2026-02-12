import { create } from "zustand";
import type { Crop } from "../pages/crop/types";
import { initialData } from "../pages/crop/mocks";

export interface CropStore {
  crops: Crop[];

  // CRUD operations
  getCrops: () => Crop[];
  getCropById: (id: number) => Crop | undefined;
  addCrop: (crop: Omit<Crop, "id">) => void;
  updateCrop: (id: number, crop: Partial<Crop>) => void;
  deleteCrop: (id: number) => void;
}

const useCropStore = create<CropStore>((set, get) => ({
  // Initial data from mocks
  crops: initialData,

  // Get all crops
  getCrops: () => get().crops,

  // Get crop by ID
  getCropById: (id: number) => {
    return get().crops.find((crop) => crop.id === id);
  },

  // Add new crop
  addCrop: (crop: Omit<Crop, "id">) => {
    set((state) => {
      const newId =
        state.crops.length > 0
          ? Math.max(...state.crops.map((c) => c.id)) + 1
          : 1;
      return {
        crops: [...state.crops, { ...crop, id: newId }],
      };
    });
  },

  // Update existing crop
  updateCrop: (id: number, cropUpdate: Partial<Crop>) => {
    set((state) => ({
      crops: state.crops.map((crop) =>
        crop.id === id ? { ...crop, ...cropUpdate } : crop,
      ),
    }));
  },

  // Delete crop
  deleteCrop: (id: number) => {
    set((state) => ({
      crops: state.crops.filter((crop) => crop.id !== id),
    }));
  },
}));

export default useCropStore;
