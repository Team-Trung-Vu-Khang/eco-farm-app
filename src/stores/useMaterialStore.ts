import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { initialMaterials } from "../pages/material/data/constants";
import type { Material } from "../pages/material/types/types";

interface MaterialState {
  // State
  materials: Material[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setMaterials: (materials: Material[]) => void;
  addMaterial: (material: Omit<Material, "id" | "createdAt">) => void;
  updateMaterial: (id: number, material: Partial<Material>) => void;
  deleteMaterial: (id: number) => void;
  getMaterialById: (id: number) => Material | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useMaterialStore = create<MaterialState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        materials: initialMaterials,
        isLoading: false,
        error: null,

        // Actions
        setMaterials: (materials) => set({ materials }, false, "setMaterials"),

        addMaterial: (materialData) =>
          set(
            (state) => {
              const newMaterial: Material = {
                ...materialData,
                id: Math.max(0, ...state.materials.map((m) => m.id)) + 1,
                createdAt: new Date().toISOString().split("T")[0],
              };
              return {
                materials: [newMaterial, ...state.materials], // Thêm vào đầu danh sách
              };
            },
            false,
            "addMaterial",
          ),

        updateMaterial: (id, materialData) =>
          set(
            (state) => ({
              materials: state.materials.map((material) =>
                material.id === id
                  ? { ...material, ...materialData }
                  : material,
              ),
            }),
            false,
            "updateMaterial",
          ),

        deleteMaterial: (id) =>
          set(
            (state) => ({
              materials: state.materials.filter(
                (material) => material.id !== id,
              ),
            }),
            false,
            "deleteMaterial",
          ),

        getMaterialById: (id) => {
          return get().materials.find((material) => material.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        reset: () =>
          set(
            {
              materials: initialMaterials,
              isLoading: false,
              error: null,
            },
            false,
            "reset",
          ),
      }),
      {
        name: "material-storage", // Key trong localStorage
        partialize: (state) => ({ materials: state.materials }), // Chỉ lưu materials
      },
    ),
    {
      name: "MaterialStore", // Tên hiển thị trong Redux DevTools
    },
  ),
);

export default useMaterialStore;
