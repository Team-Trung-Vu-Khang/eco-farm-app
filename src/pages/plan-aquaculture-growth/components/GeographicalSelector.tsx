/**
 * Thin wrapper — delegates to the shared GeographicalSelector with
 * aquaculture-specific labels. Defaults to single-select (multiSelect={false}).
 */
import SharedGeographicalSelector, {
  type GeographicalSelectorProps,
} from "@/shared/components/GeographicalSelector/index";

export type { GeographicalSelection, RegionOption } from "@/shared/components/GeographicalSelector/index";

const GeographicalSelector = (
  props: Omit<GeographicalSelectorProps, "triggerLabel" | "dialogTitle" | "dialogSubtitle"> &
    Partial<Pick<GeographicalSelectorProps, "triggerLabel" | "dialogTitle" | "dialogSubtitle">>,
) => (
  <SharedGeographicalSelector
    triggerLabel="Chọn vùng nuôi trồng thủy sản"
    dialogTitle="Chọn phạm vi nuôi trồng thủy sản"
    dialogSubtitle="Chọn 1 Khu nuôi trồng thủy sản, Khu vực hoặc Ao nuôi cụ thể"
    {...props}
  />
);

export default GeographicalSelector;
