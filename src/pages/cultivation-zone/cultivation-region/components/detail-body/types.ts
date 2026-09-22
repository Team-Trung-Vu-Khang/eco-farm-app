import type { CultivationRegion } from "../../../../stores/useCultivationRegionStore";
import type { CultivationRegionDetails } from "../../useCultivationRegionDetail";

export type DetailBodyPrimaryManager = {
  id?: string | number;
  fullName?: string;
  phone?: string;
  avatar?: string;
  /** Present when resolved from the API personnel list. */
  positionName?: string;
  positionCode?: string;
} | null;

export type CultivationRegionDetailBodyCommonProps = {
  area: CultivationRegion;
  details: CultivationRegionDetails;
  primaryManager: DetailBodyPrimaryManager;
};
