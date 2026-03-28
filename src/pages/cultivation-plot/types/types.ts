import type L from "leaflet";
import type {
  CultivationPlot,
  CultivationPlotConfig,
} from "../../../stores/useCultivationPlotStore";
import type { FarmingMethod } from "../../../stores/useFarmingMethodStore";
import type { IrrigationSystem } from "../../../stores/useIrrigationSystemStore";
import type { Personnel } from "../../../stores/usePersonnelStore";
import type { Standard } from "../../../stores/useEnterpriseCertificateStore";
import type { Region, SubArea, Plot } from "../../region-chart/constants";
import type { Variety as CropVariety } from "../../variety/types";
import type { Variety as SeedVariety } from "../../seed/types/types";

export type {
  CultivationPlot,
  CultivationPlotConfig,
  FarmingMethod,
  IrrigationSystem,
  Personnel,
  Standard,
  Region,
  SubArea,
  Plot,
  CropVariety,
  SeedVariety,
};

export interface CultivationPlotPointWarning {
  type: "outside" | "overlap" | "intersect";
  label: string;
  suggested: L.LatLng | null;
  index?: number;
}
