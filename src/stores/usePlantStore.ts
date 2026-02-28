import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { MOCK_PLANTS, type Plant } from "../pages/region-chart/constants";
import useRegionStore from "./useRegionStore";

interface PlantState {
  // State
  plants: Plant[];
  importedPlants: Partial<Plant>[] | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPlants: (plants: Plant[]) => void;
  setImportedPlants: (plants: Partial<Plant>[] | null) => void;
  addPlant: (plant: Omit<Plant, "id">) => void;
  addPlants: (plants: Plant[]) => void;
  updatePlant: (id: string, plant: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  getPlantById: (id: string) =>
    | {
        plant: Plant | undefined;
        plot: any;
        area: any;
        region: any;
      }
    | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const usePlantStore = create<PlantState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        plants: MOCK_PLANTS as unknown as Plant[],
        importedPlants: null,
        isLoading: false,
        error: null,

        // Actions
        setPlants: (plants) => set({ plants }, false, "setPlants"),

        setImportedPlants: (importedPlants) =>
          set({ importedPlants }, false, "setImportedPlants"),

        addPlant: (plantData) =>
          set(
            (state) => {
              const newPlant: Plant = {
                ...plantData,
                id: (
                  Math.max(0, ...state.plants.map((p) => parseInt(p.id) || 0)) +
                  1
                ).toString(),
              } as Plant;

              return {
                plants: [newPlant, ...state.plants],
              };
            },
            false,
            "addPlant",
          ),

        addPlants: (plants: Plant[]) =>
          set(
            (state) => ({
              plants: [...state.plants, ...plants],
            }),
            false,
            "addPlants",
          ),

        updatePlant: (id, plantData) =>
          set(
            (state) => ({
              plants: state.plants.map((plant) =>
                plant.id === id ? { ...plant, ...plantData } : plant,
              ),
            }),
            false,
            "updatePlant",
          ),

        deletePlant: (id) =>
          set(
            (state) => ({
              plants: state.plants.filter((plant) => plant.id !== id),
            }),
            false,
            "deletePlant",
          ),

        getPlantById: (id) => {
          const plant = get().plants.find((p) => String(p.id) === String(id));
          if (!plant) return undefined;

          // Leverage useRegionStore to get geographical context
          const regionStore = useRegionStore.getState();
          const plotData = regionStore.getPlotById(plant.plotId);

          return {
            plant,
            plot: plotData?.plot,
            area: plotData?.area,
            region: plotData?.region,
          };
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        reset: () =>
          set(
            {
              plants: MOCK_PLANTS as unknown as Plant[],
              isLoading: false,
              error: null,
            },
            false,
            "reset",
          ),
      }),
      {
        name: "plant-storage", // Key in localStorage
        partialize: (state) => ({ plants: state.plants }), // Only persist plants
      },
    ),
    {
      name: "PlantStore", // Display name in Redux DevTools
    },
  ),
);

export default usePlantStore;
