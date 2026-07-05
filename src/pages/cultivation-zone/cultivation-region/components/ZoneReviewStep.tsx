import { useFormContext } from "react-hook-form";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useIrrigationSystems } from "@/features/master-data/hooks/useIrrigationSystems";
import { useSeeds } from "@/features/farm/hooks/useSeeds";
import { useMasterData, useFarmPersonnel } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { CultivationRegionCreateConfirmationStep } from "./CultivationRegionCreateConfirmationStep";

export const ZoneReviewStep = () => {
  const { watch } = useFormContext<CultivationZoneFormValues>();
  const formValues = watch();

  // Reference data for display
  const { items: farmingMethods } = useCatalog("farming-methods", {
    params: { size: 100 },
  });
  const { items: irrigationSystems } = useIrrigationSystems({
    params: { size: 100 },
  });
  const { items: allSeeds } = useSeeds({ params: { size: 100 } });
  const { items: certificateStandards } = useMasterData(
    "certificate-standards",
    {
      params: { size: 100 },
    },
  );

  const workspaceId = useSelectedWorkspaceId();
  const numericWorkspaceId = workspaceId ? Number(workspaceId) : undefined;
  const { items: personnel } = useFarmPersonnel({
    params: { size: 100 },
    workspaceId: numericWorkspaceId,
  });

  // Resolve selections using Number conversion to avoid any string/number type mismatch
  const selectedSeeds = allSeeds.filter((s) =>
    (formValues.seedIds ?? []).map(Number).includes(Number(s.id)),
  );
  const selectedCerts = certificateStandards.filter((c) =>
    (formValues.certificateIds ?? []).map(Number).includes(Number(c.id)),
  );
  const selectedPersonnel = personnel.filter((p) =>
    (formValues.personnelIds ?? []).map(Number).includes(Number(p.id)),
  );

  // ─── Map form state to Confirmation Step Props ──────────────────────────
  const mappedManagers = selectedPersonnel.map((p) => ({
    id: String(p.id),
    fullName: p.fullName,
    avatar: p.avatarUrl || p.avatar,
  }));

  const mappedCerts = selectedCerts.map((c) => ({
    code: c.code || String(c.id),
    name: c.name ?? "",
  }));

  const entities = (formValues.selections ?? []).map((sel) => ({
    id: sel.id,
    targetId: sel.plotId || sel.areaId || sel.regionId,
    name: sel.name ?? "",
    type:
      sel.type === "region"
        ? "Vùng trồng"
        : sel.type === "area"
          ? "Khu vực"
          : "Lô đất",
    typeCode: sel.type,
  }));

  const commonConfig = {
    farmingMethodId: String(formValues.farmingMethodId),
    irrigationMethodId: String(formValues.irrigationSystemId),
    selectedCrops: Array.from(
      new Set(
        selectedSeeds
          .map((s) => s.cropVariety?.id)
          .filter(Boolean)
          .map(String),
      ),
    ),
    seedSelections: (() => {
      const selections: Record<string, string[]> = {};
      selectedSeeds.forEach((seed) => {
        if (!seed.cropVariety?.id) return;
        const cropVarietyId = String(seed.cropVariety.id);
        if (!selections[cropVarietyId]) {
          selections[cropVarietyId] = [];
        }
        selections[cropVarietyId].push(String(seed.id));
      });
      return selections;
    })(),
  };

  const mappedFarmingMethods = farmingMethods.map((m) => ({
    id: String(m.id),
    name: m.name ?? "",
  }));

  const mappedIrrigationSystems = irrigationSystems.map((s) => ({
    id: String(s.id),
    name: s.name ?? "",
  }));

  const mappedVarieties = Array.from(
    new Map(
      selectedSeeds
        .filter((s) => s.cropVariety?.id)
        .map((s) => [
          String(s.cropVariety?.id),
          {
            id: String(s.cropVariety?.id),
            varietyName: s.cropVariety?.name ?? "",
          },
        ]),
    ).values(),
  );

  const mappedSeeds = selectedSeeds.map((s) => ({
    id: String(s.id),
    varietyName: s.cropVariety?.name ?? "",
  }));

  const isEdit = !!formValues.id;
  const title = isEdit ? "Xác nhận cập nhật thông tin" : "Xác nhận thông tin";
  const description = isEdit
    ? "Vui lòng kiểm tra kỹ các thông tin dưới đây trước khi lưu cập nhật vùng canh tác."
    : "Vui lòng kiểm tra kỹ các thông tin dưới đây. Sau khi xác nhận, hệ thống sẽ tiến hành khởi tạo vùng canh tác mới.";

  return (
    <CultivationRegionCreateConfirmationStep
      name={formValues.name}
      note={formValues.notes ?? ""}
      entities={entities}
      selectedManagers={mappedManagers}
      selectedCerts={mappedCerts}
      commonConfig={commonConfig}
      farmingMethods={mappedFarmingMethods}
      irrigationSystems={mappedIrrigationSystems}
      varieties={mappedVarieties}
      seeds={mappedSeeds}
      title={title}
      description={description}
    />
  );
};
