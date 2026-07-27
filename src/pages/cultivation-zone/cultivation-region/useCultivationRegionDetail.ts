import { useMemo } from "react";
import { useCultivationZoneById } from "@/features/farm/hooks/useCultivationZones";
import { useSeeds } from "@/features/farm/hooks/useSeeds";
import useRegionStore from "../../../stores/useRegionStore";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import useFarmingMethodStore from "../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../stores/useIrrigationSystemStore";
import useVarietyStore from "../../../stores/useVarietyStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import type { Region } from "../../region-chart/constants";

export interface PersonnelItem {
  id: number;
  fullName: string;
  avatarUrl: string | null;
  positionName: string;
  positionCode: string;
}

export interface CertificateItem {
  id: number;
  code: string;
  name: string;
}

export interface CultivationRegionDetails {
  managers: any[];
  personnel: PersonnelItem[];
  certificates: CertificateItem[];
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
  const numericId = id ? parseInt(String(id), 10) : 0;

  // Real API Queries
  const { data: areaData, isLoading: isZoneLoading } = useCultivationZoneById(
    numericId,
    {
      enabled: !!numericId,
    },
  );

  const { items: allSeeds, loading: isSeedsLoading } = useSeeds({
    params: { size: 100 },
  });

  const { regions } = useRegionStore();
  const { standards } = useEnterpriseCertificateStore();
  const { personnel } = usePersonnelStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { varieties } = useVarietyStore();
  const { enterprises } = useEnterpriseStore();

  // Helper index of region store for boundary lookups
  const regionIndex = useMemo(() => {
    const regionById = new Map<string, any>();
    const areaById = new Map<string, { area: any; region: any }>();
    const plotById = new Map<string, { plot: any; area: any; region: any }>();

    for (const r of regions) {
      regionById.set(String(r.id), r);
      for (const a of r.subAreas || []) {
        areaById.set(String(a.id), { area: a, region: r });
        for (const p of a.plots || []) {
          plotById.set(String(p.id), { plot: p, area: a, region: r });
        }
      }
    }

    return { regionById, areaById, plotById };
  }, [regions]);

  const area = useMemo(() => {
    if (!areaData) return null;

    // Convert scopes to selections list
    const selections = (areaData.scopes ?? []).map((s) => {
      if (s.scopeType === "REGION") {
        return {
          id: `scope-region-${s.region?.id}`,
          type: "region" as const,
          regionId: String(s.region?.id ?? 0),
          name: s.region?.name ?? "",
        };
      }
      if (s.scopeType === "AREA") {
        return {
          id: `scope-area-${s.area?.id}`,
          type: "area" as const,
          regionId: String(s.area?.region?.id ?? 0),
          areaId: String(s.area?.id ?? 0),
          name: s.area?.name ?? "",
          regionName: s.area?.region?.name ?? "",
        };
      }
      return {
        id: `scope-plot-${s.plot?.id}`,
        type: "plot" as const,
        regionId: String(s.plot?.area?.region?.id ?? 0),
        areaId: String(s.plot?.area?.id ?? 0),
        plotId: String(s.plot?.id ?? 0),
        name: s.plot?.name ?? "",
        regionName: s.plot?.area?.region?.name ?? "",
        areaName: s.plot?.area?.name ?? "",
      };
    });

    const targetIds = (areaData.scopes ?? [])
      .map((s) => String(s.plot?.id || s.area?.id || s.region?.id || ""))
      .filter(Boolean);

    return {
      id: String(areaData.id),
      name: areaData.name ?? "",
      scope: (() => {
        const firstScope = areaData.scopes?.[0]?.scopeType;
        if (firstScope === "REGION") return "region" as const;
        if (firstScope === "AREA") return "area" as const;
        return "plot" as const;
      })(),
      targetIds,
      targetName: (areaData.scopes ?? [])
        .map((s) => s.plot?.name || s.area?.name || s.region?.name || "")
        .filter(Boolean)
        .join(", "),
      enterpriseId: (areaData.metadataJson?.enterpriseId as string) || "",
      certificateIds: (areaData.certificates ?? []).map((c) => String(c.id)),
      managerIds: (areaData.personnel ?? []).map((p) => String(p.id)),
      note: areaData.notes ?? "",
      farmingMethodId: String(areaData.farmingMethod?.id ?? ""),
      irrigationMethodId: String(areaData.rearingMethod?.id ?? ""),
      selectedCrops: Array.from(
        new Set(
          (areaData.seeds ?? areaData.subjectVariants ?? [])
            .map((seed) => {
              const fullSeed = allSeeds.find((fs) => fs.id === seed.id);
              if (fullSeed?.cropVariety?.id) {
                return String(fullSeed.cropVariety.id);
              }
              if (seed.id) {
                return String(seed.id);
              }
              return "";
            })
            .filter(Boolean),
        ),
      ),
      seedSelections: (() => {
        const selectionsMap: Record<string, string[]> = {};
        (areaData.seeds ?? areaData.subjectVariants ?? []).forEach((seed) => {
          const fullSeed = allSeeds.find((fs) => fs.id === seed.id);
          if (fullSeed?.cropVariety?.id) {
            const cropVarietyId = String(fullSeed.cropVariety.id);
            if (!selectionsMap[cropVarietyId]) {
              selectionsMap[cropVarietyId] = [];
            }
            selectionsMap[cropVarietyId].push(String(seed.id));
          } else if (seed.id) {
            const cropVarietyId = String(seed.id);
            if (!selectionsMap[cropVarietyId]) {
              selectionsMap[cropVarietyId] = [];
            }
            selectionsMap[cropVarietyId].push(String(seed.id));
          }
        });
        return selectionsMap;
      })(),
      status:
        areaData.status === "active"
          ? ("active" as const)
          : ("inactive" as const),
      createdAt: areaData.createdAt ?? "",
      selections,
      centerPoint: areaData.centerPoint,
    };
  }, [areaData, allSeeds]);

  const details: CultivationRegionDetails | null = useMemo(() => {
    if (!area || !areaData) return null;

    // Resolve managers
    const managers = personnel.filter((m) =>
      (area.managerIds || []).includes(m.id.toString()),
    );

    // Resolve certificates
    const selectedCerts = standards.filter(
      (c) =>
        (area.certificateIds || []).includes(String(c.id)) ||
        (area as any).certificateId === c.code,
    );

    // Build selectedEntities directly from API scopes — no store lookup needed
    const selectedEntities = (areaData.scopes ?? [])
      .map((scope: any) => {
        if (scope.scopeType === "REGION" && scope.region) {
          return {
            id: scope.region.id,
            name: scope.region.name,
            code: scope.region.code ?? "",
            type: "Vùng trồng",
            typeCode: "region" as const,
            regionId: scope.region.id,
            _regionData: scope.region,
          };
        }
        if (scope.scopeType === "AREA" && scope.area) {
          return {
            id: scope.area.id,
            name: scope.area.name,
            code: scope.area.code ?? "",
            type: "Khu vực",
            typeCode: "area" as const,
            regionId: scope.area.region?.id,
            areaId: scope.area.id,
            _regionData: scope.area.region,
            _areaData: scope.area,
          };
        }
        if (scope.scopeType === "PLOT" && scope.plot) {
          return {
            id: scope.plot.id,
            name: scope.plot.name,
            code: scope.plot.code ?? "",
            type: "Lô đất",
            typeCode: "plot" as const,
            regionId: scope.plot.area?.region?.id,
            areaId: scope.plot.area?.id,
            plotId: scope.plot.id,
            _regionData: scope.plot.area?.region,
            _areaData: scope.plot.area,
          };
        }
        return null;
      })
      .filter((e): e is any => e !== null);

    const firstEntity = selectedEntities[0];
    const region = firstEntity
      ? (regions.find(
          (r) => r.id.toString() === String(firstEntity.regionId ?? ""),
        ) ??
        firstEntity._regionData ??
        null)
      : null;

    const totalAreaValue = selectedEntities.reduce(
      (sum, e) => sum + (e.area || 0),
      0,
    );

    // Build groupedSelections using API scope data directly
    const groupedSelections = selectedEntities.reduce((acc: any, entity) => {
      const rId = String(entity.regionId ?? "");
      if (!rId) return acc;

      const aId = entity.areaId != null ? String(entity.areaId) : "none";

      if (!acc[rId]) {
        const regionData = entity._regionData ??
          regions.find((r) => r.id.toString() === rId) ?? {
            id: parseInt(rId, 10),
            name: rId,
          };
        acc[rId] = { region: regionData, areas: {} };
      }

      if (!acc[rId].areas[aId]) {
        acc[rId].areas[aId] = {
          area: aId === "none" ? null : (entity._areaData ?? null),
          entities: [],
        };
      }

      acc[rId].areas[aId].entities.push(entity);
      return acc;
    }, {});

    // Resolve unified configuration from backend response first, fallback to mock store if unavailable
    const farmingMethod =
      areaData.productionMethod ||
      areaData.farmingMethod ||
      farmingMethods.find((m) => String(m.id) === area.farmingMethodId);
    const irrigationMethod =
      areaData.rearingMethod ||
      irrigationSystems.find((m) => String(m.id) === area.irrigationMethodId);

    // Group selected seeds by their crop variety to build the technicalConfig crops list
    const commonCrops =
      areaData.subjectVariants && areaData.subjectVariants.length > 0
        ? areaData.subjectVariants.map((sv: any) => {
            return {
              id: String(sv.id),
              varietyName: sv.subjectVariantName ?? "",
              varietyCode: sv.subjectVariantCode ?? "",
              crop: sv.productionSubjectName ?? "Khác",
              illustration: "", // we don't have illustration url from subjectVariants, but we can display a default or leave empty
              seedType: "Hạt giống",
              selectedSeeds: [],
            };
          })
        : Array.from(
            new Map(
              (areaData.seeds ?? [])
                .map((s) => allSeeds.find((fs) => fs.id === s.id))
                .filter(
                  (fs): fs is NonNullable<typeof fs> =>
                    !!fs && !!fs.cropVariety?.id,
                )
                .map((fs) => {
                  const cropVarietyId = String(fs.cropVariety!.id);
                  // Get all seeds in this variety
                  const selectedSeedsForVariety = (areaData.seeds ?? [])
                    .map((seed) =>
                      allSeeds.find((fsSeed) => fsSeed.id === seed.id),
                    )
                    .filter(
                      (fsSeed): fsSeed is NonNullable<typeof fsSeed> =>
                        !!fsSeed &&
                        fsSeed.cropVariety?.id === fs.cropVariety!.id,
                    )
                    .map((fsSeed) => ({
                      id: String(fsSeed.id),
                      varietyName:
                        fsSeed.cropVariety?.name ??
                        fsSeed.supplier?.name ??
                        "Hạt giống",
                      origin: fsSeed.origin || "Việt Nam",
                    }));

                  return [
                    cropVarietyId,
                    {
                      id: cropVarietyId,
                      varietyName: fs.cropVariety!.name ?? "",
                      varietyCode: fs.cropVariety!.code ?? "",
                      crop: fs.crop?.name ?? "Khác",
                      illustration: fs.imageUrl || "",
                      seedType: "Hạt giống lai", // Fallback description
                      selectedSeeds: selectedSeedsForVariety,
                    },
                  ];
                }),
            ).values(),
          );

    // Mock region-level stats
    const regionStats = {
      total: 12500,
      healthy: 11800,
      treating: 450,
      diseased: 250,
    };

    // Mock harvest stats
    const harvestStats = {
      totalVolume: 8540,
      lastVolume: 1250,
      lastChange: 12.5,
      avgVolume: 1067,
      avgChange: 5.2,
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

    // Build entity configurations list
    const entityConfigs = selectedEntities.map((entity) => {
      return {
        entity,
        farmingMethod,
        irrigationMethod,
        crops: commonCrops,
      };
    });

    const enterprise = enterprises.find(
      (e) => e.id.toString() === area.enterpriseId,
    );

    // Map personnel directly from API response
    const apiPersonnel: PersonnelItem[] = (areaData.personnel ?? []).map(
      (p: any) => ({
        id: p.id,
        fullName: p.fullName ?? "",
        avatarUrl: p.avatarUrl ?? null,
        positionName: p.position?.name ?? "",
        positionCode: p.position?.code ?? "",
      }),
    );

    // Map certificates directly from API response
    const apiCertificates: CertificateItem[] = (
      areaData.certificates ?? []
    ).map((c: any) => ({
      id: c.id,
      code: c.code ?? "",
      name: c.name ?? "",
    }));

    return {
      managers,
      personnel: apiPersonnel,
      certificates: apiCertificates,
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
    areaData,
    regions,
    personnel,
    standards,
    farmingMethods,
    irrigationSystems,
    varieties,
    enterprises,
    allSeeds,
  ]);

  return { area, details, loading: isZoneLoading || isSeedsLoading };
};
