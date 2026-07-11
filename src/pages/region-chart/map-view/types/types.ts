export interface SelectedEntityStats {
  total: number;
  healthy: number;
  diseased: number;
  harvesting: number;
  types: Record<string, number>;
}

export interface SelectedLocationInfo {
  zoneName?: string;
  areaName?: string;
  plotName?: string;
}

export interface SelectedEntity {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any;
  stats: SelectedEntityStats;
  center?: [number, number] | null;
  locationInfo?: SelectedLocationInfo;
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
