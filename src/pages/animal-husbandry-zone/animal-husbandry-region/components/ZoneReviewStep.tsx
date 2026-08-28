import { useFormContext } from "react-hook-form";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useIrrigationSystems } from "@/features/master-data/hooks/useIrrigationSystems";
import { useMasterData, useFarmPersonnel } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { CultivationRegionCreateConfirmationStep } from "./CultivationRegionCreateConfirmationStep";
import { useMethodApplications } from "@/features/foundation";
import { useMemo } from "react";

export const ZoneReviewStep = () => {
  const { watch } = useFormContext<CultivationZoneFormValues>();
  const formValues = watch();

  // Reference data for display
  const { items: farmingMethods } = useCatalog("farming-methods", {
    params: { size: 100 },
  });
  const { items: irrigationSystems } = useIrrigationSystems({
    params: { domainCode: "LIVESTOCK", size: 100 },
  });
  const { items: certificateStandards } = useMasterData(
    "certificate-standards",
    {
      params: { size: 100 },
    },
  );

  const selectedFarmingMethodId = Number(formValues.farmingMethodId);

  const { items: methodApplications } = useMethodApplications({
    params: { domainCode: "LIVESTOCK", size: 100 },
    enabled: !!selectedFarmingMethodId && selectedFarmingMethodId > 0,
  });

  const activeMethodApp = useMemo(() => {
    return methodApplications.find(
      (item) => item.productionMethod?.id === selectedFarmingMethodId,
    );
  }, [methodApplications, selectedFarmingMethodId]);

  // Extract selected variants
  const selectedVariants = useMemo(() => {
    if (!activeMethodApp) return [];
    const list: Array<{
      id: number;
      name: string;
      code: string;
      subjectName: string;
    }> = [];
    activeMethodApp.subjects?.forEach((subject) => {
      subject.variants?.forEach((variant) => {
        if (
          (formValues.seedIds ?? []).map(Number).includes(Number(variant.id))
        ) {
          list.push({
            id: variant.id,
            name: variant.name || "",
            code: variant.code || "",
            subjectName: subject.subjectName || "",
          });
        }
      });
    });
    return list;
  }, [activeMethodApp, formValues.seedIds]);

  const workspaceId = useSelectedWorkspaceId();
  const numericWorkspaceId = workspaceId ? Number(workspaceId) : undefined;
  const { items: personnel } = useFarmPersonnel({
    params: { size: 100 },
    workspaceId: numericWorkspaceId,
  });

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
        ? "Vùng chăn nuôi"
        : sel.type === "area"
          ? "Khu vực"
          : "Chuồng/Lô",
    typeCode: sel.type,
  }));

  const selectedCrops = (formValues.seedIds ?? []).map(String);

  const commonConfig = {
    farmingMethodId: String(formValues.farmingMethodId),
    irrigationMethodId: String(formValues.rearingMethodId),
    selectedCrops,
    seedSelections: (() => {
      const selections: Record<string, string[]> = {};
      selectedCrops.forEach((cropId) => {
        selections[cropId] = [cropId];
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

  const mappedVarieties = selectedVariants.map((v) => ({
    id: String(v.id),
    varietyName: v.name,
  }));

  const mappedSeeds = selectedVariants.map((v) => ({
    id: String(v.id),
    varietyName: v.name,
  }));

  const isEdit = !!formValues.id;
  const title = isEdit ? "Xác nhận cập nhật thông tin" : "Xác nhận thông tin";
  const description = isEdit
    ? "Vui lòng kiểm tra kỹ các thông tin dưới đây trước khi lưu cập nhật vùng chăn nuôi."
    : "Vui lòng kiểm tra kỹ các thông tin dưới đây. Sau khi xác nhận, hệ thống sẽ tiến hành khởi tạo vùng chăn nuôi mới.";

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
