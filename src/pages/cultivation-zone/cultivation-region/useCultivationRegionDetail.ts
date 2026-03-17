import { useMemo } from "react";
import useCultivationRegionStore, {
  type CultivationRegion,
} from "../../../stores/useCultivationRegionStore";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import useFarmingMethodStore from "../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../stores/useIrrigationSystemStore";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import useRegionStore from "../../../stores/useRegionStore";
import useSeedStore from "../../../stores/useSeedStore";
import useVarietyStore from "../../../stores/useVarietyStore";
import type { Region } from "../../region-chart/constants";

export interface CultivationRegionDetails {
  managers: any[];
  selectedCerts: any[];
  regionStats: {
    total: number;
    healthy: number;
    treating: number;
    diseased: number;
  };
  region: Region | null;
  selectedEntities: any[];
  groupedSelections: Record<string, any>;
  totalArea: number;
  enterprise: any;
  entityConfigs: Array<{
    entity: any;
    farmingMethod: any;
    irrigationMethod: any;
    crops: any[];
  }>;
  technicalConfig: {
    farmingMethod: any;
    irrigationMethod: any;
    crops: any[];
  };
  harvestStats: {
    totalVolume: number;
    lastVolume: number;
    lastChange: number;
    avgVolume: number;
    avgChange: number;
  };
  harvestBatches: Array<{
    id: string;
    date: string;
    volume: number;
    quality: string;
    staff: string;
    notes?: string;
  }>;
}

export const useCultivationRegionDetail = (id?: string | null) => {
  const { getAreaById } = useCultivationRegionStore();
  const { regions } = useRegionStore();
  const { standards } = useEnterpriseCertificateStore();
  const { personnel } = usePersonnelStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { varieties } = useVarietyStore();
  const { enterprises } = useEnterpriseStore();
  const { seeds } = useSeedStore();

  const area: CultivationRegion | null = useMemo(() => {
    if (!id) return null;
    return getAreaById(id) ?? null;
  }, [id, getAreaById]);

  const details: CultivationRegionDetails | null = useMemo(() => {
    if (!area) return null;

    let managers = personnel.filter((m) => (area.managerIds || []).includes(m.id.toString()));

    // Resolve multiple certificates
    const selectedCerts = standards.filter(
      (c) =>
        (area.certificateIds || []).includes(c.code) ||
        (area as any).certificateId === c.code,
    );

    // Flexible entity resolution
    const selectedEntities = area.targetIds
      .map((targetId) => {
        // Find Region
        const reg = regions.find((r) => r.id.toString() === targetId);
        if (reg)
          return {
            ...reg,
            type: "Vùng trồng",
            typeCode: "region",
            regionId: reg.id,
          };

        // Find Area
        for (const r of regions) {
          const sa = r.subAreas?.find((a: any) => a.id.toString() === targetId);
          if (sa)
            return {
              ...sa,
              type: "Khu vực",
              typeCode: "area",
              regionId: r.id,
              areaId: sa.id,
            };
        }

        // Find Plot
        for (const r of regions) {
          for (const sa of r.subAreas || []) {
            const p = sa.plots?.find((p: any) => p.id.toString() === targetId);
            if (p)
              return {
                ...p,
                type: "Lô đất",
                typeCode: "plot",
                regionId: r.id,
                areaId: sa.id,
                plotId: p.id,
              };
          }
        }
        return null;
      })
      .filter((e): e is any => e !== null);

    const firstEntity = selectedEntities[0];
    const region = firstEntity
      ? regions.find((r) => r.id.toString() === firstEntity.regionId) ?? null
      : null;

    const totalAreaValue = selectedEntities.reduce(
      (sum, e) => sum + (e.area || 0),
      0,
    );

    const groupedSelections = selectedEntities.reduce((acc: any, entity) => {
      const rId = entity.regionId.toString();
      const aId = entity.areaId?.toString() || "none";

      if (!acc[rId]) {
        acc[rId] = {
          region: regions.find((r) => r.id.toString() === rId),
          areas: {},
        };
      }

      if (!acc[rId].areas[aId]) {
        const reg = acc[rId].region;
        acc[rId].areas[aId] = {
          area:
            aId === "none"
              ? null
              : reg?.subAreas?.find((sa: any) => sa.id.toString() === aId),
          entities: [],
        };
      }

      acc[rId].areas[aId].entities.push(entity);
      return acc;
    }, {});

    // Unified Configuration (New Model)
    const commonConfig = {
      farmingMethodId: area.farmingMethodId || "",
      irrigationMethodId: area.irrigationMethodId || "",
      selectedCrops: area.selectedCrops || [],
      seedSelections: area.seedSelections || {},
    };

    // Technical Config for display
    const farmingMethod = farmingMethods.find(
      (m) => m.id === commonConfig.farmingMethodId,
    );
    const irrigationMethod = irrigationSystems.find(
      (m) => m.id === commonConfig.irrigationMethodId,
    );
    const commonCrops = varieties
      .filter((v) => commonConfig.selectedCrops?.includes(v.id))
      .map((crop) => ({
        ...crop,
        selectedSeeds: (commonConfig.seedSelections?.[crop.id] || [])
          .map((sid: string) => seeds.find((s) => s.id === sid))
          .filter(Boolean),
      }));

    // Mock region-level plant statistics
    const regionStats = {
      total: 12500,
      healthy: 11800,
      treating: 450,
      diseased: 250,
    };

    // Mock harvest statistics
    const harvestStats = {
      totalVolume: 8540,
      lastVolume: 1250,
      lastChange: 12.5, // 12.5% increase
      avgVolume: 1067,
      avgChange: 5.2, // 5.2% increase
    };

    // Mock harvest batches
    const harvestBatches = [
      {
        id: "HB001",
        date: "2024-03-10",
        volume: 1250,
        quality: "Loại A",
        staff: "Nguyễn Văn A",
        notes: "Thu hoạch đúng tiến độ, chất lượng tốt",
      },
      {
        id: "HB002",
        date: "2024-02-15",
        volume: 1100,
        quality: "Loại A",
        staff: "Trần Thị B",
        notes: "Thời tiết thuận lợi",
      },
      {
        id: "HB003",
        date: "2024-01-20",
        volume: 950,
        quality: "Loại B",
        staff: "Lê Văn C",
        notes: "Có một số cây bị ảnh hưởng bởi sâu bệnh nhẹ",
      },
      {
        id: "HB004",
        date: "2023-12-15",
        volume: 1150,
        quality: "Loại A",
        staff: "Nguyễn Văn A",
      },
      {
        id: "HB005",
        date: "2023-11-10",
        volume: 1000,
        quality: "Loại A",
        staff: "Trần Thị B",
      },
    ];

    // Legacy Entity Configurations (Compatibility or fallback)
    const entityConfigs = selectedEntities.map((entity) => {
      // Prioritize area-wide config if available, fallback to legacy per-entity config
      const config =
        commonConfig.farmingMethodId || commonConfig.selectedCrops.length > 0
          ? commonConfig
          : area.configs?.[entity.id] || area.configs?.[entity.plotId];

      return {
        entity,
        farmingMethod: farmingMethods.find(
          (m) => m.id === config?.farmingMethodId,
        ),
        irrigationMethod: irrigationSystems.find(
          (m) => m.id === config?.irrigationMethodId,
        ),
        crops: varieties
          .filter((v) => config?.selectedCrops?.includes(v.id))
          .map((crop) => ({
            ...crop,
            selectedSeeds: (config?.seedSelections?.[crop.id] || [])
              .map((sid: string) => seeds.find((s) => s.id === sid))
              .filter(Boolean),
          })),
      };
    });

    let enterprise = enterprises.find(
      (e) => e.id.toString() === area.enterpriseId,
    );

    return {
      managers,
      selectedCerts,
      regionStats,
      region,
      selectedEntities,
      groupedSelections,
      totalArea: totalAreaValue,
      enterprise,
      entityConfigs,
      harvestStats,
      harvestBatches,
      technicalConfig: {
        farmingMethod,
        irrigationMethod,
        crops: commonCrops,
      },
    };
  }, [
    area,
    regions,
    personnel,
    standards,
    farmingMethods,
    irrigationSystems,
    varieties,
    enterprises,
    seeds,
  ]);

  return { area, details };
};
