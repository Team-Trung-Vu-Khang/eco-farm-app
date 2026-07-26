import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";
import { useProductionMethods } from "@/features/foundation";
import { useSeeds } from "@/features/farm/hooks/useSeeds";
import { useMasterData, useFarmPersonnel } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { CultivationRegionCreateConfirmationStep } from "./CultivationRegionCreateConfirmationStep";
import {
  AQUACULTURE_GEO_OPTIONS,
  AQUACULTURE_IRRIGATION_SYSTEMS,
} from "../data/create-dummy";
import type { FarmSeedResponse } from "@/features/farm/types/farm.type";

const MOCK_AQUACULTURE_BREEDS = [
  { name: "Tôm thẻ chân trắng giống CP", cropName: "Tôm thẻ", origin: "Thái Lan" },
  { name: "Tôm sú giống Moana", cropName: "Tôm sú", origin: "Mỹ" },
  { name: "Cá tra giống Mekong", cropName: "Cá tra", origin: "Việt Nam" },
  { name: "Nghêu giống Bến Tre", cropName: "Nghêu", origin: "Việt Nam" },
  { name: "Cá mú trân châu giống", cropName: "Cá mú", origin: "Đài Loan" },
  { name: "Cá rô phi giống Việt-Đức", cropName: "Cá rô phi", origin: "Đức" },
];

const mapSeedToBreed = (seed: any): any => {
  if (!seed) return seed;
  const index = seed.id % MOCK_AQUACULTURE_BREEDS.length;
  const breed = MOCK_AQUACULTURE_BREEDS[index];
  return {
    ...seed,
    origin: seed.origin || breed.origin,
    cropVariety: {
      id: seed.cropVariety?.id || seed.id,
      varietyName: breed.name,
      varietyCode: seed.cropVariety?.varietyCode || `BR-${seed.id}`,
      status: seed.cropVariety?.status || "active",
      ...seed.cropVariety,
      name: breed.name,
    },
    crop: {
      id: seed.crop?.id || seed.id,
      name: breed.cropName,
      code: seed.crop?.code || `CROP-${seed.id}`,
      ...seed.crop,
    },
    varietyName: breed.name,
    cropName: breed.cropName,
  };
};

export const ZoneReviewStep = () => {
  const { watch } = useFormContext<CultivationZoneFormValues>();
  const formValues = watch();

  // Reference data for display
  const { items: farmingMethods } = useProductionMethods({
    params: { domainCode: "AQUACULTURE", size: 100 },
  });
  const { items: rawSeeds } = useSeeds({
    params: { domainCode: "AQUACULTURE", size: 100 },
  });
  const allSeeds = useMemo(() => rawSeeds.map(mapSeedToBreed), [rawSeeds]);
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

  const entities = (formValues.selections ?? []).map((sel) => {
    const option =
      AQUACULTURE_GEO_OPTIONS.find((item) => item.id === sel.id) ??
      AQUACULTURE_GEO_OPTIONS.find(
        (item) =>
          item.regionId === sel.regionId &&
          item.areaId === sel.areaId &&
          item.plotId === sel.plotId,
      );

    return {
      id: sel.id,
      targetId: sel.plotId || sel.areaId || sel.regionId,
      name: option?.name ?? sel.name ?? "",
      type:
        sel.type === "region"
          ? "Vùng nuôi trồng"
          : sel.type === "area"
            ? "Khu vực nuôi"
            : "Lô nuôi",
      typeCode: sel.type,
    };
  });

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

  const mappedIrrigationSystems = AQUACULTURE_IRRIGATION_SYSTEMS.map((s) => ({
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
    ? "Vui lòng kiểm tra kỹ các thông tin dưới đây trước khi lưu cập nhật vùng nuôi trồng."
    : "Vui lòng kiểm tra kỹ các thông tin dưới đây. Sau khi xác nhận, hệ thống sẽ tiến hành khởi tạo vùng nuôi trồng mới.";

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
