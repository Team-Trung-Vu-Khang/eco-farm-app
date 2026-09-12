import type { CultivationAreaConfig } from "../types/types";

export const CULTIVATION_AREA_CONFIG_KEY = "region-config";

export const DEFAULT_MAP_CENTER = { lat: 11.54, lng: 106.9 };

export const EMPTY_CULTIVATION_AREA_CONFIG: CultivationAreaConfig = {
  farmingMethodId: "",
  irrigationMethodId: "",
  selectedCrops: [],
  seedSelections: {},
};
