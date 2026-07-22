/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Beaker, Fish, Layers, User } from "lucide-react";

interface CultivationRegionInfoCardProps {
  selectedCultivationRegion: any;
  manager?: any[];
  farmingMethod?: any;
  irrigationMethod?: any;
  selectedCropsData?: any[];
}

export const CultivationRegionInfoCard = ({
  selectedCultivationRegion,
  manager,
  farmingMethod,
  irrigationMethod,
  selectedCropsData,
}: CultivationRegionInfoCardProps) => {
  const resolvedManagers = manager ?? selectedCultivationRegion?.personnel ?? [];
  const resolvedFarmingMethod =
    farmingMethod ?? selectedCultivationRegion?.farmingMethod ?? null;
  const resolvedIrrigationMethod =
    irrigationMethod ?? selectedCultivationRegion?.irrigationSystem ?? null;
  const resolvedSelectedCropsData =
    selectedCropsData ?? selectedCultivationRegion?.cropVarieties ?? [];

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b py-5 bg-slate-50/80">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Thông tin vùng nuôi trồng
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {!selectedCultivationRegion ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
            <Layers className="w-10 h-10 text-slate-200" />
            <div>
              <div className="text-sm font-semibold text-slate-500 mb-1">
                Chưa chọn vùng nuôi trồng
              </div>
              <div className="text-xs text-slate-400">
                Chọn vùng nuôi trồng bên trái để xem thông tin
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Manager */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 border border-slate-100">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Quản lý
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {resolvedManagers.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {resolvedManagers.map((m: any) => (
                        <Badge
                          key={m.id}
                          variant="outline"
                          className="text-xs py-0.5 px-2 bg-white font-medium border-slate-200"
                        >
                          {m.fullName}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">
                      Chưa phân công
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Farming Method & Irrigation */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 border border-slate-100">
                <Beaker className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Kỹ thuật &amp; Tưới tiêu
                </div>
                <div className="text-base font-semibold text-slate-900">
                  {resolvedFarmingMethod?.name || "Chưa thiết lập"}
                </div>
                {resolvedIrrigationMethod && (
                  <div className="text-xs text-primary font-medium bg-primary/5 px-2 py-0.5 rounded-full inline-block mt-1.5">
                    {resolvedIrrigationMethod.name}
                  </div>
                )}
              </div>
            </div>

            {/* Seed Varieties */}
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Fish className="w-4 h-4 text-cyan-500" />
                Giống thuỷ sản
              </div>
              {resolvedSelectedCropsData.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {resolvedSelectedCropsData.map((c: any) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-cyan-50 overflow-hidden shrink-0 border border-cyan-100 flex items-center justify-center">
                        <Fish className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 mb-0.5">
                          {c.cropVarietyName}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {c.cropVarietyCode && (
                            <span className="text-[10px] font-bold text-primary font-mono uppercase bg-primary/5 px-1.5 py-0.5 rounded">
                              {c.cropVarietyCode}
                            </span>
                          )}
                          {c.cropName && (
                            <span className="text-xs text-slate-500">
                              {c.cropName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-center text-sm text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                  Chưa có thông tin đối tượng nuôi
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
