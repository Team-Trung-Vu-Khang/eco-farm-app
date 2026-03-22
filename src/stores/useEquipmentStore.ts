import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  initialEquipments,
  type Equipment,
} from "../pages/equipment/data/constants";

interface EquipmentState {
  // State
  equipments: Equipment[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setEquipments: (equipments: Equipment[]) => void;
  addEquipment: (equipment: Omit<Equipment, "id" | "createdAt">) => void;
  updateEquipment: (id: number, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: number) => void;
  getEquipmentById: (id: number) => Equipment | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useEquipmentStore = create<EquipmentState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        equipments: initialEquipments,
        isLoading: false,
        error: null,

        // Actions
        setEquipments: (equipments) =>
          set({ equipments }, false, "setEquipments"),

        addEquipment: (equipmentData) =>
          set(
            (state) => {
              const newEquipment: Equipment = {
                ...equipmentData,
                id: Math.max(0, ...state.equipments.map((e) => e.id)) + 1,
                createdAt: new Date().toISOString().split("T")[0],
              };
              return {
                equipments: [newEquipment, ...state.equipments], // Thêm vào đầu danh sách
              };
            },
            false,
            "addEquipment",
          ),

        updateEquipment: (id, equipmentData) =>
          set(
            (state) => ({
              equipments: state.equipments.map((equipment) =>
                equipment.id === id
                  ? { ...equipment, ...equipmentData }
                  : equipment,
              ),
            }),
            false,
            "updateEquipment",
          ),

        deleteEquipment: (id) =>
          set(
            (state) => ({
              equipments: state.equipments.filter(
                (equipment) => equipment.id !== id,
              ),
            }),
            false,
            "deleteEquipment",
          ),

        getEquipmentById: (id) => {
          return get().equipments.find((equipment) => equipment.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        reset: () =>
          set(
            {
              equipments: initialEquipments,
              isLoading: false,
              error: null,
            },
            false,
            "reset",
          ),
      }),
      {
        name: "equipment-storage", // Key trong localStorage
        partialize: (state) => ({ equipments: state.equipments }), // Chỉ lưu equipments
      },
    ),
    {
      name: "EquipmentStore", // Tên hiển thị trong Redux DevTools
    },
  ),
);

export default useEquipmentStore;
