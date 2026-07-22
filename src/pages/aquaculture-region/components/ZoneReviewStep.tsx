import { useFormContext } from "react-hook-form";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";
import {
  AQUACULTURE_CERTIFICATES,
  AQUACULTURE_ENTERPRISES,
  AQUACULTURE_FARMING_METHODS,
  AQUACULTURE_GEO_OPTIONS,
  AQUACULTURE_IRRIGATION_SYSTEMS,
  AQUACULTURE_MANAGERS,
  AQUACULTURE_SPECIES,
} from "../data/create-dummy";
import { CultivationRegionCreateConfirmationStep } from "./CultivationRegionCreateConfirmationStep";

export const ZoneReviewStep = () => {
  const { watch } = useFormContext<CultivationZoneFormValues>();
  const formValues = watch();

  const selectedEnterprise = AQUACULTURE_ENTERPRISES.find(
    (item) => item.id === formValues.enterpriseId,
  );
  const selectedManagers = AQUACULTURE_MANAGERS.filter((item) =>
    (formValues.personnelIds ?? []).includes(item.id),
  ).map((item) => ({
    id: String(item.id),
    fullName: item.fullName,
    avatar: item.avatar,
  }));

  const selectedCerts = AQUACULTURE_CERTIFICATES.filter((item) =>
    (formValues.certificateIds ?? []).includes(item.id),
  ).map((item) => ({
    code: item.code,
    name: item.name,
  }));

  const selectedSpecies = AQUACULTURE_SPECIES.filter((item) =>
    (formValues.seedIds ?? []).includes(item.id),
  );

  const mappedSpecies = selectedSpecies.map((item) => ({
    id: String(item.id),
    varietyName: item.varietyName,
  }));

  const entities = (formValues.selections ?? []).map((selection) => {
    const option =
      AQUACULTURE_GEO_OPTIONS.find((item) => item.id === selection.id) ??
      AQUACULTURE_GEO_OPTIONS.find(
        (item) =>
          item.regionId === selection.regionId &&
          item.areaId === selection.areaId &&
          item.plotId === selection.plotId,
      );

    return {
      id: selection.id,
      targetId: selection.plotId || selection.areaId || selection.regionId,
      name: option?.name ?? selection.name ?? "",
      type:
        selection.type === "region"
          ? "Vùng nuôi trồng"
          : selection.type === "area"
            ? "Khu vực nuôi"
            : "Lô nuôi",
      typeCode: selection.type,
    };
  });

  const commonConfig = {
    farmingMethodId: String(formValues.farmingMethodId),
    irrigationMethodId: String(formValues.irrigationSystemId),
    selectedCrops: Array.from(
      new Set(selectedSpecies.map((item) => String(item.id))),
    ),
    seedSelections: selectedSpecies.reduce<Record<string, string[]>>(
      (acc, item) => {
        const key = String(item.id);
        if (!acc[key]) acc[key] = [];
        acc[key].push(key);
        return acc;
      },
      {},
    ),
  };

  const mappedFarmingMethods = AQUACULTURE_FARMING_METHODS;
  const mappedIrrigationSystems = AQUACULTURE_IRRIGATION_SYSTEMS;

  const title = formValues.id
    ? "Xác nhận cập nhật vùng nuôi trồng"
    : "Xác nhận thông tin vùng nuôi trồng";
  const description = formValues.id
    ? "Kiểm tra lại dữ liệu thủy sản mẫu trước khi lưu cập nhật."
    : "Vui lòng kiểm tra kỹ dữ liệu mẫu trước khi khởi tạo vùng nuôi trồng.";

  return (
    <CultivationRegionCreateConfirmationStep
      name={formValues.name}
      note={formValues.notes ?? ""}
      entities={entities}
      selectedManagers={selectedManagers}
      selectedCerts={selectedCerts}
      commonConfig={commonConfig}
      farmingMethods={mappedFarmingMethods}
      irrigationSystems={mappedIrrigationSystems}
      varieties={mappedSpecies}
      seeds={mappedSpecies}
      selectedEnterpriseName={selectedEnterprise?.name}
      title={title}
      description={description}
    />
  );
};
