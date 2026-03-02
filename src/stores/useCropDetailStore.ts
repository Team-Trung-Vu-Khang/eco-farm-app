import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  MOCK_CROPS,
  type CropDetail,
} from "../pages/cultivation-zone/constants";

interface CropDetailState {
  crops: CropDetail[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCrops: (crops: CropDetail[]) => void;
  addCrop: (crop: CropDetail) => void;
  updateCrop: (id: string, crop: Partial<CropDetail>) => void;
  deleteCrop: (id: string) => void;
  getCropById: (id: string) => CropDetail | undefined;
}

const useCropDetailStore = create<CropDetailState>()(
  devtools(
    persist(
      (set, get) => ({
        crops: MOCK_CROPS,
        isLoading: false,
        error: null,

        setCrops: (crops) => set({ crops }, false, "setCrops"),

        addCrop: (crop) =>
          set((state) => ({ crops: [crop, ...state.crops] }), false, "addCrop"),

        updateCrop: (id, cropData) =>
          set(
            (state) => ({
              crops: state.crops.map((crop) =>
                crop.id === id ? { ...crop, ...cropData } : crop,
              ),
            }),
            false,
            "updateCrop",
          ),

        deleteCrop: (id) =>
          set(
            (state) => ({
              crops: state.crops.filter((crop) => crop.id !== id),
            }),
            false,
            "deleteCrop",
          ),

        getCropById: (id) => get().crops.find((crop) => crop.id === id),
      }),
      {
        name: "crop-detail-storage",
      },
    ),
    { name: "CropDetailStore" },
  ),
);

export default useCropDetailStore;
