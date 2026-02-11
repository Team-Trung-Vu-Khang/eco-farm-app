import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type Region } from "../pages/region-chart/constants";

import MOCK_REGIONS from "../assets/map/zone-full.json" with { type: "json" };

interface RegionState {
  // State
  regions: Region[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setRegions: (regions: Region[]) => void;
  addRegion: (region: Omit<Region, "id">) => void;
  updateRegion: (id: number, region: Partial<Region>) => void;
  upsertSubArea: (regionId: number, subArea: any) => void;
  removeSubArea: (id: string) => void;
  upsertPlot: (regionId: number, areaId: string, plot: any) => void;
  removePlot: (id: string) => void;
  deleteRegion: (id: number) => void;
  getRegionById: (id: number) => Region | undefined;
  getAreaById: (id: string) => any | undefined;
  getPlotById: (
    id: string,
  ) => { plot: any; area: any; region: any } | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useRegionStore = create<RegionState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        regions: MOCK_REGIONS as unknown as Region[],
        isLoading: false,
        error: null,

        // Actions
        setRegions: (regions) => set({ regions }, false, "setRegions"),

        addRegion: (regionData) =>
          set(
            (state) => {
              const newRegion: Region = {
                ...regionData,
                id: Math.max(0, ...state.regions.map((r) => r.id)) + 1,
              } as Region;
              return {
                regions: [newRegion, ...state.regions],
              };
            },
            false,
            "addRegion",
          ),

        updateRegion: (id, regionData) =>
          set(
            (state) => ({
              regions: state.regions.map((region) =>
                region.id === id ? { ...region, ...regionData } : region,
              ),
            }),
            false,
            "updateRegion",
          ),

        upsertSubArea: (regionId, subArea) =>
          set(
            (state) => ({
              regions: state.regions.map((region) => {
                if (region.id !== regionId) return region;

                // Create a clone of subAreas
                const currentSubAreas = [...(region.subAreas || [])];

                // Find if subArea already exists by ID
                const index = currentSubAreas.findIndex(
                  (s) => String(s.id) === String(subArea.id),
                );

                const mappedSubArea = {
                  id: String(subArea.id),
                  code: subArea.code,
                  name: subArea.name,
                  regionId: regionId,
                  area: subArea.area,
                  landType: subArea.landType,
                  terrain: subArea.terrain,
                  plots: subArea.plots || [],
                  createdAt: subArea.createdAt || new Date().toISOString(),
                  status: subArea.status || "active",
                  coordinates: subArea.coordinates,
                };

                if (index !== -1) {
                  // Update existing
                  currentSubAreas[index] = mappedSubArea;
                } else {
                  // Add new
                  currentSubAreas.push(mappedSubArea);
                }

                return { ...region, subAreas: currentSubAreas };
              }),
            }),
            false,
            "upsertSubArea",
          ),

        removeSubArea: (id) =>
          set(
            (state) => ({
              regions: state.regions.map((region) => ({
                ...region,
                subAreas: (region.subAreas || []).filter(
                  (s) => String(s.id) !== String(id),
                ),
              })),
            }),
            false,
            "removeSubArea",
          ),

        upsertPlot: (regionId, areaId, plot) =>
          set(
            (state) => ({
              regions: state.regions.map((region) => {
                if (region.id !== regionId) return region;

                return {
                  ...region,
                  subAreas: (region.subAreas || []).map((area) => {
                    if (String(area.id) !== String(areaId)) return area;

                    const currentPlots = [...(area.plots || [])];
                    const index = currentPlots.findIndex(
                      (p) => String(p.id) === String(plot.id),
                    );

                    const mappedPlot = {
                      id: String(plot.id),
                      name: plot.name,
                      area: plot.area,
                      contour: plot.contour,
                      altitude: plot.altitude,
                      coordinates: plot.coordinates,
                    };

                    if (index !== -1) {
                      currentPlots[index] = mappedPlot;
                    } else {
                      currentPlots.push(mappedPlot);
                    }

                    return { ...area, plots: currentPlots };
                  }),
                };
              }),
            }),
            false,
            "upsertPlot",
          ),

        removePlot: (id) =>
          set(
            (state) => ({
              regions: state.regions.map((region) => ({
                ...region,
                subAreas: (region.subAreas || []).map((area) => ({
                  ...area,
                  plots: (area.plots || []).filter(
                    (p) => String(p.id) !== String(id),
                  ),
                })),
              })),
            }),
            false,
            "removePlot",
          ),

        deleteRegion: (id) =>
          set(
            (state) => ({
              regions: state.regions.filter((region) => region.id !== id),
            }),
            false,
            "deleteRegion",
          ),

        getRegionById: (id) => {
          return get().regions.find((region) => region.id === id);
        },

        getAreaById: (id) => {
          return get()
            .regions.flatMap((r) => r.subAreas || [])
            .find((a) => String(a.id) === String(id));
        },

        getPlotById: (id) => {
          let result: { plot: any; area: any; region: any } | undefined;

          get().regions.forEach((region) => {
            (region.subAreas || []).forEach((area) => {
              const plot = (area.plots || []).find(
                (p) => String(p.id) === String(id),
              );
              if (plot) {
                result = { plot, area, region };
              }
            });
          });

          return result;
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        reset: () =>
          set(
            {
              regions: MOCK_REGIONS as unknown as Region[],
              isLoading: false,
              error: null,
            },
            false,
            "reset",
          ),
      }),
      {
        name: "region-storage", // Key in localStorage
        partialize: (state) => ({ regions: state.regions }), // Only persist regions
      },
    ),
    {
      name: "RegionStore", // Display name in Redux DevTools
    },
  ),
);

export default useRegionStore;
