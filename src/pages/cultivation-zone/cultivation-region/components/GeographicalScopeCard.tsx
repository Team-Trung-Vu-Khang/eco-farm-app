/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
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
  geographicalUnits: GeographicalUnit[];
  selectedScopeIds: string[];
  onScopeChange: (ids: string[]) => void;
  areasByRegion?: Record<string, GeographicalUnit[]>;
  plotsByArea?: Record<string, GeographicalUnit[]>;
}

export const GeographicalScopeCard = ({
  selectedCultivationRegion,
  geographicalUnits,
  selectedScopeIds,
  onScopeChange,
  areasByRegion: propAreasByRegion,
  plotsByArea: propPlotsByArea,
}: GeographicalScopeCardProps) => {
  // Build parent-relationship maps from API scopes
  const { areasByRegion, plotsByArea } = useMemo(() => {
    if (propAreasByRegion && propPlotsByArea) {
      return { areasByRegion: propAreasByRegion, plotsByArea: propPlotsByArea };
    }

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
      }
    });

    return { areasByRegion: abr, plotsByArea: pba };
  }, [selectedCultivationRegion, propAreasByRegion, propPlotsByArea]);

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
