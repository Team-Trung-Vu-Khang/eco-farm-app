import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { initialUnits } from "../pages/unit/data/constants";
import type { Unit } from "../pages/unit/types/types";

interface UnitState {
  // State
  units: Unit[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setUnits: (units: Unit[]) => void;
  addUnit: (unit: Omit<Unit, "id" | "createdAt">) => void;
  addUnits: (units: Omit<Unit, "id" | "createdAt">[]) => void;
  updateUnit: (id: number, unit: Partial<Unit>) => void;
  deleteUnit: (id: number) => void;
  getUnitById: (id: number) => Unit | undefined;
  getBaseUnitByType: (type: string) => Unit | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useUnitStore = create<UnitState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        units: initialUnits,
        isLoading: false,
        error: null,

        // Actions
        setUnits: (units) => set({ units }, false, "setUnits"),

        addUnit: (unitData) =>
          set(
            (state) => {
              const newUnit: Unit = {
                ...unitData,
                id: Math.max(0, ...state.units.map((u) => u.id)) + 1,
                createdAt: new Date().toISOString().split("T")[0],
              };
              return {
                units: [newUnit, ...state.units], // Thêm vào đầu danh sách
              };
            },
            false,
            "addUnit",
          ),

        addUnits: (unitsData) =>
          set(
            (state) => {
              let currentMaxId = Math.max(0, ...state.units.map((u) => u.id));
              const newUnits: Unit[] = unitsData.map((unitData, index) => ({
                ...unitData,
                id: currentMaxId + 1 + index,
                createdAt: new Date().toISOString().split("T")[0],
              }));
              return {
                units: [...newUnits, ...state.units],
              };
            },
            false,
            "addUnits",
          ),

        updateUnit: (id, unitData) =>
          set(
            (state) => ({
              units: state.units.map((unit) =>
                unit.id === id ? { ...unit, ...unitData } : unit,
              ),
            }),
            false,
            "updateUnit",
          ),

        deleteUnit: (id) =>
          set(
            (state) => ({
              units: state.units.filter((unit) => unit.id !== id),
            }),
            false,
            "deleteUnit",
          ),

        getUnitById: (id) => {
          return get().units.find((unit) => unit.id === id);
        },

        getBaseUnitByType: (type) => {
          return get().units.find(
            (unit) => unit.type === type && unit.isBaseUnit,
          );
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        reset: () =>
          set(
            {
              units: initialUnits,
              isLoading: false,
              error: null,
            },
            false,
            "reset",
          ),
      }),
      {
        name: "unit-storage", // Key trong localStorage
        partialize: (state) => ({ units: state.units }), // Chỉ lưu units
      },
    ),
    {
      name: "UnitStore", // Tên hiển thị trong Redux DevTools
    },
  ),
);

export default useUnitStore;
