import type { Variety } from "@/pages/variety/types";
import type { CultivationRegionConfig } from "../../../stores/useCultivationRegionStore";
import type { GeographicalSelection } from "../components/types";

const AREA_CONFIG_ID = "area-config";

const emptyConfig: CultivationRegionConfig = {
  farmingMethodId: "",
  irrigationMethodId: "",
  selectedCrops: [],
  seedSelections: {},
};

export type SeedVarietySelection = Pick<
  Variety,
  "id" | "varietyCode" | "varietyName"
>;

export type CultivationRegionTargetEntity = {
  id: string;
  targetId: string;
  name: string;
  type: string;
  typeCode: GeographicalSelection["type"];
};

export { AREA_CONFIG_ID, emptyConfig };
