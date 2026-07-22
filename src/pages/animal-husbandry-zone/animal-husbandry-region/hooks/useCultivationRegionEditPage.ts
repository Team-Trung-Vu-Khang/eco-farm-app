import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  CultivationRegion,
  CultivationRegionConfig,
} from "../../../../stores/useCultivationRegionStore";
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
import { mapSeedToBreed } from "../constants";

const AREA_CONFIG_ID = "area-config";

const emptyConfig: CultivationRegionConfig = {
  farmingMethodId: "",
  irrigationMethodId: "",
  selectedCrops: [],
  seedSelections: {},
};

type SeedVarietySelection = Pick<Variety, "id" | "varietyCode" | "varietyName">;

type TargetEntity = {
  id: string;
  targetId: string;
  name: string;
  type: string;
  typeCode: GeographicalSelection["type"];
};

const randomSelectionId = () => Math.random().toString(36).slice(2, 11);

type EditFormState = {
  name: string;
  note: string;
  selectedEnterpriseId: string;
  selections: GeographicalSelection[];
  selectedCertIds: string[];
  selectedManagerIds: string[];
  configs: Record<string, CultivationRegionConfig>;
};

const buildInitialEditState = (
  area: CultivationRegion | null,
  regions: ReturnType<typeof useRegionStore.getState>["regions"],
): EditFormState => {
  if (!area) {
    return {
      name: "",
      note: "",
      selectedEnterpriseId: "",
      selections: [],
      selectedCertIds: [],
      selectedManagerIds: [],
      configs: {},
    };
  }

  const selectedEnterpriseId = area.enterpriseId
    ? area.enterpriseId
    : (regions.find(
        (region) =>
          region.subAreas?.some((subArea) =>
            area.targetIds.includes(subArea.id.toString()),
          ) ||
          (area.scope === "region" &&
            area.targetIds.includes(region.id.toString())),
      )?.enterpriseId ?? "");

  const selections: GeographicalSelection[] = [];

  if (area.scope === "region") {
    area.targetIds.forEach((regionId) => {
      selections.push({
        id: randomSelectionId(),
        type: "region",
        regionId,
      });
    });
  } else if (area.scope === "area") {
    area.targetIds.forEach((areaId) => {
      const region = regions.find((item) =>
        item.subAreas?.some((subArea) => subArea.id.toString() === areaId),
      );
      if (!region) return;

      selections.push({
        id: randomSelectionId(),
        type: "area",
        regionId: region.id.toString(),
        areaId,
      });
    });
  } else if (area.scope === "plot") {
    area.targetIds.forEach((plotId) => {
      const region = regions.find((item) =>
        item.subAreas?.some((subArea) =>
          subArea.plots?.some((plot) => plot.id === plotId),
        ),
      );
      const areaMatch = region?.subAreas?.find((subArea) =>
        subArea.plots?.some((plot) => plot.id === plotId),
      );
      if (!region || !areaMatch) return;

      selections.push({
        id: randomSelectionId(),
        type: "plot",
        regionId: region.id.toString(),
        areaId: areaMatch.id.toString(),
        plotId,
      });
    });
  }

  return {
    name: area.name,
    note: area.note || "",
    selectedEnterpriseId,
    selections,
    selectedCertIds:
      area.certificateIds ||
      ("certificateId" in area && area.certificateId
        ? [area.certificateId]
        : []),
    selectedManagerIds: area.managerIds || [],
    configs:
      area.farmingMethodId ||
      area.irrigationMethodId ||
      (area.selectedCrops?.length || 0) > 0
        ? {
            [AREA_CONFIG_ID]: {
              farmingMethodId: area.farmingMethodId || "",
              irrigationMethodId: area.irrigationMethodId || "",
              selectedCrops: area.selectedCrops || [],
              seedSelections: area.seedSelections || {},
            },
          }
        : (area.configs ?? {}),
  };
};

export const useCultivationRegionEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { getAreaById, updateArea } = useCultivationRegionStore();
  const { regions } = useRegionStore();
  const { standards } = useEnterpriseCertificateStore();
  const { personnel } = usePersonnelStore();
  const { varieties } = useVarietyStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { seeds: rawSeeds } = useSeedStore();
  const seeds = useMemo(() => rawSeeds.map(mapSeedToBreed), [rawSeeds]);

  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [activeSeedVariety, setActiveSeedVariety] =
    useState<SeedVarietySelection | null>(null);
  const [applyToAllDialogOpen, setApplyToAllDialogOpen] = useState(false);

  const existingArea = useMemo(() => {
    if (!id) return null;
    return getAreaById(id) ?? getAreaById(`ca-${id}`) ?? null;
  }, [getAreaById, id]);

  const initialState = useMemo(
    () => buildInitialEditState(existingArea, regions),
    [existingArea, regions],
  );

  const [name, setName] = useState(initialState.name);
  const [note, setNote] = useState(initialState.note);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState(
    initialState.selectedEnterpriseId,
  );
  const [selections, setSelections] = useState(initialState.selections);
  const [selectedCertIds, setSelectedCertIds] = useState(
    initialState.selectedCertIds,
  );
  const [selectedManagerIds, setSelectedManagerIds] = useState(
    initialState.selectedManagerIds,
  );
  const [configs, setConfigs] = useState(initialState.configs);
  const [cropSearchTerm, setCropSearchTerm] = useState("");

  const selectedRegions = useMemo(() => {
    const regionIds = [...new Set(selections.map((selection) => selection.regionId))];
    return regions.filter((region) => regionIds.includes(region.id.toString()));
  }, [regions, selections]);

  const selectedAreas = useMemo(() => {
    const areaIds = [
      ...new Set(
        selections
          .filter((selection) => selection.areaId)
          .map((selection) => selection.areaId as string),
      ),
    ];

    return regions
      .flatMap((region) => region.subAreas || [])
      .filter((area) => areaIds.includes(area.id.toString()));
  }, [regions, selections]);

  const selectedPlots = useMemo(() => {
    const plotIds = [
      ...new Set(
        selections
          .filter((selection) => selection.plotId)
          .map((selection) => selection.plotId as string),
      ),
    ];

    return regions
      .flatMap((region) => region.subAreas || [])
      .flatMap((area) => area.plots || [])
      .filter((plot) => plotIds.includes(plot.id));
  }, [regions, selections]);

  const selectedRegion = selectedRegions[0];

  const entities = useMemo<TargetEntity[]>(() => {
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

    const keyword = cropSearchTerm.toLowerCase();
    return varieties.filter(
      (variety) =>
        variety.status === "active" &&
        (variety.varietyName.toLowerCase().includes(keyword) ||
          variety.varietyCode.toLowerCase().includes(keyword)),
    );
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
    toast({
      title: "Thành công",
      description: "Đã đồng bộ cấu hình cho tất cả các mục",
    });
  };

  const handleComplete = () => {
    if (!id) return;

    const targetIds = selections.map(
      (selection) => selection.plotId || selection.areaId || selection.regionId,
    );

    const effectiveScope = selections.some((selection) => selection.type === "plot")
      ? "plot"
      : selections.some((selection) => selection.type === "area")
        ? "area"
        : "region";

    let targetName = "";
    if (effectiveScope === "region") {
      targetName = selectedRegions.map((region) => region.name).join(", ");
    } else if (effectiveScope === "area") {
      targetName = selectedAreas.map((area) => area.name).join(", ");
    } else {
      targetName = selectedPlots.map((plot) => plot.name).join(", ");
    }

    updateArea(id, {
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

    toast({
      title: "Thành công",
      description: "Đã cập nhật vùng chăn nuôi",
    });
    setLocation(`/animal-husbandry-region/${id}`);
  };

  const handleCancel = () => {
    if (!id) return;
    setLocation(`/animal-husbandry-region/${id}`);
  };

  return {
    id,
    existingArea,
    regions,
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
    setSelectedEnterpriseId,
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
    goToList: () => setLocation("/animal-husbandry-region"),
  };
};
