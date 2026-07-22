import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import type { CultivationRegionConfig } from "../../../../stores/useCultivationRegionStore";
import useCultivationRegionStore from "../../../../stores/useCultivationRegionStore";
import useEnterpriseCertificateStore from "../../../../stores/useEnterpriseCertificateStore";
import useFarmingMethodStore from "../../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../../stores/useIrrigationSystemStore";
import usePersonnelStore from "../../../../stores/usePersonnelStore";
import useRegionStore from "../../../../stores/useRegionStore";
import useSeedStore from "../../../../stores/useSeedStore";
import useVarietyStore from "../../../../stores/useVarietyStore";
import type { Variety } from "../../../variety/types";
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

export interface CultivationRegionTargetEntity {
  id: string;
  targetId: string;
  name: string;
  type: string;
  typeCode: GeographicalSelection["type"];
}

export const useCultivationRegionCreatePage = () => {
  const [, setLocation] = useLocation();
  const { regions } = useRegionStore();
  const { addArea } = useCultivationRegionStore();
  const { standards } = useEnterpriseCertificateStore();
  const { personnel } = usePersonnelStore();
  const { varieties } = useVarietyStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { seeds } = useSeedStore();

  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [activeSeedVariety, setActiveSeedVariety] =
    useState<SeedVarietySelection | null>(null);
  const [applyToAllDialogOpen, setApplyToAllDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState("");
  const [selections, setSelections] = useState<GeographicalSelection[]>([]);
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);
  const [selectedManagerIds, setSelectedManagerIds] = useState<string[]>([]);
  const [cropSearchTerm, setCropSearchTerm] = useState("");
  const [configs, setConfigs] = useState<Record<string, CultivationRegionConfig>>(
    {},
  );

  const selectedRegions = useMemo(() => {
    const regionIds = [...new Set(selections.map((selection) => selection.regionId))];
    return regions.filter((region) => regionIds.includes(region.id.toString()));
  }, [regions, selections]);

  const selectedRegion = selectedRegions[0];

  const effectiveScope = useMemo(() => {
    if (selections.some((selection) => selection.type === "plot")) return "plot";
    if (selections.some((selection) => selection.type === "area")) return "area";
    return "region";
  }, [selections]);

  const entities = useMemo<CultivationRegionTargetEntity[]>(() => {
    return selections.map((selection) => {
      const region = regions.find(
        (item) => item.id.toString() === selection.regionId,
      );
      const area = region?.subAreas?.find(
        (item) => item.id.toString() === selection.areaId,
      );
      const plot = area?.plots?.find((item) => item.id === selection.plotId);

      return {
        id: selection.plotId || selection.areaId || selection.regionId,
        targetId: selection.plotId || selection.areaId || selection.regionId,
        name:
          selection.type === "region"
            ? region?.name || selection.regionId
            : selection.type === "area"
              ? area?.name || selection.areaId || ""
              : plot?.name || selection.plotId || "",
        type:
          selection.type === "region"
            ? "Vùng"
            : selection.type === "area"
              ? "Khu vực"
              : "Lô đất",
        typeCode: selection.type,
      };
    });
  }, [regions, selections]);

  const commonConfig = configs[AREA_CONFIG_ID] || emptyConfig;

  const availableCrops = useMemo(() => {
    if (!commonConfig.farmingMethodId) return [];

    let list = varieties.filter((variety) => variety.status === "active");

    if (cropSearchTerm) {
      const lowerSearch = cropSearchTerm.toLowerCase();
      list = list.filter(
        (variety) =>
          variety.varietyName.toLowerCase().includes(lowerSearch) ||
          variety.crop.toLowerCase().includes(lowerSearch),
      );
    }

    return list;
  }, [commonConfig.farmingMethodId, cropSearchTerm, varieties]);

  const selectedManagers = useMemo(
    () =>
      personnel.filter((manager) =>
        selectedManagerIds.includes(manager.id.toString()),
      ),
    [personnel, selectedManagerIds],
  );

  const selectedCerts = useMemo(
    () => standards.filter((certificate) => selectedCertIds.includes(certificate.code)),
    [selectedCertIds, standards],
  );

  const updateCommonConfig = (partial: Partial<CultivationRegionConfig>) => {
    setConfigs((prev) => ({
      ...prev,
      [AREA_CONFIG_ID]: {
        ...(prev[AREA_CONFIG_ID] || emptyConfig),
        ...partial,
      },
    }));
  };

  const handleSelectEnterprise = (enterpriseId: string) => {
    setSelectedEnterpriseId(enterpriseId);
    setSelections([]);
  };

  const toggleCertificate = (certificateId: string) => {
    setSelectedCertIds((prev) =>
      prev.includes(certificateId)
        ? prev.filter((item) => item !== certificateId)
        : [...prev, certificateId],
    );
  };

  const toggleCropSelection = (cropId: string) => {
    const currentCrops = commonConfig.selectedCrops || [];

    if (currentCrops.includes(cropId)) {
      const nextSeedSelections = { ...(commonConfig.seedSelections || {}) };
      delete nextSeedSelections[cropId];

      updateCommonConfig({
        selectedCrops: currentCrops.filter((item) => item !== cropId),
        seedSelections: nextSeedSelections,
      });
      return;
    }

    const crop = varieties.find((item) => item.id === cropId);
    if (!crop) return;

    setActiveSeedVariety({
      id: crop.id,
      varietyCode: crop.varietyCode,
      varietyName: crop.varietyName,
    });
    setSeedDialogOpen(true);
  };

  const handleSeedSelection = (seedIds: string[]) => {
    if (!activeSeedVariety) return;

    const varietyId = activeSeedVariety.id;
    const currentCrops = commonConfig.selectedCrops || [];

    updateCommonConfig({
      selectedCrops: currentCrops.includes(varietyId)
        ? currentCrops
        : [...currentCrops, varietyId],
      seedSelections: {
        ...(commonConfig.seedSelections || {}),
        [varietyId]: seedIds,
      },
    });
  };

  const applyConfigToAll = () => {
    const nextConfigs = { ...configs };

    entities.forEach((entity) => {
      nextConfigs[entity.id] = {
        ...commonConfig,
        seedSelections: { ...(commonConfig.seedSelections || {}) },
      };
    });

    setConfigs(nextConfigs);
    setApplyToAllDialogOpen(false);
  };

  const handleComplete = () => {
    const targetIds = entities.map((entity) => entity.targetId);
    const targetName = entities.map((entity) => entity.name).join(", ");

    addArea({
      name,
      scope: effectiveScope,
      targetIds,
      targetName,
      enterpriseId: selectedEnterpriseId,
      certificateIds: selectedCertIds,
      managerIds: selectedManagerIds,
      note,
      farmingMethodId: commonConfig.farmingMethodId || "",
      irrigationMethodId: commonConfig.irrigationMethodId || "",
      selectedCrops: commonConfig.selectedCrops || [],
      seedSelections: commonConfig.seedSelections || {},
      configs,
    });

    setLocation("/animal-husbandry-region");
  };

  const handleCancel = () => {
    setLocation("/animal-husbandry-region");
  };

  return {
    standards,
    personnel,
    varieties,
    farmingMethods,
    irrigationSystems,
    seeds,
    selectedRegion,
    selectedManagers,
    selectedCerts,
    seedDialogOpen,
    setSeedDialogOpen,
    activeSeedVariety,
    applyToAllDialogOpen,
    setApplyToAllDialogOpen,
    name,
    setName,
    note,
    setNote,
    selectedEnterpriseId,
    handleSelectEnterprise,
    selections,
    setSelections,
    selectedCertIds,
    toggleCertificate,
    selectedManagerIds,
    setSelectedManagerIds,
    cropSearchTerm,
    setCropSearchTerm,
    entities,
    commonConfig,
    availableCrops,
    updateCommonConfig,
    toggleCropSelection,
    handleSeedSelection,
    applyConfigToAll,
    handleComplete,
    handleCancel,
  };
};
