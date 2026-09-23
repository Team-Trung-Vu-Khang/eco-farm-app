/**
 * Thin wrapper — delegates to the shared GeographicalSelector with
 * animal husbandry-specific labels. Defaults to single-select (multiSelect={false}).
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
    triggerLabel="Chọn vùng chăn nuôi"
    dialogTitle="Chọn phạm vi chăn nuôi"
    dialogSubtitle="Chọn 1 Khu chăn nuôi, Khu vực hoặc Ô chuồng cụ thể"
    {...props}
  />
);

export default GeographicalSelector;
