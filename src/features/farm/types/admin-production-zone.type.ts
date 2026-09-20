export interface FarmAdminProductionZoneFilter {
  keyword?: string;
  domainCode?: string; // Default: "CROP"
  workspaceIds?: number[];
  productionSubjectId?: number;
  productionSubjectVariantId?: number;
  seedId?: number;
  province?: string;
  district?: string;
  ward?: string;
  certificateIds?: number[];
  acreageFrom?: number;
  acreageTo?: number;
  status?: string;
  hasActivePlan?: boolean;
}

export interface WorkspaceGroup {
  workspaceId: number;
  workspaceName: string;
  workspaceCode: string;
  imageUrl?: string | null;
  zoneCount: number;
}

export interface FarmAdminProductionZoneGroupsResponse {
  content: WorkspaceGroup[];
  totalZones: number;
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

export interface FarmAdminProductionZoneItem {
  id: number;
  code: string;
  name: string;
  status: string;
  workspaceId: number;
  acreageHa?: number;
  variantNames?: string[];
}

export interface PageResponseFarmAdminProductionZoneItem {
  content: FarmAdminProductionZoneItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
