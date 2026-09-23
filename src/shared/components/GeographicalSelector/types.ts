export interface GeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
  /** Display name of this node (plot name, area name, or region name) */
  name?: string;
  regionName?: string;
  areaName?: string;
  plotName?: string;
}

export type RegionOption = {
  id: string | number;
  /** Short code, used for search filtering */
  code?: string;
  name: string;
  enterpriseId?: string;
};
