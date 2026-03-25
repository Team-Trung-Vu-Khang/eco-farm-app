import { initialSeasons } from "@/pages/season/data/mocks";
import type { Season } from "@/pages/season/types/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SeasonState {
  seasons: Season[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addSeason: (season: Omit<Season, "id" | "createdAt" | "updatedAt">) => void;
  updateSeason: (id: string, season: Partial<Season>) => void;
  deleteSeason: (id: string) => void;
  getSeasonById: (id: string) => Season | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useSeasonStore = create<SeasonState>()(
  devtools(
    persist(
      (set, get) => ({
        seasons: initialSeasons,
        isLoading: false,
        error: null,

        addSeason: (data) => {
          set(
            (state) => {
              const newId = (
                Math.max(
                  0,
                  ...state.seasons.map(
                    (s) => parseInt(s.id.replace("S", "")) || 0,
                  ),
                ) + 1
              )
                .toString()
                .padStart(3, "0");

              const newSeason: Season = {
                ...data,
                id: `S${newId}`,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              };

              return {
                seasons: [newSeason, ...state.seasons],
              };
            },
            false,
            "addSeason",
          );
        },

        updateSeason: (id, data) => {
          set(
            (state) => ({
              seasons: state.seasons.map((s) => {
                if (s.id === id) {
                  return {
                    ...s,
                    ...data,
                    updatedAt: Date.now(),
                  };
                }
                return s;
              }),
            }),
            false,
            "updateSeason",
          );
        },

        deleteSeason: (id) => {
          set(
            (state) => ({
              seasons: state.seasons.filter((s) => s.id !== id),
            }),
            false,
            "deleteSeason",
          );
        },

        getSeasonById: (id) => {
          return get().seasons.find((s) => s.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),
      }),
      {
        name: "season-storage",
        partialize: (state) => ({ seasons: state.seasons }),
      },
    ),
    { name: "SeasonStore" },
  ),
);

export default useSeasonStore;
