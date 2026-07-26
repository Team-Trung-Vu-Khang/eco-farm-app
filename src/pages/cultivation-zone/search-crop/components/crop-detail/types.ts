import type L from "leaflet";
import type { RefObject } from "react";
import type { Personnel } from "../../../../../stores/usePersonnelStore";
import type { Plan } from "../../../../../stores/usePlanStore";
import type { Task } from "../../../../../stores/useTaskStore";
import type { CropDetail } from "../../../constants";
import type { useCultivationRegionDetail } from "../../../cultivation-region/useCultivationRegionDetail";

type CultivationRegionDetailResult = ReturnType<typeof useCultivationRegionDetail>;

export type CropDetailArea = NonNullable<CultivationRegionDetailResult["area"]>;
export type CropDetailRegionDetails = NonNullable<
  CultivationRegionDetailResult["details"]
>;

export type Coordinate = { lat: number; lng: number };

export type GeoEntity = {
  id: string | number;
  name: string;
  code?: string;
  area?: number;
  coordinates?: Coordinate[];
  regionId?: string | number;
  areaId?: string | number;
  plotId?: string | number;
  type?: string;
  typeCode?: string;
};

export type CropGeoRefs = {
  region: GeoEntity | null;
  area: GeoEntity | null;
  plot: GeoEntity | null;
};

export type ScopeAreaGroup = {
  area: GeoEntity | null;
  entities: GeoEntity[];
};

export type ScopeRegionGroup = {
  region: GeoEntity;
  areas: Record<string, ScopeAreaGroup>;
};

export type ScopedGroupedSelections = Record<string, ScopeRegionGroup>;

export type ScopeMapData = {
  regions: Array<{ region: GeoEntity; explicit: boolean }>;
  areas: Array<{ area: GeoEntity; explicit: boolean }>;
  plots: Array<{ plot: GeoEntity; explicit: boolean }>;
  bounds: [number, number][] | null;
  explicitRegionIds: Set<string>;
  explicitAreaIds: Set<string>;
  explicitPlotIds: Set<string>;
};

export type RegionIndex = {
  regionById: Map<string, GeoEntity>;
  areaById: Map<string, { area: GeoEntity; region: GeoEntity }>;
  plotById: Map<string, { plot: GeoEntity; area: GeoEntity; region: GeoEntity }>;
};

export type RegionOption = {
  id: string | number;
  name: string;
  subAreas?: Array<{
    id: string | number;
    name: string;
    plots?: Array<{ id: string | number; name: string }>;
  }>;
};

export type TechnicalSeed = {
  id: string | number;
  varietyName: string;
  origin?: string;
};

export type TechnicalCrop = {
  id: string | number;
  crop?: string;
  varietyName: string;
  seedType?: string;
  varietyCode?: string;
  illustration?: string;
  selectedSeeds?: TechnicalSeed[];
};

export type CropDetailOverviewProps = {
  activeCrop: CropDetail;
  area: CropDetailArea;
  details: CropDetailRegionDetails;
  cropGeoRefs: CropGeoRefs;
  scopedGroupedSelections: ScopedGroupedSelections;
  scopedSelectionCount: number;
  scopeMapData: ScopeMapData | null;
  scopeMapBounds: [number, number][] | null;
  isScopeMapExpanded: boolean;
  setIsScopeMapExpanded: (value: boolean) => void;
  focusScopeMapToCoordinates: (coordinates?: Coordinate[]) => void;
  formatFullAddress: (region?: GeoEntity | null) => string;
  cropMarkerIcon?: L.DivIcon;
  regionIndex: RegionIndex;
  scopeMapRef: RefObject<L.Map | null>;
  expandedScopeMapRef: RefObject<L.Map | null>;
};

export type CropDetailCropsProps = {
  details: CropDetailRegionDetails;
  filteredTechnicalCrops: TechnicalCrop[];
  groupedCrops: Record<string, TechnicalCrop[]>;
};

export type CropDetailStaffProps = {
  details: CropDetailRegionDetails;
  personnel: Personnel[];
  selectedStaffId: number | null;
  setSelectedStaffId: (staffId: number) => void;
};

export type CropDetailCertificatesProps = {
  details: CropDetailRegionDetails;
};

export type CropDetailPlanSelection = {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
};

export type CropDetailPlansProps = {
  baseRelevantPlans: Plan[];
  relevantPlans: Plan[];
  planFilter: Plan["purpose"];
  setPlanFilter: (value: Plan["purpose"]) => void;
  incurredTasks: Task[];
  regions: RegionOption[];
  setLocation: (path: string) => void;
  setSelectedTask: (task: Task) => void;
  setIsTaskDetailOpen: (value: boolean) => void;
};

export type CropDetailStatisticsProps = {
  details: CropDetailRegionDetails;
};
