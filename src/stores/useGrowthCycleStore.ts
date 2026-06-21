import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { GrowthCycle } from "../pages/growth-cycle/types/types";
import { initialGrowthCycles } from "@/pages/growth-cycle/data/mocks";

function normalizeGrowthCycle(cycle: GrowthCycle): GrowthCycle {
  const normalizedStages = cycle.stages ?? [];
  const normalizedCropId =
    cycle.cropName && cycle.cropId !== cycle.cropName ? cycle.cropName : cycle.cropId;

  return {
    ...cycle,
    cycleType: cycle.cycleType ?? "plant",
    cropId: normalizedCropId,
    totalDays: normalizedStages.reduce(
      (sum, stage) => sum + (Number(stage.duration) || 0),
      0,
    ),
    numStages: normalizedStages.length,
  };
}

interface GrowthCycleState {
  growthCycles: GrowthCycle[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addGrowthCycle: (
    growthCycle: Omit<
      GrowthCycle,
      "id" | "createdAt" | "updatedAt" | "numStages"
    >,
  ) => void;
  updateGrowthCycle: (id: string, growthCycle: Partial<GrowthCycle>) => void;
  deleteGrowthCycle: (id: string) => void;
  getGrowthCycleById: (id: string) => GrowthCycle | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useGrowthCycleStore = create<GrowthCycleState>()(
  devtools(
    persist(
      (set, get) => ({
        growthCycles: initialGrowthCycles.map(normalizeGrowthCycle),
        isLoading: false,
        error: null,

        addGrowthCycle: (data) => {
          set(
            (state) => {
              const newId = (
                Math.max(
                  0,
                  ...state.growthCycles.map(
                    (g) => parseInt(g.id.replace("GC", "")) || 0,
                  ),
                ) + 1
              )
                .toString()
                .padStart(3, "0");

              const newCycle: GrowthCycle = {
                ...data,
                id: `GC${newId}`,
                numStages: data.stages.length,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              };

              return {
                growthCycles: [normalizeGrowthCycle(newCycle), ...state.growthCycles],
              };
            },
            false,
            "addGrowthCycle",
          );
        },

        updateGrowthCycle: (id, data) => {
          set(
            (state) => ({
              growthCycles: state.growthCycles.map((g) => {
                if (g.id === id) {
                  return normalizeGrowthCycle({
                    ...g,
                    ...data,
                    numStages: data.stages ? data.stages.length : g.numStages,
                    updatedAt: Date.now(),
                  });
                }
                return g;
              }),
            }),
            false,
            "updateGrowthCycle",
          );
        },

        deleteGrowthCycle: (id) => {
          set(
            (state) => ({
              growthCycles: state.growthCycles.filter((g) => g.id !== id),
            }),
            false,
            "deleteGrowthCycle",
          );
        },

        getGrowthCycleById: (id) => {
          return get().growthCycles.find((g) => g.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),
      }),
      {
        name: "growth-cycle-storage",
        partialize: (state) => ({
          growthCycles: state.growthCycles.map(normalizeGrowthCycle),
        }),
        merge: (persistedState, currentState) => {
          const typedPersistedState = persistedState as Partial<GrowthCycleState>;

          return {
            ...currentState,
            ...typedPersistedState,
            growthCycles: (
              typedPersistedState.growthCycles ?? currentState.growthCycles
            ).map(normalizeGrowthCycle),
          };
        },
      },
    ),
    { name: "GrowthCycleStore" },
  ),
);

export default useGrowthCycleStore;
