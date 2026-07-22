/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import { GeographicalHierarchyDisplay } from "./GeographicalHierarchyDisplay";
import { GeographicalScopeModal } from "./GeographicalScopeModal";
import { buildGeographicalTree } from "./GeographicalTree";
import type { GeographicalUnit } from "./GeographicalTree";

interface GeographicalScopeCardProps {
  selectedCultivationRegion: any;
  geographicalUnits: GeographicalUnit[];
  selectedScopeIds: string[];
  onScopeChange: (ids: string[]) => void;
}

export const GeographicalScopeCard = ({
  selectedCultivationRegion,
  geographicalUnits,
  selectedScopeIds,
  onScopeChange,
}: GeographicalScopeCardProps) => {
  // Build parent-relationship maps from API scopes
  const { areasByRegion, plotsByArea } = useMemo(() => {
    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    const abr: Record<string, GeographicalUnit[]> = {};
    const pba: Record<string, GeographicalUnit[]> = {};

    scopes.forEach((scope: any) => {
      if (scope.scopeType === "AREA" && scope.area) {
        const rId = String(scope.area.region?.id ?? "");
        if (rId) {
          if (!abr[rId]) abr[rId] = [];
          if (!abr[rId].some((a) => a.id === String(scope.area.id))) {
            abr[rId].push({
              id: String(scope.area.id),
              name: scope.area.name,
              level: 2,
              type: "Khu vực",
            });
          }
        }
      } else if (scope.scopeType === "PLOT" && scope.plot) {
        const area = scope.plot.area;
        if (area) {
          const aId = String(area.id);
          const rId = String(area.region?.id ?? "");
          if (!pba[aId]) pba[aId] = [];
          if (!pba[aId].some((p) => p.id === String(scope.plot.id))) {
            pba[aId].push({
              id: String(scope.plot.id),
              name: scope.plot.name,
              level: 1,
              type: "Lô nuôi",
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
      }
    });

    return { areasByRegion: abr, plotsByArea: pba };
  }, [selectedCultivationRegion]);

  const treeData = useMemo(
    () => buildGeographicalTree(geographicalUnits, selectedScopeIds, areasByRegion, plotsByArea),
    [geographicalUnits, selectedScopeIds, areasByRegion, plotsByArea],
  );

  const displayHierarchy = useMemo(() => {
    const scopes = selectedCultivationRegion?.scopes;
    if (!scopes || scopes.length === 0) return [];
    if (selectedScopeIds.length === 0) return [];

    const regionsMap = new Map<
      string,
      { id: string; name: string; areas: Map<string, { id: string; name: string; plots: Map<string, { id: string; name: string }> }> }
    >();

    scopes.forEach((scope: any) => {
      let rId = "", rName = "", aId = "", aName = "", pId = "", pName = "";

      if (scope.scopeType === "REGION" && scope.region) {
        rId = String(scope.region.id); rName = scope.region.name;
      } else if (scope.scopeType === "AREA" && scope.area) {
        aId = String(scope.area.id); aName = scope.area.name;
        if (scope.area.region) { rId = String(scope.area.region.id); rName = scope.area.region.name; }
      } else if (scope.scopeType === "PLOT" && scope.plot) {
        pId = String(scope.plot.id); pName = scope.plot.name;
        if (scope.plot.area) {
          aId = String(scope.plot.area.id); aName = scope.plot.area.name;
          if (scope.plot.area.region) { rId = String(scope.plot.area.region.id); rName = scope.plot.area.region.name; }
        }
      }

      if (!rId) return;
      if (!regionsMap.has(rId)) regionsMap.set(rId, { id: rId, name: rName || `Vùng trồng ${rId}`, areas: new Map() });
      const regionNode = regionsMap.get(rId)!;
      if (aId) {
        if (!regionNode.areas.has(aId)) regionNode.areas.set(aId, { id: aId, name: aName || `Khu vực ${aId}`, plots: new Map() });
        const areaNode = regionNode.areas.get(aId)!;
        if (pId && !areaNode.plots.has(pId)) areaNode.plots.set(pId, { id: pId, name: pName || `Lô ${pId}` });
      }
    });

    return Array.from(regionsMap.values())
      .filter((r) => {
        const sel = selectedScopeIds.includes(r.id);
        if (sel) return true;
        return Array.from(r.areas.values()).some((a) => {
          if (selectedScopeIds.includes(a.id)) return true;
          return Array.from(a.plots.values()).some((p) => selectedScopeIds.includes(p.id));
        });
      })
      .map((r) => {
        const isRegionSelected = selectedScopeIds.includes(r.id);
        return {
          id: r.id,
          name: r.name,
          level: 3,
          type: "Vùng nuôi",
          isSelected: isRegionSelected,
          areas: Array.from(r.areas.values())
            .filter((a) => {
              if (isRegionSelected) return true;
              if (selectedScopeIds.includes(a.id)) return true;
              return Array.from(a.plots.values()).some((p) => selectedScopeIds.includes(p.id));
            })
            .map((a) => {
              const isAreaSelected = isRegionSelected || selectedScopeIds.includes(a.id);
              return {
                id: a.id,
                name: a.name,
                level: 2,
                type: "Khu vực",
                isSelected: isAreaSelected,
                plots: Array.from(a.plots.values())
                  .filter((p) => isAreaSelected || selectedScopeIds.includes(p.id))
                  .map((p) => ({
                    id: p.id,
                    name: p.name,
                    level: 1,
                    type: "Lô nuôi",
                    isSelected:
                      isAreaSelected || selectedScopeIds.includes(p.id),
                  })),
              };
            }),
        };
      });
  }, [selectedCultivationRegion, selectedScopeIds]);

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
              <div className="text-sm font-semibold text-slate-500 mb-1">Chưa chọn vùng nuôi trồng</div>
              <div className="text-xs text-slate-400">Chọn vùng nuôi trồng để thiết lập vị trí địa lý</div>
            </div>
          </div>
        ) : (
          <>
            {selectedScopeIds.length > 0 && (
              <GeographicalHierarchyDisplay selectedHierarchy={displayHierarchy} />
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
                Vùng nuôi trồng này chưa có dữ liệu vị trí địa lý
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
