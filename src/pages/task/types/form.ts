import type { Personnel } from "../../../stores/usePersonnelStore";
import type { Team } from "../../../stores/useTeamStore";
import type { GeographicalSelection } from "../../plan/types";

export interface TaskAssigneeOption {
  id: number;
  name: string;
  code: string;
  avatar: string;
}

export interface TaskSelectionSummaryItem {
  type: "region" | "area" | "plot";
  id: string;
  name: string;
  parentName?: string;
}

export interface TaskSelectionSummaryGroup {
  regionId: string;
  regionName: string;
  items: TaskSelectionSummaryItem[];
}

export interface RegionLookup {
  id: string | number;
  name: string;
  enterpriseId?: string;
  subAreas?: Array<{
    id: string | number;
    name: string;
    plots?: Array<{
      id: string | number;
      name: string;
    }>;
  }>;
}

export type TaskPersonnelList = Personnel[];
export type TaskTeamList = Team[];
export type TaskGeoSelectionList = GeographicalSelection[];
