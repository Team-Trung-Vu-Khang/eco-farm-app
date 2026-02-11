import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  initialFertilizers,
  type Fertilizer,
} from "../pages/fertilizer/constants";

interface FertilizerState {
  // State
  fertilizers: Fertilizer[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setFertilizers: (fertilizers: Fertilizer[]) => void;
  addFertilizer: (fertilizer: Omit<Fertilizer, "id" | "createdAt">) => void;
  updateFertilizer: (id: number, fertilizer: Partial<Fertilizer>) => void;
  deleteFertilizer: (id: number) => void;
  getFertilizerById: (id: number) => Fertilizer | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useFertilizerStore = create<FertilizerState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        fertilizers: initialFertilizers,
        isLoading: false,
        error: null,

        // Actions
        setFertilizers: (fertilizers) =>
          set({ fertilizers }, false, "setFertilizers"),

        addFertilizer: (fertilizerData) =>
          set(
            (state) => {
              const newFertilizer: Fertilizer = {
                ...fertilizerData,
                id: Math.max(0, ...state.fertilizers.map((f) => f.id)) + 1,
                createdAt: new Date().toISOString().split("T")[0],
              };
              return {
                fertilizers: [newFertilizer, ...state.fertilizers], // Thêm vào đầu danh sách
              };
            },
            false,
            "addFertilizer",
          ),

        updateFertilizer: (id, fertilizerData) =>
          set(
            (state) => ({
              fertilizers: state.fertilizers.map((fertilizer) =>
                fertilizer.id === id
                  ? { ...fertilizer, ...fertilizerData }
                  : fertilizer,
              ),
            }),
            false,
            "updateFertilizer",
          ),

        deleteFertilizer: (id) =>
          set(
            (state) => ({
              fertilizers: state.fertilizers.filter(
                (fertilizer) => fertilizer.id !== id,
              ),
            }),
            false,
            "deleteFertilizer",
          ),

        getFertilizerById: (id) => {
          return get().fertilizers.find((fertilizer) => fertilizer.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        reset: () =>
          set(
            {
              fertilizers: initialFertilizers,
              isLoading: false,
              error: null,
            },
            false,
            "reset",
          ),
      }),
      {
        name: "fertilizer-storage", // Key trong localStorage
        partialize: (state) => ({ fertilizers: state.fertilizers }), // Chỉ lưu fertilizers
      },
    ),
    {
      name: "FertilizerStore", // Tên hiển thị trong Redux DevTools
    },
  ),
);

export default useFertilizerStore;
