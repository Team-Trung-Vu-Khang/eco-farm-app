import type L from "leaflet";
import type {
  CultivationArea,
  CultivationAreaConfig,
} from "../../../stores/useCultivationAreaStore";
import type { Region, SubArea } from "../../region-chart/constants";
import type { Personnel } from "../../../stores/usePersonnelStore";
import type { Standard } from "../../../stores/useEnterpriseCertificateStore";
import type { FarmingMethod } from "../../../stores/useFarmingMethodStore";
import type { IrrigationSystem } from "../../../stores/useIrrigationSystemStore";
import type { Variety as CropVariety } from "../../variety/types";
import type { Variety as SeedVariety } from "../../seed/types/types";

export type {
  CultivationArea,
  CultivationAreaConfig,
  Region,
  SubArea,
  Personnel,
  Standard,
  FarmingMethod,
  IrrigationSystem,
  CropVariety,
  SeedVariety,
};

export type CultivationAreaFormMode = "create" | "edit";

export interface CultivationAreaPointWarning {
  type: "outside" | "overlap" | "intersect";
  label: string;
  suggested: L.LatLng | null;
  index?: number;
}
