import type { Feature, FeatureCollection, Geometry } from "geojson";

export type SoilMetric =
  | "ph"
  | "moisture"
  | "nitrogen"
  | "phosphorus"
  | "potassium"
  | "ec"
  | "temperature"
  | "compaction";

export interface SoilData {
  ph: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ec: number;
  temperature: number;
  compaction: number;
  texture: string;
  organicMatter: number;
  lastUpdated: string;
}

export interface SoilPlan {
  id: string;
  regionId: string;
  regionName: string;
  issues: string;
  actions: string;
  startDate: string;
  assignedTo: string;
  status: "planned" | "in_progress" | "completed";
  createdAt: string;
}

export interface SoilPlanForm {
  startDate: string;
  assignedTo: string;
  customAction: string;
}

export interface SelectedSoilFeature {
  id: string;
  name: string;
  type: string;
  data: SoilData;
}

export interface SoilLayerVisibility {
  zone: boolean;
  area: boolean;
  plot: boolean;
}

export interface SoilMetricAnalysis {
  status: "good" | "warning" | "bad";
  message: string;
  action: string | null;
}

export interface SoilMetricDetails {
  ideal: string;
  lowEffect: string;
  highEffect: string;
  source?: string;
}

export interface SoilMetricConfigItem {
  label: string;
  unit: string;
  range: [number, number];
  colorScale: (value: number) => string;
  description: string;
  thresholds?: number[];
  details: SoilMetricDetails;
}

export interface SoilFeatureProperties {
  id?: string | number;
  name?: string;
  zoneId?: string | number;
  areaId?: string | number;
  [key: string]: unknown;
}

export type SoilGeoFeature = Feature<Geometry, SoilFeatureProperties>;
export type SoilGeoCollection = FeatureCollection<Geometry, SoilFeatureProperties>;
