export interface SelectedEntityStats {
  total: number;
  healthy: number;
  diseased: number;
  harvesting: number;
  types: Record<string, number>;
}

export type MapEntityLevel = "zone" | "area" | "plot" | "plant" | "soil-cluster";

export interface DrilldownItem {
  key: string;
  level: MapEntityLevel;
  title: string;
  subtitle?: string;
  center?: [number, number] | null;
  featureIndex?: number;
  source: "geojson" | "soil";
}

export interface SoilClusterInfo {
  key: string;
  label: string;
  position: string;
  deviceCount: number;
  lastSynced: string;
  metrics: SoilData;
}

export interface SelectedLocationInfo {
  zoneName?: string;
  areaName?: string;
  plotName?: string;
}

export interface SelectedEntity {
  id: string;
  key: string;
  level: MapEntityLevel;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any;
  stats: SelectedEntityStats;
  center?: [number, number] | null;
  locationInfo?: SelectedLocationInfo;
  lineage?: string[];
  children?: DrilldownItem[];
  soilClusters?: SoilClusterInfo[];
  soilCluster?: SoilClusterInfo;
  description?: string;
}

export interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  organicMatter: number;
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
