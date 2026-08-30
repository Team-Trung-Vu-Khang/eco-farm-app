import { useFormContext } from "react-hook-form";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useRearingMethods } from "@/features/master-data/hooks/useRearingMethods";
import { useMasterData, useFarmPersonnel } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { CultivationRegionCreateConfirmationStep } from "./CultivationRegionCreateConfirmationStep";
import { useMemo } from "react";
import { useMethodApplications } from "@/features/foundation";

export const ZoneReviewStep = () => {
  const { watch } = useFormContext<CultivationZoneFormValues>();
  const formValues = watch();

  // Reference data for display
  const { items: farmingMethods } = useCatalog("farming-methods", {
    params: { size: 100 },
  });
  const { items: rearingMethods } = useRearingMethods({
    params: { domainCode: "CROP", size: 100 },
  });
  const { items: certificateStandards } = useMasterData(
    "certificate-standards",
    {
      params: { size: 100 },
    },
  );

  const selectedFarmingMethodId = Number(formValues.farmingMethodId);

  // Fetch all method applications to resolve crop → variety names
  const { items: methodApplications } = useMethodApplications({
    params: {
      domainCode: "CROP",
      size: 100,
      status: "active",
    },
    enabled: !!selectedFarmingMethodId && selectedFarmingMethodId > 0,
  });

  // Filter only those matching the selected farming method
  const activeMethodApps = useMemo(() => {
    if (!selectedFarmingMethodId || selectedFarmingMethodId <= 0) return [];
    return methodApplications.filter(
      (item) => item.productionMethod?.id === selectedFarmingMethodId,
    );
  }, [methodApplications, selectedFarmingMethodId]);

  // Build a map: subjectId → { name, code, variants: {variantId → {name, code}} }
  const subjectMap = useMemo(() => {
    const map: Record<
      number,
      {
        name: string;
        code: string;
        variants: Record<number, { name: string; code: string }>;
      }
    > = {};
    activeMethodApps.forEach((app) => {
      (app.subjects ?? []).forEach((subj) => {
        if (!subj.subjectId) return;
        if (!map[subj.subjectId]) {
          map[subj.subjectId] = {
            name: subj.subjectName || "",
            code: subj.subjectCode || "",
            variants: {},
          };
        }
        (subj.variants ?? []).forEach((v) => {
          if (!v.id) return;
          map[subj.subjectId!].variants[v.id] = {
            name: v.name || "",
            code: v.code || "",
          };
        });
      });
    });
    return map;
  }, [activeMethodApps]);

  const selectedCropIds: number[] = useMemo(
    () => (formValues.cropIds ?? []).map(Number).filter(Boolean),
    [formValues.cropIds],
  );
  const selectedVarietyIds: number[] = useMemo(
    () => formValues.varietyIds ?? [],
    [formValues.varietyIds],
  );
  const selectedSeedIds: number[] = useMemo(
    () => formValues.seedIds ?? [],
    [formValues.seedIds],
  );

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

  const mappedFarmingMethods = farmingMethods.map((m) => ({
    id: String(m.id),
    name: m.name ?? "",
  }));

  const mappedIrrigationSystems = rearingMethods
    .filter((s) => s.domainCode === "CROP")
    .map((s) => ({
      id: String(s.id),
      name: s.name ?? "",
    }));

  // Build 3-level crop data for the confirmation step
  const cropSummary = useMemo(
    () =>
      selectedCropIds.map((cropId) => {
        const subject = subjectMap[cropId];
        const cropName = subject?.name || `Cây trồng #${cropId}`;
        const cropCode = subject?.code || "";
        const variantsOfCrop = subject?.variants ?? {};

        // Checked varieties that belong to this crop
        const checkedVarieties = selectedVarietyIds
          .filter((vId) => variantsOfCrop[vId] !== undefined)
          .map((vId) => {
            const variety = variantsOfCrop[vId];
            return {
              id: vId,
              name: variety?.name || `Giống #${vId}`,
              code: variety?.code || "",
              // Actual farm seed IDs selected for this variety
              seedIds: selectedSeedIds,
            };
          });

        return { cropId, cropName, cropCode, checkedVarieties };
      }),
    [selectedCropIds, selectedVarietyIds, selectedSeedIds, subjectMap],
  );

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
      farmingMethodId={String(formValues.farmingMethodId)}
      irrigationMethodId={String(formValues.rearingMethodId ?? "")}
      farmingMethods={mappedFarmingMethods}
      irrigationSystems={mappedIrrigationSystems}
      cropSummary={cropSummary}
      title={title}
      description={description}
    />
  );
};
