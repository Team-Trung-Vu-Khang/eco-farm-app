/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { areaApi, plotApi, regionApi } from "@/features/farm";
import { areaKeys } from "@/features/farm/hooks/useAreas";
import { plotKeys } from "@/features/farm/hooks/usePlots";
import { regionKeys } from "@/features/farm/hooks/useRegions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import { GeographicalHierarchyDisplay } from "./GeographicalHierarchyDisplay";
import { GeographicalScopeModal } from "./GeographicalScopeModal";
import { buildGeographicalTree } from "./GeographicalTree";
import type { GeographicalUnit } from "./GeographicalTree";

interface GeographicalScopeCardProps {
  selectedCultivationRegion: any;
  geographicalUnits?: GeographicalUnit[];
  selectedScopeIds: string[];
  onScopeChange: (ids: string[]) => void;
  areasByRegion?: Record<string, GeographicalUnit[]>;
  plotsByArea?: Record<string, GeographicalUnit[]>;
}

export const GeographicalScopeCard = ({
  selectedCultivationRegion,
  geographicalUnits: propGeographicalUnits = [],
  selectedScopeIds,
  onScopeChange,
  areasByRegion: propAreasByRegion,
  plotsByArea: propPlotsByArea,
}: GeographicalScopeCardProps) => {
  // 1. Collect Region IDs referenced in selectedCultivationRegion.scopes
  const regionIds = useMemo(() => {
    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    const rIds = new Set<number>();
    scopes.forEach((s) => {
      if (s.scopeType === "REGION" && s.region?.id) {
        rIds.add(Number(s.region.id));
      }
      if (s.scopeType === "AREA" && s.area?.region?.id) {
        rIds.add(Number(s.area.region.id));
      }
      if (s.scopeType === "PLOT" && s.plot?.area?.region?.id) {
        rIds.add(Number(s.plot.area.region.id));
      }
    });
    return Array.from(rIds);
  }, [selectedCultivationRegion]);

  // Execute Region Detail API queries
  const regionDetailQueries = useQueries({
    queries: regionIds.map((id) => ({
      queryKey: regionKeys.detail(id),
      queryFn: () => regionApi.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // 2. Collect Area IDs from scopes AND from Region Detail API responses
  const areaIds = useMemo(() => {
    const aIds = new Set<number>();

    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    scopes.forEach((s) => {
      if (s.scopeType === "AREA" && s.area?.id) {
        aIds.add(Number(s.area.id));
      }
      if (s.scopeType === "PLOT" && s.plot?.area?.id) {
        aIds.add(Number(s.plot.area.id));
      }
    });

    regionDetailQueries.forEach((q) => {
      if (q.data) {
        const subAreas = q.data.areas || q.data.productionAreas || [];
        subAreas.forEach((sa: any) => {
          if (sa.id) aIds.add(Number(sa.id));
        });
      }
    });

    return Array.from(aIds);
  }, [selectedCultivationRegion, regionDetailQueries]);

  // Execute Area Detail API queries (calls areaApi.getById for every area under the region!)
  const areaDetailQueries = useQueries({
    queries: areaIds.map((id) => ({
      queryKey: areaKeys.detail(id),
      queryFn: () => areaApi.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // 3. Collect Plot IDs from scopes, Region Detail API responses AND Area Detail API responses
  const plotIds = useMemo(() => {
    const pIds = new Set<number>();

    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    scopes.forEach((s) => {
      if (s.scopeType === "PLOT" && s.plot?.id) {
        pIds.add(Number(s.plot.id));
      }
    });

    regionDetailQueries.forEach((q) => {
      if (q.data) {
        const subAreas = q.data.areas || q.data.productionAreas || [];
        subAreas.forEach((sa: any) => {
          const subPlots = sa.plots || sa.productionUnits || [];
          subPlots.forEach((sp: any) => {
            if (sp.id) pIds.add(Number(sp.id));
          });
        });
      }
    });

    areaDetailQueries.forEach((q) => {
      if (q.data) {
        const subPlots = q.data.plots || q.data.productionUnits || [];
        subPlots.forEach((sp: any) => {
          if (sp.id) pIds.add(Number(sp.id));
        });
      }
    });

    return Array.from(pIds);
  }, [selectedCultivationRegion, regionDetailQueries, areaDetailQueries]);

  // Execute Plot Detail API queries (calls plotApi.getById for every plot under the area!)
  const plotDetailQueries = useQueries({
    queries: plotIds.map((id) => ({
      queryKey: plotKeys.detail(id),
      queryFn: () => plotApi.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // 3. Xây dựng cây phân cấp địa lý (areasByRegion, plotsByArea, geographicalUnits) từ kết quả API chi tiết
  const { areasByRegion, plotsByArea, geographicalUnits } = useMemo(() => {
    const abr: Record<string, GeographicalUnit[]> = {
      ...(propAreasByRegion || {}),
    };
    const pba: Record<string, GeographicalUnit[]> = {
      ...(propPlotsByArea || {}),
    };
    const unitsMap = new Map<string, GeographicalUnit>();

    // Đưa các đơn vị truyền từ props vào trước
    (propGeographicalUnits || []).forEach((u) => {
      if (u.id) unitsMap.set(String(u.id), u);
    });

    // 1. Phân tích chi tiết Vùng trồng (Region Detail Response)
    regionDetailQueries.forEach((q) => {
      if (!q.data) return;
      const reg = q.data;
      const rId = String(reg.id);

      if (!unitsMap.has(rId)) {
        unitsMap.set(rId, {
          id: rId,
          name: reg.name || `Vùng trồng #${rId}`,
          type: "Vùng trồng",
          level: 3,
          coordinates: reg.boundary?.map((b: any) => ({
            lat: b.latitude ?? 0,
            lng: b.longitude ?? 0,
          })),
        });
      }

      const subAreas = reg.areas || reg.productionAreas || [];
      subAreas.forEach((sa: any) => {
        const aId = String(sa.id);
        if (!abr[rId]) abr[rId] = [];
        if (!abr[rId].some((item) => item.id === aId)) {
          abr[rId].push({
            id: aId,
            name: sa.name,
            level: 2,
            type: "Khu vực",
          });
        }

        if (!unitsMap.has(aId)) {
          unitsMap.set(aId, {
            id: aId,
            name: sa.name,
            type: "Khu vực",
            level: 2,
            coordinates: sa.boundary?.map((b: any) => ({
              lat: b.latitude ?? 0,
              lng: b.longitude ?? 0,
            })),
          });
        }

        const subPlots = sa.plots || sa.productionUnits || [];
        subPlots.forEach((sp: any) => {
          const pId = String(sp.id);
          if (!pba[aId]) pba[aId] = [];
          if (!pba[aId].some((item) => item.id === pId)) {
            pba[aId].push({
              id: pId,
              name: sp.name,
              level: 1,
              type: "Lô trồng",
            });
          }

          if (!unitsMap.has(pId)) {
            unitsMap.set(pId, {
              id: pId,
              name: sp.name,
              type: "Lô trồng",
              level: 1,
              coordinates: sp.boundary?.map((b: any) => ({
                lat: b.latitude ?? 0,
                lng: b.longitude ?? 0,
              })),
            });
          }
        });
      });
    });

    // 2. Phân tích chi tiết Khu vực (Area Detail Response)
    areaDetailQueries.forEach((q) => {
      if (!q.data) return;
      const area = q.data;
      const aId = String(area.id);
      const rId = area.region?.id
        ? String(area.region.id)
        : area.productionRegion?.id
          ? String(area.productionRegion.id)
          : "";

      if (rId) {
        if (!abr[rId]) abr[rId] = [];
        if (!abr[rId].some((item) => item.id === aId)) {
          abr[rId].push({
            id: aId,
            name: area.name,
            level: 2,
            type: "Khu vực",
          });
        }
      }

      if (!unitsMap.has(aId)) {
        unitsMap.set(aId, {
          id: aId,
          name: area.name,
          type: "Khu vực",
          level: 2,
          coordinates: area.boundary?.map((b: any) => ({
            lat: b.latitude ?? 0,
            lng: b.longitude ?? 0,
          })),
        });
      }

      const subPlots = area.plots || area.productionUnits || [];
      subPlots.forEach((sp: any) => {
        const pId = String(sp.id);
        if (!pba[aId]) pba[aId] = [];
        if (!pba[aId].some((item) => item.id === pId)) {
          pba[aId].push({
            id: pId,
            name: sp.name,
            level: 1,
            type: "Lô trồng",
          });
        }

        if (!unitsMap.has(pId)) {
          unitsMap.set(pId, {
            id: pId,
            name: sp.name,
            type: "Lô trồng",
            level: 1,
            coordinates: sp.boundary?.map((b: any) => ({
              lat: b.latitude ?? 0,
              lng: b.longitude ?? 0,
            })),
          });
        }
      });
    });

    // 3. Phân tích chi tiết Lô đất (Plot Detail Response)
    plotDetailQueries.forEach((q) => {
      if (!q.data) return;
      const plot = q.data;
      const pId = String(plot.id);
      const aId = plot.area?.id ? String(plot.area.id) : "";
      if (aId) {
        if (!pba[aId]) pba[aId] = [];
        if (!pba[aId].some((item) => item.id === pId)) {
          pba[aId].push({
            id: pId,
            name: plot.name,
            level: 1,
            type: "Lô trồng",
          });
        }
      }
      if (!unitsMap.has(pId)) {
        unitsMap.set(pId, {
          id: pId,
          name: plot.name,
          type: "Lô trồng",
          level: 1,
          coordinates: plot.boundary?.map((b: any) => ({
            lat: b.latitude ?? 0,
            lng: b.longitude ?? 0,
          })),
        });
      }
    });

    // 4. Fallback từ thông tin scopes của selectedCultivationRegion
    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    scopes.forEach((scope: any) => {
      if (scope.scopeType === "AREA" && scope.area) {
        const aId = String(scope.area.id);
        const rId = scope.area.region?.id ? String(scope.area.region.id) : "";
        if (rId) {
          if (!abr[rId]) abr[rId] = [];
          if (!abr[rId].some((a) => a.id === aId)) {
            abr[rId].push({
              id: aId,
              name: scope.area.name,
              level: 2,
              type: "Khu vực",
            });
          }
        }
        if (!unitsMap.has(aId)) {
          unitsMap.set(aId, {
            id: aId,
            name: scope.area.name,
            type: "Khu vực",
            level: 2,
          });
        }
      } else if (scope.scopeType === "PLOT" && scope.plot) {
        const pId = String(scope.plot.id);
        const area = scope.plot.area;
        if (area) {
          const aId = String(area.id);
          const rId = area.region?.id ? String(area.region.id) : "";
          if (!pba[aId]) pba[aId] = [];
          if (!pba[aId].some((p) => p.id === pId)) {
            pba[aId].push({
              id: pId,
              name: scope.plot.name,
              level: 1,
              type: "Lô trồng",
            });
          }
          if (rId) {
            if (!abr[rId]) abr[rId] = [];
            if (!abr[rId].some((a) => a.id === aId)) {
              abr[rId].push({
                id: aId,
                name: area.name,
                level: 2,
                type: "Khu vực",
              });
            }
          }
        }
        if (!unitsMap.has(pId)) {
          unitsMap.set(pId, {
            id: pId,
            name: scope.plot.name,
            type: "Lô trồng",
            level: 1,
          });
        }
      } else if (scope.scopeType === "REGION" && scope.region) {
        const rId = String(scope.region.id);
        if (!unitsMap.has(rId)) {
          unitsMap.set(rId, {
            id: rId,
            name: scope.region.name,
            type: "Vùng trồng",
            level: 3,
          });
        }
      }
    });

    return {
      areasByRegion: abr,
      plotsByArea: pba,
      geographicalUnits: Array.from(unitsMap.values()),
    };
  }, [
    propAreasByRegion,
    propPlotsByArea,
    propGeographicalUnits,
    regionDetailQueries,
    areaDetailQueries,
    plotDetailQueries,
    selectedCultivationRegion,
  ]);

  const treeData = useMemo(
    () =>
      buildGeographicalTree(
        geographicalUnits,
        selectedScopeIds,
        areasByRegion,
        plotsByArea,
      ),
    [geographicalUnits, selectedScopeIds, areasByRegion, plotsByArea],
  );

  return (
    <Card className="border-none shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="border-b py-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Vị trí địa lý
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {!selectedCultivationRegion ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3 text-slate-400">
            <MapPin className="w-9 h-9 text-slate-200" />
            <div>
              <div className="text-sm font-semibold text-slate-500 mb-1">
                Chưa chọn vùng canh tác
              </div>
              <div className="text-xs text-slate-400">
                Chọn vùng canh tác để thiết lập vị trí địa lý
              </div>
            </div>
          </div>
        ) : (
          <>
            {selectedScopeIds.length > 0 && (
              <GeographicalHierarchyDisplay
                selectedHierarchy={treeData.selectedHierarchy}
              />
            )}
            {geographicalUnits.length > 0 && (
              <GeographicalScopeModal
                key={selectedCultivationRegion.id}
                selectedScopeIds={selectedScopeIds}
                onSelect={onScopeChange}
                treeData={treeData}
              />
            )}
            {geographicalUnits.length === 0 && (
              <div className="py-4 text-sm text-slate-400 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                Vùng canh tác này chưa có dữ liệu vị trí địa lý
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
