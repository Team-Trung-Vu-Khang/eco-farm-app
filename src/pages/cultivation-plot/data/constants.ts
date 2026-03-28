import L from "leaflet";
import type { CultivationPlotConfig } from "../types/types";

export const CULTIVATION_PLOT_CONFIG_KEY = "lot-config";

export const DEFAULT_PLOT_MAP_CENTER = L.latLng(11.54, 106.9);

export const EMPTY_CULTIVATION_PLOT_CONFIG: CultivationPlotConfig = {
  farmingMethodId: "",
  irrigationMethodId: "",
  selectedCrops: [],
  seedSelections: {},
};
