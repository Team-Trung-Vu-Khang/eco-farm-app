import type { GeoJsonObject } from "geojson";

export interface SelectedEntityStats {
  total: number;
  healthy: number;
  diseased: number;
  harvesting: number;
  types: Record<string, number>;
}

export interface SelectedEntity {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any;
  stats: SelectedEntityStats;
}

export interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  organicMatter: number;
  ec: number;
  temperature: number;
  compaction: number;
  lastTested: string;
}

export interface LayerVisibility {
  zone: boolean;
  area: boolean;
  plot: boolean;
  plant: boolean;
}
