import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@tankhang1/eco-shared-ui";
import { Beaker, Layers, MapPin, Sprout, User } from "lucide-react";
import { useMemo } from "react";
import { GeographicalHierarchyDisplay } from "./GeographicalHierarchyDisplay";
import { GeographicalScopeModal } from "./GeographicalScopeModal";
import { buildGeographicalTree } from "./GeographicalTree";
import type { GeographicalUnit } from "./GeographicalTree";

interface CultivationAreaInfoCardProps {
  selectedCultivationArea: any;
  geographicalUnits: GeographicalUnit[];
  selectedScopeIds: string[];
  onScopeChange: (ids: string[]) => void;
  manager: any;
  farmingMethod: any;
  irrigationMethod: any;
  selectedCropsData: any[];
  regionStore: any;
}

export const CultivationAreaInfoCard = ({
  selectedCultivationArea,
  geographicalUnits,
  selectedScopeIds,
  onScopeChange,
  manager,
  farmingMethod,
  irrigationMethod,
  selectedCropsData,
  regionStore,
}: CultivationAreaInfoCardProps) => {
  const treeData = useMemo(
    () =>
      buildGeographicalTree(geographicalUnits, selectedScopeIds, regionStore),
    [geographicalUnits, selectedScopeIds, regionStore],
  );

  if (!selectedCultivationArea) return null;

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500 mt-4">
      <CardHeader className="border-b py-4 bg-slate-50/80">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Thông tin vùng canh tác
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Configuration Summary - Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/30">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0 border border-slate-100">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                Quản lý
              </div>
              <div className="text-sm font-semibold text-slate-900 truncate">
                {manager?.fullName || "Chưa phân công"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/30">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0 border border-slate-100">
              <Beaker className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                Kỹ thuật & Tưới tiêu
              </div>
              <div className="text-sm font-semibold text-slate-900 truncate">
                {farmingMethod?.name || "Chưa thiết lập"}
              </div>
              {irrigationMethod && (
                <div className="text-[10px] text-primary font-medium bg-primary/5 px-1.5 py-0.5 rounded-full inline-block mt-1">
                  {irrigationMethod.name}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Geographical Scope Box */}
        <div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <MapPin className="w-3 h-3 text-primary" />
            Vị trí địa lý
          </div>
          {geographicalUnits.length > 0 ? (
            <GeographicalScopeModal
              key={selectedCultivationArea.id}
              selectedScopeIds={selectedScopeIds}
              onSelect={onScopeChange}
              treeData={treeData}
              regionStore={regionStore}
              customTrigger={
                <GeographicalHierarchyDisplay
                  selectedHierarchy={treeData.selectedHierarchy}
                />
              }
            />
          ) : (
            <GeographicalHierarchyDisplay
              selectedHierarchy={treeData.selectedHierarchy}
            />
          )}
        </div>

        {/* Seed Varieties */}
        <div className="pt-2">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Sprout className="w-3 h-3 text-green-500" />
            Giống cây trồng
          </div>
          {selectedCropsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedCropsData.map((c: any) => (
                <div
                  key={c.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                    {c.illustration ? (
                      <img
                        src={
                          typeof c.illustration === "string"
                            ? c.illustration
                            : URL.createObjectURL(c.illustration)
                        }
                        alt={c.varietyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Sprout className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-bold text-primary font-mono uppercase bg-primary/5 px-1 py-0.5 rounded">
                        {c.varietyCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {c.varietyName}
                      </span>
                    </div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 border-green-200 text-green-600 bg-green-50/50"
                      >
                        Nảy mầm: {c.germinationRate}%
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 border-blue-200 text-blue-600 bg-blue-50/50"
                      >
                        Đồng đều: {c.uniformity}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
              Chưa có thông tin giống cây trồng
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
