import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Variety, CreateVarietyForm } from "../pages/seed/types/types";
import { initialData } from "@/pages/seed/data/mocks";

interface SeedState {
  seeds: Variety[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addSeed: (seed: CreateVarietyForm) => void;
  updateSeed: (id: string, seed: Partial<Variety>) => void;
  deleteSeed: (id: string) => void;
  getSeedById: (id: string) => Variety | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const mergeSeedCatalog = (
  persistedState: Partial<SeedState> | undefined,
  currentState: SeedState,
): SeedState => {
  const persistedSeeds = persistedState?.seeds ?? [];
  const seedsById = new Map(currentState.seeds.map((seed) => [seed.id, seed]));

  persistedSeeds.forEach((seed) => {
    seedsById.set(seed.id, seed);
  });

  return {
    ...currentState,
    ...persistedState,
    seeds: Array.from(seedsById.values()),
  };
};

const useSeedStore = create<SeedState>()(
  devtools(
    persist(
      (set, get) => ({
        seeds: initialData,
        isLoading: false,
        error: null,

        addSeed: (data) => {
          set(
            (state) => {
              const newId = (
                Math.max(0, ...state.seeds.map((s) => parseInt(s.id) || 0)) + 1
              ).toString();

              // Convert illustration File to URL if needed
              const illustrationUrl =
                data.illustration instanceof File
                  ? URL.createObjectURL(data.illustration)
                  : data.illustration;

              const newSeed: Variety = {
                id: newId,
                varietyCode: data.varietyCode,
                varietyName: data.varietyName,
                crop: data.crop,
                supplier: data.supplier,
                origin: data.origin,
                germinationRate: data.germinationRate,
                uniformity: data.uniformity,
                yield: data.yield,
                description: data.description,
                illustration: illustrationUrl,
                editorContent: data.editorContent,
                documents:
                  data.contentType === "pdf" && data.pdfFile
                    ? [
                        {
                          name: data.pdfFile.name,
                          url: URL.createObjectURL(data.pdfFile),
                        },
                      ]
                    : [],
                status: "active",
                updatedAt: new Date().toISOString().split("T")[0],
              };

              return {
                seeds: [newSeed, ...state.seeds],
              };
            },
            false,
            "addSeed",
          );
        },

        updateSeed: (id, data) => {
          set(
            (state) => ({
              seeds: state.seeds.map((s) => {
                if (s.id === id) {
                  // Convert illustration File to URL if needed
                  const illustrationUrl =
                    data.illustration instanceof File
                      ? URL.createObjectURL(data.illustration)
                      : data.illustration;

                  const updatedSeed = {
                    ...s,
                    ...data,
                    illustration: illustrationUrl ?? s.illustration,
                    updatedAt: new Date().toISOString().split("T")[0],
                  };

                  return updatedSeed;
                }
                return s;
              }),
            }),
            false,
            "updateSeed",
          );
        },

        deleteSeed: (id) => {
          set(
            (state) => ({
              seeds: state.seeds.filter((s) => s.id !== id),
            }),
            false,
            "deleteSeed",
          );
        },

        getSeedById: (id) => {
          return get().seeds.find((s) => s.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),
      }),
      {
        name: "seed-storage",
        partialize: (state) => ({ seeds: state.seeds }),
        merge: mergeSeedCatalog,
      },
    ),
    { name: "SeedStore" },
  ),
);

export default useSeedStore;
