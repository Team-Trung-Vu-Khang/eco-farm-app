import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  initialPesticides,
  type Pesticide,
} from "../pages/pesticide/constants";

interface PesticideState {
  // State
  pesticides: Pesticide[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setPesticides: (pesticides: Pesticide[]) => void;
  addPesticide: (pesticide: Omit<Pesticide, "id" | "createdAt">) => void;
  updatePesticide: (id: number, pesticide: Partial<Pesticide>) => void;
  deletePesticide: (id: number) => void;
  getPesticideById: (id: number) => Pesticide | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const usePesticideStore = create<PesticideState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        pesticides: initialPesticides,
        isLoading: false,
        error: null,

        // Actions
        setPesticides: (pesticides) =>
          set({ pesticides }, false, "setPesticides"),

        addPesticide: (pesticideData) =>
          set(
            (state) => {
              const newPesticide: Pesticide = {
                ...pesticideData,
                id: Math.max(0, ...state.pesticides.map((p) => p.id)) + 1,
                createdAt: new Date().toISOString().split("T")[0],
              };
              return {
                pesticides: [newPesticide, ...state.pesticides], // Thêm vào đầu danh sách
              };
            },
            false,
            "addPesticide",
          ),

        updatePesticide: (id, pesticideData) =>
          set(
            (state) => ({
              pesticides: state.pesticides.map((pesticide) =>
                pesticide.id === id
                  ? { ...pesticide, ...pesticideData }
                  : pesticide,
              ),
            }),
            false,
            "updatePesticide",
          ),

        deletePesticide: (id) =>
          set(
            (state) => ({
              pesticides: state.pesticides.filter(
                (pesticide) => pesticide.id !== id,
              ),
            }),
            false,
            "deletePesticide",
          ),

        getPesticideById: (id) => {
          return get().pesticides.find((pesticide) => pesticide.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        reset: () =>
          set(
            {
              pesticides: initialPesticides,
              isLoading: false,
              error: null,
            },
            false,
            "reset",
          ),
      }),
      {
        name: "pesticide-storage", // Key trong localStorage
        partialize: (state) => ({ pesticides: state.pesticides }), // Chỉ lưu pesticides
      },
    ),
    {
      name: "PesticideStore", // Tên hiển thị trong Redux DevTools
    },
  ),
);

export default usePesticideStore;
