import L from "leaflet";
import type { CultivationAreaConfig } from "../types/types";

export const CULTIVATION_AREA_CONFIG_KEY = "region-config";

export const DEFAULT_MAP_CENTER = L.latLng(11.54, 106.9);

export const EMPTY_CULTIVATION_AREA_CONFIG: CultivationAreaConfig = {
  farmingMethodId: "",
  irrigationMethodId: "",
  selectedCrops: [],
  seedSelections: {},
};
